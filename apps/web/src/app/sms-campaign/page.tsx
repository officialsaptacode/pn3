"use client";

import {
  CircleCheck,
  FileText,
  Loader2,
  LogIn,
  LogOut,
  Send,
  ShieldCheck,
  Smartphone,
  TriangleAlert,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  authApi,
  extractVariables,
  findPhoneColumn,
  type ParsedCsv,
  parseCsvPreview,
  previewMessage,
  type SessionUser,
  smsApi,
  smsSegments,
} from "@/lib/sms";
import { store } from "@/lib/store";
import { cn } from "@/lib/utils";

type Phase = "draft" | "compliance" | "audience" | "launch";

const STEPS: { id: Phase; no: string; title: string; hint: string }[] = [
  {
    id: "draft",
    no: "01",
    title: "Draft template",
    hint: "System 2 polishes it · keeps {variables}",
  },
  {
    id: "compliance",
    no: "02",
    title: "Compliance check",
    hint: "Laya scores spam before you send",
  },
  {
    id: "audience",
    no: "03",
    title: "Audience CSV",
    hint: "Browser → S3 direct · needs phone column",
  },
  { id: "launch", no: "04", title: "Launch campaign", hint: "BullMQ queues at 50 SMS/sec" },
];

function renderWithVars(text: string) {
  const parts = text.split(/(\{\w+\})/g);
  return parts.map((p, i) =>
    /^\{\w+\}$/.test(p) ? (
      <span
        key={i}
        className="rounded bg-teal-100 px-1 font-mono text-[13px] font-semibold text-teal-700"
      >
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export default function SmsCampaignPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loginName, setLoginName] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [tplName, setTplName] = useState("");
  const [content, setContent] = useState(
    "Dear {name}, your payment of Rs. {amount} was due on {due_date}. Pay via eSewa to avoid penalty.",
  );
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [savedContent, setSavedContent] = useState("");
  const [layaScore, setLayaScore] = useState<number | null>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [csv, setCsv] = useState<ParsedCsv | null>(null);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Session rides on httpOnly cookies — probe once, no token in JS.
  useEffect(() => {
    authApi
      .profile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingSession(false));
  }, []);

  // Drafts sent from the template library land here, once.
  useEffect(() => {
    const d = store.takeDraft();
    if (d) {
      setTplName(d.name);
      setContent(d.content);
    }
  }, []);

  const variables = useMemo(
    () => extractVariables(savedContent || content),
    [savedContent, content],
  );
  const { chars, segments } = useMemo(
    () => smsSegments(previewMessage(savedContent || content, csv?.rows[0])),
    [savedContent, content, csv],
  );
  const overLimit = segments > 1;
  const phoneCol = csv ? findPhoneColumn(csv.headers) : null;
  const activeStep: Phase = !templateId
    ? "draft"
    : !isApproved
      ? "compliance"
      : !csvUrl
        ? "audience"
        : "launch";

  const fail = (msg: string) => setError(msg);

  const doSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim() || !loginPass) return fail("Enter your username and password.");
    setBusy("login");
    setError(null);
    try {
      await authApi.signin(loginName.trim(), loginPass);
      setLoginPass("");
      setUser(await authApi.profile());
    } catch (err) {
      fail(err instanceof Error ? err.message : "Sign-in failed");
    }
    setBusy(null);
  };

  const doSignout = async () => {
    setBusy("logout");
    try {
      await authApi.signout();
    } catch {
      /* cookie may already be gone */
    }
    setUser(null);
    setBusy(null);
  };

  const doCreate = async () => {
    if (!user) return fail("Sign in first — the API is guarded by AtGuard.");
    if (tplName.trim().length < 3) return fail("Give the template a name (min 3 chars).");
    if (content.trim().length < 10) return fail("Template content is too short.");
    setBusy("tpl");
    setError(null);
    try {
      const t = await smsApi.createTemplate(tplName.trim(), content.trim());
      setTemplateId(t.id);
      setSavedContent(t.content);
      setIsApproved(false);
      setLayaScore(null);
      store.upsertTemplate({
        id: t.id,
        name: t.name,
        content: t.content,
        isApproved: false,
        layaScore: null,
        at: Date.now(),
      });
    } catch (e) {
      fail(e instanceof Error ? e.message : "Template save failed");
    }
    setBusy(null);
  };

  const doEvaluate = async () => {
    if (templateId == null) return;
    setBusy("eval");
    setError(null);
    try {
      const r = await smsApi.evaluateTemplate(templateId);
      setLayaScore(r.layaScore);
      setIsApproved(r.isApproved);
      store.upsertTemplate({
        id: templateId,
        name: tplName.trim(),
        content: savedContent,
        isApproved: r.isApproved,
        layaScore: r.layaScore,
        at: Date.now(),
      });
    } catch (e) {
      fail(e instanceof Error ? e.message : "Compliance check failed");
    }
    setBusy(null);
  };

  const onPickFile = async (f: File | null) => {
    if (!f) return;
    if (!f.name.toLowerCase().endsWith(".csv"))
      return fail("Only .csv files — the queue parser expects comma headers.");
    if (f.size > 25 * 1024 * 1024) return fail("CSV over 25 MB — split it into two campaigns.");
    setBusy("csv");
    setError(null);
    try {
      const text = await f.text();
      const parsed = parseCsvPreview(text, 5);
      if (parsed.headers.length === 0) throw new Error("Empty CSV — first row must be headers.");
      if (!findPhoneColumn(parsed.headers)) {
        throw new Error(
          `No phone column found (${parsed.headers.join(", ")}). Add phone / phoneNumber / phone_number.`,
        );
      }
      const missing = variables.filter((v) => !parsed.headers.includes(v) && v !== "phone");
      setCsv(parsed);
      setCsvFileName(f.name);
      // Direct browser → S3, bypasses Next.js payload limits
      const pre = await smsApi.presignedUrl(f.name, f.type || "text/csv");
      await smsApi.uploadToS3(pre.url, f);
      setCsvUrl(pre.fullUrl);
      if (missing.length > 0)
        setError(`Heads up: CSV lacks {${missing.join("}, {")}} — those will send unfilled.`);
    } catch (e) {
      fail(e instanceof Error ? e.message : "CSV upload failed");
    }
    setBusy(null);
  };

  const doLaunch = async () => {
    if (templateId == null || !isApproved || !csvUrl)
      return fail("Finish template, approval and CSV first.");
    const name = campaignName.trim() || `${tplName} Campaign`;
    setBusy("send");
    setError(null);
    try {
      const c = await smsApi.createCampaign(name, templateId, csvUrl);
      store.pushHistory({ id: c.id, name: c.name, at: Date.now() });
      router.push(
        `/sms-campaign/success?id=${c.id}&name=${encodeURIComponent(c.name)}&rows=${csv?.rows.length ?? ""}`,
      );
    } catch (e) {
      fail(e instanceof Error ? e.message : "Campaign launch failed");
    }
    setBusy(null);
  };

  const stepIndex = STEPS.findIndex((s) => s.id === activeStep);

  return (
    <div className="ledger-paper min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Header */}
        <header className="mb-8 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            <span className="inline-block h-px w-8 bg-ledger-500" aria-hidden />
            Campaign studio
          </p>
          <h1 className="font-sans text-3xl font-extrabold leading-tight text-ink-900 md:text-5xl">
            Four entries, <span className="text-teal-600">then send.</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-700">
            Variables like{" "}
            <code className="rounded bg-paper-200 px-1 font-mono text-[13px]">{"{name}"}</code> map
            from your CSV headers — or{" "}
            <Link
              href="/templates"
              className="font-semibold text-teal-700 underline underline-offset-2"
            >
              start from a saved template
            </Link>
            .
          </p>
          {checkingSession ? (
            <p className="mt-5 font-mono text-xs text-ink-500">Checking session…</p>
          ) : user ? (
            <div className="mt-5 flex max-w-md items-center justify-between gap-3 rounded-xl border border-paper-300 bg-paper-50 px-3 py-2 shadow-sm">
              <p className="truncate text-sm">
                Signed in as <strong>{user.email}</strong>
              </p>
              <button
                onClick={doSignout}
                disabled={busy === "logout"}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 enabled:hover:text-stamp-600"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden />
                {busy === "logout" ? "…" : "Sign out"}
              </button>
            </div>
          ) : (
            <form
              onSubmit={doSignin}
              className="mt-5 max-w-md space-y-2 rounded-xl border border-paper-300 bg-paper-50 p-3 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-700">
                Sign in to use the guarded API
              </p>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="login-name">
                  Username or email
                </label>
                <input
                  id="login-name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="Username or email"
                  autoComplete="username"
                  className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                <label className="sr-only" htmlFor="login-pass">
                  Password
                </label>
                <input
                  id="login-pass"
                  type="password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                />
                <button
                  type="submit"
                  disabled={busy === "login"}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-ink-950 disabled:opacity-50"
                >
                  {busy === "login" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <LogIn className="h-4 w-4" aria-hidden />
                  )}
                  Sign in
                </button>
              </div>
            </form>
          )}
        </header>

        {/* Progress strip */}
        <nav aria-label="Campaign progress" className="mb-10">
          <ol className="flex items-center gap-0">
            {STEPS.map((s, i) => {
              const done = i < stepIndex;
              const current = s.id === activeStep;
              return (
                <li
                  key={s.id}
                  className="flex min-w-0 flex-1 items-center last:flex-none"
                  aria-current={current ? "step" : undefined}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      aria-hidden
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] font-bold",
                        done
                          ? "border-teal-600 bg-teal-600 text-white"
                          : current
                            ? "border-ink-900 bg-ink-900 text-white"
                            : "border-paper-300 bg-paper-50 text-ink-500",
                      )}
                    >
                      {done ? "✓" : s.no}
                    </span>
                    <span
                      className={cn(
                        "hidden truncate text-xs font-semibold sm:block",
                        current || done ? "text-ink-900" : "text-ink-500",
                      )}
                    >
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className={cn(
                        "mx-2 h-px flex-1 sm:mx-3",
                        i < stepIndex ? "bg-teal-600" : "bg-paper-300",
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-stamp-600/30 bg-stamp-50 px-4 py-3 text-sm text-ink-900"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-stamp-600" aria-hidden />
            <p>{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left: ledger steps */}
          <ol
            className="relative space-y-6 before:absolute before:bottom-6 before:left-[22px] before:top-6 before:w-px before:bg-paper-300"
            aria-label="Campaign steps"
          >
            {STEPS.map((s, i) => {
              const done = i < stepIndex;
              const current = s.id === activeStep;
              return (
                <li key={s.id} className="relative pl-14">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-xs font-bold",
                      done
                        ? "border-teal-600 bg-teal-600 text-white"
                        : current
                          ? "border-ink-900 bg-ink-900 text-white"
                          : "border-paper-300 bg-paper-50 text-ink-500",
                    )}
                  >
                    {done ? "✓" : s.no}
                  </span>

                  {/* 01 Draft */}
                  {s.id === "draft" && (
                    <section
                      aria-label="Draft template"
                      className={cn(
                        "rounded-2xl border bg-paper-50 p-5 shadow-sm md:p-6",
                        current ? "border-ink-900" : "border-paper-300",
                      )}
                    >
                      <h2 className="font-sans text-lg font-bold text-ink-900">
                        01 · Draft template
                      </h2>
                      <p className="mb-4 text-sm text-ink-500">{s.hint}</p>
                      <label className="mb-3 block">
                        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-700">
                          Template name
                        </span>
                        <input
                          value={tplName}
                          onChange={(e) => setTplName(e.target.value)}
                          placeholder="Overdue Payment Notice"
                          className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-ink-700">
                          Content
                          <span
                            className={cn(
                              "font-mono normal-case",
                              chars > 160 ? "text-stamp-600" : "text-ink-500",
                            )}
                          >
                            {content.length}/160
                          </span>
                        </span>
                        <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          rows={4}
                          placeholder="Dear {name}, your due amount is {amount}."
                          className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 font-mono text-sm leading-relaxed outline-none focus:border-teal-600"
                        />
                      </label>
                      {variables.length > 0 && (
                        <p className="mt-2 text-xs text-ink-500">
                          Detected variables:{" "}
                          {variables.map((v) => (
                            <code
                              key={v}
                              className="mr-1 rounded bg-teal-50 px-1 font-mono text-teal-700"
                            >{`{${v}}`}</code>
                          ))}
                        </p>
                      )}
                      <button
                        onClick={doCreate}
                        disabled={busy === "tpl"}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-ink-950 disabled:opacity-50"
                      >
                        {busy === "tpl" ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <FileText className="h-4 w-4" aria-hidden />
                        )}
                        {templateId ? "Re-save template" : "Save & enhance with AI"}
                      </button>
                      {templateId && (
                        <p className="mt-2 font-mono text-xs text-teal-700">
                          Saved · id {templateId} — AI-enhanced text is in the phone preview →
                        </p>
                      )}
                    </section>
                  )}

                  {/* 02 Compliance */}
                  {s.id === "compliance" && (
                    <section
                      aria-label="Compliance check"
                      className={cn(
                        "rounded-2xl border bg-paper-50 p-5 shadow-sm md:p-6",
                        current ? "border-ink-900" : "border-paper-300",
                        !templateId && "opacity-60",
                      )}
                    >
                      <h2 className="font-sans text-lg font-bold text-ink-900">
                        02 · Compliance check
                      </h2>
                      <p className="mb-4 text-sm text-ink-500">
                        {s.hint} · approval is mandatory before sending.
                      </p>
                      {!templateId ? (
                        <p className="text-sm text-ink-500">
                          Save a template first — Laya needs wording to score.
                        </p>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4">
                          <button
                            onClick={doEvaluate}
                            disabled={busy === "eval"}
                            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-teal-700 disabled:opacity-50"
                          >
                            {busy === "eval" ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : (
                              <ShieldCheck className="h-4 w-4" aria-hidden />
                            )}
                            Evaluate with Laya
                          </button>
                          {layaScore != null && (
                            <span
                              className={cn(
                                "stamp rounded px-3 py-1 font-mono text-sm font-extrabold uppercase tracking-widest",
                                isApproved ? "text-teal-600" : "text-stamp-600",
                              )}
                            >
                              {isApproved
                                ? `✓ Approved · ${layaScore.toFixed(2)}`
                                : `✕ Blocked · ${layaScore.toFixed(2)}`}
                            </span>
                          )}
                        </div>
                      )}
                      {layaScore != null && !isApproved && (
                        <p className="mt-3 text-sm text-stamp-600">
                          Blocked as spam/compliance risk. Edit the wording and re-save — a new
                          template id restarts the check.
                        </p>
                      )}
                    </section>
                  )}

                  {/* 03 Audience */}
                  {s.id === "audience" && (
                    <section
                      aria-label="Audience CSV"
                      className={cn(
                        "rounded-2xl border bg-paper-50 p-5 shadow-sm md:p-6",
                        current ? "border-ink-900" : "border-paper-300",
                        !isApproved && "opacity-60",
                      )}
                    >
                      <h2 className="font-sans text-lg font-bold text-ink-900">
                        03 · Audience CSV
                      </h2>
                      <p className="mb-4 text-sm text-ink-500">{s.hint}</p>
                      {!isApproved ? (
                        <p className="text-sm text-ink-500">
                          Unlocks with an Approved stamp — the queue only sends vetted wording.
                        </p>
                      ) : (
                        <>
                          <button
                            onClick={() => fileRef.current?.click()}
                            disabled={busy === "csv"}
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-paper-300 bg-white px-4 py-3 text-sm font-semibold text-ink-900 enabled:hover:border-teal-600 disabled:opacity-50"
                          >
                            {busy === "csv" ? (
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                            ) : (
                              <Upload className="h-4 w-4" aria-hidden />
                            )}
                            {csvFileName || "Choose contacts.csv"}
                          </button>
                          <input
                            ref={fileRef}
                            type="file"
                            accept=".csv"
                            className="sr-only"
                            onChange={(e) => {
                              onPickFile(e.target.files?.[0] ?? null);
                              e.target.value = "";
                            }}
                          />
                        </>
                      )}
                      {csv && (
                        <div className="mt-4 overflow-x-auto rounded-lg border border-paper-300 bg-white">
                          <table className="w-full min-w-[420px] text-left font-mono text-xs">
                            <thead>
                              <tr className="border-b border-paper-300 bg-paper-100">
                                {csv.headers.map((h) => (
                                  <th
                                    key={h}
                                    className={cn(
                                      "px-3 py-2 font-semibold",
                                      h === phoneCol ? "text-teal-700" : "text-ink-700",
                                    )}
                                  >
                                    {h}
                                    {h === phoneCol ? " ★" : ""}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {csv.rows.map((r, i) => (
                                <tr key={i} className="border-b border-paper-200 last:border-0">
                                  {csv.headers.map((h) => (
                                    <td key={h} className="px-3 py-1.5 text-ink-700">
                                      {r[h]}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="border-t border-paper-200 bg-paper-100 px-3 py-2 text-[11px] text-ink-500">
                            Preview of first {csv.rows.length} rows · phone column{" "}
                            <strong>{phoneCol}</strong> · full file streams to S3, never through
                            Next.js.
                          </p>
                        </div>
                      )}
                    </section>
                  )}

                  {/* 04 Launch */}
                  {s.id === "launch" && (
                    <section
                      aria-label="Launch campaign"
                      className={cn(
                        "rounded-2xl border bg-ink-900 p-5 text-white shadow-sm md:p-6",
                        current ? "border-ink-900" : "border-paper-300",
                        (!isApproved || !csvUrl) && "opacity-60",
                      )}
                    >
                      <h2 className="font-sans text-lg font-bold">04 · Launch campaign</h2>
                      <p className="mb-4 text-sm text-white/70">
                        {s.hint} · interpolation is local string replace, no AI per row.
                      </p>
                      <label className="block">
                        <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
                          Campaign name
                        </span>
                        <input
                          value={campaignName}
                          onChange={(e) => setCampaignName(e.target.value)}
                          placeholder={`${tplName || "October Overdue"} Campaign`}
                          className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-ledger-500"
                        />
                      </label>
                      <button
                        onClick={doLaunch}
                        disabled={busy === "send" || !isApproved || !csvUrl}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ledger-500 px-4 py-3 text-sm font-bold text-ink-950 enabled:hover:brightness-110 disabled:opacity-40"
                      >
                        {busy === "send" ? (
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        ) : (
                          <Send className="h-4 w-4" aria-hidden />
                        )}
                        {busy === "send" ? "Queueing…" : "Send campaign"}
                      </button>
                      {(!isApproved || !csvUrl) && (
                        <p className="mt-2 text-xs text-white/60">
                          Unlocks after approval + S3 upload.
                        </p>
                      )}
                    </section>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Right: sticky live ledger */}
          <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start" aria-label="Live preview">
            <div className="rounded-2xl border border-ink-900 bg-paper-50 p-5 shadow-sm">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <Smartphone className="h-4 w-4" aria-hidden /> Live SMS preview
              </p>
              <div className="rounded-2xl rounded-tl-sm border border-paper-300 bg-white p-4 text-sm leading-relaxed text-ink-900 shadow-inner">
                {renderWithVars(previewMessage(savedContent || content, csv?.rows[0]))}
              </div>
              <div className="mt-3 flex items-center justify-between font-mono text-xs">
                <span className={chars > 160 ? "font-bold text-stamp-600" : "text-ink-500"}>
                  {chars}/160 · {segments} SMS
                </span>
                {overLimit ? (
                  <span className="text-stamp-600">multipart — trim to save cost</span>
                ) : (
                  <span className="text-teal-700">single segment ✓</span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-paper-300 bg-paper-50 p-5 shadow-sm">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                Compliance ledger
              </p>
              <div aria-live="polite">
                {layaScore == null ? (
                  <p className="text-sm text-ink-500">
                    Not yet evaluated. Laya returns a spam score — under 0.5 approves.
                  </p>
                ) : (
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "stamp rounded px-3 py-1 font-mono text-sm font-extrabold uppercase tracking-widest",
                        isApproved ? "text-teal-600" : "text-stamp-600",
                      )}
                    >
                      {isApproved ? "Approved" : "Blocked"}
                    </span>
                    <span className="font-mono text-sm text-ink-700">
                      score {layaScore.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
              <dl className="mt-4 space-y-1.5 border-t border-paper-300 pt-3 font-mono text-xs text-ink-700">
                <div className="flex justify-between">
                  <dt>Template</dt>
                  <dd className="flex items-center gap-1">
                    {templateId ? (
                      <>
                        <CircleCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden /> #
                        {templateId}
                      </>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>CSV on S3</dt>
                  <dd className="max-w-[180px] truncate">{csvUrl ? "uploaded ✓" : "—"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Queue</dt>
                  <dd>BullMQ · 50/sec</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Gateway</dt>
                  <dd>AkashSMS {process.env.NEXT_PUBLIC_DRY_RUN ? "(dry-run)" : ""}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

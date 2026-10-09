"use client";

import { Check, Copy, PenLine, Search, Stamp } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractVariables } from "@/lib/sms";
import { type StoredTemplate, store } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState<string | number | null>(null);
  const [items] = useState<StoredTemplate[]>(() =>
    typeof window === "undefined" ? [] : store.templates(),
  );

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(
      (t) => t.name.toLowerCase().includes(needle) || t.content.toLowerCase().includes(needle),
    );
  }, [q, items]);

  const sendToStudio = (t: StoredTemplate) => {
    store.saveDraft({ name: t.sample ? `${t.name} (copy)` : t.name, content: t.content });
    router.push("/sms-campaign");
  };

  const copy = async (t: StoredTemplate) => {
    try {
      await navigator.clipboard.writeText(t.content);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = t.content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(t.id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="ledger-paper min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <header className="mb-8">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            <span className="inline-block h-px w-8 bg-ledger-500" aria-hidden />
            Template library
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-sans text-3xl font-extrabold md:text-4xl">
              Wording worth <span className="text-teal-600">reusing.</span>
            </h1>
            <Link
              href="/sms-campaign"
              className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-ink-950"
            >
              <PenLine className="h-4 w-4" aria-hidden /> Draft new
            </Link>
          </div>
          <label className="mt-5 flex max-w-md items-center gap-2 rounded-xl border border-paper-300 bg-paper-50 px-3 py-2 shadow-sm focus-within:border-teal-600">
            <Search className="h-4 w-4 shrink-0 text-ink-500" aria-hidden />
            <span className="sr-only">Search templates</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or wording…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-500/60"
            />
          </label>
        </header>

        {shown.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-paper-300 bg-paper-50 p-10 text-center">
            <p className="font-sans text-lg font-bold">No template matches “{q}”.</p>
            <p className="mt-1 text-sm text-ink-500">
              Clear the search — or draft the wording in the studio and it lands here.
            </p>
            <Link
              href="/sms-campaign"
              className="mt-4 inline-block rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Open the studio
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {shown.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-paper-300 bg-paper-50 p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-sans text-base font-bold">
                    {t.name}
                    {t.sample && (
                      <span className="ml-2 rounded bg-paper-200 px-1.5 py-0.5 font-mono text-[11px] font-semibold uppercase text-ink-500">
                        starter
                      </span>
                    )}
                  </h2>
                  <span
                    className={cn(
                      "stamp rounded px-2 py-0.5 font-mono text-xs font-extrabold uppercase tracking-widest",
                      t.isApproved ? "text-teal-600" : "text-stamp-600",
                    )}
                  >
                    {t.isApproved ? "Approved" : t.layaScore == null ? "Unchecked" : "Blocked"}
                  </span>
                </div>
                <p className="mt-2 font-mono text-sm leading-relaxed text-ink-700">{t.content}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-ink-500">
                    {extractVariables(t.content).map((v) => (
                      <code
                        key={v}
                        className="mr-1 rounded bg-teal-50 px-1 font-mono text-teal-700"
                      >{`{${v}}`}</code>
                    ))}
                    {t.layaScore != null && (
                      <span className="ml-1 font-mono">score {t.layaScore.toFixed(2)}</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copy(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-paper-300 bg-white px-3 py-1.5 text-xs font-semibold enabled:hover:border-teal-600"
                    >
                      {copied === t.id ? (
                        <Check className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {copied === t.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => sendToStudio(t)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-white enabled:hover:bg-ink-950"
                    >
                      <Stamp className="h-3.5 w-3.5" aria-hidden /> Use in studio
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 font-mono text-xs text-ink-500">
          Saved on this device · starters are examples — approve your own wording in the studio
          before sending.
        </p>
      </div>
    </div>
  );
}

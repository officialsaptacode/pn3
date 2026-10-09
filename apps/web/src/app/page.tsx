import Link from "next/link";
import { ShieldCheck, Zap, FileCheck2, ArrowRight, LibraryBig, Activity } from "lucide-react";
import { DemoBubble } from "./demo-bubble";

const STEPS = [
  {
    no: "01",
    icon: FileCheck2,
    title: "Draft once with AI",
    body: "Write a rough reminder. System 2 polishes it to a polite 160-character template and keeps your {variables} intact.",
  },
  {
    no: "02",
    icon: ShieldCheck,
    title: "Pass Laya compliance",
    body: "System 1 scores the template for spam and compliance risk. Under 0.5 gets the stamp — blocked templates never send.",
  },
  {
    no: "03",
    icon: Zap,
    title: "Drop a CSV, we queue it",
    body: "Upload contacts straight to S3 from your browser. BullMQ interpolates rows and fires to AkashSMS at 50 SMS per second.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="ledger-paper">
      {/* Hero — the thesis you can touch */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              <span className="inline-block h-px w-8 bg-ledger-500" aria-hidden />
              Micro-finance SMS wrapper · AkashSMS pipe
            </p>
            <h1 className="font-sans text-4xl font-extrabold leading-[1.15] md:text-6xl">
              Type a name. <span className="text-teal-600">Watch it become SMS.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-700">
              That bubble is the whole product: your CSV row, interpolated deterministically —
              zero AI per row, zero hallucinated loan amounts. The studio adds drafting, compliance,
              and the queue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sms-campaign"
                className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-950"
              >
                Start a campaign
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-lg border border-paper-300 bg-paper-50 px-6 py-3 text-sm font-bold text-ink-900 hover:border-teal-600"
              >
                <LibraryBig className="h-4 w-4" aria-hidden />
                Browse templates
              </Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-paper-300 pt-6">
              {[
                { k: "per second", v: "50 SMS" },
                { k: "per template", v: "160 chars" },
                { k: "AI per row", v: "0 — never" },
              ].map((s) => (
                <div key={s.v} className="flex flex-col">
                  <dt className="order-2 mt-1 text-xs text-ink-500">{s.k}</dt>
                  <dd className="font-mono text-xl font-extrabold text-ink-900 md:text-2xl">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <DemoBubble />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-paper-300 bg-paper-50">
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <h2 className="font-sans text-2xl font-extrabold md:text-3xl">Three entries in the ledger.</h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-500">
            One AI pass per campaign, one compliance gate, then pure string interpolation at queue
            speed.
          </p>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.no} className="rounded-2xl border border-paper-300 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <s.icon className="h-6 w-6 text-teal-600" aria-hidden />
                  <span className="font-mono text-xs font-bold text-ink-500">{s.no}</span>
                </div>
                <h3 className="mt-4 font-sans text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            <Link
              href="/activity"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline underline-offset-2"
            >
              <Activity className="h-4 w-4" aria-hidden />
              See the launch ledger
            </Link>
          </p>
        </div>
      </section>

      {/* Compliance band */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-ink-900 p-8 text-white md:flex-row md:items-center md:p-10">
          <span
            aria-hidden
            className="stamp rounded px-4 py-1.5 font-mono text-sm font-extrabold uppercase tracking-[0.2em] text-teal-100"
          >
            ✓ Approved
          </span>
          <div className="flex-grow">
            <h2 className="font-sans text-xl font-extrabold md:text-2xl">
              Compliance over creativity.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              A wrong loan amount in a reminder destroys trust. That&apos;s why AI drafts the
              template once — and deterministic code fills every row. Hallucination surface: zero.
            </p>
          </div>
          <Link
            href="/sms-campaign"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ledger-500 px-6 py-3 text-sm font-bold text-ink-950 hover:brightness-110"
          >
            Try the studio
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}

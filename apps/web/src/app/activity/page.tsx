"use client";

import { Inbox, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { type HistoryEntry, store } from "@/lib/store";

function fmtTime(at: number): string {
  try {
    return new Date(at).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function ActivityPage() {
  const [items] = useState<HistoryEntry[]>(() =>
    typeof window === "undefined" ? [] : store.history(),
  );

  return (
    <div className="ledger-paper min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <header className="mb-8">
          <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            <span className="inline-block h-px w-8 bg-ledger-500" aria-hidden />
            Launch ledger
          </p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h1 className="font-sans text-3xl font-extrabold md:text-4xl">
              Every send, <span className="text-teal-600">on record.</span>
            </h1>
            <Link
              href="/sms-campaign"
              className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white enabled:hover:bg-ink-950"
            >
              <Send className="h-4 w-4" aria-hidden /> New campaign
            </Link>
          </div>
          <p className="mt-3 max-w-xl text-sm text-ink-500">
            Launches from this device, newest first. Per-message delivery lives in the backend queue
            — this is your paper trail.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-paper-300 bg-paper-50 p-10 text-center">
            <Inbox className="mx-auto h-8 w-8 text-ink-500" aria-hidden />
            <p className="mt-3 font-sans text-lg font-bold">No launches yet.</p>
            <p className="mt-1 text-sm text-ink-500">
              Draft a template, pass compliance, drop a CSV — your first entry lands here.
            </p>
            <Link
              href="/sms-campaign"
              className="mt-4 inline-block rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Open the studio
            </Link>
          </div>
        ) : (
          <ol className="overflow-hidden rounded-2xl border border-paper-300 bg-paper-50 shadow-sm">
            {items.map((h, i) => (
              <li
                key={`${h.id}-${h.at}-${i}`}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-200 px-5 py-4 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-[15px] font-bold">{h.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-500">
                    campaign #{h.id} · launched {fmtTime(h.at)}
                  </p>
                </div>
                <span className="stamp rounded px-2 py-0.5 font-mono text-xs font-extrabold uppercase tracking-widest text-teal-600">
                  ✓ Queued
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

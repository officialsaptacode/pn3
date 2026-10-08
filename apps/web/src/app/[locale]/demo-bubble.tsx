"use client";

import { useState } from "react";
import { smsSegments } from "@/lib/sms";
import { cn } from "@/lib/utils";

const TEMPLATE =
  "Dear {name}, your payment of Rs. {amount} was due on {due_date}. Pay via eSewa to avoid penalty.";

/** The product thesis you can touch: CSV row in, SMS out — no AI per row. */
export function DemoBubble({ locale }: { locale: string }) {
  const isEn = locale === "en";
  const [name, setName] = useState("Sita Sharma");
  const [amount, setAmount] = useState("4,500");

  const message = TEMPLATE.replace("{name}", name.trim() || "{name}")
    .replace("{amount}", amount.trim() || "{amount}")
    .replace("{due_date}", "Oct 30");
  const { chars, segments } = smsSegments(message);

  return (
    <div className="rounded-2xl border border-ink-900 bg-paper-50 p-5 shadow-sm md:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-500">
            {isEn ? "CSV → {name}" : "CSV → {name}"}
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600"
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[11px] font-semibold uppercase tracking-widest text-ink-500">
            {isEn ? "CSV → {amount}" : "CSV → {amount}"}
          </span>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-lg border border-paper-300 bg-white px-3 py-2 font-mono text-sm outline-none focus:border-teal-600"
          />
        </label>
      </div>
      <div className="mt-4 rounded-2xl rounded-tl-sm border border-paper-300 bg-white p-4 text-sm leading-relaxed shadow-inner">
        {message}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
        <span className={chars > 160 ? "font-bold text-stamp-600" : "text-ink-500"}>
          {chars}/160 · {segments} {isEn ? "SMS" : "SMS"}
        </span>
        <span
          className={cn(
            "stamp rounded px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-widest",
            "text-teal-600",
          )}
        >
          {isEn ? "✓ Sample — not sent" : "✓ नमुना — पठाइएको होइन"}
        </span>
      </div>
    </div>
  );
}

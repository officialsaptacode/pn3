import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_Devanagari, Mukta, JetBrains_Mono } from "next/font/google";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-devanagari",
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mukta",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "SaptaSMS — Compliant bulk SMS for micro-finance",
  description:
    "Draft loan-reminder templates with AI, pass Laya compliance, and send bulk SMS via AkashSMS at 50 messages per second.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansDevanagari.variable} ${mukta.variable} ${jetBrainsMono.variable} font-sans antialiased min-h-screen flex flex-col bg-paper-100 text-ink-900`}
      >
        <header className="sticky top-0 z-40 border-b border-paper-300 bg-paper-50/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
            <Link href="/" className="flex items-center gap-2.5" aria-label="SaptaSMS home">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 font-mono text-sm font-extrabold text-ledger-500"
              >
                S
              </span>
              <span className="font-sans text-lg font-extrabold tracking-tight">
                Sapta<span className="text-teal-600">SMS</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold" aria-label="Product">
              <Link
                href="/templates"
                className="hidden rounded-lg px-3 py-2 text-ink-700 hover:bg-paper-200 sm:block"
              >
                Templates
              </Link>
              <Link
                href="/activity"
                className="hidden rounded-lg px-3 py-2 text-ink-700 hover:bg-paper-200 sm:block"
              >
                Activity
              </Link>
              <Link
                href="/sms-campaign"
                className="rounded-lg bg-ink-900 px-4 py-2 text-white hover:bg-ink-950"
              >
                New campaign
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow">{children}</main>
        <footer className="border-t border-paper-300 bg-paper-50">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              <strong className="text-ink-900">SaptaSMS</strong> · compliant bulk SMS for
              micro-finance · AkashSMS
            </p>
            <p className="font-mono text-xs">AI drafts · Laya approves · BullMQ sends</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

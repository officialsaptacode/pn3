import type React from "react";
import "../globals.css";
import type { Metadata } from "next";
import { JetBrains_Mono, Mukta, Noto_Sans_Devanagari } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";

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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const isEn = locale === "en";
  const otherLocale = isEn ? "ne" : "en";

  return (
    <html lang={locale}>
      <body
        className={`${notoSansDevanagari.variable} ${mukta.variable} ${jetBrainsMono.variable} font-sans antialiased min-h-screen flex flex-col bg-paper-100 text-ink-900`}
      >
        <NextIntlClientProvider messages={messages}>
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
                  {isEn ? "Templates" : "टेम्प्लेट"}
                </Link>
                <Link
                  href="/activity"
                  className="hidden rounded-lg px-3 py-2 text-ink-700 hover:bg-paper-200 sm:block"
                >
                  {isEn ? "Activity" : "गतिविधि"}
                </Link>
                <Link
                  href="/"
                  locale={otherLocale}
                  className="rounded-lg px-3 py-2 font-mono text-xs font-bold uppercase text-ink-500 hover:bg-paper-200"
                >
                  {isEn ? "ने" : "EN"}
                </Link>
                <Link
                  href="/sms-campaign"
                  className="rounded-lg bg-ink-900 px-4 py-2 text-white hover:bg-ink-950"
                >
                  {isEn ? "New campaign" : "नयाँ अभियान"}
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="border-t border-paper-300 bg-paper-50">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                <strong className="text-ink-900">SaptaSMS</strong> ·{" "}
                {isEn ? "compliant bulk SMS for micro-finance" : "लघुवित्तका लागि अनुपालन बल्क SMS"} ·
                AkashSMS
              </p>
              <p className="font-mono text-xs">
                {isEn
                  ? "AI drafts · Laya approves · BullMQ sends"
                  : "AI मस्यौदा · Laya स्वीकृति · BullMQ प्रेषण"}
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

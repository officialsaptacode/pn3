import type React from "react";
import "@workspace/ui/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Noto_Sans_Devanagari, Mukta, JetBrains_Mono } from 'next/font/google';
import Navbar from "@/components/navbar";
import { TickerWrapper } from "@/components/ticker-wrapper";
import { NepseScroller } from "@/components/nepse-scroller";
import { SiteFooter } from "@/components/site-footer";

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-devanagari',
});

const mukta = Mukta({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-mukta',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: "गोर्खा दैनिक | Gorkha Daily News",
  description: "गोर्खाको आवाज, नेपालको खबर। Gorkha Daily, Nepalese News Portal.",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${notoSansDevanagari.variable} ${mukta.variable} ${jetBrainsMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <TickerWrapper />
          <NepseScroller />
          <main className="flex-grow">
            {children}
          </main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


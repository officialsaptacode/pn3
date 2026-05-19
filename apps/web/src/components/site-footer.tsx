"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Facebook, Youtube, Twitter, Mail, Phone, MapPin } from "lucide-react";

export function SiteFooter() {
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");

  const newsLinks = [
    { key: "gorkha", href: "/category/gorkha" },
    { key: "gandaki", href: "/category/gandaki" },
    { key: "national", href: "/category/national" },
    { key: "sports", href: "/category/sports" },
    { key: "video", href: "/video" },
  ];

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-900 py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 pb-10 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-1.5 no-underline">
              <span className="text-2xl font-extrabold tracking-tight text-primary font-mukta select-none">
                गोर्खा <span className="text-white">दैनिक</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm font-mukta">
              {tc("tagline")}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-zinc-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-zinc-300"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full bg-zinc-900 hover:bg-primary hover:text-white flex items-center justify-center transition-colors text-zinc-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold tracking-wider text-white uppercase font-mukta">
              {t("news")}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {newsLinks.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-primary transition-colors no-underline flex items-center gap-1 font-medium"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold tracking-wider text-white uppercase font-mukta">
              {tc("contact")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{tc("address")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:gorkhadainik99@gmail.com" className="hover:text-primary transition-colors">
                  gorkhadainik99@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+9779846098073" className="hover:text-primary transition-colors font-mono">
                  +९७७ ९८४६०९८०७३
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-zinc-500 font-medium order-2 md:order-1">
            {tc("copyright")}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-zinc-400 order-1 md:order-2">
            <Link href="/policy/press" className="hover:text-primary transition-colors">
              {tc("pressPolicy")}
            </Link>
            <Link href="/policy/privacy" className="hover:text-primary transition-colors">
              {tc("privacy")}
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              {t("about")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

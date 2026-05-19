"use client";

import * as React from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { X, Search, Home, ChevronRight } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export function MobileDrawer({ isOpen, onClose, locale }: MobileDrawerProps) {
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  // Close drawer on escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const primaryNavItems = [
    { key: "home", href: "/", icon: Home },
    { key: "gorkha", href: "/category/gorkha" },
    { key: "gandaki", href: "/category/gandaki" },
    { key: "national", href: "/category/national" },
    { key: "sports", href: "/category/sports" },
    { key: "business", href: "/category/business" },
    { key: "video", href: "/video" },
  ];

  const secondaryNavItems = [
    { key: "opinion", href: "/category/opinion" },
    { key: "entertainment", href: "/category/entertainment" },
    { key: "technology", href: "/category/technology" },
    { key: "diaspora", href: "/category/diaspora" },
    { key: "about", href: "/about" },
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[290px] max-w-[85vw] bg-background border-r border-border shadow-2xl transition-transform duration-300 ease-out flex flex-col md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <Link href="/" onClick={onClose} className="flex items-center gap-1.5 no-underline">
            <span className="text-xl font-extrabold tracking-tight text-primary font-mukta">
              गोर्खा <span className="text-foreground">दैनिक</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tc("searchPlaceholder")}
              className="w-full h-10 pl-3 pr-10 rounded-md border border-input bg-muted/50 focus:bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Primary Navigation Section */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-2 mb-1">
              {locale === "ne" ? "मुख्य खण्डहरू" : "MAIN SECTIONS"}
            </div>
            <nav className="flex flex-col gap-1">
              {primaryNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
                      {t(item.key)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:text-primary -translate-x-1 group-hover:translate-x-0 transition-all" />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Secondary Navigation Section */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-2 mb-1">
              {locale === "ne" ? "अन्य खण्डहरू" : "OTHER SECTIONS"}
            </div>
            <nav className="flex flex-col gap-1">
              {secondaryNavItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium hover:bg-primary/5 hover:text-primary transition-all group"
                >
                  <span>{t(item.key)}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 group-hover:text-primary -translate-x-1 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tc("tagline")}
          </p>
          <div className="text-[10px] text-muted-foreground/75 mt-3 font-mono">
            {tc("copyright")}
          </div>
        </div>
      </aside>
    </>
  );
}

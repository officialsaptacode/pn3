"use client";

import * as React from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Menu, Search, Globe, ChevronDown, Flame } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MobileDrawer } from "./mobile-drawer";
import { cn } from "@workspace/ui/lib/utils";

export default function Navbar() {
  const t = useTranslations("Navigation");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Monitor scroll to apply sticky header styling
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = () => {
    const nextLocale = locale === "ne" ? "en" : "ne";
    router.replace(pathname, { locale: nextLocale });
  };

  const mainCategories = [
    { key: "home", href: "/" },
    { key: "gorkha", href: "/category/gorkha" },
    { key: "gandaki", href: "/category/gandaki" },
    { key: "national", href: "/category/national" },
    { key: "sports", href: "/category/sports" },
    { key: "business", href: "/category/business" },
    { key: "video", href: "/video" },
  ];

  const moreCategories = [
    { key: "opinion", href: "/category/opinion" },
    { key: "entertainment", href: "/category/entertainment" },
    { key: "technology", href: "/category/technology" },
    { key: "diaspora", href: "/category/diaspora" },
    { key: "about", href: "/about" },
  ];

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300 border-b",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
            : "bg-background border-border/80"
        )}
      >
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Hamburger button (Mobile) */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 no-underline shrink-0">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-primary font-mukta select-none">
              गोर्खा <span className="text-foreground">दैनिक</span>
            </span>
          </Link>

          {/* Desktop Categories Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 flex-1 justify-center px-4">
            {mainCategories.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-semibold rounded-md transition-colors hover:bg-primary/5 hover:text-primary whitespace-nowrap",
                  pathname === item.href ? "text-primary bg-primary/5" : "text-muted-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}

            {/* "More" Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-md text-muted-foreground hover:bg-primary/5 hover:text-primary transition-colors focus:outline-hidden">
                  <span>{t("more")}</span>
                  <ChevronDown className="h-4 w-4 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border border-border">
                {moreCategories.map((item) => (
                  <DropdownMenuItem key={item.key} asChild className="focus:bg-primary/5 focus:text-primary cursor-pointer font-medium">
                    <Link href={item.href} className="w-full">
                      {t(item.key)}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            {/* Breaking News Pill */}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden lg:flex gap-1.5 border-primary/30 hover:border-primary text-primary hover:bg-primary/5 transition-colors h-9"
            >
              <Link href="/category/breaking">
                <Flame className="h-4 w-4 text-primary animate-pulse" />
                <span className="font-bold text-xs">{t("breaking")}</span>
              </Link>
            </Button>

            {/* Search Icon Button */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label="Search"
            >
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>

            {/* Language Switcher Button */}
            <Button
              onClick={handleLanguageChange}
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 h-9 px-2 md:px-3 text-muted-foreground hover:text-foreground text-xs md:text-sm font-medium border border-transparent hover:border-border"
              aria-label="Switch language"
            >
              <Globe className="h-4 w-4" />
              <span className="font-mono uppercase font-bold text-xs">
                {locale === "ne" ? "EN" : "ने"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        locale={locale}
      />
    </>
  );
}

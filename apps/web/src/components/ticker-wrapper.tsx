"use client";

import { useTranslations } from "next-intl";
import { NewsTicker } from "@workspace/ui/components/news-ticker";

export function TickerWrapper() {
  const t = useTranslations("Ticker");
  const tc = useTranslations("Common");

  const items = [
    t("item1"),
    t("item2"),
    t("item3"),
    t("item4"),
    t("item5"),
  ];

  return (
    <NewsTicker
      label={tc("breakingNews")}
      items={items}
      className="border-b border-border bg-background text-foreground"
    />
  );
}

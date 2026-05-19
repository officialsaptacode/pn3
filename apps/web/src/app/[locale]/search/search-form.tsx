"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";

interface SearchFormProps {
  initialQuery?: string;
  locale: string;
}

export function SearchForm({ initialQuery = "", locale }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();
  const isEn = locale === "en";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={isEn ? "Search news..." : "समाचार खोज्नुहोस्..."}
        className="flex-grow px-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold font-mukta text-sm hover:bg-primary/95 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
      >
        <svg className="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>{isEn ? "Search" : "खोज्नुहोस्"}</span>
      </button>
    </form>
  );
}

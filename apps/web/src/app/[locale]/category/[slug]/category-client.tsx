"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Article } from "@/lib/mock-data";

interface CategoryClientProps {
  articles: Article[];
  locale: string;
  subcategories: string[];
}

export function CategoryClient({ articles, locale, subcategories }: CategoryClientProps) {
  const [activeTab, setActiveTab] = useState<string>(subcategories[0] || "");
  const [visibleCount, setVisibleCount] = useState(4); // initial items visible
  const isEn = locale === "en";

  // Filter articles based on selected subcategory tab
  // In real system, we'd check tags or subcategories. For mock, we will display all or filter dynamically by tags.
  const filteredArticles = articles.filter((article) => {
    if (activeTab === subcategories[0]) return true; // "All" or "सबै"
    // Check if tag contains subcategory name
    const subLower = (activeTab || "").toLowerCase();
    const tagsList = isEn ? article.tags.en : article.tags.ne;
    return tagsList.some(tag => tag.toLowerCase().includes(subLower) || subLower.includes(tag.toLowerCase()));
  });

  const featured = filteredArticles[0];
  const listItems = filteredArticles.slice(1, visibleCount);
  const hasMore = filteredArticles.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="space-y-6">
      
      {/* Filters Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
        {subcategories.map((sub) => (
          <button
            key={sub}
            onClick={() => {
              setActiveTab(sub);
              setVisibleCount(4); // reset count
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg font-mukta border transition shrink-0 cursor-pointer ${
              activeTab === sub
                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-2xl bg-card">
          <p className="text-muted-foreground font-mukta">
            {isEn ? "No articles found in this subcategory." : "यस उपश्रेणीमा कुनै समाचार फेला परेन।"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Featured Large Card */}
          {featured && (
            <Link
              href={`/article/${featured.slug}`}
              className="group border rounded-2xl overflow-hidden bg-card shadow-sm flex flex-col md:flex-row hover:border-primary/20 transition duration-300"
            >
              <div className="md:w-[45%] h-56 md:h-72 relative bg-muted shrink-0">
                <img
                  src={featured.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-500"
                />
              </div>
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h2 className="font-mukta font-extrabold text-xl md:text-2xl leading-snug text-foreground group-hover:text-primary transition line-clamp-3">
                    {isEn ? featured.title.en : featured.title.ne}
                  </h2>
                  <p className="text-muted-foreground text-sm font-mukta leading-relaxed line-clamp-3">
                    {isEn ? featured.summary.en : featured.summary.ne}
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/60">
                  <div className="flex gap-4 items-center text-xs text-muted-foreground font-mono">
                    <span>{isEn ? featured.author.en : featured.author.ne}</span>
                    <span>•</span>
                    <span>{isEn ? featured.date.en : featured.date.ne}</span>
                  </div>
                  <span className="text-xs font-bold text-primary font-mukta flex items-center gap-1 group-hover:translate-x-1 transition duration-300">
                    {isEn ? "Read Article" : "पढ्नुहोस्"} →
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Grid of subsequent cards */}
          {listItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {listItems.slice(0, 2).map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group border rounded-xl overflow-hidden bg-card shadow-sm flex flex-col hover:border-primary/20 transition duration-300"
                >
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-44 object-cover group-hover:opacity-95 transition"
                    loading="lazy"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <h3 className="font-mukta font-bold text-sm md:text-base leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                      {isEn ? article.title.en : article.title.ne}
                    </h3>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border/60">
                      <span>{isEn ? article.author.en : article.author.ne}</span>
                      <span>{isEn ? article.date.en : article.date.ne}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* List of articles under the grid */}
          {listItems.length > 2 && (
            <div className="space-y-4">
              {listItems.slice(2).map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group flex gap-4 p-4 border rounded-xl bg-card hover:border-primary/20 hover:shadow-sm transition"
                >
                  <img
                    src={article.image}
                    alt=""
                    className="w-24 h-18 object-cover rounded-lg shrink-0 border bg-muted"
                    loading="lazy"
                  />
                  <div className="space-y-1.5 min-w-0 flex flex-col justify-center">
                    <h3 className="font-mukta font-bold text-sm md:text-base leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                      {isEn ? article.title.en : article.title.ne}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono block">
                      {isEn ? article.date.en : article.date.ne}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2.5 border border-primary/20 bg-primary/5 text-primary rounded-xl font-bold font-mukta text-sm hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
              >
                {isEn ? "Load More News" : "थप समाचार लोड गर्नुहोस्"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getArticles } from "@/lib/api";

interface SidebarProps {
  excludeSlug?: string;
  locale: string;
}

export async function Sidebar({ excludeSlug, locale }: SidebarProps) {
  const t = useTranslations("Common");
  const articles = await getArticles();

  // Get most read (using sliced articles)
  const mostRead = articles.slice(0, 5);

  // Get latest news (filter out current article if details page)
  const latestNews = articles
    .filter((a) => a.slug !== excludeSlug)
    .slice(0, 4);

  const isEn = locale === "en";

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-8">
      {/* Most Read Section */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold font-mukta border-b pb-3 mb-4 text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
          {isEn ? "Most Read" : "धेरै पढिएका"}
        </h3>
        <div className="divide-y divide-border">
          {mostRead.map((article, index) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="py-3 flex items-start gap-4 group block first:pt-0 last:pb-0"
            >
              <span className="font-mono text-xl font-extrabold text-primary/30 group-hover:text-primary transition shrink-0">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="space-y-1">
                <p className="font-mukta text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                  {isEn ? article.title.en : article.title.ne}
                </p>
                <span className="text-xs text-muted-foreground block font-mono">
                  {isEn ? article.date.en : article.date.ne}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Advertisement Banner */}
      <div
        className="bg-muted border border-dashed rounded-2xl p-8 text-center shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[250px]"
        role="region"
        aria-label={isEn ? "Advertisement" : "विज्ञापन"}
      >
        <div className="absolute top-2 right-2 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          {isEn ? "ADVERTISEMENT" : "विज्ञापन"}
        </div>
        <p className="text-sm font-bold text-muted-foreground uppercase font-mukta">
          {isEn ? "Advertise With Us" : "यहाँ विज्ञापन राख्नुहोस्"}
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          {isEn ? "Reach thousands of daily readers" : "दैनिक हजारौं पाठकहरूसँग जोडिनुहोस्"}
        </p>
      </div>

      {/* Latest News Section */}
      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold font-mukta border-b pb-3 mb-4 text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
          {isEn ? "Latest News" : "ताजा समाचार"}
        </h3>
        <div className="space-y-4">
          {latestNews.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="flex gap-3 group block"
            >
              <img
                src={article.image}
                alt=""
                className="w-20 h-15 object-cover rounded-lg border bg-muted shrink-0 group-hover:opacity-90 transition"
                loading="lazy"
              />
              <div className="space-y-1 min-w-0">
                <p className="font-mukta text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                  {isEn ? article.title.en : article.title.ne}
                </p>
                <span className="text-xs text-muted-foreground block font-mono">
                  {isEn ? article.date.en : article.date.ne}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

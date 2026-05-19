import { Link } from "@/i18n/routing";
import { getArticles, getVideos, getOpinions } from "@/lib/api";
import { SearchForm } from "./search-form";

interface SearchPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q } = await searchParams;
  const isEn = locale === "en";

  const title = q
    ? isEn
      ? `Search results for "${q}" - Gorkha Daily`
      : `"${q}" को खोज नतिजाहरू - गोर्खा दैनिक`
    : isEn
    ? "Search - Gorkha Daily"
    : "खोज - गोर्खा दैनिक";

  return {
    title,
  };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { locale } = await params;
  const { q = "", type = "all", page = "1" } = await searchParams;
  const isEn = locale === "en";

  const mockArticles = await getArticles();
  const mockVideos = await getVideos();
  const mockOpinions = await getOpinions();

  // Perform search on mock data
  const normalizedQuery = q.toLowerCase().trim();

  let results: Array<{
    type: "article" | "video" | "opinion";
    slug: string;
    title: string;
    summary: string;
    image?: string;
    date: string;
    author: string;
  }> = [];

  if (normalizedQuery) {
    // 1. Articles Search
    mockArticles.forEach((article) => {
      const titleText = (isEn ? article.title.en : article.title.ne).toLowerCase();
      const summaryText = (isEn ? article.summary.en : article.summary.ne).toLowerCase();
      
      if (titleText.includes(normalizedQuery) || summaryText.includes(normalizedQuery)) {
        results.push({
          type: "article",
          slug: `/article/${article.slug}`,
          title: isEn ? article.title.en : article.title.ne,
          summary: isEn ? article.summary.en : article.summary.ne,
          image: article.image,
          date: isEn ? article.date.en : article.date.ne,
          author: isEn ? article.author.en : article.author.ne,
        });
      }
    });

    // 2. Opinions Search
    mockOpinions.forEach((opinion) => {
      const titleText = (isEn ? opinion.title.en : opinion.title.ne).toLowerCase();
      if (titleText.includes(normalizedQuery)) {
        results.push({
          type: "opinion",
          slug: "/article/gorkha-earthquake-10th-anniversary", // route opinions to standard article mock
          title: isEn ? opinion.title.en : opinion.title.ne,
          summary: isEn
            ? `Opinion piece by ${opinion.author.en} published on ${opinion.date.en}`
            : `${opinion.author.ne} द्वारा लिखित विचार स्तम्भ, प्रकाशित: ${opinion.date.ne}`,
          date: isEn ? opinion.date.en : opinion.date.ne,
          author: isEn ? opinion.author.en : opinion.author.ne,
        });
      }
    });

    // 3. Videos Search
    mockVideos.forEach((video) => {
      const titleText = (isEn ? video.title.en : video.title.ne).toLowerCase();
      if (titleText.includes(normalizedQuery)) {
        results.push({
          type: "video",
          slug: "/video",
          title: isEn ? video.title.en : video.title.ne,
          summary: isEn ? `Video Report • Duration: ${video.duration}` : `भिडियो रिपोर्ट • अवधि: ${video.duration}`,
          image: video.image,
          date: isEn ? video.date.en : video.date.ne,
          author: isEn ? video.author.en : video.author.ne,
        });
      }
    });
  } else {
    // If no query, seed with default recent articles
    mockArticles.slice(0, 4).forEach((article) => {
      results.push({
        type: "article",
        slug: `/article/${article.slug}`,
        title: isEn ? article.title.en : article.title.ne,
        summary: isEn ? article.summary.en : article.summary.ne,
        image: article.image,
        date: isEn ? article.date.en : article.date.ne,
        author: isEn ? article.author.en : article.author.ne,
      });
    });
  }

  // Filter by tab type
  if (type !== "all") {
    results = results.filter((r) => r.type === type);
  }

  // Helper function to highlight text helper
  const highlightMatches = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 dark:bg-yellow-950/40 text-primary px-1 rounded font-semibold">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[800px] space-y-6">
      
      {/* Search form box */}
      <SearchForm initialQuery={q} locale={locale} />

      {/* Metadata search results line */}
      {q && (
        <p className="text-sm font-mukta text-muted-foreground border-b pb-2">
          {isEn ? (
            <>
              Found <strong className="text-foreground">{results.length}</strong> results for:{" "}
              <strong className="text-foreground">"{q}"</strong>
            </>
          ) : (
            <>
              <strong className="text-foreground">{results.length}</strong> नतिजाहरू भेटियो —{" "}
              <strong className="text-foreground">"{q}"</strong>
            </>
          )}
        </p>
      )}

      {/* Type filters tabs */}
      <div className="flex gap-2 border-b border-border/60 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "all", ne: "सबै", en: "All" },
          { id: "article", ne: "समाचार", en: "News" },
          { id: "video", ne: "भिडियो", en: "Video" },
          { id: "opinion", ne: "विचार", en: "Opinion" },
        ].map((tab) => {
          const isActive = type === tab.id;
          const href = q 
            ? `/search?q=${encodeURIComponent(q)}&type=${tab.id}` 
            : `/search?type=${tab.id}`;
          return (
            <Link
              key={tab.id}
              href={href}
              className={`px-4 py-2 text-xs font-semibold rounded-lg font-mukta border transition shrink-0 ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-sm"
                  : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isEn ? tab.en : tab.ne}
            </Link>
          );
        })}
      </div>

      {/* Search results list */}
      <div className="space-y-6">
        {results.length > 0 ? (
          results.map((res, index) => (
            <Link
              key={index}
              href={res.slug}
              className="flex gap-4 p-4 border rounded-xl bg-card hover:border-primary/20 hover:shadow-sm transition group"
            >
              {res.image && (
                <img
                  src={res.image}
                  alt=""
                  className="w-24 h-18 md:w-32 md:h-20 object-cover rounded-lg shrink-0 border bg-muted"
                  loading="lazy"
                />
              )}
              <div className="space-y-1.5 min-w-0 flex-grow flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary font-mukta">
                  {res.type}
                </span>
                <h3 className="font-mukta font-bold text-sm md:text-base leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                  {highlightMatches(res.title, q)}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-normal">
                  {highlightMatches(res.summary, q)}
                </p>
                <div className="flex gap-2 items-center text-[10px] text-muted-foreground font-mono pt-1">
                  <span>{res.author}</span>
                  <span>•</span>
                  <span>{res.date}</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-card">
            <p className="text-muted-foreground font-mukta">
              {isEn ? "No results found matching your search." : "तपाईंको खोजसँग मिल्दो कुनै नतिजा भेटिएन।"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination component */}
      {results.length > 0 && (
        <div className="flex justify-center items-center gap-1.5 pt-6 font-mono text-sm">
          <button className="w-8 h-8 rounded-lg border hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer transition">
            ‹
          </button>
          <button className="w-8 h-8 rounded-lg border bg-primary border-primary text-primary-foreground flex items-center justify-center font-bold cursor-pointer shadow-sm">
            1
          </button>
          <button className="w-8 h-8 rounded-lg border hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer transition">
            2
          </button>
          <button className="w-8 h-8 rounded-lg border hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer transition">
            3
          </button>
          <button className="w-8 h-8 rounded-lg border hover:bg-muted text-muted-foreground flex items-center justify-center cursor-pointer transition">
            ›
          </button>
        </div>
      )}

    </div>
  );
}

import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { ShareButtons } from "./share-buttons";

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const CATEGORY_NAMES: Record<string, { ne: string; en: string }> = {
  gorkha: { ne: "गोरखा समाचार", en: "Gorkha News" },
  gandaki: { ne: "गण्डकी प्रदेश", en: "Gandaki Province" },
  national: { ne: "राष्ट्रिय समाचार", en: "National News" },
  sports: { ne: "खेलकुद", en: "Sports" },
  business: { ne: "अर्थ तथा बाणिज्य", en: "Business & Economy" },
  international: { ne: "अन्तर्राष्ट्रिय", en: "International" },
  entertainment: { ne: "मनोरञ्जन", en: "Entertainment" },
};

export async function generateMetadata({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const isEn = locale === "en";
  const title = isEn ? article.title.en : article.title.ne;
  const summary = isEn ? article.summary.en : article.summary.ne;

  return {
    title: `${title} - Gorkha Daily`,
    description: summary,
    openGraph: {
      title: `${title} - Gorkha Daily`,
      description: summary,
      images: [{ url: article.image }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }

  // Get related articles (same category, excluding current one)
  const relatedArticles = await getRelatedArticles(slug, article.category, 3);

  const categoryName = CATEGORY_NAMES[article.category] || { ne: "समाचार", en: "News" };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[1200px] space-y-6">
      
      {/* ═══ BREADCRUMBS ═══ */}
      <nav className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 font-mukta">
        <Link href="/" className="hover:text-primary transition">
          {isEn ? "Home" : "गृहपृष्ठ"}
        </Link>
        <span>›</span>
        <Link href={`/category/${article.category}`} className="hover:text-primary transition">
          {isEn ? categoryName.en : categoryName.ne}
        </Link>
        <span>›</span>
        <span className="text-foreground font-semibold line-clamp-1 max-w-[200px] md:max-w-[400px]">
          {isEn ? article.title.en : article.title.ne}
        </span>
      </nav>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ARTICLE BODY COLUMN */}
        <article className="flex-grow min-w-0 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-4">
            <Link
              href={`/category/${article.category}`}
              className="inline-block text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full uppercase tracking-wide font-mukta"
            >
              {isEn ? categoryName.en : categoryName.ne}
            </Link>
            
            <h1 className="text-2xl md:text-4xl font-extrabold font-mukta text-foreground leading-tight">
              {isEn ? article.title.en : article.title.ne}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-y border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center uppercase text-sm font-mukta shrink-0">
                  {isEn ? article.author.initials.en : article.author.initials.ne}
                </div>
                <div>
                  <span className="text-sm font-bold text-foreground block font-mukta">
                    {isEn ? article.author.en : article.author.ne}
                  </span>
                  <span className="text-xs text-muted-foreground block font-mono">
                    {isEn ? article.date.en : article.date.ne}
                  </span>
                </div>
              </div>
              
              {/* Share block */}
              <ShareButtons locale={locale} />
            </div>
          </div>

          {/* Featured Image + Caption */}
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden shadow-sm aspect-video bg-muted border border-border">
              <img
                src={article.image}
                alt={isEn ? article.title.en : article.title.ne}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center font-mukta italic max-w-2xl mx-auto">
              {isEn ? `Photo: Gorkha Daily archive showing ${article.title.en}` : `तस्वीर: गोर्खा दैनिक संग्रह - ${article.title.ne}`}
            </p>
          </div>

          {/* Reading Content */}
          <div className="prose max-w-none font-mukta text-foreground/90 text-base md:text-lg leading-relaxed space-y-4">
            {(isEn ? article.content.en : article.content.ne).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-border flex flex-wrap gap-2 items-center">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider font-mukta">
              {isEn ? "Tags:" : "ट्यागहरू:"}
            </span>
            {(isEn ? article.tags.en : article.tags.ne).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted border rounded-lg text-xs font-semibold text-muted-foreground font-mukta"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Bio Card */}
          {article.author.bio && (
            <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center uppercase text-xl font-mukta shrink-0">
                {isEn ? article.author.initials.en : article.author.initials.ne}
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h4 className="font-mukta font-extrabold text-base text-foreground">
                    {isEn ? article.author.en : article.author.ne}
                  </h4>
                  {article.author.phone && (
                    <a
                      href={`tel:${article.author.phone}`}
                      className="text-xs text-primary font-mono hover:underline flex items-center gap-1"
                    >
                      📞 {article.author.phone}
                    </a>
                  )}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-mukta">
                  {isEn ? article.author.bio.en : article.author.bio.ne}
                </p>
              </div>
            </div>
          )}

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-lg md:text-xl font-bold font-mukta border-b pb-2 text-foreground flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                {isEn ? "Related News" : "सम्बन्धित समाचार"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/article/${rel.slug}`}
                    className="group border rounded-xl overflow-hidden bg-card shadow-sm flex flex-col hover:border-primary/20 transition duration-300"
                  >
                    <img
                      src={rel.image}
                      alt=""
                      className="w-full h-32 object-cover group-hover:opacity-95 transition"
                      loading="lazy"
                    />
                    <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                      <h4 className="font-mukta font-bold text-xs md:text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-3">
                        {isEn ? rel.title.en : rel.title.ne}
                      </h4>
                      <span className="text-[10px] text-muted-foreground font-mono block pt-1 border-t border-border/60">
                        {isEn ? rel.date.en : rel.date.ne}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>

        {/* SIDEBAR COLUMN */}
        <Sidebar excludeSlug={article.slug} locale={locale} />

      </div>

    </div>
  );
}

import { Link } from "@/i18n/routing";
import { getArticles, getVideos, getOpinions } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { Newsletter } from "@/components/newsletter";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  // Load all data from API client
  const articles = await getArticles();
  const videos = await getVideos();
  const opinions = await getOpinions();

  // Data selection
  const featuredArticle = articles.find((a) => a.isFeatured) || articles[0];
  if (!featuredArticle) {
    return <div className="container py-8 text-center">No news articles found.</div>;
  }
  const sideHeroArticles = articles.filter((a) => a.slug !== featuredArticle.slug).slice(0, 3);
  
  const gorkhaArticles = articles.filter((a) => a.category === "gorkha");
  const gorkhaFeatured = gorkhaArticles[0];
  const gorkhaList = gorkhaArticles.slice(1, 5);

  const gandakiArticles = articles.filter((a) => a.category === "gandaki");
  const gandakiFeatured = gandakiArticles[0];
  const gandakiList = gandakiArticles.slice(1, 5);

  const nationalArticles = articles.filter((a) => a.category === "national");
  const nationalFeatured = nationalArticles[0];
  const nationalList = nationalArticles.slice(1, 5);

  const sportsArticles = articles.filter((a) => a.category === "sports").slice(0, 3);
  const businessArticles = articles.filter((a) => a.category === "business");
  const internationalArticles = articles.filter((a) => a.category === "international").slice(0, 3);
  const entertainmentArticles = articles.filter((a) => a.category === "entertainment").slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 space-y-8 max-w-[1200px]">
      
      {/* ═══ HERO SECTION ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Big Hero Card */}
        {featuredArticle && (
          <div className="lg:col-span-2 group relative rounded-2xl overflow-hidden shadow-md bg-card border border-border flex flex-col justify-end min-h-[300px] md:min-h-[460px] cursor-pointer">
            <Link href={`/article/${featuredArticle.slug}`} className="absolute inset-0 z-0">
              <img
                src={featuredArticle.image}
                alt=""
                className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
            </Link>
            <div className="relative z-10 p-6 md:p-8 space-y-3 pointer-events-none">
              <span className="px-3 py-1 bg-red-600 text-white font-semibold text-xs rounded-full font-mukta uppercase tracking-wide">
                {isEn ? "Featured" : "विशेष समाचार"}
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold font-mukta text-white leading-tight group-hover:text-red-400 transition">
                {isEn ? featuredArticle.title.en : featuredArticle.title.ne}
              </h2>
              <p className="text-white/80 text-sm md:text-base font-medium font-mukta line-clamp-2 max-w-3xl">
                {isEn ? featuredArticle.summary.en : featuredArticle.summary.ne}
              </p>
              <div className="flex gap-4 items-center text-white/60 text-xs font-mono pt-2">
                <span>{isEn ? featuredArticle.author.en : featuredArticle.author.ne}</span>
                <span>•</span>
                <span>{isEn ? featuredArticle.date.en : featuredArticle.date.ne}</span>
              </div>
            </div>
          </div>
        )}

        {/* Side Stack Articles */}
        <div className="space-y-4">
          {sideHeroArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/article/${article.slug}`}
              className="flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/20 hover:shadow-sm transition group"
            >
              <img
                src={article.image}
                alt=""
                className="w-24 h-20 object-cover rounded-lg shrink-0 border bg-muted"
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
      </section>

      {/* ═══ MAIN LAYOUT WITH SIDEBAR ═══ */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT MAIN NEWS COLUMN */}
        <div className="flex-grow space-y-10 min-w-0">
          
          {/* GORKHA SECTION */}
          {gorkhaFeatured && (
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                  <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                  {isEn ? "Gorkha News" : "गोरखा समाचार"}
                </h2>
                <Link href="/category/gorkha" className="text-xs font-bold text-primary font-mukta hover:underline">
                  {isEn ? "View All →" : "सबै हेर्नुस →"}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Gorkha Card */}
                <Link
                  href={`/article/${gorkhaFeatured.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={gorkhaFeatured.image}
                    alt=""
                    className="w-full h-48 md:h-56 object-cover group-hover:opacity-95 transition"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-mukta font-extrabold text-lg leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                        {isEn ? gorkhaFeatured.title.en : gorkhaFeatured.title.ne}
                      </h3>
                      <p className="text-muted-foreground text-sm font-mukta line-clamp-2">
                        {isEn ? gorkhaFeatured.summary.en : gorkhaFeatured.summary.ne}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border/60">
                      <span>{isEn ? gorkhaFeatured.author.en : gorkhaFeatured.author.ne}</span>
                      <span>{isEn ? gorkhaFeatured.date.en : gorkhaFeatured.date.ne}</span>
                    </div>
                  </div>
                </Link>

                {/* Gorkha List Items */}
                <div className="divide-y divide-border">
                  {gorkhaList.length > 0 ? (
                    gorkhaList.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    // Fallback list items if not enough specific mock articles
                    articles.slice(2, 6).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* GANDAKI PROVINCE */}
          {gandakiFeatured && (
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                  <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                  {isEn ? "Gandaki Province" : "गण्डकी प्रदेश"}
                </h2>
                <Link href="/category/gandaki" className="text-xs font-bold text-primary font-mukta hover:underline">
                  {isEn ? "View All →" : "सबै हेर्नुस →"}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured Gandaki Card */}
                <Link
                  href={`/article/${gandakiFeatured.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={gandakiFeatured.image}
                    alt=""
                    className="w-full h-48 md:h-56 object-cover group-hover:opacity-95 transition"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-mukta font-extrabold text-lg leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                        {isEn ? gandakiFeatured.title.en : gandakiFeatured.title.ne}
                      </h3>
                      <p className="text-muted-foreground text-sm font-mukta line-clamp-2">
                        {isEn ? gandakiFeatured.summary.en : gandakiFeatured.summary.ne}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border/60">
                      <span>{isEn ? gandakiFeatured.author.en : gandakiFeatured.author.ne}</span>
                      <span>{isEn ? gandakiFeatured.date.en : gandakiFeatured.date.ne}</span>
                    </div>
                  </div>
                </Link>

                {/* Gandaki List Items */}
                <div className="divide-y divide-border">
                  {gandakiList.length > 0 ? (
                    gandakiList.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    articles.slice(3, 7).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* NATIONAL NEWS */}
          {nationalFeatured && (
            <section className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                  <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                  {isEn ? "National News" : "राष्ट्रिय समाचार"}
                </h2>
                <Link href="/category/national" className="text-xs font-bold text-primary font-mukta hover:underline">
                  {isEn ? "View All →" : "सबै हेर्नुस →"}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Featured National Card */}
                <Link
                  href={`/article/${nationalFeatured.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={nationalFeatured.image}
                    alt=""
                    className="w-full h-48 md:h-56 object-cover group-hover:opacity-95 transition"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-mukta font-extrabold text-lg leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                        {isEn ? nationalFeatured.title.en : nationalFeatured.title.ne}
                      </h3>
                      <p className="text-muted-foreground text-sm font-mukta line-clamp-2">
                        {isEn ? nationalFeatured.summary.en : nationalFeatured.summary.ne}
                      </p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border/60">
                      <span>{isEn ? nationalFeatured.author.en : nationalFeatured.author.ne}</span>
                      <span>{isEn ? nationalFeatured.date.en : nationalFeatured.date.ne}</span>
                    </div>
                  </div>
                </Link>

                {/* National List Items */}
                <div className="divide-y divide-border">
                  {nationalList.length > 0 ? (
                    nationalList.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    articles.slice(1, 5).map((article) => (
                      <Link
                        key={article.slug}
                        href={`/article/${article.slug}`}
                        className="py-3 flex gap-3 group first:pt-0 last:pb-0"
                      >
                        <img
                          src={article.image}
                          alt=""
                          className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                          loading="lazy"
                        />
                        <div className="space-y-1 min-w-0">
                          <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                            {isEn ? article.title.en : article.title.ne}
                          </h4>
                          <span className="text-xs text-muted-foreground font-mono block">
                            {isEn ? article.date.en : article.date.ne}
                          </span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* SPORTS */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                {isEn ? "Sports" : "खेलकुद"}
              </h2>
              <Link href="/category/sports" className="text-xs font-bold text-primary font-mukta hover:underline">
                {isEn ? "View All →" : "सबै हेर्नुस →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sportsArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-36 object-cover group-hover:opacity-95 transition"
                    loading="lazy"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                    <h3 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-3">
                      {isEn ? article.title.en : article.title.ne}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono block pt-1 border-t border-border/60">
                      {isEn ? article.date.en : article.date.ne}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* BUSINESS / ECONOMY (Tinted Section) */}
          <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-primary/10 pb-2">
              <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                {isEn ? "Business & Economy" : "अर्थ तथा बाणिज्य"}
              </h2>
              <Link href="/category/business" className="text-xs font-bold text-primary font-mukta hover:underline">
                {isEn ? "View All →" : "सबै हेर्नुस →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {businessArticles.slice(0, 4).map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-28 object-cover group-hover:opacity-95 transition"
                    loading="lazy"
                  />
                  <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                    <h3 className="font-mukta font-bold text-xs md:text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-3">
                      {isEn ? article.title.en : article.title.ne}
                    </h3>
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {isEn ? article.date.en : article.date.ne}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* VIDEO NEWS STRIP */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                {isEn ? "Video News" : "भिडियो समाचार"}
              </h2>
              <Link href="/video" className="text-xs font-bold text-primary font-mukta hover:underline">
                {isEn ? "View All →" : "सबै हेर्नुस →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.slice(0, 3).map((video) => (
                <Link
                  key={video.slug}
                  href="/video"
                  className="group flex flex-col"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-sm aspect-video bg-muted border border-border">
                    <img
                      src={video.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/35 transition">
                      <div className="w-12 h-12 bg-white/95 text-primary flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition shrink-0">
                        <span className="ml-1 text-red-600 text-lg">▶</span>
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      {video.duration}
                    </span>
                  </div>
                  <div className="pt-3 space-y-1">
                    <h3 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                      {isEn ? video.title.en : video.title.ne}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono block">
                      {isEn ? video.date.en : video.date.ne}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* OPINIONS vs INTERNATIONAL */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Opinions columns */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg md:text-xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                  <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                  {isEn ? "Opinion" : "विचार"}
                </h2>
              </div>
              <div className="space-y-4">
                {opinions.slice(0, 3).map((opinion) => (
                  <Link
                    key={opinion.slug}
                    href={`/article/gorkha-earthquake-10th-anniversary`} // route to main article page mock
                    className="flex gap-4 p-4 rounded-xl border bg-card hover:border-primary/10 hover:shadow-sm transition group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 border text-primary font-bold flex items-center justify-center shrink-0 uppercase text-sm font-mukta">
                      {isEn ? opinion.author.initials.en : opinion.author.initials.ne}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <span className="text-xs font-semibold text-muted-foreground block">
                        {isEn ? opinion.author.en : opinion.author.ne}
                      </span>
                      <h4 className="font-mukta font-bold text-sm md:text-base leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                        {isEn ? opinion.title.en : opinion.title.ne}
                      </h4>
                      <span className="text-xs text-muted-foreground font-mono block">
                        {isEn ? opinion.date.en : opinion.date.ne}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* International columns */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="text-lg md:text-xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                  <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                  {isEn ? "International" : "अन्तर्राष्ट्रिय"}
                </h2>
              </div>
              <div className="space-y-3 divide-y divide-border">
                {internationalArticles.map((article, idx) => (
                  <Link
                    key={article.slug}
                    href={`/article/${article.slug}`}
                    className={`flex gap-3 group block ${idx === 0 ? "pt-0" : "pt-3"}`}
                  >
                    <img
                      src={article.image}
                      alt=""
                      className="w-20 h-15 object-cover rounded-lg shrink-0 border bg-muted"
                      loading="lazy"
                    />
                    <div className="space-y-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                        {isEn ? article.title.en : article.title.ne}
                      </h4>
                      <span className="text-xs text-muted-foreground font-mono block">
                        {isEn ? article.date.en : article.date.ne}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* ENTERTAINMENT */}
          <section className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl md:text-2xl font-bold font-mukta text-foreground relative pl-3 flex items-center">
                <span className="absolute left-0 w-1.5 h-full bg-primary rounded-full"></span>
                {isEn ? "Entertainment" : "मनोरञ्जन"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {entertainmentArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/article/${article.slug}`}
                  className="group rounded-xl border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <img
                    src={article.image}
                    alt=""
                    className="w-full h-36 object-cover group-hover:opacity-95 transition"
                    loading="lazy"
                  />
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                    <h3 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-3">
                      {isEn ? article.title.en : article.title.ne}
                    </h3>
                    <span className="text-xs text-muted-foreground font-mono block pt-1 border-t border-border/60">
                      {isEn ? article.date.en : article.date.ne}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* NEWSLETTER */}
          <Newsletter />

        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <Sidebar locale={locale} />

      </div>

    </div>
  );
}

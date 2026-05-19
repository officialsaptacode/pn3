import { Link } from "@/i18n/routing";
import { getVideos } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { VideoClient } from "./video-client";

interface VideoPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: VideoPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "Video News - Gorkha Daily" : "भिडियो समाचार - गोर्खा दैनिक";
  const description = isEn
    ? "Latest video reports and highlights from Gorkha Daily"
    : "गोर्खा दैनिकका ताजा भिडियो रिपोर्टहरू तथा मुख्य अंशहरू";

  return {
    title,
    description,
  };
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";
  const videos = await getVideos();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[1200px] space-y-6">
      
      {/* ═══ BREADCRUMBS & HEADER ═══ */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <nav className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5 font-mukta">
          <Link href="/" className="hover:text-primary transition">
            {isEn ? "Home" : "गृहपृष्ठ"}
          </Link>
          <span>›</span>
          <span className="text-foreground font-semibold">
            {isEn ? "Video News" : "भिडियो समाचार"}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-extrabold font-mukta text-foreground">
              {isEn ? "Video News" : "भिडियो समाचार"}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-mukta">
              {isEn ? "Latest video reports from Gorkha Daily" : "गोर्खा दैनिकका ताजा भिडियो रिपोर्टहरू"}
            </p>
          </div>
          <div className="self-start sm:self-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold font-mono text-lg md:text-xl">
            {isEn ? "124" : "१२४"}
          </div>
        </div>
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* VIDEO CONTENT (Client-side interactive hub) */}
        <div className="flex-grow space-y-8 min-w-0">
          <VideoClient videos={videos} locale={locale} />
        </div>

        {/* SIDEBAR */}
        <Sidebar locale={locale} />

      </div>

    </div>
  );
}

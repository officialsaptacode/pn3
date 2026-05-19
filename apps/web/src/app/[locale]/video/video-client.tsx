"use client";

import { useState } from "react";
import { Video } from "@/lib/mock-data";

interface VideoClientProps {
  videos: Video[];
  locale: string;
}

const TABS = {
  en: ["All", "Politics", "Sports", "Entertainment", "Special"],
  ne: ["सबै", "राजनीति", "खेलकुद", "मनोरञ्जन", "गोरखा विशेष"],
};

export function VideoClient({ videos, locale }: VideoClientProps) {
  const isEn = locale === "en";
  const tabsList = isEn ? TABS.en : TABS.ne;
  
  const [activeTab, setActiveTab] = useState<string>(tabsList[0] || "");
  const [selectedVideo, setSelectedVideo] = useState<Video | undefined>(videos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visibleCount, setVisibleCount] = useState(4);

  // Map user tabs to video category key
  const getCategoryKey = (tab: string): string => {
    const idx = tabsList.indexOf(tab);
    if (idx <= 0) return "all";
    return ["all", "politics", "sports", "entertainment", "special"][idx] || "all";
  };

  const filteredVideos = videos.filter((vid) => {
    const key = getCategoryKey(activeTab);
    if (key === "all") return true;
    return vid.category === key;
  });

  const listVideos = filteredVideos.filter((vid) => vid.slug !== selectedVideo?.slug).slice(0, visibleCount);
  const hasMore = filteredVideos.filter((vid) => vid.slug !== selectedVideo?.slug).length > visibleCount;

  const handleSelectVideo = (vid: Video) => {
    setSelectedVideo(vid);
    setIsPlaying(false); // reset playing state to show overlay
    window.scrollTo({ top: 180, behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  return (
    <div className="space-y-8">
      {/* Subcategory Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border/60 scrollbar-none">
        {tabsList.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setVisibleCount(4); // reset count
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg font-mukta border transition shrink-0 cursor-pointer ${
              activeTab === tab
                ? "bg-primary border-primary text-primary-foreground shadow-sm"
                : "bg-background border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Featured Video Player Box */}
      {selectedVideo && (
        <div className="border rounded-2xl overflow-hidden bg-card shadow-sm space-y-4">
          <div className="relative aspect-video bg-black flex items-center justify-center group overflow-hidden">
            {isPlaying ? (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
                {/* Simulated playing video */}
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 border-4 border-red-600/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-red-600 rounded-full animate-spin"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-white font-semibold font-mukta text-sm md:text-base">
                    {isEn ? "Streaming Video Report..." : "भिडियो रिपोर्ट स्ट्रिमिङ भइरहेको छ..."}
                  </p>
                  <p className="text-white/60 text-xs font-mono max-w-sm">
                    {isEn ? selectedVideo.title.en : selectedVideo.title.ne}
                  </p>
                </div>
                <button
                  onClick={() => setIsPlaying(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {isEn ? "Close Player" : "प्लेयर बन्द गर्नुहोस्"}
                </button>
              </div>
            ) : (
              <>
                <img
                  src={selectedVideo.image}
                  alt=""
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full shadow-2xl group-hover:scale-110 transition duration-300 cursor-pointer"
                    title={isEn ? "Play Video" : "भिडियो बजाउनुहोस्"}
                  >
                    <span className="ml-1 text-2xl">▶</span>
                  </button>
                </div>
                <span className="absolute bottom-4 right-4 bg-black/85 text-white text-xs px-2.5 py-1 rounded font-mono shadow-md">
                  {selectedVideo.duration}
                </span>
              </>
            )}
          </div>

          <div className="p-6 space-y-3">
            <h2 className="font-mukta font-extrabold text-xl md:text-2xl leading-snug text-foreground">
              {isEn ? selectedVideo.title.en : selectedVideo.title.ne}
            </h2>
            <div className="flex flex-wrap gap-4 items-center text-xs text-muted-foreground font-mono pt-1">
              <span>{isEn ? selectedVideo.author.en : selectedVideo.author.ne}</span>
              <span>•</span>
              <span>{isEn ? selectedVideo.date.en : selectedVideo.date.ne}</span>
              <span>•</span>
              <span className="px-2 py-0.5 bg-primary/10 text-primary font-bold font-mukta rounded uppercase tracking-wider text-[10px]">
                {selectedVideo.category}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of other videos */}
      <div className="space-y-6">
        <h3 className="text-lg md:text-xl font-bold font-mukta border-b pb-2 text-foreground flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
          {isEn ? "All Videos" : "सबै भिडियोहरू"}
        </h3>

        {filteredVideos.length <= 1 && (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-card">
            <p className="text-muted-foreground font-mukta">
              {isEn ? "No other videos found." : "अन्य कुनै भिडियोहरू फेला परेनन्।"}
            </p>
          </div>
        )}

        {listVideos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listVideos.map((video) => (
              <div
                key={video.slug}
                onClick={() => handleSelectVideo(video)}
                className="group flex flex-col bg-card border rounded-xl overflow-hidden shadow-sm hover:border-primary/20 transition cursor-pointer"
              >
                <div className="relative aspect-video bg-muted border-b border-border overflow-hidden">
                  <img
                    src={video.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center group-hover:bg-black/30 transition">
                    <div className="w-10 h-10 bg-white/95 text-primary flex items-center justify-center rounded-full shadow-md group-hover:scale-110 transition shrink-0">
                      <span className="ml-1 text-red-600 text-sm">▶</span>
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                    {video.duration}
                  </span>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-mukta font-bold text-sm leading-snug text-foreground group-hover:text-primary transition line-clamp-2">
                    {isEn ? video.title.en : video.title.ne}
                  </h4>
                  <span className="text-xs text-muted-foreground font-mono block">
                    {isEn ? video.date.en : video.date.ne}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load more button */}
        {hasMore && (
          <div className="text-center pt-4">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2.5 border border-primary/20 bg-primary/5 text-primary rounded-xl font-bold font-mukta text-sm hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
            >
              {isEn ? "Load More Videos" : "थप भिडियो लोड गर्नुहोस्"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface ShareButtonsProps {
  locale: string;
}

export function ShareButtons({ locale }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const isEn = locale === "en";

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = typeof window !== "undefined" ? encodeURIComponent(window.location.href) : "";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Facebook Share */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border bg-background hover:bg-muted text-muted-foreground hover:text-[#1877F2] transition flex items-center justify-center cursor-pointer"
        title={isEn ? "Share on Facebook" : "फेसबुकमा सेयर गर्नुहोस्"}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M9 8H7v3h2v9h3v-9h2.72l.42-3H12V6c0-.9.27-1.35 1.35-1.35H15V1h-2.7c-3.15 0-4.3 1.5-4.3 3.82V8z" />
        </svg>
      </a>

      {/* Twitter / X Share */}
      <a
        href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center cursor-pointer"
        title={isEn ? "Share on X" : "एक्समा सेयर गर्नुहोस्"}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${shareUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full border bg-background hover:bg-muted text-muted-foreground hover:text-[#25D366] transition flex items-center justify-center cursor-pointer"
        title={isEn ? "Share on WhatsApp" : "व्हाट्सएपमा सेयर गर्नुहोस्"}
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.57 1.977 14.1 .953 11.5 1.951c-5.439 0-9.865 4.37-9.869 9.8-.001 1.776.471 3.511 1.365 5.064L2.008 21.99l5.37-1.408z" />
        </svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className="h-8 px-3 rounded-full border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center gap-1.5 text-xs font-semibold font-mukta cursor-pointer"
        title={isEn ? "Copy Link" : "लिंक कपी गर्नुहोस्"}
      >
        <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>
          {copied
            ? isEn
              ? "Copied!"
              : "कपी भयो!"
            : isEn
            ? "Copy Link"
            : "लिंक कपी"}
        </span>
      </button>
    </div>
  );
}

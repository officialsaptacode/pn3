"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@workspace/ui/components/dialog";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, FreeMode, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

interface GalleryImage {
  url: string;
  id?: string | number;
  alt?: string;
}

interface TripGalleryProps {
  images: GalleryImage[];
  tripTitle: string;
  featuredImage?: string;
}

const FALLBACK = "/packagebg.jpg";
const FALLBACK1 = "/packagebg1.jpg";
const FALLBACK2 = "/packagebg2.jpg";

export default function TripGallery({ images, tripTitle, featuredImage }: TripGalleryProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const mainSwiperRef = useRef<SwiperType | null>(null);

  // Filter valid images
  const validImages: GalleryImage[] = images?.filter((img) => img?.url) ?? [];

  // If no valid images, create a fallback array with placeholder images
  const galleryImages: GalleryImage[] =
    validImages.length > 0
      ? validImages
      : [
          { url: FALLBACK, alt: "Default package image 1" },
          { url: FALLBACK1, alt: "Default package image 2" },
          { url: FALLBACK, alt: "Default package image 3" },
          { url: FALLBACK2, alt: "Default package image 4" },
        ];

  console.log("🖼️ Final Gallery Images:", galleryImages);

  // Ensure featured image is included if provided and valid
  if (featuredImage && !galleryImages.find((img) => img.url === featuredImage)) {
    galleryImages.unshift({ url: featuredImage, alt: tripTitle });
  }

  const totalImages = galleryImages.length;

  // Main display image for mobile
  const mainImage: string = featuredImage || galleryImages[0]?.url || FALLBACK;

  // Returns a guaranteed string (never undefined) for Next.js Image src
  const getImageAtIndex = (index: number, fallback: string): string => {
    if (index < galleryImages.length) {
      return galleryImages[index]?.url || fallback;
    }
    return fallback;
  };

  const openGallery = (index = 0) => {
    setStartIndex(index);
    setIsPlaying(true);
    setIsGalleryOpen(true);
  };

  // Toggle autoplay via the Swiper instance
  const handleTogglePlay = () => {
    const swiper = mainSwiperRef.current;
    if (!swiper) return;
    if (isPlaying) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
    setIsPlaying((p) => !p);
  };

  // Reset playing state when dialog closes
  useEffect(() => {
    if (!isGalleryOpen) setIsPlaying(true);
  }, [isGalleryOpen]);

  return (
    <>
      {/* ── Lightbox Dialog ── */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 bg-black border-none overflow-hidden flex flex-col">
          {/* Header */}
          <DialogHeader className="flex-shrink-0 flex flex-row items-center justify-between px-5 py-3 bg-gradient-to-b from-black/80 to-transparent z-20">
            <DialogTitle className="text-white text-lg font-semibold truncate">
              {tripTitle}
            </DialogTitle>

            <div className="flex items-center gap-2">
              {/* Play / Pause */}
              <button
                onClick={handleTogglePlay}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              {/* Close */}
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close gallery"
              >
                <X size={20} />
              </button>
            </div>
          </DialogHeader>

          {/* Main Swiper */}
          <div className="flex-1 min-h-0 relative">
            {totalImages > 0 ? (
              <>
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, Thumbs]}
                  initialSlide={startIndex}
                  thumbs={{
                    swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                  }}
                  navigation={{
                    prevEl: ".swiper-btn-prev",
                    nextEl: ".swiper-btn-next",
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop={totalImages > 1}
                  className="w-full h-full"
                  onSwiper={(swiper) => {
                    mainSwiperRef.current = swiper;
                    // Honour the initial isPlaying state
                    if (!isPlaying) swiper.autoplay.stop();
                  }}
                  style={
                    {
                      "--swiper-pagination-color": "#f97316",
                      "--swiper-pagination-bullet-inactive-color": "rgba(255,255,255,0.4)",
                    } as React.CSSProperties
                  }
                >
                  {galleryImages.map((img, idx) => (
                    <SwiperSlide key={img.id ?? idx}>
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <Image
                          src={img.url || FALLBACK}
                          alt={img.alt || `${tripTitle} - Image ${idx + 1}`}
                          fill
                          className="object-contain"
                          sizes="95vw"
                          priority={idx === 0}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Nav Buttons — positioned outside <Swiper> so z-index works */}
                {totalImages > 1 && (
                  <>
                    <button
                      className="swiper-btn-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="swiper-btn-next absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/50">No images available.</p>
              </div>
            )}
          </div>

          {/* Thumbnail Strip Swiper */}
          {totalImages > 1 && (
            <div className="flex-shrink-0 h-20 bg-black/80 px-4 py-2">
              <Swiper
                modules={[FreeMode, Thumbs]}
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView="auto"
                freeMode
                watchSlidesProgress
                className="h-full"
              >
                {galleryImages.map((img, idx) => (
                  <SwiperSlide key={img.id ?? idx} style={{ width: "auto" }}>
                    <div className="relative h-14 w-20 rounded overflow-hidden cursor-pointer opacity-50 transition-all [.swiper-slide-thumb-active_&]:opacity-100 [.swiper-slide-thumb-active_&]:ring-2 [.swiper-slide-thumb-active_&]:ring-orange-400">
                      <Image
                        src={img.url || FALLBACK}
                        alt={img.alt || `Thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Mobile View ── */}
      <div className="block md:hidden">
        <div
          className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer"
          onClick={() => openGallery(0)}
        >
          <Image
            src={mainImage}
            alt={tripTitle}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          {/* Overlay hint */}
          <div className="absolute inset-0 bg-black/10 flex items-end p-3">
            <span className="text-white text-xs bg-black/40 rounded px-2 py-1">
              Tap to view gallery
            </span>
          </div>
        </div>

        {/* See All Photos Button — always shown on mobile when there are images */}
        {totalImages > 0 && (
          <div className="mt-4 px-2">
            <button
              onClick={() => openGallery(0)}
              className="bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white w-full h-12 rounded-full transition-colors font-medium text-sm shadow-sm"
            >
              See all photos ({totalImages})
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop View ── */}
      <div className="hidden md:block">
        <div className="grid grid-cols-10 gap-2 h-[520px]">
          {/* Main large image */}
          <div
            className="col-span-6 relative overflow-hidden cursor-pointer group"
            // onClick={() => openGallery(0)}
          >
            <Image
              src={getImageAtIndex(0, FALLBACK)}
              alt={tripTitle}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="60vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </div>

          {/* Right column */}
          <div className="col-span-4 grid grid-rows-2 gap-2 h-full">
            {/* Top right image */}
            <div
              className="relative overflow-hidden cursor-pointer group"
              // onClick={() => openGallery(1)}
            >
              <Image
                src={getImageAtIndex(1, FALLBACK1)}
                alt={tripTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="40vw"
                priority
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Bottom row: two thumbnails + "see all" overlay */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="relative overflow-hidden cursor-pointer group"
                // onClick={() => openGallery(2)}
              >
                <Image
                  src={getImageAtIndex(2, FALLBACK)}
                  alt={tripTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="20vw"
                  priority
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Last thumbnail with "See all photos" overlay */}
              <div
                className="relative overflow-hidden cursor-pointer group"
                // onClick={() => openGallery(3)}
              >
                <Image
                  src={getImageAtIndex(3, FALLBACK2)}
                  alt={tripTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="20vw"
                  priority
                />
                {/* Desktop "See all photos" button below the grid */}
                {totalImages > 0 && (
                  <div className="mt-50 ml-15 md:ml-5 xl:ml-15 flex ">
                    <button
                      onClick={() => openGallery(0)}
                      className="bg-orange-400 hover:bg-orange-500 text-white px-6 h-10 rounded-full transition-colors font-medium text-sm md:text-xs lg:text-sm shadow-sm z-10 "
                    >
                      See all photos ({totalImages})
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { SyntheticEvent } from "react";
import { useEffect, useState } from "react";
import { Autoplay, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/autoplay";

interface ImageType {
  url: string;
  alt?: string;
  isThumbnail?: boolean;
}

interface ImageGalleryProps {
  thumbnailImage: string;
  galleryImages: ImageType[];
  title: string;
}

// Helper function to validate image URL
const isValidImageUrl = (url: string | undefined): boolean => {
  if (!url || url.trim() === "") return false;
  if (url === "null" || url === "undefined") return false;
  if (!url.startsWith("http") && !url.startsWith("/")) return false;
  return true;
};

// Fallback images
const FALLBACK_IMAGES = [
  { url: "/packagebg1.jpg", alt: "Scenic View" },
  { url: "/packagebg2.jpg", alt: "Adventure View" },
  { url: "/aboutusbg.jpg", alt: "Landscape View" },
  { url: "/packagebg.jpg", alt: "Travel View" },
];

// Helper functions to reduce complexity
const prepareGridImages = (
  thumbnailImage: string,
  galleryImages: ImageType[],
  title: string,
): ImageType[] => {
  let images: ImageType[] = [];

  // Add validated thumbnail
  if (isValidImageUrl(thumbnailImage)) {
    images.push({
      url: thumbnailImage,
      alt: `${title} - Main Image`,
    });
  }

  // Add validated gallery images (max 3 more for grid)
  if (galleryImages?.length > 0) {
    const validGalleryImages = galleryImages
      .filter((img) => isValidImageUrl(img.url) && img.url !== thumbnailImage)
      .slice(0, 3);

    images = [...images, ...validGalleryImages];
  }

  // Fill remaining spots with fallbacks
  if (images.length < 4) {
    const needed = 4 - images.length;
    const fallbacksToAdd = FALLBACK_IMAGES.slice(0, needed).map((fb) => ({
      ...fb,
      alt: `${title} - ${fb.alt}`,
    }));

    images = [...images, ...fallbacksToAdd];
  }

  // Remove duplicates
  return images.filter(
    (image, index, self) => index === self.findIndex((img) => img.url === image.url),
  );
};

const prepareSwiperImages = (
  thumbnailImage: string,
  galleryImages: ImageType[],
  title: string,
): ImageType[] => {
  let images: ImageType[] = [];

  // Add all valid gallery images (excluding thumbnail)
  if (galleryImages?.length > 0) {
    const validSwiperImages = galleryImages.filter(
      (img) => isValidImageUrl(img.url) && img.url !== thumbnailImage,
    );
    images = [...validSwiperImages];
  }

  // Add some fallbacks to swiper if needed
  if (images.length < 3) {
    const needed = 6 - images.length;
    const fallbacksToAdd = FALLBACK_IMAGES.slice(0, needed).map((fb) => ({
      ...fb,
      alt: `${title} - ${fb.alt}`,
    }));

    images = [...images, ...fallbacksToAdd];
  }

  // Remove duplicates
  return images.filter(
    (image, index, self) => index === self.findIndex((img) => img.url === image.url),
  );
};

const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>, fallbackSrc: string) => {
  const target = e.target as HTMLImageElement;
  target.src = fallbackSrc;
};

export default function PackageGallery({
  thumbnailImage,
  galleryImages,
  title,
}: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders Swiper on client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prepare images using helper functions
  const gridImages = prepareGridImages(thumbnailImage, galleryImages, title);
  const swiperImages = prepareSwiperImages(thumbnailImage, galleryImages, title);

  return (
    <>
      {/* Image Gallery Grid */}
      <div className="mt-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-4 py-5">
          {/* Main image (thumbnail) */}
          <div className="md:col-span-6 relative w-full h-full min-h-[400px] md:min-h-[600px]">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={gridImages[0]?.url || "/packagebg.jpg"}
                alt={gridImages[0]?.alt || title}
                fill
                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
                onClick={() => setIsModalOpen(true)}
                onError={(e: SyntheticEvent<HTMLImageElement, Event>) =>
                  handleImageError(e, "/packagebg.jpg")
                }
              />
            </div>
          </div>

          {/* Side images */}
          <div className="hidden md:col-span-4 md:flex flex-col gap-4 h-full">
            {/* First side image - takes 50% of height */}
            <div className="relative flex-1 min-h-[200px]">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={gridImages[1]?.url || "/packagebg1.jpg"}
                  alt={gridImages[1]?.alt || title}
                  fill
                  className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  onClick={() => setIsModalOpen(true)}
                  onError={(e: SyntheticEvent<HTMLImageElement, Event>) =>
                    handleImageError(e, "/packagebg1.jpg")
                  }
                />
              </div>
            </div>

            {/* Two smaller images - takes remaining 50% of height */}
            <div className="relative flex-1 grid grid-cols-2 gap-4 min-h-[200px]">
              <div className="relative w-full h-full">
                <div className="relative w-full h-full overflow-hidden ">
                  <Image
                    src={gridImages[2]?.url || "/packagebg2.jpg"}
                    alt={gridImages[2]?.alt || title}
                    fill
                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    onClick={() => setIsModalOpen(true)}
                    onError={(e: SyntheticEvent<HTMLImageElement, Event>) =>
                      handleImageError(e, "/packagebg2.jpg")
                    }
                  />
                </div>
              </div>
              <div className="relative w-full h-full">
                <div className="relative w-full h-full overflow-hidden ">
                  <Image
                    src={gridImages[3]?.url || "/packagebg3.jpg"}
                    alt={gridImages[3]?.alt || title}
                    fill
                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    onClick={() => setIsModalOpen(true)}
                    onError={(e: SyntheticEvent<HTMLImageElement, Event>) =>
                      handleImageError(e, "/packagebg3.jpg")
                    }
                  />
                </div>
              </div>

              {/* See all photos button */}
              <div className="absolute bottom-6 right-10 z-10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-orange-400 flex items-center justify-center gap-1 rounded-full text-white px-4 py-3 transition-colors shadow-sm hover:bg-orange-500"
                >
                  See all photos ({swiperImages.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && isMounted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative w-full max-w-7xl h-[90vh] bg-white rounded-xl overflow-hidden">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-800" />
            </button>

            {/* Image counter */}
            <div className="absolute top-4 left-4 z-50 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
              {swiperImages.length} photos
            </div>

            {/* Swiper Gallery */}
            <div className="h-full flex flex-col p-4">
              {/* Main Swiper */}
              <div className="flex-1 relative">
                {swiperImages.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Thumbs, Zoom, Autoplay]}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{
                      swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
                    }}
                    zoom={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    className="h-full rounded-lg"
                  >
                    {swiperImages.map((image, index) => (
                      <SwiperSlide key={index} className="relative">
                        <div className="swiper-zoom-container">
                          <Image
                            src={image.url}
                            alt={image.alt || `${title} - Image ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority={index === 0}
                            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]?.url ||
                                "/packagebg.jpg";
                            }}
                          />
                        </div>
                        {/* Slide counter */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {index + 1} / {swiperImages.length}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No additional photos available</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Swiper */}
              {swiperImages.length > 1 && (
                <div className="mt-4 h-24">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView="auto"
                    watchSlidesProgress={true}
                    className="thumbnail-swiper"
                  >
                    {swiperImages.map((image, index) => (
                      <SwiperSlide key={index} className="!w-24 !h-24 cursor-pointer">
                        <div className="relative w-full h-full rounded-lg overflow-hidden">
                          <Image
                            src={image.url}
                            alt={image.alt || `${title} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="96px"
                            onError={(e: SyntheticEvent<HTMLImageElement, Event>) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]?.url ||
                                "/packagebg.jpg";
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

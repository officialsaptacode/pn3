"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TypographyBase } from "~/src/lib/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../../../packages/ui/src/components/accordion";
import { Button } from "../../../../../../../packages/ui/src/components/button";

interface ItineraryDay {
  title: string;
  description?: string;
  distance?: string;
  altitude?: string;
  duration?: string;
  time?: string;
  meal?: string;
  accommodation?: string;
  acco?: string;
  image?: string;
}

interface PackageItineraryProps {
  data: ItineraryDay[];
}

// Default images
const defaultImages = ["/stupa.jpg", "/packagebg.jpg", "/packagebg1.jpg", "/packagebg2.jpg"];

// Get fallback image
const getDefaultImage = (index: number) => {
  return defaultImages[index % defaultImages.length] || "/stupa.jpg";
};

function normalizeTitle(title?: string) {
  if (!title) return "";
  return title.replace(/^day\s*\d+\s*/i, "").trim();
}

export default function PackageItinerary({ data }: PackageItineraryProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    setOpenItems([]);
  }, []);

  const handleOpenAll = () => {
    setOpenItems(data.map((_, i) => `day-${i + 1}`));
  };

  const handleCloseAll = () => {
    setOpenItems([]);
  };

  if (!data || data.length === 0) {
    return (
      <section className="mt-10 p-4 border rounded-lg">
        <p className="text-gray-500 text-center">No itinerary available</p>
      </section>
    );
  }

  return (
    <section className="mt-10">
      {/* Mobile Buttons */}
      <div className="flex sm:hidden gap-2 mb-4">
        <Button variant="outline" size="sm" className="flex-1" onClick={handleOpenAll}>
          Open All
        </Button>
        <Button variant="outline" size="sm" className="flex-1" onClick={handleCloseAll}>
          Close All
        </Button>
      </div>

      {/* Accordion */}
      <div className="rounded-lg overflow-hidden">
        <Accordion
          type="multiple"
          value={openItems}
          onValueChange={setOpenItems}
          className="w-full"
        >
          {data.map((day, index) => {
            const accommodation = day.accommodation || day.acco;
            const imageUrl = day.image || getDefaultImage(index);

            return (
              <AccordionItem
                key={index}
                value={`day-${index + 1}`}
                className="border-b last:border-b-0"
              >
                <AccordionTrigger className="px-2 sm:px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-start gap-4 text-left w-full">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <TypographyBase className="font-extrabold text-[#002E86]">
                          Day {index + 1}
                        </TypographyBase>

                        <TypographyBase className="font-bold text-gray-700">
                          {normalizeTitle(day.title)}
                        </TypographyBase>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-2 sm:px-6 pb-6">
                  <div className="space-y-4">
                    {day.description && (
                      <div
                        suppressHydrationWarning
                        dangerouslySetInnerHTML={{ __html: day.description }}
                        className="text-gray-700"
                      />
                    )}

                    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden mt-4">
                      <Image
                        src={imageUrl}
                        alt={`Day ${index + 1} - ${day.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 80vw"
                      />
                    </div>

                    {(day.meal || accommodation) && (
                      <div className="pt-4 border-t">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                          {day.meal && (
                            <div>
                              <p className="text-sm text-gray-500">Meals Included</p>
                              <p className="font-medium">{day.meal}</p>
                            </div>
                          )}
                          {accommodation && (
                            <div>
                              <p className="text-sm text-gray-500">Accommodation</p>
                              <p className="font-medium">{accommodation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </section>
  );
}

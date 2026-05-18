"use client";

import Image from "next/image";
import { TypographyBase, TypographyLead } from "@/lib/typography";

interface PackageInformationProps {
  duration?: number | string | null;
  groupSizeMin?: number | null;
  groupSizeMax?: number | null;
  maxAltitude?: number | null;
  bestSeason?: string | string[] | null;
}

export default function PackageInformation({
  duration,
  groupSizeMin,
  groupSizeMax,
  maxAltitude,
  bestSeason,
}: PackageInformationProps) {
  // Format duration: "14 Days"
  const durationValue = duration ? `${duration} Days` : "—";

  // Format group size: "2–14 People" or "14 People"
  const groupValue = groupSizeMax
    ? groupSizeMin && groupSizeMin !== groupSizeMax
      ? `${groupSizeMin}–${groupSizeMax} People`
      : `${groupSizeMax} People`
    : "—";

  // Format altitude: "5,545 m / 18,192 ft"
  const altitudeValue = maxAltitude
    ? `${maxAltitude.toLocaleString()} m / ${Math.round(maxAltitude * 3.28084).toLocaleString()} ft`
    : "—";

  // Format best season: array → "Spring, Autumn" or plain string
  const seasonValue = Array.isArray(bestSeason) ? bestSeason.join(", ") || "—" : bestSeason || "—";

  const ITEMS = [
    { icon: "/clock.png", label: "Duration", value: durationValue },
    { icon: "/group.png", label: "Group Size", value: groupValue },
    { icon: "/altitude.png", label: "Max Altitude", value: altitudeValue },
    { icon: "/season.jpg", label: "Best Season", value: seasonValue },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-4 mt-10 w-full mx-auto sm:place-items-center px-4">
      {ITEMS.map((item, idx) => (
        <div key={idx} className="flex items-center gap-x-3">
          <div className="bg-gray-50 border border-gray-100 rounded-md shadow-md p-3 flex items-center justify-center">
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
          </div>

          <span className="flex flex-col">
            <TypographyBase className="text-sm sm:text-base text-gray-500">
              {item.label}
            </TypographyBase>
            <TypographyLead className="text-sm sm:text-xl font-semibold text-[#002E86]">
              {item.value}
            </TypographyLead>
          </span>
        </div>
      ))}
    </div>
  );
}

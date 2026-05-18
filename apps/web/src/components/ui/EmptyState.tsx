"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Calendar, Compass, ImageIcon, MapPin, Newspaper } from "lucide-react";
import { TypographyH3, TypographyP } from "../../lib/typography";

interface EmptyStateProps {
  type?: "treks" | "packages" | "blogs" | "gallery" | "departures" | "destinations";
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

const iconMap = {
  treks: Compass,
  packages: MapPin,
  blogs: Newspaper,
  gallery: ImageIcon,
  departures: Calendar,
  destinations: MapPin,
};

export function EmptyState({
  type = "treks",
  title,
  description,
  action,
  className,
  minHeight = "300px",
}: EmptyStateProps) {
  const Icon = iconMap[type];

  const defaultContent = {
    treks: {
      title: "No Treks Available",
      description: "Check back soon for exciting new trekking adventures.",
    },
    packages: {
      title: "No Packages Available",
      description: "We're curating amazing packages for you. Stay tuned!",
    },
    blogs: {
      title: "No Blogs Yet",
      description: "Our travel stories are being written. Check back soon!",
    },
    gallery: {
      title: "No Images Available",
      description: "Our adventure photos are being uploaded.",
    },
    departures: {
      title: "No Upcoming Departures",
      description: "New departure dates will be announced soon.",
    },
    destinations: {
      title: "No Destinations Found",
      description: "Explore our other amazing locations.",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-lg bg-gray-50/50 border border-dashed border-gray-200",
        className,
      )}
      style={{ minHeight }}
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <TypographyH3 className="text-gray-600 font-semibold mb-2">
        {title || defaultContent[type].title}
      </TypographyH3>
      <TypographyP className="text-gray-500 max-w-md mb-4">
        {description || defaultContent[type].description}
      </TypographyP>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

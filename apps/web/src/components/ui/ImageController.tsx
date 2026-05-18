import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageComponentProps {
  imageSrc: string;
  imageAlt: string;
  sizes: string;
  aspectRatio: string;
  customClass?: string;
  loading?: "eager" | "lazy";
  priority?: boolean;
}

export default function ImageComponent({
  imageSrc,
  imageAlt,
  sizes,
  aspectRatio,
  customClass,
  loading = "lazy",
  priority = false,
}: ImageComponentProps) {
  return (
    <div className={`relative ${aspectRatio} h-full w-full`}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        className={cn("h-full w-full object-contain", customClass)}
        fill
        sizes={sizes}
        priority={priority ? true : undefined}
        loading={priority ? undefined : loading}
      />
    </div>
  );
}

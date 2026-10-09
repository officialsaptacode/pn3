import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Play } from "lucide-react"

export interface VideoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  imageUrl: string
  timeAgo?: string
}

export function VideoCard({
  title,
  imageUrl,
  timeAgo,
  className,
  ...props
}: VideoCardProps) {
  return (
    <div className={cn("group relative cursor-pointer overflow-hidden rounded-xl aspect-video", className)} {...props}>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 to-transparent" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      
      <div className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
        <Play className="h-8 w-8 fill-current ml-1" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 p-6 text-white">
        <h3 className="mb-2 text-xl font-bold leading-snug text-white">
          {title}
        </h3>
        {timeAgo && (
          <div className="text-sm font-medium text-white/80">
            {timeAgo}
          </div>
        )}
      </div>
    </div>
  )
}

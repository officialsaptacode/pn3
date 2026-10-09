import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface ListCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  imageUrl?: string
  timeAgo?: string
}

export function ListCard({
  title,
  imageUrl,
  timeAgo,
  className,
  ...props
}: ListCardProps) {
  return (
    <div className={cn("group flex flex-row items-center gap-4 cursor-pointer", className)} {...props}>
      {imageUrl && (
        <div className="relative h-[80px] w-[120px] shrink-0 overflow-hidden rounded-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {timeAgo && (
          <div className="text-sm font-medium text-muted-foreground">
            {timeAgo}
          </div>
        )}
      </div>
    </div>
  )
}

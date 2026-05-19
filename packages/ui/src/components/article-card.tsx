import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Card, CardContent } from "@workspace/ui/components/card"

export interface ArticleCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string
  imageUrl?: string
  timeAgo?: string
  category?: string
}

export function ArticleCard({
  title,
  imageUrl,
  timeAgo,
  category,
  className,
  ...props
}: ArticleCardProps) {
  return (
    <Card className={cn("group cursor-pointer overflow-hidden border-none shadow-none bg-transparent flex flex-col gap-3", className)} {...props}>
      {imageUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          {category && (
            <span className="absolute top-2 left-2 z-10 rounded-full bg-primary px-3 py-1 text-[12px] font-bold uppercase tracking-[0.5px] text-primary-foreground">
              {category}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <CardContent className="p-0">
        <h3 className="text-lg md:text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {timeAgo && (
          <div className="mt-2 text-sm font-medium text-muted-foreground">
            {timeAgo}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

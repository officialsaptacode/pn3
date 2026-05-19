import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface NewsTickerProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  items: string[]
}

export function NewsTicker({
  label,
  items,
  className,
  ...props
}: NewsTickerProps) {
  return (
    <div className={cn("relative z-10 flex items-center overflow-hidden bg-foreground text-background text-sm", className)} {...props}>
      <span className="relative z-20 shrink-0 whitespace-nowrap bg-primary px-4 py-2 font-bold text-primary-foreground shadow-[2px_0_10px_rgba(0,0,0,0.5)]">
        {label}
      </span>
      <div className="flex-1 overflow-hidden whitespace-nowrap py-2 flex">
        <div className="inline-flex min-w-full animate-marquee items-center pl-4">
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <span className="font-medium hover:text-primary transition-colors cursor-pointer">{item}</span>
              <span className="mx-6 text-muted-foreground/30">•</span>
            </React.Fragment>
          ))}
          {/* Duplicate items for seamless looping */}
          {items.map((item, i) => (
            <React.Fragment key={`dup-${i}`}>
              <span className="font-medium hover:text-primary transition-colors cursor-pointer">{item}</span>
              <span className="mx-6 text-muted-foreground/30">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

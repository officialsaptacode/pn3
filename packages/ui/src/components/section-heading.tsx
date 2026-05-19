import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  linkText?: string
  linkHref?: string
}

export function SectionHeading({
  title,
  subtitle,
  linkText,
  linkHref,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div className={cn("flex justify-between items-end mb-4 border-b border-border pb-2", className)} {...props}>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl md:text-2xl font-bold text-foreground border-l-4 border-primary pl-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground pl-4">
            {subtitle}
          </p>
        )}
      </div>
      {linkText && linkHref && (
        <a 
          href={linkHref} 
          className="text-sm font-medium text-primary hover:text-accent-foreground transition-colors"
        >
          {linkText} <span aria-hidden="true">&rarr;</span>
        </a>
      )}
    </div>
  )
}

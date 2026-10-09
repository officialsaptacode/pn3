import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"

export interface FilterTabsProps {
  defaultValue: string
  tabs: {
    value: string
    label: string
    content: React.ReactNode
  }[]
  className?: string
}

export function FilterTabs({ defaultValue, tabs, className }: FilterTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={cn("w-full", className)}>
      <TabsList className="flex h-auto w-full items-center justify-start gap-2 overflow-x-auto rounded-none border-b-0 bg-transparent p-0 pb-1 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-full border border-border bg-background px-5 py-2 text-sm font-medium transition-all hover:bg-secondary data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6 animate-in fade-in-50 duration-300">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

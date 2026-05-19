"use client";

import * as React from "react";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { getStocks, Stock } from "@/lib/api";
import { mockStocks } from "@/lib/mock-data";

export function NepseScroller() {
  const [stocks, setStocks] = React.useState<Stock[]>(mockStocks);

  React.useEffect(() => {
    getStocks().then(setStocks);
  }, []);

  // Double stocks array for a seamless loop
  const scrolledStocks = [...stocks, ...stocks];

  return (
    <div className="relative z-10 hidden sm:flex items-center overflow-hidden bg-zinc-900 border-b border-zinc-800 text-zinc-300 text-xs h-9">
      {/* NEPSE Badge */}
      <div className="relative z-20 shrink-0 flex items-center gap-1.5 bg-red-600 px-4 h-full font-bold text-white shadow-[3px_0_10px_rgba(0,0,0,0.5)] tracking-wider">
        <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
        NEPSE
      </div>

      {/* Marquee Track */}
      <div className="flex-1 overflow-hidden whitespace-nowrap h-full flex items-center">
        <div className="inline-flex min-w-full animate-marquee items-center pl-4 gap-8">
          {scrolledStocks.map((stock, i) => (
            <div key={`${stock.symbol}-${i}`} className="inline-flex items-center gap-2 select-none">
              <span className="font-bold text-white">{stock.symbol}</span>
              <span className="font-mono text-zinc-400">{stock.price}</span>
              <span
                className={cn(
                  "inline-flex items-center text-[10px] font-semibold font-mono",
                  stock.direction === "up" && "text-emerald-500",
                  stock.direction === "down" && "text-rose-500",
                  stock.direction === "flat" && "text-zinc-500"
                )}
              >
                {stock.direction === "up" && <ArrowUpRight className="h-3 w-3 mr-0.5 shrink-0" />}
                {stock.direction === "down" && <ArrowDownRight className="h-3 w-3 mr-0.5 shrink-0" />}
                {stock.direction === "flat" && <Minus className="h-3 w-3 mr-0.5 shrink-0" />}
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Status */}
      <div className="relative z-20 shrink-0 flex items-center gap-1.5 bg-zinc-800 border-l border-zinc-700 px-4 h-full text-zinc-400 font-medium select-none shadow-[-3px_0_10px_rgba(0,0,0,0.2)]">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
        Market Closed
      </div>
    </div>
  );
}

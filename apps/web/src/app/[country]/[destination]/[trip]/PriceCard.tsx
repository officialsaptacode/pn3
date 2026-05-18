"use client";

import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { CalendarDays } from "lucide-react";
import { useRef, useState } from "react";

// Safely parse and format price for display
function parseDisplayPrice(price?: string | number | null): number {
  if (price === null || price === undefined || price === "") return 0;
  const num = typeof price === "number" ? price : parseFloat(String(price).replace(/[^0-9.]/g, ""));
  return Number.isNaN(num) ? 0 : num;
}

interface PriceCardProps {
  basePriceUSD?: string | number | null; // USD price (primary)
  price?: string | number | null; // NPR price (fallback)
  priceUsd?: string | number | null; // USD price (secondary fallback)
}

export default function PriceCard({ basePriceUSD, priceUsd, price }: PriceCardProps) {
  const [activeTab, setActiveTab] = useState<"booking" | "enquiry">("booking");
  const [adults, setAdults] = useState(1);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Priority: basePriceUSD → priceUsd → price (only as last resort)
  let displayPrice = 0;
  let priceSource = "none";

  if (basePriceUSD !== undefined && basePriceUSD !== null && basePriceUSD !== "") {
    displayPrice = parseDisplayPrice(basePriceUSD);
    priceSource = "basePriceUSD";
  } else if (priceUsd !== undefined && priceUsd !== null && priceUsd !== "") {
    displayPrice = parseDisplayPrice(priceUsd);
    priceSource = "priceUsd";
  } else if (price !== undefined && price !== null && price !== "") {
    displayPrice = parseDisplayPrice(price);
    priceSource = "price";
  }

  // Total = price per person × number of adults
  const totalPrice = displayPrice * adults;

  const handleCalendarClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Don't render if no price is available
  if (displayPrice === 0) {
    return null;
  }

  // Determine currency symbol based on price source
  const currencySymbol = priceSource === "price" ? "$" : "$";

  return (
    <Card className="p-6 space-y-4 max-w-sm md:max-w-full xl:max-w-sm mx-auto ">
      {/* Price */}
      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-500">Price</span>
          <span className="text-sm text-gray-600 font-bold">From</span>
        </div>

        <div className="text-3xl font-bold text-gray-600">
          {currencySymbol}
          {displayPrice.toLocaleString()}{" "}
          <span className="text-xs font-normal text-gray-500">/per person</span>
        </div>
      </div>

      {/* Optional: Show price source indicator (for development/debugging) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 text-right">
          Source: {priceSource}
        </div>
      )} */}

      <hr />

      {/* Tabs */}
      <div className="relative flex items-center justify-between">
        <button
          onClick={() => setActiveTab("booking")}
          className={`text-sm font-medium px-2 ${
            activeTab === "booking" ? "text-orange-600" : "text-gray-600"
          }`}
        >
          Booking Form
        </button>

        <div className="absolute left-1/2 top-1/2 h-4 w-px -translate-x-1/2 -translate-y-1/2 bg-gray-300" />

        <button
          onClick={() => setActiveTab("enquiry")}
          className={`text-sm font-medium px-2 ${
            activeTab === "enquiry" ? "text-orange-600" : "text-gray-600"
          }`}
        >
          Enquiry Form
        </button>
      </div>

      <hr />

      {/* ================= BOOKING FORM ================= */}
      {activeTab === "booking" && (
        <>
          {/* Date Picker */}
          <div className="flex flex-col border-b border-gray-300 pb-1">
            <div className="flex justify-between items-start text-gray-700">
              <div className="flex flex-col">
                <span className="text-base font-bold text-gray-600">Date</span>

                <div className="relative w-[150px] mt-1">
                  <input
                    ref={dateInputRef}
                    type="date"
                    className="hide-calendar w-full py-1.5 pr-10 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleCalendarClick}
                className="text-orange-500 hover:text-orange-600 mt-6"
                aria-label="Open calendar"
              >
                <CalendarDays className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Adults */}
          <div className="flex justify-between items-center text-gray-700 border-b pb-2">
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-600">Adults </span>
              <span>
                over 18 ({currencySymbol}
                {displayPrice.toLocaleString()})
              </span>
            </div>
            <input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-16 rounded-md border border-gray-300 px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Dynamic total */}
          {adults > 1 && (
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Total ({adults} adults)</span>
              <span className="font-semibold text-gray-700">
                {currencySymbol}
                {totalPrice.toLocaleString()}
              </span>
            </div>
          )}

          <Button className="w-full bg-[#F97316] text-white mt-2 hover:bg-primary/90">
            Book Now For {currencySymbol}
            {totalPrice.toLocaleString()}
          </Button>
        </>
      )}

      {/* ================= ENQUIRY FORM ================= */}
      {activeTab === "enquiry" && (
        <form className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-black">*</span>
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address <span className="text-black">*</span>
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={4}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Button type="submit" className="w-full bg-[#F97316] text-white hover:bg-primary/90">
            Send Enquiry
          </Button>
        </form>
      )}
    </Card>
  );
}

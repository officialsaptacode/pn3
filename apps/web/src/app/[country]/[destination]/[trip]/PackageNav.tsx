"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PackageNav() {
  const [activeHash, setActiveHash] = useState("#overview");

  useEffect(() => {
    // Set initial hash
    const updateHash = () => {
      setActiveHash(window.location.hash || "#overview");
    };

    updateHash();

    // Listen for hash changes
    window.addEventListener("hashchange", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
    };
  }, []);

  const navItems = [
    { href: "#overview", label: "Overview" },
    { href: "#includes-excludes", label: "Includes/Excludes" },
    { href: "#itinerary", label: "Itinerary" },
    { href: "#essentials", label: "Essentials" },
    { href: "#map", label: "Map" },
    { href: "#faq", label: "FAQ" },
    { href: "#review", label: "Review" },
  ];

  return (
    <div className="sticky top-20 z-10 bg-white">
      <div className="border-b border-gray-100">
        <div className="relative">
          {/* Desktop */}
          <ul className="hidden lg:flex flex-wrap justify-between gap-2 px-4 text-base">
            {navItems.map((item) => {
              const isActive = activeHash === item.href;

              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`
                      block pb-3 px-2 transition-all duration-200
                      ${isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}
                    `}
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* Mobile */}
          <ul className="flex lg:hidden gap-4 px-4 text-base overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = activeHash === item.href;

              return (
                <li key={item.href} className="flex-shrink-0 relative">
                  <Link
                    href={item.href}
                    className={`
                      block pb-3 px-2 whitespace-nowrap transition-all duration-200
                      ${isActive ? "text-orange-600" : "text-gray-700 hover:text-orange-600"}
                    `}
                  >
                    {item.label}
                  </Link>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

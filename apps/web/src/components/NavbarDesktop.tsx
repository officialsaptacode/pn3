import Link from "next/link";
import { manrope } from "../lib/fonts";
import type { NavDestination } from "./navbar.types";
import { SearchBar } from "./Search";

interface NavbarDesktopProps {
  isActive: (path: string) => string;
  destinations: NavDestination[];
  navItems?: any[];
  categories?: any[];
}

export default function NavbarDesktop({
  isActive,
  destinations,
  navItems,
  categories,
}: NavbarDesktopProps) {
  const renderDropdownLinks = (children: any[]) => {
    return (
      <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-x-2 group-hover:translate-x-0 border border-gray-100 py-2">
        {children.map((child, _idx) => (
          <Link
            key={child.id}
            href={child.path || "#"}
            className="block px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50"
          >
            {child.title}
          </Link>
        ))}
      </div>
    );
  };

  const renderDynamicDestinations = () => {
    return (
      <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg overflow-visible opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
        {destinations.map((destination, index) => {
          const isFirst = index === 0;
          const isLast = index === destinations.length - 1;

          if (destination.secondLayer && destination.secondLayer.length > 0) {
            return (
              <div
                key={destination.title}
                className={`relative flex items-center justify-between px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 cursor-pointer group/dest ${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
              >
                <Link
                  href={destination.path}
                  className="flex-1 font-medium text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {destination.title}
                </Link>
                <i className="fas fa-chevron-right text-xs flex-shrink-0 ml-2"></i>

                <div className="absolute top-0 left-full ml-1 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover/dest:opacity-100 group-hover/dest:visible transition-all duration-200 z-[60] border border-gray-100 pointer-events-none group-hover/dest:pointer-events-auto">
                  <div className="py-1">
                    {destination.secondLayer?.map((region, rIdx, arr) => (
                      <Link
                        key={region.title}
                        href={region.path}
                        className={`block px-4 py-2.5 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 ${rIdx === 0 ? "rounded-t-lg" : ""} ${rIdx === arr.length - 1 ? "rounded-b-lg" : ""}`}
                      >
                        {region.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={destination.title}
              href={destination.path}
              className={`block px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 ${isFirst ? "rounded-t-lg" : ""} ${isLast ? "rounded-b-lg" : ""}`}
            >
              {destination.title}
            </Link>
          );
        })}
      </div>
    );
  };

  const renderDynamicTours = () => {
    return (
      <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-x-2 group-hover:translate-x-0 border border-gray-100 py-1">
        {categories?.map((cat, idx, arr) => (
          <Link
            key={cat.slug}
            href={`/tours/${cat.slug}`}
            className={`block px-4 py-3 text-sm text-gray-700 hover:text-orange-500 hover:bg-orange-50 ${idx === 0 ? "rounded-t-lg" : ""} ${idx === arr.length - 1 ? "rounded-b-lg" : ""}`}
          >
            {cat.label}
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav
      className={`hidden xl:flex gap-6 xl:gap-10 text-base font-semibold text-white uppercase ${manrope.className}`}
    >
      {navItems?.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const isDropdown =
          hasChildren || item.type === "DYNAMIC_DESTINATIONS" || item.type === "DYNAMIC_TOURS";

        if (isDropdown) {
          return (
            <div key={item.id} className="relative group">
              <button
                type="button"
                className="flex items-center hover:text-orange-400 focus:outline-none uppercase pb-1"
              >
                {item.title}
                <i className="fas fa-chevron-down w-4 h-4 ml-2"></i>
              </button>
              {item.type === "DYNAMIC_DESTINATIONS" && renderDynamicDestinations()}
              {item.type === "DYNAMIC_TOURS" && renderDynamicTours()}
              {item.type === "LINK" && hasChildren && renderDropdownLinks(item.children)}
              {!item.type && hasChildren && renderDropdownLinks(item.children)}
            </div>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.path || "#"}
            className={`relative pb-1 ${isActive(item.path || "")}`}
          >
            {item.title}
          </Link>
        );
      })}

      <div className="ml-auto">
        <SearchBar />
      </div>
    </nav>
  );
}

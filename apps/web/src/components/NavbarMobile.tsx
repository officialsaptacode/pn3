import Image from "next/image";
import Link from "next/link";
import type { NavDestination } from "./navbar.types";

interface NavbarMobileProps {
  isMenuOpen: boolean;
  closeMenu: () => void;
  destinations: NavDestination[];
  openAllToursMobile: boolean;
  setOpenAllToursMobile: (value: boolean) => void;
  openDestinationsMobile: boolean;
  setOpenDestinationsMobile: (value: boolean) => void;
  openNepalMobile: boolean;
  setOpenNepalMobile: (value: boolean) => void;
  openMoreMobile: boolean;
  setOpenMoreMobile: (value: boolean) => void;
  navItems?: any[];
  categories?: any[];
}

export default function NavbarMobile({
  isMenuOpen,
  closeMenu,
  destinations,
  openAllToursMobile,
  setOpenAllToursMobile,
  openDestinationsMobile,
  setOpenDestinationsMobile,
  openNepalMobile,
  setOpenNepalMobile,
  openMoreMobile,
  setOpenMoreMobile,
  navItems,
  categories,
}: NavbarMobileProps) {
  return (
    <div
      className={`fixed top-0 right-0 w-full md:w-80 h-full bg-white shadow-lg transform transition-transform duration-300 z-[80] xl:hidden ${
        isMenuOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <div className="h-20 flex justify-between items-center px-5 border-b border-gray-200">
          <Link href="/" onClick={closeMenu} className="h-10 flex items-center">
            <Image
              src="/logo.png"
              alt="Amazing Nepal Adventure"
              width={128}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={closeMenu}
            className="text-gray-700 hover:text-gray-900 focus:outline-none p-2 rounded-full hover:bg-gray-100 h-10 w-10 flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-0">
            {navItems?.map((item, idx) => {
              const hasChildren = Boolean(item.children?.length);
              const _isDropdown =
                hasChildren ||
                item.type === "DYNAMIC_DESTINATIONS" ||
                item.type === "DYNAMIC_TOURS";

              if (item.type === "DYNAMIC_TOURS") {
                return (
                  <div key={item.id || idx}>
                    <button
                      type="button"
                      onClick={() => setOpenAllToursMobile(!openAllToursMobile)}
                      className="w-full flex justify-between items-center py-3 px-6 text-base font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-500 border-b border-gray-100 uppercase"
                    >
                      <span>{item.title}</span>
                      <i
                        className={`fas fa-chevron-down transition-transform ${openAllToursMobile ? "rotate-180" : ""}`}
                      ></i>
                    </button>
                    {openAllToursMobile && (
                      <div className="bg-gray-50 border-b border-gray-100">
                        {categories?.map((cat) => (
                          <Link
                            key={cat.slug}
                            href={`/tours/${cat.slug}`}
                            onClick={closeMenu}
                            className="block py-2 px-10 text-sm text-gray-600 hover:text-orange-500 hover:bg-white"
                          >
                            {cat.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.type === "DYNAMIC_DESTINATIONS") {
                return (
                  <div key={item.id || idx}>
                    <button
                      type="button"
                      onClick={() => setOpenDestinationsMobile(!openDestinationsMobile)}
                      className="w-full flex justify-between items-center py-3 px-6 text-base font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-500 border-b border-gray-100 uppercase"
                    >
                      <span>{item.title}</span>
                      <i
                        className={`fas fa-chevron-down transition-transform ${openDestinationsMobile ? "rotate-180" : ""}`}
                      ></i>
                    </button>
                    {openDestinationsMobile && (
                      <div className="bg-gray-50 border-b border-gray-100">
                        {destinations.map((destination) => (
                          <div key={destination.title}>
                            {destination.secondLayer ? (
                              <div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (destination.title === "Nepal") {
                                      setOpenNepalMobile(!openNepalMobile);
                                    }
                                  }}
                                  className="w-full flex justify-between items-center py-2 px-10 text-sm text-gray-600 hover:text-orange-500 hover:bg-white"
                                >
                                  <span>{destination.title}</span>
                                  <i
                                    className={`fas fa-chevron-right transition-transform text-xs ${destination.title === "Nepal" && openNepalMobile ? "rotate-90" : ""}`}
                                  ></i>
                                </button>
                                {destination.title === "Nepal" && openNepalMobile && (
                                  <div className="ml-4 bg-white">
                                    {destination.secondLayer.map((region) => (
                                      <Link
                                        key={region.title}
                                        href={region.path}
                                        onClick={closeMenu}
                                        className="block py-2 px-14 text-sm text-gray-600 hover:text-orange-500"
                                      >
                                        {region.title}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={destination.path}
                                onClick={closeMenu}
                                className="block py-2 px-10 text-sm text-gray-600 hover:text-orange-500 hover:bg-white"
                              >
                                {destination.title}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (item.type === "LINK" && hasChildren) {
                // If it's a regular dropdown link, since we don't have dynamic boolean states for unlimited menus,
                // we'll just map them. For this quick refactor, we reuse More state or just render them flat.
                // Ideally we'd use a tracked object state of `openStates[item.id]`.
                return (
                  <div key={item.id || idx}>
                    <button
                      type="button"
                      className="w-full flex justify-between items-center py-3 px-6 text-base font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-500 border-b border-gray-100 uppercase"
                    >
                      <span>{item.title}</span>
                    </button>
                    <div className="bg-gray-50 border-b border-gray-100">
                      {item.children?.map((child: any) => (
                        <Link
                          key={child.id}
                          href={child.path || "#"}
                          onClick={closeMenu}
                          className="block py-2 px-10 text-sm text-gray-600 hover:text-orange-500 hover:bg-white"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.id || idx}
                  href={item.path || "#"}
                  onClick={closeMenu}
                  className="block py-3 px-6 text-base font-semibold text-gray-800 hover:bg-orange-50 hover:text-orange-500 border-b border-gray-100 uppercase"
                >
                  {item.title}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile CTA */}
        <div className="p-4 border-t border-gray-200">
          <Link href="/booking" onClick={closeMenu}>
            <button
              type="button"
              className="w-full bg-orange-500 hover:bg-orange-600 transition rounded-lg px-5 py-3 text-white font-semibold flex items-center justify-center space-x-2 shadow-md h-12"
            >
              <span>Book Now</span>
              <i className="fa fa-arrow-right ml-2"></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { manrope } from "../lib/fonts";
import {
  TypographyBase,
  TypographyLarge,
  TypographyLead,
  TypographySmall,
} from "../lib/typography";

export function SiteFooter() {
  return (
    <footer className="bg-[#374151] text-white">
      <div className="container items-center justify-between px-5 md:px-8 w-full max-w-8xl mx-auto py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Logo + Description */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Amazing Nepal Adventure"
                width={200}
                height={200}
                className="h-15 w-auto select-none"
              />
            </div>

            <TypographyBase className=" text-white mb-6! font-medium leading-6.25">
              Dive into local recommendations for a truly authentic experience.
            </TypographyBase>

            <div className="flex items-start gap-2 text-sm">
              <svg className="h-5 w-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 22 20">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div>
                <div className="text-white text-base font-medium">Need help? Call us</div>
                <a href="tel:+9779856011727" className="no-underline">
                  <TypographyLead className="absolute text-2xl xl:text-lg 2xl:text-2xl font-extrabold text-[#F97316] ">
                    +977 9856011727
                  </TypographyLead>
                </a>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <TypographyLarge className="text-lg font-bold mb-4">Quick Navigation</TypographyLarge>
            <ul className={`space-y-3 text-base ${manrope}`}>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-gray-300 hover:text-white">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <TypographyLarge className="text-lg font-bold mb-4">Destinations</TypographyLarge>
            <ul className={`space-y-3 text-base ${manrope}`}>
              <li>
                <Link href="/treks/nepal" className="text-gray-300 hover:text-white">
                  Nepal
                </Link>
              </li>
              <li>
                <Link href="/treks/bhutan" className="text-gray-300 hover:text-white">
                  Bhutan
                </Link>
              </li>
              <li>
                <Link href="/treks/india" className="text-gray-300 hover:text-white">
                  India
                </Link>
              </li>
              <li>
                <Link href="/treks/tibet" className="text-gray-300 hover:text-white">
                  Tibet
                </Link>
              </li>
            </ul>
          </div>

          {/* Nepal */}
          {/* <div>
            <TypographyLarge className="text-lg font-bold mb-4">Nepal</TypographyLarge>
            <ul className={`space-y-3 text-base ${manrope}`}>
              <li>
                <Link href="/treks/annapurna" className="text-gray-300 hover:text-white">
                  Annapurna Base Camp
                </Link>
              </li>
              <li>
                <Link href="/treks/everest" className="text-gray-300 hover:text-white">
                  Everest Base Camp
                </Link>
              </li>
              <li>
                <Link href="/treks/mardi-himal" className="text-gray-300 hover:text-white">
                  Mardi Himal Trek
                </Link>
              </li>
              <li>
                <Link href="/treks/manaslu" className="text-gray-300 hover:text-white">
                  Manaslu Circuit Trek
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company (Right) */}
          <div>
            <TypographyLarge className="text-lg font-bold mb-4">Company</TypographyLarge>
            <ul className={`space-y-3 text-base ${manrope}`}>
              <li>
                <Link href="/terms " className="text-gray-300 hover:text-white">
                  Terms & Condition
                </Link>
              </li>
              <li>
                <Link href="/visa" className="text-gray-300 hover:text-white">
                  Visa & Passports
                </Link>
              </li>
              <li>
                <Link href="/beforeTrips" className="text-gray-300 hover:text-white">
                  Before Your Trips
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Follow us + icons */}
          <div className="flex flex-col items-center gap-4 order-1 md:order-2 md:items-end">
            <TypographyLarge className="text-lg font-bold">Follow us</TypographyLarge>

            <div className="flex gap-3">
              <Link
                href="https://www.youtube.com/channel/UCrV9f-SeBYRzANfBLY1G82g"
                className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <Youtube className="h-5 w-5 text-white" />
              </Link>

              <Link
                href="https://www.instagram.com/amazingnepaladventure/"
                className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Link>

              <Link
                href="https://www.facebook.com//amazingnepaladventure/"
                className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center"
              >
                <Facebook className="h-5 w-5 text-white" />
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <TypographySmall className="text-sm text-white text-center font-medium order-2 md:order-1">
            © 2025 Amazing Nepal Adventures Pvt. Ltd. All rights reserved.
          </TypographySmall>
        </div>
      </div>
    </footer>
  );
}

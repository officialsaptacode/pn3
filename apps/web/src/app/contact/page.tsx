import { CardContent } from "@workspace/ui/components/card";
import Image from "next/image";
import { InquiryForm } from "@/components/inquiry-form";
import { TypographyH2, TypographyP, TypographySmall } from "~/src/lib/typography";

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/contactusbg.jpg"
          alt="Contact Us"
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white">
            Contact Us
          </TypographyH2>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-22">
            {/* Left Column: Get in Touch + Form + Contact Info */}
            <div className="order-2 lg:order-1">
              {/* Get in Touch - Hidden on mobile since it's in the right column for mobile */}
              <div className="hidden lg:block mb-8">
                <TypographyH2 className="font-semibold text-gray-700 mb-4">
                  Get in Touch
                </TypographyH2>
                <TypographyP className="text-gray-500 font-semibold !leading-[24px] tracking-[1%]">
                  Our office is open for face-to-face consultations, trip planning, and last-minute
                  bookings. Visit us to meet our team, discuss your dream itinerary, or enjoy a
                  complimentary Nepali tea!
                </TypographyP>
              </div>

              {/* Inquiry Form */}
              <div className="mb-8">
                <InquiryForm />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                {/* Phone */}
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="h-7 w-7 flex items-center justify-center">
                    <Image src="/phone.png" alt="phone" width={20} height={20} />
                  </div>
                  <div className="flex flex-col">
                    <TypographySmall className="text-gray-500 mb-1 text-sm">PHONE</TypographySmall>
                    <TypographySmall className="text-orange-600 text-sm leading-[20px] tracking-[2%]">
                      <a href="tel:+9779851030051" className="hover:underline">
                        +977 9851030051
                      </a>
                    </TypographySmall>
                  </div>
                </CardContent>

                {/* Email */}
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <Image src="/email.png" alt="email" width={20} height={20} />
                  </div>
                  <div className="flex flex-col">
                    <TypographySmall className="text-gray-500 mb-1 text-sm">EMAIL</TypographySmall>
                    <TypographySmall className="text-orange-600 text-sm leading-[20px] tracking-[2%]">
                      <a href="mailto:info@amazingnepaladventure.com" className="hover:underline">
                        info@amazing
                        <br />
                        nepaladventure.com
                      </a>
                    </TypographySmall>
                  </div>
                </CardContent>

                {/* Emergency number */}
                <CardContent className="p-2 flex items-center gap-2">
                  <div className="h-7 w-7 flex items-center justify-center flex-shrink-0">
                    <Image src="/emergency.png" alt="fax" width={20} height={20} />
                  </div>
                  <div className="flex flex-col whitespace-nowrap flex-shrink-0">
                    <TypographySmall className="text-red-600 mb-1 text-sm">
                      EMERGENCY NUMBER
                    </TypographySmall>
                    <TypographySmall className="text-orange-600 text-sm leading-[20px] tracking-[2%]">
                      <a href="tel:+9779818340727" className="hover:underline">
                        +977 9818340727
                      </a>
                    </TypographySmall>
                  </div>
                </CardContent>
              </div>
            </div>

            {/* Right Column: Map + Get in Touch (mobile) - Full height */}
            <div className="flex flex-col order-1 lg:order-2">
              {/* Get in Touch - Show on mobile only */}
              <div className="lg:hidden mb-8">
                <TypographyH2 className="font-semibold text-gray-700 mb-4">
                  Get in Touch
                </TypographyH2>
                <TypographyP className="text-gray-500 font-semibold !leading-[24px] tracking-[1%]">
                  Our office is open for face-to-face consultations, trip planning, and last-minute
                  bookings. Visit us to meet our team, discuss your dream itinerary, or enjoy a
                  complimentary Nepali tea!
                </TypographyP>
              </div>

              {/* Map - Mobile: comes right after Get in Touch */}
              <div className="lg:hidden relative h-[300px] rounded-lg overflow-hidden mb-8">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7064.3363715916585!2d85.312976!3d27.712093!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f23994ac9f%3A0xf962e0463250957c!2sAmazing%20Nepal%20Adventure!5e0!3m2!1sen!2sin!4v1768724474194!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Desktop Map - Full height */}
              <div className="hidden lg:block relative h-full rounded-lg overflow-hidden">
                <iframe
                  title="Google Map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7064.3363715916585!2d85.312976!3d27.712093!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19f23994ac9f%3A0xf962e0463250957c!2sAmazing%20Nepal%20Adventure!5e0!3m2!1sen!2sin!4v1768724474194!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  className="rounded-lg"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

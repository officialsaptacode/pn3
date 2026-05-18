import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { manrope } from "~/src/lib/fonts";
import { TypographyBase, TypographyH2 } from "~/src/lib/typography";

export default function FAQPage() {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/contactusbg.jpg"
          alt="Frequently Asked Questions"
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className=" font-semibold text-white leading[133%] ">
            Frequently Asked Questions
          </TypographyH2>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 lg:py-24 px-5">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <TypographyH2 className=" font-semibold text-gray-700 mb-4">
              Most Asked Questions
            </TypographyH2>
            <TypographyBase className="text-gray-500 max-w-2xl mx-auto mb-8">
              Get answers to common questions about our services and travel experiences
            </TypographyBase>

            <div className="relative max-w-4xl mx-auto mt-4">
              <Input
                type="text"
                placeholder="Search your question"
                className={`h-14 pl-4 pr-4 rounded-lg text-sm text-gray-500 ${manrope}`}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-6 ">
            <Button
              className={`bg-orange-500 hover:bg-[#f65804] text-white rounded-full font-medium ${manrope} text-sm`}
            >
              Destination-Specific
            </Button>
            <Button
              variant="outline"
              className={`rounded-full bg-[#E5E7EB] ${manrope}text-gray-700 font-medium text-sm`}
            >
              Travel Essentials
            </Button>
            <Button
              variant="outline"
              className={`rounded-full bg-[#E5E7EB] ${manrope} text-gray-700 font-medium text-sm`}
            >
              About Us
            </Button>
          </div>

          {/* FAQ Accordion */}
          {/* <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-700">
                How do we book tours online?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base">
                Booking with us is simple and secure. Browse our curated destinations, select your
                preferred package, and follow the step-by-step booking process. You'll receive
                instant confirmation and detailed itineraries in your inbox.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-700">
                How much is the booking fee?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base">
                We charge a minimal booking fee of $50 per person, which goes towards processing
                your reservation and providing 24/7 customer support throughout your journey. This
                fee is clearly displayed during the checkout process.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-700">
                How do we book tours online?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base">
                Simply visit our website, choose your destination, select dates, and complete the
                secure payment process. You'll receive immediate confirmation via email with all
                necessary details for your trip.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-700">
                What travel documents do I need?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base">
                You'll need a valid passport with at least 6 months validity, visa (if required for
                your destination), travel insurance, and any vaccination certificates. We provide a
                detailed checklist upon booking confirmation.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-700">
                Can I modify or cancel my booking?
              </AccordionTrigger>
              <AccordionContent className="text-gray-700 text-base">
                Yes, modifications and cancellations are possible subject to our terms and
                conditions. Cancellations made 30+ days before departure receive full refunds minus
                the booking fee. Contact our support team for assistance.
              </AccordionContent>
            </AccordionItem>
          </Accordion> */}
        </div>
      </section>
    </main>
  );
}

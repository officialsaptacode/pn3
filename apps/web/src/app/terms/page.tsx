import Image from "next/image";
import { TypographyH2, TypographyH3, TypographyP } from "~/src/lib/typography";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and Conditions for using our website",
};

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/contactusbg.jpg"
          alt="Book Your Adventure Now"
          fill
          className="object-cover object-[center_25%] brightness-75"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className=" font-semibold text-white ">Terms & Conditions</TypographyH2>
        </div>
      </section>

      {/* Page Title */}
      <div className="container mx-auto space-y-4 px-4 mt-20 mb-20">
        <div className="">
          <TypographyH3 className="text-gray-700 font-bold">Terms & Conditions</TypographyH3>
          <TypographyP className="text-gray-500">Last updated: January 8, 2026</TypographyP>
        </div>

        <TypographyP className="text-gray-500">
          Welcome to Amazing Nepal Adventure. These Terms and Conditions govern your use of our
          website and services. By accessing or using our site, you agree to comply with these
          terms.
        </TypographyP>

        {/* 4. Booking and Payment */}
        <section className="space-y-4">
          <TypographyH3 className="text-gray-700 font-semibold">
            1. Booking and Payment
          </TypographyH3>

          <ul className="space-y-2 list-disc pl-5">
            <li>
              <TypographyP className="text-gray-500">
                A non-refundable deposit of 25% of the total trip cost is required at the time of
                booking.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Full payment must be completed at least 15 days before the departure date.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Bookings made within 15 days of departure require full payment at the time of
                booking.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Payments can be made via bank transfer, credit card, or other accepted methods.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Confirmation of the booking will be provided upon receipt of payment.
              </TypographyP>
            </li>
          </ul>
        </section>

        {/* 5. Cancellation and Refund Policy */}
        <section className="space-y-4">
          <TypographyH3 className="text-gray-700 font-semibold">
            2. Cancellation and Refund Policy
          </TypographyH3>

          <ul className="space-y-2 list-disc pl-5">
            <li>
              <TypographyP className="text-gray-500">
                Cancellations made 30 days or more before departure: 100% refund (excluding the
                deposit).
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Cancellations made between 15 to 29 days before the trek departure date will be
                subject to a 50% cancellation fee.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Cancellations made within 14 days of the trek departure date or no-shows will result
                in a 100% cancellation fee.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                In rare cases where we must cancel a trip due to unforeseen circumstances such as
                extreme weather or factors beyond our control, participants may choose to
                reschedule, take an alternative trip, or receive a full refund.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                Refunds will be processed within 15 business days from the date of cancellation.
                Refund amounts may be subject to transaction or currency conversion fees.
              </TypographyP>
            </li>
          </ul>
        </section>

        {/* 3. Postponement */}
        <section className="space-y-4">
          <TypographyH3 className="text-gray-700 font-semibold">6. Postponement</TypographyH3>

          <TypographyP className="text-gray-500">
            Participants may postpone their trek to a later date, subject to availability, without
            any additional charges if the request is made at least 15 days before the original
            departure date.
          </TypographyP>
        </section>

        {/* 7. Travel Insurance */}
        <section className="space-y-4">
          <TypographyH3 className="text-gray-700 font-semibold">4. Travel Insurance</TypographyH3>

          <ul className="space-y-2 list-disc pl-5">
            <li>
              <TypographyP className="text-gray-500">
                We strongly recommend that all participants obtain comprehensive travel insurance
                covering trip cancellations, medical emergencies, and evacuation expenses.
              </TypographyP>
            </li>
            <li>
              <TypographyP className="text-gray-500">
                The company is not responsible for any losses resulting from insufficient insurance
                coverage.
              </TypographyP>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

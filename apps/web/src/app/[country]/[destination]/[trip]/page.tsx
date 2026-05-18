import { tripService } from "@workspace/api-client";
import TiptapRenderer from "@workspace/ui/components/TiptapRenderer";
import { Check, MapPin, X } from "lucide-react";
import { notFound } from "next/navigation";
import { TypographyBase, TypographyH2, TypographyLead } from "@/lib/typography";
import { manrope } from "~/src/lib/fonts";
import CustomerReviews from "./CustomerReview";
import FAQSection from "./Faq";
import PackageInformation from "./PackageInformation";
import PackageItinerary from "./PackageItinerary";
import PackageNav from "./PackageNav";
import PriceCard from "./PriceCard";
import TripGallery from "./TripGallery";

type Props = {
  params: Promise<{ country: string; destination: string; trip: string }>;
};

export async function generateMetadata({ params }: Props): Promise<import("next").Metadata> {
  const { country, destination, trip: tripSlug } = await params;

  const trip = await tripService.getByPath(country, destination, tripSlug).catch(() => null);

  if (!trip) {
    return {
      title: "Trip Not Found",
    };
  }

  return {
    title: `${trip.title} | Amazing Adventure`,
    description:
      trip.description || trip.overview || `Explore ${trip.title} with Amazing Adventure.`,
    openGraph: {
      images: trip.media && trip.media.length > 0 ? [trip.media[0]?.url || ""] : [],
    },
  };
}

function TripInclusions({ inclusions }: { inclusions?: { description: string }[] }) {
  if (inclusions && inclusions.length > 0) {
    return (
      <ul className="space-y-2">
        {inclusions.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="mt-1 h-4 w-4 text-[#16A34A] flex-shrink-0" />
            <span className="text-gray-500">{item.description}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="space-y-2">
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>Camping gear such as tents and sleeping bags</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>First aid kit including essentials for emergencies</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>Navigation tools like maps and compasses</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>Food supplies and portable cooking equipment</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>Appropriate clothing for varying weather conditions</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <Check className="mt-1 h-4 w-4 text-[#16A34A]" />
        <span>Water purification tablets or filtration system</span>
      </li>
    </ul>
  );
}

function TripExclusions({ exclusions }: { exclusions?: { description: string }[] }) {
  if (exclusions && exclusions.length > 0) {
    return (
      <ul className="space-y-2">
        {exclusions.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <X className="mt-1 h-4 w-4 text-[#F97316] flex-shrink-0" />
            <span className="text-gray-500">{item.description}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="space-y-2">
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Unnecessary luxury items</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Excessive cash or valuables</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Heavy and bulky clothing</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Non-hiking footwear</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Non-reusable items like disposable cutlery</span>
      </li>
      <li className="flex items-start gap-2 text-gray-500">
        <X className="mt-1 h-4 w-4 text-[#F97316]" />
        <span>Technical gadgets without local support</span>
      </li>
    </ul>
  );
}

export default async function TripDetailPage(props: Props) {
  const params = await props.params;
  const { country, destination, trip: tripSlug } = params;

  console.log(
    `[SSR] Fetching trip: country=${country}, destination=${destination}, trip=${tripSlug}`,
  );

  let trip = null;
  try {
    trip = await tripService.getByPath(country, destination, tripSlug, {
      next: { tags: ["trips", `trip-${tripSlug}`] },
    });
    console.log(`[SSR] Trip fetched successfully:`, trip?.title);
  } catch (error) {
    console.error(`[SSR] Failed to fetch trip:`, error);
  }

  if (!trip) {
    notFound();
  }

  // ─── Map image: role is on TripMedia (join table), media.url is on the nested media object ───
  const mapTripMedia = trip.media?.find((m: any) => m.role === "map");
  const _mapImageUrl = mapTripMedia?.media?.url ?? mapTripMedia?.url ?? null;

  const _packingCategories: { name: string; items: { title: string }[] }[] | undefined =
    (trip as any).essentialCategories ?? undefined;

  const mappedFaqs =
    trip.faqs && trip.faqs.length > 0
      ? trip.faqs
          .filter((f: any) => f.tripId === trip.id)
          .map((f: any) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))
      : undefined;

  const mappedReviews =
    trip.reviews && trip.reviews.length > 0
      ? trip.reviews
          .filter((r: any) => r.tripId === trip.id)
          .map((r: any) => ({
            id: r.id,
            name: r.reviewerName || r.user?.userName || "Anonymous",
            avatar: r.avatarUrl || "",
            rating: r.rating ?? 5,
            time: r.createdAt
              ? new Date(r.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
            text: r.content || r.text || "",
            country: r.reviewerCountry,
            title: r.title,
          }))
      : undefined;

  // ─── Price: use basePriceUSD if available, otherwise fall back to price ───
  const _displayPrice = (trip as any).basePriceUSD ?? (trip as any).priceUsd ?? trip.price;

  return (
    <main className={`flex min-h-screen flex-col ${manrope.className}`}>
      <div className="container mt-25 lg:30 mx-auto">
        <div className="px-4">
          <TypographyH2 className="font-semibold">{trip.title}</TypographyH2>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            {/* Rating */}
            {/* <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].slice(0, 1).map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.8</span>
              <span className="text-muted-foreground">(124 reviews)</span>
            </div> */}

            {/* Region */}
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="text-foreground font-medium capitalize">
                {trip?.region || "Nepal"}
              </span>
            </div>

            {/* Users/Booked */}
            {/* <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-foreground font-medium">300+ Booked</span>
            </div> */}
          </div>
        </div>

        {trip.media && trip.media.filter((m: any) => m.role !== "map").length > 0 && (
          <TripGallery
            images={
              trip.media
                .filter((m: any) => m.role !== "map")
                .map((m: any) => ({
                  id: m.id,
                  url: m.media?.url ?? m.url ?? "", // ← unwrap nested media object
                  alt: m.media?.altText ?? m.media?.caption ?? "",
                }))
                .filter((img: any) => img.url) // drop any with empty URLs
            }
            tripTitle={trip.title}
            featuredImage={trip.media[0]?.media?.url ?? trip.media[0]?.url}
          />
        )}

        {/* Package information section */}
        <section>
          <PackageInformation
            duration={trip.duration}
            groupSizeMin={trip.groupSizeMin}
            groupSizeMax={trip.groupSizeMax}
            maxAltitude={trip.maxAltitude}
            bestSeason={trip.bestSeason}
          />
        </section>

        <div className="mt-10 grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-6">
          {/* Left column */}
          <div className="col-span-1 xl:col-span-8">
            <div className="sticky top-20 z-10">
              <PackageNav />
            </div>
            <div className="mt-10">
              {/* Trek Overview */}
              <div className="mb-8 bg-white rounded-xl shadow-sm p-6 md:p-8" id="overview">
                <TypographyLead className="mb-4 font-bold flex gap-2 items-center text-gray-700">
                  Trek Overview
                </TypographyLead>
                <TiptapRenderer
                  content={trip.overview || trip.description || "No overview available."}
                />
              </div>

              <div className="mt-4 mb-4 px-4" id="includes-excludes">
                <TypographyLead className="font-bold text-gray/700">
                  Included / Excluded
                </TypographyLead>
                <TypographyBase className="mt-4 max-w-5xl text-gray/500 mb-4 leading-6">
                  When preparing for the Mardi Himal Trek, it's essential to know what is included
                  in your package and what isn't. Included are accommodations, meals, and guided
                  tours, ensuring a seamless experience. However, personal expenses, travel
                  insurance, and tips for guides are not covered. This clarity will help you budget
                  effectively and enjoy your adventure without surprises.
                </TypographyBase>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8 px-4">
                <div className="mt-5">
                  <TripInclusions inclusions={trip.inclusions} />
                </div>
                <div className="mt-5">
                  <TripExclusions exclusions={trip.exclusions} />
                </div>
              </div>

              <div className="mt-10 px-4" id="itinerary">
                <TypographyLead className="font-bold text-gray/700 mb-6">
                  Day by Day Itinerary
                </TypographyLead>
                {trip.itineraryDays && trip.itineraryDays.length > 0 ? (
                  <PackageItinerary
                    data={trip.itineraryDays.map((day: any, index: number) => ({
                      title: day.title || `Day ${index + 1}`,
                      description: day.description,
                      distance: day.distance,
                      altitude: day.altitude,
                      duration: day.duration,
                      meal: day.meal,
                      accommodation: day.accommodation || day.acco,
                      image: day.image,
                    }))}
                  />
                ) : (
                  <p className="text-muted-foreground p-4">Itinerary details coming soon.</p>
                )}
              </div>
            </div>

            {/* Essentials Section */}
            {/* <div className="mt-10 px-4" id="essentials">
              <PackingList />
            </div> */}
            {/* <div className="mt-10 px-4" id="essentials">
              <PackingList
                tripTitle={trip.title}
                categories={packingCategories}
              />
            </div> */}

            {/* Map Section */}
            {/* <div className="mt-10 px-4" id="map">
              <TypographyH4 className="mb-4 font-semibold">
                Itinerary Map - {trip.title}
              </TypographyH4>
              <TypographyBase className="max-w-3xl mb-4">
                This comprehensive map is designed to guide you through an exciting journey filled
                with remarkable destinations and captivating experiences.
              </TypographyBase>
              <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200">
                {mapImageUrl ? (
                  // Dynamic map image from DB (uploaded via admin)
                  <Image
                    src={mapImageUrl}
                    alt={`${trip.title} Map`}
                    fill
                    className="object-contain"
                  />
                ) : (
                  // Fallback: embed Google Maps
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.434270673436!2d83.70206397611047!3d28.40273849521634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39be0e5a39a2a4b1%3A0x5860d3e1335c3d88!2sGhorepani%2033200%2C%20Nepal!5e0!3m2!1sen!2sus!4v1699876543210!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Location Map"
                  />
                )}
              </div>
            </div> */}

            {/* FAQ Section */}
            <div className="mt-10 px-4" id="faq">
              <FAQSection faqs={mappedFaqs} />
            </div>

            {/* Reviews Section — passes mapped reviews or undefined to trigger defaults */}
            <div className="mt-10 mb-10 px-4" id="review">
              <CustomerReviews reviews={mappedReviews} />
            </div>
          </div>

          {/* Right column - Price card */}
          <div className="col-span-1 xl:col-span-4 order-first xl:order-last px-4 md:py-6 ">
            <div className="sticky top-20">
              {/* <PriceCard price={trip.basePriceUSD} /> */}
              <PriceCard
                price={trip.price}
                basePriceUSD={(trip as any).basePriceUSD}
                priceUsd={(trip as any).priceUsd}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

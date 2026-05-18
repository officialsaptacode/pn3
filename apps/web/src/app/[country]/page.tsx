import { destinationService, tripService } from "@workspace/api-client";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { TypographyH1 } from "@/lib/typography";
import DestinationClient from "~/src/components/DestinationClient";

export async function generateStaticParams() {
  try {
    const response = await destinationService.findAll();
    const destinations = response.data || [];
    return destinations
      .filter((dest: any) => dest.type === "COUNTRY")
      .map((dest: any) => ({
        country: dest.slug,
      }));
  } catch (_error) {
    return [];
  }
}

export async function generateMetadata(props: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const countryDetails = await destinationService.getBySlug(params.country).catch(() => null);

  if (!countryDetails) {
    return {
      title: "Country Not Found",
    };
  }

  return {
    title: `${countryDetails.name} Travel Guide & Packages`,
    description:
      countryDetails.description || `Explore ${countryDetails.name} with our top packages.`,
    openGraph: {
      title: `${countryDetails.name} Travel Guide`,
      description: countryDetails.description || `Explore ${countryDetails.name}`,
    },
  };
}

export default async function Page(props: { params: Promise<{ country: string }> }) {
  const params = await props.params;
  const countryParams = params.country;

  console.log(`[SSR] CountryPage: fetching country=${countryParams}`);

  let countryDetails = null;
  try {
    countryDetails = await destinationService.getBySlug(countryParams);
  } catch (error) {
    console.error(`[SSR] Failed to fetch country ${countryParams}:`, error);
  }

  if (!countryDetails) {
    console.log(`[SSR] Country not found: ${countryParams}`);
    notFound();
  }

  // Fetch all trips and filter by those linked to this country
  let trips: any[] = [];
  try {
    const allTrips = await tripService.getAll({ limit: 100 });
    const tripsData = allTrips.data || [];

    // Filter trips that have this country as a destination
    trips = tripsData.filter((trip: any) => {
      // Check if trip has destinations array with this country's ID
      const hasCountryDestination = trip.destinations?.some(
        (d: any) =>
          d.destinationId === countryDetails.id || d.destination?.id === countryDetails.id,
      );
      return hasCountryDestination;
    });

    console.log(`[SSR] Found ${trips.length} trips for country ${countryParams}`);
  } catch (err) {
    console.error(`[SSR] Failed to fetch trips for country ${countryParams}:`, err);
  }

  // Merge trips into country details
  const countryWithTrips = {
    ...countryDetails,
    trips: trips.map((trip) => ({ trip })),
  };

  return (
    <>
      <link rel="canonical" href={`https://himalayantrekkers.com/${countryParams}`} />

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center pt-20">
        <Image
          src={countryDetails.image || "/contactusbg.jpg"}
          alt={countryDetails.name}
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH1 className="font-semibold text-white mb-4 shadow-sm text-4xl md:text-6xl">
            {countryDetails.name} Travel Essential & Advice
          </TypographyH1>
        </div>
      </section>

      {/* Pass data to Client Component */}
      <DestinationClient destination={countryWithTrips} />
    </>
  );
}

import type { Destination } from "@workspace/api-client";
import { destinationService, tripService } from "@workspace/api-client";
import Image from "next/image";
import { notFound } from "next/navigation";
import DestinationClient from "~/src/components/DestinationClient";
import { TypographyH2, TypographyP } from "~/src/lib/typography";

type Props = {
  params: Promise<{ country: string; destination: string }>;
};

// ✅ Generate static params for all destinations at build time
export async function generateStaticParams() {
  try {
    // Fetch all destinations from your API - using findAll() instead of getAll()
    const response = await destinationService.findAll();
    const destinations = response.data || [];

    // Return array of params for each destination with proper typing
    return destinations.map((dest: any) => ({
      country: dest.country?.slug || "nepal",
      destination: dest.slug,
    }));
  } catch (_error) {
    // console.error('Error generating static params:', error);
    // Return empty array if API fails - will fallback to dynamic rendering
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<import("next").Metadata> {
  const { destination: slug } = await params;
  console.log(`[SSR] generateMetadata: fetching destination ${slug}`);

  let destination: Destination | null = null;
  try {
    destination = await destinationService.getBySlug(slug);
    console.log(`[SSR] generateMetadata: destination fetched successfully`, destination?.name);
  } catch (err: any) {
    console.error(
      `[SSR] generateMetadata: Failed to fetch destination ${slug}:`,
      err?.message || err,
    );
    destination = null;
  }

  if (!destination) {
    return {
      title: "Destination Not Found",
    };
  }

  return {
    title: `${destination.name} Trekking & Tours | Amazing Adventure`,
    description:
      destination.description ||
      `Explore the best trekking and tour packages in ${destination.name}.`,
    openGraph: {
      images: destination.image ? [destination.image] : [],
    },
  };
}

export default async function DestinationPage(props: Props) {
  const params = await props.params;
  const { country, destination: destinationSlug } = params;

  console.log(`[SSR] DestinationPage: country=${country}, destination=${destinationSlug}`);

  // Fetch destination details
  let destination: Destination | null = null;
  try {
    destination = await destinationService.getBySlug(destinationSlug);
    console.log(`[SSR] Destination fetched successfully:`, destination?.name);
  } catch (err: any) {
    console.error(`[SSR] Failed to fetch destination ${destinationSlug}:`, err?.message || err);
    destination = null;
  }

  if (!destination) {
    console.log(`[SSR] Destination not found: ${destinationSlug}`);
    notFound();
  }

  // Fetch trips by region (destination slug acts as region name)
  let trips: any[] = [];
  try {
    trips = await tripService.getByRegion(destinationSlug);
    console.log(`[SSR] Found ${trips.length} trips for region ${destinationSlug}`);
  } catch (err) {
    console.error(`[SSR] Failed to fetch trips for region ${destinationSlug}:`, err);
  }

  // Merge trips into destination object for the client component
  const destinationWithTrips = {
    ...destination,
    trips: trips.map((trip) => ({ trip })), // Match the expected shape
  };

  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src={destination.image || "/contactusbg.jpg"}
          alt={destination.name}
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className="font-semibold text-white mb-4">{destination.name}</TypographyH2>
          <TypographyP className="text-white/90 max-w-2xl mx-auto">
            Explore our adventures in {destination.name}
          </TypographyP>
        </div>
      </section>

      {/* Pass data to Client Component */}
      <DestinationClient destination={destinationWithTrips} />
    </main>
  );
}

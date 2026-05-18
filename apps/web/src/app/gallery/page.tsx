import { type Media, mediaService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import Image from "next/image";
import { manrope } from "~/src/lib/fonts";
import { TypographyBase, TypographyH2, TypographyP } from "~/src/lib/typography";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const response = await mediaService.findAll({ limit: 50 }).catch(() => ({ data: [] as Media[] }));
  const mediaItems = response.data;
  console.log("GalleryItems", mediaItems);

  //   const mediaItems = [
  //   { id: 1, url: "/aboutus1.jpg", caption: "Mountains" },
  //   { id: 2, url: "/aboutus2.jpg", caption: "Sunset" },
  // ];

  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/contactusbg.jpg"
          alt="Our Gallery"
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className=" font-semibold text-white">Our Gallery</TypographyH2>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 lg:py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <TypographyH2 className=" font-semibold text-gray-700 mb-4">
              Check out Breathtaking Images
            </TypographyH2>
            <TypographyBase className="text-gray-500 max-w-2xl mx-auto mb-8">
              Get answers to common questions about our services and travel experiences
            </TypographyBase>

            <div className="mt-4 flex flex-col gap-4 text-left">
              <TypographyP className="text-2xl font-bold">Check what you want to see?</TypographyP>

              <div className={`flex gap-3 ${manrope} text-base`}>
                <Button className="bg-[#F97316] hover:bg-[#ab5518] text-white rounded-full">
                  All
                </Button>

                <Button variant="outline" className="rounded-full bg-[#E5E7EB]">
                  Images
                </Button>

                <Button variant="outline" className="rounded-full bg-[#E5E7EB]">
                  Videos
                </Button>
              </div>
            </div>
          </div>

          {/* Masonry Grid */}
          {mediaItems && mediaItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item: Media) => (
                <div key={item.id} className="relative h-72 rounded-lg overflow-hidden group">
                  <Image
                    src={item.url}
                    alt={item.altText || item.caption || "Gallery image"}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-sm truncate">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              No images found in the gallery.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

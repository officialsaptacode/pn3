import Image from "next/image";
import ImageGallery from "@/components/ImageGallery";
import TeamSection from "@/components/TeamSection";
import { raleway } from "@/lib/fonts";
import { TypographyH2, TypographyH3, TypographyP } from "@/lib/typography";
import WhyChooseUs from "~/src/components/WhyChooseUs";

export default function AboutPage() {
  const team = [
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide1.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide2.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide3.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide4.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide1.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
    {
      name: "Zane Sorell",
      role: "Lead Trekking Guide",
      image: "/guide4.jpg",
      socials: { facebook: "#", instagram: "#", twitter: "#", dribbble: "#" },
    },
  ];

  return (
    <main className="flex min-h-screen flex-col pt-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <Image
          src="/aboutusbg.jpg"
          alt="About Us"
          fill
          className="object-cover brightness-75 object-[center_25%]"
          priority
        />
        <div className="relative z-10 text-center px-6">
          <TypographyH2 className=" font-semibold text-white">About Us</TypographyH2>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <TypographyH2 className=" font-semibold text-gray-700 mb-4 leading-[133%]">
              From Mountain Dreams to Real Trails
            </TypographyH2>
            <TypographyP className="text-gray-500 max-w-2xl mx-auto">
              Get answers to common questions about our services and travel experiences
            </TypographyP>
          </div>

          <ImageGallery />

          <div className="max-w-7xl mx-auto bg-[#FFEDD5] p-4 md:p-8 lg:p-12 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Text Content - Order first on mobile */}
              <div className="order-2 lg:order-1">
                <TypographyH3 className="text-[clamp(2rem,1.3026rem+0.9868vw,3rem)] text-gray-700 text-center sm:text-left font-semibold mb-4 lg:max-w-sm leading-[133%]">
                  The Core Values That Lead Our Journeys
                </TypographyH3>
                <TypographyP className="text-muted-foreground mb-4 max-w-2xl text-sm sm:text-base leading-[145%] tracking-[0.11px]">
                  At the heart of every adventure we create lies a set of core values that guide us
                  through every step of the journey. From our deep respect for nature and local
                  cultures to our commitment to safety, sustainability, and authentic exploration,
                  these values shape the way we trek and the experiences we offer. We believe in
                  creating meaningful connections — with the mountains, with the communities we
                  visit, and with every traveler who chooses to walk this path with us. These
                  principles are more than just words; they are the foundation of every expedition
                  we lead and the promise we make to every adventurer.
                </TypographyP>
              </div>

              {/* Image - Order second on mobile, first on desktop if you want */}
              <div className="order-1 lg:order-2 relative w-full h-[250px] sm:h-[350px] md:h-[400px] lg:w-[500px] lg:h-[490px] xl:w-[580px] rounded-xl overflow-hidden mx-auto">
                <Image
                  src="/journey.png"
                  alt="Trekker enjoying view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 580px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 bg-[#374151] text-white mb-15 sm:mb-0 ${raleway.className}`}>
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: "10+", label: "Years of Adventure" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "5000", label: "Trekkers Guided" },
              { value: "300+", label: "Successful Expeditions" },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Team Section */}
      <TeamSection team={team} />
    </main>
  );
}

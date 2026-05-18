import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { TypographyH1, TypographyP } from "../lib/typography";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center md:items-end overflow-hidden">
      {/* Desktop Image */}
      <div className="hidden sm:block absolute inset-0">
        <Image
          src="/marditrekbg.webp"
          alt="Himalayan mountains at sunset"
          fill
          priority
          quality={75}
          className="object-cover object-[center_40%]"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4IB4AAACQAwCdASoQAAwAPpE4mkWlpKShLvQAyQAVCWcAABd0f+7bx3L/bVAAAA="
        />
      </div>

      {/* Mobile Image */}
      <div className="block sm:hidden absolute inset-0">
        <Image
          src="/marditrekbgsmall.webp"
          alt="Himalayan mountains at sunset"
          fill
          priority
          quality={65}
          className="object-cover object-[left_10%]"
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/webp;base64,UklGRh4AAABXRUJQVlA4IB4AAACQAwCdASoQAAwAPpE4mkWlpKShLvQAyQAVCWcAABd0f+7bx3L/bVAAAA="
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Bottom Content */}
      <div className="relative z-10 w-full px-4 pt-70 sm:pt-0 sm:pb-10">
        <div className="container mx-auto max-w-8xl text-center md:text-left xl:px-10">
          {/* Heading */}
          <TypographyH1 className="text-white leading-[131%] max-w-4xl">
            Yoga in the Sky <br /> <span className="text-orange-400">Healing in the Heights</span>
          </TypographyH1>

          {/* Subtitle row */}
          {/* <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 text-white/90 font-medium mt-4 justify-center md:justify-start">
              {[
                "Spiritual Yoga Trek",
                "Sound Healing Journey",
                "Peak Climbing",
                "Paragliding Adventure",
              ].map((text, idx) => (
                <div
                  key={text}
                  className="flex items-center gap-2 justify-center sm:justify-start"
                >
                  <TypographyP className="text-sm sm:text-base">{text}</TypographyP>
                  {idx < 3 && (
                    <span className="w-2 h-2 bg-orange-500 rounded-full shrink-0 order-2 sm:order-1" />
                  )}
                </div>
              ))}
            </div> */}

          {/* Feature Pills */}
          {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-4xl mt-6 justify-center md:justify-start">
            {[
              { text: "Spiritual Yoga Trek", mobileWidth: "w-[200px]" },
              { text: "Sound Healing Journey", mobileWidth: "w-[230px]" },
              { text: "Deep Healing", mobileWidth: "w-[160px]" },
              { text: "Healing in Silence", mobileWidth: "w-[190px]" },
            ].map(({ text, mobileWidth }) => (
              <button
                key={text}
                className={`
                ${mobileWidth}
                sm:w-auto        
                mx-auto         
                bg-orange-500 text-white font-semibold
                py-2 px-4 text-sm sm:text-base rounded-full
                flex items-center gap-2 justify-center
              `}
              >
                <Image src="/doubletick.png" alt="doubletick" width={18} height={18} />
                {text}
              </button>
            ))}
          </div> */}

          <TypographyP className="text-gray-200 leading-[145%] tracking-[0.09px] md:max-w-xl xl:max-w-none">
            Trek the Himalayas, explore ancient cultures, and experience unforgettable journeys
            across Nepal.
          </TypographyP>

          {/* CTA + Mardi aligned */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-1 sm:mt-10 max-w-7xl items-center">
            {/* CTA */}
            <Link href="/booking">
              <button className="bg-transparent hover:bg-transparent text-white hover:text-orange-500 font-semibold py-5 sm:py-4 px-4 sm:px-6 text-base cursor-pointer group">
                <span className="flex items-center gap-2">
                  Plan Your Adventure Now
                  <ArrowRight className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </button>
            </Link>

            {/* Mardi label */}
            <TypographyP className="relative text-white font-semibold text-center sm:text-left mt-30 sm:mt-0 text-lg sm:text-xl md:mr-40 xl:mr-0">
              Mardi
              <span
                className="
              absolute
              -bottom-2
              h-[2px]
              w-74 sm:w-48
              bg-[#FB923C]
              left-1/2 -translate-x-1/2
              sm:left-0 sm:translate-x-0
            "
              />
            </TypographyP>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

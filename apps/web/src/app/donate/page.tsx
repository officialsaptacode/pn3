// import { Check } from "lucide-react";
import Image from "next/image";
import { manrope } from "@/lib/fonts";

const _checklistItems = [
  "Classroom supplies, books, and scholarships for students.",
  "Teacher training programs to uplift education quality.",
  "Infrastructure upgrades like clean water and safe learning spaces.",
];

const Donate = () => {
  return (
    <section className={`w-full px-4 py-16 md:py-20 bg-white ${manrope.className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-700 mb-8 md:mb-10 leading-[48px] mt-10">
          Our Contribution
        </h2>

        <div className="relative w-full h-[500px] mb-10 md:mb-12 rounded-lg overflow-hidden">
          <Image
            src="/children.jpg"
            alt="Children smiling and waving at the camera"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority
          />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Description */}
          <div className="mb-8 ">
            <p className="text-gray-500 text-base md:text-xl leading-[145%] tracking-[0.09px]">
              In the misty hills of Thaprek, Tanahun, where the Gandaki River whispers ancient
              tales, stands Saraswati Secondary School—a beacon of hope for children in a remote
              Nepali village. For years, its classrooms echoed with the dreams of young minds, but
              limited resources dimmed their light: outdated books, crumbling desks, and teachers
              stretched thin. Nearby, women in the community balanced heavy loads of daily survival,
              their potential untapped, while individuals living with disabilities faced barriers
              that isolated them from opportunity and dignity.<br></br>
              <br></br>
              Enter Amazing Nepal Adventure, a company born from a passion for exploration and a
              deeper calling to uplift. We believe that every trek through Nepal's majestic
              landscapes isn't just a journey for the traveler—it's a step toward a brighter future
              for all. That's why we proudly dedicate 10% of our profits to initiatives that
              transform lives. At Saraswati School, our contributions have funded new learning
              materials, teacher training programs, and scholarships, allowing students like young
              Maya—a bright 12-year-old with aspirations to become a doctor—to access education that
              once seemed out of reach. "Before, I studied under a flickering bulb," Maya shares,
              her eyes sparkling. "Now, I have books and hope. One day, I'll heal my village."
              <br></br>
              <br></br>
              Our support extends beyond the school walls. Through women empowerment programs, we've
              partnered with local cooperatives to provide skills training in handicrafts and
              entrepreneurship, enabling mothers like Laxmi to start small businesses that sustain
              their families and foster independence. "I used to depend on others," Laxmi reflects,
              weaving a vibrant shawl. "Now, I stand tall, creating not just products, but
              possibilities for my daughters." For those living with disabilities, our initiatives
              include accessible infrastructure and vocational workshops, helping individuals like
              Rajan—a talented artisan with visual impairment—rediscover purpose through adaptive
              tools and community inclusion. "You've given me more than support," Rajan says softly.
              "You've given me wings."<br></br>
              <br></br>
              These stories aren't isolated victories; they're threads in a tapestry of collective
              progress. When you choose Amazing Nepal Adventure for your trek to Himalayas or
              cultural immersion, you're not just witnessing Nepal's beauty—you're fueling change.
              Together, we've built classrooms, ignited dreams, and woven stronger communities.
              Imagine: your footsteps on ancient trails could light the path for a child's
              education, empower a woman's voice, or open doors for the marginalized. Join us in
              this meaningful adventure. Book your tour today, and let's forge a better future—one
              where every journey leaves a legacy of hope and humanity. Because when we travel with
              purpose, we don't just explore the world—we heal it.<br></br>
              <br></br>
            </p>
            {/* <p className="text-gray-500 text-base md:text-xl leading-[145%] tracking-[0.09px] mb-6">
              By choosing us, you're not just exploring the Himalayas or Bhutan's hidden
              valleys—you're directly funding:
            </p> */}

            {/* Checklist */}
            {/* <ul className="space-y-3 mb-10">
              {checklistItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-green-600 p-1 rounded-md shadow-md shrink-0">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-gray-500 text-base md:text-xl leading-[145%] tracking-[0.09px]">
                    {item}
                  </span>
                </li>
              ))}
            </ul> */}
          </div>

          {/* Quote Box */}
          {/* <div className="bg-orange-50 rounded-xl p-6 md:p-8 mb-10 md:mb-12 text-center border border-slate-100">
            <p className="text-gray-600 text-xl md:text-2xl font-medium leading-[145%] tracking-[0.09px] ">
              "Education is the passport to the future."
              <br />
              Together, we're helping students in Thaprek write brighter stories.
              <br />
              Join us in adventuring responsibly and leaving a legacy of hope."
            </p>
          </div> */}

          {/* Why This Matters */}
          {/* <div className="mb-10">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Why This Matters
            </h3>
            <p className="text-gray-500 text-base md:text-xl leading-[145%] tracking-[0.09px] mb-4">
              Saraswati Secondary School serves over 300 students in a remote region where resources
              are scarce. Your journey fuels their dreams—one backpack, one notebook, one
              opportunity at a time.
            </p>
            <p className="text-gray-500 text-base md:text-xl leading-[145%] tracking-[0.09px]">
              Every trek, tour, or cultural experience you book with us plants a seed of change.
            </p>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default Donate;

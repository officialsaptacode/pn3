import { Link } from "@/i18n/routing";
import { getTeamMembers } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { ContactForm } from "./contact-form";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  const title = isEn ? "About Us & Contact - Gorkha Daily" : "हाम्रो बारेमा र सम्पर्क - गोर्खा दैनिक";
  const description = isEn
    ? "Learn about Gorkha Daily publication, our editorial team, and get in touch with us."
    : "गोर्खा दैनिक प्रकाशन, हाम्रो सम्पादकीय टोलीको बारेमा जान्नुहोस् र हामीलाई सम्पर्क गर्नुहोस्।";

  return {
    title,
    description,
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const isEn = locale === "en";
  const mockTeam = await getTeamMembers();

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[1200px] space-y-6">
      
      {/* ═══ BREADCRUMBS & HEADER ═══ */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <nav className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5 font-mukta">
          <Link href="/" className="hover:text-primary transition">
            {isEn ? "Home" : "गृहपृष्ठ"}
          </Link>
          <span>›</span>
          <span className="text-foreground font-semibold">
            {isEn ? "About & Contact" : "हाम्रो बारेमा र सम्पर्क"}
          </span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-extrabold font-mukta text-foreground">
          {isEn ? "About Us & Contact" : "हाम्रो बारेमा र सम्पर्क"}
        </h1>
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ABOUT CONTENT */}
        <div className="flex-grow space-y-8 min-w-0">
          
          {/* Publication Bio */}
          <div className="space-y-4 font-mukta">
            <h2 className="text-lg md:text-xl font-bold border-b pb-2 text-foreground flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
              {isEn ? "Introduction" : "परिचय"}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
              {isEn
                ? "Gorkha Daily is Nepal's premier local news daily dedicated to delivering timely, unbiased, and high-quality journalism from the Gorkha region and Gandaki province. Founded with a vision to empower citizens through information, we provide updates on local administration, agriculture, development projects, sports, business, and cultural heritage."
                : "गोर्खा दैनिक नेपालको प्रमुख स्थानीय समाचार दैनिक हो जसले गोरखा क्षेत्र र गण्डकी प्रदेशबाट समयसापेक्ष, निष्पक्ष र उच्च गुणस्तरको पत्रकारिता प्रदान गर्न प्रतिबद्ध छ। सूचना मार्फत नागरिकलाई सशक्त बनाउने परिकल्पनाका साथ स्थापित हामी स्थानीय प्रशासन, कृषि, विकास आयोजना, खेलकुद, व्यवसाय र सांस्कृतिक सम्पदाका अपडेटहरू प्रदान गर्दछौं।"}
            </p>
          </div>

          {/* Publisher Details Table */}
          <div className="space-y-4 font-mukta">
            <h2 className="text-lg md:text-xl font-bold border-b pb-2 text-foreground flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
              {isEn ? "Publication Information" : "प्रकाशन विवरण"}
            </h2>
            
            <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <tbody>
                  {[
                    {
                      label: isEn ? "Publisher & Chief Editor" : "प्रकाशक तथा प्रधान सम्पादक",
                      value: isEn ? "Rama Simkhada" : "रमा सिम्खडा",
                    },
                    {
                      label: isEn ? "Company Name" : "कम्पनी नाम",
                      value: isEn ? "Simkhada Media Group Pvt. Ltd." : "सिम्खडा मिडिया ग्रुप प्रा. लि.",
                    },
                    {
                      label: isEn ? "Regd. Number (DoIB)" : "सूचना विभाग दर्ता नं.",
                      value: isEn ? "3412/080-81" : "३४१२/०८०-८१",
                    },
                    {
                      label: isEn ? "Office Address" : "कार्यालय ठेगाना",
                      value: isEn ? "Gorkha-6, Gandaki Province, Nepal" : "गोरखा-६, गण्डकी प्रदेश, नेपाल",
                    },
                    {
                      label: isEn ? "Email Address" : "इमेल ठेगाना",
                      value: "info@gorkhadaily.com",
                    },
                    {
                      label: isEn ? "Contact Telephone" : "सम्पर्क फोन",
                      value: "+९७७-६४-४२०१११",
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-0 border-border/60 hover:bg-muted/30 transition"
                    >
                      <td className="px-4 py-3 font-bold text-muted-foreground bg-muted/20 w-1/3 border-r border-border/60">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-foreground font-semibold">
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="space-y-4 font-mukta">
            <h2 className="text-lg md:text-xl font-bold border-b pb-2 text-foreground flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
              {isEn ? "Our Editorial & Reporting Team" : "हाम्रो सम्पादकीय र संवाददाता टोली"}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {mockTeam.map((member, idx) => (
                <div
                  key={idx}
                  className="p-5 border rounded-2xl bg-card hover:border-primary/20 shadow-sm transition flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center uppercase text-lg">
                    {isEn ? member.initials.en : member.initials.ne}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">
                      {isEn ? member.name.en : member.name.ne}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {isEn ? "Correspondent" : "संवाददाता"}
                    </span>
                  </div>
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-block text-xs font-mono font-bold text-primary bg-primary/5 hover:bg-primary hover:text-primary-foreground border border-primary/10 px-3 py-1.5 rounded-lg transition"
                  >
                    📞 {member.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Us Form Form */}
          <div className="space-y-4 font-mukta">
            <h2 className="text-lg md:text-xl font-bold border-b pb-2 text-foreground flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
              {isEn ? "Send Us a Message" : "हामीलाई सन्देश पठाउनुहोस्"}
            </h2>
            <ContactForm locale={locale} />
          </div>

        </div>

        {/* SIDEBAR COLUMN */}
        <Sidebar locale={locale} />

      </div>

    </div>
  );
}

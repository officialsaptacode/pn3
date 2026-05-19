import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getArticles } from "@/lib/api";
import { Sidebar } from "@/components/sidebar";
import { CategoryClient } from "./category-client";

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

const CATEGORY_MAP: Record<
  string,
  {
    title: { ne: string; en: string };
    description: { ne: string; en: string };
    subcategories: { ne: string[]; en: string[] };
    totalCount: string;
  }
> = {
  gorkha: {
    title: { ne: "गोरखा समाचार", en: "Gorkha News" },
    description: { ne: "गोरखा जिल्लाका ताजा समाचारहरू", en: "Latest news from Gorkha district" },
    subcategories: {
      ne: ["सबै", "राजनीति", "विकास", "कृषि", "स्वास्थ्य"],
      en: ["All", "Politics", "Development", "Agriculture", "Health"],
    },
    totalCount: "३४२+",
  },
  gandaki: {
    title: { ne: "गण्डकी प्रदेश", en: "Gandaki Province" },
    description: { ne: "गण्डकी प्रदेशका समाचारहरू", en: "Latest news from Gandaki Province" },
    subcategories: {
      ne: ["सबै", "पोखरा", "विकास", "पर्यटन", "ऊर्जा"],
      en: ["All", "Pokhara", "Development", "Tourism", "Energy"],
    },
    totalCount: "२१५+",
  },
  national: {
    title: { ne: "राष्ट्रिय समाचार", en: "National News" },
    description: { ne: "नेपालभरका ताजा राष्ट्रिय समाचारहरू", en: "Latest national news from across Nepal" },
    subcategories: {
      ne: ["सबै", "राजनीति", "अर्थतन्त्र", "सरकार", "संसद"],
      en: ["All", "Politics", "Economy", "Government", "Parliament"],
    },
    totalCount: "४१०+",
  },
  sports: {
    title: { ne: "खेलकुद", en: "Sports" },
    description: { ne: "खेलकुद क्षेत्रका ताजा गतिविधिहरू", en: "Latest updates from the sports world" },
    subcategories: {
      ne: ["सबै", "क्रिकेट", "फुटबल", "भलिबल"],
      en: ["All", "Cricket", "Football", "Volleyball"],
    },
    totalCount: "१६८+",
  },
  business: {
    title: { ne: "अर्थ तथा बाणिज्य", en: "Business & Economy" },
    description: { ne: "वित्तीय र आर्थिक क्षेत्रका गतिविधि", en: "Updates on financial and economic sectors" },
    subcategories: {
      ne: ["सबै", "सेयर बजार", "बैंकिङ", "विप्रेषण"],
      en: ["All", "Stock Market", "Banking", "Remittance"],
    },
    totalCount: "१९२+",
  },
  international: {
    title: { ne: "अन्तर्राष्ट्रिय", en: "International" },
    description: { ne: "विश्वभरका समाचार तथा घटनाक्रम", en: "News and updates from around the world" },
    subcategories: {
      ne: ["सबै", "छिमेकी देश", "विश्व", "सम्बन्ध"],
      en: ["All", "Neighbors", "Global", "Relations"],
    },
    totalCount: "११५+",
  },
  entertainment: {
    title: { ne: "मनोरञ्जन", en: "Entertainment" },
    description: { ne: "कला, चलचित्र र साङ्गीतिक गतिविधिहरू", en: "Art, films, and musical updates" },
    subcategories: {
      ne: ["सबै", "चलचित्र", "संगीत", "कलाकार"],
      en: ["All", "Movies", "Music", "Celebrities"],
    },
    totalCount: "१४३+",
  },
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) return {};

  const isEn = locale === "en";
  const title = isEn ? cat.title.en : cat.title.ne;
  const description = isEn ? cat.description.en : cat.description.ne;

  return {
    title: `${title} - Gorkha Daily`,
    description: description,
    openGraph: {
      title: `${title} - Gorkha Daily`,
      description: description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const categoryDetails = CATEGORY_MAP[slug];
  if (!categoryDetails) {
    notFound();
  }

  // Get articles belonging to this category
  const categoryArticles = await getArticles(slug);

  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-[1200px] space-y-6">
      
      {/* ═══ BREADCRUMBS & CATEGORY HEADER ═══ */}
      <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm">
        <nav className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5 font-mukta">
          <Link href="/" className="hover:text-primary transition">
            {isEn ? "Home" : "गृहपृष्ठ"}
          </Link>
          <span>›</span>
          <span className="text-foreground font-semibold">
            {isEn ? categoryDetails.title.en : categoryDetails.title.ne}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-extrabold font-mukta text-foreground">
              {isEn ? categoryDetails.title.en : categoryDetails.title.ne}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground font-mukta">
              {isEn ? categoryDetails.description.en : categoryDetails.description.ne}
            </p>
          </div>
          <div className="self-start sm:self-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary font-bold font-mono text-lg md:text-xl">
            {isEn ? categoryDetails.totalCount.replace(/[०-९]/g, (d) => "०१२३४५६७८९".indexOf(d).toString()) : categoryDetails.totalCount}
          </div>
        </div>
      </div>

      {/* ═══ MAIN LAYOUT ═══ */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ARTICLES LIST & FILTER TABS (Client side dynamic) */}
        <div className="flex-grow space-y-8 min-w-0">
          <CategoryClient 
            articles={categoryArticles} 
            locale={locale} 
            subcategories={isEn ? categoryDetails.subcategories.en : categoryDetails.subcategories.ne} 
          />
        </div>

        {/* SIDEBAR */}
        <Sidebar locale={locale} />

      </div>

    </div>
  );
}

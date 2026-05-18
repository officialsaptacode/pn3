export interface VisaContent {
  id: string | number;
  name: string;
  slug: string;
  image?: string;
  heroTitle: string;
  description: string;
  passportRequirements: string[];
  visaTypes: {
    title: string;
    description?: string;
    fees?: string[];
    details: string[];
  }[];
  visaApplication: string[];
  tips: string[];
}

export const visaContent: VisaContent[] = [
  {
    id: 1,
    name: "Nepal",
    slug: "nepal",
    image: "/stupa.jpg",
    heroTitle: "Nepal Visa & Passport Requirements",
    description: "Complete guide to Nepal visa and passport requirements for travelers",
    passportRequirements: [
      "• A valid passport is required for all foreign travelers entering Nepal.",
      "• The passport must be valid for at least six months from the date of arrival.",
      "• Make sure your passport has at least one blank page for visa stamps.",
    ],
    visaTypes: [
      {
        title: "1. Tourist Visa",
        description: "Nepal offers different types of visas depending on the purpose of travel:",
        fees: ["• 15 days: USD 30", "• 30 days: USD 50", "• 90 days: USD 125"],
        details: [
          "• Most travelers must obtain a visa to enter Nepal.",
          "• A tourist visa can be obtained on arrival at Tribhuvan International Airport (Kathmandu) and border entry points.",
          "• It can also be obtained from Nepalese embassies or consulates before arrival.",
          "• The tourist visa allows multiple entries.",
        ],
      },
      {
        title: "2. Gratis (Free) Visa",
        details: [
          "• SAARC Nationals (except Afghanistan) can get a 30-day free visa once a year.",
          "• Children under 10 years get a free visa (except for US citizens).",
        ],
      },
      {
        title: "3. Visa for Indian Citizens",
        details: [
          "• Indian nationals do not need a visa to enter Nepal.",
          "• However, they must carry a valid passport or an official government-issued photo ID (such as an Aadhaar card, voter ID, or citizenship certificate).",
        ],
      },
      {
        title: "4. Other Types of Visas",
        details: [
          "• Business Visa: For those investing or working in Nepal.",
          "• Student Visa: For those studying in Nepal.",
          "• Work Visa: Requires a recommendation from the Ministry of Labor.",
          "• Transit Visa: USD 5 for 24-hour transit at the airport.",
        ],
      },
    ],
    visaApplication: [
      "• Fill out the arrival visa application form (online or at kiosks at the airport).",
      "• Pay the visa fee at the counter (USD, EUR, GBP, or equivalent in NPR).",
      "• Submit the receipt and passport at the immigration counter.",
      "• For Embassy/Consulate: Submit application form, passport, and required documents.",
      "• Electronic Visa Option: Apply online via Nepal Immigration Portal to save time.",
    ],
    tips: [
      "• Keep your passport and visa copy handy for security checks.",
      "• Always carry cash (USD) for visa fees if applying on arrival.",
      "• Ensure you do not overstay your visa to avoid penalties.",
      "• Confirm latest requirements via the Department of Immigration Nepal.",
    ],
  },
  {
    id: 2,
    name: "Bhutan",
    slug: "bhutan",
    image: "/bhutan.jpg",
    heroTitle: "Bhutan Visa & Passport Requirements",
    description: "Complete guide to Bhutan visa and passport requirements for travelers",
    passportRequirements: [
      "• A valid passport is mandatory for all foreign visitors.",
      "• The passport must be valid for at least six months beyond the intended date of departure from Bhutan.",
      "• Ensure your passport has at least one blank page for visa stamps.",
    ],
    visaTypes: [
      {
        title: "Bhutan's Visa Policy",
        description:
          "Bhutan's visa process is unique and tightly regulated to preserve its cultural heritage and environment.",
        details: [
          "• Tourist Visa: Mandatory Pre-Approval: All tourists (except Indian nationals) must book a guided tour through a licensed Bhutanese tour operator.",
          "• Processing Time: Minimum 5-7 working days after full payment is received.",
          "• Indian Nationals: Can obtain a permit at entry points with a valid passport or voter ID card.",
          "• Other Visas: Business, student, or official visas require prior approval from Bhutan's government.",
        ],
      },
    ],
    visaApplication: [
      "• Book a Tour: Secure a tour package through a licensed operator like Amazing Nepal Adventure.",
      "• Submit Documents: Passport copy, travel itinerary and accommodation details.",
      "• Visa Clearance: Your operator receives an electronic visa clearance from Bhutan's Tourism Council.",
      "• Visa Stamp: Collect your physical visa upon arrival in Bhutan (present your visa clearance letter).",
    ],
    tips: [
      "• Plan Early: Visa processing can take 1-2 weeks. Consult Amazing Nepal Adventure at least 1 month before departure.",
      "• Payment: Tour packages must be paid in full before visa processing.",
      "• Travel Insurance: Highly recommended (not mandatory but advised).",
      "• Cultural Respect: Follow dress codes at religious sites.",
    ],
  },
  {
    id: 3,
    name: "Tibet",
    slug: "tibet",
    image: "/tibet.jpg",
    heroTitle: "Tibet Visa & Passport Requirements",
    description: "Complete guide to Tibet visa and passport requirements for travelers",
    passportRequirements: [
      "• A valid passport is mandatory for all travelers entering Tibet.",
      "• The passport must be valid for at least six months beyond your planned departure date.",
      "• Ensure your passport has at least one blank page for visa and entry stamps.",
    ],
    visaTypes: [
      {
        title: "1. Chinese Visa (For Entry into China)",
        description:
          "Since Tibet is part of China, travelers must first obtain a Chinese visa and then apply for the necessary Tibet Travel Permits.",
        details: [
          "• All foreign travelers (except Chinese passport holders) need a valid Chinese visa to enter Tibet via mainland China.",
          "• The visa must be obtained before traveling to China from a Chinese embassy or consulate.",
          "• Tourist Visa (L Visa) - Required for most travelers.",
          "• Business Visa (M Visa), Work Visa (Z Visa), and Student Visa (X Visa) - Can also be used for entry if you have valid documentation.",
        ],
      },
      {
        title: "2. Tibet Travel Permits",
        details: [
          "• Tibet Travel Permit (TTP) - Mandatory for all foreigners entering Tibet.",
          "• Aliens' Travel Permit (ATP) - Needed for restricted areas outside Lhasa, such as Everest Base Camp.",
          "• Military Permit - Required for sensitive border regions like Mount Kailash.",
        ],
      },
    ],
    visaApplication: [
      "• Step 1: Obtain a Chinese visa from the Chinese Embassy.",
      "• Step 2: Book a Tibet tour package through an authorized tour operator such as Amazing Nepal Adventure.",
      "• Step 3: Submit a copy of your passport and Chinese visa at least one month before departure.",
      "• Step 4: Amazing Nepal Adventure will process your Tibet Travel Permit.",
      "• Step 5: Receive your TTP document before your flight or train to Tibet.",
    ],
    tips: [
      "• Start Early: Consult Amazing Nepal Adventure at least 1 month before departure to secure permits and visas.",
      "• Avoid DIY Planning: Permits cannot be obtained without a tour operator.",
      "• Respect Restrictions: Do NOT discuss politically sensitive topics in Tibet.",
      "• Independent travel in Tibet is not allowed. You must travel with a guided tour.",
    ],
  },
  {
    id: 4,
    name: "India",
    slug: "india",
    image: "/india.jpg",
    heroTitle: "India Visa & Passport Requirements",
    description: "Complete guide to India visa and passport requirements for travelers",
    passportRequirements: [
      "• A valid passport is mandatory for all foreign travelers entering India.",
      "• The passport must be valid for at least six months beyond the intended date of departure.",
      "• Ensure your passport has at least two blank pages for visa stamps.",
    ],
    visaTypes: [
      {
        title: "1. e-Visa (Electronic Visa)",
        description:
          "India's visa policies vary by nationality, and travelers must plan ahead to secure the correct visas.",
        details: [
          "• Available for 166+ nationalities, including the US, UK, EU, Australia, Canada.",
          "• Categories: Tourist, Business, Medical, or Conference.",
          "• Validity: Tourist e-Visa: 30 days, 1 year, or 5 years (multiple entries allowed; max 90 days per stay).",
          "• Processing Time: 3-5 business days.",
        ],
      },
      {
        title: "2. Regular Visa",
        details: [
          "• Required for nationals not eligible for e-Visa (e.g., Pakistan, China).",
          "• Apply via Indian embassies/consulates.",
          "• Processing time: 7-15 business days.",
        ],
      },
      {
        title: "3. Visa on Arrival (VoA)",
        details: ["• Only for Japan, South Korea, and UAE nationals (30-day stay)."],
      },
    ],
    visaApplication: [
      "• e-Visa Application: Apply online at Indian Visa Portal.",
      "• Upload a passport-sized photo and passport bio-page scan.",
      "• Pay fees online (USD 10-100, depending on duration/nationality).",
      "• Receive an Electronic Travel Authorization (ETA) via email.",
      "• Regular Visa: Submit forms, photos, and supporting documents to an Indian embassy.",
    ],
    tips: [
      "• Check Eligibility: Verify e-Visa eligibility for your nationality.",
      "• Avoid Overstays: Fines or bans apply for overstaying (USD $300+ and potential deportation).",
      "• OCI Cardholders: Overseas Citizen of India cardholders have lifelong visa-free entry.",
      "• Return Ticket: Proof of onward travel may be requested.",
    ],
  },
];

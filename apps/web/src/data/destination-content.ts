export interface DestinationContent {
  id: string | number;
  name: string;
  slug: string;
  image?: string;
  heroTitle: string;
  description: string;
  sections: {
    title: string;
    content: string[];
  }[];
}

export const destinationContent: DestinationContent[] = [
  {
    id: 1,
    name: "Nepal",
    slug: "nepal",
    image: "/stupa.jpg",
    heroTitle: "Before Your Trip to Nepal",
    description: "Essential travel information and preparations before visiting Nepal",
    sections: [
      {
        title: "1. Entry Requirements",
        content: [
          "• Visa: Available on arrival for most nationalities (bring passport photos and cash in USD/EUR). E-visa options exist.",
          "• Passport: Must be valid for at least 6 months beyond arrival.",
          "• Vaccinations: Recommended: Hepatitis A, Typhoid, Tetanus.",
        ],
      },
      {
        title: "2. Health & Safety",
        content: [
          "• Altitude Sickness: Acclimatize gradually during treks; consider carrying Diamox.",
          "• Water/Food: Drink bottled/purified water; avoid raw salads and unpeeled fruits.",
          "• Insurance: Ensure coverage for high-altitude activities and emergency evacuation.",
          "• Medical Facilities: Limited outside cities; carry a basic first-aid kit.",
        ],
      },
      {
        title: "3. Cultural Etiquette",
        content: [
          "• Dress Modestly: Cover shoulders/knees at temples. Remove shoes before entering sacred sites.",
          "• Respect Customs: Use right hand for giving/receiving; greet with 'Namaste.' Avoid public displays of affection.",
          "• Photography: Ask permission before photographing people or religious ceremonies.",
        ],
      },
      {
        title: "4. Money Matters",
        content: [
          "• Currency: Nepalese Rupee (NPR). Exchange cash in Kathmandu for better rates.",
          "• ATMs/Cards: Available in cities; carry cash for remote areas. Small notes useful for tips.",
          "• Tipping: 10% in restaurants if service charge not included; tip guides/porters fairly.",
        ],
      },
      {
        title: "5. Transportation",
        content: [
          "• Domestic Flights: Prone to delays; book early for popular routes (e.g., Lukla).",
          "• Road Travel: Buses/taxis common; negotiate fares upfront. Expect rough roads in rural areas.",
          "• Permits: TIMS and trekking permits (e.g., Annapurna, Everest) required. Restricted areas (e.g., Upper Mustang) need special permits.",
        ],
      },
      {
        title: "6. Communication",
        content: [
          "• Language: Nepali; English spoken in tourist areas. Learn basic phrases.",
          "• SIM Cards: Ncell/Nepal Telecom available at airport; limited connectivity in mountains.",
        ],
      },
      {
        title: "7. Best Time to Visit",
        content: [
          "• Trekking Seasons: Spring (Mar–May) and autumn (Sept–Nov).",
          "• Monsoon (Jun–Sept): Heavy rains, landslides.",
          "• Winter (Dec–Feb): Cold, especially at high altitudes.",
        ],
      },
      {
        title: "8. Environmental Responsibility",
        content: [
          "• Reduce Waste: Carry reusable bottles/purifiers; avoid single-use plastics.",
          "• Respect Nature: Pack out trash, stay on trails, and use eco-friendly services.",
        ],
      },
      {
        title: "9. Emergency Preparedness",
        content: [
          "• Contacts: Local emergency numbers (e.g., 100 for police, 102 for ambulance). Register with your embassy.",
          "• Earthquakes: Familiarize with safety protocols; Nepal is in a seismic zone.",
        ],
      },
      {
        title: "10. Packing Tips",
        content: [
          "• Clothing: Layered clothing, sturdy hiking boots, sunhat, and rain gear.",
          "• Gear: Power bank, solar charger, and reusable water bottle.",
          "• Documents: Copies of passport, permits, and insurance.",
        ],
      },
      {
        title: "11. Local Cuisine",
        content: ["• Try: Dal Bhat, momo, and Newari dishes. Exercise caution with street food."],
      },
      {
        title: "12. Trekking Essentials",
        content: [
          "• Guides/Porters: Hire through reputable agencies; treat ethically.",
          "• Accommodation: Teahouses common on trails; book in peak seasons.",
        ],
      },
      {
        title: "13. Festivals & Holidays",
        content: [
          "• Major Festivals: Dashain (Sept/Oct), Tihar (Oct/Nov). Expect closures and vibrant celebrations.",
        ],
      },
    ],
  },
  {
    id: 2,
    name: "India",
    slug: "india",
    image: "/india.jpg",
    heroTitle: "Before Your Trip to India",
    description: "Essential travel information and preparations before visiting India",
    sections: [
      {
        title: "1. Entry Requirements & Documentation",
        content: [
          "• Visa: Most foreign nationals require a visa. Apply for an e-Tourist Visa online (valid for 30 days, double entry) or a traditional visa through an embassy.",
          "• Passport: Must be valid for at least six months beyond your arrival date.",
          "• Travel Insurance: Ensure coverage for medical emergencies, theft, and trip cancellations.",
        ],
      },
      {
        title: "2. Health & Safety Precautions",
        content: [
          "• Vaccinations: Recommended vaccines include Hepatitis A, Typhoid, Tetanus, and Polio. Consider rabies and Japanese encephalitis for rural areas.",
          "• Water & Food Safety: Avoid tap water and ice; drink sealed bottled water. Stick to cooked foods, peeled fruits, and avoid street food initially to prevent 'Delhi Belly'.",
          "• Medical Kit: Carry diarrhea tablets (e.g., Loperamide), antibiotics, hand sanitizer, and mosquito repellent with DEET.",
        ],
      },
      {
        title: "3. Cultural Etiquette & Behavior",
        content: [
          "• Dress Modestly: Cover shoulders and knees, especially at religious sites. Women may wear scarves or shawls for temples.",
          "• Respect Religious Customs: Remove shoes before entering temples/mosques, and avoid pointing feet at people or deities. Circumambulate shrines clockwise.",
          "• Gestures: Use your right hand for giving/receiving items. Learn the Indian head 'wobble'—a non-verbal nod meaning 'yes' or acknowledgment.",
          "• Public Behavior: Avoid public displays of affection. Greet with 'Namaste' or a handshake.",
        ],
      },
      {
        title: "4. Transportation & Logistics",
        content: [
          "• Domestic Travel: Book trains/buses early via IRCTC or apps like 12Go. Use ride-hailing apps (Uber/Ola) to avoid taxi scams.",
          "• Traffic & Delays: Roads are chaotic; expect traffic jams. Trains and flights often run late—plan buffers in your itinerary.",
          "• SIM Cards: Purchase a local SIM (Airtel/Vodafone) at airports for data. eSIMs are also convenient for connectivity.",
        ],
      },
      {
        title: "5. Money & Budgeting",
        content: [
          "• Currency: Use Indian Rupees (INR). Exchange USD/EUR at airports or banks. Carry small denominations for tips and markets.",
          "• Cash Reliance: Many rural areas and vendors only accept cash. ATMs are widespread but avoid isolated ones at night.",
          "• Haggling: Negotiate prices at markets but stay respectful. Walk away if pressured.",
        ],
      },
      {
        title: "6. Safety & Scams",
        content: [
          "• Common Scams: Fake guides, overpriced taxis, and 'closed hotel' tricks. Verify bookings independently and use metered rides.",
          "• Pickpocketing: Secure belongings in crowded areas. Use anti-theft bags and avoid flashy jewelry.",
          "• Female Travelers: Consider female-only train compartments and wear a fake wedding ring to deter unwanted attention.",
        ],
      },
      {
        title: "7. Food & Dining",
        content: [
          "• Local Cuisine: Try thalis (platter meals), dosas, and butter chicken. Specify 'less spicy' when ordering.",
          "• Vegetarian Options: India offers extensive vegetarian dishes (e.g., dal, paneer). Many Jains/Hindus avoid meat and garlic.",
          "• Street Food: Opt for vendors with high turnover and cooked-to-order items (e.g., freshly fried samosas).",
        ],
      },
      {
        title: "8. Environmental & Practical Tips",
        content: [
          "• Pollution: Carry a mask in cities like Delhi. Winter smog can reduce visibility.",
          "• Toilets: Public restrooms often have squat toilets. Carry toilet paper and hand sanitizer.",
          "• Power Outlets: Bring universal adapters (Type C/D) and surge protectors for electronics.",
        ],
      },
      {
        title: "9. Best Time to Visit",
        content: [
          "• Ideal Seasons: October–March for mild weather. Avoid monsoon (June–September) and extreme summer heat (April–June).",
          "• Festivals: Plan around Diwali (October/November) or Holi (March) for vibrant celebrations, but expect crowds.",
        ],
      },
      {
        title: "10. Unique Cultural Insights",
        content: [
          "• Curiosity & Attention: Foreigners may attract stares or requests for photos—politely decline if uncomfortable.",
          "• Gifting: Bring sweets or flowers if invited to a home. Avoid leather gifts (considered impure in Hinduism).",
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Bhutan",
    slug: "bhutan",
    image: "/bhutan.jpg",
    heroTitle: "Before Your Trip to Bhutan",
    description: "Essential travel information and preparations before visiting Bhutan",
    sections: [
      {
        title: "1. Visa and Travel Requirements",
        content: [
          "• Visa Process: Most travelers (except Indian, Bangladeshi, and Maldivian nationals) must apply for a visa through a government-approved tour operator. The visa fee is $40, and the operator handles the application process.",
          "• Sustainable Development Fee (SDF): A daily fee of $200 per person (50% discount for children 6–11; free for under 6) supports Bhutan's environmental and social initiatives.",
          "• Travel Insurance: While no longer mandatory, it's highly recommended to cover altitude sickness, trekking, or emergencies.",
          "• Guided Tours: Independent travel is restricted. Visitors must book through a licensed tour operator, and a guide is mandatory for most activities, including trekking and visiting cultural sites.",
        ],
      },
      {
        title: "2. Best Time to Visit",
        content: [
          "• Spring (March–May): Ideal for festivals like Paro Tshechu and rhododendron blooms. Mild weather suits trekking.",
          "• Autumn (September–November): Clear skies for mountain views and festivals like Thimphu Tshechu.",
          "• Winter (December–February): Fewer crowds, crisp air, and lower costs. Cold in high-altitude areas.",
          "• Monsoon (June–August): Heavy rains limit trekking but offer lush landscapes and lower prices.",
        ],
      },
      {
        title: "3. Transportation and Entry Points",
        content: [
          "• Flights: Only Drukair and Bhutan Airlines fly into Paro Airport. Major transit hubs include Bangkok, Delhi, Kathmandu, and Singapore. The Kathmandu–Paro route offers stunning Himalayan views, including Everest.",
          "• Overland Entry: Possible via India through border towns like Phuentsholing. Requires permits and coordination with a tour operator.",
        ],
      },
      {
        title: "4. Cultural Etiquette and Norms",
        content: [
          "• Dress Code: Modest clothing (long sleeves/pants) in religious sites. Remove shoes and hats before entering temples.",
          "• Photography: Ask permission before photographing people or inside monasteries. Avoid pointing feet at religious objects.",
          "• Alcohol and Tobacco: Avoid alcohol on Tuesdays (local 'Dry Day'). Tobacco sales are illegal; tourists can bring limited cigarettes but must smoke in designated areas.",
          "• Greetings: Use 'Kuzuzangpo' (hello) with palms pressed together. Tipping guides/drivers is appreciated but not mandatory.",
        ],
      },
      {
        title: "5. Health and Safety",
        content: [
          "• Altitude Sickness: Risk increases above 2,500m. Acclimatize slowly, stay hydrated, and consider Diamox. Tiger's Nest Monastery (3,120m) requires gradual ascent.",
          "• Vaccinations: Recommended: hepatitis A/B, typhoid, tetanus, and rabies (due to stray animals).",
          "• Water and Food: Avoid tap water; use bottled/boiled water. Bhutanese cuisine is spicy (try ema datse—chilies with cheese), but milder options are available.",
        ],
      },
      {
        title: "6. Costs and Budgeting",
        content: [
          "• Daily Package: Mandatory for guided tours, covering accommodation, meals, transport, and guide fees. Budget $250–$400/day (higher for luxury options).",
          "• Cash: ATMs are scarce. Carry Bhutanese Ngultrum (BTN) or Indian Rupees (accepted). Credit cards work in cities but not rural areas.",
        ],
      },
      {
        title: "7. Environmental and Cultural Sustainability",
        content: [
          "• Carbon-Negative: Bhutan's constitution mandates 60% forest cover. Avoid single-use plastics (banned since 1999).",
          "• High-Value, Low-Impact Tourism: Fees fund free healthcare, education, and infrastructure. Respect local customs to preserve Bhutan's heritage.",
        ],
      },
      {
        title: "8. Must-See Attractions",
        content: [
          "• Tiger's Nest Monastery (Paro Taktsang): A 2–4-hour hike to Bhutan's iconic cliffside monastery.",
          "• Punakha Dzong: Stunning fortress at the confluence of two rivers.",
          "• Thimphu: Visit Buddha Dordenma statue and Tashichho Dzong (government seat).",
          "• Festivals: Plan around tsechus (masked dance festivals) for cultural immersion.",
        ],
      },
      {
        title: "9. Practical Tips",
        content: [
          "• Packing: Sunscreen, insect repellent, layers for variable weather, and sturdy hiking shoes.",
          "• Connectivity: Limited Wi-Fi outside cities; purchase a local SIM for data.",
          "• Language: English is widely spoken, but learning Dzongkha phrases (e.g., kadrin chhe = thank you) is appreciated.",
        ],
      },
    ],
  },
  {
    id: 4,
    name: "Tibet",
    slug: "tibet",
    image: "/tibet.jpg",
    heroTitle: "Before Your Trip to Tibet",
    description: "Essential travel information and preparations before visiting Tibet",
    sections: [
      {
        title: "1. Entry Requirements",
        content: [
          "• Tibet Travel Permit (TTP): Mandatory for all foreign travelers. Cannot be obtained independently—you must book through a registered Tibetan travel agency, which arranges the permit as part of a guided tour.",
          "• Additional permits (e.g., Alien's Travel Permit, Military Permit) are required for remote areas like Mount Kailash, Everest Base Camp, or Ngari.",
          "• Chinese Visa: Apply for a Chinese visa first; specify Tibet as a destination (some agencies advise not mentioning Tibet to avoid delays).",
          "• Group Travel: Independent travel is not allowed; you must join an organized tour with a guide and private vehicle.",
        ],
      },
      {
        title: "2. Health & Safety",
        content: [
          "• Altitude Sickness: Lhasa sits at 3,650m (12,000ft). Acclimatize slowly, avoid alcohol, and stay hydrated. Carry medication (e.g., Diamox).",
          "• Symptoms: Headaches, nausea, dizziness. Descend immediately if severe.",
          "• Medical Facilities: Limited outside Lhasa. Carry a first-aid kit and medications.",
          "• Travel Insurance: Ensure coverage for high-altitude emergencies and evacuation.",
        ],
      },
      {
        title: "3. Cultural Etiquette",
        content: [
          "• Respect Religious Sites: Circumambulate stupas and temples clockwise.",
          "• Do not touch religious artifacts, monks, or prayer flags.",
          "• Remove hats and shoes before entering monasteries.",
          "• Photography: No photos inside most monasteries or of military/police installations. Ask permission before photographing locals.",
          "• Dress Modestly: Cover shoulders and knees in monasteries.",
        ],
      },
      {
        title: "4. Political Sensitivity",
        content: [
          "• Avoid Sensitive Topics: Discussions about the Dalai Lama, Tibetan independence, or Chinese policies are highly sensitive. Exercise caution in conversations.",
          "• Censorship: Social media (e.g., Facebook, Google) is blocked. Use a VPN at your own risk (illegal in China).",
          "• Restrictions: Some areas/monasteries may be closed unexpectedly due to political reasons.",
        ],
      },
      {
        title: "5. Money & Connectivity",
        content: [
          "• Currency: Chinese Yuan (CNY). ATMs in Lhasa/Shigatse; carry cash for remote areas.",
          "• Tipping: Not customary but increasingly expected for guides/drivers (ask your agency for guidance).",
          "• Internet/Communication: Limited connectivity in rural areas. Buy a Chinese SIM card (China Mobile/Unicom) in mainland China before entering Tibet.",
          "• Wi-Fi is slow and censored.",
        ],
      },
      {
        title: "6. Transportation",
        content: [
          "• Getting to Tibet: Flights to Lhasa via Chengdu, Kathmandu (requires a Chinese group visa), or other Chinese cities.",
          "• Train: The Qinghai-Tibet Railway (from Xining) is scenic but requires a permit.",
          "• Road Travel: Long, bumpy journeys; prepare for altitude changes.",
        ],
      },
      {
        title: "7. Best Time to Visit",
        content: [
          "• Ideal Seasons: May–October (warmer weather, clearer skies).",
          "• Avoid: Winter (Dec–Feb) due to extreme cold and road closures.",
          "• Festivals: Losar (Tibetan New Year, Feb/Mar) and Saga Dawa (May/Jun) are vibrant but expect crowds.",
        ],
      },
      {
        title: "8. Environmental Responsibility",
        content: [
          "• Eco-Friendly Practices: Avoid littering; carry reusable water bottles (purify water).",
          "• Sacred Sites: Do not disturb stones, prayer flags, or natural landmarks.",
        ],
      },
      {
        title: "9. Packing Essentials",
        content: [
          "• Clothing: Layered warm clothing (temperatures vary drastically), sturdy hiking boots, sun hat, UV-blocking sunglasses.",
          "• Gear: Power bank, solar charger, sleeping bag (for basic guesthouses).",
          "• Documents: Passport, permits, insurance, and copies stored separately.",
        ],
      },
      {
        title: "10. Local Cuisine",
        content: [
          "• Try: Tsampa (roasted barley flour), yak butter tea, momos, and thukpa (noodle soup).",
          "• Food Safety: Stick to cooked meals and reputable restaurants; avoid tap water.",
        ],
      },
      {
        title: "11. Ethical Tourism",
        content: [
          "• Support Local: Choose Tibetan-owned guesthouses or tour operators.",
          "• Cultural Respect: Avoid exploitative practices (e.g., intrusive photography of rituals).",
        ],
      },
      {
        title: "12. Emergency Contacts",
        content: [
          "• Police: 110 (China-wide emergency number).",
          "• Ambulance: 120.",
          "• Embassy Registration: Inform your embassy of your travel plans.",
        ],
      },
      {
        title: "13. Key Differences from Nepal",
        content: [
          "• Stricter Regulations: Tibet requires permits, guided tours, and has more political restrictions.",
          "• Altitude: Higher average elevation than Nepal; acclimatization is critical.",
          "• Cultural Context: Tibetan Buddhism dominates daily life; respect its traditions deeply.",
        ],
      },
    ],
  },
];

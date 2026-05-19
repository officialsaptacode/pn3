export interface Article {
  slug: string;
  category: 'gorkha' | 'gandaki' | 'national' | 'sports' | 'business' | 'opinion' | 'international' | 'entertainment';
  image: string;
  date: {
    ne: string;
    en: string;
  };
  author: {
    ne: string;
    en: string;
    initials: { ne: string; en: string };
    phone?: string;
    bio?: { ne: string; en: string };
  };
  title: {
    ne: string;
    en: string;
  };
  summary: {
    ne: string;
    en: string;
  };
  content: {
    ne: string[];
    en: string[];
  };
  tags: {
    ne: string[];
    en: string[];
  };
  isFeatured?: boolean;
}

export interface Video {
  slug: string;
  duration: string;
  date: { ne: string; en: string };
  author: { ne: string; en: string };
  title: { ne: string; en: string };
  image: string;
  category: 'politics' | 'sports' | 'entertainment' | 'special';
}

export interface Opinion {
  slug: string;
  author: {
    ne: string;
    en: string;
    initials: { ne: string; en: string };
    bio?: { ne: string; en: string };
  };
  title: { ne: string; en: string };
  date: { ne: string; en: string };
}

export interface TeamMember {
  initials: { ne: string; en: string };
  name: { ne: string; en: string };
  phone: string;
}

export const mockArticles: Article[] = [
  {
    slug: "gorkha-earthquake-10th-anniversary",
    category: "gorkha",
    image: "https://picsum.photos/seed/gorkha1/880/495",
    date: { ne: "२ घण्टा अघि", en: "2 hours ago" },
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." },
      phone: "९८४६०९८०७३",
      bio: {
        ne: "नरेन्द्र ढकाल गोर्खा दैनिकका वरिष्ठ संवाददाता हुन्। उनले विगत ५ वर्षदेखि स्थानीय विकास र राजनीतिक विषयमा रिपोर्टिङ गर्दै आएका छन्।",
        en: "Narendra Dhakal is a senior correspondent at Gorkha Daily. He has been reporting on local development and political issues for the past 5 years."
      }
    },
    title: {
      ne: "गोरखा भूकम्पको १० औं वार्षिकोत्सव: पुनर्निर्माण र बाँकी चुनौती",
      en: "10th Anniversary of Gorkha Earthquake: Reconstruction and Remaining Challenges"
    },
    summary: {
      ne: "गोरखा भूकम्प गएको १० वर्ष पूरा भएको अवसरमा पुनर्निर्माणका सफलता र अझै बाँकी रहेका चुनौतीहरूका बारेमा एक विशेष समीक्षा।",
      en: "On the occasion of the 10th anniversary of the Gorkha earthquake, a special review of reconstruction successes and remaining challenges."
    },
    content: {
      ne: [
        "वि.सं. २०७२ वैशाख १२ गते गोरखाको बारपाक केन्द्रविन्दु भएर गएको विनाशकारी भूकम्पको १० वर्ष पूरा भएको छ। यस अवधिमा निजी आवास, विद्यालय, स्वास्थ्य संस्था र पुरातात्विक सम्पदाहरूको पुनर्निर्माणमा उल्लेखनीय प्रगति भएको छ। तर, अझै पनि धेरै ठाउँमा जोखिमयुक्त बस्तीहरूको स्थानान्तरण र जीविकोपार्जनका चुनौतीहरू कायमै छन्।",
        "पुनर्निर्माण प्राधिकरणको म्याद सकिएपछि बाँकी कामहरू सम्बन्धित स्थानीय तह र विभागहरूले हेरिरहेका छन्। स्थानीय नागरिकहरूका अनुसार घरहरू त बनेका छन् तर आर्थिक संकट र गाउँमा रोजगारीको अभावले गर्दा धेरै मानिसहरू शहर पस्न बाध्य भएका छन्।",
        "सरकारी तथ्याङ्क अनुसार गोरखा जिल्लामा मात्र ९० प्रतिशत भन्दा बढी निजी आवासको पुनर्निर्माण सम्पन्न भइसकेको छ। भूकम्प प्रतिरोधी घरहरू बने पनि खानेपानीको मुहान सुक्ने र पहाडी इलाकामा पहिरोको जोखिम बढ्ने जस्ता वातावरणीय समस्याहरूले नयाँ चुनौती थपेका छन्।"
      ],
      en: [
        "Ten years have passed since the devastating earthquake with its epicenter in Barpak, Gorkha, struck on April 25, 2015. During this period, significant progress has been made in the reconstruction of private houses, schools, health institutions, and archaeological heritage sites. However, challenges regarding the relocation of vulnerable settlements and sustainable livelihoods still persist in many areas.",
        "After the expiration of the Reconstruction Authority, the remaining tasks are being handled by local levels and respective departments. Local residents state that while houses have been rebuilt, economic crises and lack of employment opportunities in villages have forced many to migrate to cities.",
        "According to government data, more than 90 percent of private housing reconstruction in Gorkha district has been completed. Although earthquake-resistant houses have been constructed, environmental issues such as drying up of water sources and increased risk of landslides in hilly regions have posed new challenges."
      ]
    },
    tags: {
      ne: ["गोरखा", "भूकम्प", "पुनर्निर्माण", "१०औं वर्ष"],
      en: ["Gorkha", "Earthquake", "Reconstruction", "10th Year"]
    },
    isFeatured: true
  },
  {
    slug: "oli-vote-of-confidence",
    category: "national",
    image: "https://picsum.photos/seed/nat1/400/225",
    date: { ne: "३ घण्टा अघि", en: "3 hours ago" },
    author: {
      ne: "अब्जल मियाँ",
      en: "Abzal Miya",
      initials: { ne: "अ.मि.", en: "A.M." }
    },
    title: {
      ne: "प्रधानमन्त्री ओलीले संसदमा पाए विश्वासको मत",
      en: "Prime Minister Oli Wins Vote of Confidence in Parliament"
    },
    summary: {
      ne: "प्रतिनिधिसभामा भएको मतदानमा प्रधानमन्त्री केपी शर्मा ओलीले स्पष्ट बहुमतका साथ विश्वासको मत प्राप्त गर्नुभएको छ।",
      en: "Prime Minister KP Sharma Oli has secured the vote of confidence with a clear majority in the House of Representatives voting."
    },
    content: {
      ne: [
        "प्रधानमन्त्री केपी शर्मा ओलीले प्रतिनिधिसभाबाट दुई तिहाई बहुमतका साथ विश्वासको मत प्राप्त गर्नुभएको छ। मतदानमा सहभागी सांसदहरूमध्ये बहुमतले प्रधानमन्त्रीको पक्षमा मतदान गरेका थिए। विपक्षी दलहरूले भने सरकारको आलोचना गर्दै विपक्षमा मतदान गरे।",
        "विश्वासको मत प्राप्त गरेपछि प्रधानमन्त्री ओलीले देशमा राजनीतिक स्थिरता कायम गर्दै आर्थिक विकासको यात्रालाई तीव्रता दिने प्रतिबद्धता व्यक्त गर्नुभयो।"
      ],
      en: [
        "Prime Minister KP Sharma Oli has obtained a vote of confidence with a two-thirds majority from the House of Representatives. Out of the lawmakers participating, a majority voted in favor of the Prime Minister. Opposition parties criticized the government and voted against.",
        "After winning the vote, PM Oli expressed his commitment to maintaining political stability and accelerating economic development in the country."
      ]
    },
    tags: {
      ne: ["केपी ओली", "विश्वासको मत", "संसद", "राजनीति"],
      en: ["KP Oli", "Vote of Confidence", "Parliament", "Politics"]
    }
  },
  {
    slug: "manakamana-temple-devotees",
    category: "gorkha",
    image: "https://picsum.photos/seed/gorkha2/400/225",
    date: { ne: "४ घण्टा अघि", en: "4 hours ago" },
    author: {
      ne: "बिबर गुरुङ",
      en: "Bibar Gurung",
      initials: { ne: "बि.गु.", en: "B.G." },
      phone: "९८६१९९२७४२"
    },
    title: {
      ne: "मनकामना मन्दिरमा भक्तजनको भिड — व्यवस्थापनमा चुनौती",
      en: "Crowds Flock to Manakamana Temple — Management Challenges"
    },
    summary: {
      ne: "प्रसिद्ध धार्मिक स्थल मनकामना मन्दिरमा आज दर्शनार्थीहरूको ठूलो भिड लागेको छ। दर्शन कार्य व्यवस्थित गर्न हम्मे-हम्मे परेको छ।",
      en: "A massive crowd of devotees has gathered at the famous religious site Manakamana Temple today. Managing the worship line has become difficult."
    },
    content: {
      ne: [
        "गोरखाको सहिद लखन गाउँपालिकामा अवस्थित प्रसिद्ध शक्तिपीठ मनकामना मन्दिरमा दर्शनार्थीको भीड बढेको छ। केवलकार र पैदल मार्ग दुवै तर्फबाट आउने श्रद्धालुहरूको संख्यामा वृद्धि भएको हो।",
        "दर्शन कार्यलाई सहज बनाउन स्थानीय सुरक्षाकर्मी र स्वयंसेवक परिचालन गरिए पनि घण्टौंसम्म लाममा बस्नुपर्ने अवस्था रहेको छ।"
      ],
      en: [
        "The number of visitors has surged at the famous Shaktipeeth Manakamana Temple located in Sahid Lakhan Rural Municipality of Gorkha. Devotees coming via both cable car and trekking routes have increased.",
        "Although local security personnel and volunteers have been mobilized to ease the process, visitors still have to wait in queues for hours."
      ]
    },
    tags: {
      ne: ["मनकामना", "गोरखा", "पर्यटन", "धार्मिक"],
      en: ["Manakamana", "Gorkha", "Tourism", "Religious"]
    }
  },
  {
    slug: "pokhara-international-tourism-rise",
    category: "gandaki",
    image: "https://picsum.photos/seed/gandaki1/400/225",
    date: { ne: "५ घण्टा अघि", en: "5 hours ago" },
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." }
    },
    title: {
      ne: "पोखरामा अन्तर्राष्ट्रिय पर्यटकको संख्यामा उल्लेख्य वृद्धि",
      en: "Significant Rise in International Tourism in Pokhara"
    },
    summary: {
      ne: "गण्डकी प्रदेशको प्रमुख पर्यटकीय गन्तव्य पोखरामा विदेशी पर्यटकको आगमनमा उत्साहजनक वृद्धि भएको छ।",
      en: "International tourist arrivals have seen an encouraging surge in Pokhara, the main tourist destination of Gandaki Province."
    },
    content: {
      ne: [
        "शरद ऋतु सुरु भएसँगै पोखरा घुम्न आउने विदेशी पर्यटकहरूको संख्या बढेको छ। पर्यटन व्यवसायीहरूका अनुसार होटल र ट्राभल एजेन्सीहरूको बुकिङ ९० प्रतिशत भन्दा माथि पुगेको छ।",
        "विशेष गरी ट्रेकिङ र साहसिक खेलकुदका लागि पोखरा आउने पर्यटकहरूको आकर्षण बढी देखिएको छ।"
      ],
      en: [
        "With the start of the autumn season, foreign tourist arrivals in Pokhara have increased. Tourism entrepreneurs report hotel and travel agency bookings reaching above 90 percent.",
        "Tourists visiting Pokhara are particularly attracted to trekking and adventure sports activities."
      ]
    },
    tags: {
      ne: ["पोखरा", "पर्यटन", "गण्डकी", "विदेशी पर्यटक"],
      en: ["Pokhara", "Tourism", "Gandaki", "Foreign Tourists"]
    }
  },
  {
    slug: "nepal-cricket-asia-cup-spot",
    category: "sports",
    image: "https://picsum.photos/seed/sports1/400/225",
    date: { ne: "६ घण्टा अघि", en: "6 hours ago" },
    author: {
      ne: "बिबर गुरुङ",
      en: "Bibar Gurung",
      initials: { ne: "बि.गु.", en: "B.G." }
    },
    title: {
      ne: "नेपाली राष्ट्रिय क्रिकेट टोलीद्वारा एसिया कपमा स्थान सुरक्षित",
      en: "Nepali National Cricket Team Secures Spot in Asia Cup"
    },
    summary: {
      ne: "उत्कृष्ट प्रदर्शन गर्दै नेपाली क्रिकेट टोलीले आगामी एसिया कप प्रतियोगिताका लागि आफ्नो यात्रा पक्का गरेको छ।",
      en: "With an outstanding performance, the Nepali cricket team has secured its spot in the upcoming Asia Cup tournament."
    },
    content: {
      ne: [
        "नेपाली राष्ट्रिय क्रिकेट टोलीले छनोट खेलको फाइनलमा ऐतिहासिक जित हासिल गर्दै एसिया कपमा स्थान बनाएको छ। कप्तान रोहित पौडेलको अर्धशतकीय योगदान र बलरहरूको कसिलो बलिङका कारण नेपाल विजयी भयो।",
        "यस ऐतिहासिक जितसँगै देशभरका खेलप्रेमीहरूमा खुसीयाली छाएको छ भने खेल संघहरूले खेलाडीहरूलाई पुरस्कार घोषणा गरेका छन्।"
      ],
      en: [
        "The Nepali national cricket team has secured a place in the Asia Cup by winning the qualifying final. Captain Rohit Paudel's half-century and tight bowling by the bowlers led Nepal to victory.",
        "With this historic win, sports fans across the nation are celebrating, and sports associations have announced rewards for the players."
      ]
    },
    tags: {
      ne: ["नेपाल क्रिकेट", "एसिया कप", "खेलकुद", "क्यान"],
      en: ["Nepal Cricket", "Asia Cup", "Sports", "CAN"]
    }
  },
  {
    slug: "share-market-nepse-analysis",
    category: "business",
    image: "https://picsum.photos/seed/biz1/400/225",
    date: { ne: "७ घण्टा अघि", en: "7 hours ago" },
    author: {
      ne: "अब्जल मियाँ",
      en: "Abzal Miya",
      initials: { ne: "अ.मि.", en: "A.M." }
    },
    title: {
      ne: "सेयर बजारमा सुधार: नेप्से परिसूचकमा हरियाली",
      en: "Stock Market Recovery: NEPSE Index Swells"
    },
    summary: {
      ne: "लगातारको गिरावट पछि आज सेयर बजारमा उछाल आएको छ। नेप्से परिसूचक ४२ अङ्कले बढेर बन्द भएको छ।",
      en: "After consecutive declines, the stock market rebounded sharply today. The NEPSE index closed 42 points higher."
    },
    content: {
      ne: [
        "नेपाल स्टक एक्सचेन्ज (नेप्से) आज परिसूचक हरियो भएर बन्द भएको छ। जलविद्युत र बैंकिङ उपसमूहका सेयरहरूमा उल्लेख्य वृद्धि देखिएको छ। कारोबार रकममा पनि सुधार आएको छ।",
        "लगानीकर्ताहरूका अनुसार सरकार परिवर्तन र मौद्रिक नीति परिमार्जनको सकारात्मक चर्चाले गर्दा बजारमा आकर्षण बढेको हो।"
      ],
      en: [
        "The Nepal Stock Exchange (NEPSE) closed in green territory today. Hydropower and banking sub-indices saw notable gains. The transaction volume also improved.",
        "Investors attribute the market rise to positive discussions surrounding government transitions and changes in monetary policy."
      ]
    },
    tags: {
      ne: ["नेप्से", "सेयर बजार", "अर्थतन्त्र", "कारोबार"],
      en: ["NEPSE", "Stock Market", "Economy", "Trading"]
    }
  },
  {
    slug: "gorkha-farmers-irrigation-demand",
    category: "gorkha",
    image: "https://picsum.photos/seed/gorkha3/400/225",
    date: { ne: "१ दिन अघि", en: "1 day ago" },
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." }
    },
    title: {
      ne: "गोरखाका किसानहरूद्वारा सिँचाइ नहर निर्माणको माग",
      en: "Gorkha Farmers Demand Irrigation Canal Construction"
    },
    summary: {
      ne: "हिउँदे बाली लगाउने समय नजिकिँदै गर्दा गोरखाका कृषकहरूले तत्काल सिँचाइको उचित व्यवस्था गर्न स्थानीय तहसँग माग गरेका छन्।",
      en: "As the winter crop sowing season approaches, Gorkha farmers have urged local authorities to arrange proper irrigation channels immediately."
    },
    content: {
      ne: [
        "गोरखा जिल्लाका विभिन्न कृषि पकेट क्षेत्रका किसानहरूले सिँचाइको अभावमा बाली लगाउन गाह्रो भएको गुनासो गरेका छन्। समयमा पानी नपर्दा र सिँचाइ नहर नहुँदा उत्पादन घट्ने चिन्ता बढेको छ।",
        "स्थानीय सहकारी मार्फत किसानहरूले नगरपालिकालाई ज्ञापनपत्र बुझाउँदै बजेट विनियोजन गर्न दबाब दिएका छन्।"
      ],
      en: [
        "Farmers in various agricultural pocket zones of Gorkha district complain that lack of irrigation makes crop cultivation difficult. Concerns are rising over lower yields due to dry weather and absent canals.",
        "Through local cooperatives, farmers have submitted a memorandum to the municipality pushing for budget allocation."
      ]
    },
    tags: {
      ne: ["गोरखा", "कृषि", "सिँचाइ", "किसान"],
      en: ["Gorkha", "Agriculture", "Irrigation", "Farmers"]
    }
  },
  {
    slug: "gandaki-hydropower-project",
    category: "gandaki",
    image: "https://picsum.photos/seed/gandaki2/400/225",
    date: { ne: "१ दिन अघि", en: "1 day ago" },
    author: {
      ne: "अब्जल मियाँ",
      en: "Abzal Miya",
      initials: { ne: "अ.मि.", en: "A.M." }
    },
    title: {
      ne: "तनहुँमा मध्यम जलविद्युत आयोजनाको काम सुरु",
      en: "Construction Commences on Mid-Size Hydropower in Tanahun"
    },
    summary: {
      ne: "गण्डकी प्रदेश अन्तर्गत तनहुँ जिल्लामा नयाँ जलविद्युत आयोजनाको पूर्वाधार निर्माण कार्य सुरु गरिएको छ।",
      en: "Infrastructure work has started for a new hydropower project in Tanahun district within Gandaki Province."
    },
    content: {
      ne: [
        "स्थानीय खोलाबाट ३५ मेगावाट क्षमताको विद्युत उत्पादन गर्ने लक्ष्यका साथ आयोजनाको काम सुरु भएको हो। आयोजनाले आगामी ३ वर्ष भित्र राष्ट्रिय प्रसारण लाइनमा विद्युत जोड्ने योजना राखेको छ।",
        "यस आयोजनाबाट स्थानीय क्षेत्रमा रोजगारी सिर्जना हुनुका साथै पूर्वाधार विकासमा टेवा पुग्ने विश्वास लिइएको छ।"
      ],
      en: [
        "Construction began with a goal to generate 35 MW of electricity from a local river. The project plans to connect to the national grid within 3 years.",
        "It is expected that this project will generate employment opportunities locally and support infrastructure development."
      ]
    },
    tags: {
      ne: ["तनहुँ", "जलविद्युत", "ऊर्जा", "गण्डकी"],
      en: ["Tanahun", "Hydropower", "Energy", "Gandaki"]
    }
  },
  {
    slug: "kathmandu-traffic-policy",
    category: "national",
    image: "https://picsum.photos/seed/nat2/400/225",
    date: { ne: "२ दिन अघि", en: "2 days ago" },
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." }
    },
    title: {
      ne: "काठमाडौँ उपत्यकामा नयाँ ट्राफिक नियम लागु",
      en: "New Traffic Regulations Enforced in Kathmandu Valley"
    },
    summary: {
      ne: "ट्राफिक चाप कम गर्न र सडक दुर्घटना न्यूनीकरणका लागि काठमाडौँमा नयाँ ट्राफिक नियम कार्यान्वयनमा ल्याइएको छ।",
      en: "New traffic rules have been implemented in Kathmandu to ease traffic congestion and reduce road accidents."
    },
    content: {
      ne: [
        "महानगरीय ट्राफिक प्रहरी महाशाखाले मुख्य सडकहरूमा लेन अनुशासन कडा पार्नुका साथै पिक आवरमा मालवाहक गाडीहरूमा प्रतिबन्ध लगाएको छ।",
        "नियम उल्लंघन गर्ने चालकहरूलाई तत्काल कारबाही र जरिवानाको दायरा फराकिलो बनाइएको छ।"
      ],
      en: [
        "The Metropolitan Traffic Police Division has tightened lane discipline on major roads and restricted cargo trucks during peak hours.",
        "Instant penalties and fines have been expanded for drivers violating the rules."
      ]
    },
    tags: {
      ne: ["काठमाडौँ", "ट्राफिक नियम", "सडक सुरक्षा", "प्रहरी"],
      en: ["Kathmandu", "Traffic Rules", "Road Safety", "Police"]
    }
  },
  {
    slug: "pokhara-cultural-center",
    category: "entertainment",
    image: "https://picsum.photos/seed/ent1/400/225",
    date: { ne: "२ दिन अघि", en: "2 days ago" },
    author: {
      ne: "बिबर गुरुङ",
      en: "Bibar Gurung",
      initials: { ne: "बि.गु.", en: "B.G." }
    },
    title: {
      ne: "पोखरामा नयाँ सांस्कृतिक प्रेक्षालय निर्माण हुने",
      en: "New Cultural Theater to be Constructed in Pokhara"
    },
    summary: {
      ne: "गण्डकी प्रदेशको परम्परागत संस्कृति संरक्षणका लागि पोखरामा अत्याधुनिक सांस्कृतिक प्रेक्षालयको सिलान्यास गरिएको छ।",
      en: "To preserve traditional culture in Gandaki Province, the foundation of a modern cultural theater has been laid in Pokhara."
    },
    content: {
      ne: [
        "स्थानीय सरकार र निजी क्षेत्रको सहकार्यमा अन्तर्राष्ट्रिय स्तरको हल बन्ने भएको छ। यहाँ नाटक मञ्चन र सांस्कृतिक कार्यक्रमहरू प्रदर्शन गरिनेछ।",
        "कलाकारहरूले यो प्रेक्षालय निर्माणको स्वागत गरेका छन् र यसले पोखराको कला क्षेत्रलाई नयाँ उचाइ दिने बताएका छन्।"
      ],
      en: [
        "In collaboration with local government and the private sector, an international standard hall will be built. Theater plays and cultural programs will be hosted here.",
        "Artists have welcomed the construction, saying it will push Pokhara's art scene to new heights."
      ]
    },
    tags: {
      ne: ["सांस्कृतिक प्रेक्षालय", "पोखरा", "कला र संस्कृति", "रङ्गमञ्च"],
      en: ["Cultural Theater", "Pokhara", "Art & Culture", "Theater"]
    }
  },
  {
    slug: "nepal-vs-bhutan-football-game",
    category: "sports",
    image: "https://picsum.photos/seed/sports2/400/225",
    date: { ne: "३ दिन अघि", en: "3 days ago" },
    author: {
      ne: "अब्जल मियाँ",
      en: "Abzal Miya",
      initials: { ne: "अ.मि.", en: "A.M." }
    },
    title: {
      ne: "नेपाल बनाम भुटान मैत्रिपूर्ण फुटबल खेल — रोमाञ्चक भिडन्त",
      en: "Nepal vs Bhutan Friendly Football Match — Thrilling Contest"
    },
    summary: {
      ne: "दशरथ रंगशालामा भएको मैत्रिपूर्ण खेलमा नेपालले भुटानलाई पराजित गर्दै उत्कृष्ट प्रदर्शन गरेको छ।",
      en: "Nepal put up an excellent performance to defeat Bhutan in a friendly match played at Dasarath Stadium."
    },
    content: {
      ne: [
        "नेपाली राष्ट्रिय फुटबल टोलीले भुटान विरुद्धको खेल २-१ गोल अन्तरले जितेको हो। खेलको दोस्रो हाफमा नेपालले पुनरागमन गर्दै दुई गोल फर्कायो।",
        "घरेलु दर्शकहरूको ठूलो समर्थन पाएको नेपालले थप सुधार गर्ने प्रशिक्षकले पत्रकार सम्मेलनमा बताउनुभयो।"
      ],
      en: [
        "The Nepali national football team won 2-1 against Bhutan. Nepal made a comeback in the second half to score two goals.",
        "Backed by strong home support, Nepal still has room to improve, the coach shared in the press conference."
      ]
    },
    tags: {
      ne: ["नेपाल फुटबल", "भुटान", "मैत्रिपूर्ण खेल", "खेलकुद"],
      en: ["Nepal Football", "Bhutan", "Friendly Match", "Sports"]
    }
  },
  {
    slug: "nepalese-diaspora-global-summit",
    category: "international",
    image: "https://picsum.photos/seed/int1/400/225",
    date: { ne: "४ दिन अघि", en: "4 days ago" },
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." }
    },
    title: {
      ne: "गैरआवासीय नेपालीहरूको सम्मेलन काठमाडौँमा सुरु",
      en: "Non-Resident Nepali Global Summit Starts in Kathmandu"
    },
    summary: {
      ne: "विश्वभर छरिएर रहेका नेपालीहरूको लगानी र सीपलाई नेपाल भित्राउने उद्देश्यका साथ तीन दिवसीय सम्मेलन सुरु भएको छ।",
      en: "A three-day conference has kicked off to bring investments and skills of Nepalese scattered globally into Nepal."
    },
    content: {
      ne: [
        "गैरआवासीय नेपाली संघ (एनआरएनए) को आयोजनामा सुरु भएको सम्मेलनमा ५० भन्दा बढी देशका प्रतिनिधिहरू सहभागी छन्।",
        "उद्घाटन सत्रमा राष्ट्रपतिले गैरआवासीय नेपालीहरूलाई देश विकासमा हातेमालो गर्न आग्रह गर्नुभयो।"
      ],
      en: [
        "Organized by the Non-Resident Nepali Association (NRNA), the conference features representatives from over 50 countries.",
        "During the opening session, the President urged non-resident Nepalese to join hands for national development."
      ]
    },
    tags: {
      ne: ["गैरआवासीय नेपाली", "लगानी", "सम्मेलन", "काठमाडौँ"],
      en: ["NRNA", "Investment", "Summit", "Kathmandu"]
    }
  }
];

export const mockVideos: Video[] = [
  {
    slug: "kathmandu-fire-damage-reports",
    duration: "५:४२",
    date: { ne: "२ घण्टा अघि", en: "2 hours ago" },
    author: { ne: "नरेन्द्र ढकाल", en: "Narendra Dhakal" },
    title: {
      ne: "काठमाडौँको मुख्य बजारमा आगलागी — ठूलो धनजनको क्षति",
      en: "Major Fire in Kathmandu's Main Market — Huge Property Damage"
    },
    image: "https://picsum.photos/seed/vid1/880/495",
    category: "special"
  },
  {
    slug: "parliament-budget-debate-highlights",
    duration: "७:१५",
    date: { ne: "३ घण्टा अघि", en: "3 hours ago" },
    author: { ne: "अब्जल मियाँ", en: "Abzal Miya" },
    title: {
      ne: "संसदमा बजेट माथि तातो बहस — मुख्य अंशहरू",
      en: "Heated Debate on Budget in Parliament — Key Highlights"
    },
    image: "https://picsum.photos/seed/vid2/500/281",
    category: "politics"
  },
  {
    slug: "nepal-vs-bhutan-goals-moments",
    duration: "४:३२",
    date: { ne: "५ घण्टा अघि", en: "5 hours ago" },
    author: { ne: "बिबर गुरुङ", en: "Bibar Gurung" },
    title: {
      ne: "नेपाल बनाम भुटान फुटबल — खेलका रोमान्चक गोलहरू र क्षण",
      en: "Nepal vs Bhutan Football — Thrilling Goals and Game Moments"
    },
    image: "https://picsum.photos/seed/vid3/500/281",
    category: "sports"
  },
  {
    slug: "manakamana-temple-devotees-rush",
    duration: "२:४८",
    date: { ne: "४ घण्टा अघि", en: "4 hours ago" },
    author: { ne: "बिबर गुरुङ", en: "Bibar Gurung" },
    title: {
      ne: "मनकामना मन्दिरमा आज देखिएको भक्तजनको घुइँचो",
      en: "Huge Rush of Devotees Observed at Manakamana Temple Today"
    },
    image: "https://picsum.photos/seed/vid4/500/281",
    category: "special"
  },
  {
    slug: "nepse-share-market-today-analysis",
    duration: "३:२०",
    date: { ne: "६ घण्टा अघि", en: "6 hours ago" },
    author: { ne: "अब्जल मियाँ", en: "Abzal Miya" },
    title: {
      ne: "सेयर बजारमा आएको हरियालीको आजको विस्तृत विश्लेषण",
      en: "Detailed Analysis of Today's Positive Rebound in Stock Market"
    },
    image: "https://picsum.photos/seed/vid5/500/281",
    category: "politics"
  }
];

export const mockOpinions: Opinion[] = [
  {
    slug: "journalism-in-nepal-challenges",
    author: {
      ne: "रमा सिम्खडा",
      en: "Rama Simkhada",
      initials: { ne: "र.सि.", en: "R.S." },
      bio: {
        ne: "रमा सिम्खडा गोर्खा दैनिककी प्रकाशक तथा प्रधान सम्पादक हुन्। उनले विगत १५ वर्षदेखि पत्रकारिता क्षेत्रमा सक्रिय भूमिका खेल्दै आएकी छिन्।",
        en: "Rama Simkhada is the Publisher and Chief Editor of Gorkha Daily. She has been active in the journalism field for the past 15 years."
      }
    },
    title: {
      ne: "नेपाली पत्रकारितामा निष्पक्षता र व्यावसायिकताको संकट",
      en: "Crisis of Impartiality and Professionalism in Nepalese Journalism"
    },
    date: { ne: "२ दिन अघि", en: "2 days ago" }
  },
  {
    slug: "local-governments-development",
    author: {
      ne: "नरेन्द्र ढकाल",
      en: "Narendra Dhakal",
      initials: { ne: "न.ढ.", en: "N.D." }
    },
    title: {
      ne: "स्थानीय तहको बजेट विनियोजन: कति जनमुखी, कति कार्यकर्ता मुखी?",
      en: "Budget Allocation in Local Levels: How Citizen-centric is it?"
    },
    date: { ne: "३ दिन अघि", en: "3 days ago" }
  },
  {
    slug: "tourism-revival-policy-reforms",
    author: {
      ne: "बिबर गुरुङ",
      en: "Bibar Gurung",
      initials: { ne: "बि.गु.", en: "B.G." }
    },
    title: {
      ne: "पर्यटन पुनरुत्थानका लागि नीतिगत सुधार र पूर्वाधार विकासको खाँचो",
      en: "Need for Policy Reform and Infrastructure for Tourism Revival"
    },
    date: { ne: "५ दिन अघि", en: "5 days ago" }
  }
];

export const mockTeam: TeamMember[] = [
  {
    initials: { ne: "न.ढ.", en: "N.D." },
    name: { ne: "नरेन्द्र ढकाल", en: "Narendra Dhakal" },
    phone: "९८४६०९८०७३"
  },
  {
    initials: { ne: "बि.गु.", en: "B.G." },
    name: { ne: "बिबर गुरुङ", en: "Bibar Gurung" },
    phone: "९८६१९९२७४२"
  },
  {
    initials: { ne: "अ.मि.", en: "A.M." },
    name: { ne: "अब्जल मियाँ", en: "Abzal Miya" },
    phone: "९८४६७४७००२"
  }
];

export interface Stock {
  symbol: string;
  price: string;
  change: string;
  direction: "up" | "down" | "flat";
}

export const mockStocks: Stock[] = [
  { symbol: "NABIL", price: "1,245", change: "+15 (+1.2%)", direction: "up" },
  { symbol: "NICA", price: "940", change: "-59 (-5.9%)", direction: "down" },
  { symbol: "HRL", price: "626", change: "-51 (-7.5%)", direction: "down" },
  { symbol: "MEN", price: "606", change: "+6 (+1.0%)", direction: "up" },
  { symbol: "AHL", price: "510", change: "-56 (-9.9%)", direction: "down" },
  { symbol: "HDHPC", price: "221", change: "+0.0 (0.0%)", direction: "flat" },
  { symbol: "KKHC", price: "267", change: "-2 (-1.1%)", direction: "down" },
  { symbol: "GBBL", price: "380", change: "+8 (+2.2%)", direction: "up" },
  { symbol: "NTC", price: "890", change: "+12 (+1.4%)", direction: "up" },
  { symbol: "SHIVM", price: "178", change: "-4 (-2.2%)", direction: "down" },
];

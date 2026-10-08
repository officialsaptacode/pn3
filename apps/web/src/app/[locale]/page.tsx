import { Activity, ArrowRight, FileCheck2, LibraryBig, ShieldCheck, Zap } from "lucide-react";
import { Link } from "@/i18n/routing";
import { DemoBubble } from "./demo-bubble";

interface LandingProps {
  params: Promise<{ locale: string }>;
}

const STEPS = [
  {
    no: "01",
    icon: FileCheck2,
    en: {
      title: "Draft once with AI",
      body: "Write a rough reminder. System 2 polishes it to a polite 160-character template and keeps your {variables} intact.",
    },
    ne: {
      title: "AI बाट एकपटक मस्यौदा",
      body: "कच्चा रिमाइन्डर लेख्नुहोस्। System 2 ले यसलाई शिष्ट १६०-अक्षरको टेम्प्लेट बनाउँछ र {variables} जोगाउँछ।",
    },
  },
  {
    no: "02",
    icon: ShieldCheck,
    en: {
      title: "Pass Laya compliance",
      body: "System 1 scores the template for spam and compliance risk. Under 0.5 gets the stamp — blocked templates never send.",
    },
    ne: {
      title: "Laya अनुपालन पास",
      body: "System 1 ले टेम्प्लेटलाई स्पाम र अनुपालन जोखिमका लागि स्कोर गर्छ। ०.५ भन्दा कमले छाप पाउँछ — ब्लक भएका टेम्प्लेट कहिल्यै जाँदैनन्।",
    },
  },
  {
    no: "03",
    icon: Zap,
    en: {
      title: "Drop a CSV, we queue it",
      body: "Upload contacts straight to S3 from your browser. BullMQ interpolates rows and fires to AkashSMS at 50 SMS per second.",
    },
    ne: {
      title: "CSV हाल्नुहोस्, हामी क्यु गर्छौं",
      body: "सम्पर्कहरू ब्राउजरबाट सोझै S3 मा अपलोड गर्नुहोस्। BullMQ ले पङ्क्तिहरू भर्छ र AkashSMS मा प्रति सेकेन्ड ५० SMS पठाउँछ।",
    },
  },
] as const;

export default async function LandingPage({ params }: LandingProps) {
  const { locale } = await params;
  const isEn = locale === "en";

  return (
    <div className="ledger-paper">
      {/* Hero — the thesis you can touch */}
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-14 md:pt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
              <span className="inline-block h-px w-8 bg-ledger-500" aria-hidden />
              {isEn
                ? "Micro-finance SMS wrapper · AkashSMS pipe"
                : "लघुवित्त SMS र्‍यापर · AkashSMS पाइप"}
            </p>
            <h1 className="font-sans text-4xl font-extrabold leading-[1.15] md:text-6xl">
              {isEn ? (
                <>
                  Type a name. <span className="text-teal-600">Watch it become SMS.</span>
                </>
              ) : (
                <>
                  नाम लेख्नुहोस्। <span className="text-teal-600">SMS बन्न हेर्नुहोस्।</span>
                </>
              )}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ink-700">
              {isEn
                ? "That bubble is the whole product: your CSV row, interpolated deterministically — zero AI per row, zero hallucinated loan amounts. The studio adds drafting, compliance, and the queue."
                : "त्यो बबल नै सम्पूर्ण उत्पादन हो: तपाईंको CSV पङ्क्ति, नियतात्मक रूपमा भरिएको — प्रति पङ्क्ति शून्य AI, शून्य काल्पनिक कर्जा रकम। स्टुडियोले मस्यौदा, अनुपालन र क्यु थप्छ।"}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/sms-campaign"
                className="inline-flex items-center gap-2 rounded-lg bg-ink-900 px-6 py-3 text-sm font-bold text-white enabled:hover:bg-ink-950"
              >
                {isEn ? "Start a campaign" : "अभियान सुरु गर्नुहोस्"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 rounded-lg border border-paper-300 bg-paper-50 px-6 py-3 text-sm font-bold text-ink-900 enabled:hover:border-teal-600"
              >
                <LibraryBig className="h-4 w-4" aria-hidden />
                {isEn ? "Browse templates" : "टेम्प्लेट हेर्नुहोस्"}
              </Link>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-paper-300 pt-6">
              {[
                { k: isEn ? "per second" : "प्रति सेकेन्ड", v: "50 SMS" },
                { k: isEn ? "per template" : "प्रति टेम्प्लेट", v: "160 chars" },
                { k: isEn ? "AI per row" : "प्रति पङ्क्ति AI", v: "0 — never" },
              ].map((s) => (
                <div key={s.v} className="flex flex-col">
                  <dt className="order-2 mt-1 text-xs text-ink-500">{s.k}</dt>
                  <dd className="font-mono text-xl font-extrabold text-ink-900 md:text-2xl">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <DemoBubble locale={locale} />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-paper-300 bg-paper-50">
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <h2 className="font-sans text-2xl font-extrabold md:text-3xl">
            {isEn ? "Three entries in the ledger." : "खातामा तीन प्रविष्टि।"}
          </h2>
          <p className="mt-2 max-w-xl text-[15px] text-ink-500">
            {isEn
              ? "One AI pass per campaign, one compliance gate, then pure string interpolation at queue speed."
              : "प्रति अभियान एक AI पास, एक अनुपालन गेट, त्यसपछि क्यु गतिमा शुद्ध स्ट्रिङ प्रतिस्थापन।"}
          </p>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.no} className="rounded-2xl border border-paper-300 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <s.icon className="h-6 w-6 text-teal-600" aria-hidden />
                  <span className="font-mono text-xs font-bold text-ink-500">{s.no}</span>
                </div>
                <h3 className="mt-4 font-sans text-lg font-bold">
                  {isEn ? s.en.title : s.ne.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-700">
                  {isEn ? s.en.body : s.ne.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6">
            <Link
              href="/activity"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline underline-offset-2"
            >
              <Activity className="h-4 w-4" aria-hidden />
              {isEn ? "See the launch ledger" : "प्रेषण खाता हेर्नुहोस्"}
            </Link>
          </p>
        </div>
      </section>

      {/* Compliance band */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-ink-900 p-8 text-white md:flex-row md:items-center md:p-10">
          <span
            aria-hidden
            className="stamp rounded px-4 py-1.5 font-mono text-sm font-extrabold uppercase tracking-[0.2em] text-teal-100"
          >
            {isEn ? "✓ Approved" : "✓ स्वीकृत"}
          </span>
          <div className="flex-grow">
            <h2 className="font-sans text-xl font-extrabold md:text-2xl">
              {isEn ? "Compliance over creativity." : "रचनात्मकताभन्दा अनुपालन।"}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              {isEn
                ? "A wrong loan amount in a reminder destroys trust. That's why AI drafts the template once — and deterministic code fills every row. Hallucination surface: zero."
                : "रिमाइन्डरमा गलत कर्जा रकमले विश्वास नष्ट गर्छ। त्यसैले AI ले टेम्प्लेट एकपटक बनाउँछ — र नियतात्मक कोडले हरेक पङ्क्ति भर्छ। भ्रमको सम्भावना: शून्य।"}
            </p>
          </div>
          <Link
            href="/sms-campaign"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-ledger-500 px-6 py-3 text-sm font-bold text-ink-950 enabled:hover:brightness-110"
          >
            {isEn ? "Try the studio" : "स्टुडियो प्रयास गर्नुहोस्"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}

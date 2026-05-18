"use client";

import { manrope } from "~/src/lib/fonts";
import { TypographyH4, TypographyP } from "~/src/lib/typography";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../../../../../packages/ui/src/components/accordion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQItem[];
  title?: string;
  description?: string;
}

export default function FAQSection({
  faqs = [],
  title = "FAQ",
  description = "Get answers to common questions about our services and travel experiences",
}: FAQSectionProps) {
  return (
    <section className={`py-8 ${manrope.className}`}>
      <div className="mb-8">
        <TypographyH4 className="mb-2 font-bold text-gray-500">{title}</TypographyH4>
        <TypographyP className="text-gray-500">{description}</TypographyP>
      </div>

      {faqs.length === 0 ? (
        <p className="text-sm text-gray-500 px-4">No FAQs available for this trip.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50"
            >
              <AccordionTrigger className="px-4 py-5 text-left hover:no-underline">
                <span className="block text-base font-semibold text-gray-700">{faq.question}</span>
              </AccordionTrigger>

              <AccordionContent>
                <div className="px-4 pb-4 pt-1">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
}

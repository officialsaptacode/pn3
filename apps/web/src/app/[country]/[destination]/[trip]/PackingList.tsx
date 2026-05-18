"use client";

import { Backpack, Check, FolderOpen, Package, Shirt, Sun } from "lucide-react";
import { TypographyH3 } from "~/src/lib/typography";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PackingItem {
  title: string;
}

export interface PackingCategory {
  name: string;
  items: PackingItem[];
}

interface PackingListProps {
  /** Trip title shown in the section heading */
  tripTitle?: string;
  /**
   * Dynamic categories from the admin form (essentialCategories).
   * When provided, these override the built-in defaults.
   */
  categories?: PackingCategory[];
}

// ─── Default data (used as fallback when no dynamic data is provided) ─────────

const ICON_CYCLE = [
  { icon: Shirt, color: "#2B7FFF" },
  { icon: Backpack, color: "#00C950" },
  { icon: Sun, color: "#AD46FF" },
  { icon: FolderOpen, color: "#FFB900" },
  { icon: Package, color: "#F97316" },
];

const DEFAULT_CATEGORIES: PackingCategory[] = [
  {
    name: "Clothing Essentials",
    items: [
      { title: "Moisture-wicking thermal base layers (top & bottom)" },
      { title: "Insulated down or synthetic jacket" },
      { title: "Waterproof & windproof jacket and pants" },
      { title: "Quick-dry hiking pants (2-3 pairs)" },
      { title: "Fleece or wool sweater for mid-layer" },
      { title: "Merino wool hiking socks (4-5 pairs)" },
      { title: "Thermal gloves and warm hat" },
      { title: "Waterproof hiking boots (broken-in)" },
      { title: "Camp shoes/sandals for evenings" },
      { title: "Sun hat and buff/neck gaiter" },
    ],
  },
  {
    name: "Gear & Equipment Essentials",
    items: [
      { title: "40-60L backpack with rain cover" },
      { title: "Sleeping bag (rated -10°C or lower)" },
      { title: "Sleeping pad (insulated inflatable)" },
      { title: "Trekking poles (adjustable)" },
      { title: "Headlamp with extra batteries" },
      { title: "Water purification tablets or filter" },
      { title: "Water bottles/hydration (2-3 liters)" },
      { title: "First-aid kit with personal medications" },
      { title: "Multi-tool or Swiss Army knife" },
      { title: "Dry bags for organization (various sizes)" },
    ],
  },
  {
    name: "Weather Protection Gear",
    items: [
      { title: "Sunglasses with UV protection" },
      { title: "Sunscreen SPF 50+ for high altitude" },
      { title: "Lip balm with SPF protection" },
      { title: "Sun hat or wide-brimmed cap" },
      { title: "Hand warmers (disposable, optional)" },
      { title: "Rain cover for backpack" },
      { title: "Insulated thermos for hot drinks" },
      { title: "Gaiters (for snow/mud protection)" },
      { title: "Lightweight poncho or rain jacket" },
      { title: "Emergency blanket" },
    ],
  },
  {
    name: "Personal & Documents",
    items: [
      { title: "Passport (valid for 6+ months, with copies)" },
      { title: "Annapurna Conservation Area Permit (ACAP)" },
      { title: "Trekkers' Information Management System (TIMS) card" },
      { title: "Travel insurance covering high altitude trekking" },
      { title: "Emergency contact list (printed copy)" },
      { title: "Cash (USD & NPR in small bills)" },
      { title: "Credit/debit cards for emergencies" },
      { title: "Passport photos (2-3 extra for permits)" },
      { title: "Vaccination certificates (if required)" },
      { title: "Flight tickets and itinerary printouts" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PackingList({ tripTitle, categories }: PackingListProps) {
  // Use dynamic categories if provided and non-empty, otherwise fall back to defaults
  const resolvedCategories = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  // Filter out empty categories / items
  const displayCategories = resolvedCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((item) => item.title?.trim()),
    }))
    .filter((cat) => cat.name?.trim() && cat.items.length > 0);

  if (displayCategories.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <TypographyH3 className="font-bold text-gray-800 mb-4">
            Essential Packing List{tripTitle ? ` for ${tripTitle}` : ""}
          </TypographyH3>
        </div>

        <div className="space-y-8">
          {displayCategories.map((category, index) => {
            const { icon: Icon, color } = ICON_CYCLE[index % ICON_CYCLE.length]!;

            return (
              <div key={index}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-sm text-gray-700 flex items-start gap-3 group"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${color}20` }}
                        >
                          <Check className="w-3 h-3" style={{ color }} />
                        </div>
                      </div>
                      <span className="leading-relaxed group-hover:text-gray-900 transition-colors">
                        {item.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

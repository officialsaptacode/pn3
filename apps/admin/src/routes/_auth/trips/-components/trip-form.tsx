import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { destinationService, type Media } from "@workspace/api-client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/collapsible";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { MultipleSelect } from "@workspace/ui/multi-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/table";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  GripVertical,
  Loader2,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { type FieldErrors, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Tiptap from "@/components/tip-tap";
import { useCreateTrip, useUpdateTrip } from "@/features/trips/api/use-trips";
import { useFormToast } from "@/hooks/use-form-toast";
import { useFormPersist } from "@/hooks/useFormPersist";
import { MediaSelector } from "../../../../components/MediaLibrary";
import AddReviewModal from "./AddReviewModal";

// FIX: defined missing Review type
interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

const tripSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional(),
  category: z
    .array(
      z.enum([
        "TREKKING",
        "PEAK_CLIMBING",
        "CULTURAL_HERITAGE",
        "ADVENTURE_SPORTS",
        "SCENIC_ADVENTURES",
        "WILDLIFE_SAFARIS",
        "PILGRIMAGE",
      ]),
    )
    .optional(),
  specialityOrder: z.coerce.number().optional().nullable(),
  packageOrder: z.coerce.number().optional().nullable(),
  displaySection: z.enum(["SPECIALITIES_ONLY", "PACKAGES_ONLY", "BOTH"]).default("BOTH"),
  description: z.string().optional().or(z.literal("")),
  overview: z.string().optional().or(z.literal("")),
  difficulty: z.enum(["EASY", "MODERATE", "CHALLENGING", "DIFFICULT", "EXTREME"]).optional(),
  status: z.enum(["ACTIVE", "ARCHIVE", "INACTIVE"]),
  duration: z.coerce.number().optional(),
  maxAltitude: z.coerce.number().min(0),
  minAltitude: z.coerce.number().min(0).optional(),
  permitRequired: z.boolean().default(false),
  permitDetails: z.string().optional(),
  safetyProtocol: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  region: z.string().optional().or(z.literal("")),
  groupSizeMin: z.coerce.number().optional(),
  groupSizeMax: z.coerce.number().optional(),
  price: z.coerce.number().optional(),
  startDate: z.string().optional().or(z.literal("")),
  featuredImageId: z.number().optional(),
  mapImageId: z.number().optional(),
  clothing: z.string().optional(),
  galleryIds: z.array(z.number()).optional(),
  destinationId: z.number().optional(),
  destinationIds: z.array(z.number()).optional(),
  tripType: z.string().optional(),
  bestSeason: z.array(z.string()).default(["Spring", "Autumn"]),
  sections: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    )
    .optional()
    .default([]),
  essentialCategories: z
    .array(
      z.object({
        name: z.string(),
        items: z.array(z.object({ title: z.string() })),
      }),
    )
    .optional(),
  itineraryDays: z
    .array(
      z.object({
        id: z.number().optional(),
        dayNumber: z.coerce.number().min(1),
        title: z.string().min(1, "Title is required for itinerary days"),
        description: z.string().min(1, "Description is required for itinerary days"),
        walkingDuration: z.string().optional().or(z.literal("")),
        distance: z.coerce.number().optional().nullable(),
        altitude: z.coerce.number().optional().nullable(),
        accommodationType: z.string().optional().or(z.literal("")),
        meals: z.array(z.string()).optional().default([]),
      }),
    )
    .optional(),
  inclusions: z
    .array(
      z.object({
        id: z.number().optional(),
        description: z.string().min(1, "Inclusion description is required"),
      }),
    )
    .optional(),
  exclusions: z
    .array(
      z.object({
        id: z.number().optional(),
        description: z.string().min(1, "Exclusion description is required"),
      }),
    )
    .optional(),
  faqs: z
    .array(
      z.object({
        id: z.number().optional(),
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
      }),
    )
    .optional(),
  reviews: z
    .array(
      z.object({
        id: z.number().optional(),
        reviewerName: z.string().min(1, "Reviewer name is required"),
        rating: z.coerce.number().min(1).max(5),
        content: z.string().min(1, "Review content is required"),
        reviewerCountry: z.string().optional(),
        date: z.string().optional(),
        approved: z.boolean().optional(),
      }),
    )
    .optional(),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface TripFormProps {
  initialData?: any;
}

function buildPayload(data: TripFormValues) {
  const payload: any = { ...data };
  delete payload.sections;

  // Ensure specialityOrder and packageOrder are valid numbers or undefined
  if (
    payload.specialityOrder === 0 ||
    payload.specialityOrder === null ||
    payload.specialityOrder === ""
  )
    payload.specialityOrder = undefined;
  if (payload.packageOrder === 0 || payload.packageOrder === null || payload.packageOrder === "")
    payload.packageOrder = undefined;

  if (payload.essentialCategories && payload.essentialCategories.length > 0) {
    payload.essentialCategories = payload.essentialCategories
      .map((category: any) => ({
        name: category.name?.trim(),
        items: category.items?.filter((item: any) => item.title?.trim()) || [],
      }))
      .filter((cat: any) => cat.name || cat.items.length > 0);
  }

  if (payload.destinationId) {
    payload.destinationIds = [payload.destinationId];
  }
  delete payload.destinationId;

  if (payload.reviews) {
    payload.reviews = payload.reviews
      .filter((r: any) => r.reviewerName?.trim() && r.content?.trim())
      .map(({ date: _d, id: _i, ...rest }: any) => rest);
  }

  if (!payload.startDate) delete payload.startDate;

  if (payload.inclusions)
    payload.inclusions = payload.inclusions
      .filter((i: any) => i.description?.trim())
      .map(({ id: _i, ...rest }: any) => rest);

  if (payload.exclusions)
    payload.exclusions = payload.exclusions
      .filter((e: any) => e.description?.trim())
      .map(({ id: _i, ...rest }: any) => rest);

  if (payload.itineraryDays)
    payload.itineraryDays = payload.itineraryDays
      .filter((i: any) => i.title?.trim() || i.description?.trim())
      .map(({ id: _i, ...rest }: any) => ({
        ...rest,
        title: rest.title || "",
        description: rest.description || "",
      }));

  if (payload.faqs)
    payload.faqs = payload.faqs
      .filter((f: any) => f.question?.trim() && f.answer?.trim())
      .map(({ id: _i, ...rest }: any) => rest);

  return payload;
}

const PRESET_CATEGORIES = [
  "Clothing",
  "Equipment",
  "Documents",
  "Health & Hygiene",
  "Electronics",
  "Miscellaneous",
  "Food & Snacks",
  "Navigation",
  "Emergency Kit",
  "Personal Care",
];

const DEFAULT_ESSENTIAL_CATEGORIES = ["Clothing", "Equipment", "Documents"];
const makeEssentialItems = () =>
  Array(5)
    .fill(null)
    .map(() => ({ title: "" }));

// ─── FAQs Tab ──────────────────────────────────────────────────────────────────
function FaqsTabContent({
  form,
  faqFields,
  appendFaq,
  removeFaq,
  sectionFields,
  appendSection,
  removeSection,
}: any) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddFaq = () => {
    const newIndex = faqFields.length;
    appendFaq({ question: "", answer: "" });
    setTimeout(() => {
      setOpenIds((prev) => {
        const next = new Set(prev);
        next.add(String(newIndex));
        return next;
      });
    }, 0);
  };

  return (
    <TabsContent value="faqs" className="mt-6 space-y-4">
      {faqFields.length === 0 && <p className="text-sm text-muted-foreground">No FAQs added.</p>}

      <div className="space-y-4 max-w-6xl mx-auto">
        {faqFields.map((field: any, index: number) => {
          const isOpen = openIds.has(field.id);

          return (
            <Collapsible key={field.id} open={isOpen} onOpenChange={() => toggleOpen(field.id)}>
              <div className="rounded-lg border border-border overflow-hidden">
                <CollapsibleTrigger asChild>
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/60 cursor-pointer select-none">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />

                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field: inputField }: any) => (
                        <span className="flex-1 text-sm font-medium text-foreground truncate">
                          {inputField.value || "Untitled FAQ"}
                        </span>
                      )}
                    />

                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFaq(index);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="p-4 space-y-4 bg-background">
                    <FormField
                      control={form.control}
                      name={`faqs.${index}.question`}
                      render={({ field: inputField }: any) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Question
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Is this trek safe?" {...inputField} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`faqs.${index}.answer`}
                      render={({ field: inputField }: any) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground">
                            Answer
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              rows={3}
                              placeholder="Yes, our guides are experienced and safety is our top priority..."
                              className="min-h-[100px]"
                              {...inputField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed py-6 text-muted-foreground"
        onClick={handleAddFaq}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add FAQ
      </Button>
    </TabsContent>
  );
}

const _ratingFilters = ["All", "5", "4", "3", "2", "1"] as const;

function InlineStars({ rating, onChange }: { rating: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="h-4 w-4 cursor-pointer text-amber-500"
          fill={i <= rating ? "currentColor" : "none"}
          onClick={() => onChange(i)}
        />
      ))}
    </div>
  );
}

function ReviewsTabContent({
  form,
  reviewFields,
  appendReview,
  removeReview,
  sectionFields,
  appendSection,
  removeSection,
}: any) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const watchedReviews: any[] = form.watch("reviews") || [];

  const filteredIndices =
    activeFilter === "All"
      ? reviewFields.map((_: any, i: number) => i)
      : reviewFields
          .map((_: any, i: number) => i)
          .filter((i: number) => String(watchedReviews[i]?.rating) === activeFilter);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleAddReview = (review: { name: string; rating: number; comment: string }) => {
    appendReview({
      reviewerName: review.name,
      rating: review.rating,
      content: review.comment,
      reviewerCountry: "",
      date: getCurrentDate(),
      approved: false,
    });
  };

  return (
    <TabsContent value="reviews" className="mt-6 space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filter by rating:</span>
        <div className="flex gap-1">
          {["All", "5", "4", "3", "2", "1"].map((f) => (
            <Button
              key={f}
              type="button"
              variant={activeFilter === f ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs group"
              onClick={() => setActiveFilter(f)}
            >
              {f === "All" ? (
                "All"
              ) : (
                <span className="flex items-center gap-1">
                  {f}
                  <Star
                    className={`h-3 w-3 ${
                      activeFilter === f
                        ? "text-amber-500"
                        : "text-slate-400 group-hover:text-amber-500"
                    }`}
                    fill="currentColor"
                  />
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={() => setIsReviewModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Add Review
      </Button>

      <div className="rounded-lg border bg-card overflow-hidden max-w-6xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIndices.length > 0 ? (
              filteredIndices.map((index: number) => (
                <TableRow key={reviewFields[index]?.id}>
                  <TableCell className="min-w-[140px]">
                    <FormField
                      control={form.control}
                      name={`reviews.${index}.reviewerName`}
                      render={({ field: f }: any) => (
                        <FormItem>
                          <FormControl>
                            <input
                              className="w-full bg-transparent outline-none text-sm"
                              placeholder="John Smith"
                              {...f}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`reviews.${index}.rating`}
                      render={({ field: f }: any) => (
                        <FormItem>
                          <FormControl>
                            <InlineStars
                              rating={Number(f.value) || 5}
                              onChange={(v) => f.onChange(v)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="min-w-[200px]">
                    <FormField
                      control={form.control}
                      name={`reviews.${index}.content`}
                      render={({ field: f }: any) => (
                        <FormItem>
                          <FormControl>
                            <textarea
                              className="w-full bg-transparent outline-none text-sm resize-none"
                              rows={2}
                              placeholder="Write review content..."
                              {...f}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="min-w-[110px]">
                    <FormField
                      control={form.control}
                      name={`reviews.${index}.date`}
                      render={({ field: f }: any) => (
                        <FormItem>
                          <FormControl>
                            <input
                              type="text"
                              className="w-full bg-transparent outline-none text-sm"
                              placeholder="Feb 15, 2024"
                              {...f}
                              value={f.value || getCurrentDate()}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="min-w-[150px]">
                    <FormField
                      control={form.control}
                      name={`reviews.${index}.approved`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={!!field.value}
                                onCheckedChange={(checked) => field.onChange(checked)}
                              />
                              <span className="text-sm text-muted-foreground">
                                {field.value ? "Approved" : "Pending"}
                              </span>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No reviews match the selected filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AddReviewModal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        onAdd={handleAddReview}
      />
    </TabsContent>
  );
}

function ItineraryTabContent({
  form,
  itineraryFields,
  appendItinerary,
  removeItinerary,
  sectionFields,
  appendSection,
  removeSection,
}: any) {
  const [openDays, setOpenDays] = useState<Record<string, boolean>>({});

  const toggleDay = (index: number) => {
    setOpenDays((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <TabsContent value="itinerary" className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Itinerary Days</h3>
      </div>

      {itineraryFields.length === 0 && (
        <p className="text-sm text-muted-foreground">No itinerary days added yet.</p>
      )}

      <div className="space-y-4 max-w-6xl mx-auto">
        {itineraryFields.map((field: any, index: number) => {
          const isOpen = openDays[index] !== false;

          return (
            <ItineraryDayItem
              key={field.id}
              form={form}
              index={index}
              isOpen={isOpen}
              onToggle={() => toggleDay(index)}
              onRemove={() => removeItinerary(index)}
            />
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed py-6"
          onClick={() => {
            const newIndex = itineraryFields.length;
            appendItinerary({
              dayNumber: itineraryFields.length + 1,
              title: "",
              description: "",
            });
            setOpenDays((prev) => ({ ...prev, [newIndex]: true }));
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Day
        </Button>
      </div>
    </TabsContent>
  );
}

function ItineraryDayItem({
  form,
  index,
  isOpen,
  onToggle,
  onRemove,
}: {
  form: any;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const title = useWatch({ control: form.control, name: `itineraryDays.${index}.title` });
  const dayNumber = useWatch({ control: form.control, name: `itineraryDays.${index}.dayNumber` });

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="rounded-lg border border-border overflow-hidden">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between bg-itinerary-header px-4 py-3 cursor-pointer select-none">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-itinerary-header-foreground">
                Day {dayNumber || index + 1}: {title || "Untitled"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 space-y-4">
            <FormField
              control={form.control}
              name={`itineraryDays.${index}.title`}
              render={({ field: inputField }: any) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                    Day Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Arrival in Kathmandu" {...inputField} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`itineraryDays.${index}.description`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                    Day Description
                  </FormLabel>
                  <FormControl>
                    <Tiptap value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name={`itineraryDays.${index}.walkingDuration`}
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                      Walking Duration
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5-6 hours" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`itineraryDays.${index}.distance`}
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                      Distance (km)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 12"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`itineraryDays.${index}.altitude`}
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                      Altitude (m)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g. 3440"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(e.target.value === "" ? null : Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`itineraryDays.${index}.accommodationType`}
                render={({ field }: any) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                      Accommodation
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tea House" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name={`itineraryDays.${index}.meals`}
              render={({ field }: any) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-foreground mb-1.5 block">
                    Meals
                  </FormLabel>
                  <FormControl>
                    <MultipleSelect
                      options={[
                        { label: "Breakfast", value: "Breakfast" },
                        { label: "Lunch", value: "Lunch" },
                        { label: "Dinner", value: "Dinner" },
                      ]}
                      placeholder="Select meals"
                      value={field.value || []}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function IncludesTabContent({
  form,
  inclusionFields,
  appendInclusion,
  removeInclusion,
  exclusionFields,
  appendExclusion,
  removeExclusion,
  sectionFields,
  appendSection,
  removeSection,
}: any) {
  const [hoveredInclusionId, setHoveredInclusionId] = useState<string | null>(null);
  const [hoveredExclusionId, setHoveredExclusionId] = useState<string | null>(null);

  useEffect(() => {
    if (inclusionFields.length === 0) {
      for (let i = 0; i < 5; i++) appendInclusion({ description: "" });
    }
    if (exclusionFields.length === 0) {
      for (let i = 0; i < 5; i++) appendExclusion({ description: "" });
    }
  }, [appendExclusion, appendInclusion, exclusionFields.length, inclusionFields.length]);

  return (
    <TabsContent value="includes" className="mt-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inclusions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Includes</h3>
          <div className="space-y-3">
            {inclusionFields.map((field: any, index: number) => {
              const isLast = index === inclusionFields.length - 1;
              const fieldId = `inclusion-${field.id}`;

              return (
                <div
                  key={field.id}
                  className="flex items-center gap-2"
                  onMouseEnter={() => !isLast && setHoveredInclusionId(fieldId)}
                  onMouseLeave={() => setHoveredInclusionId(null)}
                >
                  <div className="relative flex-1">
                    <FormField
                      control={form.control}
                      name={`inclusions.${index}.description`}
                      render={({ field: inputField }: any) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. Airport transfers"
                              className={`w-full ${!isLast ? "pr-10" : ""}`}
                              {...inputField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isLast && hoveredInclusionId === fieldId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-slate-400"
                        onClick={() => removeInclusion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isLast && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground"
                      onClick={() => appendInclusion({ description: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Exclusions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Excludes</h3>
          <div className="space-y-3">
            {exclusionFields.map((field: any, index: number) => {
              const isLast = index === exclusionFields.length - 1;
              const fieldId = `exclusion-${field.id}`;

              return (
                <div
                  key={field.id}
                  className="flex items-center gap-2"
                  onMouseEnter={() => !isLast && setHoveredExclusionId(fieldId)}
                  onMouseLeave={() => setHoveredExclusionId(null)}
                >
                  <div className="relative flex-1">
                    <FormField
                      control={form.control}
                      name={`exclusions.${index}.description`}
                      render={({ field: inputField }: any) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="e.g. International flights"
                              className={`w-full ${!isLast ? "pr-10" : ""}`}
                              {...inputField}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {!isLast && hoveredExclusionId === fieldId && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-slate-400"
                        onClick={() => removeExclusion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isLast && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground"
                      onClick={() => appendExclusion({ description: "" })}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TabsContent>
  );
}

function EssentialListTabContent({
  form,
  sectionFields,
  appendSection,
  removeSection,
}: {
  form: any;
  sectionFields: any[];
  appendSection: (value: any) => void;
  removeSection: (index: number) => void;
}) {
  const [openCategories, setOpenCategories] = useState<Record<number, boolean>>({ 0: true });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({ control: form.control, name: "essentialCategories" });

  useEffect(() => {
    const persisted = form.getValues("essentialCategories");
    if (categoryFields.length === 0 && (!persisted || persisted.length === 0)) {
      DEFAULT_ESSENTIAL_CATEGORIES.forEach((name, i) => {
        appendCategory({ name, items: makeEssentialItems() });
        setOpenCategories((prev) => ({ ...prev, [i]: i === 0 }));
      });
    }
  }, [appendCategory, categoryFields.length, form.getValues]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current?.contains(e.target as Node) ||
        triggerRef.current?.contains(e.target as Node)
      )
        return;
      setPopoverOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleCategory = (index: number) =>
    setOpenCategories((prev) => ({ ...prev, [index]: !prev[index] }));

  const getItemKey = (ci: number, ii: number) => `cat-${ci}-item-${ii}`;

  const addedNames: string[] = (form.watch("essentialCategories") || []).map((c: any) => c.name);

  const handlePresetClick = (name: string) => {
    if (addedNames.includes(name)) return;
    const newIndex = categoryFields.length;
    appendCategory({ name, items: makeEssentialItems() });
    setOpenCategories((prev) => ({ ...prev, [newIndex]: true }));
    setPopoverOpen(false);
  };

  const handleCustomCategory = () => {
    const newIndex = categoryFields.length;
    appendCategory({ name: "", items: [] });
    setOpenCategories((prev) => ({ ...prev, [newIndex]: true }));
    setPopoverOpen(false);
  };

  return (
    <TabsContent value="essentials" className="mt-6 space-y-4">
      <div className="space-y-4 max-w-6xl mx-auto">
        <div className="relative inline-block">
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPopoverOpen((v) => !v)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>

          {popoverOpen && (
            <div
              ref={popoverRef}
              className="absolute left-0 top-full mt-1 z-50 w-56 rounded-lg border border-border bg-popover shadow-lg overflow-hidden py-1"
            >
              {PRESET_CATEGORIES.map((name) => {
                const isAdded = addedNames.includes(name);
                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isAdded}
                    onClick={() => handlePresetClick(name)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-sm text-left transition-colors ${
                      isAdded
                        ? "text-muted-foreground cursor-default"
                        : "text-foreground hover:bg-accent cursor-pointer"
                    }`}
                  >
                    {name}
                    {isAdded && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  type="button"
                  onClick={handleCustomCategory}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left text-foreground hover:bg-accent cursor-pointer transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 shrink-0" />
                  Custom category
                </button>
              </div>
            </div>
          )}
        </div>

        {categoryFields.length === 0 && (
          <p className="text-sm text-muted-foreground">No categories added yet.</p>
        )}

        {categoryFields.map((category, categoryIndex) => (
          <EssentialCategoryItem
            key={category.id}
            form={form}
            categoryIndex={categoryIndex}
            isOpen={!!openCategories[categoryIndex]}
            onToggle={() => toggleCategory(categoryIndex)}
            onRemove={() => removeCategory(categoryIndex)}
            hoveredItem={hoveredItem}
            setHoveredItem={setHoveredItem}
            getItemKey={getItemKey}
          />
        ))}
      </div>
    </TabsContent>
  );
}

function EssentialCategoryItem({
  form,
  categoryIndex,
  isOpen,
  onToggle,
  onRemove,
  hoveredItem,
  setHoveredItem,
  getItemKey,
}: {
  form: any;
  categoryIndex: number;
  isOpen: boolean;
  onToggle: () => void;
  onRemove: () => void;
  hoveredItem: string | null;
  setHoveredItem: (k: string | null) => void;
  getItemKey: (ci: number, ii: number) => string;
}) {
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: `essentialCategories.${categoryIndex}.items`,
  });

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <div className="flex items-center justify-between bg-muted/50 px-4 py-3">
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="h-5 w-5 text-muted-foreground shrink-0 cursor-grab" />
            <FormField
              control={form.control}
              name={`essentialCategories.${categoryIndex}.name`}
              render={({ field }: any) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Category name"
                      className="bg-transparent border-none p-0 h-auto font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                      onClick={(e) => e.stopPropagation()}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="ghost" size="icon" className="text-muted-foreground">
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          <div className="p-4 space-y-2">
            {itemFields.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">No items added yet.</p>
            )}

            {itemFields.map((item, itemIndex) => {
              const itemKey = getItemKey(categoryIndex, itemIndex);

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-2"
                  onMouseEnter={() => setHoveredItem(itemKey)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                  <FormField
                    control={form.control}
                    name={`essentialCategories.${categoryIndex}.items.${itemIndex}.title`}
                    render={({ field }: any) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Item title"
                            className="flex-1 bg-transparent border-none p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {hoveredItem === itemKey && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(itemIndex)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => appendItem({ title: "" })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function ItinearyMapTab({ form, mapMedia, setMapMedia }: any) {
  const _fileInputRef = useRef<HTMLInputElement>(null);

  if (!form) {
    return (
      <TabsContent value="map" className="mt-6 space-y-4">
        <div className="space-y-4 max-w-6xl mx-auto">
          <p className="text-sm text-muted-foreground">Form not initialized</p>
        </div>
      </TabsContent>
    );
  }

  return (
    <TabsContent value="map" className="mt-6 space-y-4">
      <div className="space-y-4 max-w-6xl mx-auto">
        <FormField
          control={form.control}
          name="mapImageId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-sm font-medium text-foreground">
                Upload Map Image
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <MediaSelector
                    value={mapMedia}
                    maxSelect={1}
                    onChange={(media) => {
                      const selected = Array.isArray(media) ? media[0] : media;
                      setMapMedia(selected);
                      field.onChange(selected?.id);
                    }}
                  />

                  {mapMedia && (
                    <div className="relative w-full max-w-md aspect-video border rounded-lg overflow-hidden flex items-center justify-center bg-muted/20">
                      <img
                        src={mapMedia.thumbnailUrl || mapMedia.url}
                        className="object-contain w-full h-full"
                        alt="Map preview"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => {
                          setMapMedia(undefined);
                          field.onChange(undefined);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </TabsContent>
  );
}

function SectionList({ form, sectionFields, appendSection, removeSection }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <FormLabel>Sections</FormLabel>
        {sectionFields.map((section: any, index: number) => (
          <div key={section.id} className="border border-border rounded-lg p-4 space-y-3 relative">
            <div className="flex items-start gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2.5 shrink-0 cursor-grab" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`sections.${index}.title`}
                    render={({ field }: any) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Section title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => removeSection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`sections.${index}.description`}
                  render={({ field }: any) => (
                    <FormItem>
                      <FormControl>
                        <Tiptap value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => appendSection({ title: "", description: "" })}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
}

function GeneralTabContent({
  form,
  storageKey,
  clearDraft,
  featuredMedia,
  setFeaturedMedia,
  galleryMedia,
  setGalleryMedia,
  destinations,
  sectionFields = [],
  appendSection = () => {},
  removeSection = () => {},
}: any) {
  const [_hasDraft, setHasDraft] = useState(false);
  const selectedDestinationId = useWatch({ control: form.control, name: "destinationId" });
  const currentRegion = useWatch({ control: form.control, name: "region" });

  const filteredRegions =
    destinations?.filter(
      (d: any) =>
        d.type === "REGION" &&
        selectedDestinationId !== undefined &&
        Number(d.parentId) === selectedDestinationId,
    ) ?? [];

  // biome-ignore lint/correctness/useExhaustiveDependencies: form.setValue is stable from react-hook-form; reset region when destination changes
  useEffect(() => {
    if (!selectedDestinationId) return;
    if (currentRegion && filteredRegions.length > 0) {
      const regionStillValid = filteredRegions.some(
        (r: any) => r.slug === currentRegion || r.name.toLowerCase() === currentRegion,
      );
      if (!regionStillValid) {
        form.setValue("region", "", { shouldValidate: true });
      }
    }
    if (filteredRegions.length === 0) {
      form.setValue("region", "", { shouldValidate: true });
      form.clearErrors("region");
    }
  }, [selectedDestinationId]);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setHasDraft(true);
  }, [storageKey]);

  return (
    <TabsContent value="general" className="mt-6 space-y-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Status toggle */}
        <div className="flex justify-end">
          <FormField
            control={form.control}
            name="status"
            render={({ field }: any) => (
              <FormItem>
                <FormControl>
                  <div className="inline-flex rounded-lg overflow-hidden border border-border bg-[#1E2939] p-1">
                    <button
                      type="button"
                      onClick={() => field.onChange("ACTIVE")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        field.value === "ACTIVE"
                          ? "bg-[#334155] text-slate-100 rounded-xl"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Active
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("ARCHIVE")}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        field.value === "ARCHIVE"
                          ? "bg-[#334155] text-slate-100 rounded-xl"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      Archived
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 1: Trip Title + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Trip Title</FormLabel>
                <FormControl>
                  <Input placeholder="Annapurna Circuit Trek" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel>Slug (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="annapurna-circuit-trek" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Duration + Difficulty */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Duration</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="12 Days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }: any) => (
              <FormItem className="space-y-2 w-full">
                <FormLabel required>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="EASY">EASY</SelectItem>
                    <SelectItem value="MODERATE">MODERATE</SelectItem>
                    <SelectItem value="CHALLENGING">CHALLENGING</SelectItem>
                    <SelectItem value="DIFFICULT">DIFFICULT</SelectItem>
                    <SelectItem value="EXTREME">EXTREME</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 3: Group Size Min + Max */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="groupSizeMin"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Min Group Size</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupSizeMax"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Max Group Size</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxAltitude"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Max Altitude</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5416m" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minAltitude"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel>Min Altitude</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="800" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 4: Destination + Region */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="destinationId"
            render={({ field }) => (
              <FormItem className="space-y-2 w-full">
                <FormLabel>Destination</FormLabel>

                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {destinations
                      ?.filter((d: any) => d.type === "COUNTRY")
                      .map((country: any) => (
                        <SelectItem key={country.id} value={String(country.id)}>
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel>Region</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={filteredRegions.length > 0 ? field.value || undefined : undefined}
                  disabled={!selectedDestinationId || filteredRegions.length === 0}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          !selectedDestinationId
                            ? "Select a country first"
                            : filteredRegions.length === 0
                              ? "No regions available"
                              : "Select region"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredRegions.map((region: any) => (
                      <SelectItem key={region.id} value={region.slug || region.name.toLowerCase()}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }: any) => (
              <FormItem className="space-y-2 w-full">
                <FormLabel>Trip Categories</FormLabel>
                <FormControl>
                  <MultipleSelect
                    options={[
                      { value: "TREKKING", label: "Trekking" },
                      { value: "PEAK_CLIMBING", label: "Peak Climbing" },
                      { value: "CULTURAL_HERITAGE", label: "Cultural Heritage" },
                      { value: "ADVENTURE_SPORTS", label: "Adventure Sports" },
                      { value: "SCENIC_ADVENTURES", label: "Scenic Adventures" },
                      { value: "WILDLIFE_SAFARIS", label: "Wildlife Safaris" },
                      { value: "PILGRIMAGE", label: "Pilgrimage" },
                    ]}
                    value={field.value || []}
                    onValueChange={field.onChange}
                    placeholder="Select categories"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1">
            <FormField
              control={form.control}
              name="displaySection"
              render={({ field }) => (
                <FormItem className="space-y-2 w-full">
                  <FormLabel>Displaying Trip</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Where to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SPECIALITIES_ONLY">Our Specialities (only)</SelectItem>
                      <SelectItem value="PACKAGES_ONLY">Packages (only)</SelectItem>
                      <SelectItem value="BOTH">Specialities and Packages (Both)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Category + Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="specialityOrder"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel>Speciality Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Order for Our Specialities"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="packageOrder"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel>Package Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Order for Packages"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Row 5: Best Season + Price */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bestSeason"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Best Season</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Spring, Autumn"
                    value={(field.value as string[]).join(", ")}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value
                          .split(",")
                          .map((s: string) => s.trim())
                          .filter(Boolean),
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }: any) => (
              <FormItem className="space-y-2">
                <FormLabel required>Price</FormLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                      USD
                    </span>
                    <Input type="number" className="rounded-l-none" placeholder="1200" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }: any) => (
            <FormItem className="space-y-2">
              <FormLabel required>Short Description</FormLabel>
              <FormControl>
                <Tiptap value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Trip Overview */}
        <FormField
          control={form.control}
          name="overview"
          render={({ field }: any) => (
            <FormItem className="space-y-2">
              <FormLabel required>Trip Overview (Rich Text Editor)</FormLabel>
              <FormControl>
                <Tiptap value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Featured Image */}
        <FormField
          control={form.control}
          name="featuredImageId"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Featured Image</FormLabel>

              <FormControl>
                <div className="space-y-4">
                  <MediaSelector
                    value={featuredMedia}
                    maxSelect={1}
                    onChange={(media) => {
                      const selected = Array.isArray(media) ? media[0] : media;
                      setFeaturedMedia(selected);
                      field.onChange(selected?.id);
                    }}
                  />

                  {featuredMedia && (
                    <div className="relative w-28 h-28">
                      <img
                        alt={featuredMedia.altText}
                        src={featuredMedia.thumbnailUrl || featuredMedia.url}
                        className="rounded-md object-cover w-full h-full"
                      />

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        onClick={() => {
                          setFeaturedMedia(undefined);
                          field.onChange(undefined);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gallery */}
        <FormField
          control={form.control}
          name="galleryIds"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Gallery</FormLabel>

              <FormControl>
                <div className="space-y-4">
                  <MediaSelector
                    value={galleryMedia}
                    maxSelect={10}
                    onChange={(media) => {
                      const mediaArray = Array.isArray(media) ? media : media ? [media] : [];
                      setGalleryMedia(mediaArray);
                      field.onChange(mediaArray.map((m) => m.id));
                    }}
                  />

                  <div className="flex gap-3 flex-wrap">
                    {galleryMedia.map((media: Media, index: number) => (
                      <div key={media.id ?? index} className="relative w-28 h-28">
                        <img
                          src={media.thumbnailUrl || media.url}
                          alt="Gallery"
                          className="rounded-md object-cover w-full h-full"
                        />

                        <Button
                          type="button"
                          size="icon"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => {
                            const updated = galleryMedia.filter(
                              (_: Media, i: number) => i !== index,
                            );
                            setGalleryMedia(updated);
                            field.onChange(updated.map((m: Media) => m.id));
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SectionList
          form={form}
          sectionFields={sectionFields}
          appendSection={appendSection}
          removeSection={removeSection}
        />
      </div>
    </TabsContent>
  );
}

function useTripForm(initialData: any) {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();
  const [activeTab, setActiveTab] = useState("general");

  const isPending = createTrip.isPending || updateTrip.isPending;

  const [featuredMedia, setFeaturedMedia] = useState<Media | undefined>();
  const [mapMedia, setMapMedia] = useState<Media | undefined>();
  const [galleryMedia, setGalleryMedia] = useState<Media[]>([]);

  useEffect(() => {
    if (initialData?.media) {
      const hero = initialData.media.find((tm: any) => tm.role === "hero")?.media;
      if (hero) setFeaturedMedia(hero);

      const mapImg = initialData.media.find((tm: any) => tm.role === "map")?.media;
      if (mapImg) setMapMedia(mapImg);

      const gallery = initialData.media
        .filter((tm: any) => tm.role === "gallery")
        .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
        .map((tm: any) => tm.media);
      if (gallery) setGalleryMedia(gallery);
    }
  }, [initialData]);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      overview: initialData?.overview || "",
      difficulty: initialData?.difficulty || "MODERATE",
      status: initialData?.status || "INACTIVE",
      duration: initialData?.duration || 1,
      maxAltitude: initialData?.maxAltitude || 0,
      minAltitude: initialData?.minAltitude || 0,
      permitRequired: initialData?.permitRequired || false,
      permitDetails: initialData?.permitDetails || "",
      safetyProtocol: initialData?.safetyProtocol || "",
      cancellationPolicy: initialData?.cancellationPolicy || "",
      region: initialData?.region || "",
      groupSizeMin: initialData?.groupSizeMin || 1,
      groupSizeMax: initialData?.groupSizeMax || 10,
      price: initialData?.price || 0,
      startDate: initialData?.startDate
        ? new Date(initialData.startDate).toISOString().split("T")[0]
        : "",
      displaySection: initialData?.displaySection ?? "BOTH",
      featuredImageId: initialData?.media?.find((tm: any) => tm.role === "hero")?.media?.id,
      mapImageId: initialData?.media?.find((tm: any) => tm.role === "map")?.media?.id,
      clothing: initialData?.clothing || "",
      galleryIds:
        initialData?.media
          ?.filter((tm: any) => tm.role === "gallery")
          ?.map((tm: any) => tm.media?.id) || [],
      destinationId: initialData?.destinations?.[0]?.destinationId || undefined,
      destinationIds: initialData?.destinations?.map((td: any) => td.destinationId) || [],
      category: initialData?.category
        ? Array.isArray(initialData.category)
          ? initialData.category
          : [initialData.category]
        : [],
      bestSeason: initialData?.bestSeason || ["Spring", "Autumn"],
      sections: initialData?.sections || [],
      essentialCategories: initialData?.essentialCategories || [],
      itineraryDays: initialData?.itineraryDays || [],
      inclusions: initialData?.inclusions || [],
      exclusions: initialData?.exclusions || [],
      faqs: initialData?.faqs || [],
      reviews:
        initialData?.reviews?.map((r: any) => ({
          id: r.id,
          reviewerName: r.reviewerName,
          rating: r.rating,
          content: r.content,
          reviewerCountry: r.reviewerCountry || "",
          date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
        })) || [],
    },
  });

  const {
    fields: itineraryFields,
    append: appendItinerary,
    remove: removeItinerary,
  } = useFieldArray({ control: form.control, name: "itineraryDays" });

  const {
    fields: inclusionFields,
    append: appendInclusion,
    remove: removeInclusion,
  } = useFieldArray({ control: form.control, name: "inclusions" });

  const {
    fields: exclusionFields,
    append: appendExclusion,
    remove: removeExclusion,
  } = useFieldArray({ control: form.control, name: "exclusions" });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  const {
    fields: reviewFields,
    append: appendReview,
    remove: removeReview,
  } = useFieldArray({ control: form.control, name: "reviews" });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({ control: form.control, name: "sections" });

  const onSubmit = (data: TripFormValues) => {
    const payload = buildPayload(data);

    const mutationOptions = {
      onSuccess: () => {
        clearDraft();
        toast.success(initialData ? "Trip updated successfully" : "Trip created successfully");
        navigate({ to: "/trips" });
      },
      onError: (error: any) => {
        const backendError = error.response?.data;
        const message = backendError?.message;

        if (backendError?.missingFields) {
          const firstMissing = backendError.missingFields[0];
          toast.error("Activation Failed", {
            description: `Missing ${firstMissing.name} in ${firstMissing.section}`,
          });
          if (firstMissing.tab) setActiveTab(firstMissing.tab);
          return;
        }

        const details = Array.isArray(message) ? message.join(", ") : message;
        toast.error("Failed to save trip", {
          description: details || "Error saving trip",
        });
      },
    };

    if (initialData) {
      updateTrip.mutate({ id: initialData.id, data: payload }, mutationOptions);
    } else {
      createTrip.mutate(payload, mutationOptions);
    }
  };

  // Field to tab mapping for validation errors
  const fieldToTabMap: Record<string, string> = {
    title: "general",
    slug: "general",
    category: "general",
    description: "general",
    overview: "general",
    difficulty: "general",
    status: "general",
    duration: "general",
    maxAltitude: "general",
    minAltitude: "general",
    price: "general",
    region: "general",
    destinationId: "general",
    featuredImageId: "general",
    mapImageId: "map",
    itineraryDays: "itinerary",
    inclusions: "includes",
    exclusions: "includes",
    essentialCategories: "essentials",
    faqs: "faqs",
    reviews: "reviews",
  };

  // User-friendly field labels for form toast notifications
  const { onError } = useFormToast<TripFormValues>(form.setFocus, {
    fieldLabels: {
      title: "Trip Title",
      slug: "URL Slug",
      category: "Category",
      description: "Description",
      overview: "Overview",
      difficulty: "Difficulty Level",
      status: "Status",
      duration: "Duration (days)",
      maxAltitude: "Maximum Altitude",
      minAltitude: "Minimum Altitude",
      price: "Price",
      region: "Region",
      destinationId: "Destination",
      featuredImageId: "Featured Image",
      mapImageId: "Map Image",
      itineraryDays: "Itinerary Days",
      inclusions: "Inclusions",
      exclusions: "Exclusions",
      essentialCategories: "Essential Items",
      faqs: "FAQs",
      reviews: "Reviews",
    },
  });

  const storageKey = initialData?.id ? `trip-form-draft-${initialData.id}` : "trip-form-draft-new";

  // ── Sidecar: persist media objects alongside form values ──────────────────
  // We JSON.stringify to get a stable primitive for the useEffect dependency,
  // avoiding an infinite loop from object reference changes on every render.
  const sidecarJson = JSON.stringify({
    featuredMedia: featuredMedia ?? null,
    mapMedia: mapMedia ?? null,
    galleryMedia: galleryMedia ?? [],
  });

  const { clearDraft } = useFormPersist(storageKey, form, {
    skipRestore: !!initialData, // ← add this line
    sidecar: JSON.parse(sidecarJson),
    onRestoreSidecar: (saved) => {
      if (saved.featuredMedia) setFeaturedMedia(saved.featuredMedia);
      if (saved.mapMedia) setMapMedia(saved.mapMedia);
      if (saved.galleryMedia?.length) setGalleryMedia(saved.galleryMedia);
    },
  });

  const onInvalid = (errors: FieldErrors<TripFormValues>) => {
    // Show toast
    onError(errors);

    // Auto-switch to the tab of the first error
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const tab = fieldToTabMap[firstErrorField];
      if (tab && tab !== activeTab) {
        setActiveTab(tab);
      }
    }
  };

  return {
    form,
    isPending,
    onSubmit,
    onError,
    onInvalid,
    featuredMedia,
    setFeaturedMedia,
    mapMedia,
    setMapMedia,
    galleryMedia,
    setGalleryMedia,
    itineraryFields,
    appendItinerary,
    removeItinerary,
    inclusionFields,
    appendInclusion,
    removeInclusion,
    exclusionFields,
    appendExclusion,
    removeExclusion,
    faqFields,
    appendFaq,
    removeFaq,
    reviewFields,
    appendReview,
    removeReview,
    sectionFields,
    appendSection,
    removeSection,
    storageKey,
    clearDraft,
    activeTab,
    setActiveTab,
  };
}

export function TripForm({ initialData }: TripFormProps) {
  const {
    form,
    isPending,
    onSubmit,
    onInvalid,
    onError,
    featuredMedia,
    setFeaturedMedia,
    mapMedia,
    setMapMedia,
    galleryMedia,
    setGalleryMedia,
    itineraryFields,
    appendItinerary,
    removeItinerary,
    inclusionFields,
    appendInclusion,
    removeInclusion,
    exclusionFields,
    appendExclusion,
    removeExclusion,
    faqFields,
    appendFaq,
    removeFaq,
    reviewFields,
    appendReview,
    removeReview,
    sectionFields,
    appendSection,
    removeSection,
    storageKey,
    clearDraft,
    activeTab,
    setActiveTab,
  } = useTripForm(initialData);

  const sectionProps = { sectionFields, appendSection, removeSection };

  const { data: destinationsResponse } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => destinationService.findAll(),
  });

  const destinations = destinationsResponse?.data || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 ">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="includes">Includes/Excludes</TabsTrigger>
            <TabsTrigger value="essentials">Essential List</TabsTrigger>
            <TabsTrigger value="map">Itineary Map</TabsTrigger>
            <TabsTrigger value="faqs">FAQs</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <GeneralTabContent
            form={form}
            storageKey={storageKey}
            clearDraft={clearDraft}
            featuredMedia={featuredMedia}
            setFeaturedMedia={setFeaturedMedia}
            mapMedia={mapMedia}
            setMapMedia={setMapMedia}
            galleryMedia={galleryMedia}
            setGalleryMedia={setGalleryMedia}
            destinations={destinations}
            {...sectionProps}
          />

          <ItineraryTabContent
            form={form}
            itineraryFields={itineraryFields}
            appendItinerary={appendItinerary}
            removeItinerary={removeItinerary}
            {...sectionProps}
          />

          <IncludesTabContent
            form={form}
            inclusionFields={inclusionFields}
            appendInclusion={appendInclusion}
            removeInclusion={removeInclusion}
            exclusionFields={exclusionFields}
            appendExclusion={appendExclusion}
            removeExclusion={removeExclusion}
            {...sectionProps}
          />

          <EssentialListTabContent form={form} {...sectionProps} />

          <ItinearyMapTab form={form} mapMedia={mapMedia} setMapMedia={setMapMedia} />

          <FaqsTabContent
            form={form}
            faqFields={faqFields}
            appendFaq={appendFaq}
            removeFaq={removeFaq}
            {...sectionProps}
          />

          <ReviewsTabContent
            form={form}
            reviewFields={reviewFields}
            appendReview={appendReview}
            removeReview={removeReview}
            {...sectionProps}
          />
        </Tabs>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Trip
        </Button>
      </form>
    </Form>
  );
}


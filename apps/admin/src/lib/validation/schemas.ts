import * as z from "zod";

export const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional().or(z.literal("")),
  photoUrl: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  yearsExperience: z.coerce
    .number()
    .min(0, "Years must be a positive number")
    .optional()
    .nullable(),
  certifications: z.string().optional(),
  languages: z.string().optional(),
});

export const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const departureSchema = z.object({
  tripId: z.coerce.number().min(1, "Trip is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  totalSeats: z.coerce.number().min(1, "Total seats must be at least 1").optional().nullable(),
  availableSeats: z.coerce.number().min(0, "Available seats cannot be negative").optional(),
  status: z.enum(["OPEN", "CANCELLED", "COMPLETED"]).optional(),
});

export const destinationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  parentId: z.coerce.number().optional().nullable(),
  type: z.enum(["PLACE", "ACTIVITY"]).default("PLACE"),
});

export const tagSchema = z.object({
  name: z.string().min(2, "Tag name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
});

export const tripSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  durationContent: z.string().optional().or(z.literal("")),
  bestTime: z.string().optional().or(z.literal("")),
  difficulty: z.string().optional().or(z.literal("")),
  maxAltitude: z.string().optional().or(z.literal("")),
  groupSize: z.string().optional().or(z.literal("")),
  price: z.coerce.number().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("INACTIVE"),
  type: z.enum(["TREKKING", "TOUR", "CLIMBING"]).default("TREKKING"),

  // Relations
  destinations: z.array(z.number()).optional().default([]),
  itineraries: z
    .array(
      z.object({
        day: z.coerce.number(),
        title: z.string().optional().or(z.literal("")),
        content: z.string().optional().or(z.literal("")),
        accommodations: z.string().optional().or(z.literal("")),
        meals: z.string().optional().or(z.literal("")),
      }),
    )
    .optional()
    .default([]),
  inclusions: z
    .array(
      z.object({
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
  exclusions: z
    .array(
      z.object({
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
  faqs: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    )
    .optional()
    .default([]),
});

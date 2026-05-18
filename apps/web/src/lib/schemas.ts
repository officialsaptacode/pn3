import { z } from "zod";

export const bookingFormSchema = z.object({
  tripId: z.string().min(1, "Please select a trip"),
  preferredDate: z.string().min(1, "Start date is required"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  countryCode: z.string().min(1, "Code required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  customerCountry: z.string().optional(),
  message: z.string().optional(),
  adultCount: z.string().default("1"),
  childrenCount: z.string().default("0"),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const inquiryFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().optional(),
  customerCountry: z.string().optional(),
  numberOfPeople: z.coerce.number().min(1).default(1),
  preferredDate: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  tripId: z.string().optional(),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

import { useCallback, useMemo } from "react";
import type { FieldErrors, UseFormSetFocus, FieldValues, Path } from "react-hook-form";
import { toast } from "sonner";

const FIELD_LABELS: Record<string, string> = {
  name: "Name",
  title: "Title",
  email: "Email",
  phone: "Phone",
  password: "Password",
  description: "Description",
  content: "Content",
  slug: "Slug",
  status: "Status",
  price: "Price",
  duration: "Duration",
  maxAltitude: "Max Altitude",
  bestSeason: "Best Season",
  difficulty: "Difficulty",
  destinationId: "Destination",
  tripId: "Trip",
  departureDate: "Departure Date",
  returnDate: "Return Date",
  availableSeats: "Available Seats",
  totalSeats: "Total Seats",
  isFeatured: "Featured",
  isPublished: "Published",
  metaTitle: "Meta Title",
  metaDescription: "Meta Description",
  coverImage: "Cover Image",
  gallery: "Gallery",
  bio: "Bio",
  avatar: "Avatar",
  role: "Role",
  color: "Color",
  country: "Country",
  region: "Region",
  priceOverride: "Price Override",
  firstName: "First Name",
  lastName: "Last Name",
  message: "Message",
  tripDate: "Trip Date",
  numberOfPeople: "Number of People",
  countryCode: "Country Code",
  dialCode: "Dial Code",
  value: "Value",
  label: "Label",
};

interface UseFormToastOptions {
  fieldLabels?: Record<string, string>;
  duration?: number;
  autoFocus?: boolean;
}

interface UseFormToastReturn<TFieldValues extends FieldValues> {
  onError: (errors: FieldErrors<TFieldValues>) => void;
  showFieldError: (fieldName: keyof TFieldValues, message: string) => void;
  showSuccess: (message: string) => void;
}

function findFirstError<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  prefix = "",
): { field: string; message: string } | null {
  for (const [key, error] of Object.entries(errors)) {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    if (!error) continue;
    if (typeof error === "object" && !error.message) {
      const nested = findFirstError(error as FieldErrors<TFieldValues>, fieldName);
      if (nested) return nested;
    }
    if (error.message) {
      return { field: fieldName, message: String(error.message) };
    }
  }
  return null;
}

function collectErrorMessages<TFieldValues extends FieldValues>(
  errors: FieldErrors<TFieldValues>,
  formatMessage: (field: string, msg: string) => string,
  prefix = "",
): string[] {
  const messages: string[] = [];
  for (const [key, error] of Object.entries(errors)) {
    const fieldName = prefix ? `${prefix}.${key}` : key;
    if (!error) continue;
    if (typeof error === "object" && !error.message) {
      messages.push(
        ...collectErrorMessages(error as FieldErrors<TFieldValues>, formatMessage, fieldName),
      );
    } else if (error.message) {
      messages.push(`• ${formatMessage(fieldName, String(error.message))}`);
    }
  }
  return messages;
}

function getLabel(fieldName: string, labels: Record<string, string>): string {
  const baseName = fieldName.split(".")[0];
  return (
    labels[fieldName] ||
    (baseName && labels[baseName]) ||
    fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/\./g, " → ")
      .replace(/^./, (str) => str.toUpperCase())
  );
}

function formatError(fieldName: string, message: string, labels: Record<string, string>): string {
  const label = getLabel(fieldName, labels);
  if (message.toLowerCase().includes(label.toLowerCase())) return message;
  if (message === "Required" || message === "Invalid value") return `${label} is required`;
  if (message.includes("at least")) return `${label} ${message}`;
  return `${label}: ${message}`;
}

export function useFormToast<TFieldValues extends FieldValues = Record<string, unknown>>(
  setFocus: UseFormSetFocus<TFieldValues>,
  options: UseFormToastOptions = {},
): UseFormToastReturn<TFieldValues> {
  const { fieldLabels: customLabels = {}, duration = 5000, autoFocus = true } = options;
  const labels = useMemo(() => ({ ...FIELD_LABELS, ...customLabels }), [customLabels]);

  const showFieldError = useCallback(
    (fieldName: keyof TFieldValues, message: string) => {
      toast.error("Validation Error", {
        description: formatError(String(fieldName), message, labels),
        duration,
      });
    },
    [labels, duration],
  );

  const onError = useCallback(
    (errors: FieldErrors<TFieldValues>) => {
      if (Object.keys(errors).length === 0) return;
      const firstError = findFirstError(errors);
      if (firstError && autoFocus) {
        try {
          setFocus(firstError.field as Path<TFieldValues>, { shouldSelect: true });
        } catch (e) {
          console.warn("Failed to set focus on field:", firstError.field, e);
        }
      }
      const errorMessages = collectErrorMessages(errors, (f, m) => formatError(f, m, labels));
      if (errorMessages.length === 1 && errorMessages[0]) {
        toast.error("Validation Error", {
          description: errorMessages[0].replace(/^•\s*/, ""),
          duration,
        });
      } else {
        const displayed = errorMessages.slice(0, 3).join("\n");
        const more = errorMessages.length > 3 ? `\n...and ${errorMessages.length - 3} more` : "";
        toast.error("Please fix the following errors", {
          description: `${displayed}${more}`,
          duration,
        });
      }
    },
    [setFocus, labels, duration, autoFocus],
  );

  const showSuccess = useCallback((message: string) => {
    toast.success(message);
  }, []);

  return { onError, showFieldError, showSuccess };
}

export default useFormToast;

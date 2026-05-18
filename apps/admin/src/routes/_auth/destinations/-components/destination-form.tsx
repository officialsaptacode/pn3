import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { destinationService } from "@workspace/api-client";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { FormCard } from "@/components/form-card";
import Tiptap from "@/components/tip-tap";
import { useFormToast } from "@/hooks/use-form-toast";

const destinationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["COUNTRY", "REGION", "PLACE"]),
  parentId: z.string().optional(), // Select value is string, convert to number on submit
  // slug is usually generated backend or ignored for now? backend DTO requires slug?
  // backend DTO requires slug. We can auto-generate or ask user.
  // Let's assume backend generates from name if missing, or we add slug field.
  // existing form didn't have slug. Wait, create-destination.dto.ts HAS slug.
  // existing form likely failed or backend generates it?
  // Let's add slug field as optional or auto-generated.
  slug: z.string().min(2).optional(),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

interface DestinationFormProps {
  initialData?: any;
}

export function DestinationForm({ initialData }: DestinationFormProps) {
  const navigate = useNavigate();
  // Try to get search params safely
  const search: any = useSearch({ strict: false });
  const defaultParentId = search?.parentId ? String(search.parentId) : undefined;

  const { data: response } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => destinationService.findAll(),
  });

  const destinations = response?.data || [];

  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema as any),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      type: initialData?.type || "PLACE",
      parentId: initialData?.parentId ? String(initialData.parentId) : defaultParentId,
      slug: initialData?.slug || "",
    },
  });

  const onSubmit = async (data: DestinationFormValues) => {
    try {
      const payload = {
        ...data,
        parentId: data.parentId && data.parentId !== "0" ? Number(data.parentId) : undefined,
        // Generate slug if empty
        slug: data.slug || data.name.toLowerCase().replace(/ /g, "-"),
      };

      if (initialData) {
        await destinationService.update(initialData.id, payload);
        toast.success("Destination updated successfully");
      } else {
        await destinationService.create(payload);
        toast.success("Destination created successfully");
      }
      navigate({ to: "/destinations" as any });
    } catch (_error) {
      toast.error("Something went wrong");
    }
  };

  const { onError } = useFormToast<DestinationFormValues>(form.setFocus, {
    fieldLabels: {
      name: "Destination Name",
      slug: "URL Slug",
      country: "Country",
      region: "Region",
      description: "Description",
      coverImage: "Cover Image",
    },
  });

  return (
    <FormCard title={initialData ? "Edit Destination" : "Create Destination"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Destination name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="url-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="COUNTRY">Country</SelectItem>
                      <SelectItem value="REGION">Region</SelectItem>
                      <SelectItem value="PLACE">Place</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">None</SelectItem>
                      {destinations?.map(
                        (d: any) =>
                          // Prevent selecting self as parent
                          d.id !== initialData?.id && (
                            <SelectItem key={d.id} value={String(d.id)}>
                              {d.name}
                            </SelectItem>
                          ),
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Tiptap value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save Destination</Button>
        </form>
      </Form>
    </FormCard>
  );
}

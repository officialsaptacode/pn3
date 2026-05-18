import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { authorService } from "@workspace/api-client";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Tiptap from "@/components/tip-tap";
import { useFormToast } from "@/hooks/use-form-toast";

const authorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional().or(z.literal("")),
  photoUrl: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  yearsExperience: z.coerce.number().optional().nullable(),
  certifications: z.string().optional(),
  languages: z.string().optional(),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorFormProps {
  initialData?: any;
}

export function AuthorForm({ initialData }: AuthorFormProps) {
  const navigate = useNavigate();
  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      bio: initialData?.bio || "",
      photoUrl: initialData?.photoUrl || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      yearsExperience: initialData?.yearsExperience || 0,
      certifications: initialData?.certifications || "",
      languages: initialData?.languages || "",
    },
  });

  const onSubmit = async (data: AuthorFormValues) => {
    try {
      const payload = {
        ...data,
        email: data.email || undefined,
        certifications: data.certifications
          ? data.certifications.split(",").map((c) => c.trim())
          : [],
        languages: data.languages ? data.languages.split(",").map((l) => l.trim()) : [],
      };

      if (initialData) {
        await authorService.update(initialData.id, payload);
        toast.success("Author updated successfully");
      } else {
        await authorService.create(payload);
        toast.success("Author created successfully");
      }
      navigate({ to: "/authors" });
    } catch (_error) {
      toast.error("Something went wrong");
    }
  };

  const { onError } = useFormToast<AuthorFormValues>(form.setFocus, {
    fieldLabels: {
      name: "Author Name",
      bio: "Biography",
      photoUrl: "Avatar Image",
      email: "Email Address",
      phone: "Phone",
      yearsExperience: "Years of Experience",
      certifications: "Certifications",
      languages: "Languages",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearsExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel required>Years of Experience</FormLabel>
                <FormControl>
                  <Input type="number" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo URL</FormLabel>
                <FormControl>
                  <Input placeholder="Photo URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="certifications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certifications (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. NHMCG, IFMGA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. English, Nepali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Bio</FormLabel>
              <FormControl>
                <Tiptap value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Author</Button>
      </form>
    </Form>
  );
}

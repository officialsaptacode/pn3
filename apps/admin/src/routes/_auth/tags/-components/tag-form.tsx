import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { tagService } from "@workspace/api-client";
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
import { useFormToast } from "@/hooks/use-form-toast";

const tagSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagFormProps {
  initialData?: any;
}

export function TagForm({ initialData }: TagFormProps) {
  const navigate = useNavigate();
  const form = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema as any),
    defaultValues: initialData || {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: TagFormValues) => {
    try {
      if (initialData) {
        await tagService.update(initialData.id, data);
        toast.success("Tag updated successfully");
      } else {
        await tagService.create(data);
        toast.success("Tag created successfully");
      }
      navigate({ to: "/tags" });
    } catch (_error) {
      toast.error("Something went wrong");
    }
  };

  const { onError } = useFormToast<TagFormValues>(form.setFocus, {
    fieldLabels: {
      name: "Tag Name",
      slug: "URL Slug",
      description: "Description",
      color: "Color",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Name</FormLabel>
              <FormControl>
                <Input placeholder="Tag name" {...field} />
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
              <FormLabel required>Slug</FormLabel>
              <FormControl>
                <Input placeholder="tag-slug" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save Tag</Button>
      </form>
    </Form>
  );
}

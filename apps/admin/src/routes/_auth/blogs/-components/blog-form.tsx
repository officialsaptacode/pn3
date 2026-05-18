import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { Media } from "@workspace/api-client";
import { blogService, tagService } from "@workspace/api-client";
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
import { MultipleSelect } from "@workspace/ui/multi-select";
import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MediaLibraryModal } from "@/components/MediaLibrary";
import Tiptap from "@/components/tip-tap";
import { useFormToast } from "@/hooks/use-form-toast";

const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  slug: z.string().optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  readingTime: z.coerce.number().min(1).optional().nullable(),
  tagIds: z.array(z.number()).default([]),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const navigate = useNavigate();
  const [featuredImage, setFeaturedImage] = useState<Media | null>(
    initialData?.media?.find((m: any) => m.role === "hero")?.media || null,
  );
  const [gallery, setGallery] = useState<Media[]>(
    initialData?.media
      ?.filter((m: any) => m.role === "gallery")
      ?.sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0))
      ?.map((m: any) => m.media) || [],
  );

  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  const { data: response } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.findAll(),
  });

  const tagsData = response?.data || [];

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema as any),
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      content: initialData?.content || "",
      isPublished: initialData?.isPublished ?? false,
      readingTime: initialData?.readingTime || undefined,
      tagIds: initialData?.tags?.map((t: any) => t.tagId || t.id) || [],
    },
  });

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const mediaPayload = [];

      if (featuredImage) {
        mediaPayload.push({
          mediaId: featuredImage.id,
          role: "hero",
          displayOrder: 0,
        });
      }

      gallery.forEach((img, index) => {
        mediaPayload.push({
          mediaId: img.id,
          role: "gallery",
          displayOrder: index,
        });
      });

      const payload = {
        ...data,
        media: mediaPayload,
      };

      if (initialData) {
        await blogService.update(initialData.id, payload);
        toast.success("Blog post updated successfully");
      } else {
        await blogService.create(payload);
        toast.success("Blog post created successfully");
      }
      navigate({ to: "/blogs" });
    } catch (_error) {
      toast.error("Something went wrong");
    }
  };

  const { onError } = useFormToast<BlogFormValues>(form.setFocus, {
    fieldLabels: {
      title: "Blog Title",
      slug: "URL Slug",
      content: "Content",
      excerpt: "Excerpt",
      authorId: "Author",
      tags: "Tags",
      coverImage: "Cover Image",
      metaTitle: "Meta Title",
      metaDescription: "Meta Description",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Blog title" {...field} />
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
                    <Input placeholder="blog-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "true")}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="false">Draft</SelectItem>
                      <SelectItem value="true">Published</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="readingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reading Time (minutes)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultipleSelect
                      options={
                        tagsData?.map((tag: any) => ({
                          label: tag.name,
                          value: tag.id.toString(),
                        })) || []
                      }
                      placeholder="Select tags"
                      value={field.value?.map(String) || []}
                      onValueChange={(vals) =>
                        field.onChange(Array.isArray(vals) ? vals.map(Number) : [Number(vals)])
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <FormLabel>Featured Image</FormLabel>
            <div className="border rounded-md p-4">
              {featuredImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md group">
                  <img
                    src={featuredImage.url}
                    alt={featuredImage.altText || "Featured"}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setFeaturedImage(null)}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="aspect-video w-full bg-muted flex items-center justify-center rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setIsFeaturedModalOpen(true)}
                >
                  <span className="text-muted-foreground">Select Featured Image</span>
                </div>
              )}
              <MediaLibraryModal
                open={isFeaturedModalOpen}
                onOpenChange={setIsFeaturedModalOpen}
                onSelect={(media: Media[]) => {
                  if (media.length > 0) setFeaturedImage(media[0] ?? null);
                }}
                maxSelect={1}
                defaultSelected={featuredImage ? [featuredImage] : []}
              />
            </div>
          </div>
        </div>

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Content</FormLabel>
              <FormControl>
                <Tiptap value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Gallery</FormLabel>
            <Button type="button" variant="outline" onClick={() => setIsGalleryModalOpen(true)}>
              Add Images
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, index) => (
              <div
                key={img.id}
                className="relative aspect-square group rounded-md overflow-hidden border"
              >
                <img
                  src={img.thumbnailUrl || img.url}
                  alt={img.altText || "Gallery"}
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setGallery(gallery.filter((_, i) => i !== index))}
                  type="button"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <MediaLibraryModal
              open={isGalleryModalOpen}
              onOpenChange={setIsGalleryModalOpen}
              onSelect={(media: Media[]) => {
                setGallery((prev) => {
                  const newMedia = media.filter((m: Media) => !prev.find((p) => p.id === m.id));
                  return [...prev, ...newMedia];
                });
              }}
              maxSelect={10}
              defaultSelected={gallery}
            />
          </div>
        </div>

        <Button type="submit">Save Post</Button>
      </form>
    </Form>
  );
}

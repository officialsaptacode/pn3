import { createFileRoute } from "@tanstack/react-router";
import type { Media } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Copy, Loader2, Trash, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { useDeleteMedia, useMedia, useUploadMedia } from "@/features/media/api/use-media";

export const Route = createFileRoute("/_auth/media/")({
  component: MediaPage,
});

function MediaPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use types from ApiResponse wrapper if needed, but current hook returns data structure directly
  const { data, isLoading } = useMedia();
  const mediaItems = data?.data || [];

  const { mutate: upload, isPending: isUploading } = useUploadMedia();
  const { mutate: deleteMedia } = useDeleteMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload({ file });
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div>Loading media...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {mediaItems.map((item: Media) => (
            <Card key={item.id} className="overflow-hidden group relative">
              <CardContent className="p-0 aspect-square relative">
                <img
                  src={item.url}
                  alt={item.caption || "Media"}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" onClick={() => copyToClipboard(item.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => {
                      if (confirm("Delete this image?")) {
                        deleteMedia(item.id);
                      }
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {mediaItems.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No media files found. Upload some images to get started.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

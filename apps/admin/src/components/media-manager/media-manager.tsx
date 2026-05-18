"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Media, MediaResponse } from "@workspace/api-client";
import { mediaService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Check, ImageIcon, Loader2, Search, Upload, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface MediaManagerProps {
  mode?: "single" | "multiple";
  onSelect: (media: Media[]) => void;
  trigger?: React.ReactNode;
  selectedIds?: number[];
}

export function MediaManager({
  mode = "single",
  onSelect,
  trigger,
  selectedIds = [],
}: MediaManagerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Media[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery<MediaResponse>({
    queryKey: ["media", search],
    queryFn: () => mediaService.findAll({ search, limit: 50 }),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      return mediaService.upload(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("Image uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload image");
    },
  });

  // Initialize selected from selectedIds when dialog opens
  useEffect(() => {
    if (open && data?.data && selectedIds.length > 0) {
      const preSelected = data.data.filter((m) => selectedIds.includes(m.id));
      setSelected(preSelected);
    }
  }, [open, data, selectedIds]);

  const handleSelect = useCallback(
    (media: Media) => {
      if (mode === "single") {
        setSelected([media]);
      } else {
        setSelected((prev) => {
          const exists = prev.find((m) => m.id === media.id);
          if (exists) {
            return prev.filter((m) => m.id !== media.id);
          }
          return [...prev, media];
        });
      }
    },
    [mode],
  );

  const handleConfirm = () => {
    onSelect(selected);
    setOpen(false);
    setSelected([]);
  };

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;

    for (const file of uploadFiles) {
      await uploadMutation.mutateAsync(file);
    }
    setUploadFiles([]);
    refetch();
  };

  const isSelected = (id: number) => selected.some((m) => m.id === id);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" type="button">
            <ImageIcon className="mr-2 h-4 w-4" />
            Select Media
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Manager</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="flex-1 flex flex-col overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by caption or alt text..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : data?.data && data.data.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {data.data.map((media) => (
                    <div
                      key={media.id}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        isSelected(media.id)
                          ? "border-primary ring-2 ring-primary/50"
                          : "border-transparent hover:border-muted-foreground/50"
                      }`}
                      onClick={() => handleSelect(media)}
                    >
                      <img
                        src={media.url}
                        alt={media.altText || media.caption || "Media"}
                        className="w-full h-full object-cover"
                      />
                      {isSelected(media.id) && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      {media.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                          {media.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2" />
                  <p>No media found</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="flex-1">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setUploadFiles(Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id="media-upload"
              />
              <label htmlFor="media-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Click to select files</p>
                <p className="text-sm text-muted-foreground">or drag and drop images here</p>
              </label>
            </div>

            {uploadFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Selected Files ({uploadFiles.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-muted p-2 rounded"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadFiles((prev) => prev.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={uploadMutation.isPending}
                  className="mt-4 w-full"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload {uploadFiles.length} file(s)
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <div className="flex items-center gap-2 mr-auto text-sm text-muted-foreground">
            {selected.length > 0 && (
              <span>
                {selected.length} {mode === "single" ? "image" : "images"} selected
              </span>
            )}
          </div>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={selected.length === 0}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

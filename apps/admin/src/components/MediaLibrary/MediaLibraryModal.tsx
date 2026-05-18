import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Media } from "@workspace/api-client";
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
import { ChevronLeft, ChevronRight, Folder, Search, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BulkUpload } from "./BulkUpload";
import { MediaGrid } from "./MediaGrid";

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media[]) => void;
  maxSelect?: number; // 1 for single, >1 for multiple
  defaultSelected?: Media[];
  trigger?: React.ReactNode;
}

export function MediaLibraryModal({
  open,
  onOpenChange,
  onSelect,
  maxSelect = 1,
  defaultSelected = [],
  trigger,
}: MediaLibraryModalProps) {
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState<string | undefined>();
  const [selected, setSelected] = useState<Media[]>(defaultSelected);
  const [activeTab, setActiveTab] = useState("browse");
  const [page, setPage] = useState(1);
  const limit = 50;

  const queryClient = useQueryClient();

  // Reset page when search or folder changes
  useEffect(() => {
    setPage(1);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["media", search, folder, page],
    queryFn: () => mediaService.findAll({ search, folder, page, limit }),
    enabled: open,
  });

  const { data: folderStats } = useQuery({
    queryKey: ["media-folders"],
    queryFn: () => mediaService.getFolders(),
    enabled: open,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      // If folder is selected, upload to that folder
      // But we don't have folder creation UI yet, so maybe just upload to root or let BulkUpload handle folder selection?
      // For now, upload to root or selected folder if any
      return mediaService.bulkUpload(files, folder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      queryClient.invalidateQueries({ queryKey: ["media-folders"] });
      toast.success("Files uploaded successfully");
      setActiveTab("browse");
    },
    onError: () => {
      toast.error("Failed to upload files");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return mediaService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast.success("File deleted");
      setSelected((prev) =>
        prev.filter((m) => !deleteMutation.variables || m.id !== deleteMutation.variables),
      );
    },
    onError: () => {
      toast.error("Failed to delete file");
    },
  });

  // Sync defaultSelected when modal opens
  useEffect(() => {
    if (open) {
      setSelected(defaultSelected);
    }
  }, [open, defaultSelected]);

  const handleSelect = useCallback(
    (media: Media) => {
      if (maxSelect === 1) {
        setSelected([media]);
      } else {
        setSelected((prev) => {
          const exists = prev.find((m) => m.id === media.id);
          if (exists) {
            return prev.filter((m) => m.id !== media.id);
          }
          if (prev.length >= maxSelect) {
            toast.error(`You can only select up to ${maxSelect} items`);
            return prev;
          }
          return [...prev, media];
        });
      }
    },
    [maxSelect],
  );

  const handleConfirm = () => {
    onSelect(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <div className="px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="px-6 py-2 border-b bg-muted/20 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="browse" className="gap-2">
                <Folder className="h-4 w-4" />
                Browse
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>

            {activeTab === "browse" && (
              <div className="flex items-center gap-2">
                {/* Folder Filter */}
                {folderStats && folderStats.length > 0 && (
                  <select
                    className="h-9 rounded-md border text-sm px-2 bg-background"
                    value={folder || ""}
                    onChange={(e) => setFolder(e.target.value || undefined)}
                  >
                    <option value="">All Folders</option>
                    {folderStats.map((f: { name: string; count: number }) => (
                      <option key={f.name} value={f.name}>
                        {f.name} ({f.count})
                      </option>
                    ))}
                  </select>
                )}

                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search media..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
            )}
          </div>

          <TabsContent value="browse" className="flex-1 m-0 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <MediaGrid
                media={data?.data || []}
                selectedIds={selected.map((m) => m.id)}
                onSelect={handleSelect}
                onDelete={(id) => deleteMutation.mutate(id)}
                isLoading={isLoading}
              />
            </div>

            {/* Pagination Controls */}
            {data?.meta && data.meta.totalPages > 1 && (
              <div className="p-2 border-t flex items-center justify-between bg-muted/10">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {data.meta.totalPages} ({data.meta.total} items)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      data?.meta && setPage((p) => Math.min(data.meta?.totalPages ?? 1, p + 1))
                    }
                    disabled={page === data.meta?.totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="flex-1 overflow-y-auto m-0 p-4 sm:p-6 min-h-0">
            <BulkUpload
              onUpload={async (files) => {
                await uploadMutation.mutateAsync(files);
              }}
              isUploading={uploadMutation.isPending}
            />
          </TabsContent>
        </Tabs>

        <div className="px-6 py-4 border-t bg-muted/10">
          <DialogFooter className="flex items-center justify-between w-full sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {selected.length} item{selected.length !== 1 ? "s" : ""} selected
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={selected.length === 0}>
                Insert Media
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mediaService } from "@workspace/api-client";
import { toast } from "sonner";

export const mediaKeys = {
  all: ["media"] as const,
  lists: () => [...mediaKeys.all, "list"] as const,
  list: (params: any) => [...mediaKeys.lists(), params] as const,
};

export const useMedia = (params?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: mediaKeys.list(params || {}),
    queryFn: () => mediaService.findAll(params),
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, caption, altText }: { file: File; caption?: string; altText?: string }) =>
      mediaService.upload(file, caption, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      toast.success("Media uploaded successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload media");
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mediaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.lists() });
      toast.success("Media deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete media");
    },
  });
};

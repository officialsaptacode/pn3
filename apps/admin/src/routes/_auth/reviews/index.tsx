import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { reviewService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";

export const Route = createFileRoute("/_auth/reviews/")({
  component: ReviewsPage,
});

function ReviewsPage() {
  const queryClient = useQueryClient();

  const { data: reviews } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => reviewService.findAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reviewService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete review");
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "reviewerName",
      header: "Reviewer Name",
    },
    {
      accessorKey: "reviewerEmail",
      header: "Email",
    },
    {
      accessorKey: "trip.title",
      header: "Trip",
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }: any) => `${row.original.rating}/5`,
    },
    {
      accessorKey: "content",
      header: "Review",
      cell: ({ row }: any) => <div className="max-w-xs truncate">{row.original.content}</div>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            if (confirm("Are you sure you want to delete this review?")) {
              deleteMutation.mutate(row.original.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Review Management</h2>
      </div>

      <DataTable columns={columns} data={reviews?.data || []} />
    </div>
  );
}

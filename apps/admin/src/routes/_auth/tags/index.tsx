import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { tagService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";

export const Route = createFileRoute("/_auth/tags/")({
  component: TagsPage,
});

function TagsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tags, isLoading: _isLoading } = useQuery({
    queryKey: ["tags"],
    queryFn: () => tagService.findAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      toast.success("Tag deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete tag");
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "slug",
      header: "Slug",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: `/tags/edit/${row.original.id}` })}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this tag?")) {
                deleteMutation.mutate(row.original.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tag Management</h2>
        <Button onClick={() => navigate({ to: "/tags/create" })}>Create Tag</Button>
      </div>

      <DataTable columns={columns} data={tags?.data || []} />
    </div>
  );
}

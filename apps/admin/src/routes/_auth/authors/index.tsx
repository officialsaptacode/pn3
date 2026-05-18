import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { authorService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";

export const Route = createFileRoute("/_auth/authors/")({
  component: AuthorsPage,
});

function AuthorsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: authors, isLoading: _isLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: () => authorService.findAllAdmin(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => authorService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      toast.success("Author deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete author");
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "yearsExperience",
      header: "Experience (Years)",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: `/authors/edit/${row.original.id}` })}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm("Are you sure you want to delete this author?")) {
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
        <h2 className="text-3xl font-bold tracking-tight">Author Management</h2>
        <Button onClick={() => navigate({ to: "/authors/create" })}>Create Author</Button>
      </div>

      <DataTable columns={columns} data={authors?.data || []} />
    </div>
  );
}

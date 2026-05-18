import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { blogService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDebounceValue } from "usehooks-ts";
import { DataTable } from "@/components/data-table";
import { SearchFilter } from "@/components/search-filter";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/blogs/")({
  component: BlogsPage,
});

function BlogsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);

  const { data, refetch } = useQuery({
    queryKey: ["blogs", debouncedSearch],
    queryFn: () => blogService.findAll({ search: debouncedSearch }),
  });

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await blogService.delete(id);
        toast.success("Post deleted");
        refetch();
      } catch (_e) {
        toast.error("Failed to delete post");
      }
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "author.userName",
      header: "Author",
    },
    {
      accessorKey: "isPublished",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.isPublished ? "PUBLISHED" : "DRAFT"} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link
                  to="/blogs/edit/$id"
                  params={{ id: String(blog.id) }}
                  className="flex w-full items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(blog.id)} className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Blog Posts</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link to="/blogs/create" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <SearchFilter onSearchChange={setSearch} searchPlaceholder="Search posts..." />
        {data?.data && <DataTable columns={columns} data={data.data} />}
      </div>
    </div>
  );
}

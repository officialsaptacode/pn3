import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { type Destination, destinationService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { type TreeNode, TreeView } from "@/components/tree-view";

export const Route = createFileRoute("/_auth/destinations/")({
  component: DestinationsPage,
});

function buildTree(destinations: Destination[]): TreeNode[] {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  // First pass: create nodes
  destinations.forEach((d) => {
    map.set(d.id, { ...d, children: [] });
  });

  // Second pass: link parents
  destinations.forEach((d) => {
    const node = map.get(d.id);
    if (!node) return;

    if (d.parentId) {
      const parent = map.get(d.parentId);
      if (parent) {
        parent.children?.push(node);
      } else {
        // Parent not found, treat as root or handle error
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function DestinationsPage() {
  const queryClient = useQueryClient();

  const { data: destinations, isLoading: _isLoading } = useQuery({
    queryKey: ["destinations"],
    queryFn: () => destinationService.findAllAdmin(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => destinationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      toast.success("Destination deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete destination");
    },
  });

  const treeData = useMemo(() => {
    if (!destinations) return [];
    return buildTree(destinations.data);
  }, [destinations]);

  if (_isLoading) return <div>Loading...</div>;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Destination Management</h2>
        <Button asChild>
          <Link to={"/destinations/create" as any} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Destination
          </Link>
        </Button>
      </div>

      <div className="border rounded-md p-4 bg-background">
        <TreeView
          data={treeData}
          onDelete={(id) => {
            if (confirm("Are you sure you want to delete this destination?")) {
              deleteMutation.mutate(id);
            }
          }}
        />
        {treeData.length === 0 && (
          <div className="text-center text-muted-foreground p-8">
            No destinations found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}

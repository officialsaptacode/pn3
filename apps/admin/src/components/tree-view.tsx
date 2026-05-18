import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ChevronDown, ChevronRight, Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface TreeNode {
  id: number;
  name: string;
  children?: TreeNode[];
  type?: string;
  [key: string]: any;
}

interface TreeViewProps {
  data: TreeNode[];
  onDelete?: (id: number) => void;
  level?: number;
}

export function TreeView({ data, onDelete, level = 0 }: TreeViewProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className={cn("space-y-1", level > 0 && "ml-6 border-l pl-2")}>
      {data.map((node) => (
        <TreeItem key={node.id} node={node} onDelete={onDelete} level={level} />
      ))}
    </div>
  );
}

function TreeItem({
  node,
  onDelete,
  level,
}: {
  node: TreeNode;
  onDelete?: (id: number) => void;
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="group">
      <div
        className={cn(
          "flex items-center justify-between rounded-md p-2 hover:bg-muted",
          level === 0 && "bg-muted/30 font-medium",
        )}
      >
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="h-4 w-4 text-muted-foreground hover:text-foreground"
            >
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <div className="w-4" />
          )}
          <span className="text-sm">
            {node.name}{" "}
            {node.type && (
              <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                {node.type}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {node.type !== "PLACE" && (
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <Link
                to="/destinations/create"
                search={{ parentId: node.id }}
                title="Add Child"
                className="flex items-center"
              >
                <Plus className="h-3 w-3" />
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
            <Link
              to="/destinations/edit/$id"
              params={{ id: node.id.toString() }}
              title="Edit"
              className="flex items-center"
            >
              <Edit className="h-3 w-3" />
            </Link>
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onDelete(node.id)}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {isOpen && hasChildren && (
        <TreeView data={node.children ?? []} onDelete={onDelete} level={level + 1} />
      )}
    </div>
  );
}

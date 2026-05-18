import type { UseMutateFunction } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/custom-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import type { AxiosError } from "axios";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import * as React from "react";

interface ConfigurableDropdownMenuProps {
  editLink?: string;
  viewLink?: string;

  id: number | string;

  onDelete?: UseMutateFunction<any, AxiosError<unknown, any>, number | string, unknown>;
}

export function TableDropdownMenu({
  id,
  editLink,
  viewLink,
  onDelete,
}: ConfigurableDropdownMenuProps) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const handleEdit = () => {
    if (editLink) {
      navigate({ to: editLink });
    }
  };

  const handleView = () => {
    if (viewLink) {
      navigate({ to: viewLink });
    }
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      setIsLoading(true);
      onDelete(id, {
        onSettled: () => {
          setIsLoading(false);
          setShowDeleteDialog(false);
        },
      });
    }
  };

  if (!editLink && !viewLink && !onDelete) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {viewLink && (
            <DropdownMenuItem onClick={handleView} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
          )}
          {editLink && (
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the item.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              type="button"
              disabled={isLoading}
              loading={isLoading}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

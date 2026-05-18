import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { userService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/users/")({
  component: UsersPage,
});

function UsersPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newRole, setNewRole] = useState<string>("");

  const { data: users, isLoading: _isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.findAll(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
      setSelectedUser(null);
      setNewRole("");
    },
    onError: () => {
      toast.error("Failed to update user role");
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "userName",
      header: "Username",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => <StatusBadge status={row.original.role} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedUser(row.original);
            setNewRole(row.original.role);
          }}
        >
          Change Role
        </Button>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>

      {selectedUser && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-4 text-lg font-semibold">Change Role for {selectedUser.userName}</h3>
          <div className="flex items-center gap-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() =>
                updateRoleMutation.mutate({
                  id: selectedUser.id,
                  role: newRole,
                })
              }
              disabled={updateRoleMutation.isPending}
            >
              Update Role
            </Button>
            <Button variant="outline" onClick={() => setSelectedUser(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={users?.data || []} />
    </div>
  );
}

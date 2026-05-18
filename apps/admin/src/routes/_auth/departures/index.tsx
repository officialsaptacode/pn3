import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { departureService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/departures/")({
  component: DeparturesPage,
});

function DeparturesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: departures } = useQuery({
    queryKey: ["departures"],
    queryFn: () => departureService.findAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => departureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departures"] });
      toast.success("Departure deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete departure");
    },
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "trip.title",
      header: "Trip",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: any) => format(new Date(row.original.startDate), "MMM dd, yyyy"),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }: any) =>
        row.original.endDate ? format(new Date(row.original.endDate), "MMM dd, yyyy") : "N/A",
    },
    {
      accessorKey: "availableSeats",
      header: "Available Seats",
      cell: ({ row }: any) => `${row.original.availableSeats}/${row.original.totalSeats}`,
    },
    {
      accessorKey: "_count.bookings",
      header: "Bookings",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: `/departures/edit/${row.original.id}` })}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={row.original._count.bookings > 0}
            onClick={() => {
              if (confirm("Are you sure you want to delete this departure?")) {
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
        <h2 className="text-3xl font-bold tracking-tight">Departure Management</h2>
        <Button onClick={() => navigate({ to: "/departures/create" })}>Create Departure</Button>
      </div>

      <DataTable columns={columns} data={departures?.data || []} />
    </div>
  );
}

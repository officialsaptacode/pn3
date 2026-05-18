import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import type { Trip } from "@workspace/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Archive, MoreHorizontal, Pencil, RefreshCw, Trash } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { useDeleteTrip, useUpdateTrip } from "@/features/trips/api/use-trips";

interface TripsTableProps {
  data: Trip[];
}

/** Pill badge showing trip status visually */
function StatusBadge({ status }: { status: string }) {
  const isActive = status === "ACTIVE";
  return (
    <Badge
      variant={isActive ? "default" : "secondary"}
      className={
        isActive
          ? "bg-green-100 text-green-800 hover:bg-green-100 border border-green-200"
          : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border border-yellow-200"
      }
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${isActive ? "bg-green-500" : "bg-yellow-500"}`}
      />
      {isActive ? "Active" : "Archive"}
    </Badge>
  );
}

export function TripsTable({ data }: TripsTableProps) {
  const { mutate: deleteTrip } = useDeleteTrip();
  const { mutate: updateTrip, isPending } = useUpdateTrip();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this trip?")) {
      deleteTrip(id);
    }
  };

  const handleStatusToggle = (trip: Trip) => {
    const newStatus = trip.status === "ACTIVE" ? "ARCHIVE" : "ACTIVE";
    updateTrip({ id: trip.id, data: { status: newStatus } });
  };

  const columns: ColumnDef<Trip>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.title}</p>
          {row.original.slug && (
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">
              /{row.original.slug}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: "region",
      header: "Region",
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => `${row.getValue("duration")} days`,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price") || "0");
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const trip = row.original;
        const isCurrentlyActive = trip.status === "ACTIVE";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/trips/edit/$id"
                  params={{ id: trip.id.toString() }}
                  className="flex w-full items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusToggle(trip)}
                disabled={isPending}
                className={isCurrentlyActive ? "text-yellow-700" : "text-green-700"}
              >
                {isCurrentlyActive ? (
                  <>
                    <Archive className="mr-2 h-4 w-4" />
                    Set as Archive
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Set as Active
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(trip.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

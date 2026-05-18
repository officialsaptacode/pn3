import { Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export type Booking = {
  id: number;
  customerName: string;
  customerEmail: string;
  trip: {
    title: string;
    price: string;
  };
  numberOfPeople: number;
  bookingStatus: string;
  createdAt: string;
};

interface BookingsTableProps {
  data: Booking[];
}

export function BookingsTable({ data }: BookingsTableProps) {
  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.customerName}</div>
          <div className="text-xs text-muted-foreground">{row.original.customerEmail}</div>
        </div>
      ),
    },
    {
      accessorKey: "trip.title",
      header: "Trip",
    },
    {
      accessorKey: "numberOfPeople",
      header: "Pax",
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const price = parseFloat(row.original.trip.price || "0");
        const total = price * row.original.numberOfPeople;
        return new Intl.NumberFormat("en-NP", {
          style: "currency",
          currency: "NPR",
        }).format(total);
      },
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("bookingStatus")} />,
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" asChild>
          <Link
            to="/bookings/$id"
            params={{ id: row.original.id.toString() }}
            className="flex items-center"
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

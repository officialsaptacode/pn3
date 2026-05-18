import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { inquiryService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { SearchFilter } from "@/components/search-filter";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/inquiries/")({
  component: InquiriesPage,
});

function InquiriesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: inquiries, isLoading: _isLoading } = useQuery({
    queryKey: ["inquiries", { status: statusFilter }],
    queryFn: () =>
      inquiryService.findAll({
        status: statusFilter === "ALL" ? undefined : statusFilter || undefined,
      }),
  });

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "customerEmail",
      header: "Email",
    },
    {
      accessorKey: "customerPhone",
      header: "Phone",
    },
    {
      accessorKey: "trip.title",
      header: "Trip",
    },
    {
      accessorKey: "numberOfPeople",
      header: "People",
    },
    {
      accessorKey: "preferredDate",
      header: "Preferred Date",
      cell: ({ row }: any) =>
        row.original.preferredDate
          ? format(new Date(row.original.preferredDate), "MMM dd, yyyy")
          : "N/A",
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
        <Button variant="outline" size="sm" asChild>
          <Link to="/inquiries/$id" params={{ id: String(row.original.id) }}>
            View Details
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inquiry Management</h2>
      </div>

      <SearchFilter
        value={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: "All", value: "ALL" },
          { label: "Active", value: "ACTIVE" },
          { label: "Archived", value: "ARCHIVE" },
        ]}
        filterPlaceholder="Filter by status"
      />

      <DataTable columns={columns} data={inquiries?.data || []} />
    </div>
  );
}

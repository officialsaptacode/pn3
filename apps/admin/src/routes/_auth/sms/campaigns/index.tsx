import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { smsService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { SearchFilter } from "@/components/search-filter";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/sms/campaigns/")({
  component: SmsCampaignsPage,
});

function progress(done: number, total: number): string {
  if (!total) return "—";
  return `${done}/${total} (${Math.round((done / total) * 100)}%)`;
}

function SmsCampaignsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["sms-campaigns", { status: statusFilter }],
    queryFn: () =>
      smsService.listCampaigns({
        status: statusFilter === "ALL" ? undefined : statusFilter || undefined,
      }),
  });

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Campaign" },
    {
      accessorKey: "template.name",
      header: "Template",
      cell: ({ row }: any) => row.original.template?.name ?? "—",
    },
    {
      accessorKey: "user.email",
      header: "Owner",
      cell: ({ row }: any) => row.original.user?.email ?? "—",
    },
    {
      id: "progress",
      header: "Progress",
      cell: ({ row }: any) => progress(row.original.processedRows, row.original.totalRows),
    },
    {
      accessorKey: "failedRows",
      header: "Failed",
    },
    {
      accessorKey: "createdAt",
      header: "Launched",
      cell: ({ row }: any) =>
        row.original.createdAt ? format(new Date(row.original.createdAt), "MMM dd, yyyy") : "N/A",
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
          <Link to="/sms/campaigns/$id" params={{ id: String(row.original.id) }}>
            View Details
          </Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">SMS Campaigns</h2>
      </div>

      <SearchFilter
        value={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { label: "All", value: "ALL" },
          { label: "Queued", value: "QUEUED" },
          { label: "Sending", value: "SENDING" },
          { label: "Completed", value: "COMPLETED" },
          { label: "Failed", value: "FAILED" },
        ]}
        filterPlaceholder="Filter by status"
      />

      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
}

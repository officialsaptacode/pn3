import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { smsService } from "@workspace/api-client";
import { format } from "date-fns";
import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { SearchFilter } from "@/components/search-filter";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/sms/templates/")({
  component: SmsTemplatesPage,
});

function approvalLabel(approved: boolean, score: number | null): string {
  if (approved) return "APPROVED";
  return score == null ? "UNCHECKED" : "BLOCKED";
}

function SmsTemplatesPage() {
  const [approvalFilter, setApprovalFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["sms-templates", { approved: approvalFilter, search }],
    queryFn: () =>
      smsService.listTemplates({
        approved:
          approvalFilter === "ALL" || !approvalFilter ? undefined : approvalFilter === "true",
        search: search || undefined,
      }),
  });

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Name" },
    {
      id: "content",
      header: "Content",
      cell: ({ row }: any) => (
        <span className="block max-w-md truncate font-mono text-xs">{row.original.content}</span>
      ),
    },
    {
      accessorKey: "layaScore",
      header: "Laya",
      cell: ({ row }: any) =>
        row.original.layaScore == null ? "—" : Number(row.original.layaScore).toFixed(2),
    },
    {
      accessorKey: "user.email",
      header: "Owner",
      cell: ({ row }: any) => row.original.user?.email ?? "—",
    },
    {
      id: "campaigns",
      header: "Used in",
      cell: ({ row }: any) => `${row.original._count?.campaigns ?? 0}x`,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }: any) =>
        row.original.createdAt ? format(new Date(row.original.createdAt), "MMM dd, yyyy") : "N/A",
    },
    {
      id: "approval",
      header: "Approval",
      cell: ({ row }: any) => (
        <StatusBadge status={approvalLabel(row.original.isApproved, row.original.layaScore)} />
      ),
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">SMS Templates</h2>
      </div>

      <SearchFilter
        value={approvalFilter}
        onSearchChange={setSearch}
        searchPlaceholder="Search name or wording..."
        onFilterChange={setApprovalFilter}
        filterOptions={[
          { label: "All", value: "ALL" },
          { label: "Approved", value: "true" },
          { label: "Blocked", value: "false" },
        ]}
        filterPlaceholder="Filter by approval"
      />

      <DataTable columns={columns} data={data?.data || []} />
    </div>
  );
}

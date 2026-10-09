import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { smsService } from "@workspace/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { format } from "date-fns";
import { DataTable } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/sms/campaigns/$id")({
  component: SmsCampaignDetailPage,
  loader: ({ params }) => smsService.getCampaign(params.id),
});

function SmsCampaignDetailPage() {
  const { id } = Route.useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["sms-campaign", id],
    queryFn: () => smsService.getCampaign(id),
  });

  if (isLoading) {
    return <div className="p-8">Loading campaign...</div>;
  }

  if (!data?.data) {
    return <div className="p-8">Campaign not found</div>;
  }

  const campaign = data.data;
  const done = campaign.processedRows;
  const total = campaign.totalRows || 1;
  const pct = Math.round((done / total) * 100);

  const failedColumns = [
    { accessorKey: "id", header: "Job ID" },
    { accessorKey: "phoneNumber", header: "Phone" },
    {
      accessorKey: "error",
      header: "Error",
      cell: ({ row }: any) => (
        <span className="text-sm text-destructive">{row.original.error || "Unknown"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "At",
      cell: ({ row }: any) =>
        row.original.createdAt ? format(new Date(row.original.createdAt), "MMM dd, HH:mm") : "N/A",
    },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Campaign #{campaign.id}</h2>
        <StatusBadge status={campaign.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-2">{campaign.name}</div>
              <div className="font-medium">Owner:</div>
              <div className="col-span-2">{campaign.user?.email || "N/A"}</div>
              <div className="font-medium">Launched:</div>
              <div className="col-span-2">
                {campaign.createdAt
                  ? format(new Date(campaign.createdAt), "MMM dd, yyyy HH:mm")
                  : "N/A"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-2">{campaign.template?.name || "N/A"}</div>
              <div className="font-medium">Approved:</div>
              <div className="col-span-2">{campaign.template?.isApproved ? "Yes" : "No"}</div>
            </div>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap font-mono pt-2">
              {campaign.template?.content}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Progress:</div>
              <div className="col-span-2">
                {campaign.processedRows}/{campaign.totalRows} ({pct}%)
              </div>
              <div className="font-medium">Failed:</div>
              <div className="col-span-2">{campaign.failedRows}</div>
            </div>
            <div className="pt-2 space-y-1">
              {(data.statusBreakdown || []).map((s: any) => (
                <div key={s.status} className="flex items-center justify-between text-sm">
                  <StatusBadge status={s.status} />
                  <span className="font-mono">{s._count.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent failures (latest 20)</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={failedColumns} data={data.failedJobs || []} />
        </CardContent>
      </Card>
    </div>
  );
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { inquiryService } from "@workspace/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "sonner";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/_auth/inquiries/$id")({
  component: InquiryDetailPage,
  loader: ({ params }) => inquiryService.findOne(Number(params.id)),
});

function InquiryDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: inquiry, isLoading } = useQuery({
    queryKey: ["inquiry", id],
    queryFn: () => inquiryService.findOne(Number(id)),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => inquiryService.updateStatus(Number(id), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiry", id] });
      toast.success("Inquiry status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) {
    return <div className="p-8">Loading inquiry...</div>;
  }

  if (!inquiry) {
    return <div className="p-8">Inquiry not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inquiry #{inquiry.id}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-2">{inquiry.customerName}</div>
              <div className="font-medium">Email:</div>
              <div className="col-span-2">{inquiry.customerEmail}</div>
              <div className="font-medium">Phone:</div>
              <div className="col-span-2">{inquiry.customerPhone || "N/A"}</div>
              <div className="font-medium">Country:</div>
              <div className="col-span-2">{inquiry.customerCountry || "N/A"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inquiry Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Trip:</div>
              <div className="col-span-2">{inquiry.trip?.title || "N/A"}</div>
              <div className="font-medium">Pax:</div>
              <div className="col-span-2">{inquiry.numberOfPeople}</div>
              <div className="font-medium">Date:</div>
              <div className="col-span-2">
                {inquiry.preferredDate
                  ? new Date(inquiry.preferredDate).toLocaleDateString()
                  : "Flexible"}
              </div>
              <div className="font-medium">Status:</div>
              <div className="col-span-2 flex items-center gap-2">
                <StatusBadge status={inquiry.status} />
                <Select
                  defaultValue={inquiry.status}
                  onValueChange={(val) => updateStatusMutation.mutate({ status: val })}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="ARCHIVE">Archive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {inquiry.message && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{inquiry.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

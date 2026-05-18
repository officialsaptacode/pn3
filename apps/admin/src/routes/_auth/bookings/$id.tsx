import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { bookingService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
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

export const Route = createFileRoute("/_auth/bookings/$id")({
  component: BookingDetailPage,
  loader: ({ params }) => bookingService.findOne(Number(params.id)),
});

function BookingDetailPage() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: booking, isLoading: _isLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.findOne(Number(id)),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: string }) => bookingService.updateStatus(Number(id), status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      toast.success("Booking status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const confirmMutation = useMutation({
    mutationFn: () => bookingService.confirm(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      toast.success("Booking confirmed");
    },
    onError: () => toast.error("Failed to confirm booking"),
  });

  if (_isLoading) {
    return <div className="p-8">Loading booking...</div>;
  }

  if (!booking) {
    return <div className="p-8">Booking not found</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Booking #{booking.id}</h2>
        <div className="flex items-center space-x-2">
          {booking.bookingStatus === "NEW" && (
            <Button onClick={() => confirmMutation.mutate()}>Confirm Booking</Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-2">{booking.customerName}</div>
              <div className="font-medium">Email:</div>
              <div className="col-span-2">{booking.customerEmail}</div>
              <div className="font-medium">Phone:</div>
              <div className="col-span-2">{booking.customerPhone}</div>
              <div className="font-medium">Country:</div>
              <div className="col-span-2">{booking.customerCountry || "N/A"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Trip:</div>
              <div className="col-span-2">{booking.trip.title}</div>
              <div className="font-medium">Pax:</div>
              <div className="col-span-2">{booking.numberOfPeople}</div>
              <div className="font-medium">Date:</div>
              <div className="col-span-2">
                {booking.preferredDate
                  ? new Date(booking.preferredDate).toLocaleDateString()
                  : "Flexible"}
              </div>
              <div className="font-medium">Status:</div>
              <div className="col-span-2 flex items-center gap-2">
                <StatusBadge status={booking.bookingStatus} />
                <Select
                  defaultValue={booking.bookingStatus}
                  onValueChange={(val) => updateStatusMutation.mutate({ status: val })}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEW">New</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {booking.message && (
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{booking.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { StatusBadge } from "@/components/status-badge";

interface RecentBookingsProps {
  bookings: any[];
}

export function RecentBookings({ bookings }: RecentBookingsProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Trip</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.customerName}
                <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
              </TableCell>
              <TableCell>{booking.trip.title}</TableCell>
              <TableCell>
                <StatusBadge status={booking.bookingStatus} />
              </TableCell>
              <TableCell className="text-right">
                {new Date(booking.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

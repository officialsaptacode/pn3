import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { formatDistanceToNow } from "date-fns";

interface Inquiry {
  id: number;
  customerName: string;
  customerEmail: string;
  trip: {
    title: string;
  };
  message?: string;
  createdAt: string;
}

interface RecentInquiriesProps {
  inquiries: Inquiry[];
}

export function RecentInquiries({ inquiries }: RecentInquiriesProps) {
  return (
    <div className="space-y-8">
      {inquiries?.map((inquiry) => (
        <div key={inquiry.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{inquiry.customerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{inquiry.customerName}</p>
            <div className="flex flex-col text-sm text-muted-foreground gap-0.5">
              <span>Interested in: {inquiry.trip.title}</span>
              <span className="text-xs">
                {formatDistanceToNow(new Date(inquiry.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
          <div className="ml-auto font-medium text-xs text-muted-foreground">
            {/* Actions or Status could go here */}
          </div>
        </div>
      ))}
      {(!inquiries || inquiries.length === 0) && (
        <div className="text-center text-sm text-muted-foreground py-4">No recent inquiries.</div>
      )}
    </div>
  );
}

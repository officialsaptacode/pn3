import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { subscriberService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { format } from "date-fns";
import { Mail, RefreshCw } from "lucide-react";
import { useState } from "react";
import { SendNewsletterDialog } from "./-components/send-newsletter-dialog";

export const Route = createFileRoute("/_auth/newsletter/")({
  component: NewsletterPage,
});

function NewsletterPage() {
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);

  const {
    data: subscribers,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => subscriberService.findAll(),
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Newsletter</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={() => setIsSendDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Newsletter
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  Loading subscribers...
                </TableCell>
              </TableRow>
            ) : subscribers?.data?.length ? (
              subscribers.data.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>{sub.email}</TableCell>
                  <TableCell>{format(new Date(sub.createdAt), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {sub.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SendNewsletterDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen} />
    </div>
  );
}

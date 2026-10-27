import { useMutation, useQueryClient } from "@tanstack/react-query";
import { smsService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { CalendarClock, Play, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CampaignActionsProps {
  campaignId: number;
  campaignName: string;
  sendAt: string | null;
  failedCount: number;
  status: string;
}

function toLocalInputValue(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function CampaignActions({
  campaignId,
  campaignName,
  sendAt,
  failedCount,
  status,
}: CampaignActionsProps) {
  const queryClient = useQueryClient();
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduledFor, setScheduledFor] = useState(toLocalInputValue(sendAt));
  const isScheduled = status === "SCHEDULED";

  const invalidate = () =>
    queryClient
      .invalidateQueries({ queryKey: ["sms-campaign", String(campaignId)] })
      .then(() => queryClient.invalidateQueries({ queryKey: ["sms-campaigns"] }));

  const scheduleMutation = useMutation({
    mutationFn: (body: { sendAt?: string; name?: string }) =>
      smsService.scheduleCampaign(campaignId, body),
    onSuccess: async () => {
      toast.success("Campaign scheduled");
      setIsScheduleOpen(false);
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to schedule campaign"),
  });

  const sendNowMutation = useMutation({
    mutationFn: () => smsService.scheduleCampaign(campaignId, { name: campaignName }),
    onSuccess: async () => {
      toast.success("Campaign queued for immediate delivery");
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to send campaign"),
  });

  const retryMutation = useMutation({
    mutationFn: () => smsService.retryFailedJobs(campaignId),
    onSuccess: async (result) => {
      toast.success(
        result.retried > 0
          ? `Re-queued ${result.retried} failed job(s)`
          : "No failed jobs to retry",
      );
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to retry failed jobs"),
  });

  const handleSchedule = () => {
    if (!scheduledFor) {
      toast.error("Pick a send date and time");
      return;
    }
    const iso = new Date(scheduledFor).toISOString();
    scheduleMutation.mutate({ sendAt: iso, name: campaignName });
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => setIsScheduleOpen(true)}>
        <CalendarClock className="mr-2 h-4 w-4" />
        {sendAt ? "Reschedule" : "Schedule"}
      </Button>

      {isScheduled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => sendNowMutation.mutate()}
          disabled={sendNowMutation.isPending}
          title="Send this campaign immediately instead of waiting for its scheduled time"
        >
          <Play className={`mr-2 h-4 w-4 ${sendNowMutation.isPending ? "animate-pulse" : ""}`} />
          Send now
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => retryMutation.mutate()}
        disabled={retryMutation.isPending || failedCount === 0}
        title={failedCount === 0 ? "No failed jobs to retry" : "Retry failed deliveries"}
      >
        <RotateCcw className={`mr-2 h-4 w-4 ${retryMutation.isPending ? "animate-spin" : ""}`} />
        Retry failed{failedCount > 0 ? ` (${failedCount})` : ""}
      </Button>

      <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Schedule campaign</DialogTitle>
            <DialogDescription>
              Pick when this campaign should be sent. The value is stored in UTC.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="send-at">Send at</Label>
              <Input
                id="send-at"
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={scheduleMutation.isPending}>
              {scheduleMutation.isPending ? "Saving..." : "Save schedule"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

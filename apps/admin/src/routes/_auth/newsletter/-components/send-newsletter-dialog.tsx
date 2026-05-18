import { subscriberService } from "@workspace/api-client";
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
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface SendNewsletterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendNewsletterDialog({ open, onOpenChange }: SendNewsletterDialogProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !message) {
      toast.error("Subject and message are required");
      return;
    }

    setIsSending(true);
    try {
      await subscriberService.sendNewsletter({ subject, message });
      toast.success("Newsletter sent successfully");
      onOpenChange(false);
      setSubject("");
      setMessage("");
    } catch (_error) {
      toast.error("Failed to dry-run or send newsletter");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Newsletter</DialogTitle>
          <DialogDescription>
            Compose your newsletter. It will be sent to all active subscribers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter Subject"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (HTML supported)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="<p>Hello Subscribers...</p>"
              className="h-40"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? "Sending..." : "Send Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

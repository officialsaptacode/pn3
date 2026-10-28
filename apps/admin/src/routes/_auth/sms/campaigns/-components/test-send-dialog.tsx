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
import { Textarea } from "@workspace/ui/components/textarea";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TestSendDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TestSendDialog({ open, onOpenChange }: TestSendDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("+9779841000001");
  const [message, setMessage] = useState(
    "Dear {name}, your payment of Rs. {amount} was due on {due_date}. Pay via eSewa to avoid penalty.",
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!phoneNumber.trim() || !message.trim()) {
      toast.error("Phone number and message are required");
      return;
    }

    const payload = { phoneNumber: phoneNumber.trim(), message: message.trim() };
    console.log("[SMS TEST SEND] request", payload);

    setSending(true);
    try {
      const result = await smsService.testSend(payload);
      console.log(`[SMS TEST SEND] ${result.success ? "SUCCESS" : "FAILED"}`, result);
      if (result.blocked) {
        toast.warning(`Blocked as spam (score ${result.score})`);
      } else if (result.success) {
        toast.success("Test message sent");
      } else {
        toast.error(result.error ?? "Test send failed");
      }
    } catch (e) {
      console.log("[SMS TEST SEND] FAILED", e);
      toast.error(e instanceof Error ? e.message : "Test send failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Test send</DialogTitle>
          <DialogDescription>
            Temporary test API. The message is spam-checked with Cloudflare CLEF and only delivered
            when it passes. Request and response are logged to the browser console.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="test-phone">Phone number</Label>
            <Input
              id="test-phone"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+9779841000001"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="test-message">Message</Label>
            <Textarea
              id="test-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="h-32 font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              {message.length} characters ·{" "}
              {message.length > 160 ? "will split into multiple SMS segments" : "single segment"}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSend} disabled={sending}>
            <Send className="h-4 w-4" />
            {sending ? "Sending..." : "Send test message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

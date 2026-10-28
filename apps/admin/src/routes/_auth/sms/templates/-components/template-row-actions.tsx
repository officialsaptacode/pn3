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
import { Textarea } from "@workspace/ui/components/textarea";
import { Check, Pencil, RefreshCw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TemplateRowActionsProps {
  template: {
    id: number;
    name: string;
    content: string;
    isApproved: boolean;
  };
}

export function TemplateRowActions({ template }: TemplateRowActionsProps) {
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(template.name);
  const [content, setContent] = useState(template.content);

  useEffect(() => {
    setName(template.name);
    setContent(template.content);
  }, [template.name, template.content]);

  const invalidate = () =>
    queryClient
      .invalidateQueries({ queryKey: ["sms-templates"] })
      .then(() => queryClient.invalidateQueries({ queryKey: ["sms-overview"] }));

  const updateMutation = useMutation({
    mutationFn: (body: { name?: string; content?: string; isApproved?: boolean }) =>
      smsService.updateTemplate(template.id, body),
    onSuccess: async (result) => {
      if (result.complianceInvalidated) {
        toast.warning(
          "Content changed — compliance score cleared, re-evaluate to restore approval",
        );
      } else {
        toast.success("Template updated");
      }
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Failed to update template"),
  });

  const evaluateMutation = useMutation({
    mutationFn: () => smsService.evaluateTemplate(template.id),
    onSuccess: async (result) => {
      toast.success(
        result.isApproved
          ? `Compliance check passed (score ${Number(result.spamScore).toFixed(2)})`
          : `Compliance check failed (score ${Number(result.spamScore).toFixed(2)})`,
      );
      await invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Compliance check failed"),
  });

  const handleSave = () => {
    if (!name.trim() || !content.trim()) {
      toast.error("Name and content are required");
      return;
    }
    updateMutation.mutate({ name: name.trim(), content: content.trim() });
    setIsEditOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditOpen(true)}
        title="Edit template"
        aria-label="Edit template"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => evaluateMutation.mutate()}
        disabled={evaluateMutation.isPending}
        title="Run compliance check"
        aria-label="Run compliance check"
      >
        <RefreshCw className={`h-4 w-4 ${evaluateMutation.isPending ? "animate-spin" : ""}`} />
      </Button>

      {template.isApproved ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateMutation.mutate({ isApproved: false })}
          disabled={updateMutation.isPending}
          title="Reject template"
          aria-label="Reject template"
          className="text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateMutation.mutate({ isApproved: true })}
          disabled={updateMutation.isPending}
          title="Approve template"
          aria-label="Approve template"
          className="text-green-600"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit template</DialogTitle>
            <DialogDescription>
              Changing the wording clears the compliance score and blocks the template until it is
              re-checked.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="template-name">Name</Label>
              <Input
                id="template-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Overdue Payment Notice"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="template-content">Content</Label>
              <Textarea
                id="template-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Dear {name}, your payment of {amount} is due on {date}."
                className="h-32 font-mono text-xs"
              />
              <p className="text-xs text-muted-foreground">
                {content.length} characters ·{" "}
                {content.length > 160 ? "will split into multiple SMS segments" : "single segment"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

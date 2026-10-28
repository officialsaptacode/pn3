import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { smsService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sms/templates/create")({
  component: CreateTemplatePage,
});

function CreateTemplatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!name.trim() || !content.trim()) {
      toast.error("Name and content are required");
      return;
    }
    setSaving(true);
    try {
      await smsService.createTemplate({ name: name.trim(), content: content.trim() });
      toast.success("Template created successfully");
      navigate({ to: "/sms/templates" });
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Template</h2>
      <form
        className="mx-auto max-w-2xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="template-name">Name</Label>
          <Input
            id="template-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Overdue Payment Notice"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="template-content">Content (SMS text)</Label>
          <Textarea
            id="template-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Dear {name}, your payment of {amount} is due on {date}."
            className="h-40 font-mono text-xs"
            required
          />
          <p className="text-xs text-muted-foreground">
            {content.length} characters ·{" "}
            {content.length > 160 ? "will split into multiple SMS segments" : "single segment"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Template"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/sms/templates" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

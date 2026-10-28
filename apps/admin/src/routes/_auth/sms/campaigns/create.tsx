import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { smsService } from "@workspace/api-client";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_auth/sms/campaigns/create")({
  component: CreateCampaignPage,
});

function CreateCampaignPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [csvText, setCsvText] = useState("");
  const [sendAt, setSendAt] = useState("");
  const [saving, setSaving] = useState(false);

  // Only approved templates can back a campaign (server enforces this too).
  const { data: templates } = useQuery({
    queryKey: ["sms-templates", { approved: "true" }],
    queryFn: () => smsService.listTemplates({ approved: "true" }),
  });

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setCsvText(await file.text());
    // The inline copy wins, so clear any stale URL.
    setCsvUrl("");
  };

  const handleCreate = async () => {
    if (!name.trim() || !templateId) {
      toast.error("Name and template are required");
      return;
    }
    if (!csvUrl.trim() && !csvText.trim()) {
      toast.error("Upload a CSV file or provide a CSV URL");
      return;
    }
    setSaving(true);
    try {
      await smsService.createCampaign(buildPayload());
      toast.success("Campaign created successfully");
      navigate({ to: "/sms/campaigns" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const buildPayload = () => ({
    name: name.trim(),
    templateId: Number(templateId),
    ...(csvUrl.trim() ? { csvUrl: csvUrl.trim() } : {}),
    ...(csvText.trim() ? { csvText } : {}),
    ...(sendAt ? { sendAt: new Date(sendAt).toISOString() } : {}),
  });

  const approvedTemplates = templates?.data ?? [];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Create Campaign</h2>
      <form
        className="mx-auto max-w-2xl space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="campaign-name">Campaign name</Label>
          <Input
            id="campaign-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="March overdue reminders"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="campaign-template">Template</Label>
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger id="campaign-template">
              <SelectValue placeholder="Select an approved template" />
            </SelectTrigger>
            <SelectContent>
              {approvedTemplates.length === 0 ? (
                <SelectItem value="none" disabled>
                  No approved templates — run a compliance check first
                </SelectItem>
              ) : (
                approvedTemplates.map((template) => (
                  <SelectItem key={template.id} value={String(template.id)}>
                    {template.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Only templates that passed the CLEF spam check can be used.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="campaign-csv-file">CSV file</Label>
          <Input
            id="campaign-csv-file"
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <p className="text-xs text-muted-foreground">
            The CSV must have a phone column (phone / phoneNumber / mobile).
          </p>
          {csvText ? (
            <p className="text-xs text-muted-foreground">
              Loaded {csvText.length} characters of CSV.
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="campaign-csv">CSV URL</Label>
          <Input
            id="campaign-csv"
            value={csvUrl}
            onChange={(e) => {
              setCsvUrl(e.target.value);
              if (e.target.value) setCsvText("");
            }}
            placeholder="https://s3.amazonaws.com/bucket/contacts.csv"
          />
          <p className="text-xs text-muted-foreground">
            A file upload takes precedence over a URL. If the URL cannot be read, the campaign is
            saved as a draft and can be sent later.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="campaign-send-at">Send at (optional)</Label>
          <Input
            id="campaign-send-at"
            type="datetime-local"
            value={sendAt}
            onChange={(e) => setSendAt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Leave empty to send immediately.</p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving || approvedTemplates.length === 0}>
            {saving ? "Creating..." : "Create Campaign"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/sms/campaigns" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

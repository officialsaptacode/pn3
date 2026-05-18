import { useNavigate } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Loader2 } from "lucide-react";

interface SubmitSectionProps {
  onSubmit: (action: "submit" | "exit") => void;
  redirectUrl: string;
  isUpdate: boolean;
  isLoading: boolean;
  submitText?: string;
  cancelText?: string;
}

export function SubmitSection({
  onSubmit,
  redirectUrl,
  isUpdate,
  isLoading,
  submitText = "Save",
  cancelText = "Cancel",
}: SubmitSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 mt-4">
      <Button type="button" variant="outline" onClick={() => navigate({ to: redirectUrl as any })}>
        {cancelText}
      </Button>
      <div className="flex-1" />
      <Button
        type="button"
        variant="secondary"
        onClick={() => onSubmit("exit")}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Save & Exit
      </Button>
      <Button type="button" onClick={() => onSubmit("submit")} disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {isUpdate ? "Update" : submitText}
      </Button>
    </div>
  );
}

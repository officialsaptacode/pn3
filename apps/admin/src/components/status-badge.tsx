import { Badge } from "@workspace/ui/components/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (status) {
    case "ACTIVE":
    case "CONFIRMED":
    case "PUBLISHED":
      variant = "default"; // Usually primary color (greenish or brand)
      break;
    case "DRAFT":
    case "NEW":
    case "CONTACTED":
      variant = "secondary"; // Usually gray or blueish
      break;
    case "ARCHIVE":
    case "CANCELLED":
    case "DELETED":
      variant = "destructive"; // Red
      break;
    case "COMPLETED":
      variant = "outline";
      break;
    default:
      variant = "outline";
  }

  return <Badge variant={variant}>{status}</Badge>;
}

import { createFileRoute } from "@tanstack/react-router";
import { DestinationForm } from "./-components/destination-form";

export const Route = createFileRoute("/_auth/destinations/create" as any)({
  validateSearch: (search: Record<string, unknown>) => ({
    parentId: search.parentId ? Number(search.parentId) : undefined,
  }),
  component: CreateDestinationPage,
});

function CreateDestinationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DestinationForm />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { destinationService } from "@workspace/api-client";
import { DestinationForm } from "../-components/destination-form";

export const Route = createFileRoute("/_auth/destinations/edit/$id")({
  component: EditDestinationPage,
});

function EditDestinationPage() {
  const { id } = Route.useParams();
  const { data: destination, isLoading: _isLoading } = useQuery({
    queryKey: ["destination", id],
    queryFn: () => destinationService.findOne(Number(id)),
  });

  if (_isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DestinationForm initialData={destination} />
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { departureService } from "@workspace/api-client";
import { DepartureForm } from "../-components/departure-form";

export const Route = createFileRoute("/_auth/departures/edit/$id")({
  component: EditDeparturePage,
});

function EditDeparturePage() {
  const { id } = Route.useParams();

  const { data: departure, isLoading: _isLoading } = useQuery({
    queryKey: ["departures", id],
    queryFn: () => departureService.findOne(Number(id)),
  });

  if (_isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Departure</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <DepartureForm initialData={departure} />
      </div>
    </div>
  );
}

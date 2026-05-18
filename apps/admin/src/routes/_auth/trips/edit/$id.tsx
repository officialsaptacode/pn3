import { createFileRoute } from "@tanstack/react-router";
import { useTrip } from "@/features/trips/api/use-trips";
import { TripForm } from "../-components/trip-form";

export const Route = createFileRoute("/_auth/trips/edit/$id")({
  component: EditTripPage,
});

function EditTripPage() {
  const { id } = Route.useParams();
  const { data: trip, isLoading, error } = useTrip(Number(id));

  if (isLoading) {
    return <div className="p-8">Loading trip details...</div>;
  }

  if (error || !trip) {
    return <div className="p-8 text-destructive">Failed to load trip or trip not found.</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Trip: {trip.title}</h2>
      </div>
      <div className="mx-auto max-w-6xl">
        <TripForm initialData={trip} />
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { TripForm } from "./-components/trip-form";

export const Route = createFileRoute("/_auth/trips/create")({
  component: CreateTripPage,
});

function CreateTripPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Trip</h2>
      </div>
      <div className="mx-auto max-w-6xl">
        <TripForm />
      </div>
    </div>
  );
}

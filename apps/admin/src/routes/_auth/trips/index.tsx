import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { SearchFilter } from "@/components/search-filter";
import { useTrips } from "@/features/trips/api/use-trips";
import { TripsTable } from "./-components/trips-table";

export const Route = createFileRoute("/_auth/trips/")({
  component: TripsPage,
});

function TripsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 500);
  const [_status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = useTrips({
    search: debouncedSearch,
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Trips</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link to="/trips/create" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Trip
            </Link>
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        <SearchFilter
          onSearchChange={setSearch}
          onFilterChange={setStatus}
          filterOptions={[
            { label: "All", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Archive", value: "ARCHIVE" },
          ]}
          filterPlaceholder="Status"
        />
        {isLoading ? <div>Loading...</div> : <TripsTable data={data?.data || []} />}
      </div>
    </div>
  );
}

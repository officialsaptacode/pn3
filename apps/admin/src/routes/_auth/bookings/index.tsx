import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { bookingService } from "@workspace/api-client";
import { useState } from "react";
import { SearchFilter } from "@/components/search-filter";
import { BookingsTable } from "./-components/bookings-table";

export const Route = createFileRoute("/_auth/bookings/")({
  component: BookingsPage,
});

function BookingsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>();

  const { data } = useQuery({
    queryKey: ["bookings", search, status],
    queryFn: () =>
      bookingService.findAll({ search, bookingStatus: status === "ALL" ? undefined : status }),
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
      </div>
      <div className="space-y-4">
        <SearchFilter
          onSearchChange={setSearch}
          onFilterChange={setStatus}
          filterOptions={[
            { label: "All", value: "ALL" },
            { label: "New", value: "NEW" },
            { label: "Confirmed", value: "CONFIRMED" },
            { label: "Cancelled", value: "CANCELLED" },
            { label: "Completed", value: "COMPLETED" },
          ]}
          filterPlaceholder="Status"
        />
        {data?.data && <BookingsTable data={data.data} />}
      </div>
    </div>
  );
}

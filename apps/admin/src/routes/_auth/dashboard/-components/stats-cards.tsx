import { Calendar, DollarSign, Map as MapIcon, Users } from "lucide-react";
import { StatsCard } from "@/components/stats-card";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  activeTrips: number;
}

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={`NPR ${(stats?.totalRevenue ?? 0).toLocaleString()}`}
        icon={DollarSign}
        description="Total revenue from confirmed bookings"
      />
      <StatsCard
        title="Bookings"
        value={stats.totalBookings}
        icon={Calendar}
        description="Total bookings received"
      />
      <StatsCard
        title="Active Trips"
        value={stats.activeTrips}
        icon={MapIcon}
        description="Currently active trips"
      />
      <StatsCard
        title="Users"
        value={stats.totalUsers}
        icon={Users}
        description="Total registered users"
      />
    </div>
  );
}

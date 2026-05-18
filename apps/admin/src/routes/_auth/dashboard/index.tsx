import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { dashboardService } from "@workspace/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { OverviewChart } from "./-components/overview-chart";
import { RecentBookings } from "./-components/recent-bookings";
import { RecentInquiries } from "./-components/recent-inquiries";
import { StatsCards } from "./-components/stats-cards";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardService.getStats,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard", "activity"],
    queryFn: dashboardService.getRecentActivity,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard", "chart"],
    queryFn: dashboardService.getChartData,
  });

  if (statsLoading || activityLoading || chartLoading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {stats && <StatsCards stats={stats} />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Bookings over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartData && <OverviewChart data={chartData} />}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Inquiries</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            {activity?.recentInquiries && <RecentInquiries inquiries={activity.recentInquiries} />}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 lg:col-span-7">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Latest booking activity</CardDescription>
          </CardHeader>
          <CardContent>
            {activity?.recentBookings && <RecentBookings bookings={activity.recentBookings} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { AppSidebar } from "@workspace/ui/components/app-sidebar";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import type { DashboardLayoutProps } from "@/types";
import { Topbar } from "./topbar";

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 p-6 bg-muted/10">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

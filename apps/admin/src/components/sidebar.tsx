import { AppSidebar } from "@workspace/ui/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/sidebar";

export function Sidebar01() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="sm:hidden" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
}

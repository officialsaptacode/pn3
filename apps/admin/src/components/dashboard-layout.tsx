import { Outlet, useLocation } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb";
import { Separator } from "@workspace/ui/components/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { DashboardSidebar } from "./dashboard-sidebar";

export default function DashboardLayout() {
  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const pathSegments = pathname.split("/").filter((segment) => segment !== "");
  const _currentSegment = pathSegments[pathSegments.length - 1];

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                {pathSegments.map((segment, index) => {
                  const isLast = index === pathSegments.length - 1;
                  const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                  return (
                    <span key={href} className="contents">
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={href} className="capitalize hidden md:block">
                            {segment}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                    </span>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

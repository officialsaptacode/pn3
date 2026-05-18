import { createFileRoute } from "@tanstack/react-router";
import { NavbarBuilder } from "@/features/navbar/components/navbar-builder";

export const Route = createFileRoute("/_auth/settings/navbar")({
  component: NavbarBuilderPage,
});

function NavbarBuilderPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Navbar Builder</h2>
      </div>
      <NavbarBuilder />
    </div>
  );
}

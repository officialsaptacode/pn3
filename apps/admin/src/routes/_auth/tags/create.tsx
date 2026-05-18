import { createFileRoute } from "@tanstack/react-router";
import { TagForm } from "./-components/tag-form";

export const Route = createFileRoute("/_auth/tags/create")({
  component: CreateTagPage,
});

function CreateTagPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Tag</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <TagForm />
      </div>
    </div>
  );
}

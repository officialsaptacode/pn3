import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { tagService } from "@workspace/api-client";
import { TagForm } from "../-components/tag-form";

export const Route = createFileRoute("/_auth/tags/edit/$id")({
  component: EditTagPage,
});

function EditTagPage() {
  const { id } = Route.useParams();

  const { data: tag, isLoading: _isLoading } = useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagService.findOne(Number(id)),
  });

  if (_isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Tag</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <TagForm initialData={tag} />
      </div>
    </div>
  );
}

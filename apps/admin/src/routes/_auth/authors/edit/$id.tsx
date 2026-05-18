import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { authorService } from "@workspace/api-client";
import { AuthorForm } from "../-components/author-form";

export const Route = createFileRoute("/_auth/authors/edit/$id")({
  component: EditAuthorPage,
});

function EditAuthorPage() {
  const { id } = Route.useParams();

  const { data: author, isLoading: _isLoading } = useQuery({
    queryKey: ["authors", id],
    queryFn: () => authorService.findOne(Number(id)),
  });

  if (_isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Author</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <AuthorForm initialData={author} />
      </div>
    </div>
  );
}

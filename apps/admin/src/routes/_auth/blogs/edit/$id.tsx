import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { blogService } from "@workspace/api-client";
import { BlogForm } from "../-components/blog-form";

export const Route = createFileRoute("/_auth/blogs/edit/$id")({
  component: EditBlogPage,
  loader: ({ params }) => blogService.findOne(Number(params.id)),
});

function EditBlogPage() {
  const { id } = Route.useParams();
  const { data: blog, isLoading: _isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogService.findOne(Number(id)),
  });

  if (_isLoading) {
    return <div className="p-8">Loading post...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Blog Post</h2>
      </div>
      <div className="mx-auto max-w-4xl">{blog && <BlogForm initialData={blog} />}</div>
    </div>
  );
}

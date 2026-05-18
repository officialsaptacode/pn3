import { createFileRoute } from "@tanstack/react-router";
import { BlogForm } from "./-components/blog-form";

export const Route = createFileRoute("/_auth/blogs/create")({
  component: CreateBlogPage,
});

function CreateBlogPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Blog Post</h2>
      </div>
      <div className="mx-auto max-w-4xl">
        <BlogForm />
      </div>
    </div>
  );
}

import { blogService, destinationService, tripService } from "@workspace/api-client";
import type { MetadataRoute } from "next";
import { buildTripUrl } from "../lib/url-helpers";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://amazingadventure.com"; // Replace with actual domain

  // Static routes
  const routes = ["", "/about", "/contact", "/blogs", "/booking"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Dynamic routes: Trips with hierarchical URLs
  const treksRes = await tripService.getAll({ limit: 1000 }).catch(() => ({ data: [] }));
  const treks = treksRes.data || [];
  const trekRoutes = treks.map((trek: any) => ({
    url: `${baseUrl}${buildTripUrl(trek)}`,
    lastModified: new Date(trek.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Dynamic routes: Destinations
  const destinationsRes = await destinationService.findAll().catch(() => ({ data: [] }));
  const destinations = destinationsRes.data || [];
  const destinationRoutes = destinations.map((dest: any) => ({
    url: `${baseUrl}/destinations/${dest.slug}`,
    lastModified: new Date(dest.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Dynamic routes: Blogs
  const blogsRes = await blogService.findAll({ limit: 1000 }).catch(() => ({ data: [] }));
  const blogs = blogsRes.data || [];
  const blogRoutes = blogs.map((post: any) => ({
    url: `${baseUrl}/blogs/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...routes, ...trekRoutes, ...destinationRoutes, ...blogRoutes];
}

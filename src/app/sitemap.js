import { getAllProjectIds } from "@/lib/supabase";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default async function sitemap() {
  const projectIds = await getAllProjectIds().catch(() => []);

  const staticRoutes = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
  ];

  const projectRoutes = projectIds.map((id) => ({
    url: `${siteUrl}/projects/${id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}


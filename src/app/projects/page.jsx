import { getProjects } from "@/lib/supabase";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects",
  description:
    "A collection of full stack web projects built with Laravel, React, Next.js, and more. APIs, dashboards, and modern web applications.",
  openGraph: {
    title: "Projects — JaladeDev",
    description: "Full stack web projects: APIs, dashboards, and modern web applications.",
  },
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  // Extract unique stack tags for filter UI
  const allTags = [...new Set(projects.flatMap((p) => p.stack_tags || []))].sort();

  return (
    <div className="min-h-screen bg-ink-900 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
          All work
        </p>
        <h1 className="font-display text-5xl sm:text-6xl text-cream-100 mb-4">Projects</h1>
        <p className="text-cream-200/50 text-lg mb-12 max-w-lg">
          A collection of web apps, APIs, and full-stack systems I've built.
        </p>

        <ProjectsClient projects={projects} tags={allTags} />
      </div>
    </div>
  );
}

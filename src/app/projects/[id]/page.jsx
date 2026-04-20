import { getProject, getAllProjectIds } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  const ids = await getAllProjectIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }) {
  try {
    const project = await getProject(params.id);
    return {
      title: project.title,
      description: project.summary,
      openGraph: {
        title: `${project.title} — JaladeDev`,
        description: project.summary,
        images: project.image_url ? [{ url: project.image_url }] : [],
      },
    };
  } catch {
    return { title: "Project Not Found" };
  }
}

// JSON-LD for the project
function projectJsonLd(project) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.summary,
    applicationCategory: "WebApplication",
    url: project.website || undefined,
    author: {
      "@type": "Person",
      name: "Ayodeji Alalade",
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  let project;
  try {
    project = await getProject(params.id);
  } catch {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />

      <div className="min-h-screen bg-ink-900 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-sm text-cream-200/40
                       hover:text-electric-400 transition-colors mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            All Projects
          </Link>

          {/* Image */}
          {project.image_url && (
            <div className="relative h-64 sm:h-96 rounded-xl overflow-hidden mb-10 border border-ink-600">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            {project.stack && (
              <p className="font-mono text-sm text-electric-400 mb-3 tracking-wide">
                {project.stack}
              </p>
            )}
            <h1 className="font-display text-4xl sm:text-5xl text-cream-100 mb-4 leading-tight">
              {project.title}
            </h1>
            <p className="text-cream-200/60 text-lg leading-relaxed">{project.summary}</p>
          </div>

          {/* Links */}
          {(project.github || project.website) && (
            <div className="flex flex-wrap gap-3 mb-10">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-ink-500 px-5 py-2.5 rounded-lg
                             text-cream-100 hover:border-cream-200/40 transition-colors font-mono text-sm"
                >
                  <Github size={16} />
                  View on GitHub
                </a>
              )}
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-electric-500 hover:bg-electric-400 px-5 py-2.5
                             rounded-lg text-white transition-colors font-mono text-sm"
                >
                  <ExternalLink size={16} />
                  Live Site
                </a>
              )}
            </div>
          )}

          {/* Divider */}
          <hr className="border-ink-600 mb-10" />

          {/* Description */}
          {project.description && (
            <div className="prose prose-invert max-w-none">
              <p className="text-cream-200/70 leading-relaxed text-base whitespace-pre-line">
                {project.description}
              </p>
            </div>
          )}

          {/* Stack tags */}
          {project.stack_tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {project.stack_tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 border border-electric-400/20 text-electric-400/70 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { use } from "react";

export default function ProjectCard({ project, index = 0 }) {
  return (
    <article
      className="group relative bg-ink-700 border border-ink-600 rounded-xl overflow-hidden
                 hover:border-electric-400/50 transition-all duration-500
                 hover:shadow-[0_0_40px_rgba(79,158,255,0.1)]"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-ink-600">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink-600 to-ink-800">
            <span className="font-display text-4xl text-electric-400/20">
              {project.title?.[0] || "P"}
            </span>
          </div>
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-700/80 to-transparent" />

        {/* Index number */}
        <span className="absolute top-4 right-4 font-mono text-xs text-cream-200/40">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl text-cream-100 mb-2 group-hover:text-electric-400 transition-colors">
          {project.title}
        </h3>

        {project.stack && (
          <p className="font-mono text-xs text-electric-400/70 mb-3 tracking-wide">
            {project.stack}
          </p>
        )}

        <p className="text-cream-200/60 text-sm leading-relaxed mb-5 line-clamp-3">
          {project.summary}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-cream-200/40 hover:text-cream-100 transition-colors"
                aria-label="GitHub repository"
              >
                <Github size={18} />
              </a>
            )}
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-cream-200/40 hover:text-electric-400 transition-colors"
                aria-label="Live site"
              >
                <ExternalLink size={18} />
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.id}`}
            className="flex items-center gap-1.5 font-mono text-xs text-cream-200/40
                       hover:text-electric-400 transition-colors group/link"
          >
            View
            <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}

"use client";

import { useState, useMemo } from "react";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsClient({ projects, tags }) {
  const [activeTag, setActiveTag] = useState("All");

  const filtered = useMemo(() => {
    if (activeTag === "All") return projects;
    return projects.filter((p) => p.stack_tags?.includes(activeTag));
  }, [activeTag, projects]);

  return (
    <div>
      {/* Filter Pills */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {["All", ...tags].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`font-mono text-xs px-4 py-2 rounded-full border transition-all ${
                activeTag === tag
                  ? "border-electric-400 bg-electric-400/10 text-electric-400"
                  : "border-ink-600 text-cream-200/40 hover:border-cream-200/30 hover:text-cream-200/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="font-mono text-xs text-cream-200/30 mb-6 tracking-wide">
        {filtered.length} project{filtered.length !== 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-cream-200/30 font-mono text-sm">No projects found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

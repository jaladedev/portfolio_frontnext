import { getProjects, getSkills, getExperience } from "@/lib/supabase";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectCard from "@/components/ProjectCard";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600;

// ── ENV NAME SPLIT ─────────────────────────────────────
const fullName = process.env.NEXT_PUBLIC_OWNER_NAME || "Ayodeji Alalade";
const nameParts = fullName.trim().split(" ");
const firstName = nameParts[0] || "";
const lastName = nameParts.slice(1).join(" ") || "";

// ── ABOUT TEXT ────────────────────
const about = {
  intro:
    "I'm a full stack developer passionate about clean architecture and great user experiences.",
  focus:
    "My focus is on building reliable, maintainable systems — from database design to polished UIs.",
  availability:
    "Currently available for freelance projects and open to full-time opportunities.",
};

export default async function HomePage() {
  const [projects, skills, experience] = await Promise.all([
    getProjects({ limit: 3 }).catch(() => []),
    getSkills().catch(() => []),
    getExperience().catch(() => []),
  ]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <HeroSection />

      {/* ── About ──────────────────────────────────────────── */}
      <AboutSection firstName={firstName} lastName={lastName} about={about} />

      {/* ── Skills ─────────────────────────────────────────── */}
      <SkillsSection skills={skills} />

      {/* ── Experience ─────────────────────────────────────── */}
      {experience.length > 0 && (
        <ExperienceTimeline experience={experience} />
      )}

      {/* ── Projects ───────────────────────────────────────── */}
      <section id="projects" className="py-28 px-4 sm:px-6 lg:px-8 bg-ink-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
                03 / Work
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-cream-100">
                Featured Projects
              </h2>
            </div>

            <Link
              href="/projects"
              className="hidden sm:flex items-center gap-2 font-mono text-sm text-cream-200/60 hover:text-electric-400 transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {projects.length === 0 ? (
            <p className="text-cream-200/40 font-mono text-sm">
              No projects yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}

          <div className="mt-10 sm:hidden">
            <Link
              href="/projects"
              className="flex items-center gap-2 font-mono text-sm text-electric-400"
            >
              View all projects <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-28 px-4 text-center bg-ink-900 border-t border-ink-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(79,158,255,0.08)_0%,_transparent_70%)]" />

        <div className="relative max-w-2xl mx-auto">
          <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-6">
            04 / Contact
          </p>

          <h2 className="font-display text-4xl sm:text-5xl text-cream-100 mb-6">
            Let's build something<br />
            remarkable together.
          </h2>

          <p className="text-cream-200/60 text-lg mb-10 leading-relaxed">
            Need a website, API, or full-stack system? I'm available for
            freelance work and exciting collaborations.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-electric-500 hover:bg-electric-400 text-white
                       font-semibold px-8 py-4 rounded-lg transition-all duration-300
                       hover:shadow-[0_0_30px_rgba(79,158,255,0.4)] hover:scale-[1.02]"
          >
            Start a conversation
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

/* ── Small reusable component ─────────────────────────── */
function InfoCard(props) {
  const { label, value } = props;

  return (
    <div className="border border-ink-600 rounded-lg p-5 bg-ink-900/50">
      <p className="font-mono text-electric-400 text-sm mb-1">{label}</p>
      <p className="text-cream-100 font-semibold">{value}</p>
    </div>
  );
}
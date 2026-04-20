"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Code2, Server, Layers, Download } from "lucide-react";

const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME?.trim() || "Ayodeji Alalade";
const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL?.trim() || "";

// What I bring to the table — three pillars
const pillars = [
  {
    icon: Server,
    title: "Backend Architecture",
    body: "I design and build robust Laravel APIs — clean routing, eloquent models, queue jobs, and proper auth. Systems that scale without becoming maintenance nightmares.",
  },
  {
    icon: Code2,
    title: "Frontend Engineering",
    body: "From React components to full Next.js applications. I care about performance, accessibility, and the small details that make an interface feel genuinely good to use.",
  },
  {
    icon: Layers,
    title: "Full Stack Thinking",
    body: "I connect the dots between database schema, API contract, and UI — so nothing gets lost in translation between layers. One person who sees the whole picture.",
  },
];

// Stats
const stats = [
  { value: "5+", label: "Years building" },
  { value: "7+", label: "Projects shipped" },
  { value: "100%", label: "Remote-ready" },
];

// Scroll-reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function RevealDiv({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export default function AboutSection() {
  const nameParts = ownerName.split(" ");
  const firstName = nameParts[0] || "";

  return (
    <section
      id="about"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-ink-800 overflow-hidden"
    >
      {/* Left accent line */}
      <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-electric-400/30 to-transparent" />

      {/* Faint background text */}
      <span
        aria-hidden
        className="absolute -bottom-6 -right-4 font-display font-bold text-[10rem] sm:text-[16rem]
                   leading-none text-cream-100/[0.018] select-none pointer-events-none"
      >
        ABOUT
      </span>

      <div className="max-w-6xl mx-auto">

        {/* ── Section label + headline ── */}
        <RevealDiv className="mb-16">
          <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
            01 / About
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-cream-100 leading-tight max-w-2xl">
            Building things that{" "}
            <span className="text-electric-400 italic">actually work</span>.
          </h2>
        </RevealDiv>

        {/* ── Main two-column layout ── */}
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 mb-20">

          {/* Left col: bio + stats */}
          <RevealDiv delay={100} className="lg:col-span-3 space-y-8">
            <div className="space-y-5 text-cream-200/70 text-lg leading-relaxed">
              <p>
                Hey — I'm <span className="text-cream-100 font-semibold">{firstName}</span>, a
                full stack developer based in Ibadan, Nigeria. I specialise in building
                API-driven web applications that are reliable, fast, and genuinely easy
                to maintain.
              </p>
              <p>
                My core stack is <span className="text-electric-400">Laravel</span> on
                the backend and <span className="text-electric-400">React / Next.js</span>{" "}
                on the frontend — but I care more about solving the right problem than
                being precious about tools.
              </p>
              <p>
                I work well independently and take projects from initial architecture
                decisions all the way through to deployment. Currently available for
                freelance projects and open to full-time opportunities.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink-600">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl sm:text-4xl text-electric-400 mb-1">
                    {s.value}
                  </p>
                  <p className="font-mono text-xs text-cream-200/40 uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 bg-electric-500 hover:bg-electric-400
                           text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300
                           hover:shadow-[0_0_24px_rgba(79,158,255,0.35)]"
              >
                <Download size={16} />
                Download CV
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border border-cream-200/20
                           text-cream-100 hover:border-electric-400/60 hover:text-electric-400
                           px-6 py-3 rounded-lg transition-all duration-300 font-semibold"
              >
                Let's talk
                <ArrowRight size={16} />
              </Link>
            </div>
          </RevealDiv>

          {/* Right col: info cards */}
          <RevealDiv delay={200} className="lg:col-span-2 flex flex-col gap-4">
            {/* Status card */}
            <div className="border border-ink-600 rounded-xl p-5 bg-ink-900/60 relative overflow-hidden">
              {/* Glow dot */}
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
              <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-1">
                Current status
              </p>
              <p className="text-cream-100 font-semibold text-lg">Available for hire</p>
              <p className="font-mono text-xs text-cream-200/40 mt-1">
                Open to freelance & full-time
              </p>
            </div>

            {/* Location */}
            <div className="border border-ink-600 rounded-xl p-5 bg-ink-900/60">
              <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-1">
                Location
              </p>
              <p className="text-cream-100 font-semibold">Ibadan, Nigeria 🇳🇬</p>
              <p className="font-mono text-xs text-cream-200/40 mt-1">GMT+1 · Remote-first</p>
            </div>

            {/* Stack */}
            <div className="border border-ink-600 rounded-xl p-5 bg-ink-900/60">
              <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-3">
                Core stack
              </p>
              <div className="flex flex-wrap gap-2">
                {["Laravel", "PHP", "React", "Next.js", "Supabase", "MySQL", "Tailwind"].map((t) => (
                  <span
                    key={t}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-electric-500/10
                               border border-electric-400/20 text-electric-400/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact shortcut */}
            {ownerEmail && (
              <a
                href={`mailto:${ownerEmail}`}
                className="border border-ink-600 rounded-xl p-5 bg-ink-900/60
                           hover:border-electric-400/40 transition-colors group"
              >
                <p className="font-mono text-xs text-cream-200/30 uppercase tracking-widest mb-1">
                  Email
                </p>
                <p className="text-cream-100 font-semibold group-hover:text-electric-400 transition-colors">
                  {ownerEmail}
                </p>
              </a>
            )}
          </RevealDiv>
        </div>

        {/* ── Three pillars ── */}
        <div className="grid sm:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <RevealDiv key={pillar.title} delay={i * 100}>
                <div
                  className="h-full border border-ink-600 rounded-xl p-6 bg-ink-900/40
                               hover:border-electric-400/30 hover:bg-ink-900/80
                               transition-all duration-500 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg bg-electric-500/10 border border-electric-400/20
                                 flex items-center justify-center mb-5
                                 group-hover:bg-electric-500/20 transition-colors"
                  >
                    <Icon size={18} className="text-electric-400" />
                  </div>
                  <h3 className="font-display text-lg text-cream-100 mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-cream-200/55 text-sm leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              </RevealDiv>
            );
          })}
        </div>
      </div>
    </section>
  );
}
const categoryColors = {
  Backend: "border-blue-400/30 text-blue-300",
  Frontend: "border-purple-400/30 text-purple-300",
  DevOps: "border-green-400/30 text-green-300",
  Payments: "border-yellow-400/30 text-yellow-300",
  "Cloud & Storage": "border-cyan-400/30 text-cyan-300",
};

export default function SkillsSection({ skills }) {
  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  // Fallback if no skills in DB yet
  const fallbackSkills = {
    Backend: ["Laravel", "PHP", "MySQL","PostgreSQL", "REST API", "JWT Auth"],
    Frontend: ["React", "Next.js", "Tailwind CSS", "JavaScript"],
    DevOps: ["Git & GitHub", "Supabase", "Server Deployment"],
    Payments: ["Paystack", "Monnify"],
    "Cloud & Storage": ["AWS", "Cloudflare"],
  };

  const data = Object.keys(grouped).length ? grouped : fallbackSkills;

  return (
    <section
      id="skills"
      className="py-28 px-4 sm:px-6 lg:px-8 bg-ink-900 border-y border-ink-600"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-electric-400 text-sm tracking-widest uppercase mb-4">
          02 / Skills
        </p>
        <h2 className="font-display text-4xl sm:text-5xl text-cream-100 mb-14">
          Tech I work with
        </h2>

        <div className="grid sm:grid-cols-3 gap-8">
          {Object.entries(data).map(([category, items]) => (
            <div key={category}>
              <div
                className={`inline-block font-mono text-xs tracking-widest uppercase px-3 py-1 rounded-full
                             border mb-6 ${categoryColors[category] || "border-cream-200/20 text-cream-200/60"}`}
              >
                {category}
              </div>
              <div className="space-y-3">
                {(Array.isArray(items) ? items : []).map((item) => {
                  const name = typeof item === "string" ? item : item.name;
                  return (
                    <div
                      key={name}
                      className="flex items-center gap-3 group"
                    >
                      <span className="w-1 h-1 rounded-full bg-electric-400/40 group-hover:bg-electric-400 transition-colors" />
                      <span className="text-cream-200/70 group-hover:text-cream-100 transition-colors font-medium">
                        {name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import ScrollReveal from "./ScrollReveal";

const MODULES = [
  {
    name: "Frontend",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    name: "Backend",
    tools: ["Node.js", "Express", "Prisma", "REST APIs", "Server Actions"],
  },
  {
    name: "Data & Auth",
    tools: ["MongoDB", "PostgreSQL", "Supabase", "Auth & Sessions"],
  },
  {
    name: "Ops",
    tools: ["Vercel", "GitHub Actions", "Docker basics", "Rate limiting & security"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="border-t border-white/5 bg-surface/40 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">02 / Stack</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            The modules I reach for.
          </h2>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((mod, i) => (
            <ScrollReveal key={mod.name} delay={i * 0.08}>
              <div className="group h-full rounded-xl border border-white/10 bg-surface p-6 transition-colors hover:border-signal/40">
                <p className="font-mono text-[10px] uppercase tracking-widest text-cyan">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-lg text-paper">{mod.name}</h3>
                <ul className="mt-4 space-y-2">
                  {mod.tools.map((tool) => (
                    <li key={tool} className="flex items-center gap-2 text-sm text-muted">
                      <span className="h-1 w-1 rounded-full bg-signal/70" />
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

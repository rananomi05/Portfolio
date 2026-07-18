import ScrollReveal from "./ScrollReveal";

const TIMELINE = [
  {
    period: "2024 — Present",
    title: "Frontend / Full-Stack Developer",
    place: "Freelance & Internships",
    description:
      "Building admin dashboards, marketing sites, and internal tools with Next.js, TypeScript, and Tailwind CSS for remote clients.",
  },
  {
    period: "2022 — 2026",
    title: "BS Computer Science",
    place: "Government College University, Faisalabad",
    description:
      "Final-year project: EduPortal, an AI-powered academic resource platform, built alongside coursework in systems and web development.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="border-t border-white/5 bg-surface/40 px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">04 / Timeline</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            How I got here.
          </h2>
        </ScrollReveal>

        <div className="relative mt-14 space-y-12 border-l border-white/10 pl-8">
          {TIMELINE.map((entry, i) => (
            <ScrollReveal key={entry.title} delay={i * 0.1}>
              <div className="relative">
                <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-signal ring-4 ring-ink" />
                <p className="font-mono text-xs uppercase tracking-widest text-cyan">
                  {entry.period}
                </p>
                <h3 className="mt-2 font-display text-xl text-paper">{entry.title}</h3>
                <p className="text-sm text-muted">{entry.place}</p>
                <p className="mt-3 max-w-xl text-sm text-muted leading-relaxed">
                  {entry.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

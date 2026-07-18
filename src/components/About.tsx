import ScrollReveal from "./ScrollReveal";

const READOUT = [
  { label: "Location", value: "Lahore, Pakistan" },
  { label: "Specialization", value: "MERN · Next.js · TypeScript" },
  { label: "Education", value: "BS Computer Science (GCUF)" },
  { label: "Availability", value: "Onsite · Remote" },
];

export default function About() {
  return (
    <section id="about" className="border-t border-white/5 px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.2fr]">
        <ScrollReveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">01 / About</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            Built for the parts that break at scale.
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1} className="space-y-8">
          <p className="max-w-xl text-muted leading-relaxed">
            I'm a Full Stack Developer based in Lahore, Pakistan, with a BS in Computer Science from GCUF. I specialize in building fast, responsive, and scalable web applications that combine exceptional user experiences with secure, reliable backend architecture.
          </p>

          <p className="max-w-xl text-muted leading-relaxed">
            I work primarily with MERN, Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and MongoDB. From authentication systems and REST APIs to responsive dashboards and modern frontend interfaces, I enjoy creating production-ready solutions that are both efficient and maintainable. I'm open to onsite and remote opportunities where I can contribute, learn, and grow as a software engineer.
          </p>

          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/5 sm:grid-cols-4">
            {READOUT.map((row) => (
              <div key={row.label} className="bg-surface px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {row.label}
                </p>
                <p className="mt-1 text-sm text-paper">{row.value}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

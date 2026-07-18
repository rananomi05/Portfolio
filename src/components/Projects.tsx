"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const PROJECTS = [
  {
    name: "EduPortal",
    tag: "Final Year Project",
    description:
      "An AI-powered academic resource system with a role-based admin dashboard, unified design system, and animated landing experience.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "ATR Automotive POS",
    tag: "University Project",
    description:
      "A point-of-sale and management system rebuilt from an HTML prototype into a Next.js app with pixel-accurate sidebar and dashboard views.",
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "DevConnect",
    tag: "Marketplace",
    description:
      "A full developer-client marketplace with nine routes, dark/light mode, and glass-morphism UI, shipped with complete submission docs.",
    stack: ["Next.js 14", "MERN", "Tailwind CSS"],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="border-t border-white/5 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">03 / Work</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            Recent builds.
          </h2>
        </ScrollReveal>

        <div className="mt-14 space-y-4">
          {PROJECTS.map((project, i) => (
            <ScrollReveal key={project.name} delay={i * 0.06}>
              <motion.div
                whileHover={{ x: 6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group grid gap-4 rounded-xl border border-white/10 bg-surface p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                    {project.tag}
                  </p>
                  <h3 className="mt-1 font-display text-xl text-paper group-hover:text-signal transition-colors">
                    {project.name}
                  </h3>
                </div>

                <p className="text-sm text-muted leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  {project.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-cyan"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

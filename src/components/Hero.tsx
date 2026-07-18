"use client";

import { motion } from "framer-motion";
import SignalLine from "./SignalLine";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-grid-pattern px-6 pt-24"
    >
      {/* ambient corner glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-signal/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-cyan/10 blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl w-full"
      >
        <motion.p
          variants={item}
          className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-signal"
        >
          Status: online — accepting new builds
        </motion.p>

        <motion.h1
          variants={item}
          className="font-display text-balance text-5xl font-semibold leading-[1.05] text-paper sm:text-6xl md:text-7xl"
        >
          I build systems that
          <br />
          <span className="text-signal">read clearly</span> under load.
        </motion.h1>

        <motion.p variants={item} className="mt-6 max-w-xl text-base text-muted sm:text-lg">
          Noman Rajpoot — a full-stack developer specializing in MERN and Next.js.
          I design admin dashboards, authentication flows, and data-heavy interfaces
          that stay legible when things get busy.
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <SignalLine className="h-16 w-72 opacity-90" />
        </motion.div>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="rounded-full bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            View projects
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-6 py-3 font-mono text-sm text-paper transition-colors hover:border-signal/60 hover:text-signal"
          >
            Get in touch
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-muted"
      >
        scroll to inspect ↓
      </motion.div>
    </section>
  );
}

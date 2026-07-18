"use client";

import { motion } from "framer-motion";

// The signature element of the design: a system waveform that draws itself
// once on load, then idles with a slow ambient pulse. Reinforces the
// "signal room" identity - a developer who ships monitoring-grade dashboards.
export default function SignalLine({ className = "" }: { className?: string }) {
  const path =
    "M0,40 L60,40 L80,40 L95,10 L115,70 L135,40 L160,40 L180,40 L195,20 L210,55 L225,40 L400,40";

  return (
    <svg
      viewBox="0 0 400 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <motion.path
        d={path}
        stroke="#F2A93B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
      />
      <motion.circle
        cx="400"
        cy="40"
        r="4"
        fill="#F2A93B"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6] }}
        transition={{ duration: 1.6, delay: 1.6, repeat: Infinity, repeatType: "reverse" }}
      />
    </svg>
  );
}

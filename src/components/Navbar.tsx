"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled ? "bg-ink/85 backdrop-blur-md border-b border-white/5" : "bg-transparent"
        }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 font-mono text-sm text-paper">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping_slow absolute inline-flex h-full w-full rounded-full bg-okgreen opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-okgreen" />
          </span>
          noman<span className="text-signal">.</span>dev
        </a>

        <ul className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-muted">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="group relative py-1">
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-signal transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden flex items-center gap-2 rounded-full border border-signal/40 px-4 py-1.5 font-mono text-xs text-signal hover:bg-signal hover:text-ink transition-colors"
          onClick={() => {
            const menu = document.getElementById("mobile-menu");
            if (menu) {
              menu.classList.toggle("hidden");
            }
          }}
        >
          Menu
        </button>
        <Link href="/login" className="hidden md:inline-flex items-center gap-2 rounded-full border border-signal/40 px-4 py-1.5 font-mono text-xs text-signal hover:bg-signal hover:text-ink transition-colors">
          Login
        </Link>
        <a
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-signal/40 px-4 py-1.5 font-mono text-xs text-signal hover:bg-signal hover:text-ink transition-colors"
        >
          Start a project
        </a>
      </nav>
    </header>
  );
}

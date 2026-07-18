"use client";

import { useState } from "react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

type Status = "idle" | "loading" | "success" | "error";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  function validate(): boolean {
    const next: Partial<FormState> = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (form.message.trim().length < 10) next.message = "Say a little more (10+ characters).";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function getRecaptchaToken(): Promise<string | undefined> {
    if (!siteKey || typeof window === "undefined" || !window.grecaptcha) return undefined;
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action: "contact_submit" });
          resolve(token);
        } catch {
          resolve(undefined);
        }
      });
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerMessage("");

    try {
      const recaptchaToken = await getRecaptchaToken();
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, recaptchaToken }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setServerMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setForm(INITIAL_STATE);
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please check your connection and try again.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm text-paper placeholder:text-muted/60 focus:border-signal/60 focus:outline-none transition-colors";

  return (
    <section id="contact" className="border-t border-white/5 px-6 py-28">
      {siteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />
      )}

      <div className="mx-auto max-w-2xl">
        <ScrollReveal>
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">05 / Contact</span>
          <h2 className="mt-4 font-display text-3xl font-semibold text-paper sm:text-4xl">
            Send a signal.
          </h2>
          <p className="mt-3 text-muted">
            Tell me what you're building. I read every message and reply within a day or two.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-muted">
                  Name
                </label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="mb-1.5 block font-mono text-xs text-muted">
                Subject (optional)
              </label>
              <input
                id="subject"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={inputClass}
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-muted">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={inputClass}
                placeholder="Give me the short version of the project."
              />
              {errors.message && <p className="mt-1.5 text-xs text-danger">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === "loading" ? "Sending..." : "Send message"}
            </button>

            <p className="font-mono text-[10px] text-muted/70">
              Protected by reCAPTCHA v3. Google's{" "}
              <a href="https://policies.google.com/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              and{" "}
              <a href="https://policies.google.com/terms" className="underline">
                Terms
              </a>{" "}
              apply.
            </p>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-okgreen/30 bg-okgreen/10 px-4 py-3 text-sm text-okgreen"
                >
                  Message received. I'll get back to you soon.
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
                >
                  {serverMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}

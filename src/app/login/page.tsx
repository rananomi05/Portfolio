"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { motion } from "framer-motion";

declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function getRecaptchaToken(): Promise<string> {
    if (!siteKey || !window.grecaptcha) return "";
    return new Promise((resolve) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(siteKey, { action: "admin_login" });
          resolve(token);
        } catch {
          resolve("");
        }
      });
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");
    setServerMessage("");

    const recaptchaToken = await getRecaptchaToken();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, recaptchaToken }),
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setServerMessage(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink bg-grid-pattern px-6">
      {siteKey && (
        <Script src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`} strategy="afterInteractive" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-surface p-8"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Admin access</p>
        <h1 className="mt-3 font-display text-2xl text-paper">Sign in</h1>

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-muted">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-paper focus:border-signal/60 focus:outline-none"
              placeholder="admin@example.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block font-mono text-xs text-muted">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm text-paper focus:border-signal/60 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1.5 text-xs text-danger">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-signal px-6 py-3 font-mono text-sm font-medium text-ink transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {status === "loading" ? "Verifying..." : "Sign in"}
          </button>

          {status === "error" && (
            <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {serverMessage}
            </p>
          )}
        </form>
      </motion.div>
    </main>
  );
}

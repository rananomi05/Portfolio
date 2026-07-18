"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/contacts", label: "Contact Queries" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen bg-ink">
      <aside className="flex w-60 flex-col border-r border-white/10 bg-surface px-5 py-6">
        <div className="flex items-center gap-2 font-mono text-sm text-paper">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping_slow absolute inline-flex h-full w-full rounded-full bg-okgreen opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-okgreen" />
          </span>
          admin<span className="text-signal">.</span>panel
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2.5 font-mono text-sm transition-colors ${
                  active ? "bg-signal/10 text-signal" : "text-muted hover:bg-white/5 hover:text-paper"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="rounded-lg border border-white/10 px-3 py-2.5 font-mono text-sm text-muted transition-colors hover:border-danger/40 hover:text-danger"
        >
          Log out
        </button>
      </aside>

      <div className="flex-1 px-10 py-10">{children}</div>
    </div>
  );
}

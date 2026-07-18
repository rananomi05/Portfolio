"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecentContact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: "PENDING" | "DONE" | "RESOLVED";
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  resolved: number;
  recent: RecentContact[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total contacts", value: stats?.total ?? 0 },
    { label: "Pending queries", value: stats?.pending ?? 0 },
    { label: "Resolved queries", value: stats?.resolved ?? 0 },
  ];

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Overview</p>
      <h1 className="mt-2 font-display text-3xl text-paper">Dashboard</h1>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-white/10 bg-surface p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">{card.label}</p>
            <p className="mt-3 font-display text-4xl text-paper">
              {loading ? "—" : card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg text-paper">Recent contacts</h2>
          <Link href="/admin/contacts" className="font-mono text-xs text-signal hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface2 font-mono text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && stats?.recent.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-muted">
                    No contact queries yet.
                  </td>
                </tr>
              )}
              {stats?.recent.map((c) => (
                <tr key={c.id} className="border-t border-white/5 bg-surface text-paper">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.email}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: "PENDING" | "DONE" | "RESOLVED" }) {
  const styles = {
    PENDING: "bg-signal/10 text-signal border-signal/30",
    DONE: "bg-cyan/10 text-cyan border-cyan/30",
    RESOLVED: "bg-okgreen/10 text-okgreen border-okgreen/30",
  } as const;

  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase ${styles[status]}`}>
      {status}
    </span>
  );
}

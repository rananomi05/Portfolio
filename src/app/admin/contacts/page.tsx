"use client";

import { useEffect, useState, useCallback } from "react";
import StatusBadge from "../dashboard/page";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: "PENDING" | "DONE" | "RESOLVED";
  createdAt: string;
}

const FILTERS = ["ALL", "PENDING", "DONE", "RESOLVED"] as const;

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/contacts?status=${filter}`);
    const data = await res.json();
    setContacts(data.contacts ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function updateStatus(id: string, status: Contact["status"]) {
    // Optimistic update for a snappier feel.
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-signal">Queries</p>
      <h1 className="mt-2 font-display text-3xl text-paper">Contact submissions</h1>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 font-mono text-xs uppercase transition-colors ${filter === f
                ? "bg-signal text-ink"
                : "border border-white/10 text-muted hover:text-paper"
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {loading && <p className="text-muted">Loading...</p>}
        {!loading && contacts.length === 0 && (
          <p className="rounded-xl border border-white/10 bg-surface px-6 py-10 text-center text-muted">
            No queries match this filter.
          </p>
        )}

        {contacts.map((c) => (
          <div key={c.id} className="rounded-xl border border-white/10 bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg text-paper">{c.name}</p>
                <p className="font-mono text-xs text-muted">{c.email}</p>
                {c.subject && <p className="mt-1 text-sm text-cyan">{c.subject}</p>}
              </div>
              <StatusBadge status={c.status} />
            </div>

            <p className="mt-3 text-sm text-muted leading-relaxed">{c.message}</p>

            <div className="mt-4 flex items-center justify-between">
              <p className="font-mono text-[10px] text-muted/60">
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <select
                value={c.status}
                onChange={(e) => updateStatus(c.id, e.target.value as Contact["status"])}
                className="rounded-lg border border-white/10 bg-ink px-3 py-1.5 font-mono text-xs text-paper focus:border-signal/60 focus:outline-none"
              >
                <option value="PENDING">Pending</option>
                <option value="DONE">Done</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

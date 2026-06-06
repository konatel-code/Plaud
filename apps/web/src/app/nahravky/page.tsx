"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import type { RecordingList } from "@/lib/types";
import { STATUS_COLOR, STATUS_LABEL, TYPE_LABEL } from "@/lib/labels";

export default function NahravkyPage() {
  const [data, setData] = useState<RecordingList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const qRef = useRef("");

  async function load() {
    try {
      const query = qRef.current ? `?q=${encodeURIComponent(qRef.current)}` : "";
      setData(await api.get<RecordingList>(`/recordings${query}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba načítania");
    }
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000); // priebežné obnovenie stavu spracovania
    return () => clearInterval(t);
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    qRef.current = q;
    load();
  }

  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Nahrávky</h1>
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Hľadať v názvoch, prepisoch, zhrnutiach…"
            className="w-72 rounded-md border px-3 py-1.5 text-sm outline-none focus:border-daka"
          />
          <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
            Hľadať
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {!data ? (
        <p className="text-slate-400">Načítavam…</p>
      ) : data.items.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
          Zatiaľ žiadne nahrávky.{" "}
          <Link href="/nahravky/nova" className="text-daka hover:underline">
            Vytvor prvú →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-2 font-medium">Názov</th>
                <th className="px-4 py-2 font-medium">Typ</th>
                <th className="px-4 py-2 font-medium">Stav</th>
                <th className="px-4 py-2 font-medium">Dátum</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((r) => (
                <tr key={r.id} className="border-t hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/nahravky/${r.id}`}
                      className="font-medium text-daka-dark hover:underline"
                    >
                      {r.nazov}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{TYPE_LABEL[r.typ]}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[r.stav]}`}
                    >
                      {STATUS_LABEL[r.stav]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(r.createdAt).toLocaleString("sk-SK")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

interface Event {
  id: string;
  typ: string;
  stav: string;
  cielUrl?: string | null;
  odpoved?: string | null;
  createdAt: string;
}

const STAV_COLOR: Record<string, string> = {
  ODOSLANE: "bg-green-100 text-green-800",
  CHYBA: "bg-red-100 text-red-800",
  PRIPRAVENE: "bg-amber-100 text-amber-800",
};

export default function IntegraciePage() {
  const [rows, setRows] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Event[]>("/admin/integrations")
      .then(setRows)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-semibold">Integrácie (CRM)</h1>
      <p className="mb-4 text-sm text-slate-500">
        Evidencia odoslaní profilov klientov do CRM / rezervačného systému.
      </p>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Čas</th>
              <th className="px-4 py-2 font-medium">Typ</th>
              <th className="px-4 py-2 font-medium">Stav</th>
              <th className="px-4 py-2 font-medium">Odpoveď</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2 text-slate-500">
                  {new Date(r.createdAt).toLocaleString("sk-SK")}
                </td>
                <td className="px-4 py-2 text-slate-600">{r.typ}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STAV_COLOR[r.stav] ?? ""}`}>
                    {r.stav}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-500">{r.odpoved ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  Zatiaľ žiadne odoslania.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

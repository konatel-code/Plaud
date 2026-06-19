"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

interface Term {
  id: string;
  pojem: string;
  kategoria?: string | null;
}

export default function GlosarPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [pojem, setPojem] = useState("");
  const [kategoria, setKategoria] = useState("pojem");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setTerms(await api.get<Term[]>("/glossary"));
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!pojem.trim()) return;
    try {
      await api.post("/glossary", { pojem, kategoria });
      setPojem("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba");
    }
  }

  async function remove(id: string) {
    await api.del(`/glossary/${id}`);
    await load();
  }

  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-semibold">Cestovný glosár</h1>
      <p className="mb-4 text-sm text-slate-500">
        Pojmy, destinácie a názvy hotelov zlepšujú presnosť prepisu aj zhrnutí.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={add} className="mb-6 flex gap-2 rounded-xl border bg-white p-4">
        <input
          value={pojem}
          onChange={(e) => setPojem(e.target.value)}
          placeholder="Nový pojem (napr. Hurghada)"
          className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:border-daka"
        />
        <select
          value={kategoria}
          onChange={(e) => setKategoria(e.target.value)}
          className="rounded-md border px-2 py-2 text-sm"
        >
          <option value="pojem">pojem</option>
          <option value="destinacia">destinácia</option>
          <option value="hotel">hotel</option>
          <option value="dopravca">dopravca</option>
        </select>
        <button className="rounded-md bg-daka px-4 py-2 text-sm font-medium text-white hover:bg-daka-dark">
          Pridať
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[34rem] text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Pojem</th>
              <th className="px-4 py-2 font-medium">Kategória</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {terms.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="px-4 py-2">{t.pojem}</td>
                <td className="px-4 py-2 text-slate-500">{t.kategoria ?? "—"}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => remove(t.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    Zmazať
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

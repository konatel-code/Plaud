"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";

interface Template {
  id: string;
  kluc: string;
  nazov: string;
  useCase: string;
  popis?: string | null;
  prompt: string;
  aktivna: boolean;
}

export default function SablonyPage() {
  const [items, setItems] = useState<Template[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ nazov: "", prompt: "" });
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setItems(await api.get<Template[]>("/templates/all"));
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);

  async function toggle(t: Template) {
    await api.patch(`/templates/${t.id}`, { aktivna: !t.aktivna });
    await load();
  }

  function startEdit(t: Template) {
    setEditId(t.id);
    setDraft({ nazov: t.nazov, prompt: t.prompt });
  }

  async function save(id: string) {
    try {
      await api.patch(`/templates/${id}`, draft);
      setEditId(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Chyba");
    }
  }

  return (
    <AppShell>
      <h1 className="mb-1 text-xl font-semibold">Šablóny zhrnutí</h1>
      <p className="mb-4 text-sm text-slate-500">
        Uprav názov a prompt (inštrukciu pre AI) alebo šablónu vypni.
      </p>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border bg-white p-4">
            {editId === t.id ? (
              <div className="space-y-2">
                <input
                  value={draft.nazov}
                  onChange={(e) => setDraft({ ...draft, nazov: e.target.value })}
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />
                <textarea
                  value={draft.prompt}
                  onChange={(e) => setDraft({ ...draft, prompt: e.target.value })}
                  rows={5}
                  className="w-full rounded-md border px-3 py-2 font-mono text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => save(t.id)}
                    className="rounded-md bg-daka px-3 py-1.5 text-sm font-medium text-white hover:bg-daka-dark"
                  >
                    Uložiť
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="rounded-md border px-3 py-1.5 text-sm"
                  >
                    Zrušiť
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-daka-dark">{t.nazov}</span>
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500">
                      {t.kluc}
                    </span>
                    {!t.aktivna && (
                      <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                        vypnutá
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t.popis}</p>
                </div>
                <div className="flex shrink-0 gap-2 text-sm">
                  <button onClick={() => startEdit(t)} className="rounded-md border px-3 py-1.5 hover:bg-slate-50">
                    Upraviť
                  </button>
                  <button
                    onClick={() => toggle(t)}
                    className="rounded-md border px-3 py-1.5 hover:bg-slate-50"
                  >
                    {t.aktivna ? "Vypnúť" : "Zapnúť"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { RecordingDetail, RecordingShare } from "@/lib/types";

interface Colleague {
  id: string;
  meno: string;
  role: string;
}

export function OrganizePanel({
  rec,
  onChange,
}: {
  rec: RecordingDetail;
  onChange: () => void;
}) {
  const [stitky, setStitky] = useState<string[]>(rec.stitky ?? []);
  const [novy, setNovy] = useState("");
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [shares, setShares] = useState<RecordingShare[]>(rec.shares ?? []);
  const [pick, setPick] = useState("");

  useEffect(() => {
    api.get<Colleague[]>("/users/colleagues").then(setColleagues).catch(() => undefined);
  }, []);

  async function saveTags(next: string[]) {
    setStitky(next);
    await api.patch(`/recordings/${rec.id}`, { stitky: next }).catch(() => undefined);
    onChange();
  }
  function addTag() {
    const t = novy.trim();
    if (!t || stitky.includes(t)) return;
    setNovy("");
    saveTags([...stitky, t]);
  }

  async function share() {
    if (!pick) return;
    await api.post(`/recordings/${rec.id}/share`, { userId: pick });
    const col = colleagues.find((c) => c.id === pick);
    if (col && !shares.some((s) => s.userId === pick)) {
      setShares([...shares, { userId: pick, user: { id: col.id, meno: col.meno } }]);
    }
    setPick("");
  }
  async function unshare(userId: string) {
    await api.del(`/recordings/${rec.id}/share/${userId}`);
    setShares(shares.filter((s) => s.userId !== userId));
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Štítky */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 font-semibold text-daka-dark">🏷️ Štítky</h3>
        <div className="mb-3 flex flex-wrap gap-2">
          {stitky.length === 0 && <span className="text-sm text-slate-400">Žiadne štítky</span>}
          {stitky.map((t) => (
            <span
              key={t}
              className="flex items-center gap-1 rounded-full bg-daka/10 px-2.5 py-1 text-xs text-daka-dark"
            >
              {t}
              <button
                onClick={() => saveTags(stitky.filter((x) => x !== t))}
                className="text-daka-dark/60 hover:text-red-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={novy}
            onChange={(e) => setNovy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="napr. leto-2026"
            className="flex-1 rounded-md border px-3 py-1.5 text-sm outline-none focus:border-daka"
          />
          <button onClick={addTag} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-50">
            Pridať
          </button>
        </div>
      </div>

      {/* Zdieľanie */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="mb-3 font-semibold text-daka-dark">👥 Zdieľanie</h3>
        <div className="mb-3 space-y-1">
          {shares.length === 0 && (
            <span className="text-sm text-slate-400">Zatiaľ nezdieľané</span>
          )}
          {shares.map((s) => (
            <div key={s.userId} className="flex items-center justify-between text-sm">
              <span>{s.user.meno}</span>
              <button
                onClick={() => unshare(s.userId)}
                className="text-slate-400 hover:text-red-600"
              >
                Zrušiť
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <select
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            className="flex-1 rounded-md border px-2 py-1.5 text-sm"
          >
            <option value="">Vybrať kolegu…</option>
            {colleagues
              .filter((c) => !shares.some((s) => s.userId === c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.meno}
                </option>
              ))}
          </select>
          <button
            onClick={share}
            disabled={!pick}
            className="rounded-md bg-daka px-3 py-1.5 text-sm font-medium text-white hover:bg-daka-dark disabled:opacity-50"
          >
            Zdieľať
          </button>
        </div>
      </div>
    </div>
  );
}

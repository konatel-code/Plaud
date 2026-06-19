"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { api } from "@/lib/api";
import { TYPE_LABEL, STATUS_LABEL } from "@/lib/labels";
import { CLIENT_STATUS_LABEL } from "@/lib/types";

interface Stats {
  nahravky: { total: number; poslednych7: number; poslednych30: number; spracovavaSa: number };
  podlaTypu: Record<string, number>;
  podlaStavu: Record<string, number>;
  klientiPodlaStavu: Record<string, number>;
  otvoreneUlohy: number;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="text-3xl font-semibold text-daka-dark">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </div>
  );
}

function Breakdown({
  title,
  data,
  labels,
}: {
  title: string;
  data: Record<string, number>;
  labels: Record<string, string>;
}) {
  const entries = Object.entries(data);
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="mb-3 font-semibold text-daka-dark">{title}</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-400">Žiadne dáta.</p>
      ) : (
        <div className="space-y-2">
          {entries.map(([k, v]) => (
            <div key={k} className="text-sm">
              <div className="mb-0.5 flex justify-between">
                <span className="text-slate-600">{labels[k] ?? k}</span>
                <span className="font-medium">{v}</span>
              </div>
              <div className="h-2 rounded bg-slate-100">
                <div
                  className="h-2 rounded bg-daka"
                  style={{ width: `${(v / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const [s, setS] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Stats>("/stats")
      .then(setS)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <AppShell>
      <h1 className="mb-4 text-xl font-semibold">Prehľad</h1>
      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      {!s ? (
        <p className="text-slate-400">Načítavam…</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Stat label="Nahrávok spolu" value={s.nahravky.total} />
            <Stat label="Za 7 dní" value={s.nahravky.poslednych7} />
            <Stat label="Otvorené úlohy" value={s.otvoreneUlohy} />
            <Stat label="Spracúva sa" value={s.nahravky.spracovavaSa} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Breakdown title="Podľa typu" data={s.podlaTypu} labels={TYPE_LABEL} />
            <Breakdown title="Podľa stavu" data={s.podlaStavu} labels={STATUS_LABEL} />
            <Breakdown
              title="Klienti podľa stavu"
              data={s.klientiPodlaStavu}
              labels={CLIENT_STATUS_LABEL}
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}

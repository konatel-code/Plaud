"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  CLIENT_STATUS_LABEL,
  type ClientProfile,
  type Summary,
} from "@/lib/types";

const STATUSES: ClientProfile["stav"][] = [
  "LEAD",
  "PONUKA_ODOSLANA",
  "REZERVOVANE",
  "STRATENY",
];

export function ProfileCard({ profile }: { profile: ClientProfile }) {
  const [stav, setStav] = useState(profile.stav);
  const d = profile.dataJson;

  async function changeStatus(next: ClientProfile["stav"]) {
    setStav(next);
    await api.patch(`/client-profiles/${profile.id}`, { stav: next }).catch(() => undefined);
  }

  const row = (label: string, value: unknown) =>
    value ? (
      <div className="flex gap-2 py-0.5">
        <span className="w-32 shrink-0 text-slate-500">{label}</span>
        <span className="text-slate-800">{String(value)}</span>
      </div>
    ) : null;

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-daka-dark">👤 Profil klienta</h3>
        <select
          value={stav}
          onChange={(e) => changeStatus(e.target.value as ClientProfile["stav"])}
          className="rounded-md border px-2 py-1 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {CLIENT_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <div className="text-sm">
        {row("Cestujúci", d.cestujuci && `${d.cestujuci.dospeli ?? "?"} dosp. + ${d.cestujuci.deti ?? 0} deti`)}
        {row("Destinácia", d.destinacia?.preferovane?.join(", "))}
        {row("Typ dovolenky", d.destinacia?.typ_dovolenky)}
        {row("Termín", d.termin?.od)}
        {row("Rozpočet", d.rozpocet?.spolu && `${d.rozpocet.spolu} ${d.rozpocet.mena ?? ""}`)}
        {row("Doprava", d.doprava)}
        {row("Strava", d.ubytovanie?.strava)}
        {row("Špeciálne", d.specialne_poziadavky?.join("; "))}
      </div>
      {d.navrh_zajazdu?.length > 0 && (
        <div className="mt-3 border-t pt-3 text-sm">
          <p className="mb-1 font-medium text-slate-700">Návrh zájazdu</p>
          <ul className="list-disc pl-5 text-slate-700">
            {d.navrh_zajazdu.map((n: string, i: number) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function TaskList({ summary }: { summary: Summary }) {
  const [tasks, setTasks] = useState(summary.tasks);
  if (tasks.length === 0) return null;

  async function toggle(id: string, done: boolean) {
    const stav = done ? "HOTOVA" : "OTVORENA";
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, stav } : t)));
    await api.patch(`/tasks/${id}`, { stav }).catch(() => undefined);
  }

  return (
    <div className="rounded-xl border bg-white p-5">
      <h3 className="mb-3 font-semibold text-daka-dark">✅ Úlohy</h3>
      <ul className="space-y-2 text-sm">
        {tasks.map((t) => (
          <li key={t.id} className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={t.stav === "HOTOVA"}
              onChange={(e) => toggle(t.id, e.target.checked)}
              className="mt-1"
            />
            <span className={t.stav === "HOTOVA" ? "text-slate-400 line-through" : ""}>
              {t.text}
              {t.zodpovedny && <span className="text-slate-500"> — {t.zodpovedny}</span>}
              {t.termin && (
                <span className="text-slate-400">
                  {" "}
                  (do {new Date(t.termin).toLocaleDateString("sk-SK")})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

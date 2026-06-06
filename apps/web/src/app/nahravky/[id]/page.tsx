"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { api, downloadFile } from "@/lib/api";
import type { RecordingDetail } from "@/lib/types";
import { STATUS_COLOR, STATUS_LABEL, TYPE_LABEL } from "@/lib/labels";
import { ProfileCard, TaskList } from "@/components/DomainCards";

interface Template {
  kluc: string;
  nazov: string;
}

const PROCESSING = ["UPLOADED", "TRANSCRIBING", "TRANSCRIBED", "SUMMARIZING"];

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rec, setRec] = useState<RecordingDetail | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tab, setTab] = useState<"zhrnutie" | "prepis">("zhrnutie");
  const [error, setError] = useState<string | null>(null);
  const [regenKluc, setRegenKluc] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      setRec(await api.get<RecordingDetail>(`/recordings/${id}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba načítania");
    }
  }

  useEffect(() => {
    load();
    api.get<Template[]>("/templates").then(setTemplates).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // priebežné obnovenie počas spracovania
  useEffect(() => {
    if (!rec || !PROCESSING.includes(rec.stav)) return;
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec?.stav]);

  async function regenerate() {
    if (!regenKluc) return;
    setBusy(true);
    try {
      await api.post(`/recordings/${id}/summaries`, { templateKluc: regenKluc });
      await load();
      setTab("zhrnutie");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generovanie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Naozaj zmazať túto nahrávku? (vrátane prepisu a zhrnutí)")) return;
    await api.del(`/recordings/${id}`);
    router.replace("/nahravky");
  }

  if (error) {
    return (
      <AppShell>
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      </AppShell>
    );
  }
  if (!rec) {
    return (
      <AppShell>
        <p className="text-slate-400">Načítavam…</p>
      </AppShell>
    );
  }

  const summary = rec.summaries[0];

  return (
    <AppShell>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{rec.nazov}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {TYPE_LABEL[rec.typ]} ·{" "}
            <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[rec.stav]}`}>
              {STATUS_LABEL[rec.stav]}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {rec.summaries.length > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-slate-400">Export:</span>
              {(["md", "html", "docx"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() =>
                    downloadFile(
                      `/recordings/${id}/export?format=${f}`,
                      `${rec.nazov}.${f}`,
                    )
                  }
                  className="rounded border px-2 py-1 uppercase hover:bg-slate-50"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <button onClick={remove} className="text-sm text-slate-400 hover:text-red-600">
            Zmazať
          </button>
        </div>
      </div>

      {rec.stav === "FAILED" && rec.chyba && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          Spracovanie zlyhalo: {rec.chyba}
        </div>
      )}

      {PROCESSING.includes(rec.stav) && (
        <div className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Prebieha spracovanie ({STATUS_LABEL[rec.stav]}). Stránka sa obnoví automaticky.
        </div>
      )}

      <div className="mb-4 flex gap-2 border-b text-sm">
        {(["zhrnutie", "prepis"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 ${
              tab === t
                ? "border-daka font-medium text-daka-dark"
                : "border-transparent text-slate-500"
            }`}
          >
            {t === "zhrnutie" ? "Zhrnutie" : "Prepis"}
          </button>
        ))}
      </div>

      {tab === "zhrnutie" ? (
        <div className="space-y-4">
          {rec.clientProfile && <ProfileCard profile={rec.clientProfile} />}
          {summary && summary.tasks.length > 0 && <TaskList summary={summary} />}

          {summary ? (
            <article className="whitespace-pre-wrap rounded-xl border bg-white p-6 text-sm leading-relaxed">
              {summary.markdown}
            </article>
          ) : (
            <p className="text-slate-400">Zatiaľ bez zhrnutia.</p>
          )}

          {rec.transcript && (
            <div className="flex items-center gap-2 rounded-lg border bg-slate-50 p-3 text-sm">
              <select
                value={regenKluc}
                onChange={(e) => setRegenKluc(e.target.value)}
                className="rounded-md border px-2 py-1.5"
              >
                <option value="">Vygenerovať inou šablónou…</option>
                {templates.map((t) => (
                  <option key={t.kluc} value={t.kluc}>
                    {t.nazov}
                  </option>
                ))}
              </select>
              <button
                onClick={regenerate}
                disabled={busy || !regenKluc}
                className="rounded-md bg-daka px-3 py-1.5 font-medium text-white hover:bg-daka-dark disabled:opacity-50"
              >
                {busy ? "Generujem…" : "Generovať"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-white p-6 text-sm leading-relaxed">
          {rec.transcript ? (
            rec.transcript.segments.length > 0 ? (
              <div className="space-y-2">
                {(() => {
                  const speakers = [
                    ...new Set(
                      rec.transcript.segments
                        .map((s) => s.speaker)
                        .filter((x): x is string => !!x),
                    ),
                  ];
                  const tid = rec.transcript.id;
                  return speakers.length > 0 ? (
                    <div className="mb-3 flex flex-wrap items-center gap-2 border-b pb-3 text-xs text-slate-500">
                      <span>Hovoriaci:</span>
                      {speakers.map((sp) => (
                        <button
                          key={sp}
                          onClick={async () => {
                            const to = window.prompt(`Premenovať „${sp}" na:`, sp);
                            if (!to || to === sp) return;
                            await api.patch(`/transcripts/${tid}/speaker`, {
                              from: sp,
                              to,
                            });
                            await load();
                          }}
                          className="rounded-full border px-2 py-0.5 hover:bg-slate-50"
                          title="Kliknutím premenuješ"
                        >
                          {sp} ✎
                        </button>
                      ))}
                    </div>
                  ) : null;
                })()}
                {rec.transcript.segments.map((s) => (
                  <p key={s.id}>
                    <span className="mr-2 font-mono text-xs text-slate-400">
                      {formatTime(s.startSek)}
                    </span>
                    {s.speaker && (
                      <span className="mr-1 font-medium text-daka-dark">{s.speaker}:</span>
                    )}
                    {s.text}
                  </p>
                ))}
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{rec.transcript.plnyText}</p>
            )
          ) : (
            <p className="text-slate-400">Prepis zatiaľ nie je k dispozícii.</p>
          )}
        </div>
      )}
    </AppShell>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Recorder } from "@/components/Recorder";
import { api, uploadToStorage } from "@/lib/api";
import { DEMO } from "@/lib/demo";
import type { RecordingType } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/labels";

const TYPES: RecordingType[] = ["KONZULTACIA", "PORADA", "DODAVATEL", "INE"];

export default function NovaNahravkaPage() {
  const router = useRouter();
  const [nazov, setNazov] = useState("");
  const [typ, setTyp] = useState<RecordingType>("KONZULTACIA");
  const [suhlas, setSuhlas] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotovo, setHotovo] = useState<number | null>(null);

  async function uploadAndCreate(blob: Blob, mime: string, durationSek: number) {
    setError(null);
    if (!nazov.trim()) {
      setError("Zadaj názov nahrávky.");
      return;
    }
    if (typ === "KONZULTACIA" && !suhlas) {
      setError("Pri konzultácii potvrď súhlas klienta s nahrávaním (GDPR).");
      return;
    }

    // V online demo niet backendu — nahrávku len zaznamenáme a ukážeme výsledok.
    if (DEMO) {
      setHotovo(durationSek);
      return;
    }

    setBusy(true);
    try {
      const pripona = mime.includes("webm") ? "webm" : "mp4";
      const { key, url } = await api.post<{ key: string; url: string }>(
        "/recordings/upload-url",
        { contentType: mime, pripona },
      );
      await uploadToStorage(url, blob, mime);
      const rec = await api.post<{ id: string }>("/recordings", {
        nazov,
        typ,
        audioKey: key,
        dlzkaSek: durationSek,
        jazyk: "sk",
        zdroj: "WEB",
      });
      if (typ === "KONZULTACIA") {
        await api.post(`/recordings/${rec.id}/consent`, {
          sposob: "USTNY_V_NAHRAVKE",
        });
      }
      router.replace(`/nahravky/${rec.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nahranie zlyhalo");
      setBusy(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadAndCreate(file, file.type || "audio/mpeg", 0);
  }

  return (
    <AppShell>
      <h1 className="mb-4 text-xl font-semibold">Nová nahrávka</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {hotovo !== null ? (
        <div className="space-y-4 rounded-xl border bg-white p-6 text-center">
          <div className="text-4xl">✅</div>
          <h2 className="text-lg font-semibold text-daka-dark">
            Nahrávka zaznamenaná ({hotovo}s)
          </h2>
          <p className="mx-auto max-w-md text-sm text-slate-600">
            Toto je online <strong>demo</strong> bez servera, takže prepis a AI
            zhrnutie sa tu nevykonajú. V plnej verzii (s backendom a OpenAI) sa
            nahrávka automaticky prepíše a vytvorí sa profil klienta a zhrnutie —
            takto:
          </p>
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
            <Link
              href="/nahravky/demo-konzultacia"
              className="rounded-md bg-daka px-4 py-2 text-sm font-medium text-white hover:bg-daka-dark"
            >
              Pozri ukážkový výstup →
            </Link>
            <button
              onClick={() => {
                setHotovo(null);
                setNazov("");
              }}
              className="rounded-md border px-4 py-2 text-sm hover:bg-slate-50"
            >
              Nahrať ďalšiu
            </button>
          </div>
        </div>
      ) : (
      <div className="space-y-4 rounded-xl border bg-white p-6">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Názov</span>
          <input
            value={nazov}
            onChange={(e) => setNazov(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-daka"
            placeholder="napr. Konzultácia – rodina Nováková"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Typ rozhovoru</span>
          <select
            value={typ}
            onChange={(e) => setTyp(e.target.value as RecordingType)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-daka"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </label>

        {typ === "KONZULTACIA" && (
          <label className="flex items-start gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={suhlas}
              onChange={(e) => setSuhlas(e.target.checked)}
              className="mt-1"
            />
            <span>
              Klient bol informovaný a súhlasí s nahrávaním rozhovoru (GDPR).
            </span>
          </label>
        )}

        <Recorder onReady={uploadAndCreate} />

        <div className="border-t pt-4 text-sm">
          <span className="mb-1 block font-medium text-slate-700">
            …alebo nahraj audio súbor
          </span>
          <input
            type="file"
            accept="audio/*"
            disabled={busy}
            onChange={onFile}
            className="block w-full text-slate-600"
          />
        </div>

        {busy && <p className="text-sm text-daka">Nahrávam a spúšťam spracovanie…</p>}
      </div>
      )}
    </AppShell>
  );
}

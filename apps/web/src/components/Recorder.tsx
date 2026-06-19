"use client";

import { useRef, useState } from "react";

interface RecorderProps {
  onReady: (blob: Blob, mime: string, durationSek: number) => void;
}

/** Nahrávanie cez mikrofón prehliadača (MediaRecorder). */
export function Recorder({ onReady }: RecorderProps) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(0);

  async function start() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        const dur = Math.round((Date.now() - startedRef.current) / 1000);
        onReady(blob, mime, dur);
      };
      recorder.start();
      mediaRef.current = recorder;
      startedRef.current = Date.now();
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      setError("Nepodarilo sa získať prístup k mikrofónu.");
    }
  }

  function stop() {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="rounded-lg border bg-slate-50 p-6 text-center">
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <div className="mb-4 text-3xl font-mono tabular-nums text-slate-700">
        {mm}:{ss}
      </div>
      {!recording ? (
        <button
          type="button"
          onClick={start}
          className="rounded-full bg-red-600 px-6 py-2 font-medium text-white hover:bg-red-700"
        >
          ● Začať nahrávať
        </button>
      ) : (
        <button
          type="button"
          onClick={stop}
          className="rounded-full bg-slate-800 px-6 py-2 font-medium text-white hover:bg-slate-900"
        >
          ■ Zastaviť
        </button>
      )}
    </div>
  );
}

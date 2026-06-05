"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/nahravky");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prihlásenie zlyhalo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-2xl font-semibold text-daka-dark">🎙️ DAKA Hlas</h1>
        <p className="mb-6 text-sm text-slate-500">
          Prihlás sa do AI hlasového asistenta CK DAKA.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <label className="mb-3 block text-sm">
          <span className="mb-1 block font-medium text-slate-700">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-daka"
            placeholder="meno@ckdaka.sk"
          />
        </label>

        <label className="mb-6 block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Heslo</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:border-daka"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-md bg-daka py-2 font-medium text-white hover:bg-daka-dark disabled:opacity-60"
        >
          {busy ? "Prihlasujem…" : "Prihlásiť sa"}
        </button>
      </form>
    </div>
  );
}

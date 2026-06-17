"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { DEMO } from "@/lib/demo";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Načítavam…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {DEMO && (
        <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
          Demo režim — ukážkové dáta. Zmeny sa neukladajú. (Pre reálnu prevádzku
          spustite appku s backendom.)
        </div>
      )}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/nahravky" className="flex items-center gap-2 font-semibold text-daka-dark">
            🎙️ DAKA Hlas
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/nahravky" className="hover:text-daka">
              Nahrávky
            </Link>
            {(user.role === "ADMIN" || user.role === "MANAGER") && (
              <Link href="/dashboard" className="hover:text-daka">
                Prehľad
              </Link>
            )}
            {user.role === "ADMIN" && (
              <>
                <Link href="/admin/glosar" className="hover:text-daka">
                  Glosár
                </Link>
                <Link href="/admin/sablony" className="hover:text-daka">
                  Šablóny
                </Link>
                <Link href="/admin/integracie" className="hover:text-daka">
                  Integrácie
                </Link>
                <Link href="/admin/audit" className="hover:text-daka">
                  Audit
                </Link>
              </>
            )}
            <Link
              href="/nahravky/nova"
              className="rounded-md bg-daka px-3 py-1.5 font-medium text-white hover:bg-daka-dark"
            >
              + Nová nahrávka
            </Link>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">{user.meno}</span>
            <button
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              className="text-slate-500 hover:text-red-600"
            >
              Odhlásiť
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

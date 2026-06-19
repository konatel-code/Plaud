"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { DEMO } from "@/lib/demo";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

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

  const links: { href: string; label: string }[] = [
    { href: "/nahravky", label: "Nahrávky" },
  ];
  if (user.role === "ADMIN" || user.role === "MANAGER")
    links.push({ href: "/dashboard", label: "Prehľad" });
  if (user.role === "ADMIN")
    links.push(
      { href: "/admin/glosar", label: "Glosár" },
      { href: "/admin/sablony", label: "Šablóny" },
      { href: "/admin/integracie", label: "Integrácie" },
      { href: "/admin/audit", label: "Audit" },
    );

  function doLogout() {
    setMenuOpen(false);
    logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-screen">
      {DEMO && (
        <div className="bg-amber-400 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
          Demo režim — ukážkové dáta. Zmeny sa neukladajú.
        </div>
      )}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/nahravky"
            className="flex items-center gap-2 font-semibold text-daka-dark"
          >
            🎙️ DAKA Hlas
          </Link>

          {/* Desktop navigácia */}
          <nav className="hidden items-center gap-4 text-sm md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-daka">
                {l.label}
              </Link>
            ))}
            <Link
              href="/nahravky/nova"
              className="rounded-md bg-daka px-3 py-1.5 font-medium text-white hover:bg-daka-dark"
            >
              + Nová
            </Link>
            <span className="text-slate-400">|</span>
            <span className="max-w-[10rem] truncate text-slate-600">{user.meno}</span>
            <button onClick={doLogout} className="text-slate-500 hover:text-red-600">
              Odhlásiť
            </button>
          </nav>

          {/* Mobilné tlačidlá */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/nahravky/nova"
              className="rounded-md bg-daka px-3 py-1.5 text-sm font-medium text-white"
            >
              + Nová
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-md border p-2 text-slate-600"
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>

        {/* Mobilné rozbaľovacie menu */}
        {menuOpen && (
          <nav className="border-t bg-white px-4 py-2 text-sm md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block rounded-md px-2 py-2 hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-1 flex items-center justify-between border-t px-2 pt-2 text-slate-600">
              <span className="truncate">{user.meno}</span>
              <button onClick={doLogout} className="text-red-600">
                Odhlásiť
              </button>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}

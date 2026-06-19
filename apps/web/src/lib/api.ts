import { DEMO, DEMO_USER, demoResponse } from "./demo";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "daka_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  if (DEMO) {
    if (path === "/auth/login") {
      return { accessToken: "demo-token", user: DEMO_USER } as T;
    }
    if (path === "/auth/me") {
      if (!getToken()) throw new Error("Neprihlásený");
      return DEMO_USER as T;
    }
    return demoResponse<T>(method, path);
  }

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.message ?? detail;
    } catch {
      /* ignore */
    }
    throw new Error(typeof detail === "string" ? detail : "Chyba požiadavky");
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
  baseUrl: BASE,
};

/** Stiahne súbor z API (s autorizáciou) a spustí uloženie v prehliadači. */
export async function downloadFile(path: string, fallbackName: string) {
  if (DEMO) {
    const blob = new Blob(
      [
        "DAKA Hlas – ukážkový export (demo režim)\n\n" +
          "V plnej verzii sa tu stiahne reálny prepis a zhrnutie vo formáte MD/HTML/DOCX.",
      ],
      { type: "text/plain" },
    );
    triggerDownload(blob, fallbackName);
    return;
  }
  const token = getToken();
  const res = await fetch(`${BASE}/api${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Export zlyhal");
  triggerDownload(await res.blob(), fallbackName);
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Nahrá súbor priamo do object storage cez pre-signed URL. */
export async function uploadToStorage(
  url: string,
  blob: Blob,
  contentType: string,
) {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!res.ok) throw new Error("Nahranie audia zlyhalo");
}

import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const BASE =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  "http://localhost:4000";

const TOKEN_KEY = "daka_access_token";
let token: string | null = null;

export async function loadToken(): Promise<string | null> {
  token = await SecureStore.getItemAsync(TOKEN_KEY);
  return token;
}

export async function setToken(value: string | null) {
  token = value;
  if (value) await SecureStore.setItemAsync(TOKEN_KEY, value);
  else await SecureStore.deleteItemAsync(TOKEN_KEY);
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
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
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body?: unknown) => request<T>("POST", path, body),
  patch: <T>(path: string, body?: unknown) => request<T>("PATCH", path, body),
  del: <T>(path: string) => request<T>("DELETE", path),
  baseUrl: BASE,
};

/** Nahrá audio (file URI z expo-av) cez API (multipart) a vytvorí nahrávku. */
export async function uploadRecording(
  fileUri: string,
  fields: Record<string, string>,
  fileName = "nahravka.m4a",
  contentType = "audio/m4a",
): Promise<{ id: string }> {
  const form = new FormData();
  // React Native FormData súbor:
  form.append("audio", { uri: fileUri, name: fileName, type: contentType } as any);
  for (const [k, v] of Object.entries(fields)) form.append(k, v);

  const res = await fetch(`${BASE}/api/recordings/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  if (!res.ok) throw new Error("Nahranie zlyhalo");
  return (await res.json()) as { id: string };
}

/** Nahrá lokálny súbor (file URI z expo-av) do storage cez pre-signed URL. */
export async function uploadToStorage(
  url: string,
  fileUri: string,
  contentType: string,
) {
  const file = await fetch(fileUri);
  const blob = await file.blob();
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!res.ok) throw new Error("Nahranie audia zlyhalo");
}

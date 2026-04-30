import { CONFIG_VERSION, STORAGE_KEY } from "./constants.js";

export function loadFromStorage() {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
  } catch {
    // Corrupt blob — discard, will be overwritten on next save
  }
  return null;
}

export function saveToStorage(snapshot) {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    const payload = { ...snapshot, version: CONFIG_VERSION, savedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota exceeded or serialization issue — silently ignore
  }
}

export function clearStorage() {
  if (typeof window === "undefined" || !window.localStorage) return;
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

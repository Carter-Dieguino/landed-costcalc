import '@testing-library/jest-dom/vitest';

// fetch mock por defecto: la app llama a open.er-api.com al montar y
// no queremos pegar a la red en tests. Cada test puede sobrescribir.
beforeEach(() => {
  globalThis.fetch = vi.fn(async () => ({
    ok: true,
    json: async () => ({ rates: { MXN: 18.5 } }),
  }));
});

afterEach(() => {
  if (typeof window !== 'undefined') window.localStorage?.clear();
});

// matchMedia stub (CalcContext lo usa para tema)
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

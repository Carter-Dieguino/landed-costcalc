import { describe, it, expect, beforeEach } from 'vitest';
import { loadFromStorage, saveToStorage, clearStorage } from './storage.js';
import { STORAGE_KEY } from './constants.js';

describe('storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('returns null when nothing stored', () => {
    expect(loadFromStorage()).toBeNull();
  });

  it('round-trips a snapshot', () => {
    const snap = { project: { name: 'X' }, params: { fx: 18.5 } };
    saveToStorage(snap);
    const loaded = loadFromStorage();
    expect(loaded.project.name).toBe('X');
    expect(loaded.params.fx).toBe(18.5);
    expect(loaded.savedAt).toBeDefined();
    expect(loaded.version).toBeDefined();
  });

  it('clearStorage removes the key', () => {
    saveToStorage({ x: 1 });
    expect(window.localStorage.getItem(STORAGE_KEY)).not.toBeNull();
    clearStorage();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns null on corrupt blob', () => {
    window.localStorage.setItem(STORAGE_KEY, '{not valid json');
    expect(loadFromStorage()).toBeNull();
  });
});

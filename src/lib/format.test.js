import { describe, it, expect } from 'vitest';
import { fmtUSD, fmtMXN, pct, clamp, money, sanitizeNumericInput } from './format.js';

describe('format helpers', () => {
  describe('fmtUSD', () => {
    it('formats integer-ish values without decimals', () => {
      expect(fmtUSD(1234)).toMatch(/USD/);
      expect(fmtUSD(1234)).toMatch(/1,234/);
    });

    it('formats sub-$10 with 2-3 decimals', () => {
      expect(fmtUSD(2.5)).toMatch(/2\.50/);
      expect(fmtUSD(0.005)).toMatch(/0\.005/);
    });

    it('handles undefined and zero', () => {
      expect(fmtUSD(undefined)).toMatch(/0/);
      expect(fmtUSD(0)).toMatch(/0/);
    });
  });

  describe('fmtMXN', () => {
    it('formats numbers with es-MX grouping and the $ symbol', () => {
      // Intl en es-MX usa "$50,000" (sin la palabra MXN) porque MXN es la moneda local.
      expect(fmtMXN(50000)).toMatch(/50,000/);
      expect(fmtMXN(50000)).toContain('$');
    });

    it('uses 0 fraction digits', () => {
      expect(fmtMXN(1234.56)).not.toMatch(/\.56/);
    });
  });

  describe('pct', () => {
    it('returns percentage rounded', () => {
      expect(pct(25, 100)).toBe(25);
      expect(pct(33, 100)).toBe(33);
    });
    it('returns 0 when total is 0 or negative', () => {
      expect(pct(50, 0)).toBe(0);
      expect(pct(50, -10)).toBe(0);
    });
  });

  describe('clamp', () => {
    it('clamps to bounds', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-1, 0, 10)).toBe(0);
      expect(clamp(11, 0, 10)).toBe(10);
    });
  });

  describe('money', () => {
    it('rounds to 2 decimals (float-tolerant)', () => {
      expect(money(1.234567)).toBe(1.23);
      expect(money(10)).toBe(10);
      expect(money(2.999)).toBe(3);
    });
  });

  describe('sanitizeNumericInput', () => {
    it('strips non-digits in integer mode', () => {
      expect(sanitizeNumericInput('abc123', 'integer')).toBe('123');
      expect(sanitizeNumericInput('1.5', 'integer')).toBe('15');
    });

    it('preserves single decimal point in decimal mode', () => {
      expect(sanitizeNumericInput('1.5', 'decimal')).toBe('1.5');
      expect(sanitizeNumericInput('1.5.7', 'decimal')).toBe('1.57');
      expect(sanitizeNumericInput('a.b1.5', 'decimal')).toBe('.15');
    });

    it('converts comma to dot in decimal mode', () => {
      expect(sanitizeNumericInput('1,5', 'decimal')).toBe('1.5');
    });
  });
});

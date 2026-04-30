import { describe, it, expect } from 'vitest';
import {
  ISN_ESTADOS,
  CARGA_SOCIAL_MX,
  getCargaSocialFactor,
  RETENCIONES_EXTRANJERO,
  US_FEDERAL_2026,
  US_ESTATAL,
  calcISRFisicaAnual,
} from './fiscal.js';

describe('ISN_ESTADOS shape', () => {
  it('covers 32 estados', () => {
    expect(ISN_ESTADOS).toHaveLength(32);
  });

  it('every estado has id, label, tasa', () => {
    for (const e of ISN_ESTADOS) {
      expect(typeof e.id).toBe('string');
      expect(typeof e.label).toBe('string');
      expect(typeof e.tasa).toBe('number');
      expect(e.tasa).toBeGreaterThanOrEqual(0);
      expect(e.tasa).toBeLessThan(0.10);
    }
  });

  it('CDMX has the expected 4% rate (subió 2026)', () => {
    expect(ISN_ESTADOS.find((e) => e.id === 'cdmx').tasa).toBe(0.04);
  });
});

describe('CARGA_SOCIAL_MX', () => {
  it('every component has pct between 0 and 1', () => {
    for (const c of CARGA_SOCIAL_MX) {
      expect(c.pct).toBeGreaterThan(0);
      expect(c.pct).toBeLessThan(1);
    }
  });

  it('IMSS dominates the breakdown', () => {
    const imss = CARGA_SOCIAL_MX.find((c) => c.id === 'imss');
    expect(imss.pct).toBeGreaterThan(0.15);
  });
});

describe('getCargaSocialFactor', () => {
  it('default CDMX with PTU + 15-day aguinaldo lands ~36-37%', () => {
    const f = getCargaSocialFactor({ stateId: 'cdmx', includePTU: true, aguinaldo30Dias: false });
    expect(f).toBeGreaterThan(0.33);
    expect(f).toBeLessThan(0.40);
  });

  it('switching to BC (1.8% ISN) reduces factor', () => {
    const cdmx = getCargaSocialFactor({ stateId: 'cdmx' });
    const bc = getCargaSocialFactor({ stateId: 'bc' });
    expect(bc).toBeLessThan(cdmx);
  });

  it('aguinaldo 30 días raises the factor by ~4 pts', () => {
    const f15 = getCargaSocialFactor({ stateId: 'cdmx', aguinaldo30Dias: false });
    const f30 = getCargaSocialFactor({ stateId: 'cdmx', aguinaldo30Dias: true });
    expect(f30 - f15).toBeCloseTo(0.0833 - 0.042, 2);
  });

  it('opting out of PTU lowers factor by ~4.2 pts', () => {
    const withPTU = getCargaSocialFactor({ includePTU: true });
    const noPTU = getCargaSocialFactor({ includePTU: false });
    expect(withPTU - noPTU).toBeCloseTo(0.042, 2);
  });

  it('unknown state falls back to 3% ISN', () => {
    const f = getCargaSocialFactor({ stateId: 'xxx' });
    const cdmx = getCargaSocialFactor({ stateId: 'cdmx' });
    // CDMX is 4%, fallback 3% → factor cdmx ~1pt higher
    expect(cdmx - f).toBeCloseTo(0.01, 2);
  });
});

describe('RETENCIONES_EXTRANJERO', () => {
  it('software royalty: 25% general, 10% with USA treaty', () => {
    const r = RETENCIONES_EXTRANJERO.find((x) => x.id === 'regalia_software');
    expect(r.general).toBe(0.25);
    expect(r.tratadoUSA).toBe(0.10);
  });

  it('REFIPRE flat 40%, no treaty', () => {
    const r = RETENCIONES_EXTRANJERO.find((x) => x.id === 'refipre');
    expect(r.general).toBe(0.40);
    expect(r.tratadoUSA).toBe(0.40);
  });
});

describe('US_FEDERAL_2026', () => {
  it('SS wage base 2026 around $176k', () => {
    expect(US_FEDERAL_2026.ssEmployer.wageBaseUSD).toBeGreaterThan(170000);
    expect(US_FEDERAL_2026.ssEmployer.wageBaseUSD).toBeLessThan(190000);
  });

  it('Medicare 1.45% with no cap', () => {
    expect(US_FEDERAL_2026.medicare.tasa).toBe(0.0145);
  });

  it('FUTA effective rate is 0.6% on $7k', () => {
    expect(US_FEDERAL_2026.futa.tasa).toBeCloseTo(0.006);
    expect(US_FEDERAL_2026.futa.wageBaseUSD).toBe(7000);
  });

  it('C-Corp federal flat 21%', () => {
    expect(US_FEDERAL_2026.cCorp.tasa).toBe(0.21);
  });
});

describe('US_ESTATAL', () => {
  it('includes the 5 reference states', () => {
    const ids = US_ESTATAL.map((e) => e.id);
    expect(ids).toEqual(expect.arrayContaining(['us_ca', 'us_tx', 'us_ny', 'us_fl', 'us_de']));
  });

  it('Texas has zero PF income tax', () => {
    expect(US_ESTATAL.find((e) => e.id === 'us_tx').incomePF.tasa).toBe(0);
  });
});

describe('calcISRFisicaAnual', () => {
  it('zero income → zero ISR', () => {
    expect(calcISRFisicaAnual(0)).toBe(0);
  });

  it('500k income falls into the ~21% bracket', () => {
    const isr = calcISRFisicaAnual(500000);
    expect(isr).toBeGreaterThan(80000);
    expect(isr).toBeLessThan(140000);
  });

  it('higher income = higher ISR (monotonic)', () => {
    expect(calcISRFisicaAnual(1000000)).toBeGreaterThan(calcISRFisicaAnual(500000));
    expect(calcISRFisicaAnual(5000000)).toBeGreaterThan(calcISRFisicaAnual(1000000));
  });
});

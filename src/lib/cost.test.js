import { describe, it, expect } from 'vitest';
import {
  getRoleMonthlyMXN,
  getStackVariableState,
  getStackCost,
  getAIDefaultUsage,
  getAIUsageState,
  getAICost,
  getCatalogItemUSD,
  sumCatalog,
} from './cost.js';

describe('getRoleMonthlyMXN', () => {
  const role = { minMXN: 20000, maxMXN: 80000 };

  it('returns min for junior', () => {
    expect(getRoleMonthlyMXN(role, 'min')).toBe(20000);
  });
  it('returns max for senior', () => {
    expect(getRoleMonthlyMXN(role, 'max')).toBe(80000);
  });
  it('returns mid average for default/mid', () => {
    expect(getRoleMonthlyMXN(role, 'mid')).toBe(50000);
    expect(getRoleMonthlyMXN(role, undefined)).toBe(50000);
  });
});

describe('getStackVariableState', () => {
  it('returns existing variable state if present', () => {
    const state = { stripe: { mode: 'fixed', rate: 200, quantity: 1, label: 'mx' } };
    expect(getStackVariableState(state, { id: 'stripe' })).toEqual(state.stripe);
  });

  it('infers per_user mode when unit mentions usuario', () => {
    expect(getStackVariableState({}, { id: 'gh', unit: 'por usuario' })).toMatchObject({ mode: 'per_user' });
  });

  it('infers usage mode otherwise', () => {
    expect(getStackVariableState({}, { id: 'sg', unit: 'por consumo' })).toMatchObject({ mode: 'usage' });
  });

  it('uses 0 rate for free tools', () => {
    expect(getStackVariableState({}, { id: 'free', unit: 'gratis' })).toMatchObject({ rate: 0 });
  });
});

describe('getStackCost', () => {
  it('multiplies usd by qty for fixed-price items', () => {
    const item = { id: 'gh', usd: 4 };
    expect(getStackCost(item, { gh: 5 }, {})).toBe(20);
  });

  it('uses fixed mode rate for variables', () => {
    const item = { id: 'x', usd: 0 };
    const variable = { x: { mode: 'fixed', rate: 100, quantity: 0, label: '' } };
    expect(getStackCost(item, {}, variable)).toBe(100);
  });

  it('multiplies rate by quantity for usage mode', () => {
    const item = { id: 'x', usd: 0 };
    const variable = { x: { mode: 'usage', rate: 0.5, quantity: 1000, label: 'tx' } };
    expect(getStackCost(item, {}, variable)).toBe(500);
  });
});

describe('getAIDefaultUsage', () => {
  it('returns monthly default for monthly billing', () => {
    expect(getAIDefaultUsage({ billing: 'monthly', monthlyUSD: 50 })).toEqual({ units: 50, tokensM: 0, outputTokensM: 0 });
  });
  it('returns usage default for usage billing', () => {
    expect(getAIDefaultUsage({ billing: 'usage', defaultUnits: 200 })).toEqual({ units: 200, tokensM: 0, outputTokensM: 0 });
  });
  it('returns 1M tokens default with 0.43 output ratio', () => {
    expect(getAIDefaultUsage({ billing: 'tokens' })).toEqual({ units: 0, tokensM: 1, outputTokensM: 0.43 });
  });
});

describe('getAIUsageState (back-compat)', () => {
  it('derives outputTokensM from input * 0.43 if missing (legacy state)', () => {
    const state = getAIUsageState({ openai: { units: 0, tokensM: 5 } }, { id: 'openai', billing: 'tokens' });
    expect(state.outputTokensM).toBeCloseTo(5 * 0.43);
  });
  it('preserves explicit outputTokensM', () => {
    const state = getAIUsageState({ openai: { tokensM: 5, outputTokensM: 2 } }, { id: 'openai', billing: 'tokens' });
    expect(state.outputTokensM).toBe(2);
  });
});

describe('getAICost', () => {
  it('returns monthlyUSD for monthly billing', () => {
    const item = { id: 'pinecone', billing: 'monthly', monthlyUSD: 70 };
    expect(getAICost(item, {})).toBe(70);
  });

  it('multiplies rate × units for usage billing', () => {
    const item = { id: 'whisper', billing: 'usage', rateUSD: 0.006, defaultUnits: 1000 };
    expect(getAICost(item, {})).toBeCloseTo(6);
  });

  it('uses separate input/output tokens for tokens billing', () => {
    const item = { id: 'gpt4', billing: 'tokens', inputPer1M: 2.5, outputPer1M: 10 };
    const cost = getAICost(item, { gpt4: { tokensM: 10, outputTokensM: 4 } });
    // 10 * 2.5 + 4 * 10 = 25 + 40 = 65
    expect(cost).toBeCloseTo(65);
  });

  it('back-compat: derives output from input * 0.43 if missing', () => {
    const item = { id: 'gpt4', billing: 'tokens', inputPer1M: 2.5, outputPer1M: 10 };
    const cost = getAICost(item, { gpt4: { tokensM: 10 } });
    // 10 * 2.5 + 4.3 * 10 = 25 + 43 = 68
    expect(cost).toBeCloseTo(68);
  });
});

describe('getCatalogItemUSD', () => {
  it('uses usd field when present', () => {
    expect(getCatalogItemUSD({ usd: 25 }, 18)).toBe(25);
  });
  it('converts mxn → usd via fx', () => {
    expect(getCatalogItemUSD({ mxn: 18000 }, 18)).toBe(1000);
  });
  it('returns 0 when neither field is set', () => {
    expect(getCatalogItemUSD({}, 18)).toBe(0);
  });
});

describe('sumCatalog', () => {
  const catalog = [
    { id: 'a', usd: 10 },
    { id: 'b', mxn: 1800 },
    { id: 'c', usd: 5, perPerson: true },
  ];

  it('skips items not toggled on', () => {
    expect(sumCatalog(catalog, { a: false }, {}, 18)).toBe(0);
  });

  it('sums toggled items × default qty 1', () => {
    expect(sumCatalog(catalog, { a: true, b: true }, {}, 18)).toBe(110); // 10 + 100
  });

  it('multiplies by qty when present', () => {
    expect(sumCatalog(catalog, { a: true }, { a: 3 }, 18)).toBe(30);
  });

  it('autoscales perPerson items to totalPersonas when no qty', () => {
    expect(sumCatalog(catalog, { c: true }, {}, 18, 5)).toBe(25);
  });

  it('respects explicit qty over perPerson autoscale', () => {
    expect(sumCatalog(catalog, { c: true }, { c: 2 }, 18, 5)).toBe(10);
  });
});

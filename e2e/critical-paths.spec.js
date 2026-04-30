import { test, expect } from '@playwright/test';

// Bloqueo del fetch FX en cada test para que el TC default sea estable.
// El localStorage se limpia explícitamente en `goto`, no en addInitScript
// (porque addInitScript corre en cada navegación incluyendo page.reload).
test.beforeEach(async ({ context }) => {
  await context.route('**/open.er-api.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rates: { MXN: 18.5 } }) })
  );
});

async function gotoFresh(page) {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
}

test('app loads and shows brand + tabs', async ({ page }) => {
  await gotoFresh(page);
  await expect(page.getByText(/MX estimator/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /capital humano/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /resumen/i })).toBeVisible();
  await expect(page.getByText(/COSTO MENSUAL/i)).toBeVisible();
});

test('switching to Freelancer hides Comisiones and changes header label', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /^freelancer$/i }).click();
  await expect(page.getByRole('button', { name: /comisiones/i })).toHaveCount(0);
  await expect(page.getByText(/TARIFA \/ HORA/i)).toBeVisible();
});

test('switching to Organización shows BURN MENSUAL and Anual run-rate', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: 'Organización', exact: true }).click();
  // En modo org, el header muestra "Anual $..." y la etiqueta cambia a BURN MENSUAL.
  // CONTINGENCIA % desaparece (solo aparece en proyecto).
  await expect(page.locator('header').getByText(/BURN MENSUAL/)).toBeVisible();
  await expect(page.locator('header').getByText(/Anual/)).toBeVisible();
  await expect(page.locator('header').getByText(/CONTINGENCIA %/)).toHaveCount(0);
});

test('changing ISN state updates carga social factor live', async ({ page }) => {
  await gotoFresh(page);
  const factorLocator = page.getByText(/Factor real \d+\.\d+%/);
  const before = await factorLocator.textContent();
  // Tomo el primer combobox que tenga estados ISN — el value es el id del estado
  await page.locator('select').filter({ hasText: /CDMX/ }).selectOption('bc');
  const after = await factorLocator.textContent();
  expect(after).not.toBe(before);
});

test('localStorage persists state across reload', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /^freelancer$/i }).click();
  await expect(page.getByText(/TARIFA \/ HORA/i)).toBeVisible();
  // Espera a que el debounce de 500ms escriba a localStorage
  await page.waitForTimeout(800);
  await page.reload();
  await expect(page.getByText(/TARIFA \/ HORA/i)).toBeVisible();
});

test('export JSON triggers a download with the project payload', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /resumen/i }).click();
  await page.getByPlaceholder(/Mi sistema \/ app/i).fill('Test Project');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Guardar \.json/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^costcalc-test-project-\d+\.json$/);
});

test('export PDF triggers a PDF download (dynamic import)', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /resumen/i }).click();
  await page.getByPlaceholder(/Mi sistema \/ app/i).fill('PDF Test');

  const downloadPromise = page.waitForEvent('download', { timeout: 15_000 });
  await page.getByRole('button', { name: /Exportar \.pdf/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^estimacion-pdf-test-\d+\.pdf$/);
});

test('FX live indicator shows after auto-fetch', async ({ page }) => {
  await gotoFresh(page);
  await expect(page.getByRole('button', { name: /^LIVE$/i })).toBeVisible({ timeout: 5000 });
});

test('Resumen tab shows the 9 cost buckets in the breakdown', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /resumen/i }).click();
  for (const label of [
    'Capital humano', 'Equipos', 'Oficina & conectividad', 'Infraestructura',
    'Stack & SaaS', 'IA & ML', 'Beneficios', 'Movilidad', 'Admin & legal',
  ]) {
    await expect(page.getByText(label).first()).toBeVisible();
  }
});

test('Reset all returns to defaults and clears storage', async ({ page }) => {
  await gotoFresh(page);
  await page.getByRole('button', { name: /^freelancer$/i }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: /Limpiar todo/i }).click();
  await expect(page.getByText(/COSTO MENSUAL/i)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/COSTO MENSUAL/i)).toBeVisible();
});

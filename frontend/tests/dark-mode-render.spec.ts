import { test, expect, Page } from '@playwright/test';

async function setDarkMode(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('coreport-theme-mode', 'dark');
  });
}

async function registerAndLogin(page: Page) {
  const unique = Date.now();
  const workspace = `e2e-${unique}`;
  const email = `e2e-${unique}@example.com`;
  const password = 'Password123!';

  await page.goto('/login');

  await page.getByLabel('Workspace').fill(workspace);
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('button', { name: "Don't have an account? Create one" }).click();
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create Account' }).click();

  await expect(page).toHaveURL('/');
}

test('app renders in dark mode with key components visible', async ({ page }) => {
  await setDarkMode(page);
  await registerAndLogin(page);

  // Topbar
  await expect(page.getByAltText('Coreport Logo')).toBeVisible();
  await expect(page.getByPlaceholder('Search...')).toBeVisible();

  // Sidebar
  await expect(page.locator('button[aria-label="Toggle sidebar"]')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();

  // A Paper/Card surface in the main content
  const surface = page.getByTestId('home-surface');
  await expect(surface).toBeVisible();

  // Confirm dark mode actually affected surface styling (not white)
  const surfaceBg = await surface.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(surfaceBg).not.toBe('rgb(255, 255, 255)');

  await page.screenshot({ path: '../artifacts/task-7-dark-mode.png', fullPage: true });
});

import { test, expect, Page } from '@playwright/test';

async function setSystemPreference(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem('coreport-theme-mode', 'system');
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

test('theme preference "system" follows prefers-color-scheme and persists', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await setSystemPreference(page);
  await registerAndLogin(page);

  // Preference persisted.
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem('coreport-theme-mode')))
    .toBe('system');

  // Open theme menu and verify resolved mode reflects system.
  await page.getByRole('button', { name: 'Theme mode' }).click();
  await expect(page.getByText('System')).toBeVisible();
  await expect(page.getByText('Currently dark')).toBeVisible();

  // Switch OS scheme to light; UI should follow.
  await page.emulateMedia({ colorScheme: 'light' });

  // Re-open menu to read updated secondary label.
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Theme mode' }).click();
  await expect(page.getByText('Currently light')).toBeVisible();

  await page.screenshot({ path: '../artifacts/task-8-theme-system-mode.png', fullPage: true });
});

import { test, expect, Page } from '@playwright/test';

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

test('shows notification badge in topbar', async ({ page }) => {
  await registerAndLogin(page);

  const notifButton = page.locator('button[aria-label="Notifications"]');
  await expect(notifButton).toBeVisible();
  await expect(notifButton).toContainText('3');

  await page.screenshot({ path: '../artifacts/task-4-notification-badge.png', fullPage: false });
});

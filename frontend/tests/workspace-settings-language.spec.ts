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

test('workspace settings: canonical data language persists', async ({ page }) => {
  await registerAndLogin(page);

  await page.goto('/admin/workspace-settings');
  const input = page.getByTestId('canonical-data-language-input');

  await expect(input).toBeVisible();

  await input.fill('ro');
  await page.getByTestId('save-workspace-settings').click();

  // reload and ensure persisted
  await page.reload();
  await expect(input).toHaveValue('ro');

  await page.screenshot({
    path: '../artifacts/task-13-workspace-settings-language.png',
    fullPage: false,
  });
});

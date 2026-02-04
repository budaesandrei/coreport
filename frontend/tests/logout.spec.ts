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

test('logout clears session and redirects to login', async ({ page }) => {
  await registerAndLogin(page);

  await expect(page.locator('button[aria-label="Notifications"]')).toBeVisible();

  await page.locator('button[aria-label="User menu"]').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(page).toHaveURL(/\/login/);

  const storage = await page.evaluate(() => ({
    token: localStorage.getItem('coreport.token'),
    workspaceId: localStorage.getItem('workspace_id'),
    workspaceName: localStorage.getItem('workspace_name'),
    inviteToken: localStorage.getItem('invite_token'),
  }));

  expect(storage.token).toBeNull();
  expect(storage.workspaceId).toBeNull();
  expect(storage.workspaceName).toBeNull();
  expect(storage.inviteToken).toBeNull();

  // Verify protected shell isn't accessible without login.
  await page.goto('/');
  await expect(page.getByLabel('Workspace')).toBeVisible();
  await expect(page.locator('button[aria-label="Notifications"]')).toHaveCount(0);

  await page.screenshot({ path: '../artifacts/task-6-logout.png', fullPage: false });
});

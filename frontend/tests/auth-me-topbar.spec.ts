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

  return { workspace, email, password };
}

test('login populates user from /auth/me and shows it in Topbar', async ({ page }) => {
  const { email } = await registerAndLogin(page);

  await expect(page.locator('[data-testid="topbar-user-avatar"]')).toBeVisible();
  await expect(page.locator('[data-testid="topbar-user-avatar"]')).toHaveText('E2');

  await page.locator('button[aria-label="User menu"]').click();
  await expect(page.locator('[data-testid="user-menu-identity"]')).toContainText(email);

  await page.screenshot({ path: '../artifacts/task-15-wire-me.png', fullPage: false });
});

test('invalid token forces logout and redirects to /login', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('coreport.token', 'not-a-real-token');
    localStorage.setItem('workspace_id', 'some-workspace');
    localStorage.setItem('workspace_name', 'Some Workspace');
  });

  await page.goto('/');

  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByLabel('Workspace')).toBeVisible();
});

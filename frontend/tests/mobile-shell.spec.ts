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

test.describe('mobile shell', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('sidebar is an overlay drawer on mobile and can be opened from the topbar', async ({ page }) => {
    await registerAndLogin(page);

    const navButton = page.getByRole('button', { name: 'Open navigation' });
    await expect(navButton).toBeVisible();

    const drawer = page.locator('[data-testid="sidebar-drawer"]');

    // Drawer should start closed
    await expect(drawer).toBeHidden();

    // Open drawer
    await navButton.click();
    await expect(drawer).toHaveCount(1);
    await expect(drawer).toBeVisible();

    // Nav items should be usable on mobile
    await expect(page.getByRole('button', { name: 'Home' })).toBeVisible();

    // Clicking a nav item should close the drawer (so content remains usable)
    await page.getByRole('button', { name: 'Home' }).click();
    await expect(drawer).toBeHidden();
  });
});

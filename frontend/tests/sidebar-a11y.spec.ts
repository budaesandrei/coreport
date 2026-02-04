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

test('collapsed sidebar has tooltips, aria-labels, and keyboard navigation', async ({ page }) => {
  await registerAndLogin(page);

  // Collapse sidebar (icon-only)
  const toggle = page.locator('button[aria-label="Toggle sidebar"]');
  await expect(toggle).toBeVisible();
  await toggle.click();

  // Verify aria-labels exist on a few nav items (used as accessible names when collapsed)
  const home = page.getByRole('button', { name: 'Home' });
  const workspace = page.getByRole('button', { name: 'Workspace' });
  const activity = page.getByRole('button', { name: 'Activity' });

  await expect(home).toBeVisible();
  await expect(workspace).toBeVisible();
  await expect(activity).toBeVisible();

  // Keyboard navigation: tab order should move focus through nav items.
  // (Tab order can include topbar actions first, so we anchor focus on the sidebar toggle.)
  await toggle.focus();
  await expect(toggle).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(home).toBeFocused();

  await page.keyboard.press('Tab');
  await expect(workspace).toBeFocused();

  // Tooltip appears on hover when collapsed
  await home.hover();
  const tooltip = page.locator('[role="tooltip"]').filter({ hasText: 'Home' });
  await expect(tooltip).toBeVisible();

  await page.screenshot({ path: '../artifacts/task-3-sidebar-a11y.png', fullPage: false });
});

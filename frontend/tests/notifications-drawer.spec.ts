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

test('notifications drawer opens and mark-as-read updates badge', async ({ page }) => {
  await registerAndLogin(page);

  const notifButton = page.locator('button[aria-label="Notifications"]');
  await expect(notifButton).toBeVisible();

  // Stub starts with 3 unread
  const badge = page.getByTestId('notifications-badge');
  await expect(badge).toBeVisible();
  await expect(badge).toHaveText('3');

  await notifButton.click();

  const drawerTitle = page.getByTestId('notifications-title');
  await expect(drawerTitle).toBeVisible();

  // Drawer shows either empty state or list (stub list by default)
  const empty = page.getByTestId('notifications-empty');
  const list = page.getByTestId('notifications-list');

  if (await empty.isVisible()) {
    await expect(empty).toContainText('No notifications');
  } else {
    await expect(list).toBeVisible();
    await expect(page.getByTestId('notification-unread')).toHaveCount(3);

    await page.getByLabel('Mark all as read').click();

    await expect(page.getByTestId('notification-unread')).toHaveCount(0);

    // Badge should hide once all are read
    await expect(badge).toBeHidden();
  }

  await page.screenshot({ path: '../artifacts/task-5-notifications-drawer.png', fullPage: false });
});

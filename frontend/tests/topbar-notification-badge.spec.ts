import { test, expect } from '@playwright/test';

test('shows notification badge in topbar', async ({ page }) => {
  await page.goto('/');

  const notifButton = page.locator('button[aria-label="Notifications"]');
  await expect(notifButton).toBeVisible();
  await expect(notifButton).toContainText('3');

  await page.screenshot({ path: '../artifacts/task-4-notification-badge.png', fullPage: false });
});

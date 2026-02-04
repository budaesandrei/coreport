import { test, expect, Page } from "@playwright/test";

async function registerAndLogin(page: Page) {
  const unique = Date.now();
  const workspace = `e2e-${unique}`;
  const email = `e2e-${unique}@example.com`;
  const password = "Password123!";

  await page.goto("/login");

  await page.getByLabel("Workspace").fill(workspace);
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("button", { name: "Don't have an account? Create one" }).click();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL("/");
}

test("multi-step layout renders for submission + field mapping flows", async ({ page }) => {
  await registerAndLogin(page);

  await page.goto("/submissions/new");
  await expect(page.getByTestId("multistep-flow-layout")).toBeVisible();
  await expect(page.getByLabel("Breadcrumb")).toBeVisible();
  await expect(page.getByRole("heading", { name: "New submission" })).toBeVisible();

  await page.goto("/field-mapping");
  await expect(page.getByTestId("multistep-flow-layout")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Field mapping" })).toBeVisible();
});

test("multi-step step navigation is compact on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 740 });
  await registerAndLogin(page);

  await page.goto("/field-mapping");

  const crumbs = page.getByTestId("multi-step-breadcrumbs");
  await expect(crumbs).toBeVisible();

  // On mobile, we show only current (and optionally previous).
  const count = await crumbs.locator("li").count();
  expect(count).toBeLessThanOrEqual(2);
});

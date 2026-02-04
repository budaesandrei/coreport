import { test, expect, Page } from "@playwright/test";

async function registerAndLogin(page: Page) {
  const unique = Date.now();
  const workspace = `e2e-${unique}`;
  const email = `e2e-${unique}@example.com`;
  const password = "Password123!";

  await page.goto("/login");

  await page.getByLabel("Workspace").fill(workspace);
  await page.getByRole("button", { name: "Continue" }).click();

  const toggleMode = page.getByRole("button", { name: "Don't have an account? Create one" });
  await expect(toggleMode).toBeVisible();
  await toggleMode.click({ force: true });
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create Account" }).click();

  await expect(page).toHaveURL("/");
}

test("breadcrumb renders and link navigates", async ({ page }) => {
  await registerAndLogin(page);

  await page.goto("/submissions/new");

  await expect(page.getByLabel("Breadcrumb")).toBeVisible();
  await expect(page.getByRole("link", { name: "Submissions" })).toBeVisible();
  await expect(page.getByTestId("breadcrumbs").getByText("New submission")).toBeVisible();

  await page.getByRole("link", { name: "Submissions" }).click();
  await expect(page).toHaveURL("/submissions");

  await page.screenshot({
    path: "../artifacts/task-9-breadcrumbs.png",
    fullPage: false,
  });
});

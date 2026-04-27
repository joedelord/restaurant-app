import { test, expect } from "@playwright/test";

test("menu page loads", async ({ page }) => {
  await page.goto("/menu");

  await expect(
    page.getByRole("heading", { name: /menu|ruokalista/i }),
  ).toBeVisible();
});

import { test, expect } from "@playwright/test";

const createTestJwt = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      user_id: 1,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );

  return `${header}.${payload}.test-signature`;
};

test("customer can log in", async ({ page }) => {
  const accessToken = createTestJwt();
  const refreshToken = createTestJwt();

  await page.route("**/api/users/login/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access: accessToken,
        refresh: refreshToken,
        user: {
          id: 1,
          email: "customer@test.com",
          first_name: "Test",
          last_name: "User",
          role: "customer",
        },
      }),
    });
  });

  await page.goto("/login");

  await page.locator('input[id="email"]').fill("customer@test.com");
  await page.locator('input[id="password"]').fill("password123");

  await page.getByRole("button", { name: /kirjaudu|login/i }).click();

  await expect(page).toHaveURL("/user");
});

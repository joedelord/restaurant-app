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

test("user can register and is logged in", async ({ page }) => {
  const accessToken = createTestJwt();
  const refreshToken = createTestJwt();

  await page.route("**/api/users/register/", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: 1,
          email: "newuser@test.com",
          first_name: "New",
          last_name: "User",
          role: "customer",
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.route("**/api/token/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        access: accessToken,
        refresh: refreshToken,
      }),
    });
  });

  await page.route("**/api/users/me/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        email: "newuser@test.com",
        first_name: "New",
        last_name: "User",
        role: "customer",
      }),
    });
  });

  await page.goto("/register");

  await page.locator('input[id="email"]').fill("newuser@test.com");
  await page.locator('input[id="email"]').fill("newuser@test.com");
  await page.locator('input[id="firstName"]').fill("New");
  await page.locator('input[id="lastName"]').fill("User");
  await page.locator('input[id="password"]').fill("password123");
  await page.locator('input[id="confirmPassword"]').fill("password123");

  await page.getByRole("button", { name: /register|rekisteröidy/i }).click();

  await expect(page).toHaveURL(/login|\/$/);
});

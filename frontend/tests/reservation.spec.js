import { test, expect } from "@playwright/test";

const createTestJwt = () => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      user_id: 1,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }),
  );
  const signature = "test-signature";

  return `${header}.${payload}.${signature}`;
};

test("logged in customer can create reservation", async ({ page }) => {
  const accessToken = createTestJwt();
  const refreshToken = createTestJwt();

  await page.addInitScript(
    ({ accessToken, refreshToken }) => {
      window.localStorage.setItem("access", accessToken);
      window.localStorage.setItem("refresh", refreshToken);
    },
    { accessToken, refreshToken },
  );

  await page.route("**/api/users/me/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        id: 1,
        email: "customer@test.com",
        first_name: "Test",
        last_name: "User",
        role: "customer",
      }),
    });
  });

  await page.route("**/api/tables/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        { id: 1, table_number: 1, seats: 2, is_active: true },
        { id: 2, table_number: 5, seats: 4, is_active: true },
      ]),
    });
  });

  await page.route("**/api/reservations/availability/?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        date: "2026-04-28",
        party_size: 2,
        slots: [
          {
            time: "18:00",
            available: true,
            available_tables: [1, 2],
          },
          {
            time: "18:30",
            available: false,
            available_tables: [],
          },
        ],
      }),
    });
  });

  await page.route("**/api/reservations/", async (route) => {
    if (route.request().method() === "POST") {
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          id: 100,
          reservation_time: "2026-04-28T18:00:00",
          party_size: 2,
          status: "pending",
          special_requests: "Window table",
          table: {
            id: 1,
            table_number: 1,
            seats: 2,
            is_active: true,
          },
        }),
      });
      return;
    }

    await route.continue();
  });

  await page.goto("/reservations");

  await page.locator('input[type="date"]').fill("2026-04-28");
  await page.locator('input[type="number"]').fill("2");

  const timeSlot = page.getByRole("button").filter({ hasText: "18:00" });
  await expect(timeSlot).toBeVisible();
  await timeSlot.click();

  const tableButton = page
    .getByRole("button")
    .filter({ hasText: /table 1|pöytä 1/i });

  await expect(tableButton).toBeVisible();
  await tableButton.click();

  await page.locator("textarea").fill("Window table");

  await page.getByRole("button", { name: /tarkista|review/i }).click();

  const dialog = page.getByRole("dialog");

  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("18:00");
  await expect(dialog).toContainText("Window table");

  await page.getByRole("button", { name: /vahvista|confirm/i }).click();

  await expect(
    page.getByText(/varaus luotu|onnistuneesti|reservation created/i),
  ).toBeVisible();
});

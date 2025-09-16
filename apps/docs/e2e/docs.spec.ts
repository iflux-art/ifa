import { expect, test } from "@playwright/test";

test.describe("Docs E2E Tests", () => {
  test("should load docs homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Docs/);
  });

  test("should navigate to documentation sections", async ({ page }) => {
    await page.goto("/");

    // Test navigation to documentation sections
    const firstDocLink = page
      .getByRole("link", { name: /documentation/i })
      .first();
    if (await firstDocLink.isVisible()) {
      await firstDocLink.click();
      await expect(page.url()).toContain("/docs/");
    }
  });
});

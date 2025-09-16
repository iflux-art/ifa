import { expect, test } from "@playwright/test";

test.describe("Blog E2E Tests", () => {
  test("should load blog homepage", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Blog/);
  });

  test("should navigate to blog posts", async ({ page }) => {
    await page.goto("/");

    // Test navigation to blog posts
    const firstPostLink = page.getByRole("link", { name: /post/i }).first();
    if (await firstPostLink.isVisible()) {
      await firstPostLink.click();
      await expect(page.url()).toContain("/blog/");
    }
  });
});

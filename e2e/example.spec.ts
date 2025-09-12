import { expect, test } from '@playwright/test'

test.describe('Website E2E Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Website/)
  })

  test('should navigate to different pages', async ({ page }) => {
    await page.goto('/')

    // Test navigation
    const aboutLink = page.getByRole('link', { name: /about/i })
    if (await aboutLink.isVisible()) {
      await aboutLink.click()
      await expect(page.url()).toContain('/about')
    }
  })
})

test.describe('Blog E2E Tests', () => {
  test('should load blog homepage', async ({ page }) => {
    await page.goto('http://localhost:3001')
    await expect(page).toHaveTitle(/Blog/)
  })
})

test.describe('Docs E2E Tests', () => {
  test('should load docs homepage', async ({ page }) => {
    await page.goto('http://localhost:3002')
    await expect(page).toHaveTitle(/Docs/)
  })
})

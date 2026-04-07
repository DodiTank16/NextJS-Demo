import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tank Corporation/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Click the about link.
  await page.click('text=About');

  // Expects page to have a heading.
  await expect(page.locator('h1')).toBeVisible();
});

test('contact page is accessible', async ({ page }) => {
  await page.goto('/');

  // Navigate to contact page
  await page.goto('/contact-us');

  // Verify the page loaded successfully
  await expect(page).toHaveURL(/contact-us/);
  
  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
});

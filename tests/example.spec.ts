import { test, expect } from '@playwright/test';

// This is an example test. Replace it with your own test.
test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tank Corporation/);
});

// Additional test to check if the about page is accessible
test('navigation works', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Use the header nav link specifically (first stable anchor pointing to /about)
  const aboutLink = page.locator('a[href="/about"]').first();
  await aboutLink.waitFor({ state: 'visible' });
  await aboutLink.click();

  // Expects page to have a heading.
  await expect(page.locator('h1')).toBeVisible();
});

// Additional test to check if the contact page is accessible
test('contact page is accessible', async ({ page }) => {
  await page.goto('/');

  // Navigate to contact page
  await page.goto('/contact-us');

  // Verify the page loaded successfully
  await expect(page).toHaveURL(/contact-us/);
  
  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
});

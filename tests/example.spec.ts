import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tank Corporation/);
});

test('navigation works', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });

  // Use the header nav link specifically to avoid matching multiple elements
  const aboutLink = page.locator('a[href="/about"]').first();
  await aboutLink.waitFor({ state: 'visible' });
  await aboutLink.click();

  // Expects the about page heading to be visible
  await expect(page.getByRole('heading', { name: 'About Our Company' })).toBeVisible();
});

// 
test('contact page is accessible', async ({ page }) => {
  await page.goto('/');

  // Navigate to contact page
  await page.goto('/contact-us');

  // Verify the page loaded successfully
  await expect(page).toHaveURL(/contact-us/);
  
  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
});

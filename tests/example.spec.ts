import { test, expect } from '@playwright/test';

// Example of a test that checks if the homepage loads and has the correct title
test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Tank Corporation/);
});


// Example of a test that checks if the contact page is accessible and loads correctly
test('contact page is accessible', async ({ page }) => {
  await page.goto('/');

  // Navigate to contact page
  await page.goto('/contact-us');

  // Verify the page loaded successfully
  await expect(page).toHaveURL(/contact-us/);
  
  // Check if main content is visible
  await expect(page.locator('body')).toBeVisible();
});

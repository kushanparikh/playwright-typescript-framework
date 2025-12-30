import { test, expect } from '@playwright/test';

test('Able to login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');

  // Enter user name and password
  await page.fill('input[name="user-name"]', 'standard_user');
  await page.fill('input[name="password"]', 'secret_sauce');

  // Click login button
  await page.click('input[id="login-button"]');

  // Verify login
  await expect(page).toHaveTitle('Swag Labs');
});

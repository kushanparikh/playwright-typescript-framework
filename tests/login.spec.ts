import { test, expect } from '@playwright/test';

test('should login successfully with valid credentials', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');

  // Enter user name and password
  await page.fill('input[name="user-name"]', 'standard_user');
  await page.fill('input[name="password"]', 'secret_sauce');

  // Click login button
  await page.click('input[id="login-button"]');

  // Verify URL has changed
  await expect(page).toHaveURL(/inventory/);
});

test('should show error for locked out user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');

  // Enter user name and password
  await page.fill('input[name="user-name"]', 'locked_out_user');
  await page.fill('input[name="password"]', 'secret_sauce');

  // Click login button
  await page.click('input[id="login-button"]');

  // Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');
});

test('should show error with non-existent username', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  //Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');

  //Enter user name and password
  await page.fill('input[name="user-name"]', 'invalid_user');
  await page.fill('input[name="password"]', 'secret_sauce');

  //Click login button
  await page.click('input[id="login-button"]');

  //Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');
});

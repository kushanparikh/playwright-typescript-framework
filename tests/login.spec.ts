import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');
});

test('should login successfully with valid credentials', async ({ page }, testInfo) => {
  // Enter user name and password
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify URL has changed
  await expect(page).toHaveURL(/inventory/);

  // Attach screenshot to report
  await testInfo.attach('inventory-page-after-login', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error for locked out user', async ({ page }, testInfo) => {
  // Enter user name and password
  await page.getByPlaceholder('Username').fill('locked_out_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');

  // Attach screenshot to report
  await testInfo.attach('error-locked-out-user', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error with non-existent username', async ({ page }, testInfo) => {
  //Enter user name and password
  await page.getByPlaceholder('Username').fill('invalid_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  //Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  //Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');

  // Attach screenshot to report
  await testInfo.attach('error-non-existent-username', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error with empty password', async ({ page }, testInfo) => {
  //Enter user name and password as empty string
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('');

  //Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  //Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Password is required');

  // Attach screenshot to report
  await testInfo.attach('error-empty-password', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error with empty username', async ({ page }, testInfo) => {
  //Enter password and keep username empty
  await page.getByPlaceholder('Password').fill('secret_sauce');

  //Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  //Verify error message is displayed
  await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');

  // Attach screenshot to report
  await testInfo.attach('error-empty-username', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});
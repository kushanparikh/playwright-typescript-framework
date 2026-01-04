import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';

test.beforeEach(async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Swag Labs');
});

test('should login successfully with valid credentials', async ({ page }, testInfo) => {
  // Use LoginPage to perform login
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce')

  // Verify URL has changed
  await expect(page).toHaveURL(/inventory/);

  // Attach screenshot to report
  await testInfo.attach('inventory-page-after-login', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test.describe('Login with invalid credentials', () => {
  test('should show error for locked out user', async ({ page }, testInfo) => {
    // Use LoginPage to perform login
    const loginPage = new LoginPage(page);
    await loginPage.login('locked_out_user', 'secret_sauce')

    // Verify error message is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Sorry, this user has been locked out.');

    // Attach screenshot to report
    await testInfo.attach('error-locked-out-user', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with non-existent username', async ({ page }, testInfo) => {
    // Use LoginPage to perform login
    const loginPage = new LoginPage(page);
    await loginPage.login('invalid_user', 'secret_sauce')

    //Verify error message is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username and password do not match any user in this service');

    // Attach screenshot to report
    await testInfo.attach('error-non-existent-username', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with empty password', async ({ page }, testInfo) => {
    // Use LoginPage to perform login
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', '');

    //Verify error message is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Password is required');

    // Attach screenshot to report
    await testInfo.attach('error-empty-password', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with empty username', async ({ page }, testInfo) => {
    // Use LoginPage to perform login
    const loginPage = new LoginPage(page);
    await loginPage.login('', 'secret_sauce');

    //Verify error message is displayed
    await expect(page.locator('[data-test="error"]')).toContainText('Epic sadface: Username is required');

    // Attach screenshot to report
    await testInfo.attach('error-empty-username', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});
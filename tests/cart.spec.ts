import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
});

test('should add Sauce Labs Backpack and Bike Light to cart', async ({ page }, testInfo) => {
    // Enter user name and password
  await page.getByPlaceholder('Username').fill('standard_user');
  await page.getByPlaceholder('Password').fill('secret_sauce');

  // Click login button
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify URL has changed
  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveTitle('Swag Labs');

  // Verify secondary title "Products"
  await expect(page.getByText('Products')).toBeVisible();

  // Add Sauce Labs Backpack to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  
  // Add Sauce Labs Bike Light to cart
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  // Verify cart badge shows 2 items
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
  
  // Also verify cart link contains the count
  await expect(page.locator('[data-test="shopping-cart-link"]')).toContainText('2');
  
  // Verify buttons changed to "Remove"
  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');
  await expect(page.locator('[data-test="remove-sauce-labs-bike-light"]')).toHaveText('Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-bike-light', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

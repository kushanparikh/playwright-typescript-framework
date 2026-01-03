import { test, expect, Page } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import CartPage from '../pages/cartPage';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
});

async function verifyCartLandingDetails(page: Page) {
  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveTitle('Swag Labs');

  // Verify secondary title "Products"
  await expect(page.getByText('Products')).toBeVisible();
}

test('should add Sauce Labs Backpack to cart', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify URL has changed
  await verifyCartLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  cartPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Verify cart badge shows 1 items
  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  
  // Also verify cart link contains the count
  await expect(page.locator('[data-test="shopping-cart-link"]')).toContainText('1');

  // Verify buttons changed to "Remove"
  await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toHaveText('Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-bike-light', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should add Sauce Labs Backpack and Bike Light to cart', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);
  await loginPage.login('standard_user', 'secret_sauce');

  verifyCartLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  await cartPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  
  // Add Sauce Labs Bike Light to cart
  await cartPage.addItemToCart('sauce-labs-bike-light');

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

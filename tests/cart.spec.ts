import { test, expect, Page } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import CartPage from '../pages/cartPage';
import CartAssertions from '../assertions/cartAssertions';

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
  const cartAssertions = new CartAssertions(cartPage);
  
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify URL has changed
  await verifyCartLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  await cartPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Verify cart state using assertions class
  await cartAssertions.verifyCartBadgeCount('1');
  await cartAssertions.verifyCartLinkContainsCount('1');
  await cartAssertions.verifyRemoveButtonText('sauce-labs-backpack', 'Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack-final', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should add Sauce Labs Backpack and Bike Light to cart', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const cartPage = new CartPage(page);
  const cartAssertions = new CartAssertions(cartPage);
  
  await loginPage.login('standard_user', 'secret_sauce');

  await verifyCartLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  await cartPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  
  // Add Sauce Labs Bike Light to cart
  await cartPage.addItemToCart('sauce-labs-bike-light');

  // Verify cart state using assertions class
  await cartAssertions.verifyCartBadgeCount('2');
  await cartAssertions.verifyCartLinkContainsCount('2');
  await cartAssertions.verifyRemoveButtonText('sauce-labs-backpack', 'Remove');
  await cartAssertions.verifyRemoveButtonText('sauce-labs-bike-light', 'Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-bike-light', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

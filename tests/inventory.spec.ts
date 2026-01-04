import { test, expect, Page } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import InventoryPage from '../pages/inventoryPage';
import InventoryAssertions from '../assertions/inventoryAssertions';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
});

async function verifyInventoryLandingDetails(page: Page) {
  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveTitle('Swag Labs');

  // Verify secondary title "Products"
  await expect(page.getByText('Products')).toBeVisible();
}

test('should add Sauce Labs Backpack to cart', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const inventoryAssertions = new InventoryAssertions(inventoryPage);
  
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify URL has changed
  await verifyInventoryLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Verify cart state using assertions class
  await inventoryAssertions.verifyCartBadgeCount('1');
  await inventoryAssertions.verifyCartLinkContainsCount('1');
  await inventoryAssertions.verifyRemoveButtonText('sauce-labs-backpack', 'Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack-final', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should add Sauce Labs Backpack and Bike Light to cart', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const inventoryAssertions = new InventoryAssertions(inventoryPage);
  
  await loginPage.login('standard_user', 'secret_sauce');

  await verifyInventoryLandingDetails(page);

  // Add Sauce Labs Backpack to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-backpack', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  
  // Add Sauce Labs Bike Light to cart
  await inventoryPage.addItemToCart('sauce-labs-bike-light');

  // Verify cart state using assertions class
  await inventoryAssertions.verifyCartBadgeCount('2');
  await inventoryAssertions.verifyCartLinkContainsCount('2');
  await inventoryAssertions.verifyRemoveButtonText('sauce-labs-backpack', 'Remove');
  await inventoryAssertions.verifyRemoveButtonText('sauce-labs-bike-light', 'Remove');

  // Attach screenshot to report
  await testInfo.attach('cart-page-after-adding-bike-light', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

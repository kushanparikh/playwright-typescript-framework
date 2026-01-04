import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import InventoryPage from '../pages/inventoryPage';
import CartAssertions from '../assertions/cartAssertions';

test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Swag Labs');
});

test('filter products by price', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  const cartAssertions = new CartAssertions(inventoryPage);
  // Login first
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveTitle('Swag Labs');

  // Verify secondary title "Products"
  await expect(page.getByText('Products')).toBeVisible();
  
  // Attach screenshot to report
  await testInfo.attach('inventory-page-after-login', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  // Apply price filter
  await inventoryPage.applyPriceFilter('za');
  
  // Attach screenshot to report
  await testInfo.attach('inventory-page-after-applying-filter', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
  
  // Verify products are sorted by price (low to high)
  await cartAssertions.verifyProductsSorted('za');
});
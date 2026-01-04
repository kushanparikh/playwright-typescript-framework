import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';
import InventoryPage from '../pages/inventoryPage';

test('filter products by price', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  
  // Login first
  await loginPage.login('standard_user', 'secret_sauce');
  
  // Apply price filter
  await inventoryPage.applyPriceFilter('low-to-high');
  
  // Verify products are sorted by price (low to high)
  await inventoryPage.verifyProductsSortedByPrice('low-to-high');
});
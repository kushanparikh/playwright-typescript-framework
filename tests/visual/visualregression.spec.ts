import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page, loginAssertions }) => {
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
})

test.describe('Visual Regression Tests', () => {
    test('login page appearance', async ({ page }) => {
        // Visual Regression of login page
        await expect(page).toHaveScreenshot('login-page.png', { fullPage: true });
    });

    test('inventory page appearance', async ({ page, loginPage, inventoryAssertions }) => {
        // Login first
        await loginPage.login('standard_user', 'secret_sauce');
        // Verify inventory landing details
        await inventoryAssertions.verifyInventoryLandingDetails();
        // Visual Regression of inventory page
        await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
    });

    test('cart with items appearance', async({page, loginPage, inventoryPage, inventoryAssertions}) => {
        // Login first
        await loginPage.login('standard_user', 'secret_sauce');
        // Verify inventory landing details
        await inventoryAssertions.verifyInventoryLandingDetails();
        // Add items to cart
        await inventoryPage.addItemToCart('sauce-labs-backpack');
        await inventoryPage.addItemToCart('sauce-labs-bike-light');
        // Click on cart link
        await inventoryPage.clickCartLink();
        // Visual Regression of cart page
        await expect(page).toHaveScreenshot('cart-page-with-items.png', { fullPage: true });
    })
});
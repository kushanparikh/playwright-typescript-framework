import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page, loginAssertions }) => {
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
});

test('should navigate to product detail page from inventory and display correct information', async ({
    page,
    loginPage,
    inventoryPage,
    productDetailPage,
    inventoryAssertions,
    productDetailAssertions
}, testInfo) => {
    // Login with standard user
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to product detail page for Sauce Labs Backpack
    await productDetailPage.navigateToProductDetailFromInventory('Sauce Labs Backpack');

    // Verify product detail page loaded
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Attach screenshot after navigation
    await testInfo.attach('product-detail-page-loaded', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Verify all product information is displayed correctly
    await productDetailAssertions.verifyProductInformation(
        'Sauce Labs Backpack',
        '$29.99',
        'carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.'
    );

    // Verify product image is displayed
    await productDetailAssertions.verifyProductImageDisplayed();

    // Verify Add to Cart button is visible
    await productDetailAssertions.verifyAddToCartButtonVisible();

    // Verify Back to Products button is visible
    await productDetailAssertions.verifyBackToProductsButtonVisible();

    // Attach final screenshot
    await testInfo.attach('product-detail-page-verified', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should add item to cart from product detail page', async ({
    page,
    loginPage,
    productDetailPage,
    inventoryAssertions,
    productDetailAssertions
}, testInfo) => {
    // Login with standard user
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to product detail page for Sauce Labs Bike Light
    await productDetailPage.navigateToProductDetailFromInventory('Sauce Labs Bike Light');
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Verify cart is empty initially
    await productDetailAssertions.verifyCartBadgeNotVisible();

    // Add item to cart from product detail page
    await productDetailPage.addItemToCart();

    // Attach screenshot after adding to cart
    await testInfo.attach('product-detail-after-add-to-cart', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Verify cart badge shows 1 item
    await productDetailAssertions.verifyCartBadgeCount('1');

    // Verify Remove button is now visible
    await productDetailAssertions.verifyRemoveButtonVisible();

    // Attach final screenshot
    await testInfo.attach('product-detail-cart-updated', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should remove item from cart on product detail page', async ({
    page,
    loginPage,
    productDetailPage,
    inventoryAssertions,
    productDetailAssertions
}, testInfo) => {
    // Login with standard user
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to product detail page
    await productDetailPage.navigateToProductDetailFromInventory('Sauce Labs Bolt T-Shirt');
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Add item to cart first
    await productDetailPage.addItemToCart();
    await productDetailAssertions.verifyCartBadgeCount('1');
    await productDetailAssertions.verifyRemoveButtonVisible();

    // Attach screenshot before removing
    await testInfo.attach('product-detail-before-remove', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Remove item from cart
    await productDetailPage.removeItemFromCart();

    // Verify cart badge is not visible (cart is empty)
    await productDetailAssertions.verifyCartBadgeNotVisible();

    // Verify Add to Cart button is visible again
    await productDetailAssertions.verifyAddToCartButtonVisible();

    // Attach final screenshot
    await testInfo.attach('product-detail-after-remove', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should navigate back to products page using Back to Products button', async ({
    page,
    loginPage,
    productDetailPage,
    inventoryAssertions,
    productDetailAssertions
}, testInfo) => {
    // Login with standard user
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to product detail page
    await productDetailPage.navigateToProductDetailFromInventory('Sauce Labs Fleece Jacket');
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Attach screenshot on product detail page
    await testInfo.attach('on-product-detail-page', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Click Back to Products button
    await productDetailPage.clickBackToProducts();

    // Verify navigation back to inventory page
    await productDetailAssertions.verifyNavigatedBackToInventory();
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Attach final screenshot
    await testInfo.attach('back-on-inventory-page', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should maintain cart state when navigating between product detail and inventory pages', async ({
    page,
    loginPage,
    productDetailPage,
    inventoryAssertions,
    productDetailAssertions
}, testInfo) => {
    // Login with standard user
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to first product detail page
    await productDetailPage.navigateToProductDetailFromInventory('Sauce Labs Onesie');
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Add first item to cart
    await productDetailPage.addItemToCart();
    await productDetailAssertions.verifyCartBadgeCount('1');

    // Attach screenshot after first item
    await testInfo.attach('first-item-added', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Navigate back to inventory
    await productDetailPage.clickBackToProducts();
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Verify cart still shows 1 item
    await inventoryAssertions.verifyCartBadgeCount('1');

    // Navigate to second product detail page
    await productDetailPage.navigateToProductDetailFromInventory('Test.allTheThings() T-Shirt (Red)');
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Add second item to cart
    await productDetailPage.addItemToCart();
    await productDetailAssertions.verifyCartBadgeCount('2');

    // Attach screenshot after second item
    await testInfo.attach('second-item-added', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });

    // Navigate back to inventory
    await productDetailPage.clickBackToProducts();
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Verify cart still shows 2 items
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Attach final screenshot
    await testInfo.attach('cart-state-maintained', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

import { test, expect } from './fixtures/baseTest';

test.beforeEach(async ({ page, loginAssertions }) => {
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
});

test('should navigate to cart page', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Navigate to cart page
    await cartPage.navigateToCart();

    // Verify cart page URL and title
    await cartAssertions.verifyCartPageUrl();
    await cartAssertions.verifyCartPageTitle();
    await cartAssertions.verifySecondaryTitle('Your Cart');

    await testInfo.attach('cart-page-navigation', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should display correct items in cart', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add multiple items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');

    // Navigate to cart
    await cartPage.navigateToCart();

    // Verify cart displays correct items
    await cartAssertions.verifyCartItemCount(3);
    await cartAssertions.verifyAllItemsInCart([
        'Sauce Labs Backpack',
        'Sauce Labs Bike Light',
        'Sauce Labs Bolt T-Shirt'
    ]);

    await testInfo.attach('cart-displays-correct-items', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should display correct quantities', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');

    // Navigate to cart
    await cartPage.navigateToCart();

    // Verify all items have quantity of 1
    await cartAssertions.verifyAllQuantities('1');

    await testInfo.attach('cart-quantities', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should remove item from cart page', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');

    // Navigate to cart
    await cartPage.navigateToCart();
    await cartAssertions.verifyCartItemCount(3);

    // Remove one item from cart page
    await cartPage.removeItemFromCart('sauce-labs-bike-light');

    // Verify item is removed
    await cartAssertions.verifyCartItemCount(2);
    await cartAssertions.verifyItemNotInCart('Sauce Labs Bike Light');
    await cartAssertions.verifyItemInCart('Sauce Labs Backpack');
    await cartAssertions.verifyItemInCart('Sauce Labs Bolt T-Shirt');

    await testInfo.attach('cart-item-removed', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should remove all items from cart', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add multiple items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');

    // Navigate to cart
    await cartPage.navigateToCart();
    await cartAssertions.verifyCartItemCount(3);

    // Remove all items
    await cartPage.removeItemFromCart('sauce-labs-backpack');
    await cartPage.removeItemFromCart('sauce-labs-bike-light');
    await cartPage.removeItemFromCart('sauce-labs-bolt-t-shirt');

    // Verify cart is empty
    await cartAssertions.verifyCartIsEmpty();
    await cartAssertions.verifyCartBadgeNotVisible();

    await testInfo.attach('cart-all-items-removed', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should return to inventory when continue shopping is clicked', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add item and navigate to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await cartPage.navigateToCart();
    await cartAssertions.verifyCartPageUrl();

    // Click continue shopping button
    await cartPage.clickContinueShopping();

    // Verify returned to inventory page
    await cartAssertions.verifyInventoryUrl();

    await testInfo.attach('continue-shopping-navigation', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should navigate to checkout when checkout button is clicked', async ({ page, loginPage, inventoryPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Add items and navigate to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await cartPage.navigateToCart();
    await cartAssertions.verifyCartPageUrl();

    // Click checkout button
    await cartPage.clickCheckout();

    // Verify navigated to checkout step one
    await cartAssertions.verifyCheckoutStepOneUrl();

    await testInfo.attach('checkout-navigation', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

test('should display empty cart state', async ({ page, loginPage, cartPage, cartAssertions }, testInfo) => {
    await loginPage.login('standard_user', 'secret_sauce');

    // Navigate to cart without adding items
    await cartPage.navigateToCart();

    // Verify cart is empty
    await cartAssertions.verifyCartIsEmpty();
    await cartAssertions.verifyCartBadgeNotVisible();

    // Verify buttons are still visible
    await cartAssertions.verifyContinueShoppingButtonVisible();
    await cartAssertions.verifyCheckoutButtonVisible();

    await testInfo.attach('empty-cart-state', {
        body: await page.screenshot(),
        contentType: 'image/png',
    });
});

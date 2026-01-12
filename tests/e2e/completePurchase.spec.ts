import { test, expect } from '../fixtures/baseTest';

test.describe('End-to-End Purchase Workflows', () => {

  test('should complete full purchase flow: Login → Add items → Cart → Checkout → Complete', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    loginAssertions,
    inventoryAssertions,
    cartAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Step 1: Navigate and Login
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Step 2: Add multiple items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Step 3: Navigate to cart
    await inventoryPage.clickCartLink();
    await expect(page).toHaveURL(/.*cart.html/);
    await cartAssertions.verifyCartPageUrl();

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(2);

    // Step 4: Proceed to checkout
    await cartPage.clickCheckout();
    await checkoutAssertions.verifyCheckoutInformationPageURL();

    // Step 5: Fill checkout information
    await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
    await checkoutPage.clickContinue();
    await checkoutAssertions.verifyCheckoutOverviewPageURL();

    // Step 6: Verify order details and complete
    await checkoutAssertions.verifyItemTotalIsDisplayed();
    await checkoutAssertions.verifyTaxIsDisplayed();
    await checkoutAssertions.verifyTotalPriceIsDisplayed();
    await checkoutPage.clickFinish();

    // Step 7: Verify completion
    await checkoutAssertions.verifyCheckoutCompletePageURL();
    await checkoutAssertions.verifyOrderConfirmationMessage();
    await checkoutAssertions.verifyThankYouMessage();

    // Attach screenshot
    await testInfo.attach('complete-purchase-flow', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should complete purchase with single item', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    loginAssertions,
    inventoryAssertions,
    cartAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add single item
    await inventoryPage.addItemToCart('sauce-labs-onesie');
    await inventoryAssertions.verifyCartBadgeCount('1');

    // Go to cart
    await inventoryPage.clickCartLink();
    await cartAssertions.verifyCartPageUrl();

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(1);

    // Checkout
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Jane', 'Smith', '54321');
    await checkoutPage.clickContinue();
    await checkoutAssertions.verifyCheckoutOverviewPageURL();

    // Complete order
    await checkoutPage.clickFinish();
    await checkoutAssertions.verifyCheckoutCompletePageURL();
    await checkoutAssertions.verifyOrderConfirmationMessage();

    // Verify cart is empty
    await expect(cartPage.getCartBadge()).not.toBeVisible();

    await testInfo.attach('single-item-purchase', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should complete purchase with multiple items', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    inventoryAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add all 6 items
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
    await inventoryPage.addItemToCart('sauce-labs-fleece-jacket');
    await inventoryPage.addItemToCart('sauce-labs-onesie');
    await inventoryPage.addItemToCart('test.allthethings()-t-shirt-(red)');
    await inventoryAssertions.verifyCartBadgeCount('6');

    // Go to cart
    await inventoryPage.clickCartLink();

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(6);

    // Checkout
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Bob', 'Johnson', '67890');
    await checkoutPage.clickContinue();

    // Complete order
    await checkoutPage.clickFinish();
    await checkoutAssertions.verifyCheckoutCompletePageURL();
    await checkoutAssertions.verifyThankYouMessage();

    await testInfo.attach('multiple-items-purchase', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should handle add item, remove item, add again workflow', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    inventoryAssertions,
    cartAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add item
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryAssertions.verifyCartBadgeCount('1');

    // Remove item
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    await expect(inventoryPage.getCartBadge()).not.toBeVisible();

    // Add different items
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-onesie');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Go to cart
    await inventoryPage.clickCartLink();
    await cartAssertions.verifyCartPageUrl();

    // Remove one item from cart
    await cartPage.removeItemFromCart('sauce-labs-bike-light');

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(1);

    // Go back and add the original item again
    await cartPage.clickContinueShopping();
    await inventoryAssertions.verifyInventoryLandingDetails();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Complete checkout
    await inventoryPage.clickCartLink();
    await cartPage.clickCheckout();
    await page.locator('[data-test="firstName"]').fill('Alice');
    await page.locator('[data-test="lastName"]').fill('Williams');
    await page.locator('[data-test="postalCode"]').fill('11111');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();

    await checkoutAssertions.verifyCheckoutCompletePageURL();

    await testInfo.attach('add-remove-add-workflow', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should sort products, add to cart, and checkout', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    inventoryAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Sort by price low to high
    await inventoryPage.applyFilter('lohi');

    // Get all item names after sorting
    const itemNames = await inventoryPage.getItemNameLocator().allTextContents();

    // Add first two items (cheapest)
    await inventoryPage.addItemToCart('sauce-labs-onesie');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Sort by price high to low
    await inventoryPage.applyFilter('hilo');

    // Add the most expensive item
    await inventoryPage.addItemToCart('sauce-labs-fleece-jacket');
    await inventoryAssertions.verifyCartBadgeCount('3');

    // Proceed to checkout
    await inventoryPage.clickCartLink();
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Charlie', 'Brown', '22222');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    await checkoutAssertions.verifyCheckoutCompletePageURL();

    await testInfo.attach('sort-and-purchase', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should navigate to product detail, add to cart, and checkout', async ({
    page,
    loginPage,
    inventoryPage,
    productDetailPage,
    cartPage,
    checkoutPage,
    inventoryAssertions,
    productDetailAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Click on first product name to view details
    await page.locator('[data-test="item-4-title-link"]').click();
    await expect(page).toHaveURL(/.*inventory-item.html/);
    await productDetailAssertions.verifyProductDetailPageLoaded();

    // Add to cart from product detail page
    await productDetailPage.addItemToCart();
    await expect(inventoryPage.getCartBadge()).toHaveText('1');

    // Go back to products
    await productDetailPage.clickBackToProducts();
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Navigate to another product detail
    await page.locator('[data-test="item-0-title-link"]').click();
    await productDetailAssertions.verifyProductDetailPageLoaded();
    await productDetailPage.addItemToCart();

    // Go to cart from product detail page
    await page.locator('[data-test="shopping-cart-link"]').click();

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(2);

    // Checkout
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('David', 'Miller', '33333');
    await checkoutPage.clickContinue();
    await checkoutPage.clickFinish();

    await checkoutAssertions.verifyCheckoutCompletePageURL();

    await testInfo.attach('product-detail-purchase', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should maintain cart persistence across navigation', async ({
    page,
    loginPage,
    inventoryPage,
    productDetailPage,
    cartPage,
    inventoryAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add items from inventory page
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Navigate to product detail
    await page.locator('[data-test="item-2-title-link"]').click();
    await expect(inventoryPage.getCartBadge()).toHaveText('2');

    // Add one more from product detail
    await productDetailPage.addItemToCart();
    await expect(inventoryPage.getCartBadge()).toHaveText('3');

    // Go back to inventory
    await productDetailPage.clickBackToProducts();
    await inventoryAssertions.verifyInventoryLandingDetails();
    await expect(inventoryPage.getCartBadge()).toHaveText('3');

    // Go to cart
    await inventoryPage.clickCartLink();
    const cartItemsInCart = await cartPage.getCartItems().count();
    expect(cartItemsInCart).toBe(3);

    // Continue shopping
    await cartPage.clickContinueShopping();
    await inventoryAssertions.verifyInventoryLandingDetails();
    await expect(inventoryPage.getCartBadge()).toHaveText('3');

    // Remove one item
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    await expect(inventoryPage.getCartBadge()).toHaveText('2');

    // Verify cart still has 2 items
    await inventoryPage.clickCartLink();
    const finalCartItems = await cartPage.getCartItems().count();
    expect(finalCartItems).toBe(2);

    await testInfo.attach('cart-persistence', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should handle reset app state during shopping journey', async ({
    page,
    loginPage,
    inventoryPage,
    hamburgerMenuPage,
    inventoryAssertions
  }, testInfo) => {
    // Login
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add multiple items
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryPage.addItemToCart('sauce-labs-onesie');
    await inventoryAssertions.verifyCartBadgeCount('3');

    // Open hamburger menu and reset app state
    await hamburgerMenuPage.openMenu();
    await page.waitForTimeout(500);
    await hamburgerMenuPage.clickResetAppStateLink();

    // Wait a moment for state to reset
    await page.waitForTimeout(500);

    // Close menu
    await page.waitForTimeout(500);
    await hamburgerMenuPage.closeMenu();

    // Verify cart is now empty
    await expect(inventoryPage.getCartBadge()).not.toBeVisible();

    await testInfo.attach('reset-app-state', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should complete checkout with problem_user', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    inventoryAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login with problem user
    await page.goto('/');
    await loginPage.login('problem_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add items (problem_user has broken images but functionality works)
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Navigate to cart
    await inventoryPage.clickCartLink();

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(2);

    // Checkout
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Problem', 'User', '99999');
    await checkoutPage.clickContinue();

    // Problem user gets stuck on checkout-step-one, this is expected behavior
    // Verify we are still on the checkout information page (demonstrates the bug)
    await expect(page).toHaveURL(/.*checkout-step-one.html/);
    
    // Verify error message appears (last name field issue with problem_user)
    await expect(checkoutPage.getErrorMessage()).toBeVisible();

    await testInfo.attach('problem-user-checkout', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should complete checkout with performance_glitch_user', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    inventoryAssertions,
    checkoutAssertions
  }, testInfo) => {
    // Login with performance_glitch_user (may have delays)
    await page.goto('/');
    await loginPage.login('performance_glitch_user', 'secret_sauce');

    // Wait for inventory page to load (might be slow)
    await expect(page).toHaveURL(/.*inventory.html/, { timeout: 10000 });
    await inventoryAssertions.verifyInventoryLandingDetails();

    // Add items
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-fleece-jacket');
    await inventoryAssertions.verifyCartBadgeCount('2');

    // Navigate to cart
    await inventoryPage.clickCartLink();
    await expect(page).toHaveURL(/.*cart.html/);

    const cartItems = await cartPage.getCartItems().count();
    expect(cartItems).toBe(2);

    // Checkout
    await cartPage.clickCheckout();
    await checkoutPage.fillCheckoutInformation('Performance', 'User', '88888');
    await checkoutPage.clickContinue();
    await checkoutAssertions.verifyCheckoutOverviewPageURL();

    await checkoutPage.clickFinish();
    await checkoutAssertions.verifyCheckoutCompletePageURL();
    await checkoutAssertions.verifyOrderConfirmationMessage();

    await testInfo.attach('performance-glitch-user-checkout', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

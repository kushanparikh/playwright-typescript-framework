import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page, loginPage, inventoryPage, loginAssertions, inventoryAssertions }) => {
  await page.goto('/');
  await loginAssertions.verifyLoginLandingDetails();

  // Login with standard user
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Add an item to cart and navigate to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Navigate to cart
  await inventoryPage.clickCartLink();
  await expect(page).toHaveURL(/.*cart.html/);

  // Click checkout button to navigate to checkout information page
  await page.locator('[data-test="checkout"]').click();
  await expect(page).toHaveURL(/.*checkout-step-one.html/);
});

test('should enter valid information and continue to checkout overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Verify we're on the checkout information page
  await checkoutAssertions.verifyCheckoutInformationPageURL();

  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Attach screenshot to report
  await testInfo.attach('checkout-overview-page', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error when first name is empty', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Leave first name empty, fill other fields
  await checkoutPage.fillLastName('Doe');
  await checkoutPage.fillPostalCode('12345');

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify error message is displayed
  await checkoutAssertions.verifyErrorMessage('Error: First Name is required');

  // Verify we're still on the checkout information page
  await checkoutAssertions.verifyCheckoutInformationPageURL();

  // Attach screenshot to report
  await testInfo.attach('empty-first-name-error', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error when last name is empty', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Leave last name empty, fill other fields
  await checkoutPage.fillFirstName('John');
  await checkoutPage.fillPostalCode('12345');

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify error message is displayed
  await checkoutAssertions.verifyErrorMessage('Error: Last Name is required');

  // Verify we're still on the checkout information page
  await checkoutAssertions.verifyCheckoutInformationPageURL();

  // Attach screenshot to report
  await testInfo.attach('empty-last-name-error', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should show error when postal code is empty', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Leave postal code empty, fill other fields
  await checkoutPage.fillFirstName('John');
  await checkoutPage.fillLastName('Doe');

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify error message is displayed
  await checkoutAssertions.verifyErrorMessage('Error: Postal Code is required');

  // Verify we're still on the checkout information page
  await checkoutAssertions.verifyCheckoutInformationPageURL();

  // Attach screenshot to report
  await testInfo.attach('empty-postal-code-error', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should return to cart page when cancel button is clicked', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in some information (optional, testing cancel functionality)
  await checkoutPage.fillFirstName('John');
  await checkoutPage.fillLastName('Doe');

  // Click cancel button
  await checkoutPage.clickCancel();

  // Verify we're back on the cart page
  await checkoutAssertions.verifyCartPageURL();

  // Attach screenshot to report
  await testInfo.attach('returned-to-cart-page', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display appropriate validation messages for all empty fields', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Leave all fields empty

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify error message is displayed for first name (first in order)
  await checkoutAssertions.verifyErrorMessage('Error: First Name is required');

  // Verify we're still on the checkout information page
  await checkoutAssertions.verifyCheckoutInformationPageURL();

  // Attach screenshot to report
  await testInfo.attach('all-fields-empty-error', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should accept special characters in name fields', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in checkout information with special characters in names
  await checkoutPage.fillCheckoutInformation("John-Paul O'Brien", "José García-Márquez", '12345');

  // Click continue button
  await checkoutPage.clickContinue();

  // Verify we successfully moved to checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Attach screenshot to report
  await testInfo.attach('special-characters-accepted', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display order confirmation message on checkout complete page', async ({ page, checkoutPage, checkoutAssertions, inventoryPage, inventoryAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
  await checkoutPage.clickContinue();

  // Verify we're on checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Click finish button to complete order
  await checkoutPage.clickFinish();

  // Verify we're on the checkout complete page
  await checkoutAssertions.verifyCheckoutCompletePageURL();

  // Verify order confirmation header is displayed
  await checkoutAssertions.verifyCompleteHeader('Thank you for your order!');

  // Attach screenshot to report
  await testInfo.attach('order-confirmation-message', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display thank you message on checkout complete page', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Jane', 'Smith', '54321');
  await checkoutPage.clickContinue();

  // Verify we're on checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Click finish button to complete order
  await checkoutPage.clickFinish();

  // Verify we're on the checkout complete page
  await checkoutAssertions.verifyCheckoutCompletePageURL();

  // Verify thank you text is displayed
  await checkoutAssertions.verifyCompleteText('Your order has been dispatched');

  // Attach screenshot to report
  await testInfo.attach('thank-you-message', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should return to inventory page when back home button is clicked', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Bob', 'Johnson', '98765');
  await checkoutPage.clickContinue();

  // Verify we're on checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Click finish button to complete order
  await checkoutPage.clickFinish();

  // Verify we're on the checkout complete page
  await checkoutAssertions.verifyCheckoutCompletePageURL();

  // Verify back home button is visible
  await checkoutAssertions.verifyBackHomeButtonIsVisible();

  // Click back home button
  await checkoutPage.clickBackHome();

  // Verify we're back on the inventory page
  await checkoutAssertions.verifyInventoryPageURL();

  // Attach screenshot to report
  await testInfo.attach('back-home-navigation', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should reset cart badge to empty after completing order', async ({ page, checkoutPage, checkoutAssertions, inventoryPage, inventoryAssertions }, testInfo) => {
  // Verify cart badge shows 1 item before checkout
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Alice', 'Williams', '11111');
  await checkoutPage.clickContinue();

  // Verify we're on checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Click finish button to complete order
  await checkoutPage.clickFinish();

  // Verify we're on the checkout complete page
  await checkoutAssertions.verifyCheckoutCompletePageURL();

  // Click back home button to return to inventory
  await checkoutPage.clickBackHome();

  // Verify we're on the inventory page
  await checkoutAssertions.verifyInventoryPageURL();

  // Verify cart badge is not visible (empty cart)
  await inventoryAssertions.verifyCartBadgeNotVisible();

  // Attach screenshot to report
  await testInfo.attach('cart-badge-reset', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

// Checkout Overview Page Tests
test('should review items in checkout overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('John', 'Doe', '12345');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify cart items are displayed
  await checkoutAssertions.verifyCartItemsCount(1);
  await checkoutAssertions.verifyCartItemName('Sauce Labs Backpack', 0);

  // Verify payment and shipping information are visible
  await checkoutAssertions.verifyPaymentInfoIsVisible();
  await checkoutAssertions.verifyShippingInfoIsVisible();

  // Attach screenshot to report
  await testInfo.attach('checkout-overview-items', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should verify item total calculation in checkout overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Jane', 'Smith', '54321');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify subtotal is visible and correct (Sauce Labs Backpack = $29.99)
  await checkoutAssertions.verifySubtotalIsVisible();
  await checkoutAssertions.verifySubtotalAmount(29.99);

  // Attach screenshot to report
  await testInfo.attach('item-total-calculation', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should verify tax calculation in checkout overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Bob', 'Johnson', '98765');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify tax is visible and calculated (8% of $29.99 = $2.40)
  await checkoutAssertions.verifyTaxIsVisible();
  await checkoutAssertions.verifyTaxAmount(2.40);

  // Attach screenshot to report
  await testInfo.attach('tax-calculation', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should verify total price calculation in checkout overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Alice', 'Williams', '11111');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify total is visible
  await checkoutAssertions.verifyTotalIsVisible();

  // Verify total calculation (subtotal + tax = $29.99 + $2.40 = $32.39)
  await checkoutAssertions.verifyTotalCalculation();
  await checkoutAssertions.verifyTotalAmount(32.39);

  // Attach screenshot to report
  await testInfo.attach('total-price-calculation', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should return to inventory when cancel button is clicked on overview', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('Charlie', 'Brown', '55555');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify cancel button is visible
  await checkoutAssertions.verifyCancelButtonOnOverviewIsVisible();

  // Click cancel button
  await checkoutPage.clickCancelOnOverview();

  // Verify we're back on the inventory page
  await checkoutAssertions.verifyInventoryPageURL();

  // Attach screenshot to report
  await testInfo.attach('cancel-returns-to-inventory', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should complete order when finish button is clicked', async ({ page, checkoutPage, checkoutAssertions }, testInfo) => {
  // Fill in valid checkout information
  await checkoutPage.fillCheckoutInformation('David', 'Miller', '77777');
  await checkoutPage.clickContinue();

  // Verify we're on the checkout overview page
  await checkoutAssertions.verifyCheckoutOverviewPageURL();

  // Verify finish button is visible
  await checkoutAssertions.verifyFinishButtonIsVisible();

  // Click finish button
  await checkoutPage.clickFinish();

  // Verify we're on the checkout complete page
  await checkoutAssertions.verifyCheckoutCompletePageURL();

  // Verify order confirmation is displayed
  await checkoutAssertions.verifyCompleteHeader('Thank you for your order!');

  // Attach screenshot to report
  await testInfo.attach('finish-completes-order', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

import { test, expect } from './fixtures/baseTest';

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

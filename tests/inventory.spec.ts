import { test, expect } from '@fixtures/baseTest';

test.beforeEach(async ({ page, loginAssertions }) => {
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
});

test('should add Sauce Labs Backpack to cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  
  await loginPage.login('standard_user', 'secret_sauce');

  // Verify URL has changed
  await inventoryAssertions.verifyInventoryLandingDetails();

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

test('should add Sauce Labs Backpack and Bike Light to cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {

  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryAssertions.verifyInventoryLandingDetails();

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

test('should remove single item from cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Add item to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Remove item from cart
  await inventoryPage.removeItemFromCart('sauce-labs-backpack');

  // Verify cart is empty and badge is not visible
  await inventoryAssertions.verifyCartBadgeNotVisible();
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-backpack');

  await testInfo.attach('cart-after-removing-item', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should remove multiple items from cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Add multiple items to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryPage.addItemToCart('sauce-labs-bike-light');
  await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyCartBadgeCount('3');

  // Remove first item
  await inventoryPage.removeItemFromCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('2');

  // Remove second item
  await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Remove third item
  await inventoryPage.removeItemFromCart('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyCartBadgeNotVisible();

  await testInfo.attach('cart-after-removing-all-items', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should update cart badge correctly when adding and removing items', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Verify badge is not visible initially
  await inventoryAssertions.verifyCartBadgeNotVisible();

  // Add first item
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Add second item
  await inventoryPage.addItemToCart('sauce-labs-bike-light');
  await inventoryAssertions.verifyCartBadgeCount('2');

  // Remove first item
  await inventoryPage.removeItemFromCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('1');

  // Add third item
  await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyCartBadgeCount('2');

  // Remove all items
  await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
  await inventoryPage.removeItemFromCart('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyCartBadgeNotVisible();

  await testInfo.attach('cart-badge-updates', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should hide cart badge when cart is empty', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Initially cart should be empty
  await inventoryAssertions.verifyCartBadgeNotVisible();

  // Add and remove item
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeCount('1');

  await inventoryPage.removeItemFromCart('sauce-labs-backpack');
  await inventoryAssertions.verifyCartBadgeNotVisible();

  await testInfo.attach('empty-cart-no-badge', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display all 6 products correctly', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Verify all 6 products are displayed
  await inventoryAssertions.verifyInventoryItemCount(6);

  await testInfo.attach('all-6-products-displayed', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display correct product names', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  const expectedProductNames = [
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
    'Sauce Labs Bolt T-Shirt',
    'Sauce Labs Fleece Jacket',
    'Sauce Labs Onesie',
    'Test.allTheThings() T-Shirt (Red)'
  ];

  await inventoryAssertions.verifyProductNamesExist(expectedProductNames);

  await testInfo.attach('product-names-verification', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display correct product prices', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  const expectedPrices = [
    '$29.99',
    '$9.99',
    '$15.99',
    '$49.99',
    '$7.99',
    '$15.99'
  ];

  await inventoryAssertions.verifyProductPrices(expectedPrices);

  await testInfo.attach('product-prices-verification', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should display product images without errors', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Verify all product images are displayed and not broken
  await inventoryAssertions.verifyAllProductImagesDisplayed();

  await testInfo.attach('product-images-displayed', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should have default sort order as A-Z', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Verify default sort is A-Z
  await inventoryAssertions.verifyDefaultSortOrder();
  await inventoryAssertions.verifyProductsSorted('az');

  await testInfo.attach('default-sort-order', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should add all items to cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Add all 6 items to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryPage.addItemToCart('sauce-labs-bike-light');
  await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
  await inventoryPage.addItemToCart('sauce-labs-fleece-jacket');
  await inventoryPage.addItemToCart('sauce-labs-onesie');
  await inventoryPage.addItemToCart('test.allthethings()-t-shirt-(red)');

  // Verify cart badge shows 6
  await inventoryAssertions.verifyCartBadgeCount('6');

  // Verify all remove buttons are visible
  await inventoryAssertions.verifyRemoveButtonExists('sauce-labs-backpack');
  await inventoryAssertions.verifyRemoveButtonExists('sauce-labs-bike-light');
  await inventoryAssertions.verifyRemoveButtonExists('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyRemoveButtonExists('sauce-labs-fleece-jacket');
  await inventoryAssertions.verifyRemoveButtonExists('sauce-labs-onesie');
  await inventoryAssertions.verifyRemoveButtonExists('test.allthethings()-t-shirt-(red)');

  await testInfo.attach('all-items-added-to-cart', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test('should remove all items from cart', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Add all 6 items to cart
  await inventoryPage.addItemToCart('sauce-labs-backpack');
  await inventoryPage.addItemToCart('sauce-labs-bike-light');
  await inventoryPage.addItemToCart('sauce-labs-bolt-t-shirt');
  await inventoryPage.addItemToCart('sauce-labs-fleece-jacket');
  await inventoryPage.addItemToCart('sauce-labs-onesie');
  await inventoryPage.addItemToCart('test.allthethings()-t-shirt-(red)');
  await inventoryAssertions.verifyCartBadgeCount('6');

  // Remove all items from cart
  await inventoryPage.removeItemFromCart('sauce-labs-backpack');
  await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
  await inventoryPage.removeItemFromCart('sauce-labs-bolt-t-shirt');
  await inventoryPage.removeItemFromCart('sauce-labs-fleece-jacket');
  await inventoryPage.removeItemFromCart('sauce-labs-onesie');
  await inventoryPage.removeItemFromCart('test.allthethings()-t-shirt-(red)');

  // Verify cart is empty
  await inventoryAssertions.verifyCartBadgeNotVisible();

  // Verify all add to cart buttons are visible
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-backpack');
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-bike-light');
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-bolt-t-shirt');
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-fleece-jacket');
  await inventoryAssertions.verifyAddToCartButtonExists('sauce-labs-onesie');
  await inventoryAssertions.verifyAddToCartButtonExists('test.allthethings()-t-shirt-(red)');

  await testInfo.attach('all-items-removed-from-cart', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

import { test, expect } from '@fixtures/baseTest';

test.describe('Hamburger Menu Tests', () => {
  test.beforeEach(async ({ page, loginPage, inventoryAssertions }) => {
    await page.goto('/');
    // Login first as hamburger menu is only available after login
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();
  });

  test('should open hamburger menu', async ({ hamburgerMenuPage, hamburgerMenuAssertions }) => {
    // Open the hamburger menu
    await hamburgerMenuPage.openMenu();

    // Verify menu is open
    await hamburgerMenuAssertions.verifyMenuIsOpen();

    // Verify all menu items are visible
    await hamburgerMenuAssertions.verifyAllItemsLinkIsVisible();
    await hamburgerMenuAssertions.verifyAboutLinkIsVisible();
    await hamburgerMenuAssertions.verifyLogoutLinkIsVisible();
    await hamburgerMenuAssertions.verifyResetAppStateLinkIsVisible();
  });

  test('should close hamburger menu when close button is clicked', async ({ hamburgerMenuPage, hamburgerMenuAssertions }) => {
    // Open the menu
    await hamburgerMenuPage.openMenu();
    await hamburgerMenuAssertions.verifyMenuIsOpen();

    // Close the menu
    await hamburgerMenuPage.closeMenu();
    await hamburgerMenuAssertions.verifyMenuIsClosed();
  });

  test('should navigate to All Items when clicking All Items link', async ({ page, inventoryPage, hamburgerMenuPage, hamburgerMenuAssertions }) => {
    // Navigate to cart page
    await inventoryPage.clickCartLink();

    // Verify we're on cart page
    expect(page.url()).toContain('/cart.html');

    // Open hamburger menu
    await hamburgerMenuPage.openMenu();
    await hamburgerMenuAssertions.verifyMenuIsOpen();

    // Click All Items link
    await hamburgerMenuPage.clickAllItemsLink();

    // Verify we're back on the inventory page
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('should navigate to About page when About link is clicked', async ({ page, hamburgerMenuPage, hamburgerMenuAssertions }) => {
    // Open hamburger menu
    await hamburgerMenuPage.openMenu();
    await hamburgerMenuAssertions.verifyMenuIsOpen();

    // Click About link and wait for navigation
    await Promise.all([
      page.waitForURL(/saucelabs\.com/, { timeout: 15000, waitUntil: 'domcontentloaded' }),
      hamburgerMenuPage.clickAboutLink()
    ]);

    // Verify navigation to Sauce Labs website (external link)
    expect(page.url()).toContain('saucelabs.com');
  });

  test('should logout successfully when clicking logout link', async ({ hamburgerMenuPage, loginAssertions }) => {
    // Open hamburger menu
    await hamburgerMenuPage.openMenu();

    // Click logout
    await hamburgerMenuPage.clickLogoutLink();

    // Verify redirected to login page
    await loginAssertions.verifyLoginLandingDetails();
  });

  test('should reset app state and clear cart', async ({ page, inventoryPage, hamburgerMenuPage, hamburgerMenuAssertions, inventoryAssertions }) => {
    // Add items to cart
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');

    // Verify cart has items
    const cartBadge = inventoryPage.getCartBadge();
    await expect(cartBadge).toHaveText('2');

    // Open hamburger menu
    await hamburgerMenuPage.openMenu();
    await hamburgerMenuAssertions.verifyMenuIsOpen();

    // Click Reset App State
    await hamburgerMenuPage.clickResetAppStateLink();

    // Wait a moment for the state to reset
    await page.waitForTimeout(500);

    // Close menu
    await hamburgerMenuPage.closeMenu();
    await hamburgerMenuAssertions.verifyMenuIsClosed();

    // Verify cart badge is cleared
    await inventoryAssertions.verifyCartBadgeNotVisible();
  });
});

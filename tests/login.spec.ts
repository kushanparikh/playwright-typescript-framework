import { test, expect } from './fixtures/baseTest';

test.beforeEach(async ({ page, loginAssertions }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await loginAssertions.verifyLoginLandingDetails();
});

test('should login successfully with valid credentials', async ({ page, loginPage, inventoryAssertions }, testInfo) => {
  // Use LoginPage to perform login
  await loginPage.login('standard_user', 'secret_sauce')

  // Verify URL has changed
  await inventoryAssertions.verifyInventoryLandingDetails();

  // Attach screenshot to report
  await testInfo.attach('inventory-page-after-login', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test.describe('Login with invalid credentials', () => {
  test('should show error for locked out user', async ({ page, loginPage, loginAssertions }, testInfo) => {
    // Use LoginPage to perform login
    await loginPage.login('locked_out_user', 'secret_sauce')

    // Verify error message is displayed
    await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Sorry, this user has been locked out.');

    // Attach screenshot to report
    await testInfo.attach('error-locked-out-user', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with non-existent username', async ({ page, loginPage, loginAssertions }, testInfo) => {
    // Use LoginPage to perform login
    await loginPage.login('invalid_user', 'secret_sauce')

    //Verify error message is displayed
    await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Username and password do not match any user in this service');

    // Attach screenshot to report
    await testInfo.attach('error-non-existent-username', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with empty password', async ({ page, loginPage, loginAssertions }, testInfo) => {
    // Use LoginPage to perform login
    await loginPage.login('standard_user', '');

    //Verify error message is displayed
    await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Password is required');

    // Attach screenshot to report
    await testInfo.attach('error-empty-password', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should show error with empty username', async ({ page, loginPage, loginAssertions }, testInfo) => {
    // Use LoginPage to perform login
    await loginPage.login('', 'secret_sauce');

    //Verify error message is displayed
    await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Username is required');

    // Attach screenshot to report
    await testInfo.attach('error-empty-username', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

test.describe('Special user types', () => {
  test.beforeEach(async ({ page, loginAssertions }) => {
    await page.goto('/');
    await loginAssertions.verifyLoginLandingDetails();
  });

  test('should login with problem_user and verify broken product images', async ({ page, loginPage, inventoryPage, inventoryAssertions }, testInfo) => {
    await loginPage.login('problem_user', 'secret_sauce');

    await inventoryAssertions.verifyInventoryLandingDetails();

    const productImages = inventoryPage.getProductImages();
    const imageCount = await productImages.count();

    for (let i = 0; i < imageCount; i++) {
      const img = productImages.nth(i);
      const src = await img.getAttribute('src');
      await expect(src).toContain('sl-404');
    }

    await testInfo.attach('problem-user-broken-images', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should login with performance_glitch_user and handle delayed response', async ({ page, loginPage, inventoryAssertions }, testInfo) => {
    test.setTimeout(60000);

    const startTime = Date.now();

    await loginPage.login('performance_glitch_user', 'secret_sauce');

    await inventoryAssertions.verifyInventoryLandingDetails();

    const endTime = Date.now();
    const loadTime = endTime - startTime;

    expect(loadTime).toBeGreaterThan(1000);

    await testInfo.attach('performance-glitch-user-login', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should login with error_user', async ({ page, loginPage, inventoryAssertions }, testInfo) => {
    test.setTimeout(60000);

    await loginPage.login('error_user', 'secret_sauce');

    await inventoryAssertions.verifyInventoryLandingDetails();

    await testInfo.attach('error-user-login', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should login with visual_user', async ({ page, loginPage, inventoryAssertions }, testInfo) => {
    await loginPage.login('visual_user', 'secret_sauce');

    await inventoryAssertions.verifyInventoryLandingDetails();

    await testInfo.attach('visual-user-login', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

test.describe('UI element verification', () => {
  test('should verify logo is visible', async ({ loginAssertions }) => {
    await loginAssertions.verifyLogoIsVisible();
  });

  test('should verify password field is masked', async ({ loginAssertions }) => {
    await loginAssertions.verifyPasswordFieldIsMasked();
  });

  test('should verify login logo text content', async ({ page }) => {
    const logo = page.locator('.login_logo');
    await expect(logo).toContainText('Swag Labs');
  });
});

test.describe('Keyboard navigation', () => {
  test('should support tab order navigation', async ({ page, loginPage }) => {
    await page.keyboard.press('Tab');
    await expect(loginPage.getUsernameField()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(loginPage.getPasswordField()).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(loginPage.getLoginButton()).toBeFocused();

    await loginPage.getUsernameField().fill('standard_user');
    await loginPage.getPasswordField().fill('secret_sauce');

    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/.*inventory.html/);
  });
});
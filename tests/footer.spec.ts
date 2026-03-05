import { test, expect } from '@fixtures/baseTest';

test.describe('Footer Tests', () => {
  test.beforeEach(async ({ page, loginPage }) => {
    await page.goto('/');
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('should verify Twitter link is present and valid', async ({ page, footerAssertions }, testInfo) => {
    await footerAssertions.verifyTwitterLinkIsValid();

    // Attach screenshot to report
    await testInfo.attach('footer-twitter-link', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should verify Facebook link is present and valid', async ({ page, footerAssertions }, testInfo) => {
    await footerAssertions.verifyFacebookLinkIsValid();

    // Attach screenshot to report
    await testInfo.attach('footer-facebook-link', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should verify LinkedIn link is present and valid', async ({ page, footerAssertions }, testInfo) => {
    await footerAssertions.verifyLinkedInLinkIsValid();

    // Attach screenshot to report
    await testInfo.attach('footer-linkedin-link', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });

  test('should verify copyright text is displayed correctly', async ({ page, footerAssertions }, testInfo) => {
    await footerAssertions.verifyCopyrightTextIsDisplayed();

    // Attach screenshot to report
    await testInfo.attach('footer-copyright-text', {
      body: await page.screenshot(),
      contentType: 'image/png',
    });
  });
});

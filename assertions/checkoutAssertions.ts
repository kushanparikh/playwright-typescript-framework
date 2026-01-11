import { expect } from "@playwright/test";
import CheckoutPage from "../pages/checkoutPage";

export default class CheckoutAssertions {
    private checkoutPage: CheckoutPage;

    constructor(checkoutPage: CheckoutPage) {
        this.checkoutPage = checkoutPage;
    }

    async verifyCheckoutInformationPageURL() {
        await expect(this.checkoutPage.getURL()).toContain('checkout-step-one.html');
    }

    async verifyCheckoutOverviewPageURL() {
        await expect(this.checkoutPage.getURL()).toContain('checkout-step-two.html');
    }

    async verifyCartPageURL() {
        await expect(this.checkoutPage.getURL()).toContain('cart.html');
    }

    async verifyErrorMessage(message: string) {
        await expect(this.checkoutPage.getErrorMessage()).toBeVisible();
        await expect(await this.checkoutPage.getErrorMessageText()).toContain(message);
    }

    async verifyFirstNameFieldIsVisible() {
        await expect(this.checkoutPage.getFirstNameField()).toBeVisible();
    }

    async verifyLastNameFieldIsVisible() {
        await expect(this.checkoutPage.getLastNameField()).toBeVisible();
    }

    async verifyPostalCodeFieldIsVisible() {
        await expect(this.checkoutPage.getPostalCodeField()).toBeVisible();
    }

    async verifyContinueButtonIsVisible() {
        await expect(this.checkoutPage.getContinueButton()).toBeVisible();
    }

    async verifyCancelButtonIsVisible() {
        await expect(this.checkoutPage.getCancelButton()).toBeVisible();
    }

    async verifyCheckoutCompletePageURL() {
        await expect(this.checkoutPage.getURL()).toContain('checkout-complete.html');
    }

    async verifyInventoryPageURL() {
        await expect(this.checkoutPage.getURL()).toContain('inventory.html');
    }

    async verifyCompleteHeader(expectedText: string) {
        await expect(this.checkoutPage.getCompleteHeader()).toBeVisible();
        await expect(await this.checkoutPage.getCompleteHeaderText()).toContain(expectedText);
    }

    async verifyCompleteText(expectedText: string) {
        await expect(this.checkoutPage.getCompleteText()).toBeVisible();
        await expect(await this.checkoutPage.getCompleteTextContent()).toContain(expectedText);
    }

    async verifyBackHomeButtonIsVisible() {
        await expect(this.checkoutPage.getBackHomeButton()).toBeVisible();
    }

    async verifyFinishButtonIsVisible() {
        await expect(this.checkoutPage.getFinishButton()).toBeVisible();
    }
}

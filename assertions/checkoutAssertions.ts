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

    async verifyCancelButtonOnOverviewIsVisible() {
        await expect(this.checkoutPage.getCancelButtonOnOverview()).toBeVisible();
    }

    async verifyCartItemsCount(expectedCount: number) {
        const actualCount = await this.checkoutPage.getCartItemsCount();
        expect(actualCount).toBe(expectedCount);
    }

    async verifyCartItemName(expectedName: string, index: number = 0) {
        const actualName = await this.checkoutPage.getCartItemNameText(index);
        expect(actualName).toBe(expectedName);
    }

    async verifySubtotalIsVisible() {
        await expect(this.checkoutPage.getSubtotalLabel()).toBeVisible();
    }

    async verifySubtotalAmount(expectedAmount: number) {
        const actualAmount = await this.checkoutPage.getSubtotalAmount();
        expect(actualAmount).toBe(expectedAmount);
    }

    async verifyTaxIsVisible() {
        await expect(this.checkoutPage.getTaxLabel()).toBeVisible();
    }

    async verifyTaxAmount(expectedAmount: number) {
        const actualAmount = await this.checkoutPage.getTaxAmount();
        expect(actualAmount).toBeCloseTo(expectedAmount, 2);
    }

    async verifyTotalIsVisible() {
        await expect(this.checkoutPage.getTotalLabel()).toBeVisible();
    }

    async verifyTotalAmount(expectedAmount: number) {
        const actualAmount = await this.checkoutPage.getTotalAmount();
        expect(actualAmount).toBeCloseTo(expectedAmount, 2);
    }

    async verifyTotalCalculation() {
        const subtotal = await this.checkoutPage.getSubtotalAmount();
        const tax = await this.checkoutPage.getTaxAmount();
        const total = await this.checkoutPage.getTotalAmount();
        const expectedTotal = subtotal + tax;
        expect(total).toBeCloseTo(expectedTotal, 2);
    }

    async verifyPaymentInfoIsVisible() {
        await expect(this.checkoutPage.getPaymentInfo()).toBeVisible();
    }

    async verifyShippingInfoIsVisible() {
        await expect(this.checkoutPage.getShippingInfo()).toBeVisible();
    }

    async verifyItemTotalIsDisplayed() {
        await expect(this.checkoutPage.getSubtotalLabel()).toBeVisible();
    }

    async verifyTaxIsDisplayed() {
        await expect(this.checkoutPage.getTaxLabel()).toBeVisible();
    }

    async verifyTotalPriceIsDisplayed() {
        await expect(this.checkoutPage.getTotalLabel()).toBeVisible();
    }

    async verifyOrderConfirmationMessage() {
        await expect(this.checkoutPage.getCompleteHeader()).toBeVisible();
        await expect(await this.checkoutPage.getCompleteHeaderText()).toContain('Thank you for your order');
    }

    async verifyThankYouMessage() {
        await expect(this.checkoutPage.getCompleteText()).toBeVisible();
        await expect(await this.checkoutPage.getCompleteTextContent()).toContain('Your order has been dispatched');
    }
}

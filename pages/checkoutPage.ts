import { Page, Locator } from '@playwright/test';

export default class CheckoutPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string) {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
        await this.page.locator('[data-test="lastName"]').fill(lastName);
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    async clickContinue() {
        await this.page.locator('[data-test="continue"]').click();
    }

    async clickCancel() {
        await this.page.locator('[data-test="cancel"]').click();
    }

    async fillFirstName(firstName: string) {
        await this.page.locator('[data-test="firstName"]').fill(firstName);
    }

    async fillLastName(lastName: string) {
        await this.page.locator('[data-test="lastName"]').fill(lastName);
    }

    async fillPostalCode(postalCode: string) {
        await this.page.locator('[data-test="postalCode"]').fill(postalCode);
    }

    // Getters
    getURL(): string {
        return this.page.url();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    getFirstNameField(): Locator {
        return this.page.locator('[data-test="firstName"]');
    }

    getLastNameField(): Locator {
        return this.page.locator('[data-test="lastName"]');
    }

    getPostalCodeField(): Locator {
        return this.page.locator('[data-test="postalCode"]');
    }

    getContinueButton(): Locator {
        return this.page.locator('[data-test="continue"]');
    }

    getCancelButton(): Locator {
        return this.page.locator('[data-test="cancel"]');
    }

    getErrorMessage(): Locator {
        return this.page.locator('[data-test="error"]');
    }

    async getErrorMessageText(): Promise<string> {
        return (await this.page.locator('[data-test="error"]').textContent()) || '';
    }

    // Checkout Overview Page Actions
    async clickFinish() {
        await this.page.locator('[data-test="finish"]').click();
    }

    async clickCancelOnOverview() {
        await this.page.locator('[data-test="cancel"]').click();
    }

    // Checkout Overview Page Getters
    getFinishButton(): Locator {
        return this.page.locator('[data-test="finish"]');
    }

    getCancelButtonOnOverview(): Locator {
        return this.page.locator('[data-test="cancel"]');
    }

    getCartItems(): Locator {
        return this.page.locator('.cart_item');
    }

    async getCartItemsCount(): Promise<number> {
        return await this.getCartItems().count();
    }

    getCartItemName(index: number = 0): Locator {
        return this.page.locator('.inventory_item_name').nth(index);
    }

    async getCartItemNameText(index: number = 0): Promise<string> {
        return (await this.getCartItemName(index).textContent()) || '';
    }

    getSubtotalLabel(): Locator {
        return this.page.locator('[data-test="subtotal-label"]');
    }

    async getSubtotalText(): Promise<string> {
        return (await this.getSubtotalLabel().textContent()) || '';
    }

    async getSubtotalAmount(): Promise<number> {
        const text = await this.getSubtotalText();
        const match = text.match(/\$(\d+\.\d+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    getTaxLabel(): Locator {
        return this.page.locator('[data-test="tax-label"]');
    }

    async getTaxText(): Promise<string> {
        return (await this.getTaxLabel().textContent()) || '';
    }

    async getTaxAmount(): Promise<number> {
        const text = await this.getTaxText();
        const match = text.match(/\$(\d+\.\d+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    getTotalLabel(): Locator {
        return this.page.locator('[data-test="total-label"]');
    }

    async getTotalText(): Promise<string> {
        return (await this.getTotalLabel().textContent()) || '';
    }

    async getTotalAmount(): Promise<number> {
        const text = await this.getTotalText();
        const match = text.match(/\$(\d+\.\d+)/);
        return match ? parseFloat(match[1]) : 0;
    }

    getPaymentInfo(): Locator {
        return this.page.locator('[data-test="payment-info-value"]');
    }

    async getPaymentInfoText(): Promise<string> {
        return (await this.getPaymentInfo().textContent()) || '';
    }

    getShippingInfo(): Locator {
        return this.page.locator('[data-test="shipping-info-value"]');
    }

    async getShippingInfoText(): Promise<string> {
        return (await this.getShippingInfo().textContent()) || '';
    }

    // Checkout Complete Page Actions
    async clickBackHome() {
        await this.page.locator('[data-test="back-to-products"]').click();
    }

    // Checkout Complete Page Getters
    getCompleteHeader(): Locator {
        return this.page.locator('[data-test="complete-header"]');
    }

    async getCompleteHeaderText(): Promise<string> {
        return (await this.page.locator('[data-test="complete-header"]').textContent()) || '';
    }

    getCompleteText(): Locator {
        return this.page.locator('[data-test="complete-text"]');
    }

    async getCompleteTextContent(): Promise<string> {
        return (await this.page.locator('[data-test="complete-text"]').textContent()) || '';
    }

    getBackHomeButton(): Locator {
        return this.page.locator('[data-test="back-to-products"]');
    }
}

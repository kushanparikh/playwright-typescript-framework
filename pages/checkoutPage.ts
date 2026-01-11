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

    // Checkout Overview Page Getters
    getFinishButton(): Locator {
        return this.page.locator('[data-test="finish"]');
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

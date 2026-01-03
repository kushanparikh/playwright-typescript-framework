import { Page } from '@playwright/test';

export default class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async addItemToCart(itemTestId: string) {
        await this.page.locator(`[data-test="add-to-cart-${itemTestId}"]`).click();
    }
}
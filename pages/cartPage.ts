import { Page, Locator } from '@playwright/test';

export default class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async navigateToCart() {
        await this.page.locator('[data-test="shopping-cart-link"]').click();
    }

    async removeItemFromCart(itemTestId: string) {
        await this.page.locator(`[data-test="remove-${itemTestId}"]`).click();
    }

    async clickContinueShopping() {
        await this.page.locator('[data-test="continue-shopping"]').click();
    }

    async clickCheckout() {
        await this.page.locator('[data-test="checkout"]').click();
    }

    // Getters - Return element states without assertions
    getURL(): string {
        return this.page.url();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    getSecondaryTitle(): Locator {
        return this.page.locator('[data-test="title"]');
    }

    getCartItems(): Locator {
        return this.page.locator('[data-test="inventory-item"]');
    }

    getCartItemName(itemTestId: string): Locator {
        return this.page.locator(`[data-test="inventory-item-name"]`).filter({ hasText: itemTestId });
    }

    getAllCartItemNames(): Locator {
        return this.page.locator('[data-test="inventory-item-name"]');
    }

    getAllCartItemPrices(): Locator {
        return this.page.locator('[data-test="inventory-item-price"]');
    }

    getCartQuantity(): Locator {
        return this.page.locator('[data-test="item-quantity"]');
    }

    getAllCartQuantities(): Locator {
        return this.page.locator('[data-test="item-quantity"]');
    }

    getRemoveButton(itemTestId: string): Locator {
        return this.page.locator(`[data-test="remove-${itemTestId}"]`);
    }

    getContinueShoppingButton(): Locator {
        return this.page.locator('[data-test="continue-shopping"]');
    }

    getCheckoutButton(): Locator {
        return this.page.locator('[data-test="checkout"]');
    }

    getCartBadge(): Locator {
        return this.page.locator('[data-test="shopping-cart-badge"]');
    }
}

import { Page, Locator } from '@playwright/test';

type FilterType = 'az' | 'za' | 'lohi' | 'hilo';

export default class InventoryPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async addItemToCart(itemTestId: string) {
        await this.page.locator(`[data-test="add-to-cart-${itemTestId}"]`).click();
    }

    async removeItemFromCart(itemTestId: string) {
        await this.page.locator(`[data-test="remove-${itemTestId}"]`).click();
    }

    async applyPriceFilter(filterType: FilterType) {
        console.log(`Applying filter: ${filterType}`);
        await this.page.locator('[data-test="product-sort-container"]')
        .selectOption({value: filterType});
    }

    async verifyProductsSortedByPrice(sortOrder: string) {
        // TODO - Implementation would go here
        // Example: get all product prices and verify they are in the correct order
        console.log(`Verifying products are sorted by price in ${sortOrder} order`);
    }

    // Getters - Return element states without assertions
    getCartBadge(): Locator {
        return this.page.locator('[data-test="shopping-cart-badge"]');
    }

    getCartLink(): Locator {
        return this.page.locator('[data-test="shopping-cart-link"]');
    }

    getAddToCartButton(itemTestId: string): Locator {
        return this.page.locator(`[data-test="add-to-cart-${itemTestId}"]`);
    }

    getRemoveButton(itemTestId: string): Locator {
        return this.page.locator(`[data-test="remove-${itemTestId}"]`);
    }
}
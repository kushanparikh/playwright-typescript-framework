import { Page, Locator } from '@playwright/test';

export default class ProductDetailPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async navigateToProductDetailFromInventory(productName: string) {
        await this.page.locator('[data-test="inventory-item-name"]').filter({ hasText: productName }).click();
    }

    async addItemToCart() {
        await this.page.locator('[data-test="add-to-cart"]').click();
    }

    async removeItemFromCart() {
        await this.page.locator('[data-test="remove"]').click();
    }

    async clickBackToProducts() {
        await this.page.locator('[data-test="back-to-products"]').click();
    }

    // Getters - Return element states without assertions
    getURL(): string {
        return this.page.url();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    getProductName(): Locator {
        return this.page.locator('[data-test="inventory-item-name"]');
    }

    getProductDescription(): Locator {
        return this.page.locator('[data-test="inventory-item-desc"]');
    }

    getProductPrice(): Locator {
        return this.page.locator('[data-test="inventory-item-price"]');
    }

    getProductImage(): Locator {
        return this.page.locator('img.inventory_details_img');
    }

    getAddToCartButton(): Locator {
        return this.page.locator('[data-test="add-to-cart"]');
    }

    getRemoveButton(): Locator {
        return this.page.locator('[data-test="remove"]');
    }

    getBackToProductsButton(): Locator {
        return this.page.locator('[data-test="back-to-products"]');
    }

    getCartBadge(): Locator {
        return this.page.locator('[data-test="shopping-cart-badge"]');
    }

    getCartLink(): Locator {
        return this.page.locator('[data-test="shopping-cart-link"]');
    }
}

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

    async applyFilter(filterType: FilterType) {
        await this.page.locator('[data-test="product-sort-container"]')
        .selectOption({value: filterType});
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

    getItemPriceLocator(): Locator {
        return this.page.locator('[data-test="inventory-item-price"]');
    }

    getItemNameLocator(): Locator {
        return this.page.locator('[data-test="inventory-item-name"]');
    }
}
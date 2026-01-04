import { expect } from '@playwright/test';
import CartPage from '../pages/inventoryPage';

export default class CartAssertions {
    private cartPage: CartPage;

    constructor(cartPage: CartPage) {
        this.cartPage = cartPage;
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.cartPage.getCartBadge()).toHaveText(expectedCount);
    }

    async verifyCartLinkContainsCount(expectedCount: string) {
        await expect(this.cartPage.getCartLink()).toContainText(expectedCount);
    }

    async verifyRemoveButtonText(itemTestId: string, expectedText: string) {
        await expect(this.cartPage.getRemoveButton(itemTestId)).toHaveText(expectedText);
    }

    async verifyAddToCartButtonExists(itemTestId: string) {
        await expect(this.cartPage.getAddToCartButton(itemTestId)).toBeVisible();
    }

    async verifyRemoveButtonExists(itemTestId: string) {
        await expect(this.cartPage.getRemoveButton(itemTestId)).toBeVisible();
    }

    async verifyCartBadgeNotVisible() {
        await expect(this.cartPage.getCartBadge()).not.toBeVisible();
    }
}

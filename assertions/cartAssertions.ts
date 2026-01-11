import { expect } from '@playwright/test';
import CartPage from '../pages/cartPage';

export default class CartAssertions {
    private cartPage: CartPage;

    constructor(cartPage: CartPage) {
        this.cartPage = cartPage;
    }

    async verifyCartPageUrl() {
        expect(this.cartPage.getURL()).toContain('/cart.html');
    }

    async verifyCartPageTitle() {
        await expect(await this.cartPage.getTitle()).toContain('Swag Labs');
    }

    async verifySecondaryTitle(expectedText: string) {
        await expect(this.cartPage.getSecondaryTitle()).toHaveText(expectedText);
    }

    async verifyCartItemCount(expectedCount: number) {
        await expect(this.cartPage.getCartItems()).toHaveCount(expectedCount);
    }

    async verifyCartIsEmpty() {
        await expect(this.cartPage.getCartItems()).toHaveCount(0);
    }

    async verifyItemInCart(itemName: string) {
        const items = await this.cartPage.getAllCartItemNames().allTextContents();
        expect(items).toContain(itemName);
    }

    async verifyItemNotInCart(itemName: string) {
        const items = await this.cartPage.getAllCartItemNames().allTextContents();
        expect(items).not.toContain(itemName);
    }

    async verifyAllItemsInCart(itemNames: string[]) {
        const cartItemNames = await this.cartPage.getAllCartItemNames().allTextContents();
        for (const name of itemNames) {
            expect(cartItemNames).toContain(name);
        }
    }

    async verifyItemQuantity(expectedQuantity: string) {
        await expect(this.cartPage.getCartQuantity()).toHaveText(expectedQuantity);
    }

    async verifyAllQuantities(expectedQuantity: string) {
        const quantities = this.cartPage.getAllCartQuantities();
        const count = await quantities.count();

        for (let i = 0; i < count; i++) {
            await expect(quantities.nth(i)).toHaveText(expectedQuantity);
        }
    }

    async verifyContinueShoppingButtonVisible() {
        await expect(this.cartPage.getContinueShoppingButton()).toBeVisible();
    }

    async verifyCheckoutButtonVisible() {
        await expect(this.cartPage.getCheckoutButton()).toBeVisible();
    }

    async verifyRemoveButtonVisible(itemTestId: string) {
        await expect(this.cartPage.getRemoveButton(itemTestId)).toBeVisible();
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.cartPage.getCartBadge()).toHaveText(expectedCount);
    }

    async verifyCartBadgeNotVisible() {
        await expect(this.cartPage.getCartBadge()).not.toBeVisible();
    }

    async verifyInventoryUrl() {
        expect(this.cartPage.getURL()).toContain('/inventory.html');
    }

    async verifyCheckoutStepOneUrl() {
        expect(this.cartPage.getURL()).toContain('/checkout-step-one.html');
    }
}

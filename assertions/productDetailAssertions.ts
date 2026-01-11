import { expect } from '@playwright/test';
import ProductDetailPage from '../pages/productDetailPage';

export default class ProductDetailAssertions {
    private productDetailPage: ProductDetailPage;

    constructor(productDetailPage: ProductDetailPage) {
        this.productDetailPage = productDetailPage;
    }

    async verifyProductDetailPageLoaded() {
        await expect(this.productDetailPage.getURL()).toContain('/inventory-item.html');
        await expect(await this.productDetailPage.getTitle()).toContain('Swag Labs');
    }

    async verifyProductInformation(expectedName: string, expectedPrice: string, expectedDescription: string) {
        await expect(this.productDetailPage.getProductName()).toHaveText(expectedName);
        await expect(this.productDetailPage.getProductPrice()).toHaveText(expectedPrice);
        await expect(this.productDetailPage.getProductDescription()).toHaveText(expectedDescription);
    }

    async verifyProductNameDisplayed(expectedName: string) {
        await expect(this.productDetailPage.getProductName()).toHaveText(expectedName);
        await expect(this.productDetailPage.getProductName()).toBeVisible();
    }

    async verifyProductPriceDisplayed(expectedPrice: string) {
        await expect(this.productDetailPage.getProductPrice()).toHaveText(expectedPrice);
        await expect(this.productDetailPage.getProductPrice()).toBeVisible();
    }

    async verifyProductDescriptionDisplayed(expectedDescription: string) {
        await expect(this.productDetailPage.getProductDescription()).toHaveText(expectedDescription);
        await expect(this.productDetailPage.getProductDescription()).toBeVisible();
    }

    async verifyProductImageDisplayed() {
        const img = this.productDetailPage.getProductImage();
        await expect(img).toBeVisible();

        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src).not.toContain('WithGarbageOnItToBreakTheUrl');
    }

    async verifyAddToCartButtonVisible() {
        await expect(this.productDetailPage.getAddToCartButton()).toBeVisible();
    }

    async verifyRemoveButtonVisible() {
        await expect(this.productDetailPage.getRemoveButton()).toBeVisible();
    }

    async verifyBackToProductsButtonVisible() {
        await expect(this.productDetailPage.getBackToProductsButton()).toBeVisible();
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.productDetailPage.getCartBadge()).toHaveText(expectedCount);
    }

    async verifyCartBadgeNotVisible() {
        await expect(this.productDetailPage.getCartBadge()).not.toBeVisible();
    }

    async verifyNavigatedBackToInventory() {
        await expect(this.productDetailPage.getURL()).toContain('/inventory.html');
        await expect(await this.productDetailPage.getTitle()).toContain('Swag Labs');
    }
}

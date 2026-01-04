import { expect } from '@playwright/test';
import InventoryPage from '../pages/inventoryPage';

type FilterType = 'az' | 'za' | 'lohi' | 'hilo';

export default class CartAssertions {
    private inventoryPage: InventoryPage;

    constructor(inventoryPage: InventoryPage) {
        this.inventoryPage = inventoryPage;
    }

    async verifyCartBadgeCount(expectedCount: string) {
        await expect(this.inventoryPage.getCartBadge()).toHaveText(expectedCount);
    }

    async verifyCartLinkContainsCount(expectedCount: string) {
        await expect(this.inventoryPage.getCartLink()).toContainText(expectedCount);
    }

    async verifyRemoveButtonText(itemTestId: string, expectedText: string) {
        await expect(this.inventoryPage.getRemoveButton(itemTestId)).toHaveText(expectedText);
    }

    async verifyAddToCartButtonExists(itemTestId: string) {
        await expect(this.inventoryPage.getAddToCartButton(itemTestId)).toBeVisible();
    }

    async verifyRemoveButtonExists(itemTestId: string) {
        await expect(this.inventoryPage.getRemoveButton(itemTestId)).toBeVisible();
    }

    async verifyCartBadgeNotVisible() {
        await expect(this.inventoryPage.getCartBadge()).not.toBeVisible();
    }

    async verifyProductsSorted(sortOrder: FilterType) {
        // TODO - Implementation would go here
        // Example: get all product prices and verify they are in the correct order
        console.log(`Verifying products are sorted by price in ${sortOrder} order`);
        if (sortOrder === 'lohi') {
            await this.verifyProductsSortedByPrice('lohi');
        } else if (sortOrder === 'hilo') {
            await this.verifyProductsSortedByPrice('hilo');
        } else if (sortOrder === 'az') {
            await this.verifyProductsSortedByAlphabet('az');
        } else if (sortOrder === 'za') {
            await this.verifyProductsSortedByAlphabet('za');
        }
    }

    private async verifyProductsSortedByPrice(sortOrder: 'lohi' | 'hilo') {
        // Get all product price elements
        const priceElements = await this.inventoryPage.getItemPriceLocator().allTextContents();
        // Extract prices from elements
        const prices = await Promise.all(priceElements.map(async (priceElement) => {
            return parseFloat(priceElement?.replace('$', '') || '0');
        }));

        // Verify sorting
        if (sortOrder === 'lohi') {
            for (let i = 0; i < prices.length - 1; i++) {
                expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
            }
        } else {
            for (let i = 0; i < prices.length - 1; i++) {
                expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
            }
        }
    }

    private async verifyProductsSortedByAlphabet(sortOrder: 'az' | 'za') {
        // Get all product name elements
        const nameElements = await this.inventoryPage.getItemNameLocator().allTextContents();

        if (sortOrder === 'az') {
            // Create a sorted list of names to compare
            const sortedNames = nameElements.slice().sort();

            // Verify UI elements are sorted as per az
            expect(nameElements).toEqual(sortedNames);
        } else {
            // Create a reverse sorted list of names to compare
            const reverseSortedNames = nameElements.slice().sort().reverse();

            // Verify UI elements are sorted as per za
            expect(nameElements).toEqual(reverseSortedNames);
        }
    }
}

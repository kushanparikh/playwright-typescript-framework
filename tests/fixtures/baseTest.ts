import { test as baseTest, expect } from "@playwright/test";
import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import CartPage from "../../pages/cartPage";
import ProductDetailPage from "../../pages/productDetailPage";
import CheckoutPage from "../../pages/checkoutPage";
import InventoryAssertions from "../../assertions/inventoryAssertions";
import LoginAssertions from "../../assertions/loginAssertions";
import CartAssertions from "../../assertions/cartAssertions";
import ProductDetailAssertions from "../../assertions/productDetailAssertions";
import CheckoutAssertions from "../../assertions/checkoutAssertions";

// 1. Define a type for your fixtures
type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    productDetailPage: ProductDetailPage;
    checkoutPage: CheckoutPage;
    inventoryAssertions: InventoryAssertions;
    loginAssertions: LoginAssertions;
    cartAssertions: CartAssertions;
    productDetailAssertions: ProductDetailAssertions;
    checkoutAssertions: CheckoutAssertions;
};

// 2. Extend the base test to include these fixtures
export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    productDetailPage: async ({ page }, use) => {
        await use(new ProductDetailPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    inventoryAssertions: async ({ inventoryPage }, use) => {
        await use(new InventoryAssertions(inventoryPage));
    },

    loginAssertions: async ({ loginPage }, use) => {
        await use(new LoginAssertions(loginPage));
    },

    cartAssertions: async ({ cartPage }, use) => {
        await use(new CartAssertions(cartPage));
    },

    productDetailAssertions: async ({ productDetailPage }, use) => {
        await use(new ProductDetailAssertions(productDetailPage));
    },

    checkoutAssertions: async ({ checkoutPage }, use) => {
        await use(new CheckoutAssertions(checkoutPage));
    },
});

// 3. Export the assertion function
export { expect };
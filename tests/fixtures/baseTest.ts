import { test as baseTest, expect } from "@playwright/test";
import LoginPage from "../../pages/loginPage";
import InventoryPage from "../../pages/inventoryPage";
import InventoryAssertions from "../../assertions/inventoryAssertions";

// 1. Define a type for your fixtures
type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    inventoryAssertions: InventoryAssertions;
};

// 2. Extend the base test to include these fixtures
export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    
    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    inventoryAssertions: async ({ inventoryPage }, use) => {
        await use(new InventoryAssertions(inventoryPage));
    },
});

// 3. Export the assertion function
export { expect };
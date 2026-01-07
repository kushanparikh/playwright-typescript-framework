import { test, expect } from "../fixtures/baseTest";
import { AxeBuilder } from "@axe-core/playwright";

test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test('Login Page Accessibility', async ({page}) => {
        const accessibilityScanResults = await new AxeBuilder({page})
            .analyze()
        const violationsList = accessibilityScanResults.violations.map(violation => violation.id)
        console.log(violationsList)
        expect(accessibilityScanResults.violations).toHaveLength(0)
    })

    test('Inventory Page Accessibility', async ({page, loginPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')

        // Verify URL has changed
        await inventoryAssertions.verifyInventoryLandingDetails();

        const accessibilityScanResults = await new AxeBuilder({page})
            .analyze()
        const violationsList = accessibilityScanResults.violations.map(violation => violation.id)
        console.log(violationsList)
        expect(accessibilityScanResults.violations).toHaveLength(0)
    })

    test('Cart Page Accessibility', async ({page, loginPage, inventoryPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')

        // Verify URL has changed
        await inventoryAssertions.verifyInventoryLandingDetails();

        await inventoryPage.addItemToCart('sauce-labs-backpack')

        await inventoryPage.clickCartLink()

        const accessibilityScanResults = await new AxeBuilder({page})
            .analyze()
        const violationsList = accessibilityScanResults.violations.map(violation => violation.id)
        console.log(violationsList)
        expect(accessibilityScanResults.violations).toHaveLength(0)
    })
})
import { Page } from "@playwright/test";
import { test, expect } from "../fixtures/baseTest";
import { AxeBuilder } from "@axe-core/playwright";

async function checkAccessibility(page: Page, pageName: string) {
    const accessibilityScanResults = await new AxeBuilder({page})
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

    if (accessibilityScanResults.violations.length > 0) {
        console.log(`\n🚨 Accessibility issues found on ${pageName}`)
        console.log(`📊 Total Violations: ${accessibilityScanResults.violations.length}`)
        
        accessibilityScanResults.violations.forEach((violation, index) => {
            console.log(`\n${index + 1}. ${violation.id}`)
            console.log(`   Impact: ${violation.impact}`)
            console.log(`   Description: ${violation.description}`)
            console.log(`   Help: ${violation.help}`)
            console.log(`   Help URL: ${violation.helpUrl}`)
            console.log(`   Affected Elements: ${violation.nodes.length}`)
            
            // Show specific selectors for affected elements
            violation.nodes.forEach((node, nodeIndex) => {
                console.log(`     Element ${nodeIndex + 1}: ${node.target.join(', ')}`)
            })
        })
        
        console.log('\n' + '='.repeat(80))
    } else {
        console.log(`✅ No accessibility violations found on ${pageName}`)
    }
    
    return accessibilityScanResults
}

test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test('Login Page should meet WCAG 2.1 Level AA standards', async ({page}) => {
        const result = await checkAccessibility(page, 'Login Page')
        expect(result.violations).toHaveLength(0)
    })

    test('Inventory Page should meet WCAG 2.1 Level AA standards', async ({page, loginPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();

        const result = await checkAccessibility(page, 'Inventory Page')
        expect(result.violations).toHaveLength(0)
    })

    test('Cart Page should meet WCAG 2.1 Level AA standards', async ({page, loginPage, inventoryPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();
        await inventoryPage.addItemToCart('sauce-labs-backpack')
        await inventoryPage.clickCartLink()

        const result = await checkAccessibility(page, 'Cart Page')
        expect(result.violations).toHaveLength(0)
    })
})
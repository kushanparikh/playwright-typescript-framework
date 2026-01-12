import { Page } from "@playwright/test";
import { test, expect } from "../fixtures/baseTest";
import { AxeBuilder } from "@axe-core/playwright";
import { KNOWN_ACCESSIBILITY_ISSUES, KnownIssue } from "./knownAccessibilityIssues";

interface ViolationSummary {
    id: string;
    impact: string;
    description: string;
}

function isKnownIssue(violation: ViolationSummary, knownIssues: KnownIssue[]): boolean {
    return knownIssues.some(known =>
        known.id === violation.id &&
        known.impact === violation.impact
    );
}

async function checkAccessibility(page: Page, pageName: string) {
    const accessibilityScanResults = await new AxeBuilder({page})
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

    const knownIssues = KNOWN_ACCESSIBILITY_ISSUES[pageName] || [];
    const knownViolations: ViolationSummary[] = [];
    const newViolations: ViolationSummary[] = [];

    // Categorize violations as known or new
    accessibilityScanResults.violations.forEach(violation => {
        const violationSummary: ViolationSummary = {
            id: violation.id,
            impact: violation.impact || 'unknown',
            description: violation.description
        };

        if (isKnownIssue(violationSummary, knownIssues)) {
            knownViolations.push(violationSummary);
        } else {
            newViolations.push(violationSummary);
        }
    });

    // Log results
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 Accessibility Report for ${pageName}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`📊 Total Violations Found: ${accessibilityScanResults.violations.length}`);
    console.log(`✅ Known Issues: ${knownViolations.length}`);
    console.log(`🚨 New Issues: ${newViolations.length}`);

    // Log known issues
    if (knownViolations.length > 0) {
        console.log(`\n📝 Known Issues (will not fail test):`);
        knownViolations.forEach((violation, index) => {
            console.log(`\n  ${index + 1}. ${violation.id}`);
            console.log(`     Impact: ${violation.impact}`);
            console.log(`     Description: ${violation.description}`);
        });
    }

    // Log new issues with full details
    if (newViolations.length > 0) {
        console.log(`\n🚨 NEW Issues Detected (test will fail):`);
        accessibilityScanResults.violations.forEach((violation, index) => {
            const summary: ViolationSummary = {
                id: violation.id,
                impact: violation.impact || 'unknown',
                description: violation.description
            };

            if (!isKnownIssue(summary, knownIssues)) {
                console.log(`\n  ${index + 1}. ${violation.id}`);
                console.log(`     Impact: ${violation.impact}`);
                console.log(`     Description: ${violation.description}`);
                console.log(`     Help: ${violation.help}`);
                console.log(`     Help URL: ${violation.helpUrl}`);
                console.log(`     Affected Elements: ${violation.nodes.length}`);

                // Show specific selectors for affected elements
                violation.nodes.forEach((node, nodeIndex) => {
                    console.log(`       Element ${nodeIndex + 1}: ${node.target.join(', ')}`);
                });
            }
        });
    } else if (accessibilityScanResults.violations.length === 0) {
        console.log(`\n✅ No accessibility violations found!`);
    } else {
        console.log(`\n✅ No new accessibility issues detected!`);
    }

    console.log(`\n${'='.repeat(80)}\n`);

    return {
        scanResults: accessibilityScanResults,
        newViolations,
        knownViolations
    };
}

test.describe('Accessibility Tests - WCAG 2.1 Level AA standards', () => {
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test('Login Page accessibility validation', async ({page}) => {
        const result = await checkAccessibility(page, 'Login Page')
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })

    test('Inventory Page accessibility validation', async ({page, loginPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();

        const result = await checkAccessibility(page, 'Inventory Page')
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })

    test('Cart Page accessibility validation', async ({page, loginPage, inventoryPage, inventoryAssertions}) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();
        await inventoryPage.addItemToCart('sauce-labs-backpack')
        await inventoryPage.clickCartLink()

        const result = await checkAccessibility(page, 'Cart Page')
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })
})
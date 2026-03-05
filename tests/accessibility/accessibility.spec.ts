import { Page, TestInfo } from "@playwright/test";
import { test, expect } from "@fixtures/baseTest";
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

async function checkAccessibility(page: Page, pageName: string, testInfo: TestInfo) {
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

    const separator = "================================================================================";
    const totalViolations = accessibilityScanResults.violations.length;

    const summaryLines: string[] = [];
    summaryLines.push(separator);
    summaryLines.push(`📋 Accessibility Report for ${pageName}`);
    summaryLines.push(separator);
    summaryLines.push(`📊 Total Violations Found: ${totalViolations}`);
    summaryLines.push(`✅ Known Issues: ${knownViolations.length}`);
    summaryLines.push(`🚨 New Issues: ${newViolations.length}`);

    if (knownViolations.length > 0) {
        summaryLines.push("");
        summaryLines.push("📝 Known Issues (will not fail test):");
        knownViolations.forEach((violation, index) => {
            summaryLines.push(`${index + 1}. ${violation.id}`);
            summaryLines.push(`   Impact: ${violation.impact}`);
            summaryLines.push(`   Description: ${violation.description}`);
        });
    }

    if (newViolations.length > 0) {
        summaryLines.push("");
        summaryLines.push("🚨 NEW Issues Detected (test will fail):");
        accessibilityScanResults.violations.forEach((violation, index) => {
            const summary: ViolationSummary = {
                id: violation.id,
                impact: violation.impact || 'unknown',
                description: violation.description
            };

            if (!isKnownIssue(summary, knownIssues)) {
                summaryLines.push(`${index + 1}. ${violation.id}`);
                summaryLines.push(`   Impact: ${violation.impact}`);
                summaryLines.push(`   Description: ${violation.description}`);
                summaryLines.push(`   Help: ${violation.help}`);
                summaryLines.push(`   Help URL: ${violation.helpUrl}`);
                summaryLines.push(`   Affected Elements: ${violation.nodes.length}`);
                violation.nodes.forEach((node, nodeIndex) => {
                    summaryLines.push(`     Element ${nodeIndex + 1}: ${node.target.join(", ")}`);
                });
            }
        });
    } else if (totalViolations === 0) {
        summaryLines.push("");
        summaryLines.push("✅ No accessibility violations found.");
    } else {
        summaryLines.push("");
        summaryLines.push("✅ No new accessibility issues detected.");
    }

    summaryLines.push("");
    summaryLines.push(separator);

    const reportName = `accessibility-report-${pageName.replace(/\s+/g, "-").toLowerCase()}`;
    await testInfo.attach(reportName, {
        body: Buffer.from(summaryLines.join("\n")),
        contentType: "text/plain",
    });

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

    test('Login Page accessibility validation', async ({page}, testInfo) => {
        const result = await checkAccessibility(page, 'Login Page', testInfo)
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })

    test('Inventory Page accessibility validation', async ({page, loginPage, inventoryAssertions}, testInfo) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();

        const result = await checkAccessibility(page, 'Inventory Page', testInfo)
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })

    test('Cart Page accessibility validation', async ({page, loginPage, inventoryPage, inventoryAssertions}, testInfo) => {
        await loginPage.login('standard_user', 'secret_sauce')
        await inventoryAssertions.verifyInventoryLandingDetails();
        await inventoryPage.addItemToCart('sauce-labs-backpack')
        await inventoryPage.clickCartLink()

        const result = await checkAccessibility(page, 'Cart Page', testInfo)
        expect(result.newViolations, 'New accessibility violations detected').toHaveLength(0)
    })
})
/**
 * Known Accessibility Issues
 *
 * This file tracks known accessibility violations in the demo website that won't be fixed.
 * Tests will only fail if NEW issues (not in this list) are detected.
 *
 * Structure: Map of page names to arrays of known violation IDs with their impact levels
 */

export interface KnownIssue {
    id: string;
    impact: string;
    description: string;
}

export const KNOWN_ACCESSIBILITY_ISSUES: Record<string, KnownIssue[]> = {
    // Add known issues here as they are identified
    'Login Page': [
    ],
    'Inventory Page': [
        {
            id: 'select-name',
            impact: 'critical',
            description: 'Ensure select element has an accessible name'
        }
    ],
    'Cart Page': [
    ]
};

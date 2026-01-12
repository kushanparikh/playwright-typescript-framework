# Accessibility Testing with Known Issues Tracking

This directory contains accessibility tests that track known issues and only fail when new violations are detected.

## How It Works

The accessibility tests scan pages using axe-core and compare findings against a list of known issues. Tests will:
- **PASS** if only known issues are found (or no issues at all)
- **FAIL** if new issues (not in the known issues list) are detected

## Files

- `accessibility.spec.ts` - Main test file containing accessibility validation tests
- `knownAccessibilityIssues.ts` - Configuration file tracking known accessibility violations that won't be fixed

## Running the Tests

```bash
# Run all accessibility tests
npx playwright test tests/accessibility/

# Run specific accessibility test
npx playwright test tests/accessibility/accessibility.spec.ts -g "Login Page"
```

## Adding Known Issues

When the test fails due to new violations that you've decided won't be fixed (e.g., demo website limitations):

1. Run the test and note the violation details in the console output
2. Open `knownAccessibilityIssues.ts`
3. Add the violation to the appropriate page's array:

```typescript
export const KNOWN_ACCESSIBILITY_ISSUES: Record<string, KnownIssue[]> = {
    'Login Page': [
        {
            id: 'color-contrast',
            impact: 'serious',
            description: 'Elements must have sufficient color contrast'
        }
    ],
    // ... other pages
};
```

## Test Output

The test provides detailed reporting:

```
📋 Accessibility Report for Login Page
================================================================================
📊 Total Violations Found: 3
✅ Known Issues: 2
🚨 New Issues: 1

📝 Known Issues (will not fail test):
  1. color-contrast
     Impact: serious
     Description: Elements must have sufficient color contrast

🚨 NEW Issues Detected (test will fail):
  1. button-name
     Impact: critical
     Description: Buttons must have discernible text
     Help: Ensures buttons have discernible text
     Help URL: https://dequeuniversity.com/rules/axe/4.x/button-name
     Affected Elements: 2
       Element 1: button#login-button
```

## Benefits

- ✅ Prevents test flakiness from pre-existing accessibility issues
- ✅ Still catches new accessibility regressions
- ✅ Documents known issues for future reference
- ✅ Provides detailed logging for both known and new issues
- ✅ Easy to maintain and update the known issues list

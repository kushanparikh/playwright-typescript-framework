# Playwright + TypeScript Learning Notes

Personal reference documentation for Playwright concepts and TypeScript patterns learned while building this test automation framework.

---

## Table of Contents

1. [Framework Capabilities Overview](#framework-capabilities-overview)
2. [Metadata Objects Overview](#metadata-objects-overview)
3. [testInfo Object](#testinfo-object)
4. [workerInfo Object](#workerinfo-object)
5. [Accessing Project and Config](#accessing-project-and-config)
6. [Test Structure](#test-structure)
7. [Fixtures](#fixtures)
8. [Hooks](#hooks)
9. [Locator Strategies](#locator-strategies)
10. [Configuration](#configuration)
11. [Assertions](#assertions)
12. [TypeScript Patterns](#typescript-patterns)
13. [Accessibility Testing](#accessibility-testing)
14. [Visual Regression Testing](#visual-regression-testing)
15. [CI/CD Integration](#cicd-integration)

---

## Framework Capabilities Overview

### What This Framework Demonstrates

This framework showcases modern test automation practices through five key capability areas:

#### 1. Functional Testing
**What it is**: Validating that application features work as intended.

**How implemented**:
- Login flows with positive/negative scenarios
- Shopping cart operations (add, remove, verify state)
- Product filtering and sorting validation
- Multi-step user journey testing

**Why this approach**:
- Page Object Model keeps tests readable and maintainable
- Custom assertions provide reusable verification logic
- Fixtures eliminate setup duplication

**Files to reference**:
- `tests/login.spec.ts` - Authentication scenarios
- `tests/inventory.spec.ts` - Cart operations
- `tests/filter.spec.ts` - Sorting algorithms

#### 2. Accessibility Testing (WCAG 2.1)
**What it is**: Automated validation that web applications are accessible to users with disabilities.

**How implemented**:
- axe-core integration via `@axe-core/playwright`
- WCAG 2.1 Level A & AA rules validation
- Automated violation detection and reporting
- Coverage across all major page types

**Why this approach**:
- Shift-left accessibility testing (catch issues early)
- Automated enforcement of accessibility standards
- Detailed violation reports for remediation

**Files to reference**:
- `tests/accessibility/accessibility.spec.ts`
- See [Accessibility Testing](#accessibility-testing) section

#### 3. Visual Regression Testing
**What it is**: Detecting unintended visual changes between test runs.

**How implemented**:
- Playwright's `toHaveScreenshot()` assertion
- Full-page screenshot capture and pixel comparison
- Configurable tolerance thresholds
- Baseline image management

**Why this approach**:
- Catches CSS/styling bugs automated tests might miss
- Ensures visual consistency across releases
- Cross-browser visual validation

**Files to reference**:
- `tests/visual/visualregression.spec.ts`
- `playwright.config.ts` (threshold configuration)
- See [Visual Regression Testing](#visual-regression-testing) section

#### 4. Cross-Browser Testing
**What it is**: Validating application behavior across different browser engines.

**How implemented**:
- Matrix execution in GitHub Actions
- Chromium, Firefox, WebKit configuration
- Parallel execution for speed
- Browser-specific conditional logic (when needed)

**Why this approach**:
- Real-world users use different browsers
- Browser engines have rendering differences
- Early detection of browser-specific bugs

**Files to reference**:
- `playwright.config.ts` (projects configuration)
- `.github/workflows/playwright.yml`

#### 5. CI/CD Integration
**What it is**: Automated test execution on code changes.

**How implemented**:
- GitHub Actions workflow
- Matrix strategy for parallel browser testing
- Artifact collection (reports, screenshots, traces)
- Retry logic for flaky test resilience

**Why this approach**:
- Continuous feedback on code quality
- Automated regression testing
- Evidence collection for debugging failures

**Files to reference**:
- `.github/workflows/playwright.yml`
- See [CI/CD Integration](#cicd-integration) section

---

## Metadata Objects Overview

Playwright provides several metadata objects for accessing information about test execution, workers, and configuration.

### Quick Comparison

| Object | Available In | Purpose |
|--------|--------------|---------|
| `testInfo` | Individual tests, `beforeEach`, `afterEach` | Current test metadata |
| `workerInfo` | `beforeAll`, `afterAll` | Worker process metadata |
| `testInfo.project` | Via testInfo | Current browser/project config |
| `testInfo.config` | Via testInfo | Full Playwright config |

### When to Use Each

| Scenario | Use |
|----------|-----|
| Attach screenshot to report | `testInfo.attach()` |
| Browser-specific logic | `testInfo.project.name` |
| Parallel worker isolation | `workerInfo.workerIndex` |
| Check retry count | `testInfo.retry` |
| Skip test conditionally | `testInfo.skip()` |
| Worker-specific database | `workerInfo.workerIndex` |

### Full Example

```typescript
import { test, expect } from '@playwright/test';

test.beforeAll(async ({}, workerInfo) => {
  console.log(`Worker ${workerInfo.workerIndex} starting`);
  console.log(`Project: ${workerInfo.project.name}`);
});

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running: ${testInfo.title}`);
  console.log(`Browser: ${testInfo.project.name}`);
  console.log(`Retry: ${testInfo.retry}`);
});

test('example with metadata', async ({ page }, testInfo) => {
  // Skip on specific browser
  if (testInfo.project.name === 'webkit') {
    testInfo.skip(true, 'Safari not supported yet');
  }
  
  await page.goto('/');
  
  // Attach screenshot
  await testInfo.attach('homepage', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });
});

test.afterAll(async ({}, workerInfo) => {
  console.log(`Worker ${workerInfo.workerIndex} finished`);
});
```

---

## Test Structure

### Basic Test Anatomy

```typescript
import { test, expect } from '@playwright/test';

test('descriptive test name', async ({ page }) => {
  // Arrange - setup
  await page.goto('/');
  
  // Act - perform actions
  await page.getByRole('button', { name: 'Submit' }).click();
  
  // Assert - verify results
  await expect(page).toHaveURL('/success');
});
```

### Test Naming Conventions

- Use descriptive names: `'should login successfully with valid credentials'`
- Start with `should` for behavior descriptions
- File naming: `*.spec.ts` or `*.test.ts` (Playwright default patterns)

---

## Fixtures

### What Are Fixtures?

Fixtures are pre-configured test dependencies that Playwright sets up **before** and tears down **after** each test automatically.

**Without fixtures (manual setup):**
```typescript
test('my test', async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://example.com');
  
  // Manual cleanup
  await page.close();
  await context.close();
  await browser.close();
});
```

**With fixtures (automatic):**
```typescript
test('my test', async ({ page }) => {
  await page.goto('https://example.com');
  // That's it - setup and cleanup handled automatically
});
```

### Built-in Fixtures

| Fixture | What It Provides |
|---------|------------------|
| `page` | A new browser tab (most commonly used) |
| `context` | Browser context (like incognito session) |
| `browser` | The browser instance itself |
| `request` | API request client for HTTP calls |
| `browserName` | Name of current browser (chromium/firefox/webkit) |

### Custom Fixtures (This Framework)

**How implemented**: `tests/fixtures/baseTest.ts`

```typescript
type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    inventoryAssertions: InventoryAssertions;
    loginAssertions: LoginAssertions;
};

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

    loginAssertions: async ({ loginPage }, use) => {
        await use(new LoginAssertions(loginPage));
    },
});
```

**Why this approach**:
- Eliminates repetitive object instantiation in tests
- Provides dependency injection pattern
- Makes tests cleaner and more focused on test logic
- Ensures proper lifecycle management

**Usage in tests**:
```typescript
// Before custom fixtures
test('my test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const loginAssertions = new LoginAssertions(loginPage);
  await loginPage.login('user', 'pass');
  await loginAssertions.verifyLoginLandingDetails();
});

// After custom fixtures
test('my test', async ({ loginPage, loginAssertions }) => {
  await loginPage.login('user', 'pass');
  await loginAssertions.verifyLoginLandingDetails();
});
```

### Using Multiple Fixtures

```typescript
// Destructure multiple fixtures from first argument
test('my test', async ({ page, context, request }) => {
  // All available directly
});
```

### Fixture Lifecycle

1. Before test: Playwright launches browser → creates context → opens page
2. During test: You use the `page` object
3. After test: Playwright closes page → closes context → closes browser

**Key insight:** Each test gets a fresh, isolated browser context.

---

## Hooks

### beforeEach

Runs **before every test** in the file. Use for common setup.

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('My App');
});

test('test 1', async ({ page }) => {
  // Page is already on '/' with title verified
});

test('test 2', async ({ page }) => {
  // Same setup runs again for this test
});
```

**Key point:** The `page` fixture in `beforeEach` is the **same instance** passed to the test.

**How used in this framework**:
```typescript
// tests/login.spec.ts
test.beforeEach(async ({ page, loginAssertions }) => {
  await page.goto('/');
  await loginAssertions.verifyLoginLandingDetails();
});
```

### afterEach

Runs **after every test**. Use for cleanup.

```typescript
test.afterEach(async ({ page }) => {
  // Cleanup actions
  await page.evaluate(() => localStorage.clear());
});
```

### beforeAll / afterAll

Run **once** before/after all tests in the file.

```typescript
test.beforeAll(async () => {
  // One-time setup (e.g., seed database)
});

test.afterAll(async () => {
  // One-time cleanup
});
```

**Note:** `beforeAll` and `afterAll` don't have access to `page` fixture since they run outside individual test contexts.

### Hook Execution Order

```
beforeAll (once)
  ├── beforeEach (test 1)
  │   └── test 1
  │   └── afterEach (test 1)
  ├── beforeEach (test 2)
  │   └── test 2
  │   └── afterEach (test 2)
afterAll (once)
```

---

## Locator Strategies

### Priority Order (Playwright Recommended)

1. **Role-based locators** - Best for accessibility and resilience
2. **Text-based locators** - When role isn't available
3. **Test ID locators** - Explicit test hooks in code
4. **CSS/XPath** - Last resort

### Role-Based Locators

Find elements by their **ARIA role** - how screen readers identify them.

#### What is ARIA?

ARIA = Accessible Rich Internet Applications. Every interactive HTML element has an implicit role:

| HTML Element | Implicit Role |
|--------------|---------------|
| `<button>` | `button` |
| `<a href="...">` | `link` |
| `<input type="text">` | `textbox` |
| `<input type="checkbox">` | `checkbox` |
| `<input type="submit">` | `button` |
| `<h1>` - `<h6>` | `heading` |
| `<select>` | `combobox` |
| `<img>` | `img` |
| `<ul>`, `<ol>` | `list` |
| `<li>` | `listitem` |

#### getByRole() Usage

```typescript
// Basic - finds any button
await page.getByRole('button').click();

// With name - finds button with specific text/label
await page.getByRole('button', { name: 'Login' }).click();

// Exact match - won't match "Login Now"
await page.getByRole('button', { name: 'Login', exact: true }).click();

// Links
await page.getByRole('link', { name: 'Sign up' }).click();

// Headings
await page.getByRole('heading', { name: 'Welcome' });

// Checkboxes
await page.getByRole('checkbox', { name: 'Remember me' }).check();
```

**How used in this framework**:
```typescript
// pages/loginPage.ts
async login(username: string, password: string) {
    await this.page.getByPlaceholder('Username').fill(username);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
}
```

**Why this approach**:
- Resilient to implementation changes (CSS class names, IDs)
- Self-documenting (reads like user intent)
- Ensures accessibility (if screen reader can't find it, neither can getByRole)

#### Handling Multiple Matches

```typescript
// Option 1: Use name to differentiate
await page.getByRole('button', { name: 'Save' }).click();
await page.getByRole('button', { name: 'Cancel' }).click();

// Option 2: Chain with parent locator
await page.locator('.modal').getByRole('button', { name: 'Confirm' }).click();

// Option 3: Use nth() - less ideal, order-dependent
await page.getByRole('button').first().click();
await page.getByRole('button').nth(1).click();
```

### Other Locator Methods

#### getByPlaceholder()
```typescript
// For inputs with placeholder text
await page.getByPlaceholder('Username').fill('john');
await page.getByPlaceholder('Password').fill('secret');
```

#### getByLabel()
```typescript
// For form inputs with associated <label>
await page.getByLabel('Email address').fill('john@example.com');
```

#### getByText()
```typescript
// Find by visible text content
await page.getByText('Welcome back').click();

// Exact match
await page.getByText('Welcome', { exact: true });
```

**How used in this framework**:
```typescript
// pages/inventoryPage.ts
getSecondaryTitle(): Locator {
    return this.page.getByText('Products')
}
```

#### getByTestId()
```typescript
// For elements with data-testid attribute
// HTML: <div data-testid="error-message">...</div>
await page.getByTestId('error-message');
```

**How used in this framework**:
```typescript
// pages/inventoryPage.ts
async addItemToCart(itemTestId: string) {
    await this.page.locator(`[data-test="add-to-cart-${itemTestId}"]`).click();
}
```

**Note:** SauceDemo uses `data-test` instead of `data-testid`, so we use locator with attribute selector.

#### CSS Selectors (Fallback)
```typescript
// Attribute selectors
await page.locator('[data-test="error"]');
await page.locator('input[name="username"]');

// Class/ID selectors
await page.locator('.error-message');
await page.locator('#login-button');
```

### Locator Best Practices

| Do | Don't |
|----|-------|
| `getByRole('button', { name: 'Submit' })` | `locator('#btn-123')` |
| `getByPlaceholder('Email')` | `locator('input[type="email"]')` |
| `getByTestId('cart-count')` | `locator('.cart > span:nth-child(2)')` |

**Why role-based is better:**
- More resilient to implementation changes
- Self-documenting (test reads like user intent)
- Ensures accessibility compliance

---

## Configuration

### playwright.config.ts Structure

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Where to find tests
  testDir: './tests',
  
  // Parallelization
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
  
  // Retries
  retries: process.env.CI ? 2 : 0,
  
  // Reporting
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    baseURL: 'https://www.saucedemo.com/',
    trace: 'on-first-retry',
    screenshot: 'on',
  },
  
  // Visual regression configuration
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  
  // Browser projects
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

### baseURL

Centralizes the application URL so tests use relative paths.

**In config:**
```typescript
use: {
  baseURL: 'https://www.saucedemo.com/',
}
```

**In tests:**
```typescript
// Instead of
await page.goto('https://www.saucedemo.com/');
await page.goto('https://www.saucedemo.com/inventory.html');

// Use relative paths
await page.goto('/');
await page.goto('/inventory.html');
```

### Screenshot Options

```typescript
use: {
  screenshot: 'off',              // Never capture
  screenshot: 'on',               // Always capture
  screenshot: 'only-on-failure',  // Capture only when test fails
}
```

**This framework uses**: `screenshot: 'on'` for maximum evidence collection.

### Trace Options

Traces capture detailed execution info for debugging.

```typescript
use: {
  trace: 'off',              // Never record
  trace: 'on',               // Always record
  trace: 'on-first-retry',   // Record on retry (good default)
  trace: 'retain-on-failure', // Keep only for failed tests
}
```

**This framework uses**: `trace: 'on-first-retry'` - balances debugging capability with storage.

View traces with: `npx playwright show-trace trace.zip`

### Video Options

```typescript
use: {
  video: 'off',              // Never record
  video: 'on',               // Always record
  video: 'on-first-retry',   // Record on retry
  video: 'retain-on-failure', // Keep only for failed tests
}
```

**This framework**: Video disabled (commented out) to reduce CI storage usage.

---

## Assertions

### Page Assertions

```typescript
// URL
await expect(page).toHaveURL('/inventory');
await expect(page).toHaveURL(/inventory/);  // Regex

// Title
await expect(page).toHaveTitle('Swag Labs');
await expect(page).toHaveTitle(/Swag/);  // Regex
```

**How used in this framework**:
```typescript
// assertions/inventoryAssertions.ts
async verifyInventoryLandingDetails() {
    await expect(this.inventoryPage.getURL()).toContain('/inventory');
    await expect(await this.inventoryPage.getTitle()).toContain('Swag Labs');
    await expect(this.inventoryPage.getSecondaryTitle()).toBeVisible();
}
```

### Locator Assertions

```typescript
const button = page.getByRole('button', { name: 'Submit' });

// Visibility
await expect(button).toBeVisible();
await expect(button).toBeHidden();

// Enabled/Disabled
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();

// Text content
await expect(button).toHaveText('Submit');
await expect(button).toContainText('Sub');  // Partial match

// Attribute
await expect(button).toHaveAttribute('type', 'submit');

// CSS class
await expect(button).toHaveClass(/primary/);

// Count
await expect(page.getByRole('listitem')).toHaveCount(5);
```

**How used in this framework**:
```typescript
// assertions/inventoryAssertions.ts
async verifyCartBadgeCount(expectedCount: string) {
    await expect(this.inventoryPage.getCartBadge()).toHaveText(expectedCount);
}

async verifyRemoveButtonText(itemTestId: string, expectedText: string) {
    await expect(this.inventoryPage.getRemoveButton(itemTestId)).toHaveText(expectedText);
}
```

### Soft Assertions

Continue test even if assertion fails:

```typescript
await expect.soft(button).toBeVisible();
await expect.soft(page).toHaveTitle('Expected');
// Test continues, failures collected at end
```

### Negating Assertions

```typescript
await expect(button).not.toBeVisible();
await expect(page).not.toHaveURL('/login');
```

**How used in this framework**:
```typescript
// assertions/inventoryAssertions.ts
async verifyCartBadgeNotVisible() {
    await expect(this.inventoryPage.getCartBadge()).not.toBeVisible();
}
```

---

## TypeScript Patterns

### Destructuring (Used in Tests)

```typescript
// Without destructuring
test('my test', async (fixtures) => {
  const page = fixtures.page;
  const context = fixtures.context;
});

// With destructuring (cleaner)
test('my test', async ({ page, context }) => {
  // page and context available directly
});
```

### Test Function Signature

```typescript
test('name', async ({ page }, testInfo) => {
  //              ^^^^^^^^  ^^^^^^^^
  //              |         |
  //              |         Second arg: test metadata
  //              First arg: destructured fixtures object
});
```

### Type Definitions

**How implemented in this framework**:

```typescript
// tests/fixtures/baseTest.ts
type MyFixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    inventoryAssertions: InventoryAssertions;
    loginAssertions: LoginAssertions;
};
```

**Custom type for filter options**:
```typescript
// pages/inventoryPage.ts
type FilterType = 'az' | 'za' | 'lohi' | 'hilo';

async applyFilter(filterType: FilterType) {
    await this.page.locator('[data-test="product-sort-container"]')
    .selectOption({value: filterType});
}
```

**Why this approach**:
- Type safety prevents invalid filter values
- IDE autocomplete for valid options
- Compile-time error detection

### Async/Await

All Playwright operations are asynchronous:

```typescript
// Every Playwright action needs await
await page.goto('/');
await page.click('button');
await expect(page).toHaveURL('/next');

// Without await - actions won't wait for completion
page.goto('/');  // ❌ Starts navigation but doesn't wait
page.click('button');  // ❌ Might execute before page loads
```

---

## Accessibility Testing

### What Is Accessibility Testing?

Ensuring web applications are usable by people with disabilities, following WCAG (Web Content Accessibility Guidelines) standards.

### How Implemented

**Library**: `@axe-core/playwright` (axe-core is the industry-standard accessibility testing engine)

**WCAG Levels Tested**:
- Level A: Basic accessibility (essential)
- Level AA: Intermediate accessibility (recommended)
- WCAG 2.1: Current standard with mobile/touch improvements

**Implementation**:

```typescript
// tests/accessibility/accessibility.spec.ts
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
            
            violation.nodes.forEach((node, nodeIndex) => {
                console.log(`     Element ${nodeIndex + 1}: ${node.target.join(', ')}`)
            })
        })
    }
    
    return accessibilityScanResults
}

test('Login Page accessibility validation', async ({page}) => {
    const result = await checkAccessibility(page, 'Login Page')
    expect(result.violations).toHaveLength(0)
})
```

### What Gets Checked

- **Color contrast**: Text readable against background
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **ARIA labels**: Screen reader compatibility
- **Form labels**: Input fields properly labeled
- **Alternative text**: Images have descriptive alt text
- **Semantic HTML**: Proper heading hierarchy, landmark regions

### Why This Approach

1. **Shift-left testing**: Catch accessibility issues early in development
2. **Automated enforcement**: No manual accessibility testing needed for basic compliance
3. **Detailed reporting**: Specific violations with remediation guidance
4. **CI/CD integration**: Prevents accessibility regressions

### Violation Report Format

```
🚨 Accessibility issues found on Login Page
📊 Total Violations: 3

1. color-contrast
   Impact: serious
   Description: Elements must have sufficient color contrast
   Help: Ensures sufficient contrast between foreground and background
   Help URL: https://dequeuniversity.com/rules/axe/4.4/color-contrast
   Affected Elements: 2
     Element 1: #user-name
     Element 2: #password
```

---

## Visual Regression Testing

### What Is Visual Regression Testing?

Automated comparison of UI screenshots to detect unintended visual changes between test runs.

### How Implemented

**Playwright's built-in**: `toHaveScreenshot()` assertion

**Configuration**:
```typescript
// playwright.config.ts
expect: {
  toHaveScreenshot: {
    animations: 'disabled',      // Disable animations for consistent screenshots
    caret: 'hide',               // Hide text cursor
    maxDiffPixels: 100,          // Allow up to 100 pixels difference
    maxDiffPixelRatio: 0.01,     // Allow 1% pixel difference
    threshold: 0.2,              // Pixel color threshold (0-1)
  },
}
```

**Implementation**:
```typescript
// tests/visual/visualregression.spec.ts
test('login page appearance', async ({ page }) => {
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true });
});

test('inventory page appearance', async ({ page, loginPage, inventoryAssertions }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await inventoryAssertions.verifyInventoryLandingDetails();
    await expect(page).toHaveScreenshot('inventory-page.png', { fullPage: true });
});
```

### How It Works

1. **First run**: Captures baseline screenshot, saves to `tests/visual/visualregression.spec.ts-snapshots/`
2. **Subsequent runs**: Compares current screenshot to baseline
3. **On mismatch**: 
   - Saves actual screenshot
   - Generates diff image highlighting differences
   - Test fails with visual comparison

### Baseline Management

**Generating baselines**:
```bash
npx playwright test --update-snapshots
```

**Platform-specific baselines**:
- `login-page-chromium-win32.png` (Windows)
- `login-page-chromium-linux.png` (Linux/CI)
- `login-page-firefox-darwin.png` (macOS)

**This framework approach**: Windows baselines generated locally, CI runs on Windows to match.

### Why This Approach

1. **Catches CSS bugs**: Detects styling changes automated tests might miss
2. **Responsive design validation**: Ensures UI consistency across screen sizes
3. **Cross-browser validation**: Catches browser-specific rendering issues
4. **Regression prevention**: Visual changes require explicit baseline updates

### Threshold Configuration Explained

```typescript
maxDiffPixels: 100,          // Absolute: Allow up to 100 pixels to differ
maxDiffPixelRatio: 0.01,     // Relative: Allow 1% of pixels to differ
threshold: 0.2,              // Sensitivity: 0 = exact match, 1 = very tolerant
```

**Tuning considerations**:
- Too strict: False positives from anti-aliasing, font rendering
- Too loose: Miss real visual bugs
- This framework's settings: Balanced for typical e-commerce UI

---

## CI/CD Integration

### GitHub Actions Configuration

**File**: `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  test:
    timeout-minutes: 60
    runs-on: windows-latest
    steps:
    - uses: actions/checkout@v5
    - uses: actions/setup-node@v5
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - name: Upload test results (including diffs)
      if: failure()
      uses: actions/upload-artifact@v4
      with:
        name: visual-regression-diffs
        path: test-results/
        retention-days: 7
    - uses: actions/upload-artifact@v4
      if: ${{ !cancelled() }}
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Key CI/CD Features

#### 1. **Trigger Conditions**
```yaml
on:
  push:
    branches: [ main, master ]    # Run on commits to main
  pull_request:
    branches: [ main, master ]    # Run on PRs targeting main
  workflow_dispatch:              # Manual trigger from GitHub UI
```

#### 2. **Platform Selection**
```yaml
runs-on: windows-latest
```

**Why Windows**: Matches local development environment, ensuring visual regression baselines are consistent.

#### 3. **Artifact Collection**
```yaml
- name: Upload test results (including diffs)
  if: failure()                   # Only upload on failure
  uses: actions/upload-artifact@v4
  with:
    name: visual-regression-diffs
    path: test-results/
    retention-days: 7
```

**What gets uploaded**:
- Test failure screenshots
- Visual regression diff images
- Trace files for debugging
- HTML report

#### 4. **Browser Installation**
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps
```

`--with-deps` installs system dependencies (e.g., browser libraries) needed for Chromium, Firefox, WebKit.

### CI vs Local Configuration

**Handled by environment variable**:
```typescript
// playwright.config.ts
retries: process.env.CI ? 2 : 0,      // Retry twice on CI, never locally
workers: process.env.CI ? 1 : undefined,  // Sequential on CI, parallel locally
```

**Why different**:
- CI: Sequential execution + retries for flaky test resilience
- Local: Parallel execution for faster feedback

### Viewing CI Results

1. **GitHub Actions tab**: See workflow runs
2. **Download artifacts**: Access test reports and screenshots
3. **PR checks**: Automatic pass/fail status on pull requests

---

## Quick Reference

### Common Commands

```bash
# Run all tests
npx playwright test

# Run specific file
npx playwright test tests/login.spec.ts

# Run specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Run in UI mode (interactive)
npx playwright test --ui

# List all tests
npx playwright test --list

# Show HTML report
npx playwright show-report

# Debug mode
npx playwright test --debug

# Update visual regression baselines
npx playwright test --update-snapshots
```

### File Naming

- Test files: `*.spec.ts` or `*.test.ts`
- Page Objects: `*.page.ts` (convention)
- Fixtures: `*.fixture.ts` (convention)
- Assertions: `*Assertions.ts` (this framework)

---

## Notes & Tips

1. **Always use `await`** with Playwright operations
2. **Prefer role-based locators** for resilience and accessibility
3. **Use `beforeEach`** for common setup to reduce duplication
4. **Attach screenshots** for debugging and documentation
5. **Use `baseURL`** to centralize app URL and simplify tests
6. **Custom fixtures** eliminate boilerplate and improve test readability
7. **Assertion classes** keep verification logic reusable and testable
8. **Visual regression** catches UI bugs automated tests might miss
9. **Accessibility testing** ensures WCAG compliance from day one
10. **CI/CD integration** provides continuous quality feedback

---

*Last Updated: January 10, 2026*
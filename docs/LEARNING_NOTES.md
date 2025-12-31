# Playwright + TypeScript Learning Notes

Personal reference documentation for Playwright concepts and TypeScript patterns learned while building this test automation framework.

---

## Table of Contents

1. [Metadata Objects Overview](#metadata-objects-overview)
2. [testInfo Object](#testinfo-object)
3. [workerInfo Object](#workerinfo-object)
4. [Accessing Project and Config](#accessing-project-and-config)
5. [Test Structure](#test-structure)
6. [Fixtures](#fixtures)
7. [Hooks](#hooks)
8. [Locator Strategies](#locator-strategies)
9. [Configuration](#configuration)
10. [Assertions](#assertions)
11. [TypeScript Patterns](#typescript-patterns)

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

## Test Structure

Playwright provides several metadata objects for accessing information about test execution, workers, and configuration.

### Quick Comparison

| Object | Available In | Purpose |
|--------|--------------|---------|
| `testInfo` | Individual tests, `beforeEach`, `afterEach` | Current test metadata |
| `workerInfo` | `beforeAll`, `afterAll` | Worker process metadata |
| `testInfo.project` | Via testInfo | Current browser/project config |
| `testInfo.config` | Via testInfo | Full Playwright config |

---

## testInfo Object

### What Is testInfo?

`testInfo` is a metadata object passed as the **second argument** to every test. It contains information about the currently running test and provides methods to interact with test execution and reporting.

### Syntax

```typescript
// page = from fixtures (first arg), testInfo = metadata (second arg)
test('my test', async ({ page }, testInfo) => {
  console.log(testInfo.title); // "my test"
});
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `testInfo.title` | string | Name of the current test |
| `testInfo.status` | string | `'passed'`, `'failed'`, `'skipped'`, `'timedOut'` |
| `testInfo.retry` | number | Current retry attempt (0 = first run) |
| `testInfo.project.name` | string | Browser project name (chromium, firefox, webkit) |
| `testInfo.duration` | number | How long test has run (milliseconds) |
| `testInfo.annotations` | array | Metadata tags attached to test |
| `testInfo.errors` | array | Errors encountered during test |

### Methods

#### `testInfo.attach()` - Attach files to report
```typescript
// Attach screenshot
await testInfo.attach('screenshot-name', {
  body: await page.screenshot(),
  contentType: 'image/png',
});

// Attach JSON data
await testInfo.attach('api-response', {
  body: JSON.stringify(data),
  contentType: 'application/json',
});

// Attach from file path
await testInfo.attach('log-file', {
  path: '/path/to/file.log',
});
```

#### `testInfo.outputPath()` - Get path for saving artifacts
```typescript
const screenshotPath = testInfo.outputPath('screenshot.png');
await page.screenshot({ path: screenshotPath });
```

#### `testInfo.skip()` - Skip test conditionally
```typescript
if (process.env.CI) {
  testInfo.skip(true, 'Skipping on CI environment');
}
```

#### `testInfo.fail()` - Mark as expected failure
```typescript
testInfo.fail(true, 'Known bug - ticket #123');
```

### Common Use Cases

**Browser-specific logic:**
```typescript
test('my test', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'webkit') {
    // Safari-specific handling
  }
});
```

**Retry-aware logic:**
```typescript
test('my test', async ({ page }, testInfo) => {
  console.log(`Attempt ${testInfo.retry + 1}`);
});
```

---

## workerInfo Object

### What Is workerInfo?

`workerInfo` provides metadata about the **worker process** running tests. Available in `beforeAll` and `afterAll` hooks (not in individual tests).

### Syntax

```typescript
test.beforeAll(async ({}, workerInfo) => {
  console.log(workerInfo.workerIndex);
});
```

**Note:** The empty `{}` is required because `beforeAll` doesn't have access to `page` fixture.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `workerInfo.workerIndex` | number | Unique index of this worker (0, 1, 2...) |
| `workerInfo.parallelIndex` | number | Index among parallel workers |
| `workerInfo.project` | object | Current project configuration |
| `workerInfo.config` | object | Full Playwright configuration |

### Use Cases

**Worker-specific database setup:**
```typescript
test.beforeAll(async ({}, workerInfo) => {
  // Each parallel worker gets its own database
  const dbName = `test_db_${workerInfo.workerIndex}`;
  await setupDatabase(dbName);
});
```

**Worker-specific port assignment:**
```typescript
test.beforeAll(async ({}, workerInfo) => {
  const port = 3000 + workerInfo.workerIndex;
  await startServer(port);
});
```

---

## Accessing Project and Config

### Via testInfo

```typescript
test('my test', async ({ page }, testInfo) => {
  // Project info (current browser)
  console.log(testInfo.project.name);       // "chromium"
  console.log(testInfo.project.outputDir);  // Where artifacts go
  console.log(testInfo.project.use);        // Project-specific settings
  
  // Full config
  console.log(testInfo.config.testDir);     // "./tests"
  console.log(testInfo.config.workers);     // Number of workers
  console.log(testInfo.config.reporter);    // Reporter type
});
```

### Via workerInfo

```typescript
test.beforeAll(async ({}, workerInfo) => {
  console.log(workerInfo.project.name);
  console.log(workerInfo.config.testDir);
});
```

### Common Patterns

**Browser-specific logic:**
```typescript
test('my test', async ({ page }, testInfo) => {
  if (testInfo.project.name === 'webkit') {
    // Safari-specific handling
    testInfo.skip(true, 'Not supported on Safari');
  }
});
```

**Environment-aware setup:**
```typescript
test.beforeAll(async ({}, workerInfo) => {
  const isCI = workerInfo.config.workers === 1;
  if (isCI) {
    // CI-specific setup
  }
});
```

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

#### getByTestId()
```typescript
// For elements with data-testid attribute
// HTML: <div data-testid="error-message">...</div>
await page.getByTestId('error-message');
```

**Note:** Configure test ID attribute in config if using different attribute:
```typescript
// playwright.config.ts
use: {
  testIdAttribute: 'data-test', // instead of data-testid
}
```

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
    screenshot: 'only-on-failure',
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
```

### File Naming

- Test files: `*.spec.ts` or `*.test.ts`
- Page Objects: `*.page.ts` (convention)
- Fixtures: `*.fixture.ts` (convention)

---

## Notes & Tips

1. **Always use `await`** with Playwright operations
2. **Prefer role-based locators** for resilience and accessibility
3. **Use `beforeEach`** for common setup to reduce duplication
4. **Attach screenshots** for debugging and documentation
5. **Use `baseURL`** to centralize app URL and simplify tests

---

*Last Updated: December 30, 2024*

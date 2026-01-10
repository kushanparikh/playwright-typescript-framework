# Playwright TypeScript Framework Architecture

## Overview

This document provides a high-level view of the framework architecture, design decisions, and the rationale behind key implementation choices.

---

## Table of Contents

1. [Architecture Principles](#architecture-principles)
2. [Framework Layers](#framework-layers)
3. [Design Patterns](#design-patterns)
4. [Project Structure](#project-structure)
5. [Data Flow](#data-flow)
6. [Testing Strategy](#testing-strategy)
7. [CI/CD Architecture](#cicd-architecture)
8. [Design Decisions](#design-decisions)
9. [Scalability Considerations](#scalability-considerations)

---

## Architecture Principles

### Core Principles

1. **Separation of Concerns (SoC)**
   - Test logic separate from page interactions
   - Page interactions separate from verification logic
   - Configuration separate from implementation

2. **Don't Repeat Yourself (DRY)**
   - Reusable page objects across tests
   - Custom fixtures eliminate setup duplication
   - Assertion classes provide reusable verification methods

3. **Single Responsibility Principle (SRP)**
   - Each class has one reason to change
   - Page objects handle interactions only
   - Assertion classes handle verifications only
   - Tests orchestrate behavior only

4. **Dependency Injection**
   - Custom fixtures provide dependencies
   - Tests declare what they need
   - Framework provides configured instances

5. **Test Isolation**
   - Each test runs in fresh browser context
   - No shared state between tests
   - Tests can run in any order

---

## Framework Layers

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      TEST LAYER                             │
│  (*.spec.ts files - What to test)                          │
│  - Test scenarios and assertions                           │
│  - Orchestrates page objects and assertions                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   FIXTURES LAYER                            │
│  (baseTest.ts - Dependency injection)                       │
│  - Pre-configured page objects                              │
│  - Pre-configured assertion classes                         │
│  - Automatic lifecycle management                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────┬──────────────────────────────────────┐
│   PAGE OBJECT LAYER  │     ASSERTION LAYER                  │
│   (pages/*.ts)       │     (assertions/*.ts)                │
│   - UI interactions  │     - Verification logic             │
│   - Element locators │     - Reusable assertion methods     │
│   - Action methods   │     - State validation               │
└──────────────────────┴──────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   PLAYWRIGHT CORE                           │
│  - Browser automation                                       │
│  - Built-in fixtures (page, context, browser)               │
│  - Auto-wait mechanisms                                     │
└─────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Tests** | Define test scenarios and orchestrate flow | `login.spec.ts`, `inventory.spec.ts` |
| **Fixtures** | Provide configured dependencies | `baseTest.ts` |
| **Page Objects** | Encapsulate page interactions | `loginPage.ts`, `inventoryPage.ts` |
| **Assertions** | Verify application state | `loginAssertions.ts`, `inventoryAssertions.ts` |
| **Playwright** | Browser automation primitives | Built-in framework |

---

## Design Patterns

### 1. Page Object Model (POM)

**What**: Encapsulate page structure and interactions in dedicated classes.

**Why**: 
- Centralize UI locators (change in one place)
- Reusable page interactions across tests
- Improved test readability (high-level actions)

**Implementation**:

```typescript
// pages/loginPage.ts
export default class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async login(username: string, password: string) {
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }

    // Getters - Return element states without assertions
    async getTitle(): Promise<string> {
        return await this.page.title();
    }
}
```

**Key Decision**: Page objects return element states but don't assert. Assertions belong in assertion classes.

---

### 2. Assertion Classes Pattern

**What**: Separate verification logic from page objects.

**Why**:
- Page objects stay focused on interactions
- Reusable assertion logic across tests
- Easier to test assertion logic independently

**Implementation**:

```typescript
// assertions/loginAssertions.ts
export default class LoginAssertions {
    private loginPage: LoginPage;

    constructor(loginPage: LoginPage) {
        this.loginPage = loginPage;
    }

    async verifyLoginLandingDetails() {
        await expect(await this.loginPage.getTitle()).toContain('Swag Labs');
    }

    async verifyDisplayedErrorMessage(message: string) {
        await expect(await this.loginPage.getDisplayedErrorMessage()).toContain(message);
    }
}
```

**Key Decision**: Assertions depend on page objects (composition), ensuring single source of truth for element access.

---

### 3. Custom Fixtures (Dependency Injection)

**What**: Pre-configure and inject dependencies into tests.

**Why**:
- Eliminates repetitive object instantiation
- Automatic lifecycle management
- Cleaner test code focused on test logic

**Implementation**:

```typescript
// tests/fixtures/baseTest.ts
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

**Key Decision**: Assertion fixtures depend on page object fixtures, ensuring proper dependency chain.

---

### 4. Test Organization Pattern

**What**: Group related tests using `test.describe()` blocks.

**Why**:
- Logical test grouping
- Shared setup/teardown for related tests
- Better test reporting

**Implementation**:

```typescript
test.describe('Login with invalid credentials', () => {
    test('should show error for locked out user', async ({ loginPage, loginAssertions }) => {
        await loginPage.login('locked_out_user', 'secret_sauce');
        await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Sorry, this user has been locked out.');
    });

    test('should show error with non-existent username', async ({ loginPage, loginAssertions }) => {
        await loginPage.login('invalid_user', 'secret_sauce');
        await loginAssertions.verifyDisplayedErrorMessage('Epic sadface: Username and password do not match');
    });
});
```

---

## Project Structure

### Directory Organization

```
playwright-typescript-framework/
│
├── tests/                          # Test specifications
│   ├── fixtures/                   # Custom test fixtures
│   │   └── baseTest.ts            # Dependency injection configuration
│   ├── login.spec.ts              # Authentication tests
│   ├── inventory.spec.ts          # Cart operations tests
│   ├── filter.spec.ts             # Product filtering tests
│   ├── visual/                    # Visual regression tests
│   │   └── visualregression.spec.ts
│   └── accessibility/             # Accessibility compliance tests
│       └── accessibility.spec.ts
│
├── pages/                          # Page Object Models
│   ├── loginPage.ts               # Login page interactions
│   └── inventoryPage.ts           # Inventory page interactions
│
├── assertions/                     # Verification logic
│   ├── loginAssertions.ts         # Login state verification
│   └── inventoryAssertions.ts     # Inventory state verification
│
├── docs/                          # Documentation
│   ├── LEARNING_NOTES.md          # Implementation insights
│   └── ARCHITECTURE.md            # This file
│
├── .github/                       # CI/CD configuration
│   └── workflows/
│       └── playwright.yml         # GitHub Actions workflow
│
├── playwright.config.ts           # Playwright configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
├── CHANGELOG.md                   # Version history
└── README.md                      # Project overview
```

### Organization Principles

1. **By Responsibility**: Files grouped by what they do (tests, pages, assertions)
2. **By Feature**: Tests can be further organized by feature (visual, accessibility)
3. **Flat Structure**: Avoid deep nesting for discoverability
4. **Clear Naming**: File names describe content (loginPage.ts, not page1.ts)

---

## Data Flow

### Test Execution Flow

```
1. Test starts
   ↓
2. Fixtures create dependencies
   - loginPage = new LoginPage(page)
   - loginAssertions = new LoginAssertions(loginPage)
   ↓
3. beforeEach hook runs
   - Navigate to application
   - Verify initial state
   ↓
4. Test body executes
   - Use page objects for actions
   - Use assertions for verification
   ↓
5. Test completes
   - Playwright captures evidence (screenshots, traces)
   - Fixtures automatically cleaned up
   ↓
6. Test result recorded
```

### Typical Test Interaction Flow

```
Test
  └─> Fixture provides LoginPage
        └─> LoginPage.login(username, password)
              └─> Playwright page.fill(), page.click()
                    └─> Browser performs actions

Test
  └─> Fixture provides LoginAssertions
        └─> LoginAssertions.verifyLoginLandingDetails()
              └─> LoginPage.getTitle()
                    └─> Playwright page.title()
                          └─> Browser returns title
                                └─> expect().toContain() assertion
```

### Dependency Flow

```
Playwright Built-in Fixtures
  └─> page fixture
        ├─> LoginPage(page)
        │     └─> LoginAssertions(loginPage)
        │
        └─> InventoryPage(page)
              └─> InventoryAssertions(inventoryPage)
```

**Key Insight**: Dependencies flow downward. Tests don't create page objects; fixtures do. Assertions don't create page objects; they receive them.

---

## Testing Strategy

### Test Types & Coverage

| Test Type | Purpose | Coverage | Files |
|-----------|---------|----------|-------|
| **Functional** | Verify feature behavior | Login, cart, filtering | `login.spec.ts`, `inventory.spec.ts`, `filter.spec.ts` |
| **Visual Regression** | Detect UI changes | Login, inventory, cart | `visual/visualregression.spec.ts` |
| **Accessibility** | WCAG 2.1 compliance | All pages | `accessibility/accessibility.spec.ts` |

### Test Pyramid Application

```
        ╱╲
       ╱  ╲       E2E Tests (16 tests)
      ╱────╲      - Full user journeys
     ╱      ╲     - Cross-browser validation
    ╱────────╲    - Visual regression
   ╱          ╲   - Accessibility compliance
  ╱────────────╲
```

**Note**: This is a UI test framework, so the pyramid is inverted from typical unit/integration/E2E distribution.

### Test Execution Strategy

**Local Development**:
- Parallel execution for speed
- All browsers (Chromium, Firefox, WebKit)
- No retries (fail fast for quick feedback)

**CI/CD**:
- Sequential execution for stability
- All browsers
- 2 retries for flaky test resilience
- Comprehensive artifact collection

---

## CI/CD Architecture

### Pipeline Flow

```
Code Push/PR → GitHub Actions Trigger
                    ↓
            Checkout Code
                    ↓
            Setup Node.js
                    ↓
        Install Dependencies (npm ci)
                    ↓
    Install Playwright Browsers (--with-deps)
                    ↓
        ┌───────────────────────┐
        │  Run Playwright Tests │
        │  - Chromium           │
        │  - Firefox            │
        │  - WebKit             │
        └───────────────────────┘
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
  Tests Pass              Tests Fail
        ↓                       ↓
  Upload Report      Upload Report + Diffs
        ↓                       ↓
    Success ✓            Failure ✗
```

### Artifact Strategy

| Artifact Type | When Collected | Retention | Purpose |
|--------------|----------------|-----------|---------|
| HTML Report | Always | 30 days | Test results overview |
| Screenshots | On failure | 7 days | Visual debugging |
| Traces | On retry | 7 days | Deep debugging |
| Visual Diffs | On regression | 7 days | UI change analysis |

### Platform Choice: Windows

**Decision**: Run CI on `windows-latest`

**Rationale**:
1. **Consistency**: Matches local development environment
2. **Visual Regression**: Screenshot baselines generated on Windows match CI
3. **Font Rendering**: Windows font rendering differs from Linux
4. **Debugging**: Reproduce CI issues locally without platform differences

**Trade-off**: Slightly slower than Linux runners, but consistency worth it.

---

## Design Decisions

### 1. Separate Assertion Classes vs. In-Page Objects

**Decision**: Separate assertion classes.

**Alternatives Considered**:
- Assertions in page objects
- Assertions inline in tests
- Combined page+assertion objects

**Rationale**:
- **SRP**: Page objects focus on interactions, assertions on verification
- **Reusability**: Assertion methods used across multiple tests
- **Testability**: Assertion logic can be unit tested independently
- **Clarity**: Clear separation between "do" and "verify"

**Trade-off**: More files/classes, but better organization and maintainability.

---

### 2. Custom Fixtures vs. Manual Instantiation

**Decision**: Custom fixtures for all page objects and assertions.

**Alternatives Considered**:
- Manual instantiation in each test
- Fixtures for page objects only
- Factory functions

**Rationale**:
- **DRY**: Eliminates repetitive `new LoginPage(page)` in every test
- **Lifecycle**: Automatic setup/teardown
- **Dependencies**: Fixtures handle dependency chain (page → page object → assertion)
- **Readability**: Tests declare needs, framework provides

**Trade-off**: Initial setup complexity, but tests become dramatically cleaner.

---

### 3. Role-Based Locators vs. CSS Selectors

**Decision**: Prefer role-based locators (`getByRole`, `getByPlaceholder`).

**Alternatives Considered**:
- CSS selectors (`.class`, `#id`)
- XPath
- data-testid attributes

**Rationale**:
- **Resilience**: Less brittle to implementation changes
- **Accessibility**: Ensures screen reader compatibility
- **Readability**: Tests read like user intent
- **Best Practice**: Playwright recommendation

**Trade-off**: SauceDemo uses `data-test` attributes, so we mix strategies as appropriate.

---

### 4. TypeScript Strict Mode

**Decision**: Enable strict TypeScript compilation.

**Configuration**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**Rationale**:
- **Type Safety**: Catch errors at compile-time
- **IDE Support**: Better autocomplete and refactoring
- **Documentation**: Types serve as inline documentation
- **Maintainability**: Refactoring with confidence

**Trade-off**: More verbose code, but much safer.

---

### 5. Visual Regression: Platform-Specific Baselines

**Decision**: Generate baselines on Windows, run CI on Windows.

**Alternatives Considered**:
- Docker for consistent environment
- Separate baselines per platform
- Skip visual regression in CI

**Rationale**:
- **Consistency**: Eliminates cross-platform rendering differences
- **Simplicity**: Single set of baselines
- **Debugging**: Issues reproducible locally

**Trade-off**: CI tied to Windows runner, but worth it for visual regression reliability.

---

### 6. Accessibility Testing: axe-core Integration

**Decision**: Integrate axe-core for automated accessibility testing.

**Alternatives Considered**:
- Manual accessibility audits
- Lighthouse CI
- pa11y

**Rationale**:
- **Industry Standard**: axe-core is most widely used
- **Playwright Integration**: `@axe-core/playwright` seamless
- **WCAG Coverage**: Comprehensive rule set
- **Reporting**: Detailed violation analysis

**Trade-off**: None - this is additional value with minimal overhead.

---

### 7. Test Organization: By Feature vs. By Layer

**Decision**: Top-level organization by feature (accessibility, visual), with test specs at root.

**Alternatives Considered**:
- All tests in flat structure
- Tests organized by page (login/, inventory/)
- Tests organized by test type

**Rationale**:
- **Discoverability**: Easy to find tests by feature
- **Scalability**: Can grow into feature folders as needed
- **Clarity**: Special test types (accessibility, visual) clearly separated

**Trade-off**: Slightly more directories, but better organization at scale.

---

## Scalability Considerations

### Growing Test Suite

**Current**: 16 tests, 2 pages, 5 test files

**At 100 tests**:
- Add more page objects as needed
- Organize tests into feature folders (`/checkout`, `/account`)
- Consider shared test data fixtures

**At 500 tests**:
- Implement test tagging (`@smoke`, `@regression`)
- Separate test runs (fast suite, full suite)
- Parallelize across multiple CI runners

### Adding New Pages

**Process**:
1. Create page object in `pages/`
2. Create assertion class in `assertions/`
3. Add fixtures to `baseTest.ts`
4. Write tests using new fixtures

**Example**:
```typescript
// pages/checkoutPage.ts
export default class CheckoutPage { ... }

// assertions/checkoutAssertions.ts
export default class CheckoutAssertions { ... }

// fixtures/baseTest.ts
type MyFixtures = {
    ...
    checkoutPage: CheckoutPage;
    checkoutAssertions: CheckoutAssertions;
};
```

### Multi-Environment Support

**Future Enhancement**:
```typescript
// playwright.config.ts
use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',
}

// Run against different environments
BASE_URL=https://staging.saucedemo.com npx playwright test
```

### Test Data Management

**Current**: Hardcoded test data in tests

**Future Enhancement**:
```typescript
// fixtures/testData.ts
export const users = {
    standard: { username: 'standard_user', password: 'secret_sauce' },
    locked: { username: 'locked_out_user', password: 'secret_sauce' },
};

// tests/login.spec.ts
import { users } from '../fixtures/testData';
await loginPage.login(users.standard.username, users.standard.password);
```

---

## Summary

This framework demonstrates modern test automation architecture through:

1. **Clear Separation**: Tests, pages, assertions, fixtures each have single responsibility
2. **Dependency Injection**: Custom fixtures provide configured dependencies
3. **Reusability**: Page objects and assertions used across multiple tests
4. **Quality Gates**: Functional, visual, and accessibility testing
5. **CI/CD Ready**: Automated execution with comprehensive evidence collection
6. **Scalability**: Architecture supports growth from 16 to 500+ tests

**Key Takeaway**: Architecture supports maintainability, readability, and scalability while demonstrating modern testing practices and patterns.

---

*Last Updated: January 10, 2026*
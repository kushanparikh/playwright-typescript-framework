# Playwright TypeScript Framework

Automation Testing using Playwright with coding in TypeScript for Sauce Demo e-commerce application.

<details>
<summary>Prerequisites</summary>

- Node.js (v14 or higher)
- npm or yarn

</details>

<details>
<summary>Installation</summary>

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

</details>

<details>
<summary>Running Tests</summary>

### Basic Commands

```bash
# Run all tests
npx playwright test

# Run tests in headed mode (shows browser)
npx playwright test --headed

# Run tests in UI mode (interactive debugging)
npx playwright test --ui

# Run specific test file
npx playwright test tests/login.spec.ts
npx playwright test tests/inventory.spec.ts
npx playwright test tests/productDetail.spec.ts
npx playwright test tests/cart.spec.ts
npx playwright test tests/checkout.spec.ts
npx playwright test tests/filter.spec.ts
npx playwright test tests/footer.spec.ts
npx playwright test tests/visual/visualregression.spec.ts
npx playwright test tests/accessibility/accessibility.spec.ts

# Run tests for specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Viewing Reports

```bash
# View HTML test report
npx playwright show-report
```

</details>

## Project Structure

```
playwright-typescript-framework/
├── tests/
│   ├── fixtures/
│   │   └── baseTest.ts           # Custom test fixtures (dependency injection)
│   ├── login.spec.ts             # Login functionality tests
│   ├── inventory.spec.ts         # Shopping cart tests
│   ├── productDetail.spec.ts      # Product detail page tests
│   ├── cart.spec.ts              # Cart page functionality tests
│   ├── checkout.spec.ts          # Checkout flow tests
│   ├── filter.spec.ts            # Product filtering tests
│   ├── footer.spec.ts            # Footer link verification tests
│   ├── visual/
│   │   └── visualregression.spec.ts  # Visual regression tests
│   └── accessibility/
│       └── accessibility.spec.ts # WCAG 2.1 accessibility tests
├── pages/
│   ├── loginPage.ts              # Login page object model
│   ├── inventoryPage.ts          # Inventory page object model
│   ├── productDetailPage.ts      # Product detail page object model
│   ├── cartPage.ts               # Cart page object model
│   ├── checkoutPage.ts           # Checkout page object model
│   └── footerPage.ts             # Footer page object model
├── assertions/
│   ├── loginAssertions.ts        # Login verification methods
│   ├── inventoryAssertions.ts    # Inventory verification methods
│   ├── productDetailAssertions.ts # Product detail verification methods
│   ├── cartAssertions.ts         # Cart verification methods
│   ├── checkoutAssertions.ts     # Checkout verification methods
│   └── footerAssertions.ts       # Footer verification methods
├── docs/
│   ├── LEARNING_NOTES.md         # Development notes and learnings
│   └── ARCHITECTURE.md           # High-level architecture documentation
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI/CD pipeline configuration
├── playwright.config.ts          # Playwright configuration
├── TODO.md                       # Planned test cases and enhancements roadmap
├── CHANGELOG.md                  # Version history
├── package.json                  # Project dependencies
└── README.md                     # This file
```

## Architecture

### Page Object Model (POM)
The framework follows the Page Object Model pattern for maintainable test code:

- **LoginPage**: Handles login functionality with username/password fields
- **InventoryPage**: Manages product inventory, cart operations, and filtering
- **ProductDetailPage**: Handles individual product view and cart operations
- **CartPage**: Manages shopping cart display and item operations
- **CheckoutPage**: Handles checkout information form and navigation
- **FooterPage**: Manages footer elements and social media links

### Custom Fixtures
Enhanced test setup using Playwright's custom fixtures for cleaner test code:

- **baseTest.ts**: Central fixture configuration providing:
  - `loginPage`: Pre-configured LoginPage instance
  - `inventoryPage`: Pre-configured InventoryPage instance
  - `productDetailPage`: Pre-configured ProductDetailPage instance
  - `cartPage`: Pre-configured CartPage instance
  - `checkoutPage`: Pre-configured CheckoutPage instance
  - `footerPage`: Pre-configured FooterPage instance
  - `loginAssertions`: Pre-configured LoginAssertions instance
  - `inventoryAssertions`: Pre-configured InventoryAssertions instance
  - `productDetailAssertions`: Pre-configured ProductDetailAssertions instance
  - `cartAssertions`: Pre-configured CartAssertions instance
  - `checkoutAssertions`: Pre-configured CheckoutAssertions instance
  - `footerAssertions`: Pre-configured FooterAssertions instance

### Custom Assertions
Dedicated assertion classes provide reusable validation methods:
- **LoginAssertions**: Validates login page state and error messages
- **InventoryAssertions**: Validates cart state, product sorting, and UI elements
- **ProductDetailAssertions**: Validates product information display and cart operations
- **CartAssertions**: Validates cart item display, quantities, and navigation
- **CheckoutAssertions**: Validates form validation and checkout flow
- **FooterAssertions**: Validates footer links and copyright text

## Test Coverage Details

### Test Suite Breakdown

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| **Login Tests** | 13 | Valid login, locked user, invalid credentials, empty fields validation, special user types, UI verification, keyboard navigation |
| **Shopping Cart Tests** | 14 | Single/multiple item additions, cart state verification, product display validation, sorting, cart badge management |
| **Product Detail Tests** | 5 | Navigation from inventory, product information display, add/remove from cart, back to products navigation, cart state maintenance |
| **Cart Page Tests** | 8 | Cart navigation, item display, quantity verification, item removal, continue shopping, checkout navigation, empty cart state |
| **Checkout Tests** | 11 | Form validation (information step), error handling, successful checkout flow, cancel operations, special character handling, order confirmation, thank you message, back home navigation, cart badge reset |
| **Product Filter Tests** | 3 | Alphabetical (A-Z, Z-A) and price sorting (low-high, high-low) |
| **Footer Tests** | 4 | Twitter link verification, Facebook link verification, LinkedIn link verification, copyright text display |
| **Visual Regression Tests** | 3 | Login page, inventory page, cart page appearance validation |
| **Accessibility Tests** | 3 | WCAG 2.1 Level A & AA compliance for login, inventory, cart pages |
| **Total** | **64** | Comprehensive coverage of core e-commerce flows |

### Key Testing Capabilities

#### 1. **Functional Testing**
- Complete user authentication flows (positive and negative scenarios)
- Shopping cart operations (add, remove, state management)
- Product filtering and sorting algorithms validation
- Multi-step user journey testing

#### 2. **Accessibility Testing (WCAG 2.1)**
- Automated accessibility validation using axe-core
- WCAG 2.1 Level A & AA compliance checking
- Detailed violation reporting with impact analysis
- Coverage across all major page types (login, inventory, cart)

#### 3. **Visual Regression Testing**
- Pixel-perfect UI comparison across test runs
- Full-page screenshot capture and comparison
- Cross-browser visual consistency validation
- Threshold-based difference detection (configurable tolerance)

#### 4. **Cross-Browser Testing**
- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)
- Automated matrix execution in CI/CD

#### 5. **CI/CD Integration**
- GitHub Actions workflow with Windows runner
- Parallel test execution across browsers
- Automatic artifact collection (reports, screenshots, traces)
- Retry strategy for flaky test resilience

## Architecture Highlights

### Design Patterns Implemented

1. **Page Object Model (POM)**
   - Separates page interactions from test logic
   - Encapsulates UI locators and actions
   - Improves maintainability and reusability

2. **Custom Fixtures Pattern**
   - Dependency injection for page objects and assertions
   - Automatic setup and teardown
   - Reduces boilerplate code in tests

3. **Assertion Classes**
   - Dedicated verification logic separate from page objects
   - Reusable assertion methods across test suites
   - Single Responsibility Principle adherence

4. **TypeScript Strict Mode**
   - Full type safety throughout the codebase
   - Enhanced IDE support and refactoring confidence
   - Compile-time error detection

### Project Structure Philosophy

```
📦 Framework organized by responsibility:
├── tests/          → Test specifications (what to test)
├── pages/          → Page interactions (how to interact)
├── assertions/     → Verification logic (how to verify)
├── fixtures/       → Test dependencies (what tests need)
└── docs/           → Learning and architecture documentation
```

## Configuration

The project is configured to run tests across three browsers:
- Chromium (Chrome)
- Firefox  
- WebKit (Safari)

**Base URL**: `https://www.saucedemo.com/`

**Features**:
- Parallel test execution for faster performance
- Automatic HTML report generation
- Screenshot capture on test failures
- Trace collection on retry for debugging
- CI/CD optimized settings (retries, worker configuration)
- Visual regression threshold configuration
- Accessibility testing with axe-core integration

## Test Data

Tests use the Sauce Demo application with predefined user accounts:
- **standard_user**: Valid credentials for full functionality testing
- **locked_out_user**: For error handling validation
- **invalid_user**: For negative testing scenarios

## Debugging

Use the UI mode for interactive debugging:
```bash
npx playwright test --ui
```

Or run tests in headed mode to see the browser:
```bash
npx playwright test --headed
```

## Best Practices Implemented

1. **Separation of Concerns**: Page objects, assertions, and tests are organized separately
2. **Reusable Components**: Common functionality is abstracted into page classes
3. **Custom Fixtures**: Centralized test setup with dependency injection pattern
4. **TypeScript Benefits**: Strong typing for better code reliability
5. **Comprehensive Reporting**: Screenshots and traces for failed tests
6. **Cross-Browser Testing**: Automated testing across multiple browsers
7. **CI/CD Ready**: Configuration optimized for continuous integration environments
8. **Accessibility First**: WCAG 2.1 compliance validation integrated into test suite
9. **Visual Consistency**: Automated visual regression to catch unintended UI changes

## Usage Examples

### Using Custom Fixtures
```typescript
import { test, expect } from './fixtures/baseTest';

test('example test with fixtures', async ({ page, loginPage, inventoryAssertions }) => {
  await loginPage.login('standard_user', 'secret_sauce');
  await inventoryAssertions.verifyInventoryLandingDetails();
});
```

### Traditional Approach (for comparison)
```typescript
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage';

test('example test without fixtures', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
});
```

## Test Metrics

| Metric | Count |
|--------|-------|
| Total Tests | 64 |
| Test Files | 9 |
| Page Objects | 6 |
| Assertion Classes | 6 |
| Custom Fixtures | 13 |
| CI/CD Pipelines | 1 |
| Browsers Tested | 3 |
| Lines of Test Code | ~1700+ |

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Playwright | 1.57.0 |
| Language | TypeScript | 5.x |
| CI/CD | GitHub Actions | Latest |
| Accessibility | @axe-core/playwright | 4.11.0 |
| Version Control | Git + GitHub | - |
| Runtime | Node.js | 18+ |

## Key Features

✅ **Modern Patterns**: Page Object Model, Custom Fixtures, Assertion Classes  
✅ **Accessibility Testing**: WCAG 2.1 Level A & AA compliance validation with axe-core  
✅ **Visual Regression**: Automated screenshot comparison with configurable thresholds  
✅ **CI/CD Integration**: GitHub Actions with cross-browser matrix execution  
✅ **TypeScript**: Fully typed with strict configuration for type safety  
✅ **Comprehensive Reporting**: HTML reports with screenshots, traces, and accessibility findings  
✅ **Cross-Browser Support**: Chromium, Firefox, WebKit with parallel execution  
✅ **Test Isolation**: Each test runs in isolated browser context  
✅ **Auto-Healing**: Playwright's auto-wait and retry mechanisms  
✅ **Evidence Collection**: Screenshots, traces, and detailed logs for debugging

## Skills Demonstrated

### Technical Skills
- Modern test automation frameworks (Playwright)
- TypeScript expertise with strict typing
- Page Object Model architecture pattern
- Custom fixture creation and dependency injection
- Accessibility compliance testing (WCAG 2.1)
- Visual regression testing strategies
- CI/CD pipeline configuration (GitHub Actions)
- Cross-browser testing automation
- Git version control and branching strategies

### Software Engineering Principles
- Separation of Concerns (SoC)
- Don't Repeat Yourself (DRY)
- Single Responsibility Principle (SRP)
- Dependency Injection pattern
- Clean code practices with comprehensive comments
- Technical documentation and knowledge sharing

### Quality Assurance Expertise
- Test planning and coverage strategy
- Positive and negative test scenario design
- Accessibility standards compliance (WCAG 2.1)
- Visual regression testing methodology
- CI/CD integration for continuous quality
- Test result reporting and artifact management

## Additional Documentation

- **[TODO.md](TODO.md)**: Planned test cases and framework enhancements roadmap
- **[LEARNING_NOTES.md](docs/LEARNING_NOTES.md)**: Detailed learning documentation covering Playwright concepts, TypeScript patterns, and implementation insights
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)**: High-level architecture overview explaining design decisions and framework structure
- **[CHANGELOG.md](CHANGELOG.md)**: Version history and feature evolution

## Portfolio Context

This project is part of a 5-project SDET portfolio demonstrating modern test automation expertise:
1. **Playwright + TypeScript Framework** (This project) - UI testing foundation
2. GraphQL API Testing Suite - Modern API patterns
3. gRPC Testing Harness - Protocol buffer testing
4. Authentication Testing Framework - OAuth, JWT, SAML
5. Unified Test Reporting Platform - Cross-project result aggregation

Each project showcases different aspects of modern test automation while building toward a comprehensive testing ecosystem.
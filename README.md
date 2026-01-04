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
npx playwright test tests/filter.spec.ts

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
│   ├── login.spec.ts          # Login functionality tests
│   ├── inventory.spec.ts      # Shopping cart tests
│   └── filter.spec.ts         # Product filtering tests
├── pages/
│   ├── loginPage.ts           # Login page object model
│   └── inventoryPage.ts       # Inventory page object model
├── assertions/
│   └── inventoryAssertions.ts # Custom assertion methods
├── docs/
│   └── LEARNING_NOTES.md      # Development notes and learnings
├── playwright.config.ts       # Playwright configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Architecture

### Page Object Model (POM)
The framework follows the Page Object Model pattern for maintainable test code:

- **LoginPage**: Handles login functionality with username/password fields
- **InventoryPage**: Manages product inventory, cart operations, and filtering

### Custom Fixtures
Enhanced test setup using Playwright's custom fixtures for cleaner test code:

- **baseTest.ts**: Central fixture configuration providing:
  - `loginPage`: Pre-configured LoginPage instance
  - `inventoryPage`: Pre-configured InventoryPage instance  
  - `loginAssertions`: Pre-configured LoginAssertions instance
  - `inventoryAssertions`: Pre-configured InventoryAssertions instance

### Custom Assertions
Dedicated assertion classes provide reusable validation methods:
- **LoginAssertions**: Validates login page state and error messages
- **InventoryAssertions**: Validates cart state, product sorting, and UI elements

### Test Coverage

#### Login Tests (`login.spec.ts`)
- Successful login with valid credentials
- Error handling for locked out users
- Validation for non-existent usernames
- Empty password and username validation

#### Shopping Cart Tests (`inventory.spec.ts`)
- Adding single items to cart
- Adding multiple items to cart
- Cart badge count verification
- Button state changes (Add to Cart → Remove)

#### Product Filtering Tests (`filter.spec.ts`)
- Sort products by name (A-Z, Z-A)
- Sort products by price (low to high, high to low)
- Verification of correct sorting order

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

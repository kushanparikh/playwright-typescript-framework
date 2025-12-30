# Playwright TypeScript Framework

Automation Testing using Playwright with coding in TypeScript

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
npx playwright test tests/example.spec.ts

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
│   └── example.spec.ts     # Test files
├── playwright.config.ts    # Playwright configuration
├── package.json           # Project dependencies
└── README.md             # This file
```

## Configuration

The project is configured to run tests across three browsers:
- Chromium (Chrome)
- Firefox  
- WebKit (Safari)

Tests run in parallel by default for faster execution. HTML reports are generated automatically after test runs.

## Example Test

The framework includes a sample login test that demonstrates:
- Page navigation
- Form filling
- Button clicking
- Assertions

## Debugging

Use the UI mode for interactive debugging:
```bash
npx playwright test --ui
```

Or run tests in headed mode to see the browser:
```bash
npx playwright test --headed
```

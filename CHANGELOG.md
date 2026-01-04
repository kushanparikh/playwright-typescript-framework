# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]
### Planned
- CI/CD pipeline with GitHub Actions

---

## [0.4.0] - 2025-01-04
### Added
- Custom test fixtures system (`tests/fixtures/baseTest.ts`)
  - `loginPage`: Pre-configured LoginPage instance
  - `inventoryPage`: Pre-configured InventoryPage instance
  - `loginAssertions`: Pre-configured LoginAssertions instance
  - `inventoryAssertions`: Pre-configured InventoryAssertions instance
- `LoginAssertions` class for login-specific verification methods
- Enhanced page object methods:
  - `getURL()` and `getTitle()` methods in page classes
  - `getDisplayedErrorMessage()` in LoginPage
- Refactored all test files to use custom fixtures pattern
- Improved test code maintainability with dependency injection

### Changed
- Migrated from manual page object instantiation to fixture-based approach
- Updated all test imports to use `./fixtures/baseTest`
- Centralized test setup and teardown logic
- Enhanced assertion methods with better error handling

---

## [0.3.0] - 2025-01-04
### Added
- Filter tests for product sorting (A-Z, Z-A, price low-high, price high-low)
- `InventoryAssertions` class for reusable verification methods
- Product sorting verification logic (alphabetical and price-based)
- `test.describe()` blocks for grouping related tests

### Changed
- Refactored inventory tests to use assertion class pattern

---

## [0.2.0] - 2025-01-03
### Added
- Page Object Model implementation
  - `LoginPage` class for authentication actions
  - `InventoryPage` class for inventory interactions
- Inventory test suite (add to cart, multiple items)
- Custom TypeScript type `FilterType` for filter options
- Helper function `verifyInventoryLandingDetails()` for reusable validation

### Changed
- Migrated tests from inline locators to Page Object pattern
- Improved test readability with POM abstraction

---

## [0.1.0] - 2024-12-30
### Added
- Initial Playwright + TypeScript project setup
- Login test suite with 5 scenarios:
  - Valid credentials login
  - Locked out user error
  - Invalid username error
  - Empty password error
  - Empty username error
- `beforeEach` hook for common test setup
- Role-based locators (`getByPlaceholder`, `getByRole`)
- `baseURL` configuration in playwright.config.ts
- Screenshot attachment on test completion using `testInfo`
- Learning documentation (`docs/LEARNING_NOTES.md`)

### Configuration
- Multi-browser support (Chromium, Firefox, WebKit)
- HTML reporter enabled
- Screenshot on failure
- Trace on first retry
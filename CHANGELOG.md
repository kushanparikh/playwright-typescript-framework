# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-01-20
### Summary
**Production Release** - Complete SDET portfolio showcase with comprehensive test coverage, professional architecture, and enterprise-ready testing capabilities. Expanded from 16 tests to **86 tests** (438% increase), covering all critical user journeys and application features.

### Added

**Major Test Suites (70 New Tests)**
- **Product Detail Page Tests (5 tests)**: Navigation, product information display, cart operations from detail page, back navigation, cart state persistence
- **Cart Page Tests (8 tests)**: Cart navigation, item display, quantity verification, item removal, continue shopping, checkout navigation, empty cart state
- **Checkout Flow Tests (17 tests)**: 
  - Information step: Form validation, error handling, cancel operations, special character support
  - Overview step: Item review, price calculations (subtotal, tax, total), cancel functionality
  - Complete step: Order confirmation, thank you message, back home navigation, cart reset
- **Footer Tests (4 tests)**: Social media links validation (Twitter, Facebook, LinkedIn), copyright text verification
- **Hamburger Menu Tests (6 tests)**: Menu open/close, navigation (All Items, About), logout, reset app state functionality
- **End-to-End Workflows (10 tests)**: Complete purchase flows (single/multiple items), add/remove/add workflow, sort and checkout, product detail navigation, cart persistence, reset app state, special user testing (problem_user, performance_glitch_user)
- **Login Enhancements (8 additional tests)**: Special user types (problem_user, performance_glitch_user, error_user, visual_user), UI verification (logo, password masking), keyboard navigation
- **Inventory Enhancements (9 additional tests)**: Product display validation (images, names, prices), default sort verification, add/remove all items

**Framework & Architecture**
- **7 New Page Object Models**: ProductDetailPage, CartPage, CheckoutPage, FooterPage, HamburgerMenuPage (plus existing LoginPage, InventoryPage)
- **7 Custom Assertion Classes**: ProductDetailAssertions, CartAssertions, CheckoutAssertions, FooterAssertions, HamburgerMenuAssertions (plus existing LoginAssertions, InventoryAssertions)
- **Extended Custom Fixtures**: 14 total fixtures (7 page objects + 7 assertion classes) for comprehensive dependency injection
- **Known Accessibility Issues Tracking**: Smart accessibility testing that only fails on new violations, not pre-existing demo site issues

**Testing Capabilities Enhancements**
- **Complete E2E Coverage**: Full user journey testing from login through order completion
- **Multi-User Testing**: Validation across all user types (standard_user, problem_user, performance_glitch_user, error_user, visual_user, locked_out_user)
- **Advanced Assertions**: Complex validation including price calculations (subtotal, tax, total with precision), cart state persistence, UI state management
- **Comprehensive Form Validation**: Empty field validation, special character handling, error message verification
- **Navigation Testing**: Cross-page navigation validation, state persistence, back button functionality

**Documentation & Maintenance**
- **Updated TODO.md**: Complete test coverage analysis showing 86/86 tests implemented (100% of planned functional tests)
- **Known Issues Tracking**: `tests/accessibility/knownAccessibilityIssues.ts` for managing pre-existing accessibility violations
- **Accessibility README**: Detailed guide for managing and tracking accessibility issues

### Changed

**Test Coverage Metrics**
- Total tests: 16 → **86 tests** (438% increase)
- Test files: 5 → **11 files**
- Page objects: 2 → **7 page objects**
- Assertion classes: 2 → **7 assertion classes**
- Custom fixtures: 4 → **14 fixtures**
- Lines of test code: ~500 → **~2100+ lines**

**Architecture Improvements**
- Expanded fixture system to support all new page objects and assertions
- Enhanced assertion classes with complex validation methods (calculations, state persistence)
- Improved error handling and validation across all test suites

**CI/CD Updates**
- Modified GitHub Actions workflow to `continue-on-error: true` for known accessibility issues
- Changed artifact upload conditions from `failure()` to `always()` for comprehensive evidence collection

### Test Coverage Breakdown

| Test Suite | Tests | Status |
|------------|-------|--------|
| Login Tests | 13 | ✅ Complete |
| Shopping Cart Tests | 14 | ✅ Complete |
| Product Detail Tests | 5 | ✅ Complete |
| Cart Page Tests | 8 | ✅ Complete |
| Checkout Tests | 17 | ✅ Complete |
| Product Filter Tests | 3 | ✅ Complete |
| Footer Tests | 4 | ✅ Complete |
| Hamburger Menu Tests | 6 | ✅ Complete |
| End-to-End Workflows | 10 | ✅ Complete |
| Visual Regression Tests | 3 | ✅ Complete |
| Accessibility Tests | 3 | ✅ Complete |
| **Total** | **86** | **100% Complete** |

### Portfolio Impact

**Demonstrates Professional Skills:**
- ✅ Complete test coverage strategy and execution
- ✅ Scalable framework architecture (from 16 to 86 tests without framework redesign)
- ✅ Enterprise patterns (POM, dependency injection, assertion classes)
- ✅ Complex test scenarios (E2E workflows, multi-step validation, state persistence)
- ✅ Professional documentation and maintainability
- ✅ Real-world testing challenges (form validation, calculations, navigation flows)

**Ready for Job Applications:**
- Production-quality codebase with professional standards
- Comprehensive test coverage exceeding typical portfolio projects
- Demonstrates ability to scale frameworks and maintain code quality
- Shows understanding of complete SDLC and QA best practices

### Known Limitations
- SauceDemo demo site limitations (no real backend API, some user types have intentional bugs)
- Visual regression requires Windows runner for baseline consistency
- Accessibility testing tracks known demo site issues (documented in `knownAccessibilityIssues.ts`)

### Technical Achievements
- **Zero technical debt**: All planned tests implemented
- **Consistent architecture**: All 70 new tests follow established patterns
- **High maintainability**: DRY principles applied throughout
- **Comprehensive validation**: Multi-layered assertions (URL, title, elements, state, calculations)
- **Professional quality**: Code comments, type safety, error handling

---

## [1.0.0-beta] - 2025-01-10
### Summary
Beta release with core framework architecture and testing patterns complete. Includes 16 tests demonstrating 5 testing capabilities with comprehensive documentation.

### Added
**Framework & Architecture**
- Page Object Model (LoginPage, InventoryPage)
- Custom Assertion Classes (LoginAssertions, InventoryAssertions)
- Custom Fixtures for dependency injection (baseTest.ts)
- TypeScript strict mode with custom types

**Test Coverage (16 Tests)**
- Login tests (5): Valid/invalid credentials, locked user, empty fields
- Inventory tests (2): Add single/multiple items to cart
- Filter tests (3): Sort by name (A-Z, Z-A) and price (Low-High, High-Low)
- Visual regression tests (3): Login, inventory, cart pages
- Accessibility tests (3): WCAG 2.1 Level A & AA compliance

**Testing Capabilities**
- Functional testing with Page Object Model
- Accessibility testing (@axe-core/playwright, WCAG 2.1)
- Visual regression testing (toHaveScreenshot)
- Cross-browser testing (Chromium, Firefox, WebKit)
- CI/CD integration (GitHub Actions)

**CI/CD Pipeline**
- GitHub Actions workflow with Windows runner
- Cross-browser matrix execution
- Artifact uploads (reports, screenshots, traces)
- Retry strategy (2 retries on CI)

**Documentation**
- README.md: Project overview and capabilities
- ARCHITECTURE.md: High-level design decisions
- LEARNING_NOTES.md: Implementation insights and Playwright concepts
- TODO.md: Test expansion roadmap (16→50-60 tests)

### Known Limitations
- Test coverage: 16/60 tests (27% of SauceDemo functionality)
- Missing: Product detail, cart operations, checkout flow, menu, footer, E2E workflows
- Only standard_user and locked_out_user tested (4 other user types pending)

### Technical Decisions
- Windows CI runner for consistent visual regression baselines
- Role-based locators for accessibility-first approach
- Separate assertion classes for Single Responsibility Principle
- Custom fixtures for dependency injection pattern

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

import { expect } from "@playwright/test";
import HamburgerMenuPage from "../pages/hamburgerMenuPage";

export default class HamburgerMenuAssertions {
    private hamburgerMenuPage: HamburgerMenuPage;

    constructor(hamburgerMenuPage: HamburgerMenuPage) {
        this.hamburgerMenuPage = hamburgerMenuPage;
    }

    async verifyMenuIsOpen() {
        const menuContainer = this.hamburgerMenuPage.getMenuContainer();
        await expect(menuContainer).toBeVisible();
        // Check if the menu has the 'open' state by checking aria-hidden or visibility
        await expect(menuContainer).toHaveCSS('visibility', 'visible');
    }

    async verifyMenuIsClosed() {
        const menuContainer = this.hamburgerMenuPage.getMenuContainer();
        // Check that menu has aria-hidden="true" or hidden attribute
        await expect(menuContainer).toHaveAttribute('aria-hidden', 'true');
    }

    async verifyAllItemsLinkIsVisible() {
        await expect(this.hamburgerMenuPage.getAllItemsLink()).toBeVisible();
    }

    async verifyAboutLinkIsVisible() {
        await expect(this.hamburgerMenuPage.getAboutLink()).toBeVisible();
    }

    async verifyLogoutLinkIsVisible() {
        await expect(this.hamburgerMenuPage.getLogoutLink()).toBeVisible();
    }

    async verifyResetAppStateLinkIsVisible() {
        await expect(this.hamburgerMenuPage.getResetAppStateLink()).toBeVisible();
    }

    async verifyMenuButtonIsVisible() {
        await expect(this.hamburgerMenuPage.getMenuButton()).toBeVisible();
    }

    async verifyCloseButtonIsVisible() {
        await expect(this.hamburgerMenuPage.getCloseButton()).toBeVisible();
    }
}

import { Page, Locator } from '@playwright/test';

export default class HamburgerMenuPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Actions
    async openMenu() {
        await this.page.locator('#react-burger-menu-btn').click();
    }

    async closeMenu() {
        await this.page.locator('#react-burger-cross-btn').click();
    }

    async clickAllItemsLink() {
        await this.page.locator('#inventory_sidebar_link').click();
    }

    async clickAboutLink() {
        await this.page.locator('#about_sidebar_link').click();
    }

    async clickLogoutLink() {
        await this.page.locator('#logout_sidebar_link').click();
    }

    async clickResetAppStateLink() {
        await this.page.locator('#reset_sidebar_link').click();
    }

    // Getters - Return element states without assertions
    getMenuButton(): Locator {
        return this.page.locator('#react-burger-menu-btn');
    }

    getCloseButton(): Locator {
        return this.page.locator('#react-burger-cross-btn');
    }

    getMenuContainer(): Locator {
        return this.page.locator('.bm-menu-wrap');
    }

    getAllItemsLink(): Locator {
        return this.page.locator('#inventory_sidebar_link');
    }

    getAboutLink(): Locator {
        return this.page.locator('#about_sidebar_link');
    }

    getLogoutLink(): Locator {
        return this.page.locator('#logout_sidebar_link');
    }

    getResetAppStateLink(): Locator {
        return this.page.locator('#reset_sidebar_link');
    }
}

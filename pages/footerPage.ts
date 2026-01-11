import { Page, Locator } from '@playwright/test';

export default class FooterPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Getters - Return element locators without assertions
    getFooterContainer(): Locator {
        return this.page.locator('.footer');
    }

    getTwitterLink(): Locator {
        return this.page.locator('[data-test="social-twitter"]');
    }

    getFacebookLink(): Locator {
        return this.page.locator('[data-test="social-facebook"]');
    }

    getLinkedInLink(): Locator {
        return this.page.locator('[data-test="social-linkedin"]');
    }

    getCopyrightText(): Locator {
        return this.page.locator('.footer_copy');
    }

    // Actions
    async getTwitterLinkHref(): Promise<string | null> {
        return await this.getTwitterLink().getAttribute('href');
    }

    async getFacebookLinkHref(): Promise<string | null> {
        return await this.getFacebookLink().getAttribute('href');
    }

    async getLinkedInLinkHref(): Promise<string | null> {
        return await this.getLinkedInLink().getAttribute('href');
    }

    async getCopyrightTextContent(): Promise<string> {
        return (await this.getCopyrightText().textContent()) || '';
    }
}

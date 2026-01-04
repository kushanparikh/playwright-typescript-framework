import { Page, Locator } from '@playwright/test';

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

    // Getters
    getURL(): String {
        return this.page.url();
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }
    
    async getDisplayedErrorMessage(): Promise<string> {
        return (await this.page.locator('[data-test="error"]').textContent()) || '';
    }
}
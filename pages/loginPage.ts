import { Page } from '@playwright/test';

export default class LoginPage {
    // Login page selectors and methods would go here

    constructor(private page: Page) {
    }

    async login(username: string, password: string) {
        await this.page.getByPlaceholder('Username').fill(username);
        await this.page.getByPlaceholder('Password').fill(password);
        await this.page.getByRole('button', { name: 'Login' }).click();
    }
}
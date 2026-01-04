import { expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";

export default class LoginAssertions {
    private loginPage: LoginPage;

    constructor(loginPage: LoginPage) {
        this.loginPage = loginPage;
    }

    async verifyLoginLandingDetails() {
        await expect(this.loginPage.getTitle()).toContain('Swag Labs');
    }

    async verifyDisplayedErrorMessage(message: string) {
        await expect(this.loginPage.getDisplayedErrorMessage()).toContain(message);
    }
}
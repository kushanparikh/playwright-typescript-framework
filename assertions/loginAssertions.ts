import { expect } from "@playwright/test";
import LoginPage from "../pages/loginPage";

export default class LoginAssertions {
    private loginPage: LoginPage;

    constructor(loginPage: LoginPage) {
        this.loginPage = loginPage;
    }

    async verifyLoginLandingDetails() {
        await expect(await this.loginPage.getTitle()).toContain('Swag Labs');
    }

    async verifyDisplayedErrorMessage(message: string) {
        await expect(await this.loginPage.getDisplayedErrorMessage()).toContain(message);
    }

    async verifyLogoIsVisible() {
        await expect(this.loginPage.getLogo()).toBeVisible();
    }

    async verifyPasswordFieldIsMasked() {
        await expect(this.loginPage.getPasswordField()).toHaveAttribute('type', 'password');
    }

    async verifyLoginButtonIsDisabled() {
        await expect(this.loginPage.getLoginButton()).toBeDisabled();
    }

    async verifyLoginButtonIsEnabled() {
        await expect(this.loginPage.getLoginButton()).toBeEnabled();
    }
}
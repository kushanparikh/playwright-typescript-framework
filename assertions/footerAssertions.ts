import { expect } from "@playwright/test";
import FooterPage from "../pages/footerPage";

export default class FooterAssertions {
    private footerPage: FooterPage;

    constructor(footerPage: FooterPage) {
        this.footerPage = footerPage;
    }

    async verifyTwitterLinkIsValid() {
        const twitterLink = this.footerPage.getTwitterLink();
        await expect(twitterLink).toBeVisible();
        const href = await this.footerPage.getTwitterLinkHref();
        expect(href).toContain('twitter.com');
    }

    async verifyFacebookLinkIsValid() {
        const facebookLink = this.footerPage.getFacebookLink();
        await expect(facebookLink).toBeVisible();
        const href = await this.footerPage.getFacebookLinkHref();
        expect(href).toContain('facebook.com');
    }

    async verifyLinkedInLinkIsValid() {
        const linkedInLink = this.footerPage.getLinkedInLink();
        await expect(linkedInLink).toBeVisible();
        const href = await this.footerPage.getLinkedInLinkHref();
        expect(href).toContain('linkedin.com');
    }

    async verifyCopyrightTextIsDisplayed() {
        const copyrightText = this.footerPage.getCopyrightText();
        await expect(copyrightText).toBeVisible();
        const text = await this.footerPage.getCopyrightTextContent();
        expect(text).toContain('©');
        expect(text).toContain('Sauce Labs');
    }
}

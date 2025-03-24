import { Locator, Page, expect } from '@playwright/test';

export class ReviewPage {

    readonly page: Page;
    readonly continueApplication;
    readonly submitButton;
    readonly submitBtn;


    constructor(page: Page) {
        this.page = page;
        this.continueApplication = page.getByRole('link', { name: 'Continue Application' });
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
    }

    async validateNoEditAllowed(url: string) {
        await this.page.goto(url);
        await this.page.waitForTimeout(5000);
        const isContinueDisabled = await this.continueApplication.getAttribute('data-disabled');
        expect(isContinueDisabled).toBeTruthy();
        const isSubmitDisabled = await this.submitButton.isDisabled();
        expect(isSubmitDisabled).toBeTruthy();
    }

    async submitApplication(): Promise<string> {
        await this.submitBtn.waitFor({ state: 'visible' });
        const pageUrl = this.page.url();
        await this.submitBtn.click();
        await this.page.waitForTimeout(7000);
        return pageUrl;
    }

    async getCurrentPage(locator: Locator): Promise<string> {
        await this.page.waitForTimeout(3000);
        await Promise.all([
            this.page.waitForNavigation({ timeout: 10000 }),
            locator.click()
        ]);
        return this.page.url();
    }

}

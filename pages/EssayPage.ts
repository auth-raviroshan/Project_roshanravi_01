import { expect, Page } from '@playwright/test';

export class EssayPage {

    readonly page;

    constructor(page: Page) {
        this.page = page;
    }

    async writeEssay(essayType: string, description: string) {
        await this.page.getByRole('checkbox', { name: essayType }).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.getByRole('checkbox', { name: essayType }).check();
        await this.page.getByRole('textbox', { name: `Essay about ${essayType}` }).fill(description);
        await this.page.waitForTimeout(3000);
    }
    async assert_essay_box(essayType: string, expectedValue: string) {
        await this.page.getByRole('checkbox', { name: essayType }).waitFor({ state: 'visible', timeout: 5000 });
        await this.page.getByRole('checkbox', { name: essayType }).check();
        await expect(this.page.getByRole('textbox', { name: expectedValue })).toBeVisible();
        await this.page.getByRole('checkbox', { name: essayType }).uncheck();
    }
}

import { expect, Page } from '@playwright/test';

export class EssayPage {
    constructor(private page: Page) {}

    async waitForEssayPage() {
        await this.page.getByText('Essay').waitFor({ state: 'visible' });
    }

    async writeEssay(essayType: string, description: string) {
        await this.page.getByRole('checkbox', { name: essayType }).check();
        await this.page.getByRole('textbox', { name: `Essay about ${essayType}` }).fill(description);
    }
    async assert_essay_box(essayType: string, expectedValue: string) {
        await this.page.getByRole('checkbox', { name: essayType }).check();
        await expect(this.page.getByRole('textbox', { name: expectedValue })).toBeVisible();
        await this.page.getByRole('checkbox', { name: essayType }).uncheck();
    }
}

import { Page, expect } from '@playwright/test';

export class ReviewPage {
    constructor(private page: Page) {}

    async validateNoEditAllowed() {
        const isEditButtonVisible = await this.page.isVisible('#edit');
        expect(isEditButtonVisible).toBe(false);
    }

    async submitApplication() {
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }
    async get_page_url() {
        const pageURL = this.page.url();
        await this.page.goto(pageURL);
      }
}

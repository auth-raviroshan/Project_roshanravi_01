import { expect, Page } from '@playwright/test';

export class RegisterPage {
    constructor(private page: Page) {}

    async registerUser(firstName: string, lastName: string, country: string, phoneNo: string, password: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await this.page.getByRole('button', { name: 'United States: +' }).click();
        await this.page.getByText(country, { exact: true }).click();
        await this.page.getByRole('textbox', { name: '1 (702) 123-' }).fill(phoneNo);
        await this.page.getByRole('textbox', { name: 'Create a Password' }).fill(password);
    }

    async provideConsentAndSubmit() {
        await this.page.getByRole('checkbox', { name: 'I confirm that I am at least' }).check();
        await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async login(email: string) {
        await this.page.goto('https://apply.mykaleidoscope.com/program/sdet-test-scholarship');
        await this.page.getByRole('button', { name: 'Log In to Apply' }).click();
        await this.page.getByRole('textbox', { name: 'Email Address' }).fill(email);
        await this.page.getByRole('button', { name: 'Next' }).click();
    }

    async verifyRegistration() {
        await expect(this.page.getByText('Registered successfully.')).toBeVisible();
    }
}

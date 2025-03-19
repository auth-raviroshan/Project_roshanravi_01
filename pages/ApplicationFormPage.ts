import { expect, Page } from '@playwright/test';

export class ApplicationFormPage {
    constructor(private page: Page) {}

    async fillAddressDetails(street: string, additionalStreet: string, state: string, city: string, zipcode: string, country: string) {
        await this.page.getByRole('textbox', { name: 'Street Address', exact: true }).waitFor({ state: 'attached' });
        await this.page.getByRole('textbox', { name: 'Street Address', exact: true }).fill(street);
        await this.page.getByRole('textbox', { name: 'Additional Street Address' }).fill(additionalStreet);
        await this.page.getByRole('textbox', { name: 'State (Full)' }).click();
        await this.page.getByText(state).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill(city);
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill(zipcode);
        await this.page.getByRole('textbox', { name: 'Country' }).click();
        await this.page.getByRole('option', { name: country }).click();
    }

    async fillHighSchoolDetails(schoolName: string, address: string, city: string, state: string, zipcode: string, gpa: string, graduationYear: string) {
        await this.page.getByRole('textbox', { name: 'High School Name' }).waitFor({ state: 'attached' });
        await this.page.getByRole('textbox', { name: 'High School Name' }).fill(schoolName);
        await this.page.getByRole('textbox', { name: 'HHigh School Street Address', exact: true }).fill(address);
        await this.page.getByRole('textbox', { name: 'High School City' }).fill(city);
        await this.page.getByRole('textbox', { name: 'High School State (Full)' }).click();
        await this.page.getByRole('option', { name: state }).click();
        await this.page.getByRole('textbox', { name: 'High School Zip Code' }).fill(zipcode);
        await this.page.getByRole('textbox', { name: 'GPA' }).fill(gpa);
        await this.page.getByRole('textbox', { name: 'Year of High School Graduation' }).click();
        await this.page.getByRole('button', { name: graduationYear, exact: true }).click();
    }

    async addExtracurricularActivity(name: string, years: string, leadership: string, description: string) {
        await this.page.getByRole('textbox', { name: 'Extracurricular Activity Name' }).fill(name);
        await this.page.getByRole('textbox', { name: 'Total Number of Years Involved' }).fill(years);
        await this.page.getByRole('textbox', { name: 'List any leadership roles' }).fill(leadership);
        await this.page.getByRole('textbox', { name: 'Description of Involvement' }).fill(description);
        await this.page.getByRole('button', { name: 'Add' }).nth(1).click();
    }

    async add_entry() {
        const addEntry = this.page.locator('//span[text()="Add Entry"]');
        await addEntry.waitFor({ state: 'visible' });
        await addEntry.click();
    }

    async verify_two_activities() {
        await expect(this.page.locator('#form-renderer')).toContainText('Please add at least 2 entries');
    }
    async goToNextPage() {
        await this.page.getByRole('button', { name: 'Next Page' }).waitFor({ state: 'attached' });
        await this.page.getByRole('button', { name: 'Next Page' }).waitFor({ state: 'visible' });
        await this.page.getByRole('button', { name: 'Next Page' }).isEnabled();
        await this.page.getByRole('button', { name: 'Next Page' }).click();
        // await this.page.waitForTimeout(3000);
        // await this.page.waitForNavigation({ waitUntil: 'networkidle' })
    }
    async uploadTranscript(filePath: string) {
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.page.locator('button:has-text("Upload File")').click(),
        ]);
        await fileChooser.setFiles(filePath);
    }
}

import { expect, Page } from '@playwright/test';

export class ApplicationFormPage {

    readonly page;
    readonly streetAddress;
    readonly additonalStreetAddress;
    readonly state;
    readonly city;
    readonly zipcode;
    readonly country;
    readonly schoolName;
    readonly schoolAddress;
    readonly schoolCity;
    readonly schoolState;
    readonly schoolZipcode;
    readonly schoolGpa;
    readonly passout;
    readonly transcript
    readonly activityName;
    readonly years;
    readonly leadership;
    readonly description;
    readonly addActivity;
    readonly addEntry;
    readonly assertActivity;
    readonly nextPage;
    readonly fileUpload;


    constructor(page: Page) {
        this.page = page;
        this.streetAddress = page.getByRole('textbox', { name: 'Street Address', exact: true });
        this.additonalStreetAddress = page.getByRole('textbox', { name: 'Additional Street Address' });
        this.state = page.getByRole('textbox', { name: 'State (Full)' });
        this.city = page.getByRole('textbox', { name: 'City' });
        this.zipcode = page.getByRole('textbox', { name: 'Zip Code' });
        this.country = page.getByRole('textbox', { name: 'Country' });
        this.schoolName = page.getByRole('textbox', { name: 'High School Name' });
        this.schoolAddress = page.getByRole('textbox', { name: 'High School Street Address', exact: true });
        this.schoolCity = page.getByRole('textbox', { name: 'High School City' });
        this.schoolState = page.getByRole('textbox', { name: 'High School State (Full)' });
        this.schoolZipcode = page.getByRole('textbox', { name: 'High School Zip Code' });
        this.schoolGpa = page.getByRole('textbox', { name: 'GPA' });
        this.passout = page.getByRole('textbox', { name: 'Year of High School Graduation' });
        this.transcript = page.getByRole('button', { name: 'My_School_Transcript.pdf' });
        this.activityName = page.getByRole('textbox', { name: 'Extracurricular Activity Name' });
        this.years = page.getByRole('textbox', { name: 'Total Number of Years Involved' });
        this.leadership = page.getByRole('textbox', { name: 'List any leadership roles' });
        this.description = page.getByRole('textbox', { name: 'Description of Involvement' });
        this.addActivity = page.getByRole('button', { name: 'Add' });
        this.addEntry=page.locator('//span[text()="Add Entry"]');
        this.assertActivity=page.locator('#form-renderer');
        this.nextPage=page.getByRole('button', { name: 'Next Page' });
        this.fileUpload=page.locator('button:has-text("Upload File")');


    }

    async fillAddressDetails(street: string, additionalStreet: string, state: string, city: string, zipcode: string, country: string) {
        await this.streetAddress.waitFor({ state: 'visible' });
        await this.streetAddress.fill(street);
        await this.additonalStreetAddress.fill(additionalStreet);
        await this.state.click();
        await this.page.getByText(state).click();
        await this.city.fill(city);
        await this.zipcode.fill(zipcode);
        await this.country.click();
        await this.page.getByRole('option', { name: country }).click();
        await this.goToNextPage();
    }

    async fillHighSchoolDetails(schoolName: string, address: string, city: string, state: string, zipcode: string, gpa: string, graduationYear: string, filePath: string) {
        await this.schoolName.waitFor({ state: 'visible', timeout: 5000 });
        await this.schoolName.fill(schoolName);
        await this.schoolAddress.fill(address);
        await this.schoolCity.fill(city);
        await this.schoolState.click();
        await this.page.getByRole('option', { name: state }).click();
        await this.schoolZipcode.fill(zipcode);
        await this.schoolGpa.fill(gpa);
        await this.passout.fill(graduationYear);
        await this.uploadTranscript(filePath);
        await this.transcript.waitFor({ state: 'visible', timeout: 10000 });
        await this.goToNextPage();
    }

    async addExtracurricularActivity(name: string, years: string, leadership: string, description: string) {
        await this.activityName.fill(name);
        await this.years.fill(years);
        await this.leadership.fill(leadership);
        await this.description.fill(description);
        await this.addActivity.nth(1).waitFor({ state: 'visible' });
        await this.addActivity.nth(1).click();
    }

    async add_entry() {
        await this.addEntry.waitFor({ state: 'visible' });
        await this.addEntry.click();
    }

    async verifyActivities() {
        await this.goToNextPage();
        await expect(this.assertActivity).toContainText('Please add at least 2 entries');
    }
    async goToNextPage() {
        await this.nextPage.waitFor({ state: 'visible', timeout: 10000 });
        await this.nextPage.click();
    }
    async uploadTranscript(filePath: string) {
        const [fileChooser] = await Promise.all([
            this.page.waitForEvent('filechooser'),
            this.fileUpload.click(),
        ]);
        await fileChooser.setFiles(filePath);
    }
}

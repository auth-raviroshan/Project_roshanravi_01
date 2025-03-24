import { Page } from '@playwright/test';

export class RegisterPage {

    readonly page;
    readonly firstName;
    readonly lastName;
    readonly country;
    readonly phoneNo;
    readonly createPassword;
    readonly consentBox;
    readonly submitBtn;
    readonly loginBtn;
    readonly email;
    readonly nextBtn;
    readonly password;
    readonly signIn;
    readonly profile;
    readonly logoutBtn;

    constructor(page: Page) {
        this.page = page;
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.lastName = page.getByRole('textbox', { name: 'Last Name' });
        this.country = page.getByRole('button', { name: 'United States: +' });
        this.phoneNo = page.getByRole('textbox', { name: '1 (702) 123-' });
        this.createPassword = page.getByRole('textbox', { name: 'Create a Password' });
        this.consentBox = page.getByRole('checkbox', { name: 'I confirm that I am at least' });
        this.submitBtn = page.getByRole('button', { name: 'Submit' });
        this.loginBtn = page.getByRole('button', { name: 'Log In to Apply' });
        this.email = page.getByRole('textbox', { name: 'Email Address' });
        this.nextBtn = page.getByRole('button', { name: 'Next' });
        this.password = page.getByRole('textbox', { name: 'Enter Your Password' });
        this.signIn = page.getByRole('button', { name: 'Sign In' });
        this.profile = page.getByRole('button', { name: 'jd' });
        this.logoutBtn = page.getByRole('menuitem', { name: 'Logout' });
    }

    async registerUser(firstName: string, lastName: string, country: string, phoneNo: string, password: string) {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.country.click();
        await this.page.getByText(country, { exact: true }).click();
        await this.phoneNo.fill(phoneNo);
        await this.createPassword.fill(password);
        await this.consentBox.check();
    }

    async login(email: string) {
        await this.loginBtn.click();
        await this.email.fill(email);
        await this.nextBtn.click();
    }

    async logout() {
        await this.profile.click();
        await this.logoutBtn.click();
    }

    async generateUniqueEmail(domain: string = "testmail.com"): Promise<string> {
        const timestamp = Date.now(); 
        const randomNum = Math.floor(Math.random() * 10000); 
        return `user_${timestamp}_${randomNum}@${domain}`;
    }
}

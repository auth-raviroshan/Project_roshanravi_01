import { BrowserContext, Page, test } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { ApplicationFormPage } from "../pages/ApplicationFormPage";
import { EssayPage } from "../pages/EssayPage";
import { ReviewPage } from "../pages/ReviewPage";
import testData from '../testdata/testdata.json';
import fs from 'fs';

test.describe.serial('Scholarship Application Tests', () => {
    let register: RegisterPage;
    let form: ApplicationFormPage;
    let essays: EssayPage;
    let review: ReviewPage;
    let currentUrl: string = '';
    let uniqueEmail: string;
    const sessionFile = 'session.json';
    const stateFile = 'test_state.json';
    const schoolTranscript = './testdata/My_School_Transcript.pdf';
    let context: BrowserContext;
    let page: Page;

    test.beforeEach(async ({ browser }) => {
        //find if existing session
        if (fs.existsSync(sessionFile)) {
            context = await browser.newContext({ storageState: sessionFile });
        } else {
            //create new context if no session
            context = await browser.newContext();
        }

        page = await context.newPage();
        register = new RegisterPage(page);
        form = new ApplicationFormPage(page);
        essays = new EssayPage(page);
        review = new ReviewPage(page);

        //to restore last state 
        if (fs.existsSync(stateFile)) {
            const stateData = JSON.parse(fs.readFileSync(stateFile, 'utf-8'));
            currentUrl = stateData.currentUrl;
        }
    });

    test('User Registration', async () => {

        await page.goto(`https://apply.mykaleidoscope.com/program/sdet-test-scholarship`);

        uniqueEmail = await register.generateUniqueEmail("mydomain.com");

        await register.login(uniqueEmail);
        await register.registerUser(
            testData.register.firstName,
            testData.register.lastName,
            testData.register.country,
            testData.register.phoneNo,
            testData.register.password
        );
        currentUrl = await review.getCurrentPage(register.submitBtn);

        await page.context().storageState({ path: sessionFile });
        fs.writeFileSync(stateFile, JSON.stringify({ currentUrl }));
    });

    test('Student Address Details', async () => {
        await page.goto(currentUrl);

        await form.fillAddressDetails(
            testData.address.streetAddress,
            testData.address.AdditionalStreetAddress,
            testData.address.state,
            testData.address.city,
            testData.address.zipcode,
            testData.address.country
        );

        currentUrl = await review.getCurrentPage(form.nextPage);
        fs.writeFileSync(stateFile, JSON.stringify({ currentUrl }));
    });

    test('Extra Curricular Activities', async () => {

        await page.goto(currentUrl);
        await form.verifyActivities();

        for (const activity of testData.activities) {
            await form.add_entry();
            await form.addExtracurricularActivity(
                activity.activityName,
                activity.yearsInvolved,
                activity.leadershipRole,
                activity.description
            );
        }

        currentUrl = await review.getCurrentPage(form.nextPage);
        fs.writeFileSync(stateFile, JSON.stringify({ currentUrl }));
    });

    test('High School Details', async () => {
        await page.goto(currentUrl);

        await form.fillHighSchoolDetails(
            testData.highSchool.schoolName,
            testData.highSchool.schoolAddress,
            testData.highSchool.city,
            testData.highSchool.state,
            testData.highSchool.zipcode,
            testData.highSchool.gpa,
            testData.highSchool.graduationYear,
            schoolTranscript
        );

        currentUrl = await review.getCurrentPage(form.nextPage);
        fs.writeFileSync(stateFile, JSON.stringify({ currentUrl }));
    });

    test('Essay Details', async () => {
        await page.goto(currentUrl);

        for (const key in testData.essay) {
            const { essay, assert } = testData.essay[key];
            await essays.assert_essay_box(essay, assert);
        }
        await essays.writeEssay(testData.essay.Animals.essay, testData.essay.Animals.description);
        await essays.writeEssay(testData.essay.School.essay, testData.essay.School.description);

        currentUrl = await review.getCurrentPage(form.nextPage);
        fs.writeFileSync(stateFile, JSON.stringify({ currentUrl }));
    });

    test('Review Details', async () => {
        await page.goto(currentUrl);

        const reviewUrl = await review.submitApplication();
        await review.validateNoEditAllowed(reviewUrl);
        await register.logout();
    });

    test.afterEach(async () => {
        await page.close();   // Close the page
        await context.close(); // Close the browser context
    });

    test.afterAll(async () => {
        if (fs.existsSync(sessionFile)) fs.unlinkSync(sessionFile);
        if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);
    })

});

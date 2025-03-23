import test, { expect } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { ApplicationFormPage } from "../pages/ApplicationFormPage";
import { EssayPage } from "../pages/EssayPage";
import { ReviewPage } from "../pages/ReviewPage";
import testData from '../testdata/testdata.json';

test.describe('Scholarship Application Tests', () => {
    let register: RegisterPage;
    let form: ApplicationFormPage;
    let essays: EssayPage;
    let review: ReviewPage;
    const schoolTranscript = './testdata/My_School_Transcript.pdf';

    test.beforeEach(async ({ page }) => {
        register = new RegisterPage(page);
        form = new ApplicationFormPage(page);
        essays = new EssayPage(page);
        review = new ReviewPage(page);

        await register.login(testData.register.email);

    });

    test('Register User for Scholar Ship Application', async ({ page }) => {
        //user registration details
        await register.registerUser(
            testData.register.firstName,
            testData.register.lastName,
            testData.register.country,
            testData.register.phoneNo,
            testData.register.password
        );
        await page.getByRole('button', { name: 'Next Page' }).waitFor({ state: 'visible' });
        //logout
        await register.logout();
    });

    test('Scholar Ship Application Details', async ({ page }) => {
        //Login after registration
        await register.loginUser(testData.register.email, testData.register.password);

        //User fills Address Details
        await form.fillAddressDetails(
            testData.address.streetAddress,
            testData.address.AdditionalStreetAddress,
            testData.address.state,
            testData.address.city,
            testData.address.zipcode,
            testData.address.country
        );

        //User verifies the required activities 
        await form.verifyActivities();

        //User fills Activity Details
        for (const activity of testData.activities) {
            await form.add_entry();
            await form.addExtracurricularActivity(
                activity.activityName,
                activity.yearsInvolved,
                activity.leadershipRole,
                activity.description
            );
        }
        await page.waitForTimeout(3000);
        await form.goToNextPage();

        //User fills High School Details
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

        await form.goToNextPage();
        await page.waitForTimeout(3000);

        //User Verifies the Essay Boxes
        for (const key in testData.essay) {
            const { essay, assert } = testData.essay[key];
            await essays.assert_essay_box(essay, assert);
        }

        //User fiils Essay Details
        await essays.writeEssay(testData.essay.Animals.essay, testData.essay.Animals.description);
        await essays.writeEssay(testData.essay.School.essay, testData.essay.School.description);
        await form.goToNextPage();

        //User Submits Application Details
        const currentUrl = await review.submitApplication();

        //Verify User is able to edit application
        await review.validateNoEditAllowed(currentUrl);


        await register.logout();

    });

});
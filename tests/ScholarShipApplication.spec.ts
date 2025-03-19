import { expect, test } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { ApplicationFormPage } from '../pages/ApplicationFormPage';
import { EssayPage } from '../pages/EssayPage';
import { ReviewPage } from '../pages/ReviewPage';
import testData from '../testdata/testdata.json';

test('Complete Application Form', async ({ page }) => {
    const register = new RegisterPage(page);
    const form = new ApplicationFormPage(page);
    const essay = new EssayPage(page);
    const review = new ReviewPage(page);
    const school_transcript = './upload/My_School_Transcript.pdf';
    
    //register user
    await register.login(testData.register.email);
    await register.registerUser(testData.register.firstName, testData.register.lastName, testData.register.country, testData.register.phoneNo, testData.register.password);
    await register.provideConsentAndSubmit();
    // await expect(page.getByText('Registered successfully.')).toBeVisible();



    await form.fillAddressDetails(testData.address.streetAddress, testData.address.AdditionalStreetAddress, testData.address.state, testData.address.city, testData.address.zipcode,testData.address.country);
    await form.goToNextPage();
    await form.goToNextPage();
    //activities assertions
    await form.verify_two_activities();

    //extra circular activities
     for (const activity of testData.activities) {
        await form.add_entry();
        await form.addExtracurricularActivity(
            activity.activityName,
            activity.yearsInvolved,
            activity.leadershipRole,
            activity.description
        );
    }
    await form.goToNextPage();

    //high school information
    await form.fillHighSchoolDetails(testData.highSchool.schoolName, testData.highSchool.schoolAddress, testData.highSchool.city, 
        testData.highSchool.state,testData.highSchool.zipcode, testData.highSchool.gpa, testData.highSchool.graduationYear);
    await form.uploadTranscript(school_transcript);
    await form.goToNextPage();

    //essay box assertions
    await essay.assert_essay_box(testData.essay.Cars.essay, testData.essay.Cars.assert);
    await essay.assert_essay_box(testData.essay.Animals.essay, testData.essay.Animals.assert);
    await essay.assert_essay_box(testData.essay.School.essay, testData.essay.School.assert);
    await essay.assert_essay_box(testData.essay.Other.essay, testData.essay.Other.assert);

    //essay box info
    await essay.writeEssay(testData.essay.Animals.essay,testData.essay.Animals.description );
    await essay.writeEssay(testData.essay.School.essay,testData.essay.School.description );
    await form.goToNextPage();
    await review.submitApplication();
    await review.get_page_url();

    //validate no edit
    await review.validateNoEditAllowed();
});

/*import {test, expect} from '@playwright/test';
import FormPage from '../pageobjects/form.page.js'

test.describe('auth form ', () => {
    test('should deny access with wrong creds@x', async () => {
        await FormPage.open()
        await FormPage.username.setValue('foo')
        await FormPage.password.setValue('bar')
        await FormPage.submit()

        await FormPage.flash.waitForDisplayed()
        await expect(FormPage.flash).toHaveText(
            expect.stringContaining('Your username is invalid!')
        )
    })

    test('should allow access with correct creds@x', async () => {
        await FormPage.open()
        await FormPage.username.setValue('tomsmith')
        await FormPage.password.setValue('SuperSecretPassword!')
        await FormPage.submit()

        await FormPage.flash.waitForDisplayed()
        await expect(FormPage.flash).toHaveText(
            expect.stringContaining('You logged into a secure area!')
        )
    })
})*/

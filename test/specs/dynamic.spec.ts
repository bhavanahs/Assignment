import {test, expect} from '@playwright/test';
import DynamicPage from '../pageobjects/dynamic.page.js'

test.describe('dynamic loading ', function () {
    test('should be an button on the page@x', async () => {
        await DynamicPage.open()
        await expect(DynamicPage.loadedPage).not.toBePresent()

        await DynamicPage.btnStart.click()
        await DynamicPage.loadedPage.waitForExist()
        await expect(DynamicPage.loadedPage).toBePresent()
    })
})

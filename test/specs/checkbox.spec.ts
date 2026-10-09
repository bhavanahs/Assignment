import {test, expect} from '@playwright/test';
import CheckboxPage from '../pageobjects/checkbox.page.js'

test.describe('checkboxes', () => {
    test('checkbox 2 should be enabled @x', async () => {
        await CheckboxPage.open()
        await expect(CheckboxPage.firstCheckbox).not.toBeSelected()
        await expect(CheckboxPage.lastCheckbox).toBeSelected()
    })

    test('checkbox 1 should be enabled after clicking on it @x', async () => {
        await CheckboxPage.open()
        await expect(CheckboxPage.firstCheckbox).not.toBeSelected()
        await CheckboxPage.firstCheckbox.click()
        await expect(CheckboxPage.firstCheckbox).toBeSelected()
    })
});
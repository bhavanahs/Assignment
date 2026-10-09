import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import RetirementCalculatorPage, { type RetirementCalculatorData } from '../pageobjects/retirement-calculator.page.js';

function loadCalculatorData(): RetirementCalculatorData {
    const csv = readFileSync(new URL('../../../data/retirement-calculator.csv', import.meta.url), 'utf8').trim();
    const [headerLine, valuesLine] = csv.split(/\r?\n/);
    const headers = headerLine.split(',');
    const values = valuesLine.split(',');

    if (headers.length !== values.length) {
        throw new Error('Retirement calculator CSV must have matching headers and values.');
    }

    return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as RetirementCalculatorData;
}

const calculatorData = loadCalculatorData();

test.describe('Securian retirement calculator', () => {
    test.beforeEach(async ({ page }) => {
        const calculator = new RetirementCalculatorPage(page);
        await calculator.open();
        await calculator.acceptCookiesIfVisible();
    });

    test('submits with all required fields populated @regression', async ({ page }) => {
        const calculator = new RetirementCalculatorPage(page);
        await calculator.fillRequiredFields(calculatorData);
        await calculator.calculate();

        await expect(calculator.resultsHeading).toBeVisible();
    });

    test('shows and hides additional Social Security fields with the benefit selection @regression', async ({ page }) => {
        const calculator = new RetirementCalculatorPage(page);

        await expect(calculator.socialSecurityOverride).toBeHidden();
        await calculator.socialSecurityYes.click();
        await expect(calculator.socialSecurityOverride).toBeVisible();
        await expect(calculator.singleMaritalStatus).toBeVisible();
        await calculator.socialSecurityNo.click();
        await expect(calculator.socialSecurityOverride).toBeHidden();
        await expect(calculator.singleMaritalStatus).toBeHidden();
    });

    test('submits with every calculator field populated @regression', async ({ page }) => {
        const calculator = new RetirementCalculatorPage(page);
        await calculator.fillRequiredFields(calculatorData);
        await calculator.fillOptionalAndSocialSecurityFields(calculatorData);
        await calculator.fillDefaultValues(calculatorData);
        await calculator.calculate();

        await expect(calculator.resultsHeading).toBeVisible();
    });

    test('saves updated default calculator values @regression', async ({ page }) => {
        const calculator = new RetirementCalculatorPage(page);

        await calculator.openDefaultValues();
        await calculator.replacementRate.fill(calculatorData.replacementRate);
        await calculator.saveDefaultValuesButton.click();
        await calculator.openDefaultValues();

        await expect(calculator.replacementRate).toHaveValue(`${calculatorData.replacementRate}%`);
        await calculator.cancelDefaultValuesButton.click();
    });
});
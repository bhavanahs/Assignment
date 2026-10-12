import { readFileSync } from 'node:fs';
import RetirementCalculatorPage, {
    type RetirementCalculatorAcceptanceData
} from '../pageobjects/retirement-calculator.acceptance.page.js';

function loadCalculatorData(): RetirementCalculatorAcceptanceData[] {
    const csv = readFileSync(new URL('../../../data/retirement-calculator.csv', import.meta.url), 'utf8').trim();
    const [headerLine, ...dataLines] = csv.split(/\r?\n/);
    const headers = headerLine.split(',');

    return dataLines.map((line, rowIndex) => {
        const values = line.split(',');
        if (values.length !== headers.length) {
            throw new Error(`Retirement calculator CSV row ${rowIndex + 2} has mismatched columns.`);
        }

        return Object.fromEntries(headers.map((header, index) => [header, values[index]])) as unknown as RetirementCalculatorAcceptanceData;
    });
}

const calculatorRows = loadCalculatorData();

calculatorRows.forEach((data: RetirementCalculatorAcceptanceData, index: number) => {
    describe(`Securian retirement calculator, CSV row ${index + 1}`, () => {
        beforeEach(async () => {
            await RetirementCalculatorPage.open();
            await RetirementCalculatorPage.acceptCookiesIfVisible();
        });

        it('submits with all required fields populated', async () => {
            await RetirementCalculatorPage.fillRequiredFields(data);
            await RetirementCalculatorPage.calculate();
            await RetirementCalculatorPage.waitForResults();

            expect(await RetirementCalculatorPage.resultsHeading.isDisplayed()).toBeTruthy();
        });

        it('shows and hides Social Security fields using the unique benefit controls', async () => {
            expect(await RetirementCalculatorPage.socialSecurityOverride.isDisplayed()).toBeFalsy();
            await RetirementCalculatorPage.socialSecurityYes.click();
            expect(await RetirementCalculatorPage.socialSecurityOverride.isDisplayed()).toBeTruthy();
            expect(await RetirementCalculatorPage.singleMaritalStatus.isDisplayed()).toBeTruthy();

            await RetirementCalculatorPage.socialSecurityNo.click();
            await RetirementCalculatorPage.waitForSocialSecurityFieldsToHide();
            expect(await RetirementCalculatorPage.socialSecurityOverride.isDisplayed()).toBeFalsy();
            expect(await RetirementCalculatorPage.singleMaritalStatus.isDisplayed()).toBeFalsy();
        });

        it('submits with all calculator fields populated', async () => {
            await RetirementCalculatorPage.fillRequiredFields(data);
            await RetirementCalculatorPage.fillAdditionalSocialSecurityFields(data);
            await RetirementCalculatorPage.fillAndSaveDefaultValues(data);
            await RetirementCalculatorPage.calculate();
            await RetirementCalculatorPage.waitForResults();

            expect(await RetirementCalculatorPage.resultsHeading.isDisplayed()).toBeTruthy();
        });

        it('updates and retains default calculator values', async () => {
            await RetirementCalculatorPage.fillAndSaveDefaultValues(data);
            await RetirementCalculatorPage.openDefaultValues();

            expect(await RetirementCalculatorPage.postRetirementReturn.getValue()).toBe(`${data.postRetirementReturn}%`);
            await RetirementCalculatorPage.cancelDefaultValuesButton.click();
        });
    });
});
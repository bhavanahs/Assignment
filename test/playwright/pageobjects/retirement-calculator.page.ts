import type { Page} from '@playwright/test';
import { expect } from '@playwright/test';

export interface RetirementCalculatorData {
    currentAge: string;
    retirementAge: string;
    annualIncome: string;
    spouseIncome: string;
    currentSavings: string;
    annualSavingsPercent: string;
    savingsIncreasePercent: string;
    socialSecurity: string;
    maritalStatus: string;
    socialSecurityOverride: string;
    additionalRetirementIncome: string;
    retirementYears: string;
    inflationEnabled: string;
    inflationRate: string;
    replacementRate: string;
    preRetirementReturn: string;
    postRetirementReturn: string;
}

export default class RetirementCalculatorPage {
    readonly acceptCookiesButton;
    readonly currentAge;
    readonly retirementAge;
    readonly annualIncome;
    readonly spouseIncome;
    readonly currentSavings;
    readonly annualSavingsPercent;
    readonly savingsIncreasePercent;
    readonly socialSecurityYes;
    readonly socialSecurityNo;
    readonly socialSecurityOverride;
    readonly singleMaritalStatus;
    readonly marriedMaritalStatus;
    readonly adjustDefaultValuesButton;
    readonly defaultValuesDialog;
    readonly additionalRetirementIncome;
    readonly retirementYears;
    readonly inflationYes;
    readonly inflationNo;
    readonly inflationRate;
    readonly replacementRate;
    readonly preRetirementReturn;
    readonly postRetirementReturn;
    readonly saveDefaultValuesButton;
    readonly cancelDefaultValuesButton;
    readonly calculateButton;
    readonly resultsHeading;

    constructor(private readonly page: Page) {
        this.acceptCookiesButton = page.locator('#onetrust-accept-btn-handler');
        this.currentAge = page.locator('#current-age');
        this.retirementAge = page.locator('#retirement-age');
        this.annualIncome = page.locator('#current-income');
        this.spouseIncome = page.locator('#spouse-income');
        this.currentSavings = page.locator('#current-total-savings');
        this.annualSavingsPercent = page.locator('#current-annual-savings');
        this.savingsIncreasePercent = page.locator('#savings-increase-rate');
        this.socialSecurityYes = page.locator('label[for="yes-social-benefits"]');
        this.socialSecurityNo = page.locator('label[for="no-social-benefits"]');
        this.socialSecurityOverride = page.locator('#social-security-override');
        this.singleMaritalStatus = page.locator('label[for="single"]');
        this.marriedMaritalStatus = page.locator('label[for="married"]');
        this.adjustDefaultValuesButton = page.getByRole('button', { name: 'Adjust default values' });
        this.defaultValuesDialog = page.getByRole('dialog', { name: 'Default calculator values' });
        this.additionalRetirementIncome = this.defaultValuesDialog.locator('#additional-income');
        this.retirementYears = this.defaultValuesDialog.locator('#retirement-duration');
        this.inflationYes = this.defaultValuesDialog.locator('label[for="include-inflation"]');
        this.inflationNo = this.defaultValuesDialog.locator('label[for="exclude-inflation"]');
        this.inflationRate = this.defaultValuesDialog.locator('#expected-inflation-rate');
        this.replacementRate = this.defaultValuesDialog.locator('#retirement-annual-income');
        this.preRetirementReturn = this.defaultValuesDialog.locator('#pre-retirement-roi');
        this.postRetirementReturn = this.defaultValuesDialog.locator('#post-retirement-roi');
        this.saveDefaultValuesButton = this.defaultValuesDialog.getByRole('button', { name: 'Save changes' });
        this.cancelDefaultValuesButton = this.defaultValuesDialog.getByRole('button', { name: 'Cancel' });
        this.calculateButton = page.getByRole('button', { name: 'Calculate', exact: true });
        this.resultsHeading = page.getByRole('heading', { name: 'Results', exact: true });
    }

    async open(): Promise<void> {
        await this.page.goto('/insights-tools/retirement-calculator.html');
    }

    async acceptCookiesIfVisible(): Promise<void> {
       await expect(this.acceptCookiesButton).toBeVisible({ timeout: 5000 });
       await this.acceptCookiesButton.first().click();

    }

    async fillRequiredFields(data: RetirementCalculatorData): Promise<void> {
        await this.currentAge.fill(data.currentAge);
        await this.retirementAge.fill(data.retirementAge);
        await this.annualIncome.fill(data.annualIncome);
        await this.currentSavings.fill(data.currentSavings);
        await this.annualSavingsPercent.fill(data.annualSavingsPercent);
        await this.savingsIncreasePercent.fill(data.savingsIncreasePercent);
    }

    async fillOptionalAndSocialSecurityFields(data: RetirementCalculatorData): Promise<void> {
        await this.spouseIncome.fill(data.spouseIncome);
        if (data.socialSecurity !== 'Yes') {
            await this.socialSecurityNo.click();
            return;
        }

        await this.socialSecurityYes.click();
        if (data.maritalStatus === 'Married') {
            await this.marriedMaritalStatus.click();
        } else {
            await this.singleMaritalStatus.click();
        }
        await this.socialSecurityOverride.fill(data.socialSecurityOverride);
    }

    async openDefaultValues(): Promise<void> {
        await this.adjustDefaultValuesButton.click();
    }

    async fillDefaultValues(data: RetirementCalculatorData): Promise<void> {
        await this.openDefaultValues();
        await this.additionalRetirementIncome.fill(data.additionalRetirementIncome);
        await this.retirementYears.fill(data.retirementYears);
        if (data.inflationEnabled === 'Yes') {
            await this.inflationYes.click();
            await this.inflationRate.fill(data.inflationRate);
        } else {
            await this.inflationNo.click();
        }
        await this.replacementRate.fill(data.replacementRate);
        await this.preRetirementReturn.fill(data.preRetirementReturn);
        await this.postRetirementReturn.fill(data.postRetirementReturn);
        await this.saveDefaultValuesButton.click();
    }

    async calculate(): Promise<void> {
        await this.calculateButton.click();
    }
}
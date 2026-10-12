export interface RetirementCalculatorAcceptanceData {
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

class RetirementCalculatorAcceptancePage {
    get acceptCookiesButton() { return $('#onetrust-accept-btn-handler') }
    get currentAge() { return $('#current-age') }
    get retirementAge() { return $('#retirement-age') }
    get annualIncome() { return $('#current-income') }
    get spouseIncome() { return $('#spouse-income') }
    get currentSavings() { return $('#current-total-savings') }
    get annualSavingsPercent() { return $('#current-annual-savings') }
    get savingsIncreasePercent() { return $('#savings-increase-rate') }
    get socialSecurityYes() { return $('label[for="yes-social-benefits"]') }
    get socialSecurityNo() { return $('label[for="no-social-benefits"]') }
    get socialSecurityOverride() { return $('#social-security-override') }
    get singleMaritalStatus() { return $('label[for="single"]') }
    get marriedMaritalStatus() { return $('label[for="married"]') }
    get adjustDefaultValuesButton() { return $('a[role="button"][data-bs-target="#default-values-modal"]') }
    get defaultValuesDialog() { return $('#default-values-modal') }
    get additionalRetirementIncome() { return this.defaultValuesDialog.$('#additional-income') }
    get retirementYears() { return this.defaultValuesDialog.$('#retirement-duration') }
    get inflationYes() { return this.defaultValuesDialog.$('label[for="include-inflation"]') }
    get inflationNo() { return this.defaultValuesDialog.$('label[for="exclude-inflation"]') }
    get inflationRate() { return this.defaultValuesDialog.$('#expected-inflation-rate') }
    get replacementRate() { return this.defaultValuesDialog.$('#retirement-annual-income') }
    get preRetirementReturn() { return this.defaultValuesDialog.$('#pre-retirement-roi') }
    get postRetirementReturn() { return this.defaultValuesDialog.$('#post-retirement-roi') }
    get saveDefaultValuesButton() { return this.defaultValuesDialog.$('button=Save changes') }
    get cancelDefaultValuesButton() { return this.defaultValuesDialog.$('button=Cancel') }
    get calculateButton() { return $('button=Calculate') }
    get resultsHeading() { return $('h3=Results') }

    async open(): Promise<void> {
        await browser.url('/insights-tools/retirement-calculator.html');
    }

    async acceptCookiesIfVisible(): Promise<void> {
        if (await this.acceptCookiesButton.isExisting() && await this.acceptCookiesButton.isDisplayed()) {
            await this.acceptCookiesButton.click();
        }
    }

    async fillRequiredFields(data: RetirementCalculatorAcceptanceData): Promise<void> {
        await this.currentAge.setValue(data.currentAge);
        await this.retirementAge.setValue(data.retirementAge);
        await this.annualIncome.click();
        await this.annualIncome.addValue(data.annualIncome);
        await this.currentSavings.click();
        await this.currentSavings.addValue(data.currentSavings);
        await this.annualSavingsPercent.setValue(data.annualSavingsPercent);
        await this.savingsIncreasePercent.setValue(data.savingsIncreasePercent);
    }

    async fillAdditionalSocialSecurityFields(data: RetirementCalculatorAcceptanceData): Promise<void> {
        await this.spouseIncome.click();
        await this.spouseIncome.addValue(data.spouseIncome);

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
        await this.socialSecurityOverride.setValue(data.socialSecurityOverride);
    }

    async waitForSocialSecurityFieldsToHide(): Promise<void> {
        await this.socialSecurityOverride.waitForDisplayed({ reverse: true });
        await this.singleMaritalStatus.waitForDisplayed({ reverse: true });
    }

    async openDefaultValues(): Promise<void> {
        await this.adjustDefaultValuesButton.click();
    }

    async fillAndSaveDefaultValues(data: RetirementCalculatorAcceptanceData): Promise<void> {
        await this.openDefaultValues();
        await this.additionalRetirementIncome.setValue(data.additionalRetirementIncome);
        await this.retirementYears.setValue(data.retirementYears);
        if (data.inflationEnabled === 'Yes') {
            await this.inflationYes.click();
            await this.inflationRate.setValue(data.inflationRate);
        } else {
            await this.inflationNo.click();
        }
        await this.replacementRate.setValue(data.replacementRate);
        await this.preRetirementReturn.setValue(data.preRetirementReturn);
        await this.postRetirementReturn.setValue(data.postRetirementReturn);
        await this.saveDefaultValuesButton.click();
        await this.defaultValuesDialog.waitForDisplayed({ reverse: true });
    }

    async calculate(): Promise<void> {
        await this.calculateButton.click();
    }

    async waitForResults(): Promise<void> {
        await this.resultsHeading.waitForDisplayed();
    }
}

export default new RetirementCalculatorAcceptancePage();
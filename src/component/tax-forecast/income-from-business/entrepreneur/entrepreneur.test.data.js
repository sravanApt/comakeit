import deepFreeze from 'deep-freeze';

export const ENTREPRENEUR_FORM = 'tax-forecast-entrepreneur';

export const DOSSIER_DATA = deepFreeze({
  declarationID: '7f3c4fa9-fe84-46ad-8f8e-aacb0057364e',
  dossierManifest: {
    name: '2019_Provisional declaration_1.3',
    taxableYear: 2019,
    dossierId: 'b106308c-13be-4aef-8860-aacd008f0540',
    taxationFormID: 2,
    taxFormType: 'F-Form',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    taxLicenseNumber: null,
    version: '1.3',
    declarationType: 'Provisional declaration',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Robert',
      initials: null,
      middleName: 's',
      lastName: 'Ruther',
      bsn: 'string',
      birthDate: '2019-08-29T07:59:22.771',
      deathDate: '2019-08-29T07:59:22.771',
      livingTogetherPreciseSituation: 2,
      maritalStatus: 2,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'Thijs',
      initials: null,
      middleName: 'lk',
      lastName: 'c',
      bsn: '32131231-1',
      birthDate: '2019-08-29T13:29:26.4106301',
      deathDate: '',
      livingTogetherPreciseSituation: 2,
      maritalStatus: 2,
      age: 0,
      fullName: 'Thijs lk c',
    },
    relationShipSituation: {
      patnerDeathDate: null,
      divorceDate: '2019-09-10T06:30:00Z',
      periodOfLivingTogether: {
        startDate: '2019-09-01T06:30:00Z',
        endDate: '2019-09-16T06:30:00Z',
      },
      isFiscalPartnerCriteriaMet: true,
      marriageDate: '2019-08-01T06:30:00Z',
      applyFiscalPartnerForWholeYear: true,
    },
    children: [
      {
        name: 'Roger ca Will',
        dateOfBirth: '2019-08-29T13:29:26.4113587',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131231-1',
        registrationOnAddress: 2,
        isCoParenting: null,
        isAtleastThreeDaysPerWeekLiving: null,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: null,
        age: 0,
        parentCollectingChildCare: '32131231-1',
      },
      {
        name: 'Federer ca KJako',
        dateOfBirth: '2019-08-29T13:29:28.3456106',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131231-1',
        registrationOnAddress: 3,
        isCoParenting: true,
        isAtleastThreeDaysPerWeekLiving: false,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: true,
        age: 0,
        parentCollectingChildCare: '32131231-1',
      },
      {
        name: 'child1 string string',
        dateOfBirth: '2000-09-12T05:35:40.358',
        dateOfDeath: '2019-09-12T05:35:40.358',
        bsn: 'string',
        registrationOnAddress: 1,
        isCoParenting: null,
        isAtleastThreeDaysPerWeekLiving: null,
        isParentCollectingChildCare: true,
        isSignificantSupportExtended: null,
        age: 19,
        parentCollectingChildCare: 'string',
      },
    ],
  },
  income: {
    taxableSubjectIncome: {
      taxableWages: {
        currentEmploymentIncome: [
          {
            salary: {
              description: 'test',
              amount: 0,
            },
            withHeldWageTax: 0,
            employmentDiscount: 0,
          },
        ],
        previousEmploymentIncome: [
          {
            salary: {
              description: 'test',
              amount: 0,
            },
            withHeldWageTax: 0,
          },
        ],
        taxableIncomeAbroad: [
          {
            salary: {
              description: 'test',
              amount: 0,
            },
            countryId: 1,
            isIncomeFromEmployment: true,
            subjectedToDutchTax: 0,
            withheldWagesTaxAbroad: 0,
            isMethodForAvoidingDoubleTaxation: true,
            isPaymentZVWYetToBeDone: true,
          },
        ],
        exemptedIncomeFromInternationalOrganization: [
          {
            salary: {
              description: 'test',
              amount: 0,
            },
            isCurrentEmpoyment: true,
            nationalInsuranceContribution: 0,
            isPaymentZVWYetToBeDone: true,
          },
        ],
        dubbelePositie: true,
      },
      gainCostFromOtherActivities: {
        gainFromOtherActivities: [
          {
            costCategory: 0,
            description: 'test',
            amount: 0,
          },
        ],
        costOfOtherActivities: [
          {
            costCategory: 0,
            description: 'test',
            amount: 0,
          },
        ],
        gainFromAssetsToOwnCompany: [
          {
            costCategory: 0,
            description: 'test',
            amount: 0,
          },
        ],
        costFromAssetsToOwnCompany: [
          {
            costCategory: 0,
            description: 'test',
            amount: 0,
          },
        ],
        otherAssets: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
        tangibleProperty: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
        otherActivitiesLiabilities: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
      },
      incomeOutOfBenefits: {
        alimony: [
          {
            description: 'test',
            amount: 0,
          },
        ],
        costToAlimony: [
          {
            description: 'test',
            amount: 0,
          },
        ],
        incomeFromBenefits: [
          {
            description: 'test',
            amount: 0,
          },
        ],
        costToBenefits: [
          {
            description: 'test',
            amount: 0,
          },
        ],
        revisedInterest: 0,
      },
      refundedPremium: {
        refundedPremiumForOccupationalDisabilityInsurance: 0,
        refundedPremiumForAnuuity: 0,
      },
      refundedExpenses: {
        refundedAlimony: 0,
        refundedHealthCareCosts: 0,
        refundedStudyCost: 0,
        refundedMaintenanceCost: 0,
        refundedGiftsToCharity: 0,
        refundedWaivedVentureCapital: 0,
      },
      otherIncome: {
        incomeOutOfInterestBefore2001: 0,
        otherIncomeBefore2001: 0,
        incomeOutOfCapitalInsurance: 0,
      },
    },
    fiscalPartnerIncome: {
      taxableWages: {
        currentEmploymentIncome: [
          {
            salary: {
              description: 'test',
              amount: 1000,
            },
            withHeldWageTax: 0,
            employmentDiscount: 0,
          },
        ],
        previousEmploymentIncome: [
          {
            salary: {
              description: 'test',
              amount: 1000,
            },
            withHeldWageTax: 0,
          },
        ],
        taxableIncomeAbroad: [
          {
            salary: {
              description: 'test',
              amount: 1000,
            },
            countryId: 1,
            isIncomeFromEmployment: true,
            subjectedToDutchTax: 0,
            withheldWagesTaxAbroad: 0,
            isMethodForAvoidingDoubleTaxation: true,
            isPaymentZVWYetToBeDone: true,
          },
        ],
        exemptedIncomeFromInternationalOrganization: [
          {
            salary: {
              description: 'test',
              amount: 1000,
            },
            isCurrentEmpoyment: true,
            nationalInsuranceContribution: 0,
            isPaymentZVWYetToBeDone: true,
          },
        ],
        dubbelePositie: true,
      },
      gainCostFromOtherActivities: {
        gainFromOtherActivities: [
          {
            costCategory: 0,
            description: 'test',
            amount: 1000,
          },
        ],
        costOfOtherActivities: [
          {
            costCategory: 0,
            description: 'test',
            amount: 1000,
          },
        ],
        gainFromAssetsToOwnCompany: [
          {
            costCategory: 0,
            description: 'test',
            amount: 1000,
          },
        ],
        costFromAssetsToOwnCompany: [
          {
            costCategory: 0,
            description: 'test',
            amount: 1000,
          },
        ],
        otherAssets: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
        tangibleProperty: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
        otherActivitiesLiabilities: [
          {
            description: 'test',
            openingValue: 0,
            closingValue: 0,
            purchaseValue: 0,
            residualValue: 0,
            nominalValue: 0,
          },
        ],
      },
      incomeOutOfBenefits: {
        alimony: [
          {
            description: 'test',
            amount: 1000,
          },
        ],
        costToAlimony: [
          {
            description: 'test',
            amount: 1000,
          },
        ],
        incomeFromBenefits: [
          {
            description: 'test',
            amount: 1000,
          },
        ],
        costToBenefits: [
          {
            description: 'test',
            amount: 1000,
          },
        ],
        revisedInterest: 0,
      },
      refundedPremium: {
        refundedPremiumForOccupationalDisabilityInsurance: 0,
        refundedPremiumForAnuuity: 0,
      },
      refundedExpenses: {
        refundedAlimony: 0,
        refundedHealthCareCosts: 0,
        refundedStudyCost: 0,
        refundedMaintenanceCost: 0,
        refundedGiftsToCharity: 0,
        refundedWaivedVentureCapital: 0,
      },
      otherIncome: {
        incomeOutOfInterestBefore2001: 0,
        otherIncomeBefore2001: 0,
        incomeOutOfCapitalInsurance: 0,
      },
    },
  },
  businessDetails: {
    taxableSubjectBusinessDetails: [
      {
        globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
        businessName: 'Farming',
        businessActivities: 'Farming',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-25',
        businessFormId: 1,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
      },
      {
        globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
        businessName: 'Pharma',
        businessActivities: 'Farminf',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-215',
        businessFormId: 2,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
      },
      {
        globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97d',
        businessName: 'Pharma2',
        businessActivities: 'Farminf',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-215',
        businessFormId: 3,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
      },
    ],
    fiscalPartnerBusinessDetails: null,
  },
  profitAndLossDetails: null,
  balanceSheetDetails: null,
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 'string',
      },
      {
        displayName: 'Thijs lk c',
        value: '32131231-1',
      },
      {
        displayName: 'other',
        value: '0',
      },
    ],
  },
  entrepreneurDetails: {
    taxableSubjectEntrepreneurDetails: {
      entrepreneurialDeductions: {
        entitledToSelfEmployedDeduction: { previousYearAmount: false, currentYearAmount: true },
        entitledToStartUpDeduction: { previousYearAmount: true, currentYearAmount: true },
        entitledToStartUpDeductionWithDisablity: { previousYearAmount: true, currentYearAmount: true },
        numberOfTimesStartUpDeductionApplied: { previousYearAmount: 1, currentYearAmount: 0 },
        entitledToResearchAndDevelopmentDeduction: { previousYearAmount: true, currentYearAmount: false },
        entitledToIncreaseResearchAndDevelopmentDeduction: { previousYearAmount: false, currentYearAmount: true },
        researchAndDevelopmentStatementNumber: { previousYearAmount: 1, currentYearAmount: 0 },
        numberOfHoursWorkedByAssistingPartner: { previousYearAmount: 1, currentYearAmount: 0 },
        entitledToCessationDeduction: { previousYearAmount: true, currentYearAmount: true },
        previouslyUsedCessationDeduction: { previousYearAmount: 2000, currentYearAmount: 1000 },
      },
      remainderSelfEmployedDeductions: [{
        description: '2018', opening: 1000, applied: 1500, closing: 1500,
      }, {
        description: '2017', opening: 2000, applied: 1500, closing: 1500,
      }],
      fiscalPensionReserve: {
        isAllocateTo: { previousYearAmount: true, currentYearAmount: false, amount: 8000 },
        paidAnnuityPremium: { previousYearAmount: 3000, currentYearAmount: 1500 },
        pensionReserveDetails: [{
          description: 'Pharma', opening: 2000, allocation: 0, release: 1000, closing: 2500,
        }, {
          description: 'Pharma2', opening: 112000, allocation: 0, release: 1000, closing: 2500,
        }],
        allocatedPension: 0,
      },
    },
    fiscalPartnerEntrepreneurDetails: {
      entrepreneurialDeductions: {
        entitledToSelfEmployedDeduction: { previousYearAmount: true, currentYearAmount: true },
        entitledToStartUpDeduction: { previousYearAmount: true, currentYearAmount: true },
        entitledToStartUpDeductionWithDisablity: { previousYearAmount: true, currentYearAmount: true },
        numberOfTimesStartUpDeductionApplied: { previousYearAmount: 1, currentYearAmount: 0 },
        entitledToResearchAndDevelopmentDeduction: { previousYearAmount: true, currentYearAmount: false },
        entitledToIncreaseResearchAndDevelopmentDeduction: { previousYearAmount: false, currentYearAmount: true },
        researchAndDevelopmentStatementNumber: { previousYearAmount: 1, currentYearAmount: 0 },
        numberOfHoursWorkedByAssistingPartner: { previousYearAmount: 1, currentYearAmount: 0 },
        entitledToCessationDeduction: { previousYearAmount: true, currentYearAmount: true },
        previouslyUsedCessationDeduction: { previousYearAmount: 2000, currentYearAmount: 1000 },
      },
      remainderSelfEmployedDeductions: [{
        description: '2018', opening: 1000, applied: 0, closing: 1500,
      }],
      fiscalPensionReserve: {
        isAllocateTo: { previousYearAmount: true, currentYearAmount: false, amount: 8000 },
        paidAnnuityPremium: { previousYearAmount: 3000, currentYearAmount: 1500 },
        pensionReserveDetails: [{
          description: 'Daisy', opening: 2000, allocation: 0, release: 0, closing: 2500,
        }],
        allocatedPension: 0,
      },
    },
  },
});

export const ENTREPRENEUR_DATA_WITH_EMPTY_PARTNER_DATA = deepFreeze({
  taxableSubjectEntrepreneurDetails: {
    entrepreneurialDeductions: {
      entitledToSelfEmployedDeduction: { previousYearAmount: false, currentYearAmount: true },
      entitledToStartUpDeduction: { previousYearAmount: true, currentYearAmount: true },
      entitledToStartUpDeductionWithDisablity: { previousYearAmount: true, currentYearAmount: true },
      numberOfTimesStartUpDeductionApplied: { previousYearAmount: 1, currentYearAmount: 0 },
      entitledToResearchAndDevelopmentDeduction: { previousYearAmount: true, currentYearAmount: false },
      entitledToIncreaseResearchAndDevelopmentDeduction: { previousYearAmount: false, currentYearAmount: true },
      researchAndDevelopmentStatementNumber: { previousYearAmount: 1, currentYearAmount: 0 },
      numberOfHoursWorkedByAssistingPartner: { previousYearAmount: 1, currentYearAmount: 0 },
      entitledToCessationDeduction: { previousYearAmount: true, currentYearAmount: true },
      previouslyUsedCessationDeduction: { previousYearAmount: 2000, currentYearAmount: 1000 },
    },
    remainderSelfEmployedDeductions: null,
    fiscalPensionReserve: {
      isAllocateTo: { previousYearAmount: true, currentYearAmount: false, amount: 8000 },
      paidAnnuityPremium: { previousYearAmount: 3000, currentYearAmount: 1500 },
      allocatedPension: 0,
    },
  },
  fiscalPartnerEntrepreneurDetails: null,
});

export const MOCK_ENTERPRENEURIAL_DEDUCTIONS = deepFreeze({
  entrepreneurialDeductions: {
    entitledToSelfEmployedDeduction: { previousYearAmount: false, currentYearAmount: true },
    entitledToStartUpDeduction: { previousYearAmount: true, currentYearAmount: true },
    entitledToStartUpDeductionWithDisablity: { previousYearAmount: true, currentYearAmount: true },
    numberOfTimesStartUpDeductionApplied: { previousYearAmount: 1, currentYearAmount: 0 },
    entitledToResearchAndDevelopmentDeduction: { previousYearAmount: true, currentYearAmount: false },
    entitledToIncreaseResearchAndDevelopmentDeduction: { previousYearAmount: false, currentYearAmount: true },
    researchAndDevelopmentStatementNumber: { previousYearAmount: 1, currentYearAmount: 0 },
    numberOfHoursWorkedByAssistingPartner: { previousYearAmount: 1, currentYearAmount: 0 },
    entitledToCessationDeduction: { previousYearAmount: true, currentYearAmount: true },
    previouslyUsedCessationDeduction: { previousYearAmount: 2000, currentYearAmount: 1000 },
  },
});

export const MOCK_REMAINDER_SELF_DEDUCTIONS = deepFreeze({
  remainderSelfEmployedDeductions: [{
    description: '2018', opening: 1000, applied: 0, closing: 1500,
  }],
});

export const MOCK_FISCAL_PENSION_RESERVE = deepFreeze({
  fiscalPensionReserve: {
    isAllocateTo: { previousYearAmount: true, currentYearAmount: false, amount: 8000 },
    paidAnnuityPremium: { previousYearAmount: 3000, currentYearAmount: 1500 },
    allocatedPension: 0,
  },
});

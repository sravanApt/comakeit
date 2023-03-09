import deepFreeze from 'deep-freeze';

export const INCOME_DATA = deepFreeze({
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
            exploitedGeneralCompensationScheme: false,
            usedSpecialCompensationScheme: false,
            compensationSchemeGermany: false,
            changeOfEmployer: false,
            inBelgiumOrGermanyWithheldTax: 0,
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
        refundedPremiumForOccupationalDisabilityInsurance: 110,
        refundedPremiumForAnuuity: 999,
      },
      refundedExpenses: {
        refundedAlimony: 999,
        refundedHealthCareCosts: 0,
        refundedStudyCost: 0,
        refundedMaintenanceCost: 0,
        refundedGiftsToCharity: 0,
        refundedWaivedVentureCapital: 0,
      },
      otherIncome: {
        incomeOutOfInterestBefore2001: 300,
        otherIncomeBefore2001: 0,
        incomeOutOfCapitalInsurance: 800,
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
            exploitedGeneralCompensationScheme: false,
            usedSpecialCompensationScheme: false,
            compensationSchemeGermany: false,
            changeOfEmployer: false,
            inBelgiumOrGermanyWithheldTax: 0,
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
        refundedPremiumForOccupationalDisabilityInsurance: 2000,
        refundedPremiumForAnuuity: 0,
      },
      refundedExpenses: {
        refundedAlimony: 999,
        refundedHealthCareCosts: 0,
        refundedStudyCost: 200,
        refundedMaintenanceCost: 0,
        refundedGiftsToCharity: 0,
        refundedWaivedVentureCapital: 0,
      },
      otherIncome: {
        incomeOutOfInterestBefore2001: 99,
        otherIncomeBefore2001: 200,
        incomeOutOfCapitalInsurance: 0,
      },
    },
  },
  businessDetails: {
    taxableSubjectBusinessDetails: null,
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
});

export const INCOME_DATA_WITH_NULL = deepFreeze(
  {
    taxableSubjectIncome: {
      taxableWages: {
        currentEmploymentIncome: null,
        previousEmploymentIncome: null,
        taxableIncomeAbroad: null,
        exemptedIncomeFromInternationalOrganization: null,
        dubbelePositie: true,
      },
      gainCostFromOtherActivities: null,
      incomeOutOfBenefits: null,
      refundedPremium: null,
      refundedExpenses: null,
      otherIncome: null,
    },
    fiscalPartnerIncome: {
      taxableWages: {
        currentEmploymentIncome: null,
        previousEmploymentIncome: null,
        taxableIncomeAbroad: null,
        exemptedIncomeFromInternationalOrganization: null,
        dubbelePositie: true,
      },
      gainCostFromOtherActivities: {
        gainFromOtherActivities: null,
        costOfOtherActivities: null,
        gainFromAssetsToOwnCompany: null,
        costFromAssetsToOwnCompany: null,
        otherAssets: null,
        tangibleProperty: null,
        otherActivitiesLiabilities: null,
      },
      incomeOutOfBenefits: {
        alimony: null,
        costToAlimony: null,
        incomeFromBenefits: null,
        costToBenefits: null,
        revisedInterest: 0,
      },
      refundedPremium: null,
      refundedExpenses: null,
      otherIncome: null,
    },
  },
);

export const PREVIOUS_EMPLOYMENT_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    taxableWages: {
      ...INCOME_DATA_WITH_NULL.taxableSubjectIncome.taxableWages,
      previousEmploymentIncome: [
        {
          salary: {
            description: 'test',
            amount: 0,
          },
          withHeldWageTax: 0,
        },
      ],
    },
  },
});

export const CURRENT_EMPLOYMENT_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    taxableWages: {
      ...INCOME_DATA_WITH_NULL.taxableSubjectIncome.taxableWages,
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
    },
  },
});

export const EMPTY_ABROAD_INCOME_DATA = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    taxableWages: {
      ...INCOME_DATA_WITH_NULL.taxableSubjectIncome.taxableWages,
      taxableIncomeAbroad: null,
    },
  },
});

export const ABROAD_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    taxableWages: {
      ...INCOME_DATA_WITH_NULL.taxableSubjectIncome.taxableWages,
      taxableIncomeAbroad: [
        {
          salary: {
            description: 'test',
            amount: 120,
          },
          countryId: 2,
          isIncomeFromEmployment: true,
          subjectedToDutchTax: 0,
          withheldWagesTaxAbroad: 0,
          isMethodForAvoidingDoubleTaxation: true,
          isPaymentZVWYetToBeDone: true,
          exploitedGeneralCompensationScheme: false,
          usedSpecialCompensationScheme: false,
          compensationSchemeGermany: false,
          changeOfEmployer: false,
          inBelgiumOrGermanyWithheldTax: 0,
        },
      ],
    },
  },
});

export const EXEMPTED_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    taxableWages: {
      ...INCOME_DATA_WITH_NULL.taxableSubjectIncome.taxableWages,
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
    },
  },
});

export const GAIN_OR_COST_OTHER_ACTIVITIES_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
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
    },
  },
});

export const GAIN_COST_ASSETS_OWN_COMPANY_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    gainCostFromOtherActivities: {
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
    },
  },
});

export const ASSETS_LIABILITIES_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    gainCostFromOtherActivities: {
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
  },
});

export const INCOME_COST_BENEFITS = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    incomeOutOfBenefits: {
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
    },
  },
});

export const ALIMONY_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
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
    },
  },
});

export const OTHER_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    otherIncome: {
      incomeOutOfInterestBefore2001: 300,
      otherIncomeBefore2001: 0,
      incomeOutOfCapitalInsurance: 800,
    },
  },
});

export const REFUND_INCOME = deepFreeze({
  ...INCOME_DATA_WITH_NULL,
  taxableSubjectIncome: {
    ...INCOME_DATA_WITH_NULL.taxableSubjectIncome,
    refundedExpenses: {
      refundedAlimony: 999,
      refundedHealthCareCosts: 0,
      refundedStudyCost: 200,
      refundedMaintenanceCost: 0,
      refundedGiftsToCharity: 0,
      refundedWaivedVentureCapital: 0,
    },
  },
});

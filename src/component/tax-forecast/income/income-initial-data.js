const DEFAULT_INCOME_DATA = {
  taxableWages: {
    currentEmploymentIncome: [
      {
        salary: {
          description: '',
          amount: 0,
        },
        withHeldWageTax: 0,
        employmentDiscount: 0,
      },
    ],
    previousEmploymentIncome: [
      {
        salary: {
          description: '',
          amount: 0,
        },
        withHeldWageTax: 0,
      },
    ],
    taxableIncomeAbroad: [],
    exemptedIncomeFromInternationalOrganization: [
      {
        salary: {
          description: '',
          amount: 0,
        },
        isCurrentEmpoyment: null,
        nationalInsuranceContribution: 0,
        isPaymentZVWYetToBeDone: null,
      },
    ],
  },
  gainCostFromOtherActivities: {
    gainFromOtherActivities: [
      {
        description: '',
        amount: 0,
      },
    ],
    costOfOtherActivities: [
      {
        description: '',
        amount: 0,
      },
    ],
    gainFromAssetsToOwnCompany: [
      {
        description: '',
        amount: 0,
      },
    ],
    costFromAssetsToOwnCompany: [
      {
        description: '',
        amount: 0,
      },
    ],
    otherAssets: [
      {
        description: '',
        openingValue: 0,
        closingValue: 0,
      },
    ],
    tangibleProperty: [
      {
        description: '',
        openingValue: 0,
        closingValue: 0,
      },
    ],
    otherActivitiesLiabilities: [
      {
        description: '',
        openingValue: 0,
        closingValue: 0,
      },
    ],
  },
  incomeOutOfBenefits: {
    alimony: [
      {
        description: '',
        amount: 0,
      },
    ],
    costToAlimony: [
      {
        description: '',
        amount: 0,
      },
    ],
    incomeFromBenefits: [
      {
        description: '',
        amount: 0,
      },
    ],
    costToBenefits: [
      {
        description: '',
        amount: 0,
      },
    ],
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
};

export const INITIAL_INCOME_DATA = {
  income: {
    taxableSubjectIncome: { ...DEFAULT_INCOME_DATA },
    fiscalPartnerIncome: { ...DEFAULT_INCOME_DATA },
  },
};

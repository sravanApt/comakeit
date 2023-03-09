const DEFAULT_ENTERPRENEUR_DATA = {
  entrepreneurialDeductions: {
    entitledToSelfEmployedDeduction: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    entitledToStartUpDeduction: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    entitledToStartUpDeductionWithDisablity: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    numberOfTimesStartUpDeductionApplied: {
      previousYearAmount: null,
      currentYearAmount: null,
    },
    entitledToResearchAndDevelopmentDeduction: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    entitledToIncreaseResearchAndDevelopmentDeduction: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    researchAndDevelopmentStatementNumber: {
      previousYearAmount: null,
      currentYearAmount: null,
    },
    numberOfHoursWorkedByAssistingPartner: {
      previousYearAmount: null,
      currentYearAmount: null,
    },
    entitledToCessationDeduction: {
      previousYearAmount: false,
      currentYearAmount: false,
    },
    previouslyUsedCessationDeduction: {
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
  },
  remainderSelfEmployedDeductions: [
    {
      applied: null,
      description: '',
      opening: null,
      closing: null,
    },
  ],
  fiscalPensionReserve: {
    isAllocateTo: {
      previousYearAmount: null,
      currentYearAmount: null,
    },
    allocatedPension: 0,
    paidAnnuityPremium: {
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    pensionReserveDetails: [
      {
        allocation: null,
        release: null,
        description: '',
        opening: null,
        closing: null,
      },
    ],
  },
};

export const INITIAL_ENTREPRENEUR_DATA = {
  entrepreneurDetails: {
    taxableSubjectEntrepreneurDetails: { ...DEFAULT_ENTERPRENEUR_DATA },
    fiscalPartnerEntrepreneurDetails: { ...DEFAULT_ENTERPRENEUR_DATA },
  },
};

export const ENTREPRENEUR_DEDUCTIONS = {
  entitledToSelfEmployedDeduction: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  entitledToStartUpDeduction: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  entitledToStartUpDeductionWithDisablity: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  numberOfTimesStartUpDeductionApplied: {
    previousYearAmount: null,
    currentYearAmount: '1',
  },
  entitledToResearchAndDevelopmentDeduction: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  entitledToIncreaseResearchAndDevelopmentDeduction: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  researchAndDevelopmentStatementNumber: {
    previousYearAmount: null,
    currentYearAmount: null,
  },
  numberOfHoursWorkedByAssistingPartner: {
    previousYearAmount: null,
    currentYearAmount: null,
  },
  entitledToCessationDeduction: {
    previousYearAmount: false,
    currentYearAmount: false,
  },
  previouslyUsedCessationDeduction: {
    previousYearAmount: 0,
    currentYearAmount: 0,
  },
};

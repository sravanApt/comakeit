import deepFreeze from 'deep-freeze';

export const FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS = deepFreeze({
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
    ],
  },
  income: {
    taxableSubjectIncome: null,
    fiscalPartnerIncome: null,
  },
  businessDetails: {
    taxableSubjectBusinessDetails: null,
    fiscalPartnerBusinessDetails: null,
  },
  profitAndLossDetails: null,
  balanceSheetDetails: null,
  additionalCalculationDetails: null,
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

const DESCRIPTION_AMOUNT_OBJECT = deepFreeze({
  description: 'test',
  amount: 1000,
});

const PREVIOUS_CURRENT_YEAR_AMOUNTS = deepFreeze({
  previousYearAmount: null,
  currentYearAmount: 1200,
});

const START_AND_END_DATES = deepFreeze({
  startDate: '2019-01-01T09:53:58.532Z',
  endDate: '2019-10-02T09:53:58.532Z',
});

export const INITIAL_ADDITIONAL_CALCULATION_DATA = deepFreeze({
  residualPersonalDeductionsOfLastYear: DESCRIPTION_AMOUNT_OBJECT,
  revisionInterest: DESCRIPTION_AMOUNT_OBJECT,
  taxCredit: {
    incomeOutOfLaborForFiscalPartner: 0,
    dateOfBirthOfFiscalPartner: '2020-09-07T09:53:58.532Z',
    entitledToIncome: true,
    entitledToTaxCredit: true,
    areLeavesUsed: true,
    numberOfLeavesApplied: 0,
  },
  withholdingTax: {
    payrollTaxesOnWagesThatArePartOfIncomeOutOfBusiness: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    wageAsPartOfIncomeFromBusiness: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    provisionalIncomeTaxAssessment: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    provisionalRemittanceHealthInsuranceLaw: PREVIOUS_CURRENT_YEAR_AMOUNTS,
  },
  premiumObligation: {
    periodNotInsuredForBasePensionAndGeneralSurviersLaw: START_AND_END_DATES,
    periodNotInsuredForHealthcareLaw: START_AND_END_DATES,
  },
  lossesYetToSettleBoxOne: DESCRIPTION_AMOUNT_OBJECT,
  lossesYetToSettleBoxTwo: DESCRIPTION_AMOUNT_OBJECT,
});

export const ADDITIONAL_CALCULATION_EMPTY_DATA = deepFreeze({
  residualPersonalDeductionsOfLastYear: DESCRIPTION_AMOUNT_OBJECT,
  revisionInterest: DESCRIPTION_AMOUNT_OBJECT,
  taxCredit: {
    incomeOutOfLaborForFiscalPartner: 0,
    dateOfBirthOfFiscalPartner: '',
    entitledToIncome: null,
    entitledToTaxCredit: null,
    areLeavesUsed: null,
    numberOfLeavesApplied: 0,
  },
  withholdingTax: {
    payrollTaxesOnWagesThatArePartOfIncomeOutOfBusiness: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    wageAsPartOfIncomeFromBusiness: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    provisionalIncomeTaxAssessment: PREVIOUS_CURRENT_YEAR_AMOUNTS,
    provisionalRemittanceHealthInsuranceLaw: PREVIOUS_CURRENT_YEAR_AMOUNTS,
  },
  premiumObligation: {
    periodNotInsuredForBasePensionAndGeneralSurviersLaw: START_AND_END_DATES,
    periodNotInsuredForHealthcareLaw: START_AND_END_DATES,
  },
  lossesYetToSettleBoxOne: DESCRIPTION_AMOUNT_OBJECT,
  lossesYetToSettleBoxTwo: DESCRIPTION_AMOUNT_OBJECT,
});

export const FISCAL_DATA_EMPTY_ADDITIONAL_DETAILS = deepFreeze({
  ...FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS,
  additionalCalculationDetails: {
    taxableSubjectAdditionalCalculations: { ...ADDITIONAL_CALCULATION_EMPTY_DATA },
    fiscalPartnerAdditionalCalculations: { ...ADDITIONAL_CALCULATION_EMPTY_DATA },
  },
});

export const FISCAL_DATA = deepFreeze({
  ...FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS,
  additionalCalculationDetails: {
    taxableSubjectAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
    fiscalPartnerAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
  },
});

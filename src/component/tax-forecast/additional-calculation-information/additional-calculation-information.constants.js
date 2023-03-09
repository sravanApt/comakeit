import deepFreeze from 'deep-freeze';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';

export const dateProps = {
  type: 'date',
  className: 'text-input',
  placeholder: translate('date'),
  showSelectOptions: true,
  width: '130px',
  withPortal: true,
  isDateReadOnly: true,
  showClearDate: true,
};

export const checkBoxProps = {
  type: 'boolean',
  controlType: 'checkbox',
  className: 'entrepreneur-checkbox check-box-left-paddig',
  width: '30px',
};

export const SECTION_KEY = 'additionalCalculationDetails';

export const SUBJECT_AND_FISCAL_PARTNER_KEYS = deepFreeze([
  'taxableSubjectAdditionalCalculations',
  'fiscalPartnerAdditionalCalculations',
]);

export const INNER_SECTIONS_KEYS = deepFreeze([
  'withholdingTax',
  'taxCredit',
  'lossesYetToSettleBoxOne',
  'residualPersonalDeductionsOfLastYear',
  'lossesYetToSettleBoxTwo',
  'premiumObligation',
  'revisionInterest',
]);

export const SECTIONS_TO_DISPLAY_KEYS = deepFreeze(['taxableSubjectSections', 'fiscalPartnerSections']);

export const SECTION_LIST = deepFreeze([
  { label: translate('withholdings-label'), value: 0 },
  { label: translate('tax-credit-label'), value: 1 },
  { label: translate('losses-yet-to-settle-box-1-label'), value: 2 },
  { label: translate('residual-personal-deductions-label'), value: 3, isJointSection: true },
  { label: translate('losses-yet-to-settle-box-2-label'), value: 4 },
  { label: translate('premium-obligation-label'), value: 5 },
  { label: translate('revision-interest-label'), value: 6 },
]);

const DESCRIPTION_AMOUNT_OBJECT = deepFreeze({
  description: '',
  amount: null,
});

const PREVIOUS_CURRENT_YEAR_AMOUNTS = deepFreeze({
  previousYearAmount: null,
  currentYearAmount: null,
});

const START_AND_END_DATES = deepFreeze({
  startDate: '',
  endDate: '',
});

export const INITIAL_ADDITIONAL_CALCULATION_DATA = deepFreeze({
  residualPersonalDeductionsOfLastYear: DESCRIPTION_AMOUNT_OBJECT,
  revisionInterest: DESCRIPTION_AMOUNT_OBJECT,
  taxCredit: {
    incomeOutOfLaborForFiscalPartner: null,
    dateOfBirthOfFiscalPartner: '',
    entitledToIncome: null,
    entitledToTaxCredit: null,
    areLeavesUsed: null,
    numberOfLeavesApplied: null,
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

export const INITIAL_DATA = deepFreeze({
  additionalCalculationDetails: {
    taxableSubjectAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
    fiscalPartnerAdditionalCalculations: { ...INITIAL_ADDITIONAL_CALCULATION_DATA },
  },
});

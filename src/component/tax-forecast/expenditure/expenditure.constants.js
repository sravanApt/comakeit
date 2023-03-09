import deepFreeze from 'deep-freeze';
import { expenditureTranslate as translate } from './expenditure-translate';

export const EXPENDITURE_KEY_TYPE_ARRAY = [
  'taxableSubjectExpenditureDetails',
  'fiscalPartnerExpendituresDetails',
  'jointExpendituresDetails',
];

export const EXPENDITURE_FIELD_NAME = 'expenditureDetails';
export const SECTION_KEYS = ['taxableSubjectSections', 'fiscalPartnerSections'];

export const SECTION_LIST = deepFreeze([
  { label: translate('expenses-for-public-transportation'), value: 0, reportIndex: 0 },
  { label: translate('premium-for-annuity'), value: 1, reportIndex: 1 },
  { label: translate('premium-for-disability-insurance'), value: 2 },
  { label: translate('premium-for-general-survivors-law'), value: 3 },
  { label: translate('premium-for-annuity-of-child'), value: 4 },
  { label: translate('alimony-paid'), value: 6, isJointSection: true },
  {
    label: translate('paid-gifts'), value: 7, isJointSection: true, reportIndex: 2,
  },
  {
    label: translate('expenses-for-healthcare'), value: 8, isJointSection: true, reportIndex: 3,
  },
  { label: translate('educational-expenses'), value: 5, reportIndex: 4 },
  {
    label: translate('weekend-expenses-for-children-with-disabilities'), value: 9, isJointSection: true, reportIndex: 5,
  },
  /** Will be enabled after pilot */
  // { label: translate('waived-venture-capital'), value: 10, isJointSection: true },
]);

export const EXPENDITURE_SECTION_KEYS_ARRAY = deepFreeze([
  ['expensesForPublicTransportation', ['travelDeliveryDetails', 'totalDeductionForExpenses']],
  ['premiumForAnnuity', ['premiumsPaidDetails', 'annualAndReserveMarginDetails', 'totalDeductionForAnnuity']],
  ['premiumForDisabilityInsurance', ['premiumDetails']],
  ['premiumForGeneralSurvivorsLaw', ['premiumDetails']],
  ['premiumForAnnuityOfChild', ['premiumDetails']],
  /** expensesForEducationWithStudyGrant will be added after pilot */
  // ['educationalExpenses', ['expensesForEducationWithoutStudyGrant', 'expensesForEducationWithStudyGrant', 'studyGrantRepaid']],
  ['educationalExpenses', ['expensesForEducationWithoutStudyGrant', 'studyGrantRepaid', 'totalDeductionForEducationalExpenses', 'treshold']],
]);

export const JOINT_SECTION_KEYS_ARRAY = deepFreeze([
  ['alimony', []],
  ['giftsToCharity', ['generalGiftsToCharity', 'periodicGiftsToCharity', 'totalDeductionForGiftsToCharity', 'threshold']],
  [
    'expensesForHealthcare',
    ['treatment', 'prescribedMedication', 'aids', 'additionalFamilySupport', 'prescribedDiet', 'travelExpensesForHealthcare', 'travelExpensesForHosipitalVisitOfFamilyMember', 'extraExpensesForClothesAndLinen', 'totalDeductionForHealthcare', 'threshold']],
  ['weekendExpensesForChildrenWithDisabilities', ['weekendExpensesOfDisabledChildrens', 'totalDeductionForChildrenWithDisabilities']],
  /** Will be enabled after pilot */
  // ['waivedVentureCapital', ['waivedVentureCapitalDetails', 'totalDeductionForWaivedVentureCapital']],
]);

export const THRESHOLD_REPORT_TYPE = deepFreeze({
  EDUCATIONAL_EXPENSES: 'EducationalExpense',
  EXPENSES_FOR_HEALTHCARE: 'ExpenseForHealthcare',
  GIFTS_TO_CHARITY: 'GiftsToCharity',
});

export const RESERVE_MARGIN_YEARS = 8;

export const EDUCATIONAL_START_YEAR = 2014;
export const EDUCATIONAL_END_YEAR = 2002;

export const REPORT_REMOVAL_KEYS = [
  {
    reportValues: { totalDeductionForExpenses: 0 },
    thresholdValues: {},
  },
  {
    reportValues: { totalDeductionForAnnuity: 0 },
    thresholdValues: {},
  },
  {
    reportValues: { totalDeductionForGiftsToCharity: 0 },
    thresholdValues: { giftsToCharity: null },
  },
  {
    reportValues: {
      totalDeductionForHealthcare: 0,
      reportAmount: 0,
      totalExpensesPrescribedDiet: 0,
      totalExpensesForHealthcare: 0,
      totalTravelExpensesOfHospitalVisitOfFamilyMember: 0,
      totalExpensesForClothesAndLineen: 0,
    },
    thresholdValues: { expensesForHealthcare: null },
  },
  {
    reportValues: { totalDeductionForEducationalExpenses: 0 },
    thresholdValues: { educationalExpenses: null },
  },
  {
    reportValues: { totalDeductionForChildrenWithDisabilities: 0 },
    thresholdValues: {},
  },
];

export const REPORT_KEYS = [
  'totalDeductionForExpenses',
  'totalDeductionForAnnuity',
  'totalDeductionForEducationalExpenses',
  'totalDeductionForGiftsToCharity',
  'totalDeductionForHealthcare',
  'totalDeductionForChildrenWithDisabilities',
];

export const HEALTH_REPORT_KEYS = [
  'reportAmount',
  'totalExpensesPrescribedDiet',
  'totalExpensesForHealthcare',
  'totalTravelExpensesOfHospitalVisitOfFamilyMember',
  'totalExpensesForClothesAndLineen',
];

export const STARTING_HEALTH_REPORT_SECTION_INDEX = 3;

export const HEALTHCARE_SECTION_KEY = 'expensesForHealthcare';
export const EDUCATIONAL_SECTION_KEY = 'educationalExpenses';
export const ALIMONY_KEY = 'alimony';
export const STUDY_GRANT_KEY = 'expensesForEducationWithoutStudyGrant';

import deepFreeze from 'deep-freeze';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

export const ENTREPRENEUR_KEYS_ARRAY = ['taxableSubjectEntrepreneurDetails', 'fiscalPartnerEntrepreneurDetails'];
export const BUSINESS_DETAILS_KEYS_ARRAY = ['taxableSubjectBusinessDetails', 'fiscalPartnerBusinessDetails'];
export const SECTION_KEYS = ['taxableSubjectSections', 'fiscalPartnerSections'];

export const ENTREPRENEUR_SECTIONAL_KEYS_LIST = ['entrepreneurialDeductions', 'remainderSelfEmployedDeductions', 'fiscalPensionReserve'];

export const SELF_DEDUCTION_YEARS_TO_DISPLAY = 9;

export const ENTREPRENEUR_KEY = 'entrepreneurDetails';

export const SECTION_LIST = deepFreeze([
  { label: translate('entrepreneurial-deductions'), value: 0 },
  { label: translate('remainder-self-employed-deduction'), value: 1 },
  { label: translate('fiscal-pension-reserve'), value: 2 },
]);

export const SELECT_OPTIONS = deepFreeze([
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
]);

export const ENTREPRENEUR_DEDUCTIONS_CLEAR_SECTIONS = [
  'entitledToStartUpDeduction',
  'entitledToStartUpDeductionWithDisablity',
  'numberOfTimesStartUpDeductionApplied',
  'entitledToResearchAndDevelopmentDeduction',
  'entitledToIncreaseResearchAndDevelopmentDeduction',
  'researchAndDevelopmentStatementNumber',
  'numberOfHoursWorkedByAssistingPartner',
];

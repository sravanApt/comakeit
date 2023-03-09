import deepFreeze from 'deep-freeze';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import {
  getHundredYearsBackDateObjectWithYearAndMonth, getEndDateObjectWithYearAndMonth,
} from '../../../common/utils';

export const SECTION_LIST = deepFreeze([
  { label: translate('loans-for-own-home'), value: 0 },
  { label: translate('residual-loan-for-own-home'), value: 1 },
  { label: translate('other-loans'), value: 2 },
]);

export const LOAN_GIVER_DETAILS_EMPTY_OBJECT = {
  startDate: null,
  endDate: null,
  originalPrincipalAmount: null,
  interestRate: null,
  payBackMethod: null,
  bsn: null,
  firstName: null,
  middleName: null,
  lastName: null,
  initials: null,
  address: {
    street: null,
    houseNumber: null,
    additionToHouseNumber: null,
    zipCode: null,
    city: null,
    countryId: 1,
  },
};

export const LOAN_FOR_OWN_HOMES_EMPTY_OBJECT = {
  loansForOwnHome: {
    loanDetails: {
      description: '',
      belongsTo: null,
      accountNumber: '',
      countryId: 1,
      loanGiver: null,
      loanPurpose: '',
      percentageOfAmount: '',
      principalAmount: '',
      interest: '',
      employeeCredit: '',
    },
    costs: [
      {
        description: '',
        amount: 0,
      },
    ],
    loanGiverDetails: null,
  },
  residualLoans: {
    loanDetails: {
      description: '',
      belongsTo: null,
      accountNumber: '',
      countryId: 1,
      loanPurpose: '',
      principalAmount: '',
      percentageOfAmount: '',
      interest: '',
      employeeCredit: '',
    },
    costs: [
      {
        description: '',
        amount: 0,
      },
    ],
  },
  otherLoans: [],
};

export const LOAN_GIVER_OPTIONS_VALUES = deepFreeze({
  BANK: 1,
  PENSIONFUNDS: 2,
  INSURRANCE_COMPANY: 3,
  NON_ADMINISTRATIVE_SUBJECT: 4,
});

export const LIABILITIES_KEY = 'liabilitiesScreen';

export const LIABILITIES_SECTIONAL_KEYS_LIST = deepFreeze([
  'loansForOwnHome',
  'residualLoans',
  'otherLoans',
]);

export const LIABILITIES_SECTION_KEYS_ARR = deepFreeze({
  // Parent key, array with children keys
  loansForOwnHome: ['loanDetails', 'costs', 'loanGiverDetails'],
  residualLoans: ['loanDetails', 'costs'],
  otherLoans: [],
});

export const LIABILITIES_FIELD_NAME = 'liabilitiesScreen';

export const dateProps = {
  type: 'date',
  className: 'text-input',
  placeholder: translate('date'),
  showSelectOptions: true,
  width: '102px',
  withPortal: true,
  isDateReadOnly: true,
  minDate: getHundredYearsBackDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
};

export const inputProps = {
  type: 'text', width: '102px', className: 'text-input', placeholder: '',
};

export const selectProps = {
  width: '140px',
  type: 'selectOne',
  controlType: 'autocomplete',
  menuPortalTarget: true,
  placeholder: translate('select'),
  hideSelectedOptions: false,
};

export const loanGiverOptions = [
  { label: translate('bank'), value: 1 },
  { label: translate('pensionfunds'), value: 2 },
  { label: translate('insurrance-company'), value: 3 },
  { label: translate('non-administrative-subject'), value: 4 },
];

export const purposeOptions = [
  { label: translate('house-netherlands'), value: 1 },
  { label: translate('home-abroad'), value: 2 },
  { label: translate('other'), value: 3 },
];

export const paybackMethodOptions = [
  { label: translate('annuitary'), value: 1 },
  { label: translate('linear'), value: 2 },
  { label: translate('other'), value: 3 },
];

export const INITIAL_JOINT_LIABILITIES = {
  loansForOwnHome: [],
  residualLoans: [],
  otherLoans: [],
};

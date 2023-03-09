import deepFreeze from 'deep-freeze';

export const PERSONAL_DETAILS_OBJECT_KEYS = deepFreeze({
  fiscalPartner: 'fiscalPartner',
  taxableSubject: 'taxableSubjectDetails',
});

export const MARITAL_STATUS_VALUES = deepFreeze({
  MARRIED_REGISTERED_PARTNERSHIP_FOR_WHOLE_YEAR: 1,
  LIVING_TOGETHER_FOR_WHOLE_YEAR: 2,
  SINGLE_FOR_WHOLE_YEAR: 3,
  SITUATION_CHANGED_DURING_YEAR: 4,
});

export const REGISTRATION_ON_ADDRESS_VALUES = deepFreeze({
  TAXABLE_SUBJECT: 1,
  PARTNER: 2,
  EX_PARTNER: 3,
});

export const TAX_FORM_TYPE_VALUES = deepFreeze({
  P_FORM: 1,
  F_FORM: 2,
  C_FORM: 3,
  M_FORM: 4,
});

export const CHILD_TEMPLATE = deepFreeze({
  age: '',
  name: '',
  dateOfBirth: null,
  dateOfDeath: null,
  bsn: '',
  registrationOnAddress: 0,
  isCoParenting: null,
  isAtleastThreeDaysPerWeekLiving: null,
  isParentCollectingChildCare: null,
  isSignificantSupportExtended: null,
  parentCollectingChildCare: null,
});

export const REPRESENTATIVE_INITIAL_DATA = deepFreeze({
  person: {
    firstName: '',
    initials: '',
    middleName: '',
    lastName: '',
    bsn: '',
    dateOfBirth: '',
  },
  address: {
    street: '',
    houseNumber: '',
    additionToHouseNumber: null,
    zipCode: '',
    city: '',
    countryId: 1,
  },
});

import fetchMock from 'fetch-mock';
import deepFreeze from 'deep-freeze';

export const SAVE_DETAILS = jest.fn();

export const MOCK_SUBJECT_BSN = '111111111';

export const MOCK_PARTNER_BSN = '000000000';

export const PERSONAL_DETAILS = deepFreeze({
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
    declarationStatus: 'Onderhanden',
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
      bsn: '111111111',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
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
      bsn: '000000000',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 1,
      taxFormType: 'P-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 2,
      age: 0,
      fullName: 'Thijs lk c',
    },
    relationShipSituation: {
      patnerDeathDate: null,
      divorceDate: '2019-09-10T06:30:00Z',
      periodOfLivingTogether: {
        startDate: null,
        endDate: null,
      },
      isFiscalPartnerCriteriaMet: true,
      marriageDate: '2019-08-01T06:30:00Z',
      applyFiscalPartnerForWholeYear: true,
    },
    children: [
      {
        name: 'Roger ca Will',
        dateOfBirth: '2019-08-29T06:30:00Z',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131231',
        registrationOnAddress: 1,
        isCoParenting: null,
        isAtleastThreeDaysPerWeekLiving: null,
        isParentCollectingChildCare: null,
        isSignificantSupportExtended: null,
        age: 0,
        parentCollectingChildCare: '32131231-1',
      },
      {
        name: 'Federer ca KJako',
        dateOfBirth: '2019-08-29T06:30:00Z',
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '32131232',
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
        dateOfBirth: '2000-09-12T06:30:00Z',
        dateOfDeath: '2019-09-12T06:30:00Z',
        bsn: '32131233',
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
    owners: [
      { displayName: 'Robert s Ruther', value: 1 },
      { displayName: 'Thijs lk c', value: 2 },
      { displayName: 'Both', value: 3 },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 1,
      },
      {
        displayName: 'Karst',
        value: 2,
      },
      {
        displayName: 'other',
        value: 3,
      },
    ],
  },
});

export const PERSONAL_DETAILS_EMPTY_VALUES = {
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
    declarationStatus: 'Onderhanden',
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
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: 2,
      maritalStatus: 2,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: null,
    relationShipSituation: null,
    children: [
      {
        name: 'Roger ca Will',
        dateOfBirth: null,
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
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 1,
      },
      {
        displayName: 'Karst',
        value: 2,
      },
      {
        displayName: 'other',
        value: 3,
      },
    ],
  },
};

export const PERSONAL_DETAILS_WITHOUT_MARITAL_STATUS = {
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
    declarationStatus: 'Onderhanden',
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
      bsn: '123456789',
      birthDate: '2019-09-30T06:30:00Z',
      deathDate: '2019-12-06',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: null,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'mary',
      initials: null,
      middleName: 's',
      lastName: 'Ruther',
      bsn: '987654321',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: null,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    relationShipSituation: null,
    children: null,
  },
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 'string',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 1,
      },
    ],
  },
};

export const PERSONALDETAILS_PARTNER_DOD = {
  declarationID: '7f3c4fa9-fe84-46ad-8f8e-aacb0057364e',
  dossierManifest: {
    name: '2021_Provisional declaration_1.3',
    taxableYear: 2021,
    dossierId: 'b106308c-13be-4aef-8860-aacd008f0540',
    taxationFormID: 2,
    taxFormType: 'F-Form',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    taxLicenseNumber: null,
    declarationStatus: 'Onderhanden',
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
      bsn: '123456789',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: null,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: {
      taxableSubjectId: '00000000-0000-0000-0000-000000000000',
      firstName: 'mary',
      initials: null,
      middleName: 's',
      lastName: 'Ruther',
      bsn: '987654321',
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '2020-06-06',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: null,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    relationShipSituation: null,
    representative: {
      person: {
        firstName: 'test',
        initials: '',
        middleName: 's',
        lastName: 'test',
        dateOfBirth: '2020-01-01',
        bsn: '758699360',
      },
      address: {
        street: '209',
        houseNumber: '',
        additionToHouseNumber: '23',
        zipCode: 'ccte12',
        city: 'stocktown',
        countryId: 1,
      },
    },
    children: [
      {
        name: 'Roger ca Will',
        dateOfBirth: null,
        dateOfDeath: '2019-09-01T06:30:00Z',
        bsn: '757398303',
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
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 'string',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 1,
      },
    ],
  },
};

export const PERSONAL_DETAILS_WITHOUT_PARTNER = {
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
    declarationStatus: 'Onderhanden',
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
      birthDate: '2012-09-30T06:30:00Z',
      deathDate: '2020-06-06',
      taxationFormID: 4,
      taxFormType: 'M-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: null,
      age: 0,
      fullName: 'Robert s Ruther',
    },
    fiscalPartner: null,
    relationShipSituation: null,
    children: [],
  },
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 'string',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Robert s Ruther',
        value: 1,
      },
    ],
  },
};

export const MARITAL_STATUS_OPTIONS = deepFreeze({
  content: [
    { displayName: 'Married/registered partnership for whole year', value: 1 },
    { displayName: 'Living together for whole year', value: 2 },
    { displayName: 'Single for whole year', value: 3 },
    { displayName: 'Situation changed during year', value: 4 },
  ],
  meta: { totalRecords: '4' },
});

export const LIVING_TOGETHER_SITUATION_OPTIONS = deepFreeze({
  content: [
    { displayName: 'Notarial cohabitation contract', value: 1 },
    { displayName: 'A child together', value: 2 },
    { displayName: 'Recognized child of partner', value: 3 },
    { displayName: 'Own house together', value: 4 },
    { displayName: 'Partners in pensionarrangement', value: 5 },
    { displayName: 'Minor at same address', value: 6 },
    { displayName: 'Fiscal partner last year', value: 7 },
    { displayName: 'None', value: 8 },
  ],
  meta: { totalRecords: '8' },
});

export const REGISTERED_WITH_ADDRESSES_OPTIONS = deepFreeze({
  content: [
    { displayName: 'Taxable Subject', value: 1 },
    { displayName: 'Partner', value: 2 },
    { displayName: 'Ex-Partner', value: 3 },
  ],
  meta: { totalRecords: '3' },
});

export const MOCK_TAXFORM_TYPES = deepFreeze({
  content: [
    { displayName: 'P-Form', value: 1 },
    { displayName: 'F-Form', value: 2 },
    { displayName: 'C-Form', value: 3 },
    { displayName: 'M-Form', value: 4 },
  ],
  errors: null,
  meta: { totalRecords: '4' },
});

export const F_FORM = 'F-Form';
export const P_FORM = 'P-Form';
export const SEARCH_STRING = 'Tax';
export const TAXABLE_SUBJECT_ID = 1;
export const MOCK_GLOBAL_ADVISER_ID = '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5';

export const MOCK_INCOME_TAX_CLIENT_DETAILS = deepFreeze({
  globalClientId: '6fdfe018-2f90-4ad8-9890-aacd009d384e',
  genderId: 1,
  title: 'Mr',
  firstName: 'Ramana',
  middleName: 'L',
  lastName: 'Maharshi',
  bsnNumber: 'abcteat',
  dateOfBirth: '1992-10-10T00:00:00',
  emailId: 'test@gm.com',
  isActive: true,
});

export const MOCK_INCOME_TAX_CLIENTS = deepFreeze({
  content: [
    { id: 1, name: 'Taxable Subject 1' },
    { id: 2, name: 'Taxable Subject 2' },
    { id: 3, name: 'Taxable Subject 3' },
  ],
});

export const mockGetMaritalStatuses = ({ response = MARITAL_STATUS_OPTIONS } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/marital-statuses',
  {
    body: response,
  },
);

export const mockGetLivingTogetherSituations = ({ response = LIVING_TOGETHER_SITUATION_OPTIONS } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/living-together-situation-statuses',
  {
    body: response,
  },
);

export const mockGetChildrenRegisteredAddresses = ({ response = REGISTERED_WITH_ADDRESSES_OPTIONS } = {}) => fetchMock.get(
  '/itx-api/v1/declaration/registered-with-addresses',
  {
    body: response,
  },
);

export const mockGetTaxFormTypes = (response = MOCK_TAXFORM_TYPES) => fetchMock.get(
  '/itx-api/v1/declaration/taxform-types',
  {
    body: response,
  },
);

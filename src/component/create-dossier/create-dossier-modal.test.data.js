import deepFreeze from 'deep-freeze';
import fetchMock from 'fetch-mock';
import { CURRENT_YEAR } from './create-dossier-constants';

export const SEARCH_STRING = 'Tax';
export const PARTNER_SEARCH_STRING = 'Tax';
export const MOCK_GLOBAL_CLIENT_ID = 1;
export const MOCK_GLOBAL_ADVISER_ID = '0C8263F5-4B52-4ABD-B83F-B5D3CF216DF5';
export const MOCK_DOSSIER_ID = '16af6eeb-00e1-4cfe-b875-ac6300572b71';

export const DOSSIER_TYPES = deepFreeze({
  content: [
    { value: 1, displayName: 'Forecast' },
    { value: 2, displayName: 'Provisional declaration' },
    { value: 3, displayName: 'Declaration' },
  ],
  meta: { totalRecords: '3' },
});

export const PERIODS = deepFreeze({
  content: [
    {
      displayName: CURRENT_YEAR,
      value: CURRENT_YEAR,
    },
    {
      displayName: '2019',
      value: 2019,
    },
    {
      displayName: '2018',
      value: 2018,
    },
  ],
  meta: { totalRecords: '2' },
});

export const MOCK_TAXFORM_TYPES = deepFreeze({
  content: [
    { value: 1, displayName: 'P-Form' },
    { value: 2, displayName: 'M-Form' },
    { value: 3, displayName: 'C-Form' },
  ],
  errors: null,
  meta: { totalRecords: '4' },
});

export const MOCK_DOSSIER_LIST = deepFreeze({
  content: [
    {
      displayName: '2021_Prognose_0.1',
      value: '16af6eeb-00e1-4cfe-b875-ac6300572b71',
    },
  ],
  meta: {
    totalRecords: '1',
  },
  errors: null,
});
export const MOCK_DOSSIER_INFO = deepFreeze({
  content: {
    globalDossierId: '16af6eeb-00e1-4cfe-b875-ac6300572b71',
    taxationFormId: 1,
    isJointDossier: true,
    fiscalPartnerName: 'Mahesh Fiscal It Th',
    fiscalPartnerGlobalClientId: 1,
  },
  meta: {
    totalRecords: '1',
  },
  errors: null,
});

export const MOCK_TAXABLESUBJECT_DETAILS = deepFreeze({
  globalClientId: '1',
  genderId: 1,
  title: 'Mr',
  firstName: 'Lars',
  middleName: '',
  lastName: '',
  bsnNumber: '142221831',
  dateOfBirth: '1992-10-10T00:00:00',
  emailId: 'test@gm.com',
  isActive: true,
});

export const MOCK_TAXABLE_SUBJECTS = deepFreeze({
  content: [
    { id: '1', name: 'Taxable Subject 1' },
    { id: '2', name: 'Taxable Subject 2' },
    { id: '3', name: 'Taxable Subject 3' },
  ],
});

export const VIOLATIONS = deepFreeze({
  errors: [{
    id: '17813b16-e656-454d-80af-86e674230b56',
    status: 400,
    detail: 'Cannot create multiple forecast dossiers for the same year',
  }],
});

export const mockGetTaxFormTypes = (response = MOCK_TAXFORM_TYPES) => fetchMock.get(
  '/itx-api/v1/declaration/taxform-types',
  {
    body: response,
  },
);

export const mockGetDossierList = () => fetchMock.get(
  `/itx-api/v1/declaration/${MOCK_GLOBAL_CLIENT_ID}/dossier-names?globalAdviserId=${MOCK_GLOBAL_ADVISER_ID}&taxationYear=${CURRENT_YEAR}`,
  {
    body: MOCK_DOSSIER_LIST,
  },
);

export const mockGetDossierInfo = () => fetchMock.get(
  `/itx-api/v1/declaration/${MOCK_GLOBAL_CLIENT_ID}/dossier-info?globalAdviserId=${MOCK_GLOBAL_ADVISER_ID}&globalDossierId=${MOCK_DOSSIER_ID}`,
  {
    body: MOCK_DOSSIER_INFO,
  },
);

export const mockGetTaxationYearsWithTaxableYear = ({ data = PERIODS, taxableYear = CURRENT_YEAR } = {}) => fetchMock.get(
  `/itx-api/v1/declaration/taxation-years?taxableYear=${taxableYear}`,
  {
    body: data,
  },
);

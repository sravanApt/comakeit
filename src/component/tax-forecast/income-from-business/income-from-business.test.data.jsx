import fetchMock from 'fetch-mock';
import deepFreeze from 'deep-freeze';
import {
  endDateofYear, startDateofYear,
} from '../../../common/utils';

const dateFormat = 'YYYY-MM-DD';
const currentYear = 2020;

export const businessFormValues = {
  PROPRIETORSHIP: '2',
  PARTNERSHIP: '3',
  VOF: '5',
};

export const MOCK_NEW_ADMINISTRATION_DATA_SUBJECT = deepFreeze({
  globalAdministrationId: '',
  businessActivities: 'activity',
  businessEndDate: endDateofYear(currentYear, dateFormat),
  businessForm: 2,
  businessName: 'business',
  businessStartDate: startDateofYear(currentYear, dateFormat),
  countryId: 1,
  dossierId: '11a4ee8d-8727-4a5a-be39-aad20088e4c7',
  fiscalYearEndDate: endDateofYear(currentYear, dateFormat),
  fiscalYearStartDate: startDateofYear(currentYear, dateFormat),
  rsin: '123456789',
  taxableSubjectId: '236f88dc-dbd8-4fcd-b803-aad10096b29c',
  fromVPC: false,
});

export const MOCK_NEW_ADMINISTRATION_DATA_PARTNER = deepFreeze({
  globalAdministrationId: '',
  businessActivities: 'activity',
  businessEndDate: endDateofYear(currentYear, dateFormat),
  businessForm: 2,
  businessName: 'business',
  businessStartDate: startDateofYear(currentYear, dateFormat),
  countryId: 1,
  dossierId: '11a4ee8d-8727-4a5a-be39-aad20088e4c7',
  fiscalYearEndDate: endDateofYear(currentYear, dateFormat),
  fiscalYearStartDate: startDateofYear(currentYear, dateFormat),
  rsin: '123456789',
  isFiscalPartner: true,
  fromVPC: false,
});

export const MOCK_EDIT_ADMINISTRATION_DATA = deepFreeze({
  globalAdministrationId: '482501e9-0000-0000-0000-zzd30056f55e',
  businessName: 'Test Farming',
  businessActivities: 'test farming',
  countryId: 2,
  countryName: 'Netherlands',
  businessEndDate: endDateofYear(currentYear, dateFormat),
  businessStartDate: startDateofYear(currentYear, dateFormat),
  rsin: '213321388',
  businessFormId: 1,
  businessFormName: 'Commanditaire vennootschap',
  fiscalYearEndDate: endDateofYear(currentYear, dateFormat),
  fiscalYearStartDate: startDateofYear(currentYear, dateFormat),
  vpBusinessName: 'farm',
  fromVPC: true,
});

export const MOCK_EDIT_ADMINISTRATION_DATA_WITH_PARTNER = deepFreeze({
  globalAdministrationId: '302501e8-0000-0000-0000-abd30056f58d',
  businessName: 'Test Farming',
  businessActivities: 'test farming',
  countryId: 2,
  countryName: 'Netherlands',
  businessEndDate: endDateofYear(currentYear, dateFormat),
  businessStartDate: startDateofYear(currentYear, dateFormat),
  rsin: '213321388',
  businessFormId: 3,
  businessPartnerId: 1,
  businessFormName: 'Commanditaire vennootschap',
  fiscalYearEndDate: endDateofYear(currentYear, dateFormat),
  fiscalYearStartDate: startDateofYear(currentYear, dateFormat),
  vpBusinessName: 'farm',
  fromVPC: true,
});

export const INCOME_FROM_BUSINESS_DETAILS = deepFreeze({
  declarationID: '576ed4e2-a603-4ef9-8c65-aad20088e3bd',
  dossierManifest: {
    name: '2020_Forecast_0.1',
    taxableYear: 2020,
    dossierId: '11a4ee8d-8727-4a5a-be39-aad20088e4c7',
    taxationFormID: 1,
    taxFormType: 'P-Form',
    declarationTypeId: 1,
    isJointDeclaration: true,
    declarationStatusId: 1,
    taxLicenseNumber: null,
    version: '0.1',
    declarationType: 'Forecast',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '236f88dc-dbd8-4fcd-b803-aad10096b29c',
      firstName: 'ryan',
      initials: null,
      middleName: 'van',
      lastName: 'lee',
      bsn: '123-321',
      birthDate: '1992-09-23T09:08:01.652',
      deathDate: null,
      livingTogetherPreciseSituation: null,
      maritalStatus: 1,
      age: 24,
      fullName: 'ryan van lee',
    },
    fiscalPartner: {
      taxableSubjectId: '708bdb3b-d91d-4222-b5f4-aad100971f77',
      firstName: 'rosy',
      initials: null,
      middleName: 'leaf',
      lastName: 'lorentz',
      bsn: '3123-23',
      birthDate: '1996-09-23T09:09:32.435',
      deathDate: null,
      livingTogetherPreciseSituation: null,
      maritalStatus: 1,
      age: 20,
      fullName: 'rosy leaf lorentz',
    },
    relationShipSituation: null,
    children: null,
  },
  businessDetails: {
    taxableSubjectBusinessDetails: [
      {
        globalAdministrationId: '482501e9-0000-0000-0000-zzd30056f55e',
        businessName: 'Farming',
        businessActivities: 'farming',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '1992-09-23T09:14:39.675',
        businessEndDate: '2019-12-23T09:14:39.675',
        rsin: '213321388',
        businessFormId: 1,
        businessFormName: 'Commanditaire vennootschap',
        fiscalYearStartDate: '2018-01-01T00:00:00',
        fiscalYearEndDate: '2018-12-31T00:00:00',
        vpBusinessName: 'farm',
        fromVPC: true,
      },
      {
        globalAdministrationId: '302501e8-0000-0000-0000-abd30056f58d',
        businessName: 'BPO solutions',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-09-01T06:30:00',
        businessEndDate: '2019-09-20T06:30:00',
        rsin: '543678770',
        businessFormId: 3,
        businessPartnerId: 1,
        businessFormName: 'Besloten vennootschap',
        fiscalYearStartDate: '2019-09-03T06:30:00',
        fiscalYearEndDate: '2019-09-20T06:30:00',
        vpBusinessName: 'BPO solutions',
        fromVPC: true,
      },
      {
        globalAdministrationId: '205201e9-0000-0000-0000-bcd30056f55d',
        businessName: 'Hr recruitment solutions',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-09-01T06:30:00',
        businessEndDate: '2019-12-20T06:30:00',
        rsin: '123456789',
        businessFormId: 0,
        businessFormName: 'Besloten vennootschap',
        fiscalYearStartDate: '2019-09-03T06:30:00',
        fiscalYearEndDate: '2019-09-20T06:30:00',
        vpBusinessName: 'Hr recruitment solutions',
      },
      {
        globalAdministrationId: '202501e9-5e21-4caf-bb2f-aad3004a9192',
        businessName: 'hospital',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-09-01T06:30:00Z',
        businessEndDate: '2019-12-20T06:30:00Z',
        rsin: '123678777',
        businessFormId: 2,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-09-03T06:30:00Z',
        fiscalYearEndDate: '2019-09-20T06:30:00Z',
      },
      {
        globalAdministrationId: 'b06012c0-c048-474c-b1b1-aad30056f55d',
        businessName: 'test BPO solutions',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-09-01T06:30:00Z',
        businessEndDate: '2019-12-20T06:30:00Z',
        rsin: '123456788',
        businessFormId: 2,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-09-03T06:30:00Z',
        fiscalYearEndDate: '2019-09-20T06:30:00Z',
        vpBusinessName: 'test BPO solutions',
      },
    ],
    fiscalPartnerBusinessDetails: null,
  },
});

export const INCOME_FROM_BUSINESS_DETAILS_WITH_EMPTY_SUBJECT = deepFreeze({
  ...INCOME_FROM_BUSINESS_DETAILS,
  businessDetails: {
    taxableSubjectBusinessDetails: null,
    fiscalPartnerBusinessDetails: null,
  },
});

export const BUSINESS_FORM_TYPES = deepFreeze({
  content: [{ displayName: 'Eenmanszaak', value: 2 }, { displayName: 'Maatschap', value: 3 }, { displayName: 'Vof', value: 5 }],
  meta: { totalRecords: '3' },
});

export const MOCK_BUSINESS_PARTNERS = deepFreeze({
  content: [{ displayName: 'Firmant 1', value: 1 }, { displayName: 'Firmant 2', value: 2 }],
  meta: { totalRecords: '2' },
});

export const MOCK_VPC_ADMINISTRATION_LIST = deepFreeze({
  content: [
    {
      globalAdministrationId: '3b9df742-abc8-435c-a269-ab3d008503eb',
      name: '7 - Bike Store East B.V._12-11-2019_Excel',
    },
    {
      globalAdministrationId: '',
      name: '9 - Bike Store East B.V._09-03-2020_Fiscal_IT_2',
    },
    {
      globalAdministrationId: '4ff9c727-9f52-417c-b192-ab7b009749d5',
      name: '1 - Bike Store East B.V._09-03-2020_Fiscal_IT_1_Not to use',
    },
    {
      globalAdministrationId: '31f9408b-3952-4511-b8e5-ab7c003bd1b6',
      name: '1 - Bike Store East B.V._12-03-2020_Fiscal_IT_1',
    },
    {
      globalAdministrationId: '95eac577-5feb-40d7-b676-ab82009f0990',
      name: '2 - Bike Wholesale B.V._18032020',
    },
  ],
  meta: {
    totalRecords: '5',
  },
  errors: null,
});

export const MOCK_VPC_ADMINISTRATION_DETAILS = deepFreeze({
  content: {
    globalAdministrationId: '31f9408b-3952-4511-b8e5-ab7c003bd1b6',
    name: '1 - Bike Store East B.V._12-03-2020_Fiscal_IT_1',
    businessActivities: null,
    legalFormId: 2,
  },
  meta: {
    totalRecords: '0',
  },
  errors: null,
});

export const SEARCH_STRING = 'Bike';
export const ADMINISTRATION_ID = '31f9408b-3952-4511-b8e5-ab7c003bd1b6';
export const ADVISER_ID = '0CD8A90D-D936-4A82-B787-AB8900D6A1AC';

export const mockSaveAdministrationDetails = ({ response = {} } = {}) => fetchMock.post(
  '/itx-api/v1/declaration/add-administration',
  {
    body: response,
  },
);

export const mockGetBusinessFormTypes = ({ response = BUSINESS_FORM_TYPES } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/business-form-types',
  {
    body: response,
  },
);

export const mockGetBusinessPartners = ({ response = MOCK_BUSINESS_PARTNERS } = {}) => fetchMock.get(
  '/itx-api/v1/lookup/business-partners',
  {
    body: response,
  },
);

import deepFreeze from 'deep-freeze';
import fetchMock from 'fetch-mock';

export const MOCK_ALLOCATION_DATA = deepFreeze({
  recommendedAllocation: false,
  ownHomeDeduction: {
    taxableSubjectAmount: '120',
    fiscalPartnerAmount: '120',
    totalAmount: '140',
  },
  substantialInterest: {
    taxableSubjectAmount: '120',
    fiscalPartnerAmount: '120',
    totalAmount: '140',
  },
  box3TaxableBase: {
    taxableSubjectAmount: '120',
    fiscalPartnerAmount: '120',
    totalAmount: '140',
  },
  personalDeduction: {
    taxableSubjectAmount: '120',
    fiscalPartnerAmount: '120',
    totalAmount: '140',
  },
  dividendTax: {
    taxableSubjectAmount: '120',
    fiscalPartnerAmount: '120',
    totalAmount: '140',
  },
});

export const MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA = deepFreeze({
  declarationID: '7f3c4fa9-fe84-46ad-8f8e-aacb0057364e',
  dossierManifest: {
    name: '2019_Provisional declaration_1.3',
    taxableYear: 2019,
    dossierId: 'b106308c-13be-4aef-8860-aacd008f0540',
    taxationFormID: 2,
    taxFormType: 'F-Form',
    declarationTypeId: 2,
    isJointDeclaration: true,
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
  allocationDetails: null,
});

export const MOCK_RECOMMENDED_ALLOCATION_NULL_DATA = deepFreeze({
  content: {
    recommendedAllocation: true,
    ownHomeDeduction: {
      taxableSubjectAmount: null,
      fiscalPartnerAmount: null,
      totalAmount: null,
    },
    substantialInterest: {
      taxableSubjectAmount: null,
      fiscalPartnerAmount: null,
      totalAmount: null,
    },
    box3TaxableBase: {
      taxableSubjectAmount: null,
      fiscalPartnerAmount: null,
      totalAmount: null,
    },
    personalDeduction: {
      taxableSubjectAmount: null,
      fiscalPartnerAmount: null,
      totalAmount: null,
    },
    dividendTax: {
      taxableSubjectAmount: null,
      fiscalPartnerAmount: null,
      totalAmount: null,
    },
  },
  meta: {
    totalRecords: '1',
  },
  errors: null,
});

export const MOCK_RECOMMENDED_ALLOCATION_DATA = deepFreeze({
  content: {
    ...MOCK_ALLOCATION_DATA,
  },
  meta: {
    totalRecords: '1',
  },
});

export const mockGetRecommendedAllocationData = ({
  data = MOCK_RECOMMENDED_ALLOCATION_DATA, recommendedAllocation = true,
} = {}) => fetchMock.post(`/itx-api/v1/declaration/allocation-report?recommendedAllocation=${recommendedAllocation}`, {
  body: {
    ...data,
    content: {
      ...data.content,
      recommendedAllocation,
    },
  },
});

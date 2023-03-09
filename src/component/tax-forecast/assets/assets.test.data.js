import deepFreeze from 'deep-freeze';

export const GLOBAL_CLIENT_ID = '1b146362-0daa-4e18-9db3-abe6007b0616';

export const DEFAULT_ROW_INDEX = 0;

const COMMON_DATA = deepFreeze([
  {
    description: 'test 100 test test',
    belongsTo: 1,
    amount: 1500,
  },
]);

export const MOCK_DATA_OWN_HOMES = deepFreeze({
  jointAssets: {
    ownHomes: [
      {
        address: {
          street: 'street 1',
          houseNumber: 430,
          additionToHouseNumber: '34',
          zipCode: '7584ad',
          city: 'test',
          countryId: 1,
        },
        belongsTo: 1,
        costOfRental: [
          {
            description: 'test',
            amount: 7000,
          },
          {
            description: 'test 3',
            amount: 300,
          },
        ],
        dateOfPurchase: '2020-04-01',
        dateOfSelling: '2020-04-02',
        description: 'test 100 test test',
        endDate: '2020-04-08',
        expensesPaid: 10000,
        fixedRate: null,
        homeLoanLiability: 1000,
        monumentalReferenceNumber: 12356,
        paidGroundRent: 2000,
        percentageOfOwnership: 10,
        vacancyId: 1,
        purchaseCosts: [
          {
            description: 'test',
            amount: 3000,
          },
          {
            description: '',
            amount: 230,
          },
        ],
        purchaseprice: 100,
        receivedSubsidy: 20000,
        rentalIncome: [
          {
            description: 'test',
            amount: 6000,
          },
          {
            description: 'test 3',
            amount: 450,
          },
        ],
        sellingCosts: [
          {
            description: 'test',
            amount: 9000,
          },
          {
            description: 'test 32',
            amount: 750,
          },
        ],
        sellingPrice: 100,
        startDate: '2020-04-01',
        taxableCapitalInsurance: 8000,
        woz: 1000,
        wozReferenceNumber: 152345,
      },
    ],
  },
});

export const MOCK_DATA_SUBSTANTIAL_INTEREST = deepFreeze({
  jointAssets: {
    substantialInterests: [
      {
        groupingId: 'd0e6a1a1-4b29-4dbd-a7a2-abe9069a75b5',
        acquisitionPrice: 1200,
        belongsTo: 1,
        businessName: 'business',
        countryId: 1,
        deductibleAcquisitionPrice: 100,
        deductibleCosts: 1000,
        globalAdministrationId: '18811371-c68b-48b3-97c5-ac010064f2af',
        incomeFromAbroad: 190,
        numberOfShares: 40,
        regularBenefit: 30,
        transferPrice: 30,
        withHeldDividendTax: 30,
        withHeldSourceTax: 30,
      },
    ],
  },
});

export const MOCK_DATA_OTHER_PROPERTIES = deepFreeze({
  jointAssets: {
    otherProperties: [
      {
        id: 'da761885-0f79-4b80-9278-e4d0df147aec',
        address: {
          street: 'street 1',
          houseNumber: 340,
          additionToHouseNumber: '32',
          zipCode: '7584ad',
          city: 'test',
          countryId: 1,
        },
        belongsTo: 1,
        description: 'test 100 test test',
        expensesPaid: 190,
        monumentalReferenceNumber: '',
        percentageOfOwnership: 10,
        rentedOutOrLeased: {
          status: 0,
          isLeaseAgreementForMoreThenTwelveYears: null,
          yearLease: '',
          isUnusualBusinessConditionsForLease: null,
          tenantProtection: null,
          annualRent: '',
          unprofessionalRent: null,
          isPropertyPartOfBiggerBuilding: null,
          percentageOfRental: '',
        },
        subsidyReceived: '',
        woz: 1000,
        wozReferenceNumber: 152345,
      },
    ],
  },
});

export const MOCK_DATA_BANK_ACCOUNTS = deepFreeze({
  jointAssets: {
    bankAccounts: [
      {
        accountNumber: 23456789,
        amount: 1500,
        belongsTo: 1,
        countryId: 1,
        description: 'test 100 test test',
      },
    ],
  },
});

export const MOCK_DATA_INVESTMENT_ACCOUNTS = deepFreeze({
  jointAssets: {
    investmentAccounts: [
      {
        accountNumber: 23456789,
        amount: 1500,
        belongsTo: 1,
        countryId: 1,
        description: 'test 100 test test',
        groupingId: 'd0e6a1a1-4b23-4dbd-a7a2-abe9069a75b7',
        netherLandDividend: {
          countryId: 1,
          dividend: 230,
          dividendTax: 550,
        },
        otherCountryDividends: [
          {
            countryId: 2,
            dividend: 120,
            dividendTax: 1220,
          },
          {
            countryId: 3,
            dividend: 150,
            dividendTax: 1500,
          },
        ],
      },
    ],
  },
});

export const MOCK_DATA_ENVIRONMENTAL_INVESTMENTS = deepFreeze({
  jointAssets: {
    environmentalInvestments: [
      {
        accountNumber: 23456789,
        amount: 1500,
        belongsTo: 1,
        countryId: 1,
        description: 'test 100 test test',
        groupingId: null,
        netherLandDividend: {
          countryId: 1,
          dividend: 230,
          dividendTax: 550,
        },
        otherCountryDividends: [
          {
            countryId: 2,
            dividend: 120,
            dividendTax: 1220,
          },
        ],
      },
    ],
  },
});

export const MOCK_DATA_PERIODICAL_ASSETS = deepFreeze({
  jointAssets: {
    periodicalBenefits: COMMON_DATA,
  },
});

export const MOCK_DATA_OUTSTANDING_LOAN_ASSETS = deepFreeze({
  jointAssets: {
    outStandingLoansOrCash: COMMON_DATA,
  },
});

export const MOCK_DATA_OTHER_ASSETS = deepFreeze({
  jointAssets: {
    otherAssets: COMMON_DATA,
  },
});

export const MOCK_DATA_NON_EXEMPT_INSURANCES = deepFreeze({
  jointAssets: {
    nonExemptCapitalInsurances: COMMON_DATA,
  },
});

export const MOCK_ASSETS_DATA = deepFreeze({
  declarationID: '7fc7350d-05ed-4ce0-965d-ab8a0093ba49',
  businessDetails: {
    fiscalPartnerBusinessDetails: null,
    taxableSubjectBusinessDetails: [{
      businessActivities: 'Admin',
      businessEndDate: null,
      businessFormId: 2,
      businessFormName: 'Eenmanszaak',
      businessName: 'Admin',
      businessStartDate: '2020-07-02T00:00:00',
      countryId: 1,
      countryName: 'NLD',
      dataSourceId: 0,
      fiscalYearEndDate: '2020-12-31T00:00:00',
      fiscalYearStartDate: '2020-01-01T00:00:00',
      fromVPC: false,
      globalAdministrationId: '18811371-c68b-48b3-97c5-ac010064f2af',
      rsin: '456677565',
      vpBusinessName: null,
    }],
  },
  dossierManifest: {
    name: '2020_Voorlopige Aangifte_1.1',
    taxableYear: 2020,
    dossierId: '20b1170b-64f8-4648-b021-ab8a0093ba4a',
    declarationTypeId: 2,
    isJointDeclaration: false,
    declarationStatusId: 1,
    declarationStatus: 'Onderhanden',
    taxLicenseNumber: null,
    version: '1.1',
    declarationType: 'Voorlopige Aangifte',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '2f7d389d-2bea-4fc5-9e40-aaa80087ab72',
      firstName: 'Sem',
      initials: null,
      middleName: 'Abel',
      lastName: 'Hiddie',
      bsn: '23123',
      birthDate: '2019-08-13T08:09:45.737',
      deathDate: null,
      taxationFormID: 1,
      taxFormType: 'P-Biljet',
      livingTogetherPreciseSituation: null,
      maritalStatus: 0,
      age: 0,
      fullName: 'Sem Abel Hiddie',
    },
    fiscalPartner: null,
    relationShipSituation: null,
    children: [

    ],
  },
  assetsScreen: null,
  allocationDetails: {
    recommendedAllocation: false,
  },
  masterData: {
    parentCollectingChildCareOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '23123',
      },
      {
        displayName: 'Other',
        value: '0',
      },
    ],
    childRegisteredOnAddressOptions: [
      {
        displayName: 'Sem Abel Hiddie',
        value: 1,
      },
      {
        displayName: 'Ex Fiscaal Partner',
        value: 3,
      },
    ],
    owners: [
      {
        displayName: 'Sem Abel Hiddie',
        value: '1',
      },
      {
        displayName: 'Sem Abel',
        value: '2',
      },
      {
        displayName: 'Both',
        value: '3',
      },
    ],
  },
});

export const ASSETS_SUB_MODAL_FIELDS = deepFreeze([
  {
    selector: '.common-data-table__body .common-data-table__row .col-description input',
    value: 'rental income',
  },
  {
    selector: '.common-data-table__body .common-data-table__row .col-amount input',
    value: 1500,
  },
]);

export const ASSETS_WITH_DATA = deepFreeze({
  jointAssets: {
    substantialInterests: MOCK_DATA_SUBSTANTIAL_INTEREST.jointAssets.substantialInterests,
    ownHomes: MOCK_DATA_OWN_HOMES.jointAssets.ownHomes,
    otherProperties: MOCK_DATA_OTHER_PROPERTIES.jointAssets.otherProperties,
    bankAccounts: MOCK_DATA_BANK_ACCOUNTS.jointAssets.bankAccounts,
    investmentAccounts: MOCK_DATA_INVESTMENT_ACCOUNTS.jointAssets.investmentAccounts,
    environmentalInvestments: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS.jointAssets.environmentalInvestments,
    periodicalBenefits: COMMON_DATA,
    outStandingLoansOrCash: COMMON_DATA,
    otherAssets: COMMON_DATA,
    nonExemptCapitalInsurances: COMMON_DATA,
  },
});

export const MOCK_REPORT_DATA = deepFreeze({
  content: {
    result: {
      AssetsImmovableOtherProperty: [],
    },
  },
  meta: {
    totalRecords: '1',
  },
  errors: null,
});

export const MOCK_VACANCY_OPTIONS = deepFreeze({
  content: [
    {
      displayName: 'Leeg',
      value: 0,
    },
    {
      displayName: 'Verkoop ',
      value: 1,
    },
    {
      displayName: 'Aanbouw ',
      value: 2,
    },
    {
      displayName: 'Ex partner',
      value: 3,
    },
    {
      displayName: 'Uitzending',
      value: 4,
    },
    {
      displayName: 'Verzorgingshuis',
      value: 5,
    },
  ],
  meta: {
    totalRecords: '6',
  },
  errors: null,
});

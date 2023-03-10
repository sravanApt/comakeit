import deepFreeze from 'deep-freeze';

export const ADMINISTRATION_IDS = deepFreeze({
  taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed47',
  fiscalPartnerBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed47',
});

export const COMPANY_ID = 36131;
export const PROFIT_LOSS_TEST_ID = 'profit-loss';
export const PROFIT_LOSS_CORRECTION_MODAL = 'profit-loss-correction-modal';
export const PROFIT_LOSS_CORRECTION_FORM = 'tax-forecast-profit-and-loss-correction-form';
export const PROFIT_LOSS_CORRECTION_FIELDS = deepFreeze([
  {
    selector: '.common-data-table__body .common-data-table__row .description input',
    value: 'description',
  },
  {
    selector: '.common-data-table__body .common-data-table__row .amount-correction input',
    value: 1500,
  },
]);

export const DATA_SOURCES = deepFreeze([
  { displayName: 'Actual', value: 1 },
  { displayName: 'Actual+Last Year', value: 2 },
  { displayName: 'Actual+Forecast', value: 3 },
  { displayName: 'Actual+Budget', value: 4 },
]);
export const DEFAULT_PROFIT_LOSS_DATA = deepFreeze({
  revenue: {
    currentYearAmount: 0,
    previousYearAmount: 0,
    businessProfitAndLossDetails: [],
  },
  plBenefitsDetails: {
    financialBenifitsForBusiness: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    extraordinaryBenefitsForBusiness: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
  },
  costsOfBusiness: {
    purchaseCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    personalCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    depreciationCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    carAndTransportationCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    housingCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    sellingCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    otherCost: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
  },
  plCostDetails: {
    financialCostsForBusiness: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [],
    },
    extraordinaryCostsForBusiness: {
      currentYearAmount: 0,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [
      ],
    },
  },
  shares: {
    currentYearAmount: 0,
    previousYearAmount: 0,
    transactions: [],
  },
});

export const MOCK_PROFIT_LOSS_DATA = deepFreeze([
  {
    globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
    dateSource: 0,
    revenue: null,
    plBenefitsDetails: {
      financialBenifitsForBusiness: null,
      extraordinaryBenefitsForBusiness: null,
    },
    costsOfBusiness: null,
    plCostDetails: {
      financialCostsForBusiness: null,
      extraordinaryCostsForBusiness: null,
    },
  },
  {
    globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed47',
    dateSource: 0,
    revenue: {
      currentYearAmount: 655175,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [
        {
          costCategory: null,
          description: 'A223',
          amount: 677081,
          amountVPC: 677071,
          amountCorrection: 10,
          prevYearAmount: 0,
          prevYearAmountVPC: 0,
          prevYearAmountCorrection: 0,
        },
        {
          costCategory: null,
          description: 'A239',
          amount: -21886,
          amountVPC: -21896,
          prevYearAmount: 0,
          prevYearAmountVPC: 0,
          prevYearAmountCorrection: 0,
        },
      ],
    },
    plBenefitsDetails: {
      financialBenifitsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
      extraordinaryBenefitsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
    },
    costsOfBusiness: {
      purchaseCost: {
        currentYearAmount: 65248,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A232',
            amount: 65248,
            amountVPC: 65248,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      personalCost: {
        currentYearAmount: 286500,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A246',
            amount: 208000,
            amountVPC: 208000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A249',
            amount: 16640,
            amountVPC: 16640,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A255',
            amount: 56396,
            amountVPC: 56396,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A313',
            amount: 5464,
            amountVPC: 5464,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      depreciationCost: {
        currentYearAmount: 30033,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A1070',
            amount: 4233,
            amountVPC: 4233,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A275',
            amount: 4200,
            amountVPC: 4200,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A279',
            amount: 21600,
            amountVPC: 21600,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      carAndTransportationCost: {
        currentYearAmount: 9225,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A401',
            amount: 6225,
            amountVPC: 6225,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A404',
            amount: 3000,
            amountVPC: 3000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      housingCost: {
        currentYearAmount: 64646,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A336',
            amount: 31896,
            amountVPC: 31896,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A339',
            amount: 3000,
            amountVPC: 3000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A341',
            amount: 23150,
            amountVPC: 23150,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A342',
            amount: 6600,
            amountVPC: 6600,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      sellingCost: {
        currentYearAmount: 18464,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A382',
            amount: 15704,
            amountVPC: 15704,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A391',
            amount: 2760,
            amountVPC: 2760,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      otherCost: {
        currentYearAmount: 53550,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A421',
            amount: 23014,
            amountVPC: 23014,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A422',
            amount: 8588,
            amountVPC: 8588,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A433',
            amount: 7708,
            amountVPC: 7708,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A440',
            amount: 13800,
            amountVPC: 13800,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A456',
            amount: 444,
            amountVPC: 444,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A477',
            amount: -4,
            amountVPC: -4,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
    },
    plCostDetails: {
      financialCostsForBusiness: {
        currentYearAmount: 6925,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A499',
            amount: 6925,
            amountVPC: 6925,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      extraordinaryCostsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
    },
  },
  {
    globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed52',
    dateSource: 0,
    revenue: {
      currentYearAmount: 655175,
      previousYearAmount: 0,
      businessProfitAndLossDetails: [
        {
          costCategory: null,
          description: 'A223',
          amount: 677081,
          amountVPC: 677071,
          amountCorrection: 10,
          prevYearAmount: 0,
          prevYearAmountVPC: 0,
          prevYearAmountCorrection: 0,
        },
        {
          costCategory: null,
          description: 'A239',
          amount: -21886,
          amountVPC: -21896,
          prevYearAmount: 0,
          prevYearAmountVPC: 0,
          prevYearAmountCorrection: 0,
        },
      ],
    },
    plBenefitsDetails: {
      financialBenifitsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
      extraordinaryBenefitsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
    },
    costsOfBusiness: {
      purchaseCost: {
        currentYearAmount: 65248,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A232',
            amount: 65248,
            amountVPC: 65248,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      personalCost: {
        currentYearAmount: 286500,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A246',
            amount: 208000,
            amountVPC: 208000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A249',
            amount: 16640,
            amountVPC: 16640,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A255',
            amount: 56396,
            amountVPC: 56396,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A313',
            amount: 5464,
            amountVPC: 5464,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      depreciationCost: {
        currentYearAmount: 30033,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A1070',
            amount: 4233,
            amountVPC: 4233,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A275',
            amount: 4200,
            amountVPC: 4200,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A279',
            amount: 21600,
            amountVPC: 21600,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      carAndTransportationCost: {
        currentYearAmount: 9225,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A401',
            amount: 6225,
            amountVPC: 6225,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A404',
            amount: 3000,
            amountVPC: 3000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      housingCost: {
        currentYearAmount: 64646,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A336',
            amount: 31896,
            amountVPC: 31896,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A339',
            amount: 3000,
            amountVPC: 3000,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A341',
            amount: 23150,
            amountVPC: 23150,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A342',
            amount: 6600,
            amountVPC: 6600,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      sellingCost: {
        currentYearAmount: 18464,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A382',
            amount: 15704,
            amountVPC: 15704,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A391',
            amount: 2760,
            amountVPC: 2760,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      otherCost: {
        currentYearAmount: 53550,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A421',
            amount: 23014,
            amountVPC: 23014,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A422',
            amount: 8588,
            amountVPC: 8588,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A433',
            amount: 7708,
            amountVPC: 7708,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A440',
            amount: 13800,
            amountVPC: 13800,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A456',
            amount: 444,
            amountVPC: 444,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
          {
            costCategory: null,
            description: 'A477',
            amount: -4,
            amountVPC: -4,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
    },
    plCostDetails: {
      financialCostsForBusiness: {
        currentYearAmount: 6925,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [
          {
            costCategory: null,
            description: 'A499',
            amount: 6925,
            amountVPC: 6925,
            amountCorrection: 0,
            prevYearAmount: 0,
            prevYearAmountVPC: 0,
            prevYearAmountCorrection: 0,
          },
        ],
      },
      extraordinaryCostsForBusiness: {
        currentYearAmount: 0,
        previousYearAmount: 0,
        businessProfitAndLossDetails: [

        ],
      },
    },
    shares: {
      currentYearAmount: 1999,
      previousYearAmount: 0,
      transactions: [{
        previousYear: null,
        description: 'test',
        currentYear: {
          baseAmount: 0,
          correction: 999,
          finalAmount: 999,
        },
      }, {
        previousYear: null,
        description: 'test 2',
        currentYear: {
          baseAmount: 0,
          correction: 1000,
          finalAmount: 1000,
        },
      }],
    },
  },
]);

export const MOCK_DOSSIER_DATA = deepFreeze({
  declarationID: '0bff7dc2-4588-4bd6-a6ed-aae1004e788c',
  dossierManifest: {
    name: '2018_Forecast_0.1',
    taxableYear: 2018,
    dossierId: 'b5bc0902-1b59-4daa-9513-aae1004e7992',
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
      taxableSubjectId: '41334471-0441-4bb1-bda3-aad800717227',
      firstName: 'Malik',
      initials: null,
      middleName: 'B',
      lastName: 'D',
      bsn: '234234234',
      birthDate: '2019-09-30T06:51:02.906',
      deathDate: '2019-09-30T06:51:02.906',
      livingTogetherPreciseSituation: 0,
      maritalStatus: 1,
      age: -2,
      fullName: 'Malik B D',
    },
    fiscalPartner: {
      taxableSubjectId: 'd7181b7b-30ac-4aa1-919b-aad8007208f2',
      firstName: 'Nivi',
      initials: null,
      middleName: 'G',
      lastName: 'H',
      bsn: '54645234234',
      birthDate: '2019-09-30T06:53:42.523',
      deathDate: '2019-09-30T06:53:42.523',
      livingTogetherPreciseSituation: 0,
      maritalStatus: 1,
      age: -2,
      fullName: 'Nivi G H',
    },
  },
  businessDetails: {
    taxableSubjectBusinessDetails: [
      {
        globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
        businessName: 'L&T',
        businessActivities: 'construction',
        countryId: 1,
        countryName: 'India',
        businessStartDate: '2019-09-30T08:30:04.079',
        businessEndDate: '2019-09-30T08:30:04.079',
        rsin: '123123123123',
        businessFormId: 0,
        businessFormName: 'Besloten vennootschap',
        fiscalYearStartDate: '2019-09-30T08:30:04.079',
        fiscalYearEndDate: '2019-09-30T08:30:04.079',
        vpBusinessName: 'L&T',
      },
      {
        globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed47',
        businessName: 'Pharma',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-10-01T06:30:00Z',
        businessEndDate: null,
        rsin: '123456',
        businessFormId: 2,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-10-02T06:30:00Z',
        fiscalYearEndDate: '2019-10-09T06:30:00Z',
        vpBusinessName: 'Pharma',
        fromVPC: true,
        dataSourceId: 2,
      },
      {
        globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed52',
        businessName: 'Pharma',
        businessActivities: 'test',
        countryId: 3,
        countryName: 'Netherlands',
        businessStartDate: '2019-10-01T06:30:00Z',
        businessEndDate: null,
        rsin: '123456',
        businessFormId: 3,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-10-02T06:30:00Z',
        fiscalYearEndDate: '2019-10-09T06:30:00Z',
        vpBusinessName: 'Pharma',
        fromVPC: true,
        dataSourceId: 1,
      },
      {
        globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed55',
        businessName: 'Pharma',
        businessActivities: 'test',
        countryId: 3,
        countryName: 'Netherlands',
        businessStartDate: '2019-10-01T06:30:00Z',
        businessEndDate: null,
        rsin: '123456',
        businessFormId: 5,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-10-02T06:30:00Z',
        fiscalYearEndDate: '2019-10-09T06:30:00Z',
        vpBusinessName: 'Pharma',
        fromVPC: true,
        dataSourceId: 1,
      },
    ],
    fiscalPartnerBusinessDetails: [
      {
        globalAdministrationId: '38a273d3-5df8-4d32-872d-aad8008c5fb1',
        businessName: 'L&T',
        businessActivities: 'construction',
        countryId: 1,
        countryName: 'India',
        businessStartDate: '2019-09-30T08:30:04.079',
        businessEndDate: '2019-09-30T08:30:04.079',
        rsin: '123123123123',
        businessFormId: 0,
        businessFormName: 'Besloten vennootschap',
        fiscalYearStartDate: '2019-09-30T08:30:04.079',
        fiscalYearEndDate: '2019-09-30T08:30:04.079',
        vpBusinessName: 'L&T',
      },
      {
        globalAdministrationId: 'b91f1cd8-5284-4e78-a579-aae10050ed47',
        businessName: 'Pharma',
        businessActivities: 'test',
        countryId: 2,
        countryName: 'Netherlands',
        businessStartDate: '2019-10-01T06:30:00Z',
        businessEndDate: null,
        rsin: '123456',
        businessFormId: 2,
        businessFormName: 'Eenmanszaak',
        fiscalYearStartDate: '2019-10-02T06:30:00Z',
        fiscalYearEndDate: '2019-10-09T06:30:00Z',
        vpBusinessName: 'Pharma',
        fromVPC: true,
      },
    ],
  },
  profitAndLossDetails: {
    taxableSubjectProfitAndLoss: null,
    fiscalPartnerProfitAndLoss: null,
  },
  balanceSheetDetails: null,
});

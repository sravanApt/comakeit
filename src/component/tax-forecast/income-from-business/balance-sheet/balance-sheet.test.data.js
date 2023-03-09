import deepFreeze from 'deep-freeze';
import { INITIAL_BALANCE_SHEET_DATA } from './balance-sheet.constants';

export const ADMINISTRATION_IDS = deepFreeze({
  taxableSubjectBusinessId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
  fiscalPartnerBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
});

export const COMPANY_ID = 36131;
export const BALANCE_SHEET_TEST_ID = 'balance-sheet';
export const BALANCE_SHEET_CORRECTION_MODAL = 'balance-sheet-correction-modal';
export const BALANCE_SHEET_CORRECTION_FORM = 'balance-sheet-correction-modal-form';
export const BALANCE_SHEET_CORRECTION_FIELDS = deepFreeze([
  {
    selector: '.common-data-table__body .common-data-table__row .description input',
    value: 'description',
  },
  {
    selector: '.common-data-table__body .common-data-table__row .current-year-correction input',
    value: 1500,
  },
]);

export const VAT_CORRECTION_FIELDS = deepFreeze([
  {
    selector: '.common-data-table__body .common-data-table__row .vat-this-year input',
    value: 500,
  },
  {
    selector: '.common-data-table__body .common-data-table__row .vat-last-year input',
    value: 500,
  },
  {
    selector: '.common-data-table__body .common-data-table__row .vat-other-years input',
    value: 500,
  },
]);

export const MOCK_BALANCE_SHEET_DATA = deepFreeze({
  taxableSubjectBalanceSheet: [
    {
      globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
      ...{
        ...INITIAL_BALANCE_SHEET_DATA,
        shares: {
          transactions: [
            {
              description: 'test shares',
              previousYear: {
                baseAmount: null,
                correction: 1000,
                finalAmount: null,
              },
              currentYear: {
                purchaseValue: null,
                baseAmount: null,
                correction: 1000,
                finalAmount: 1000,
              },
            },
          ],
          previousYearAmount: 1000,
          currentYearAmount: 1000,
        },
      },
    },
    {
      globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
      assets: {
        intangibleFixedAssets: {
          intangibleAssets: [
            {
              description: 'intagible asset1',
              previousYear: {
                baseAmount: null,
                correction: 1000,
                finalAmount: null,
              },
              currentYear: {
                purchaseValue: null,
                baseAmount: null,
                correction: 100000,
                finalAmount: 100000,
              },
            },
            {
              description: 'intagible asset2',
              previousYear: {
                baseAmount: null,
                correction: null,
                finalAmount: null,
              },
              currentYear: {
                purchaseValue: null,
                baseAmount: null,
                correction: 100000,
                finalAmount: 100000,
              },
            },
          ],
          previousYearAmount: 100000,
          currentYearAmount: 100000,
        },
        tangibleFixedAssets: {
          tangibleAssets: [
            {
              description: 'tangible new',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 8383,
                correction: null,
                finalAmount: 8383,
              },
            },
            {
              description: 'tangible asstes',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 1000,
                finalAmount: 1000,
              },
              newRow: 0,
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 9383,
        },
        financialFixedAssets: {
          businessAccountBalance: [
            {
              description: 'businessAccountBalance1',
              previousYear: null,
              currentYear: {
                baseAmount: null,
                correction: 200000,
                finalAmount: 200000,
              },
            },
            {
              description: 'businessAccountBalance2',
              previousYear: null,
              currentYear: {
                baseAmount: null,
                correction: 100000,
                finalAmount: 100000,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 200000,
        },
        stockOrInventory: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        receivables: {
          receivables: [
            {
              description: 'receivables 1',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 19950,
                correction: null,
                finalAmount: 19950,
              },
            },
            {
              description: 'receivables 2',
              previousYear: null,
              currentYear: {
                nominalValue: null,
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 19950,
                correction: null,
                finalAmount: 19950,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 19950,
        },
        liquidAssets: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        securities: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
      },
      liabilities: {
        equityCapital: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        provisions: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        longTermLiabilities: {
          businessAccountBalance: null,
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        shortTermLiabilities: {
          shortTermLiabilities: [
            {
              description: 'shortTermLiabilities 1',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 50000,
                correction: null,
                finalAmount: 50000,
              },
            },
            {
              description: 'shortTermLiabilities test',
              previousYear: null,
              currentYear: {
                vatThisYear: null,
                vatPreviousYear: null,
                vatOtherYears: null,
                baseAmount: 10000,
                correction: 100,
                finalAmount: 10100,
              },
              newRow: 0,
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 60100,
        },
      },
      shares: {
        transactions: [
          {
            description: 'test shares',
            previousYear: {
              baseAmount: null,
              correction: 1000,
              finalAmount: null,
            },
            currentYear: {
              purchaseValue: null,
              baseAmount: null,
              correction: 1000,
              finalAmount: 1000,
            },
          },
        ],
        previousYearAmount: 1000,
        currentYearAmount: 1000,
      },
      depositsAndWithdrawals: {
        depositDetails: {
          transactions: [
            {
              description: 'tangible new',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 8383,
                correction: null,
                finalAmount: 8383,
              },
            },
            {
              description: 'tangible new 2',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 83843,
                correction: null,
                finalAmount: 83843,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
        withdrawalDetails: {
          transactions: [
            {
              description: 'tangible new',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 8383,
                correction: null,
                finalAmount: 8383,
              },
            },
            {
              description: 'tangible new 2',
              previousYear: null,
              currentYear: {
                purchaseValue: null,
                residualValue: null,
                baseValue: null,
                baseAmount: 83843,
                correction: null,
                finalAmount: 83843,
              },
            },
          ],
          previousYearAmount: 0,
          currentYearAmount: 0,
        },
      },
    },
  ],
  fiscalPartnerBalanceSheet: [
    {
      globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
      ...INITIAL_BALANCE_SHEET_DATA,
    },
  ],
});

export const MOCK_DOSSIER_DATA = deepFreeze({
  declarationID: '7cd8700b-f602-4a1e-bc36-aae2008cd449',
  dossierManifest: {
    name: '2019_Forecast_0.1',
    taxableYear: 2019,
    dossierId: '2bcd9bc9-5b67-49ca-bd00-aae2008cd516',
    taxationFormID: 1,
    taxFormType: 'P-Biljet',
    declarationTypeId: 1,
    isJointDeclaration: true,
    declarationStatusId: 1,
    taxLicenseNumber: null,
    version: '0.1',
    declarationType: 'Prognose',
  },
  personalDetails: {
    taxableSubjectDetails: {
      taxableSubjectId: '61ff9fe2-7bd9-4867-b7ef-aaa8008714fd',
      firstName: 'Isaak',
      initials: null,
      middleName: '',
      lastName: '',
      bsn: '34234234',
      birthDate: '2019-08-13T08:09:45.737',
      deathDate: '2019-08-13T08:09:45.737',
      livingTogetherPreciseSituation: 0,
      maritalStatus: 1,
      age: 0,
      fullName: 'Isaak  ',
    },
    fiscalPartner: {
      taxableSubjectId: '922050ab-0423-4084-97d6-aacd008d9c81',
      firstName: 'bella',
      initials: null,
      middleName: 'isa',
      lastName: 'van',
      bsn: '23-23',
      birthDate: '1990-09-19T08:22:58.006',
      deathDate: null,
      livingTogetherPreciseSituation: 0,
      maritalStatus: 1,
      age: 29,
      fullName: 'bella isa van',
    },
    relationShipSituation: {
      partnerDeathDate: null,
      divorceDate: null,
      periodOfLivingTogether: {
        startDate: null,
        endDate: null,
      },
      isFiscalPartnerCriteriaMet: false,
      marriageDate: null,
      applyFiscalPartnerForWholeYear: false,
    },
    children: null,
  },
  businessDetails: {
    taxableSubjectBusinessDetails: [
      {
        globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
        businessName: 'Farming',
        businessActivities: 'Farming',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-25',
        businessFormId: 3,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
        dataSourceId: 1,
      },
      {
        globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
        businessName: 'Pharma',
        businessActivities: 'Farminf',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-215',
        businessFormId: 5,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
        dataSourceId: 1,
      },
    ],
    fiscalPartnerBusinessDetails: [
      {
        globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
        businessName: 'Pharma',
        businessActivities: 'Farming',
        countryId: 1,
        countryName: 'Netherlands',
        businessStartDate: '1990-09-19T08:35:42.021',
        businessEndDate: '2019-09-19T08:35:42.021',
        rsin: '23-215',
        businessFormId: 1,
        businessFormName: null,
        fiscalYearStartDate: '2019-01-01T00:00:00',
        fiscalYearEndDate: '2019-12-31T00:00:00',
        vpBusinessName: 'Farm',
        fromVPC: true,
      },
    ],
  },
  balanceSheetDetails: {
    taxableSubjectBusinessDetails: null,
    fiscalPartnerBusinessDetails: null,
  },
});

export const MOCK_DEPOSIT_WITHDRAWAL_DATA = deepFreeze({
  description: 'test description',
  amount: 1499,
});

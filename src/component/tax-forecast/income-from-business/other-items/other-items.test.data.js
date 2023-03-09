import deepFreeze from 'deep-freeze';
import { DEFAULT_OTHER_ITEMS_DATA } from './other-items.constants';

export const OTHER_ITEMS_CORRECTION_MODAL = 'other-items-correction-modal';
export const OTHER_ITEMS_CORRECTION_FORM = 'other-items-correction-modal-form';
export const MOCK_DEPOSIT_WITHDRAWAL_DATA = deepFreeze({
  description: 'test description',
  amount: 1500,
});

export const MOCK_OTHER_ITEMS_DEFAULT_DATA = deepFreeze({
  taxableSubjectOtherItems: [
    {
      globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
      ...DEFAULT_OTHER_ITEMS_DATA,
    },
  ],
  fiscalPartnerOtherItems: [
    {
      globalAdministrationId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c',
      ...DEFAULT_OTHER_ITEMS_DATA,
    },
  ],
});

export const MOCK_OTHER_ITEMS_TEST_DATA = deepFreeze([
  {
    globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
    businessResult: {
      nonOrPartlyDeductableCost: {
        nonDeductableCost: [
          {
            description: 'Test data',
            prevYearAmount: 1000,
            amount: 5000,
          },
          {
            description: 'Test data 2',
            prevYearAmount: 2000,
            amount: 3000,
          },
        ],
        previousYearAmount: 1000,
        currentYearAmount: 5000,
      },
      equalizationReserve: {
        equalizationReserveER: [{
          description: 'reserve 1',
          opening: 100,
          allocation: 50,
          release: 20,
          closing: 6000,
        }, {
          description: 'reserve 2',
          opening: 5000,
          allocation: 100,
          release: 200,
          closing: 5000,
        }],
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
      reinvestmentReserve: {
        reinvestmentReserveHIR: [],
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
      taxationExemptComponents: {
        taxationExempts: [],
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
      cessationProfit: {
        cessationProfits: [{
          description: 'cessation 1',
          amount: 1500,
        }, {
          description: 'cessation 2',
          amount: 5500,
        }],
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
      investmentDeduction: {
        deductions: {
          investmentDeductions: [{
            description: 'test',
            commissioningDate: '2020-02-02',
            share: 25,
            claimKIA: false,
            amountKIA: 1200,
            amountPaid: 1000,
            claimEIA: true,
            amountEIA: 1000,
            eiaReferenceNumber: 'E123456789',
            claimMIA: false,
            amountMIA: 2000,
            miaReferenceNumber: 'M123456789',
            miaLetter: 'A',
            disinvestmentAddditionAmount: 0,
            percentageKIA: 25,
          }, {
            description: 'test data 2',
            commissioningDate: '2020-02-02',
            share: 25,
            claimKIA: false,
            amountKIA: 1200,
            amountPaid: 1000,
            claimEIA: false,
            amountEIA: 1000,
            eiaReferenceNumber: 'E123456789',
            claimMIA: false,
            amountMIA: 2000,
            miaReferenceNumber: 'M123456789',
            miaLetter: 'A',
            disinvestmentAddditionAmount: 0,
            percentageKIA: 25,
          }],
          remainderInvestmentDeduction: [{
            description: 'test',
            amount: 150000,
          }],
        },
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
      divestmentAddition: {
        divestment: [{
          description: 'test addition 1',
          commissioningDate: '2020-02-02',
          base: 1000,
          percentageKIA: 50,
        }, {
          description: 'test addition 2',
          commissioningDate: '2020-02-02',
          base: 4000,
          percentageKIA: 70,
        }],
        previousYearAmount: 0,
        currentYearAmount: 0,
      },
    },
  },
]);

export const BOKKZ_INVESTMENT_DATA = deepFreeze({
  content: { totalInvestmentDeduction: 10 },
  meta: { totalRecords: 1 },
  errors: null,
});

export const BOKKZ_DIVESTMENT_DATA = deepFreeze({
  content: { divestmentAddition: null },
  meta: { totalRecords: 1 },
  errors: null,
});

export const MOCK_OTHER_ITEMS_EMPTY_TEST_DATA = deepFreeze([
  {
    globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c',
    depositsAndWithdrawals: {
      withdrawals: [],
      deposits: [],
    },
    businessResult: {
      nonOrPartlyDeductableCost: null,
      equalizationReserve: null,
      reinvestmentReserve: null,
      taxationExemptComponents: null,
      cessationProfit: null,
      investmentDeduction: null,
      divestmentAddition: null,
    },
  },
]);

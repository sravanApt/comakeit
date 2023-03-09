import React from 'react';
import deepFreeze from 'deep-freeze';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { getPreviousYear, getCurrentYear } from '../../../../common/utils';
import { TableCellWrapper } from '../../../../common/styled-wrapper';

export const OTHER_ITEMS_DETAILS = 'otherItemsDetails';

export const OTHER_ITEMS_OBJECT_KEYS = deepFreeze({
  fiscalPartner: 'fiscalPartnerOtherItems',
  taxableSubject: 'taxableSubjectOtherItems',
});

export const MIA_LETTER_OPTIONS = deepFreeze([
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
]);

export const INVESTMENT_DEDUCTION = 'investmentDeduction';
export const LABELS = deepFreeze({
  businessResult: translate('business-result'),
  nonOrPartlyDeductableCost: translate('non-partly-deductable-costs'),
  equalizationReserve: translate('allocation-release-equalisation-reserve'),
  reinvestmentReserve: translate('allocation-release-reinvestment-reserve'),
  taxationExemptComponents: translate('tax-exempt-components'),
  cessationProfit: translate('cessation-profit'),
  investmentDeduction: translate('investment-deduction'),
  divestmentAddition: translate('divestment-addition'),
  allocationOrReleaseFiscalPensionReserveForEreterpreneur: translate('allocation-release-fiscal-pension-reserve'),
});

export const OTHER_ITEMS_CHILD_KEYS = deepFreeze({
  nonOrPartlyDeductableCost: 'nonDeductableCost',
  equalizationReserve: 'equalizationReserveER',
  reinvestmentReserve: 'reinvestmentReserveHIR',
  taxationExemptComponents: 'taxationExempts',
  cessationProfit: 'cessationProfits',
  investmentDeduction: 'deductions',
  divestmentAddition: 'divestment',
});

export const REPORT_KEYS = {
  deductions: 'InvestmentDeduction',
  divestment: 'DivestmentAddition',
};

export const COMMON_TABLE_HEADER = [{
  id: 1,
  label: '',
  className: 'mirage-label',
}];

export const ROW_TEMPLATES = {
  partlyDeductableOrTaxExemptSection: {
    description: '', prevYearAmount: 0, amount: 0,
  },
  allocationReserveSection: {
    description: '', opening: 0, allocation: 0, release: 0, closing: 0,
  },
  cessationProfit: {
    description: '', prevYearAmount: 0, amount: 0,
  },
  divestmentAddition: {
    description: '', commissioningDate: null, base: null, percentageKIA: null,
  },
  investmentDeduction: {
    description: '',
    commissioningDate: null,
    share: null,
    claimKIA: false,
    amountKIA: null,
    amountPaid: 0,
    claimEIA: false,
    amountEIA: null,
    eiaReferenceNumber: null,
    claimMIA: false,
    amountMIA: null,
    miaReferenceNumber: null,
    miaLetter: null,
    disinvestmentAddditionAmount: 0,
    percentageKIA: null,
  },
};

export const INVESTMENT_DEDUCTION_COLUMN_GROUP = [
  {
    id: 51,
    label: translate('description'),
    className: 'col-description',
  },
  {
    id: 52,
    label: translate('commissioning-date'),
    className: 'col-correction',
  },
  {
    id: 53,
    label: translate('claim-kia'),
    className: 'col-correction right',
  },
  {
    id: 54,
    label: translate('amount-kia'),
    className: 'col-correction text-align-right right',
  },
  {
    id: 55,
    label: translate('share'),
    className: 'col-correction text-align-right right',
  },
  {
    id: 56,
    label: () => <TableCellWrapper title={translate('amount-paid')}>{translate('amount-paid')}</TableCellWrapper>,
    className: 'col-correction text-align-right right',
  },
  {
    id: 57,
    label: translate('claim-eia'),
    className: 'col-correction right',
  },
  {
    id: 58,
    label: translate('amount-eia'),
    className: 'col-correction text-align-right right',
  },
  {
    id: 59,
    label: translate('eia-reference-number'),
    className: 'col-correction right',
  },
  {
    id: 60,
    label: translate('claim-mia'),
    className: 'col-correction right',
  },
  {
    id: 61,
    label: translate('amount-mia'),
    className: 'col-correction text-align-right right',
  },
  {
    id: 62,
    label: translate('mia-reference-number'),
    className: 'col-correction right',
  },
  {
    id: 63,
    label: translate('mia-letter'),
    className: 'col-correction right',
  },
  {
    id: 64,
    label: '',
    className: 'col-actions',
  },
];

export const ALLOCATION_RESERVE_COSTS_COLUMN_GROUP = [
  {
    id: 71,
    label: translate('description'),
    className: 'col-description',
  },
  {
    id: 72,
    label: translate('opening'),
    className: 'col-correction col-opening text-align-right',
  },
  {
    id: 73,
    label: translate('allocation'),
    className: 'col-correction text-align-right',
  },
  {
    id: 74,
    label: translate('release'),
    className: 'col-correction text-align-right',
  },
  {
    id: 75,
    label: translate('closing'),
    className: 'col-correction text-align-right',
  },
  {
    id: 76,
    label: '',
    className: 'col-actions',
  },
];

export const DIVESTMENT_ADDITION_COLUMN_GROUP = [
  {
    id: 81,
    label: translate('description'),
    className: 'col-description',
  },
  {
    id: 82,
    label: translate('commissioning-date'),
    className: 'col-correction right',
  },
  {
    id: 83,
    label: translate('base'),
    className: 'col-correction col-base text-align-right right',
  },
  {
    id: 84,
    label: () => <TableCellWrapper title={translate('percentage-kia')}>{translate('percentage-kia')}</TableCellWrapper>,
    className: 'col-correction right',
  },
  {
    id: 85,
    label: '',
    className: 'col-actions',
  },
];


export const partlyDeductableOrTaxExemptSectionColumns = (year) => [
  {
    id: 91,
    label: translate('description'),
    className: 'mirage-label col-description',
  },
  {
    id: 92,
    label: getPreviousYear(year),
    className: 'mirage-label text-align-right',
  },
  {
    id: 93,
    label: getCurrentYear(year),
    className: 'mirage-label text-align-right',
  },
  {
    id: 94,
    label: '',
    className: 'col-actions',
  },
];

export const cessationProfitColumns = (year) => [
  {
    id: 95,
    label: translate('description'),
    className: 'mirage-label col-description',
  },
  {
    id: 96,
    label: getCurrentYear(year),
    className: 'mirage-label text-align-right col-correction',
  },
  {
    id: 97,
    label: '',
    className: 'col-actions',
  },
];

const DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS = deepFreeze({
  currentYearAmount: 0,
  previousYearAmount: 0,
});

export const DEFAULT_OTHER_ITEMS_BUSINESS_RESULT = deepFreeze({
  profitLossData: {
    description: translate('business-result'),
    ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
  },
});

export const DEFAULT_OTHER_ITEMS_DATA = deepFreeze({
  businessResult: {
    nonOrPartlyDeductableCost: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      nonDeductableCost: [],
    },
    equalizationReserve: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      equalizationReserveER: [],
    },
    reinvestmentReserve: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      reinvestmentReserveHIR: [],
    },
    taxationExemptComponents: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      taxationExempts: [],
    },
    cessationProfit: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      cessationProfits: [],
    },
    investmentDeduction: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      deductions: {
        investmentDeductions: [],
        remainderInvestmentDeduction: [],
      },
    },
    divestmentAddition: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
      divestment: [],
    },
    allocationOrReleaseFiscalPensionReserveForEreterpreneur: {
      ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
    }
  },
});

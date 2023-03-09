import deepFreeze from 'deep-freeze';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { getPreviousYear, getCurrentYear } from '../../../../common/utils';

export const PROFIT_LOSS_DETAILS = 'profitAndLossDetails';
export const PL_BENEFITS = 'plBenefitsDetails';
export const PL_COSTS = 'plCostDetails';
export const COST_OF_BUSINESS = 'costsOfBusiness';
export const REVENUE = 'revenue';
export const AMOUNT_CORRECTION = 'amountCorrection';
export const AMOUNT_VPC = 'amountVPC';
export const CURRENT_YEAR_AMOUNT = 'currentYearAmount';
export const PREVIOUS_YEAR_AMOUNT = 'previousYearAmount';
export const BUSINESS_PROFIT_AND_LOSS_DETAILS = 'businessProfitAndLossDetails';
export const SHARES = 'shares';
export const SHARES_IN_EQUITY_CAPITAL = 'transactions';

export const LABELS = deepFreeze({
  revenue: translate('revenue'),
  shares: translate('allocation-result'),
  totalShares: translate('total-allocation-result-to-partner'),
  financialBenifitsForBusiness: translate('financial-benefits'),
  extraordinaryBenefitsForBusiness: translate('extraordinary-benefits'),
  purchaseCost: translate('purchase-costs'),
  personalCost: translate('personal-costs'),
  depreciationCost: translate('depreciation-costs'),
  carAndTransportationCost: translate('car-and-transportation-costs'),
  housingCost: translate('housing-costs'),
  sellingCost: translate('selling-csots'),
  otherCost: translate('other-costs'),
  financialCostsForBusiness: translate('financial-costs'),
  extraordinaryCostsForBusiness: translate('extaordinary-costs'),
  totalIncome: translate('total-income-a'),
  totalBusinessCost: translate('total-business-costs-b1'),
  totalFinanceCost: translate('total-financial-and-extraordinary-costs-b2'),
  totalCost: translate('total-cost-b'),
  result: translate('result-c'),
});

export const PROFIT_LOSS_OBJECT_KEYS = deepFreeze({
  fiscalPartner: 'fiscalPartnerProfitAndLoss',
  taxableSubject: 'taxableSubjectProfitAndLoss',
});

export const currentPreviousColums = (year) => [
  {
    id: 2,
    label: getPreviousYear(year),
    className: 'mirage-label text-align-right',
  },
  {
    id: 3,
    label: getCurrentYear(year),
    className: 'mirage-label text-align-right',
  },
];

export const SHARES_COLUMNS = [{
  id: 1,
  label: translate('allocation-result-to-partner'),
  className: 'mirage-label',
}];

export const revenueColumns = (year) => [
  {
    id: 1,
    label: translate('revenue'),
    className: 'mirage-label',
  },
  ...currentPreviousColums(year),
];

export const businessCostColumns = (year) => [
  {
    id: 1,
    label: translate('business-costs'),
    className: 'mirage-label',
  },
  ...currentPreviousColums(year),
];

export const PROFIT_LOSS_COLUMNS = deepFreeze({
  plBenefitsDetails: [
    {
      id: 1,
      label: translate('financial-and-extraordinary-benefits'),
      className: 'mirage-label',
    },
  ],
  financialCost: [
    {
      id: 1,
      label: translate('financial-and-extraordinary-costs'),
      className: 'mirage-label',
    },
  ],
});

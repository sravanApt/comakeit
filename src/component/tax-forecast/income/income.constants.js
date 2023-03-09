import React from 'react';
import deepFreeze from 'deep-freeze';
import { incomeTranslate as translate } from './income-translate';
import { TableCellWrapper } from '../../../common/styled-wrapper';

export const incomeKeyTypeArray = ['taxableSubjectIncome', 'fiscalPartnerIncome'];

export const incomeFieldName = 'income';

export const SECTION_KEYS = ['taxableSubjectSections', 'fiscalPartnerSections'];

export const SECTION_LIST = deepFreeze([
  { label: translate('current-employment-income'), value: 0 },
  { label: translate('previous-employment-income'), value: 1 },
  { label: translate('taxable-income-abroad'), value: 2 },
  { label: translate('exempted-income-from-international-organization'), value: 3 },
  { label: translate('gain-or-cost-from-other-activities'), value: 4 },
  { label: translate('gain-or-cost-from-making-assets-available-to-own-company'), value: 5 },
  { label: translate('assets-and-liabilities'), value: 6 },
  { label: translate('alimony'), value: 7 },
  { label: translate('income-and-cost-from-benefits'), value: 8 },
  { label: translate('refund-expenses'), value: 9 },
  { label: translate('income-based-on-transitional-law'), value: 10 },
]);

export const incomeSectionalKeysArray = deepFreeze([
  // Parent key, array with children keys
  ['taxableWages', ['currentEmploymentIncome']],
  ['taxableWages', ['previousEmploymentIncome']],
  ['taxableWages', ['taxableIncomeAbroad']],
  ['taxableWages', ['exemptedIncomeFromInternationalOrganization']],
  ['gainCostFromOtherActivities', ['gainFromOtherActivities', 'costOfOtherActivities']],
  ['gainCostFromOtherActivities', ['gainFromAssetsToOwnCompany', 'costFromAssetsToOwnCompany']],
  ['gainCostFromOtherActivities', ['otherAssets', 'tangibleProperty', 'otherActivitiesLiabilities']],
  ['incomeOutOfBenefits', ['alimony', 'costToAlimony']],
  ['incomeOutOfBenefits', ['incomeFromBenefits', 'costToBenefits']],
  ['', ['refundedPremium', 'refundedExpenses']],
  ['', ['otherIncome']],
]);

export const defaultYesOrNoOptions = deepFreeze([
  { label: translate('yes'), value: true },
  { label: translate('no'), value: false },
]);

export const tableHeaderCells = deepFreeze({
  description: {
    id: 11,
    label: translate('description'),
    className: 'mirage-label',
  },
  amount: {
    id: 12,
    label: () => <TableCellWrapper title={translate('amount')}>{translate('amount')}</TableCellWrapper>,
    className: 'mirage-label text-align-right',
  },
  wagesTax: {
    id: 13,
    label: () => <TableCellWrapper title={translate('withheld-wages-tax')}>{translate('withheld-wages-tax')}</TableCellWrapper>,
    className: 'col-tax text-align-right',
  },
  actions: {
    id: 14,
    label: translate('actions'),
    className: 'col-actions',
  },
  income: {
    id: 15,
    label: () => <TableCellWrapper title={translate('income')}>{translate('income')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  cost: {
    id: 16,
    label: () => <TableCellWrapper title={translate('cost')}>{translate('cost')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  employmentDiscount: {
    id: 12,
    label: () => <TableCellWrapper title={translate('employment-discount')}>{translate('employment-discount')}</TableCellWrapper>,
    className: 'col-discount text-align-right',
  },
});

export const NL_COUNTRY_CODE = 1;
export const BELGIUM_GERMANY_COUNTRY_CODES = deepFreeze([12, 23]);

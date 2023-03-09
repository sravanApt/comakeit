import React from 'react';
import deepFreeze from 'deep-freeze';
import * as Yup from 'yup';
import { assetsTranslate as translate } from './assets-translate';
import { TableCellWrapper } from '../../../common/styled-wrapper';

export const ASSETS_KEY = 'assetsScreen';
export const ASSETS_KEYS_ARRAY = ['jointAssets'];
export const OWN_HOME_SECTION_KEY = 'own-home';
export const OTHER_PROPERTIES_SECTION_KEY = 'other-properties';
export const BANK_ACCOUNT_SECTION_KEY = 'bank-account';
export const INVESTMENTS_ACCOUNT_SECTION_KEY = 'investment-accounts';
export const ENVIRONMENTAL_INVESTMENTS_SECTION_KEY = 'environmental-investments';
export const OTHER_PROPERTIES_REPORT_KEY = 'AssetsImmovableOtherProperty';

export const ASSETS_SECTIONAL_KEYS_LIST = [
  'substantialInterests',
  'ownHomes',
  'otherProperties',
  'bankAccounts',
  'investmentAccounts',
  'environmentalInvestments',
  'periodicalBenefits',
  'outStandingLoansOrCash',
  'otherAssets',
  'nonExemptCapitalInsurances',
];

export const SECTION_LIST = deepFreeze([
  { label: translate('substantial-interest'), value: 0 },
  { label: translate('own-home'), value: 1 },
  { label: translate('other-properties'), value: 2 },
  { label: translate('bank-account'), value: 3 },
  { label: translate('investment-accounts'), value: 4 },
  { label: translate('environmental-investments'), value: 5 },
  { label: translate('net-worth-of-periodical-benefits'), value: 6 },
  { label: translate('outstanding-loan-or-cash'), value: 7 },
  { label: translate('other-assets'), value: 8 },
  { label: translate('non-exempt-capital-insurance'), value: 9 },
]);

export const RENTED_OR_LEASED_OPTIONS = deepFreeze([
  { label: translate('no'), value: 0 },
  { label: translate('rented'), value: 1 },
  { label: translate('leased'), value: 2 },
]);

export const formFieldSpans = deepFreeze({
  labelSpan: 6,
  fieldSpan: 6,
});

export const OWN_HOME_AND_OTHER_PROPERTIES_COLUMNS = (sectionKey) => {
  const commonLabels = [
    {
      id: 1,
      label: () => <TableCellWrapper width="120px">{translate('description-label')}</TableCellWrapper>,
    },
    {
      id: 2,
      label: () => <TableCellWrapper>{translate('belongs-to')}</TableCellWrapper>,
    },
    // TODO: revert after got confirmation from PO
    // {
    //   id: 3,
    //   label: () => <TableCellWrapper width="130px">{translate('monumental-property')}</TableCellWrapper>,
    // },
    {
      id: 4,
      label: () => <TableCellWrapper width="80px">{translate('ownership')}</TableCellWrapper>,
    },
    {
      id: 5,
      label: () => <TableCellWrapper>{translate('woz-value')}</TableCellWrapper>,
    },
  ];

  if (sectionKey === 'own-home') {
    return [
      ...commonLabels,
      {
        id: 7,
        label: translate('actions'),
      },
    ];
  }
  return [
    ...commonLabels,
    {
      id: 6,
      label: () => <TableCellWrapper width="130px">{translate('calculated-value')}</TableCellWrapper>,
    },
    {
      id: 7,
      label: translate('actions'),
    },
  ];
};

export const SELECT_PROPS = {
  className: 'select-wrapper',
  type: 'selectOne',
  controlType: 'autocomplete',
  width: '160px',
  placeholder: translate('select'),
  hideSelectedOptions: false,
  menuPortalTarget: true,
};

export const INPUT_PROPS = {
  type: 'text',
  width: '130px',
};

const bankAccountSchema = Yup.object().shape({
  description: Yup.string().when('amount', {
    is: (amount) => !!Number(amount),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  belongsTo: Yup.string().test('belongs-to-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? !!value : true);
  }).nullable(),
  accountNumber: Yup.string().max(500, translate('invalid-entry')).test('account-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? !!value : true);
  }).nullable(),
  countryId: Yup.string().test('country-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? !!value : true);
  }).nullable(),
  amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? (value === '0' || !!Number(value)) : true);
  }).nullable(),
});

const amountDescriptionSchema = Yup.object().shape({
  description: Yup.string().when('amount', {
    is: (amount) => !!Number(amount),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  belongsTo: Yup.string().test('belongs-to-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? !!value : true);
  }).nullable(),
  amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? (value === '0' || !!Number(value)) : true);
  }).nullable(),
});

export const ASSETS_VALIDATION = Yup.object().shape({
  jointAssets: Yup.object({
    bankAccounts: Yup
      .array()
      .of(bankAccountSchema).nullable(),
    investmentAccounts: Yup
      .array()
      .of(bankAccountSchema).nullable(),
    environmentalInvestments: Yup
      .array()
      .of(bankAccountSchema).nullable(),
    periodicalBenefits: Yup
      .array()
      .of(amountDescriptionSchema).nullable(),
    outStandingLoansOrCash: Yup
      .array()
      .of(amountDescriptionSchema).nullable(),
    otherAssets: Yup
      .array()
      .of(amountDescriptionSchema).nullable(),
    nonExemptCapitalInsurances: Yup
      .array()
      .of(amountDescriptionSchema).nullable(),
  }).nullable(),
}).nullable();

export const DEFAULT_COUNTRY_ID = 1;
export const DEFAULT_OWNER_ID = 1;
export const BOTH_OWNER_ID = 3;

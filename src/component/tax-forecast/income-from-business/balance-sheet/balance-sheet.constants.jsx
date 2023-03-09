import React from 'react';
import deepFreeze from 'deep-freeze';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import {
  HeadCell,
  CurrencyCell,
  FooterCell,
  DescriptionCell,
  ActionsCell,
  CurrencyLabelCell,
} from '../../../../common/table-cell-templates';
import {
  startDateofYear, endDateofYear, getTotalValue,
} from '../../../../common/utils';
import { manageCorrection } from '../common/utils';
import { TableCellWrapper, DescriptionCellWrapper, CurrencyCellWrapper } from '../../../../common/styled-wrapper';
import { DESCRIPTION_INPUT_WIDTH } from '../../../../common/constants';

export const BALANCE_SHEET_DETAILS = 'balanceSheetDetails';

export const DEFAULT_TANGIBLE_ASSETS_DESCRIPTION = translate('buildings');

export const BALANCE_SHEET_TYPES = deepFreeze({
  assets: 'assets',
  liabilities: 'liabilities',
  shares: 'shares',
  depositsAndWithdrawals: 'depositsAndWithdrawals',
});

export const LABELS = deepFreeze({
  intangibleFixedAssets: translate('intangible-fixed-assets'),
  tangibleFixedAssets: translate('tangible-fixed-assets'),
  financialFixedAssets: translate('financial-fixed-assets'),
  stockOrInventory: translate('stock-or-inventory'),
  receivables: translate('receivables'),
  liquidAssets: translate('liquid-assets'),
  securities: translate('securities'),
  equityCapital: translate('equity-capital'),
  provisions: translate('provisions'),
  longTermLiabilities: translate('long-term-liabilities'),
  shortTermLiabilities: translate('short-term-liabilities'),
  totalAssets: translate('total-assets'),
  totalLiabilities: translate('total-liabilities'),
  shares: translate('share-in-equity-capital'),
  totalShares: translate('total-share-in-equity-capital'),
  depositDetails: translate('deposits'),
  withdrawalDetails: translate('withdrawals'),
});

export const DEFAULT_DESCRIPTION = translate('value-added-tax');

export const BALANCE_SHEET_OBJECT_KEYS = deepFreeze({
  fiscalPartner: 'fiscalPartnerBalanceSheet',
  taxableSubject: 'taxableSubjectBalanceSheet',
});

export const ASSETS_LIABILITIES_CHILDREN_KEYS = deepFreeze({
  intangibleFixedAssets: 'intangibleAssets',
  tangibleFixedAssets: 'tangibleAssets',
  financialFixedAssets: 'businessAccountBalance',
  stockOrInventory: 'businessAccountBalance',
  receivables: 'receivables',
  liquidAssets: 'businessAccountBalance',
  securities: 'businessAccountBalance',
  equityCapital: 'businessAccountBalance',
  provisions: 'businessAccountBalance',
  longTermLiabilities: 'businessAccountBalance',
  shortTermLiabilities: 'shortTermLiabilities',
  shares: 'transactions',
  depositDetails: 'transactions',
  withdrawalDetails: 'transactions',
});

export const EMPTY_ROW = deepFreeze({
  description: '', currentYear: { baseAmount: 0, correction: 0, finalAmount: 0 }, previousYear: { baseAmount: 0, correction: 0, finalAmount: 0 },
});

export const INTANGIBLE_ASSETS_ROW_TEMPLATE = {
  ...EMPTY_ROW,
  currentYear: {
    ...EMPTY_ROW.currentYear, purchaseValue: 0,
  },
  newRow: 0,
};

export const TANGIBLE_ASSETS_ROW_TEMPLATE = {
  ...EMPTY_ROW,
  currentYear: {
    ...EMPTY_ROW.currentYear, purchaseValue: 0, residualValue: 0, baseValue: 0,
  },
};

export const RECEIVABLES_ROW_TEMPLATE = {
  ...EMPTY_ROW,
  currentYear: {
    ...EMPTY_ROW.currentYear, vatThisYear: 0, vatPreviousYear: 0, vatOtherYears: 0, nominalValue: 0,
  },
};

export const COMMON_ASSETS_LIABILITIES_ROW_TEMPLATE = { ...EMPTY_ROW, newRow: 0 };

export const SHORT_TERM_LIABILITIES_ROW_TEMPLATE = {
  ...EMPTY_ROW,
  currentYear: {
    ...EMPTY_ROW.currentYear, vatThisYear: 0, vatPreviousYear: 0, vatOtherYears: 0,
  },
};

export const INITIAL_BALANCE_SHEET_DATA = deepFreeze({
  assets: {
    intangibleFixedAssets: {
      intangibleAssets: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    tangibleFixedAssets: {
      tangibleAssets: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    financialFixedAssets: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    stockOrInventory: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    receivables: {
      receivables: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    securities: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    liquidAssets: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
  },
  liabilities: {
    equityCapital: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    provisions: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    longTermLiabilities: {
      businessAccountBalance: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    shortTermLiabilities: {
      shortTermLiabilities: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
  },
  shares: {
    transactions: [],
    previousYearAmount: 0,
    currentYearAmount: 0,
  },
  depositsAndWithdrawals: {
    depositDetails: {
      transactions: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
    withdrawalDetails: {
      transactions: [],
      previousYearAmount: 0,
      currentYearAmount: 0,
    },
  },
});

const DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS = deepFreeze({
  currentYearAmount: 0,
  previousYearAmount: 0,
});

export const DEFAULT_BUSINESS_RESULT = deepFreeze({
  profitLossData: {
    description: translate('business-result'),
    ...DEFAULT_PREVIOUS_CURRENT_YEAR_AMOUNTS,
  },
  balanceSheetData: 0,
});

export const getCommonColumnGroup = (taxableYear) => [
  {
    id: 1,
    label: () => translate('description'),
    className: 'col-description',
  },
  {
    id: 2,
    label: () => <HeadCell name={translate('commercial')} date={startDateofYear(taxableYear)} />,
    className: 'mirage-label text-align-right',
  },
  {
    id: 3,
    label: () => `${translate('correction')}`,
    className: 'mirage-label text-align-right',
  },
  {
    id: 4,
    label: () => <HeadCell name={translate('fiscal')} date={startDateofYear(taxableYear)} />,
    className: 'mirage-label text-align-right',
  },
  {
    id: 5,
    label: () => <HeadCell name={translate('commercial')} date={endDateofYear(taxableYear)} />,
    className: 'mirage-label text-align-right',
  },
  {
    id: 6,
    label: () => `${translate('correction')}`,
    className: 'mirage-label text-align-right current-year-correction',
  },
  {
    id: 7,
    label: () => <HeadCell name={translate('fiscal')} date={endDateofYear(taxableYear)} />,
    className: 'mirage-label text-align-right',
  },
];

export const getCommonRowTemplate = (fieldNamePrefix, displayCorrectionAsLabel = false) => ({
  startCommercial: ({ previousYear }) => <CurrencyLabelCell value={previousYear?.baseAmount || 0} />,
  startCorrection: ({ index, description, previousYear }) => (displayCorrectionAsLabel ? <CurrencyLabelCell value={(previousYear?.correction || 0)} />
    : (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.previousYear.correction`}
        disabled={!description}
        dataTa={`previous-year-correction${index}`}
      />
    )),
  startFiscal: ({ previousYear }) => <CurrencyLabelCell value={(previousYear?.baseAmount || 0) + manageCorrection(previousYear?.correction || 0)} />,
  endCommercial: ({ currentYear }) => <CurrencyLabelCell value={currentYear?.baseAmount || 0} />,
  endCorrection: ({ index, description }) => (
    <CurrencyCell
      name={`${fieldNamePrefix}.${index}.currentYear.correction`}
      disabled={description === translate('rounding-difference') || !description}
      dataTa={`current-year-correction${index}`}
    />
  ),
  endFiscal: ({ currentYear }) => <CurrencyLabelCell value={(currentYear?.baseAmount || 0) + manageCorrection(currentYear?.correction || 0)} />,
});

export const getCommonFooterTotals = (values) => ({
  totalCurrentYearBaseAmount: getTotalValue(values, 'currentYear.baseAmount'),
  totalCurrentYearCorrection: getTotalValue(values, 'currentYear.correction'),
  totalPreviousYearBaseAmount: getTotalValue(values, 'previousYear.baseAmount'),
  totalPreviousYearCorrection: getTotalValue(values, 'previousYear.correction'),
  totalPreviousYearFinalAmount: getTotalValue(values, 'previousYear.finalAmount'),
});

export const getCommonFooterData = ({
  totalCurrentYearBaseAmount,
  totalCurrentYearCorrection,
  totalPreviousYearBaseAmount,
  totalPreviousYearCorrection,
}) => ({
  description: '',
  startCommercial: (<FooterCell value={totalPreviousYearBaseAmount} />),
  startCorrection: (<FooterCell value={totalPreviousYearCorrection} />),
  startFiscal: (<FooterCell value={totalPreviousYearBaseAmount + totalPreviousYearCorrection} />),
  endCommercial: (<FooterCell value={totalCurrentYearBaseAmount} />),
  endCorrection: (<FooterCell value={totalCurrentYearCorrection} />),
  endFiscal: (<FooterCell value={totalCurrentYearBaseAmount + totalCurrentYearCorrection} />),
});

export const getDescriptionRowTemplate = (fieldNamePrefix) => ({
  description: ({
    description, index, rubricId,
  }) => ((index !== 0) ? (
    <DescriptionCell
      name={`${fieldNamePrefix}.${index}.description`}
      disabled={!!rubricId}
    />
  ) : (
    <DescriptionCellWrapper width={DESCRIPTION_INPUT_WIDTH}>
      {description}
    </DescriptionCellWrapper>
  )),
});

export const getVatColumnGroup = () => [
  {
    id: 9,
    label: () => <TableCellWrapper title={translate('vat-this-year')}>{translate('vat-this-year')}</TableCellWrapper>,
    className: 'col-fiscal mirage-label text-align-right vat-this-year',
  },
  {
    id: 10,
    label: () => <TableCellWrapper title={translate('vat-last-year')}>{translate('vat-last-year')}</TableCellWrapper>,
    className: 'col-fiscal mirage-label text-align-right vat-last-year',
  },
  {
    id: 11,
    label: () => <TableCellWrapper title={translate('vat-other-years')}>{translate('vat-other-years')}</TableCellWrapper>,
    className: 'col-fiscal mirage-label text-align-right vat-other-years',
  },
  {
    id: 12,
    label: '',
    className: 'col-actions',
  },
];

export const getVatRowTemplate = (fieldNamePrefix, arrayHelpers, values) => ({
  vatCurrentYear: ({ index }) => ((index === 0) ? (
    <CurrencyCell
      name={`${fieldNamePrefix}.${index}.currentYear.vatThisYear`}
    />
  ) : (
    <CurrencyCellWrapper>-</CurrencyCellWrapper>
  )),
  vatLastYear: ({ index }) => ((index === 0) ? (
    <CurrencyCell
      name={`${fieldNamePrefix}.${index}.currentYear.vatPreviousYear`}
    />
  ) : (
    <CurrencyCellWrapper>-</CurrencyCellWrapper>
  )),
  vatOtherYears: ({ index }) => ((index === 0) ? (
    <CurrencyCell
      name={`${fieldNamePrefix}.${index}.currentYear.vatOtherYears`}
    />
  ) : (
    <CurrencyCellWrapper>-</CurrencyCellWrapper>
  )),
  actions: ({ index, rubricId }) => (index ? (
    <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`receivables-${index}`} rubricId={rubricId} />
  ) : ''),

});

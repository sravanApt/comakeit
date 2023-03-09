import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import { TableCellWrapper } from '../../../common/styled-wrapper';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  CurrencyCell,
} from '../../../common/table-cell-templates';

/**
 * Modal - Component to display the annual resreve details for premium annuity
 *
 */

const AnnualReserveMarginModal = ({
  values, name,
}) => {
  const currentRowTemplate = useMemo(() => ({
    year: ({ year }) => (
      <TableCellWrapper>
        {year}
      </TableCellWrapper>
    ),
    profitFromBusiness: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.profitFromBusiness`}
        className="annual-profit-from-business"
      />
    ),
    allocationToFor: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.allocationToFor`}
        className="annual-allocation-to-for"
      />
    ),
    releaseOfFor: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.releaseOfFor`}
        className="annual-release-of-for"
      />
    ),
    incomeFromEmployment: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.incomeFromEmployment`}
        className="annual-income-from-employment"
      />
    ),
    incomeFromOtherActivities: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.incomeFromOtherActivities`}
        className="annual-income-from-other-activities"
      />
    ),
    incomeFromBenefits: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.incomeFromBenefits`}
        className="annual-income-from-benefits"
      />
    ),
    factorA: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.factorA`}
        className="annual-factor-A"
      />
    ),
    deductedPremiums: ({ index }) => (
      <CurrencyCell
        name={`${name}.${index}.deductedPremiums`}
        className="annual-deducted-premiums"
      />
    ),
  }), [name]);
  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="annuity-premium"
      hasFooter={false}
    />
  );
};

const CURRENT_COLUMN_GROUP = [
  {
    id: 'year',
    label: `${translate('year-label')}`,
    className: 'col-annual-reserve',
  },
  {
    id: 'business-profit',
    label: () => <TableCellWrapper title={translate('profit-from-business')}>{translate('profit-from-business')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'allocation-to-for',
    label: () => <TableCellWrapper title={translate('allocation-to-for')}>{translate('allocation-to-for')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'release-of-for',
    label: () => <TableCellWrapper title={translate('release-of-for')}>{translate('release-of-for')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'employment-income',
    label: () => <TableCellWrapper title={translate('income-from-employment')}>{translate('income-from-employment')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'other-activities-income',
    label: () => <TableCellWrapper title={translate('income-from-other-activities')}>{translate('income-from-other-activities')}</TableCellWrapper>,
    className: 'col-other-activities',
  },
  {
    id: 'income-from-benefits',
    label: () => <TableCellWrapper title={translate('income-from-benefits')}>{translate('income-from-benefits')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'factor-a',
    label: () => <TableCellWrapper title={translate('factor-a-label')}>{translate('factor-a-label')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'deducted-premiums',
    label: () => <TableCellWrapper title={translate('deducted-premiums')}>{translate('deducted-premiums')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
];

AnnualReserveMarginModal.propTypes = {
  /** provide initaila data to correction modal */
  values: PropTypes.array.isRequired,
  /** indicates the formik path */
  name: PropTypes.string.isRequired,
};

export default AnnualReserveMarginModal;

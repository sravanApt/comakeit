import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import { incomeTranslate as translate } from '../income-translate';
import { getTotalValue } from '../../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../../common/table-cell-templates';
import { tableHeaderCells } from '../income.constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { TableCellWrapper } from '../../../../common/styled-wrapper';

const COLUMN_GROUP = [
  tableHeaderCells.description,
  {
    id: 2,
    label: () => <TableCellWrapper title={translate('opening-value')}>{translate('opening-value')}</TableCellWrapper>,
    className: 'col-opening-value text-align-right',
  },
  {
    id: 3,
    label: () => <TableCellWrapper title={translate('closing-value')}>{translate('closing-value')}</TableCellWrapper>,
    className: 'col-closing-value text-align-right',
  },
  tableHeaderCells.actions,
];

const incomeTemplate = {
  description: '', openingValue: 0, closingValue: 0,
};

/**
  * Tax Forecast - Income Component - Display Income and Cost  from Benefits section
  *
  */

const AssetsLiabilitiesRow = ({
  values, fieldNamePrefix, arrayHelpers, updateTaxCalculation,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const rowTemplate = {
    description: ({ openingValue, closingValue, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={(closingValue || openingValue) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    openingValue: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.openingValue`}
        className="assets-liabilities-opening-value"
        disabled={!description}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
      />
    ),
    closingValue: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.closingValue`}
        className="assets-liabilities-closing-value"
        disabled={!description}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  };

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: { ...incomeTemplate },
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalOpeningValue = getTotalValue(values, 'openingValue');
        const totalClosingValue = getTotalValue(values, 'closingValue');
        if (totalOpeningValue || totalClosingValue) {
          setFooterData({
            description: '',
            openingValue: totalOpeningValue,
            closingValue: totalClosingValue,
          });
        } else {
          setFooterData(null);
        }
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    openingValue: (<FooterCell value={footerData.openingValue} />),
    closingValue: (<FooterCell value={footerData.closingValue} />),
  } : null),
  [footerData]);

  return (
    <div className="assets-liabilities">
      <DataTable
        className="previous-income"
        columnGroups={COLUMN_GROUP}
        rowTemplate={rowTemplate}
        rows={values || []}
        hasFooter={!!footerData}
        footerValues={footerValues}
      />
    </div>
  );
};

AssetsLiabilitiesRow.propTypes = {
  /** contains array of income fields with description, opening value, closing value etc... */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
      openingValue: PropTypes.number,
      closingValue: PropTypes.number,
    }),
  ),
  /** name of the fields in array */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported Assets Liabilities Common Component wrapped with FieldArray HOC */
export default AssetsLiabilitiesRow;

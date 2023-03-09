import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import { getTotalValue } from '../../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../../common/table-cell-templates';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { incomeFromBusinessTranslate as translate } from '../../income-from-business/income-from-business-translate';


const incomeTemplate = {
  description: '', amount: 0,
};

/**
  * Tax Forecast - Income Component - Display a row with description and amount fields in a section
  *
  */

const DescriptionAmountRow = ({
  values, columnGroup, fieldNamePrefix, arrayHelpers, updateTaxCalculation, disableTableCells,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  const rowTemplate = {
    descriptionAmountRowDescription: ({
      amount, index, rubricId, description,
    }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={disableTableCells || (!!rubricId) || (description === translate('rounding-difference'))}
        customChangeHandler={amount ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    descriptionAmountRowAmount: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        className="common-description-amount"
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!description || disableTableCells || (description === translate('rounding-difference'))}
      />
    ),
    descriptionAmountRowActions: ({ index, rubricId, description }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
        rubricId={rubricId}
        disabled={description === translate('rounding-difference')}
      />
    ),
  };

  useEffect(() => {
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: { ...incomeTemplate },
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalAmount = getTotalValue(values, 'amount');
        if (totalAmount) {
          setFooterData({
            amount: totalAmount,
          });
        } else {
          setFooterData(null);
        }
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    amount: (<FooterCell value={footerData.amount} />),
  } : null),
  [footerData]);

  return (
    <div className="common-description">
      <DataTable
        className="previous-income"
        columnGroups={columnGroup}
        rowTemplate={rowTemplate}
        rows={values || []}
        hasFooter={!!footerData}
        footerValues={footerValues}
      />
    </div>
  );
};

DescriptionAmountRow.defaultProps = {
  disableTableCells: false,
};

DescriptionAmountRow.propTypes = {
  /** contains array of income fields with description, amount etc... */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** provide boolean value to disable/enable table cells */
  disableTableCells: PropTypes.bool,
};

/** Exported Common description, amount Component */
export default DescriptionAmountRow;

import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  FooterCell, ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { cessationProfitColumns, ROW_TEMPLATES } from './other-items.constants';
import TaxForecastContext from '../../tax-forecast-context';

/**
 * Display/Edit Non or partly Deductable costs / tax-exempt components
 *
 */

const CessationProfit = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);

  const {
    dossierData: {
      dossierManifest: { taxableYear },
    },
  } = useContext(TaxForecastContext);

  const rowTemplate = {
    description: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        width="365px"
        disabled={!!rubricId}
      />
    ),
    amount: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        disabled={!description}
      />
    ),
    actions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`cessation-profit-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: ROW_TEMPLATES.cessationProfit,
    values,
    loadFooterData: () => {
      const totalAmount = getTotalValue(values, 'amount');
      if (totalAmount) {
        setFooterData({
          description: '',
          totalAmount,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    amount: (<FooterCell value={footerData.totalAmount} />),
  } : null),
  [footerData]);

  return (
    <DataTable
      className="correction-table"
      columnGroups={cessationProfitColumns(taxableYear)}
      rowTemplate={rowTemplate}
      rows={values}
      footerValues={footerValues}
      hasFooter={!!footerData}
      dataTa="correction-table"
    />
  );
};

CessationProfit.propTypes = {
  /** values to render with in modal */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      prevYearAmount: PropTypes.number,
      amount: PropTypes.number,
    }),
  ).isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CessationProfit);

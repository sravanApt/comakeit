import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  FooterCell,
  ActionsCell,
  DescriptionCell,
  CurrencyCell,
  CurrencyLabelCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { partlyDeductableOrTaxExemptSectionColumns, ROW_TEMPLATES } from './other-items.constants';
import TaxForecastContext from '../../tax-forecast-context';

/**
 * Display/Edit Non or partly Deductable costs / tax-exempt components
 *
 */

const PartlyDeductableOrTaxExemptCosts = ({
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
        disabled={!!rubricId}
      />
    ),
    prevYearAmount: ({ prevYearAmount }) => (
      <CurrencyLabelCell value={prevYearAmount} />
    ),
    amount: ({ index, rubricId, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        disabled={!!rubricId || !description}
      />
    ),
    actions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`partly-deductable-costs-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: ROW_TEMPLATES.partlyDeductableOrTaxExemptSection,
    values,
    loadFooterData: () => {
      const totalPrevYearAmount = getTotalValue(values, 'prevYearAmount');
      const totalAmount = getTotalValue(values, 'amount');
      if (totalPrevYearAmount || totalAmount) {
        setFooterData({
          ...ROW_TEMPLATES.partlyDeductableOrTaxExemptSection,
          totalPrevYearAmount,
          totalAmount,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    prevYearAmount: (<FooterCell value={footerData.totalPrevYearAmount} />),
    amount: (<FooterCell value={footerData.totalAmount} />),
  } : null),
  [footerData]);

  return (
    <DataTable
      className="correction-table"
      columnGroups={partlyDeductableOrTaxExemptSectionColumns(taxableYear)}
      rowTemplate={rowTemplate}
      rows={values}
      footerValues={footerValues}
      hasFooter={!!footerData}
      dataTa="correction-table"
    />
  );
};

PartlyDeductableOrTaxExemptCosts.propTypes = {
  /** values to render with in modal */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      prevYearAmount: PropTypes.number,
    }),
  ).isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(PartlyDeductableOrTaxExemptCosts);

import React, {
  useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import TaxForecastContext from '../../tax-forecast-context';
import {
  DEFAULT_DESCRIPTION,
  SHORT_TERM_LIABILITIES_ROW_TEMPLATE,
  getCommonColumnGroup,
  getCommonRowTemplate,
  getVatRowTemplate,
  getVatColumnGroup,
  getDescriptionRowTemplate,
  getCommonFooterTotals,
  getCommonFooterData,
} from './balance-sheet.constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

/**
 * Table - Balance sheet ShortTermLiabilities display/edit
 *
 */

const ShortTermLiabilities = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);
  const {
    dossierData: {
      dossierManifest: { taxableYear },
    },
  } = useContext(TaxForecastContext);

  const COLUMN_GROUP = useMemo(() => ([
    ...getCommonColumnGroup(taxableYear),
    ...getVatColumnGroup(),
  ]), [taxableYear]);

  const rowTemplate = useMemo(() => ({
    ...getDescriptionRowTemplate(fieldNamePrefix),
    ...getCommonRowTemplate(fieldNamePrefix),
    ...getVatRowTemplate(fieldNamePrefix, arrayHelpers, values),
  }), [arrayHelpers, fieldNamePrefix, values]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: SHORT_TERM_LIABILITIES_ROW_TEMPLATE,
    values,
    loadFooterData: () => {
      const shortTermLiabilitiesTotalsObject = getCommonFooterTotals(values);
      if (Object.values(shortTermLiabilitiesTotalsObject).some((value) => value > 0)) {
        setFooterData(shortTermLiabilitiesTotalsObject);
      } else {
        setFooterData(null);
      }
    },
    defaultDescription: DEFAULT_DESCRIPTION,
  });

  const footerValues = useMemo(() => (footerData ? {
    ...getCommonFooterData(footerData),
  } : null), [footerData]);

  return (
    <DataTable
      className="correction-table"
      columnGroups={COLUMN_GROUP}
      rowTemplate={rowTemplate}
      rows={values}
      footerValues={footerValues}
      hasFooter={!!footerData}
      dataTa="correction-table"
    />
  );
};

ShortTermLiabilities.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction table of Short-term Liabilities wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(ShortTermLiabilities);

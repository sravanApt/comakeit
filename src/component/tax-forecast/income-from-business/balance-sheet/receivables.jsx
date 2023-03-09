import React, {
  useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { TableCellWrapper, CurrencyCellWrapper } from '../../../../common/styled-wrapper';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import TaxForecastContext from '../../tax-forecast-context';
import {
  FooterCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import {
  DEFAULT_DESCRIPTION,
  RECEIVABLES_ROW_TEMPLATE,
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
 * Table - Balance sheet receivables display/edit
 *
 */

const Receivables = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);
  const {
    dossierData: {
      dossierManifest: { taxableYear },
    },
  } = useContext(TaxForecastContext);

  const COLUMN_GROUP = [
    ...getCommonColumnGroup(taxableYear),
    {
      id: 8,
      label: () => <TableCellWrapper title={translate('nominal-value')}>{translate('nominal-value')}</TableCellWrapper>,
      className: 'mirage-label text-align-right',
    },
    ...getVatColumnGroup(),
  ];

  const rowTemplate = {
    ...getDescriptionRowTemplate(fieldNamePrefix),
    ...getCommonRowTemplate(fieldNamePrefix),
    nominalValue: ({
      index, description,
    }) => ((index !== 0) ? (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.currentYear.nominalValue`}
        disabled={!description}
      />
    ) : (
      <CurrencyCellWrapper>
        -
      </CurrencyCellWrapper>
    )),
    ...getVatRowTemplate(fieldNamePrefix, arrayHelpers, values),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: RECEIVABLES_ROW_TEMPLATE,
    values,
    loadFooterData: () => {
      const totalNominalValue = getTotalValue(values, 'currentYear.nominalValue');
      const receivablesTotalsObject = getCommonFooterTotals(values);
      if (Object.values(receivablesTotalsObject).some((value) => value > 0) || totalNominalValue) {
        setFooterData({
          ...receivablesTotalsObject,
          totalNominalValue,
        });
      } else {
        setFooterData(null);
      }
    },
    defaultDescription: DEFAULT_DESCRIPTION,
  });

  const footerValues = useMemo(() => (footerData ? {
    ...getCommonFooterData(footerData),
    nominalValue: (<FooterCell value={footerData.totalNominalValue} />),
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

Receivables.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction table of Recievables wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(Receivables);

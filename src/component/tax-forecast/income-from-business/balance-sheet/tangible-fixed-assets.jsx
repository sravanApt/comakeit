import React, {
  useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import TaxForecastContext from '../../tax-forecast-context';
import {
  FooterCell, ActionsCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import {
  TANGIBLE_ASSETS_ROW_TEMPLATE,
  DEFAULT_TANGIBLE_ASSETS_DESCRIPTION,
  getCommonColumnGroup,
  getCommonRowTemplate,
  getDescriptionRowTemplate,
  getCommonFooterTotals,
  getCommonFooterData,
} from './balance-sheet.constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { TableCellWrapper, CurrencyCellWrapper } from '../../../../common/styled-wrapper';

/**
 * Table - Display corrections of tangible fixed assets data
 *
 */

const TangibleFixedAssets = ({
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
      id: 18,
      label: () => <TableCellWrapper title={translate('purchase-value')}>{translate('purchase-value')}</TableCellWrapper>,
      className: 'mirage-label text-align-right',
    },
    {
      id: 19,
      label: () => <TableCellWrapper title={translate('residual-value')}>{translate('residual-value')}</TableCellWrapper>,
      className: 'mirage-label text-align-right',
    },
    {
      id: 20,
      label: () => <TableCellWrapper title={translate('base-value')}>{translate('base-value')}</TableCellWrapper>,
      className: 'mirage-label text-align-right',
    },
    {
      id: 21,
      label: '',
      className: 'col-actions',
    },
  ];

  const rowTemplate = {
    ...getDescriptionRowTemplate(fieldNamePrefix),
    ...getCommonRowTemplate(fieldNamePrefix),
    purchaseValue: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.currentYear.purchaseValue`}
        disabled={!description}
      />
    ),
    residualValue: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.currentYear.residualValue`}
        disabled={!description}
      />
    ),
    baseValue: ({ index, description }) => ((index === 0) ? (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.currentYear.baseValue`}
        disabled={!description}
        dataTa="tangible_assets_base_value"
      />
    ) : (
      <CurrencyCellWrapper>-</CurrencyCellWrapper>
    )),
    actions: ({ index, rubricId }) => (index ? (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`tangible-fixed-assets-${index}`} rubricId={rubricId} />
    ) : ''),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: TANGIBLE_ASSETS_ROW_TEMPLATE,
    values,
    loadFooterData: () => {
      const tabgibleAssetsTotalsObject = getCommonFooterTotals(values);
      const totalPurchaseValue = getTotalValue(values, 'currentYear.purchaseValue');
      const totalResidualValue = getTotalValue(values, 'currentYear.residualValue');
      if (Object.values(tabgibleAssetsTotalsObject).some((value) => value > 0) || totalPurchaseValue || totalResidualValue) {
        setFooterData({
          ...tabgibleAssetsTotalsObject,
          totalPurchaseValue,
          totalResidualValue,
        });
      } else {
        setFooterData(null);
      }
    },
    defaultDescription: DEFAULT_TANGIBLE_ASSETS_DESCRIPTION,
  });

  const footerValues = useMemo(() => (footerData ? {
    ...getCommonFooterData(footerData),
    purchaseValue: (<FooterCell value={footerData.totalPurchaseValue} />),
    residualValue: (<FooterCell value={footerData.totalResidualValue} />),
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

TangibleFixedAssets.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction table of Tangible Fixed Assets wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(TangibleFixedAssets);

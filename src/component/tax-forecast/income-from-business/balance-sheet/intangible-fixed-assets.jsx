import React, {
  useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import TaxForecastContext from '../../tax-forecast-context';
import {
  FooterCell, ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import {
  INTANGIBLE_ASSETS_ROW_TEMPLATE,
  getCommonColumnGroup,
  getCommonRowTemplate,
  getCommonFooterTotals,
  getCommonFooterData,
} from './balance-sheet.constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { TableCellWrapper } from '../../../../common/styled-wrapper';

/**
 * Display/Edit Intangible Fixed Assets
 *
 */

const IntangibleFixedAssets = ({
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
      label: () => <TableCellWrapper title={translate('purchase-value')}>{translate('purchase-value')}</TableCellWrapper>,
      className: 'mirage-label text-align-right',
    },
    {
      id: 9,
      label: '',
      className: 'col-actions',
    },
  ];

  const rowTemplate = {
    description: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={!!rubricId}
      />
    ),
    ...getCommonRowTemplate(fieldNamePrefix),
    purchaseValue: ({ index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.currentYear.purchaseValue`}
      />
    ),
    actions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`intangible-fixed-assets-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: INTANGIBLE_ASSETS_ROW_TEMPLATE,
    values,
    loadFooterData: () => {
      const totalPurchaseValue = getTotalValue(values, 'currentYear.purchaseValue');
      const intangibleAssetsTotalsObject = getCommonFooterTotals(values);
      if (Object.values(intangibleAssetsTotalsObject).some((value) => value > 0) || totalPurchaseValue) {
        setFooterData({
          ...intangibleAssetsTotalsObject,
          totalPurchaseValue,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    ...getCommonFooterData(footerData),
    purchaseValue: (<FooterCell value={footerData.totalPurchaseValue} />),
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

IntangibleFixedAssets.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction Table of intaginble fixed assets component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(IntangibleFixedAssets);

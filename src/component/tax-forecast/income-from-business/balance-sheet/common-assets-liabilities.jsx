import React, {
  useState, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import TaxForecastContext from '../../tax-forecast-context';
import { ActionsCell, DescriptionCell } from '../../../../common/table-cell-templates';
import {
  COMMON_ASSETS_LIABILITIES_ROW_TEMPLATE,
  getCommonColumnGroup,
  getCommonRowTemplate,
  getCommonFooterTotals,
  getCommonFooterData,
} from './balance-sheet.constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

/**
 * Display/Edit Financial Fixed Assets
 *
 */

const CommonAssetsLiabilities = ({
  values, fieldNamePrefix, parentSectionType, arrayHelpers,
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
      label: '',
      className: 'col-actions',
    },
  ];

  const rowTemplate = {
    description: ({ index, rubricId, description }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        dataTa={`common-correction-description${index}`}
        disabled={!!rubricId || (description === translate('rounding-difference'))}
      />
    ),
    ...getCommonRowTemplate(fieldNamePrefix, (parentSectionType === 'depositDetails' || parentSectionType === 'withdrawalDetails')),
    actions: ({ index, rubricId, description }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => arrayHelpers.remove(index)}
        index={index}
        dataTa={`common-assets-liabilities-${index}`}
        rubricId={rubricId}
        disabled={description === translate('rounding-difference')}
      />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: COMMON_ASSETS_LIABILITIES_ROW_TEMPLATE,
    values,
    loadFooterData: () => {
      const totalsObject = getCommonFooterTotals(values);
      if (Object.values(totalsObject).some((value) => (value > 0))) {
        setFooterData(totalsObject);
      } else {
        setFooterData(null);
      }
    },
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

CommonAssetsLiabilities.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  parentSectionType: PropTypes.string,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CommonAssetsLiabilities);

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../../common/table-cell-templates';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { assetsTranslate as translate } from '../assets-translate';
import { getTotalValue } from '../../../../common/utils';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
    className: 'col-description',
  },
  {
    id: 'amount',
    label: translate('amount-label'),
    className: 'col-amount text-align-right',
  },
  {
    id: 'actions',
    label: '',
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '',
  amount: 0,
};

const CostsTable = ({
  values, fieldNamePrefix, arrayHelpers, dataTa = 'assets-own-home-costs-table',
}) => {
  const [footerData, setFooterData] = useState(null);
  const currentRowTemplate = useMemo(() => ({
    description: ({ index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        dataTa={`cost-table-description-${index}`}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        disabled={!description}
        dataTa={`cost-table-amount-${index}`}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          arrayHelpers.remove(index);
        }}
        index={index}
        dataTa={`cost-table-row-${index}`}
      />
    ),
  }), [fieldNamePrefix, values.length, arrayHelpers]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
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

  const footerValues = (footerData ? {
    description: '',
    amount: (<FooterCell value={footerData.amount} />),
  } : null);

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      className="own-home-costs"
      dataTa={dataTa}
      hasFooter={!!footerData}
      footerValues={footerValues}
    />
  );
};

CostsTable.propTypes = {
  /** array of objects which contains different costs data */
  values: PropTypes.array.isRequired,
  /** field name prefix for the form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provide test attribute for component */
  dataTa: PropTypes.string,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CostsTable));

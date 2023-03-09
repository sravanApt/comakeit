import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from '../expenditure-translate';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../../common/table-cell-templates';
import { DescriptionCellWrapper } from '../../../../common/styled-wrapper';
import { DESCRIPTION_INPUT_WIDTH } from '../../../../common/constants';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { getTotalValue } from '../../../../common/utils';

/**
 * Modal - Component that can be used to description and amount details of
 * expenses for health sections.
 *
 */

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
    className: 'col-annual-reserve white-space-normal',
  },
  {
    id: 'amount',
    label: translate('amount-label'),
    className: 'col-annual-reserve text-align-right',
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

const TreatmentModal = ({
  values, fieldNamePrefix, arrayHelpers, footerDescription,
}) => {
  const [footerData, setFooterData] = useState(null);
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

  const currentRowTemplate = useMemo(() => ({
    description: ({ index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        dataTa={`treatment-modal-description${index}`}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        dataTa={`treatment-modal-amount${index}`}
        disabled={!description}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  }), [arrayHelpers, values.length, fieldNamePrefix]);

  const footerValues = useMemo(() => (footerData ? {
    description: (<DescriptionCellWrapper width={DESCRIPTION_INPUT_WIDTH}>{footerDescription}</DescriptionCellWrapper>),
    amount: (<FooterCell value={footerData.amount} />),
  } : null),
  [footerData]);

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="treatment-modal"
      hasFooter={!!footerData}
      footerValues={footerValues}
    />
  );
};

TreatmentModal.propTypes = {
  /** provide initaila data to correction modal */
  values: PropTypes.array.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provide description for footer */
  footerDescription: PropTypes.string,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(TreatmentModal));

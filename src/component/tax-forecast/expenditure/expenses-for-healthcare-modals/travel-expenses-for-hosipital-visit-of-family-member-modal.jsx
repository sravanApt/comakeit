import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from '../expenditure-translate';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell, NumberCell,
} from '../../../../common/table-cell-templates';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { getTotalValue } from '../../../../common/utils';
import { TableCellWrapper } from '../../../../common/styled-wrapper';

/**
 * Modal - Component that can be used to show and edit Travel expenses for hosipital visit of family member
 *
 */

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
    className: 'col-annual-reserve',
  },
  {
    id: 'numberOfVisits',
    label: () => <TableCellWrapper title={translate('number-of-visits')}>{translate('number-of-visits')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'distance',
    label: () => <TableCellWrapper title={translate('distance-round-trip')}>{translate('distance-round-trip')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'actualCostsPublicTransportationCost',
    label: () => <TableCellWrapper title={translate('actual-costs-public-transprotation')}>{translate('actual-costs-public-transprotation')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'actions',
    label: '',
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '',
  numberOfVisits: 0,
  distance: 0,
  actualCostsPublicTransportationCost: 0,
};

/** Expenditure form - travel expenses for hosipital visit of family member modal */
const TravelExpensesForHospitalVisitOfFamilyMemberModal = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);
  const currentRowTemplate = useMemo(() => ({
    description: ({ index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        width="160px"
        dataTa={`hospital-visit-description${index}`}
      />
    ),
    numberOfVisits: ({ description, actualCostsPublicTransportationCost, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.numberOfVisits`}
        dataTa={`number-of-hospital-visits${index}`}
        disabled={!description || !!actualCostsPublicTransportationCost}
      />
    ),
    distance: ({ description, actualCostsPublicTransportationCost, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.distance`}
        dataTa={`hospital-visit-distance${index}`}
        disabled={!description || !!actualCostsPublicTransportationCost}
      />
    ),
    actualCostsPublicTransportationCost: ({
      description, index, numberOfVisits, distance,
    }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.actualCostsPublicTransportationCost`}
        dataTa={`hospital-visit-cost${index}`}
        disabled={!description || !!numberOfVisits || !!distance}
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

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalActualCostsPublicTransportationCost = getTotalValue(values, 'actualCostsPublicTransportationCost');
        if (totalActualCostsPublicTransportationCost) {
          setFooterData({
            actualCostsPublicTransportationCost: totalActualCostsPublicTransportationCost,
          });
        } else {
          setFooterData(null);
        }
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    numberOfVisits: null,
    distance: null,
    actualCostsPublicTransportationCost: (<FooterCell value={footerData.actualCostsPublicTransportationCost} />),
  } : null),
  [footerData]);

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="travel-expenses-for-hosipital-visit-of-family-member-modal"
      hasFooter={!!footerData}
      footerData={footerValues}
    />
  );
};

TravelExpensesForHospitalVisitOfFamilyMemberModal.propTypes = {
  /** Provides data to correction modal */
  values: PropTypes.array.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(TravelExpensesForHospitalVisitOfFamilyMemberModal));

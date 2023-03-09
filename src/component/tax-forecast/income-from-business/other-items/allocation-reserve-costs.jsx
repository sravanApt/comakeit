import React, { useState, useMemo } from 'react';
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
import { ALLOCATION_RESERVE_COSTS_COLUMN_GROUP, ROW_TEMPLATES } from './other-items.constants';

/**
 * Display/Edit Non or partly Deductable costs / tax-exempt components
 *
 */

const AllocationReserveCosts = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);

  const rowTemplate = {
    arDescription: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={!!rubricId}
      />
    ),
    arOpening: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.opening`}
        disabled={!description}
      />
    ),
    arAllocation: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.allocation`}
        disabled={!description}
      />
    ),
    arRelease: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.release`}
        disabled={!description}
      />
    ),
    arClosing: ({ opening, allocation, release }) => (
      <CurrencyLabelCell value={((opening || 0) + (allocation || 0) - (release || 0))} />
    ),
    arActions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`allocation-reserve-costs-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: ROW_TEMPLATES.allocationReserveSection,
    values,
    loadFooterData: () => {
      const totalOpening = getTotalValue(values, 'opening');
      const totalAllocation = getTotalValue(values, 'allocation');
      const totalRelease = getTotalValue(values, 'release');
      const totalClosing = totalOpening + totalAllocation - totalRelease;
      if (totalOpening || totalAllocation || totalRelease || totalClosing) {
        setFooterData({
          ...ROW_TEMPLATES.allocationReserveSection,
          totalOpening,
          totalAllocation,
          totalRelease,
          totalClosing,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    opening: (<FooterCell value={footerData.totalOpening} />),
    allocation: (<FooterCell value={footerData.totalAllocation} />),
    release: (<FooterCell value={footerData.totalRelease} />),
    closing: (<FooterCell value={footerData.totalClosing} />),
  } : null),
  [footerData]);

  return (
    <DataTable
      className="correction-table"
      columnGroups={ALLOCATION_RESERVE_COSTS_COLUMN_GROUP}
      rowTemplate={rowTemplate}
      rows={values}
      footerValues={footerValues}
      hasFooter={!!footerData}
      dataTa="correction-table"
    />
  );
};

AllocationReserveCosts.propTypes = {
  /** values to render with in modal */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      opening: PropTypes.number,
      allocation: PropTypes.number,
      release: PropTypes.number,
      closing: PropTypes.number,
    }),
  ).isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(AllocationReserveCosts);

import React from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import IncomeSectionHeading from './income-section-heading';

/**
  * Tax Forecast - Common table Component for Income sections
  *
  */

const IncomeCommonTable = ({
  heading,
  values,
  columnGroup,
  rowTemplate,
  dataTa,
  hasFooter,
  footerData,
  handleRemove,
  children,
  className,
  stickyColumns,
  hideDelete,
}) => (
  <IncomeSectionHeading
    heading={heading}
    handleRemove={handleRemove}
    dataTa={dataTa}
    hideDelete={hideDelete}
  >
    <div className={`${className} margin-zero`}>
      <DataTable
        className="current-income"
        columnGroups={columnGroup}
        rowTemplate={rowTemplate}
        rows={values || []}
        footerValues={footerData}
        hasFooter={hasFooter}
        stickyColumns={stickyColumns}
      />
    </div>
    {children}
  </IncomeSectionHeading>
);

IncomeCommonTable.defaultProps = {
  values: [],
  hasFooter: false,
  className: 'income-section__table',
  stickyColumns: 0,
};

IncomeCommonTable.propTypes = {
  /** Content specified as children */
  children: PropTypes.node,
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** contains array of income fields with description, wages etc. */
  values: PropTypes.array,
  /** prefix for name of the input */
  columnGroup: PropTypes.array.isRequired,
  /** Group of functions to add custom HTML templates to all the rows in a column */
  rowTemplate: PropTypes.object.isRequired,
  /** provide test attribute for component */
  dataTa: PropTypes.string,
  /** checks that table has footer or not */
  hasFooter: PropTypes.bool,
  /** provide footer data to data table */
  footerData: PropTypes.object,
  /** function handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** provide table column to be sticy or not */
  stickyColumns: PropTypes.number,
};

/** Exported Enhanced Income Component wrapped with FieldArray HOC */
export default IncomeCommonTable;

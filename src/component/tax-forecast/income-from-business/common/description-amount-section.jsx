import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import DescriptionAndAmountComponent from '../../income/common/description-amount-row';
import { emptyFunction } from '../../../../common/utils';
import { tableHeaderCells } from '../../income/income.constants';

const COLUMN_GROUP = [
  tableHeaderCells.description,
  tableHeaderCells.amount,
  tableHeaderCells.actions,
];

const DescriptionAmountSection = ({
  heading,
  values,
  name,
  dataTa,
  updateTaxCalculation,
  selectedAdministration,
}) => (
  <div className="description-amount-section" data-ta={dataTa}>
    <Typography use="normal-text" className="flex mar-ver-sm section-heading">{heading}</Typography>
    {FieldArray({
      values,
      name,
      updateTaxCalculation,
      disableTableCells: !selectedAdministration,
      columnGroup: COLUMN_GROUP,
    })(DescriptionAndAmountComponent)}
  </div>
);

DescriptionAmountSection.defaultProps = {
  updateTaxCalculation: emptyFunction,
};

DescriptionAmountSection.propTypes = {
  /** provide heading for section */
  heading: PropTypes.string.isRequired,
  /** contains array of DescriptionAmountSection fields */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  /** provide name of the input */
  name: PropTypes.string.isRequired,
  /** test attribute provider */
  dataTa: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func,
  /** value of selected administration business */
  selectedAdministration: PropTypes.string,
};

export default DescriptionAmountSection;

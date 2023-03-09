import React from 'react';
import { Column } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { IconWrapper } from '../../../common/styled-wrapper';
import { convertCurrency } from '../../../common/utils';

const ExpensesColumnLayout = ({
  label, amount, isDataExist, handleEditClick, disable = false,
}) => (
  <>
    <Column span={8}>{label}</Column>
    <Column span={3} className="text-align-right">
      {convertCurrency({ value: amount || 0 })}
    </Column>
    <Column span={1}>
      {!disable && <IconWrapper iconSet={isDataExist ? 'fas' : 'far'} icon="pen" className="icon__edit edit pull-right" onClick={handleEditClick} />}
    </Column>
  </>
);

ExpensesColumnLayout.propTypes = {
  /** label for type of expense */
  label: PropTypes.string.isRequired,
  /** total amount for expense */
  amount: PropTypes.number,
  /** prop to check whether the data exist or not to display filled edit icon */
  isDataExist: PropTypes.bool,
  /** callback to handle edit click */
  handleEditClick: PropTypes.func,
};

export default ExpensesColumnLayout;

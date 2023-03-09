import React from 'react';
import styled from 'styled-components';
import { Typography } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { convertCurrency } from '../../../common/utils';

const ExpenditureTotalBar = ({
  label, amount, className = '', dataTa,
}) => (
  <ExpenditureTotalBarWrapper data-ta={dataTa} className={className}>
    {label}
    <Typography use="normal-text" className="font-weight-bold">{convertCurrency({ value: amount })}</Typography>
  </ExpenditureTotalBarWrapper>
);

const ExpenditureTotalBarWrapper = styled.div`
    align-items: center;
    background-color: ${({ theme }) => theme.tableRowHoverBackground};
    display: flex;
    font-size: ${({ theme }) => theme.fontSizes.fs14};
    height: 40px;
    justify-content: center;
    margin: ${({ theme }) => theme.margins.base} 0;
    width: 100%;

    > span {
      margin-left: ${({ theme }) => theme.margins.base};
    }
  `;

ExpenditureTotalBar.propTypes = {
  /** label to be displayed in front of the total amount */
  label: PropTypes.string.isRequired,
  /** total amount */
  amount: PropTypes.number,
  /** classname for the totalbar */
  className: PropTypes.string,
  /** attribute value of the custom data-ta attribute that can be used to locate a specific element for testing purposes */
  dataTa: PropTypes.string,
};
export default ExpenditureTotalBar;

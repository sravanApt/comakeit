import React, {
  useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Column, ColumnLayout, Tooltip,
} from '@visionplanner/ui-react-material';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { convertCurrency } from '../../../../common/utils';
import { TableCellWrapper } from '../../../../common/styled-wrapper';

const DepositWithdrawalsDifference = ({
  balanceSheetData, fieldNamePrefix, businessResult,
}) => {
  const [equityCapital, setEquityCapital] = useState(0);

  const updateEquityCapital = useCallback((data) => {
    setEquityCapital(businessResult?.balanceSheetData + data[fieldNamePrefix].depositsAndWithdrawals.withdrawalDetails.currentYearAmount - data[fieldNamePrefix].depositsAndWithdrawals.depositDetails.currentYearAmount);
  }, [fieldNamePrefix, businessResult]);

  useEffect(() => {
    updateEquityCapital(balanceSheetData);
  }, [balanceSheetData, updateEquityCapital]);

  return (
    <>
      {
        (businessResult && (businessResult?.profitLossData?.currentYearAmount - equityCapital) !== 0) && (
          <DepositAndWithdrawalFormWrapper className="difference-section">
            <ColumnLayout>
              <Column span={9}>
                {translate('result-profit-loss')}
              </Column>
              <Column span={3} className="text-align-right">
                <Tooltip overlay={convertCurrency({ value: businessResult.profitLossData.currentYearAmount })} placement="right">
                  <TableCellWrapper width="100%">
                    {convertCurrency({ value: businessResult.profitLossData.currentYearAmount })}
                  </TableCellWrapper>
                </Tooltip>
              </Column>
              <Column span={9}>
                {translate('result-balance-sheet')}
              </Column>
              <Column span={3} className="text-align-right">
                <Tooltip overlay={convertCurrency({ value: equityCapital })} placement="right">
                  <TableCellWrapper width="100%">
                    {convertCurrency({ value: equityCapital })}
                  </TableCellWrapper>
                </Tooltip>
              </Column>
            </ColumnLayout>
            <ColumnLayout>
              <Column span={9}>
                <span className="mdc-difference-label">
                  {translate('difference-label')}
                </span>
              </Column>
              <Column span={3} className="text-align-right">
                <Tooltip overlay={convertCurrency({ value: businessResult.profitLossData.currentYearAmount - equityCapital })} placement="right">
                  <TableCellWrapper width="100%" className="mdc-difference-amount">
                    {convertCurrency({ value: businessResult.profitLossData.currentYearAmount - equityCapital })}
                  </TableCellWrapper>
                </Tooltip>
              </Column>
            </ColumnLayout>
          </DepositAndWithdrawalFormWrapper>
        )
      }
    </>
  );
};

const DepositAndWithdrawalFormWrapper = styled.div`
  &.difference-section {
    background: ${({ theme }) => theme.colors.varden};
    margin: ${({ theme }) => theme.margins.medium} 0;
    padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large};
    width: 600px;

    .mdc-difference {
      &-amount,
      &-label {
        color: ${({ theme }) => theme.colors.tabasco};
        font-size: ${({ theme }) => theme.fontSizes.fs18};
      }
    }

    .mdc-layout-grid {
      &__inner {
        grid-gap: 5px;
      }
    }
  }
`;

DepositWithdrawalsDifference.propTypes = {
  /** provide updated balance sheet data */
  balanceSheetData: PropTypes.object.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provide totals of balance sheet section */
  businessResult: PropTypes.object,
};

export default DepositWithdrawalsDifference;

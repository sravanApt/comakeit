import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Column, Typography, ColumnLayout, Tooltip,
} from '@visionplanner/ui-react-material';
import { convertCurrency } from '../../../common/utils';
import { summaryTranslate as translate } from './summary-translate';

const renderAmountPayableOrPaidSection = (label, amount, className) => (
  <>
    <Column span={4} className="text-align-right">
      {label}
    </Column>
    <Column span={8}>
      <Tooltip overlay={convertCurrency({ value: amount })}>
        <div className={`${className} mdc-outcome-amount`} />
      </Tooltip>
    </Column>
  </>
);

/**
  * Tax Forecast - component to display summary expected outcome
  *
  */
const ExpectedOutCome = ({ declarationOutcome: { payable, paid, netPay } }) => {
  const { payableAmountWidth, paidAmountWidth, toPayOrReceiveAmountWidth } = useMemo(() => {
    let payableWidth = 100;
    let paidWidth = 100;
    let toPayOrReceiveWidth = (payable > 0 && payable === paid) ? 0 : 100;
    if (netPay < 0) {
      payableWidth = Math.round((payable / paid) * 100);
      toPayOrReceiveWidth = Math.round((netPay / paid) * 100);
    } else if (netPay > 0) {
      paidWidth = Math.round((paid / payable) * 100);
      toPayOrReceiveWidth = Math.round((netPay / payable) * 100);
    }
    return {
      payableAmountWidth: Math.abs(payableWidth) > 100 ? 100 : payableWidth,
      paidAmountWidth: Math.abs(paidWidth) > 100 ? 100 : paidWidth,
      toPayOrReceiveAmountWidth: Math.abs(toPayOrReceiveWidth) > 100 ? 100 : toPayOrReceiveWidth,
    };
  }, [netPay, paid, payable]);

  return (
    <ExpectedOutComeStyleWrapper
      className="mar-t-sm"
      type={`${netPay > 0 ? 'pay' : 'receive'}`}
      paidAmountWidth={Math.abs(paidAmountWidth)}
      payableAmountWidth={Math.abs(payableAmountWidth)}
      toPayOrReceiveAmountWidth={Math.abs(toPayOrReceiveAmountWidth)}
    >
      <Column span={12}>
        <Typography use="h6" className="amount-to-be-paid-or-received font-weight-bold">{convertCurrency({ value: Math.abs(netPay) })}</Typography>
        <Typography use="normal-text" className="to-be-paid-or-received-text pad-l-sm">{ netPay > 0 ? translate('to-pay') : translate('to-receive') }</Typography>
      </Column>
      <Column span={4} className="text-align-right">
        { netPay > 0 ? translate('to-pay') : translate('to-receive') }
      </Column>
      <Column span={8} className="text-align-right">
        <Tooltip overlay={convertCurrency({ value: Math.abs(netPay) })}>
          <div className="mdc-outcome-amount amount-to-pay-or-receive pull-right" />
        </Tooltip>
      </Column>
      { netPay > 0
        ? (
          <>
            {renderAmountPayableOrPaidSection(translate('paid'), paid, 'amount-paid')}
            {renderAmountPayableOrPaidSection(translate('payable'), payable, 'amount-payable')}
          </>
        )
        : (
          <>
            {renderAmountPayableOrPaidSection(translate('payable'), payable, 'amount-payable')}
            {renderAmountPayableOrPaidSection(translate('paid'), paid, 'amount-paid')}
          </>
        )}
    </ExpectedOutComeStyleWrapper>
  );
};

const ExpectedOutComeStyleWrapper = styled(ColumnLayout)`
  ${({
    theme, type, paidAmountWidth, payableAmountWidth, toPayOrReceiveAmountWidth,
  }) => css`
    .amount-payable {
      width: ${payableAmountWidth}%;
      background: ${theme.colors.pampas};
    }
    .amount-paid {
      width: ${paidAmountWidth}%;
      background: ${theme.colors.periwinkleGrey};
    }
    .to-be-paid-or-received-text {
      color: ${theme.colors.sandal};
      font-size: ${theme.fontSizes.fs12};
    }

    .mdc-outcome-amount {
      font-size: ${theme.fontSizes.fs14};
      line-height: 1.25rem;
      font-weight: 400;
      letter-spacing: 0.0178571429em;
      height: 30px;
    }

    .amount-to-pay-or-receive {
      width: ${toPayOrReceiveAmountWidth}%;
    }

    ${type === 'pay' && css`
      .amount-to-be-paid-or-received {
        color: ${theme.colors.thunderBird};
      }
      .amount-to-pay-or-receive {
        background-color: ${theme.colors.thunderBird};
      }
    `}

    ${type === 'receive' && css`
      .amount-to-be-paid-or-received {
        color: ${theme.colors.fern};
      }
      .amount-to-pay-or-receive {
        background-color: ${theme.colors.fern};
      }
    `}
  `}
`;

ExpectedOutCome.propTypes = {
  /** object which contains declaration outcome data */
  declarationOutcome: PropTypes.object.isRequired,
};

export default ExpectedOutCome;

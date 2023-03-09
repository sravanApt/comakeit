import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ColumnLayout, Column } from '@visionplanner/ui-react-material';
import { incomeTranslate as translate } from './income-translate';
import { CurrencyCell } from '../../../common/table-cell-templates';
import IncomeSectionHeading from './common/income-section-heading';
import { TableCellWrapper } from '../../../common/styled-wrapper';

/**
  * Tax Forecast - Income Component - Display Refunded Expenses section
  *
  */

const RefundedExpenses = ({
  fieldNamePrefix, handleRemove, updateTaxCalculation,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const self = useRef();
  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    amountUpdateIndicator > 0 && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  return (
    <IncomeSectionHeading
      heading={translate('refund-expenses')}
      handleRemove={handleRemove}
      dataTa="refund-expenses"
    >
      <div className="income-section__table income-section__table--refund">
        <ColumnLayout>
          <Column span={7} />
          <Column span={5}>
            <TableCellWrapper className="text-align-right common-data-table__head-cell">
              {translate('amount')}
            </TableCellWrapper>
          </Column>
          <Column span={7}>{translate('refunded-premium-occupational-disability-insurance')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedPremium.refundedPremiumForOccupationalDisabilityInsurance`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-premium-annuity')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedPremium.refundedPremiumForAnuuity`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-alimony')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedAlimony`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-healthcare-costs')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedHealthCareCosts`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-study-costs')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedStudyCost`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-maintenance-costs-monumental-object')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedMaintenanceCost`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-gift-to-charities')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedGiftsToCharity`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('refunded-waived-venture-capital')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.refundedExpenses.refundedWaivedVentureCapital`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
        </ColumnLayout>
      </div>
    </IncomeSectionHeading>
  );
};

RefundedExpenses.propTypes = {
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /* callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

export default RefundedExpenses;

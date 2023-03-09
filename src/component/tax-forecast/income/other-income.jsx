import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ColumnLayout, Column } from '@visionplanner/ui-react-material';
import { incomeTranslate as translate } from './income-translate';
import { CurrencyCell } from '../../../common/table-cell-templates';
import IncomeSectionHeading from './common/income-section-heading';
import { TableCellWrapper } from '../../../common/styled-wrapper';

/**
  * Tax Forecast - Income Component - Display Other Income section
  *
  */

const OtherIncome = ({
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
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  return (
    <IncomeSectionHeading
      heading={translate('income-based-on-transitional-law')}
      handleRemove={handleRemove}
      dataTa="other-income-section"
    >
      <div className="income-section__table">
        <ColumnLayout>
          <Column span={7} />
          <Column span={5}>
            <TableCellWrapper className="text-align-right common-data-table__head-cell">
              {translate('amount')}
            </TableCellWrapper>
          </Column>
          <Column span={7}>{translate('income-out-of-interest-before')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.incomeOutOfInterestBefore2001`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('other-income-before')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.otherIncomeBefore2001`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
          <Column span={7}>{translate('income-out-of-capital-insurance')}</Column>
          <Column span={5}>
            <CurrencyCell
              name={`${fieldNamePrefix}.incomeOutOfCapitalInsurance`}
              customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            />
          </Column>
        </ColumnLayout>
      </div>
    </IncomeSectionHeading>
  );
};

OtherIncome.propTypes = {
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /* callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

export default OtherIncome;

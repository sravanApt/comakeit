import React, { useState, useEffect, useRef } from 'react';
import {
  Column, ColumnLayout, Typography,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { CurrencyCell } from '../../../common/table-cell-templates';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import IncomeSectionHeading from '../income/common/income-section-heading';

/**
 * Tax Forecast - Additional Calculation Information - Withholding section
 */
const Withholding = ({
  heading, handleRemove, fieldNamePrefix, updateTaxCalculation,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const calculateUpdatedTaxRef = useRef();

  useEffect(() => {
    calculateUpdatedTaxRef.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculateUpdatedTaxRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  return (
    <IncomeSectionHeading
      heading={heading}
      handleRemove={handleRemove}
      dataTa="withholding-section"
    >
      <ColumnLayout>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('payroll-taxes-on-wages-part-of-income-out-of-business')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.withholdingTax.payrollTaxesOnWagesThatArePartOfIncomeOutOfBusiness.currentYearAmount`}
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            dataTa="payroll-taxes-on-wages-that-are-part-of-income-out-of-business"
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('wage-as-part-of-income-from-business')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.withholdingTax.wageAsPartOfIncomeFromBusiness.currentYearAmount`}
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            dataTa="wage-as-part-of-income-from-business"
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('provisional-assessment-income-tax')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.withholdingTax.provisionalIncomeTaxAssessment.currentYearAmount`}
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            dataTa="provisional-income-tax-assessment"
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('provisional-assessment-health-insurance-act')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.withholdingTax.provisionalRemittanceHealthInsuranceLaw.currentYearAmount`}
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            dataTa="provisional-remittance-health-insurance-law"
          />
        </Column>
      </ColumnLayout>
    </IncomeSectionHeading>
  );
};

Withholding.propTypes = {
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

export default Withholding;

import React, { useState, useEffect, useRef } from 'react';
import {
  Column, ColumnLayout, Typography,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { CurrencyCell } from '../../../common/table-cell-templates';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import IncomeSectionHeading from '../income/common/income-section-heading';
import { TableCellWrapper } from '../../../common/styled-wrapper';

/**
 * Tax Forecast - Additional Calculation Common Section
 */
const AdditionalCalculationCommonSection = ({
  heading, handleRemove, fieldNamePrefix, updateTaxCalculation, sectionKey, isJointSection = false, setFieldValue, dataTa,
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
      dataTa={`${dataTa}-section`}
      hideDelete={isJointSection}
    >
      <ColumnLayout>
        <Column span={6} className="head-cell">{translate('description-label')}</Column>
        <Column span={6} className="head-cell">
          <TableCellWrapper className="text-align-right">{translate('amount-label')}</TableCellWrapper>
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate(`${dataTa}-description`)}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.${sectionKey}.amount`}
            customChangeHandler={(value) => {
              (value === 0 || value)
                ? setFieldValue(`${fieldNamePrefix}.${sectionKey}.description`, translate(`${dataTa}-description`))
                : setFieldValue(`${fieldNamePrefix}.${sectionKey}.description`, '');
              setAmountUpdateIndicator(amountUpdateIndicator + 1);
            }}
            dataTa={`${sectionKey}-amount`}
            disabled={isJointSection}
          />
        </Column>
      </ColumnLayout>
    </IncomeSectionHeading>
  );
};

AdditionalCalculationCommonSection.propTypes = {
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** section key for provide name to form inputs */
  sectionKey: PropTypes.string.isRequired,
  /** prop to identify joint section */
  isJointSection: PropTypes.bool,
  /** provide test attribute for section */
  dataTa: PropTypes.string.isRequired,
};

export default AdditionalCalculationCommonSection;

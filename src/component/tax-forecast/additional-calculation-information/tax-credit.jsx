import React, { useState, useEffect, useRef } from 'react';
import {
  Column, ColumnLayout, Typography,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { CurrencyCell } from '../../../common/table-cell-templates';
import { DateInputWrapper, InputWrapper } from '../../../common/styled-wrapper';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import IncomeSectionHeading from '../income/common/income-section-heading';
import { dateProps, checkBoxProps } from './additional-calculation-information.constants';
import { isFutureDate } from '../../../common/utils';

/**
 * Tax Forecast - Addtional Calculation Information - Tax Credit section
 */
const TaxCredit = ({
  values, isJointDeclaration, isSingle, heading, handleRemove, fieldNamePrefix, updateTaxCalculation, sectionKey, setFieldValue,
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

  const updateStatus = () => {
    setAmountUpdateIndicator(amountUpdateIndicator + 1);
  };

  return (
    <IncomeSectionHeading
      heading={heading}
      handleRemove={handleRemove}
      dataTa={`${sectionKey}-section`}
    >
      <ColumnLayout>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('income-out-of-labor-fiscal-partner')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.${sectionKey}.incomeOutOfLaborForFiscalPartner`}
            customChangeHandler={updateStatus}
            dataTa={`${fieldNamePrefix}-incomeOutOfLaborForFiscalPartner`}
            disabled={isJointDeclaration || isSingle}
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('date-of-birth-fiscal-partner')}
          </Typography>
        </Column>
        <Column span={6}>
          <DateInputWrapper
            {...dateProps}
            className="text-input date-of-birth-fiscal-partner"
            name={`${fieldNamePrefix}.${sectionKey}.dateOfBirthOfFiscalPartner`}
            isOutsideRange={isFutureDate}
            disabled={isJointDeclaration || isSingle}
            customChangeHandler={updateStatus}
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('entitled-to-income-for-people')}
          </Typography>
        </Column>
        <Column span={6}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.${sectionKey}.entitledToIncome`}
            dataTa={`${fieldNamePrefix}-entitledToIncome`}
            customChangeHandler={updateStatus}
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('entitled-to-tax-credit-for-single-elderly')}
          </Typography>
        </Column>
        <Column span={6}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.${sectionKey}.entitledToTaxCredit`}
            dataTa={`${fieldNamePrefix}-entitledToTaxCredit`}
            customChangeHandler={updateStatus}
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('life-course-leave-used')}
          </Typography>
        </Column>
        <Column span={6}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.${sectionKey}.areLeavesUsed`}
            dataTa={`${fieldNamePrefix}-areLeavesUsed`}
            customChangeHandler={(value) => {
              if (value) {
                updateStatus();
              } else {
                setFieldValue(`${fieldNamePrefix}.${sectionKey}.numberOfLeavesApplied`, null);
              }
            }
            }
          />
        </Column>
        <Column span={6}>
          <Typography use="normal-text">
            {translate('life-course-leave-applied')}
          </Typography>
        </Column>
        <Column span={6}>
          <CurrencyCell
            name={`${fieldNamePrefix}.${sectionKey}.numberOfLeavesApplied`}
            customChangeHandler={updateStatus}
            dataTa={`${fieldNamePrefix}-numberOfLeavesApplied`}
            disabled={!values[fieldNamePrefix][sectionKey].areLeavesUsed}
          />
        </Column>
      </ColumnLayout>
    </IncomeSectionHeading>
  );
};

TaxCredit.propTypes = {
  /** Contains additional calculation information data */
  values: PropTypes.object,
  /** denotes whether declaration is joint */
  isJointDeclaration: PropTypes.bool,
  /** denotes whether taxable subject is single all year */
  isSingle: PropTypes.bool.isRequired,
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** Provides section key */
  sectionKey: PropTypes.string.isRequired,
};

export default TaxCredit;

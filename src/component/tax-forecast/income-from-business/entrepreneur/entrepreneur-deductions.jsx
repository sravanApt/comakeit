import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Column } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { getCurrentYear, getPreviousYear } from '../../../../common/utils';
import {
  InputWrapper,
  TableCellWrapper,
  SelectWrapper,
  GridWrapper,
} from '../../../../common/styled-wrapper';
import { CurrencyCell, FooterCell } from '../../../../common/table-cell-templates';
import EntrepreneurSectionHeading from '../../income/common/income-section-heading';
import { SELECT_OPTIONS } from './entrepreneur.constants';
import { CURRENCY_INPUT_WIDTH as inputWidth } from '../../../../common/constants';

export const HeadCell = styled.span`
  font-size: ${({ theme }) => theme && theme.fontSizes.fs12};
  color: ${({ theme }) => theme && theme.currencyText};
`;

export const checkBoxProps = {
  type: 'boolean',
  controlType: 'checkbox',
  className: 'entrepreneur-checkbox pull-right',
  width: '30px',
};

export const checkBoxDisabledProps = {
  ...checkBoxProps,
  disabled: true,
};

const inputProps = {
  type: 'number',
  controlType: 'fastField',
  width: inputWidth,
  hasPrefix: false,
};

const EntrepreneurDeductions = ({
  values: {
    entitledToSelfEmployedDeduction,
    entitledToStartUpDeduction,
    entitledToStartUpDeductionWithDisablity,
    numberOfTimesStartUpDeductionApplied,
    entitledToResearchAndDevelopmentDeduction,
    entitledToIncreaseResearchAndDevelopmentDeduction,
    researchAndDevelopmentStatementNumber,
    numberOfHoursWorkedByAssistingPartner,
    entitledToCessationDeduction,
    previouslyUsedCessationDeduction,
  },
  fieldNamePrefix,
  handleRemove,
  taxableYear,
  updateTaxCalculation,
  clearDeductionsDetails,
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
    <EntrepreneurSectionHeading
      heading={translate('entrepreneurial-deductions')}
      handleRemove={handleRemove}
      dataTa="entrepreneurial-deductions"
    >
      <GridWrapper className="entrepreneurial-deductions">
        <Column span={8} />
        <Column span={2}>
          <HeadCell className="pull-right">{getPreviousYear(taxableYear)}</HeadCell>
        </Column>
        <Column span={2}>
          <HeadCell className="pull-right">{getCurrentYear(taxableYear)}</HeadCell>
        </Column>
        <Column span={8}>{translate('entitled-to-self-employed-deduction-compiles-with-hour-criterion')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToSelfEmployedDeduction.previousYearAmount`}
            checked={entitledToSelfEmployedDeduction.previousYearAmount}
            dataTa="self_deduction_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.entitledToSelfEmployedDeduction.currentYearAmount`}
            checked={entitledToSelfEmployedDeduction.currentYearAmount}
            dataTa="self_deduction_current"
            customChangeHandler={(value) => (value ? setAmountUpdateIndicator(amountUpdateIndicator + 1) : clearDeductionsDetails(value))}
          />
        </Column>
        <Column span={8}>{translate('entitled-to-start-up-deduction')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToStartUpDeduction.previousYearAmount`}
            checked={entitledToStartUpDeduction.previousYearAmount}
            dataTa="start_up_deduction_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            disabled={!entitledToSelfEmployedDeduction.currentYearAmount || entitledToStartUpDeductionWithDisablity.currentYearAmount}
            name={`${fieldNamePrefix}.entitledToStartUpDeduction.currentYearAmount`}
            checked={entitledToStartUpDeduction.currentYearAmount}
            dataTa="start_up_deduction_current"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
          />
        </Column>
        <Column span={8}>{translate('entitled-to-start-up-deduction-with-disability')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToStartUpDeductionWithDisablity.previousYearAmount`}
            checked={entitledToStartUpDeductionWithDisablity.previousYearAmount}
            dataTa="start_up_deduction_disability_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.entitledToStartUpDeductionWithDisablity.currentYearAmount`}
            disabled={!entitledToSelfEmployedDeduction.currentYearAmount || entitledToStartUpDeduction.currentYearAmount}
            checked={entitledToStartUpDeductionWithDisablity.currentYearAmount}
            dataTa="start_up_deduction_disability_current"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
          />
        </Column>
        <Column span={8}>{translate('number-of-times-start-up-deduction-applied')}</Column>
        <Column span={2}>
          <TableCellWrapper className="label currency-label">{numberOfTimesStartUpDeductionApplied.previousYearAmount}</TableCellWrapper>
        </Column>
        <Column span={2}>
          <SelectWrapper
            className="select-wrapper no-of-deductions-select pull-right"
            type="selectOne"
            controlType="autocomplete"
            name={`${fieldNamePrefix}.numberOfTimesStartUpDeductionApplied.currentYearAmount`}
            disabled={!entitledToStartUpDeductionWithDisablity.currentYearAmount && !entitledToStartUpDeduction.currentYearAmount}
            options={SELECT_OPTIONS}
            placeholder=""
            width="50px"
            dataTa="no_start_deduction_current"
          />
        </Column>
        <Column span={8}>{translate('entitled-to-research-and-development-deduction')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToResearchAndDevelopmentDeduction.previousYearAmount`}
            checked={entitledToResearchAndDevelopmentDeduction.previousYearAmount}
            dataTa="research_development_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.entitledToResearchAndDevelopmentDeduction.currentYearAmount`}
            checked={entitledToResearchAndDevelopmentDeduction.currentYearAmount}
            dataTa="research_development_current"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            disabled={!entitledToSelfEmployedDeduction.currentYearAmount}
          />
        </Column>
        <Column span={8}>{translate('entitled-to-increase-of-research-and-development-deduction')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToIncreaseResearchAndDevelopmentDeduction.previousYearAmount`}
            checked={entitledToIncreaseResearchAndDevelopmentDeduction.previousYearAmount}
            dataTa="research_development_deduction_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.entitledToIncreaseResearchAndDevelopmentDeduction.currentYearAmount`}
            checked={entitledToIncreaseResearchAndDevelopmentDeduction.currentYearAmount}
            dataTa="research_development_deduction_current"
            disabled={!entitledToResearchAndDevelopmentDeduction.currentYearAmount}
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
          />
        </Column>
        <Column span={8}>{translate('research-and-development-statement-number')}</Column>
        <Column span={2}>
          <TableCellWrapper className="label currency-label">{researchAndDevelopmentStatementNumber.previousYearAmount}</TableCellWrapper>
        </Column>
        <Column span={2}>
          <InputWrapper
            {...inputProps}
            name={`${fieldNamePrefix}.researchAndDevelopmentStatementNumber.currentYearAmount`}
            className="research-development-number-input pull-right"
            dataTa="researchAndDevelopmentStatementNumber"
            disabled={!entitledToResearchAndDevelopmentDeduction.currentYearAmount}
          />
        </Column>
        <Column span={8}>{translate('number-of-hours-worked-by-assisting-parnter')}</Column>
        <Column span={2}>
          <TableCellWrapper className="label currency-label">{numberOfHoursWorkedByAssistingPartner.previousYearAmount}</TableCellWrapper>
        </Column>
        <Column span={2}>
          <InputWrapper
            {...inputProps}
            name={`${fieldNamePrefix}.numberOfHoursWorkedByAssistingPartner.currentYearAmount`}
            className="no-of-hours-worked-input pull-right"
            dataTa="numberOfHoursWorkedByAssistingPartner"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            disabled={!entitledToSelfEmployedDeduction.currentYearAmount}
          />
        </Column>
        <Column span={8}>{translate('entitled-to-cessation-deduction')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.entitledToCessationDeduction.previousYearAmount`}
            checked={entitledToCessationDeduction.previousYearAmount}
            dataTa="entitled_cessation_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            name={`${fieldNamePrefix}.entitledToCessationDeduction.currentYearAmount`}
            checked={entitledToCessationDeduction.currentYearAmount}
            dataTa="entitled_cessation_current"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
          />
        </Column>
        <Column span={8}>{translate('previously-used-cessation-deduction')}</Column>
        <Column span={2}>
          <FooterCell className="label pull-right text-align-right currency-label" value={previouslyUsedCessationDeduction.previousYearAmount} />
        </Column>
        <Column span={2}>
          <CurrencyCell
            name={`${fieldNamePrefix}.previouslyUsedCessationDeduction.currentYearAmount`}
            dataTa="previous_used_cessation_current"
            className="previous_used_cessation_current pull-right"
            customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
            disabled={!entitledToCessationDeduction.currentYearAmount}
          />
        </Column>
      </GridWrapper>
    </EntrepreneurSectionHeading>
  );
};

EntrepreneurDeductions.propTypes = {
  /** specifies the previous and current year values data for
   * all the deduction sections of entreprenuer.
   * these names are as per the backend.
   */
  values: PropTypes.shape({
    entitledToSelfEmployedDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    entitledToStartUpDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    entitledToStartUpDeductionWithDisablity: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    numberOfTimesStartUpDeductionApplied: PropTypes.shape({
      previousYearAmount: PropTypes.number,
      currentYearAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    entitledToResearchAndDevelopmentDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    entitledToIncreaseResearchAndDevelopmentDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    researchAndDevelopmentStatementNumber: PropTypes.shape({
      previousYearAmount: PropTypes.number,
      currentYearAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    numberOfHoursWorkedByAssistingPartner: PropTypes.shape({
      previousYearAmount: PropTypes.number,
      currentYearAmount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
    entitledToCessationDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    previouslyUsedCessationDeduction: PropTypes.shape({
      previousYearAmount: PropTypes.number,
      currentYearAmount: PropTypes.number,
    }),
  }),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** specifies the taxable year */
  taxableYear: PropTypes.number.isRequired,
  /** callback for calculation of updated tax */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** callback for clearing deduction details */
  clearDeductionsDetails: PropTypes.func.isRequired,
};

export default EntrepreneurDeductions;

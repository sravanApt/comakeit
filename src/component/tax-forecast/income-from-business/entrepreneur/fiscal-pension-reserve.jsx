import React, { useMemo } from 'react';
import { Column } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import AllocationDetails from './allocation-details';
import {
  getCurrentYear, getPreviousYear, getTotalValue,
} from '../../../../common/utils';
import { InputWrapper, GridWrapper } from '../../../../common/styled-wrapper';
import { CurrencyCell, FooterCell } from '../../../../common/table-cell-templates';
import { BUSINESS_DETAILS_KEYS_ARRAY } from './entrepreneur.constants';
import EntrepreneurSectionHeading from '../../income/common/income-section-heading';
import { HeadCell, checkBoxProps, checkBoxDisabledProps } from './entrepreneur-deductions';

const FiscalPensionReserve = ({
  values: {
    isAllocateTo, paidAnnuityPremium, pensionReserveDetails,
  },
  fieldNamePrefix,
  handleRemove,
  businessDetails,
  tabIndex,
  taxableYear,
  updateTaxCalculation,
  removeAllocationDetails,
  entrepreneurialDeductions: { entitledToSelfEmployedDeduction },
}) => {
  const currentBusinessDetails = useMemo(() => businessDetails[`${BUSINESS_DETAILS_KEYS_ARRAY[tabIndex]}`]
  && businessDetails[`${BUSINESS_DETAILS_KEYS_ARRAY[tabIndex]}`].map((business) => ({ label: business.businessName, value: business.globalAdministrationId })),
  [businessDetails, tabIndex]);

  return (
    <EntrepreneurSectionHeading
      heading={translate('fiscal-pension-reserve')}
      handleRemove={handleRemove}
      dataTa="entrepreneurial-deductions-fiscal-pension-reserve"
    >
      <GridWrapper>
        <Column span={8} />
        <Column span={2}>
          <HeadCell className="pull-right">{getPreviousYear(taxableYear)}</HeadCell>
        </Column>
        <Column span={2}>
          <HeadCell className="pull-right">{getCurrentYear(taxableYear)}</HeadCell>
        </Column>
        <Column span={8}>{translate('allocate-to-fiscal-pension-reserve')}</Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxDisabledProps}
            name={`${fieldNamePrefix}.isAllocateTo.previousYearAmount`}
            checked={isAllocateTo.previousYearAmount}
            dataTa="allocate_pension_checkbox_previous"
          />
        </Column>
        <Column span={2}>
          <InputWrapper
            {...checkBoxProps}
            disabled={!entitledToSelfEmployedDeduction.currentYearAmount}
            name={`${fieldNamePrefix}.isAllocateTo.currentYearAmount`}
            checked={isAllocateTo.currentYearAmount}
            dataTa="allocate_pension_checkbox_current"
          />
        </Column>
        <Column span={8}>{translate('release-of-fiscal-pension-resrve-because-of-paid-annuity-premium')}</Column>
        <Column span={2}>
          <FooterCell className="label pull-right text-align-right currency-label" value={paidAnnuityPremium.previousYearAmount} />
        </Column>
        <Column span={2}>
          <CurrencyCell
            name={`${fieldNamePrefix}.paidAnnuityPremium.currentYearAmount`}
            dataTa="release_pension_current"
            className="pull-right"
            disabled={!(getTotalValue(pensionReserveDetails, 'opening') || getTotalValue(pensionReserveDetails, 'allocation'))}
          />
        </Column>
        <Column span={2} />
      </GridWrapper>
      <AllocationDetails
        values={pensionReserveDetails}
        name={`${fieldNamePrefix}.pensionReserveDetails`}
        currentBusinessDetails={currentBusinessDetails}
        updateTaxCalculation={updateTaxCalculation}
        isAllocateTo={isAllocateTo.currentYearAmount}
        removeAllocationDetails={removeAllocationDetails}
      />
    </EntrepreneurSectionHeading>
  );
};

FiscalPensionReserve.propTypes = {
  values: PropTypes.shape({
    /** specifies the current and previous years allocated amounts.
     * these names are as per the backend.
     */
    isAllocateTo: PropTypes.shape({
      previousYearAmount: PropTypes.bool,
      currentYearAmount: PropTypes.bool,
    }),
    /** specifies the current and previous years annuity amounts.
     * these names are as per the backend.
     */
    paidAnnuityPremium: PropTypes.shape({
      previousYearAmount: PropTypes.number,
      currentYearAmount: PropTypes.number,
    }),
    /** contains array of pensionReserveDetails fields with description,
     * allocation, release, opening  and closing.
     */
    pensionReserveDetails: PropTypes.arrayOf(
      PropTypes.shape({
        allocation: PropTypes.number,
        description: PropTypes.string,
        release: PropTypes.number,
        opening: PropTypes.number,
        closing: PropTypes.number,
      }),
    ),
  }),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  // businessDetails,
  /** specifies the current selecte tab i.e subject/partner */
  tabIndex: PropTypes.number.isRequired,
  /** specifies the taxable year */
  taxableYear: PropTypes.number.isRequired,
  /** callback for calculation of updated tax */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** entrepreneur deduction section details */
  entrepreneurialDeductions: PropTypes.object,
};

export default FiscalPensionReserve;

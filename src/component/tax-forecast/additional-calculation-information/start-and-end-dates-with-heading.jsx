import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Column, Typography,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { DateInputWrapper } from '../../../common/styled-wrapper';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import { dateProps } from './additional-calculation-information.constants';
import {
  getStartDateObjectWithYearAndMonth,
  getEndDateObjectWithYearAndMonth,
  enableDatesForSingleYear,
} from '../../../common/utils';

/**
 * Tax Forecast - Start Date End Date with Heading
 */
const StartAndEndDatesWithHeading = ({
  sectionHeading, fieldNamePrefix, sectionKey, innerSection, updateTaxCalculation, taxableYear,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const calculateUpdatedTaxRef = useRef();

  const updateStatus = () => {
    setAmountUpdateIndicator(amountUpdateIndicator + 1);
  };

  useEffect(() => {
    calculateUpdatedTaxRef.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculateUpdatedTaxRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const dateInputProps = useMemo(() => ({
    ...dateProps,
    minDate: getStartDateObjectWithYearAndMonth(taxableYear),
    maxDate: getEndDateObjectWithYearAndMonth(taxableYear),
  }), [taxableYear]);

  return (
    <>
      <Column span={12}>
        <Typography use="subtitle1">
          {sectionHeading}
        </Typography>
      </Column>
      <Column span={6}>
        <Typography use="normal-text">
          {translate('start-date')}
        </Typography>
      </Column>
      <Column span={6}>
        <DateInputWrapper
          {...dateInputProps}
          className={`text-input ${fieldNamePrefix}-${sectionKey}-${innerSection}-start-date`}
          name={`${fieldNamePrefix}.${sectionKey}.${innerSection}.startDate`}
          isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
          customChangeHandler={updateStatus}
        />
      </Column>
      <Column span={6}>
        <Typography use="normal-text">
          {translate('end-date')}
        </Typography>
      </Column>
      <Column span={6}>
        <DateInputWrapper
          {...dateInputProps}
          customChangeHandler={updateStatus}
          className={`text-input ${fieldNamePrefix}-${sectionKey}-${innerSection}-end-date`}
          name={`${fieldNamePrefix}.${sectionKey}.${innerSection}.endDate`}
          isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
        />
      </Column>
    </>
  );
};

StartAndEndDatesWithHeading.propTypes = {
  /** specifies header text for the section */
  sectionHeading: PropTypes.string.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** Provides section key */
  sectionKey: PropTypes.string.isRequired,
  /** Provies inner section key */
  innerSection: PropTypes.string.isRequired,
  /** taxable year of dossier */
  taxableYear: PropTypes.number.isRequired,
};

export default StartAndEndDatesWithHeading;

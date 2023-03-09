import React from 'react';
import { ColumnLayout } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import IncomeSectionHeading from '../income/common/income-section-heading';
import StartAndEndDatesWithHeading from './start-and-end-dates-with-heading';

/**
 * Tax Forecast - Addtional Calculation Information - Premium Obligation section
 */
const PremiumObligation = ({
  heading, handleRemove, fieldNamePrefix, sectionKey, updateTaxCalculation, taxableYear,
}) => (
  <IncomeSectionHeading
    heading={heading}
    handleRemove={handleRemove}
    dataTa={`${sectionKey}-section`}
  >
    <ColumnLayout>
      <StartAndEndDatesWithHeading
        sectionHeading={translate('period-not-insured-for-base-pension-and-general-survivers-law')}
        fieldNamePrefix={fieldNamePrefix}
        sectionKey={sectionKey}
        innerSection="periodNotInsuredForBasePensionAndGeneralSurviersLaw"
        updateTaxCalculation={updateTaxCalculation}
        taxableYear={taxableYear}
      />
      <StartAndEndDatesWithHeading
        sectionHeading={translate('period-not-insured-for-healthcare-law')}
        fieldNamePrefix={fieldNamePrefix}
        sectionKey={sectionKey}
        innerSection="periodNotInsuredForHealthcareLaw"
        updateTaxCalculation={updateTaxCalculation}
        taxableYear={taxableYear}
      />
    </ColumnLayout>
  </IncomeSectionHeading>
);

PremiumObligation.propTypes = {
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provides section key */
  sectionKey: PropTypes.string.isRequired,
  /** taxable year of dossier */
  taxableYear: PropTypes.number.isRequired,
};

export default PremiumObligation;

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import TaxForecastContext from '../../tax-forecast-context';
import RemainderInvestmentDedcution from '../common/description-amount-section';
import InvestmentDeductionTable from './investment-deduction-table';

/**
 * Display/Edit Invensment Deduction
 *
 */

const InvestmentDeduction = ({ values, name, setFieldValue }) => {
  const {
    administrationIds: { taxableSubjectBusinessId, fiscalPartnerBusinessId },
    isPartner,
  } = useContext(TaxForecastContext);

  return (
    <div className="investment-deduction-section">
      <InvestmentDeductionTable name={`${name}.investmentDeductions`} values={values.investmentDeductions || []} setFieldValue={setFieldValue} />
      <RemainderInvestmentDedcution
        heading={translate('remainder-investment-deduction')}
        values={values.remainderInvestmentDeduction || []}
        name={`${name}.remainderInvestmentDeduction`}
        dataTa="remainder-correction-table"
        selectedAdministration={isPartner ? fiscalPartnerBusinessId : taxableSubjectBusinessId}
      />
    </div>
  );
};

InvestmentDeduction.propTypes = {
  /** values to render with in modal */
  values: PropTypes.shape({
    investmentDeductions: PropTypes.array,
    remainderInvestmentDeduction: PropTypes.array,
  }).isRequired,
  /** provide field name for form */
  name: PropTypes.string.isRequired,
  /** provide function to update formik field value */
  setFieldValue: PropTypes.func,
};

export default InvestmentDeduction;

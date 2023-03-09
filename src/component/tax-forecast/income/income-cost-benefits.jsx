import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import BenefitsComponent from './common/description-amount-row';
import { incomeTranslate as translate } from './income-translate';
import IncomeSectionHeading from './common/income-section-heading';

/**
  * Tax Forecast - Income Component - Display Income and Cost  from Benefits section
  *
  */

const IncomeCostBenefits = ({
  values: { costToBenefits, incomeFromBenefits }, INCOME_COST_COLUMN_GROUPS, name, handleRemove, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('income-and-cost-from-benefits')}
    handleRemove={handleRemove}
    dataTa="income-cost-benefits"
  >
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: incomeFromBenefits, columnGroup: INCOME_COST_COLUMN_GROUPS.INCOME_COLUMN_GROUP, name: `${name}.incomeFromBenefits`, ...restProps,
      })(BenefitsComponent)}
    </div>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: costToBenefits, columnGroup: INCOME_COST_COLUMN_GROUPS.COST_COLUMN_GROUP, name: `${name}.costToBenefits`, ...restProps,
      })(BenefitsComponent)}
    </div>
  </IncomeSectionHeading>
);

IncomeCostBenefits.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.shape({
    incomeFromBenefits: PropTypes.array,
    costToBenefits: PropTypes.array,
  }),
  /** name for the field array hoc */
  name: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
};

export default IncomeCostBenefits;

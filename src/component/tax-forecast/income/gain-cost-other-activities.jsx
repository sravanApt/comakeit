import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import OtherActivitiesComponent from './common/description-amount-row';
import { incomeTranslate as translate } from './income-translate';
import IncomeSectionHeading from './common/income-section-heading';

/**
  * Tax Forecast - Income Component - Display Gain/Cost from Other Activities section
  *
  */

const GainCostOtherActivities = ({
  values: { gainFromOtherActivities, costOfOtherActivities }, INCOME_COST_COLUMN_GROUPS, name, handleRemove, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('gain-or-cost-from-other-activities')}
    handleRemove={handleRemove}
    dataTa="gain-cost-other-activities"
  >
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: gainFromOtherActivities, name: `${name}.gainFromOtherActivities`, columnGroup: INCOME_COST_COLUMN_GROUPS.INCOME_COLUMN_GROUP, ...restProps,
      })(OtherActivitiesComponent)}
    </div>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: costOfOtherActivities, name: `${name}.costOfOtherActivities`, columnGroup: INCOME_COST_COLUMN_GROUPS.COST_COLUMN_GROUP, ...restProps,
      })(OtherActivitiesComponent)}
    </div>
  </IncomeSectionHeading>
);

GainCostOtherActivities.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.shape({
    gainFromOtherActivities: PropTypes.array,
    costOfOtherActivities: PropTypes.array,
  }),
  /** name for the field array hoc */
  name: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
};

export default GainCostOtherActivities;

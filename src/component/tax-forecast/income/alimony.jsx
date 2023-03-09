import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import AlimonyComponent from './common/description-amount-row';
import { incomeTranslate as translate } from './income-translate';
import IncomeSectionHeading from './common/income-section-heading';

/**
  * Tax Forecast - Income Component - Display Gain/Cost from Making Assets Avaialble to Own Company section
  *
  */

const Alimony = ({
  values: { alimony, costToAlimony }, INCOME_COST_COLUMN_GROUPS, name, handleRemove, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('alimony')}
    handleRemove={handleRemove}
    dataTa="alimony-section"
  >
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: alimony, name: `${name}.alimony`, columnGroup: INCOME_COST_COLUMN_GROUPS.INCOME_COLUMN_GROUP, ...restProps,
      })(AlimonyComponent)}
    </div>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: costToAlimony, name: `${name}.costToAlimony`, columnGroup: INCOME_COST_COLUMN_GROUPS.COST_COLUMN_GROUP, ...restProps,
      })(AlimonyComponent)}
    </div>
  </IncomeSectionHeading>
);

Alimony.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.shape({
    alimony: PropTypes.array,
    costToAlimony: PropTypes.array,
  }),
  /** name for the field array hoc */
  name: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
};

export default Alimony;

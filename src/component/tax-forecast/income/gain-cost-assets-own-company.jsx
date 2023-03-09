import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import AssetsOwnCompanyComponent from './common/description-amount-row';
import { incomeTranslate as translate } from './income-translate';
import IncomeSectionHeading from './common/income-section-heading';

/**
  * Tax Forecast - Income Component - Display Gain/Cost from Making Assets Avaialble to Own Company section
  *
  */

const GainCostAssetsOwnCompany = ({
  values: { gainFromAssetsToOwnCompany, costFromAssetsToOwnCompany }, INCOME_COST_COLUMN_GROUPS, name, handleRemove, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('gain-or-cost-from-making-assets-available-to-own-company')}
    handleRemove={handleRemove}
    dataTa="gain-cost-assets-own-company"
  >
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: gainFromAssetsToOwnCompany, name: `${name}.gainFromAssetsToOwnCompany`, columnGroup: INCOME_COST_COLUMN_GROUPS.INCOME_COLUMN_GROUP, ...restProps,
      })(AssetsOwnCompanyComponent)}
    </div>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: costFromAssetsToOwnCompany, name: `${name}.costFromAssetsToOwnCompany`, columnGroup: INCOME_COST_COLUMN_GROUPS.COST_COLUMN_GROUP, ...restProps,
      })(AssetsOwnCompanyComponent)}
    </div>
  </IncomeSectionHeading>
);

GainCostAssetsOwnCompany.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.shape({
    gainFromAssetsToOwnCompany: PropTypes.array,
    costFromAssetsToOwnCompany: PropTypes.array,
  }),
  /** name for the field array hoc */
  name: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
};

export default GainCostAssetsOwnCompany;

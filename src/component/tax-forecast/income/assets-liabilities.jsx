import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import AssetsLiabilitiesRow from './common/assets-liabilities-row';
import { incomeTranslate as translate } from './income-translate';
import IncomeSectionHeading from './common/income-section-heading';

/**
  * Tax Forecast - Income Component - Display Assets and Liabilities section
  *
  */

const AssetsLiabilities = ({
  values: { otherAssets, tangibleProperty, otherActivitiesLiabilities }, name, handleRemove, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('assets-and-liabilities')}
    handleRemove={handleRemove}
    dataTa="assets-liabilities"
  >
    <Typography use="normal-text" className="mar-t-md">{translate('other-assets')}</Typography>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: otherAssets, name: `${name}.otherAssets`, ...restProps,
      })(AssetsLiabilitiesRow)}
    </div>
    <Typography use="normal-text" className="mar-t-md">{translate('tangible-property')}</Typography>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: tangibleProperty, name: `${name}.tangibleProperty`, ...restProps,
      })(AssetsLiabilitiesRow)}
    </div>
    <Typography use="normal-text" className="mar-t-md">{translate('liabilities-with-regards-to-other-activities')}</Typography>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: otherActivitiesLiabilities, name: `${name}.otherActivitiesLiabilities`, ...restProps,
      })(AssetsLiabilitiesRow)}
    </div>
  </IncomeSectionHeading>
);

AssetsLiabilities.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.shape({
    otherAssets: PropTypes.array,
    tangibleProperty: PropTypes.array,
    otherActivitiesLiabilities: PropTypes.array,
  }),
  /** name for the field array hoc */
  name: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
};

export default AssetsLiabilities;

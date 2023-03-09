import React from 'react';
import { Typography } from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import { convertCurrency } from '../../../common/utils';
import { expenditureTranslate as translate } from './expenditure-translate';

/** Component to display threshold values
 *
 */
const Threshold = ({ thresholdAmount }) => (
  <>
    <Typography use="normal-text" className="threshold-label">
      {`${translate('threshold-label')} ${(thresholdAmount === null) ? '€ ...' : convertCurrency({ value: thresholdAmount })}`}
    </Typography>
  </>
);

Threshold.propTypes = {
  /** threshold amount */
  thresholdAmount: PropTypes.number,
};

export default Threshold;

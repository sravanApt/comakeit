import React from 'react';
import PropTypes from 'prop-types';
import CommonAssetsLiabilities from '../balance-sheet/common-assets-liabilities';
import { CorrectionTableWrapper } from '../../../../common/styled-wrapper';
import { SHARES_IN_EQUITY_CAPITAL } from './profit-loss.constants';

/**
 * Display correction table for partner allocations
 *
 */

const AllocationCorrectionTable = ({
  values, name,
}) => (
  <CorrectionTableWrapper data-ta="allocation-correction-table" className="pl-section forecast-section">
    <div className="pl-section__table">
      <CommonAssetsLiabilities values={values} name={name} sectionType={SHARES_IN_EQUITY_CAPITAL} />
    </div>
  </CorrectionTableWrapper>
);

AllocationCorrectionTable.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  name: PropTypes.string.isRequired,
};

export default AllocationCorrectionTable;

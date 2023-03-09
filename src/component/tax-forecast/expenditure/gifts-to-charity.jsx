import React from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import styled from 'styled-components';
import GeneralGiftsToCharity from './general-gifts-to-charity';
import PeriodicGiftsToCharity from './periodic-gifts-to-charity';
import { expenditureTranslate as translate } from './expenditure-translate';
import IncomeSectionHeading from '../income/common/income-section-heading';
import ExpenditureTotalBar from './expenditure-total-bar';
import Threshold from './threshold';

/**
  * Tax Forecast - Expenditure Component - Display gifts to charity section
  *
  */

const GiftsToCharity = ({
  values: {
    generalGiftsToCharity, periodicGiftsToCharity,
  },
  reportData: {
    reportValues: { totalDeductionForGiftsToCharity },
    thresholdValues: { giftsToCharity },
  }, name, handleRemove, isPartner, ...restProps
}) => (
  <IncomeSectionHeading
    heading={translate('paid-gifts')}
    handleRemove={handleRemove}
    dataTa="gifts-to-charity"
    hideDelete={isPartner}
  >
    <StyledTypography>
      <Typography use="normal-text" className="mar-t-md font-weight-bold display-inline-block">{translate('general-gifts-to-charity')}</Typography>
    </StyledTypography>
    <Threshold thresholdAmount={giftsToCharity} />
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: generalGiftsToCharity, name: `${name}.generalGiftsToCharity`, isPartner, ...restProps,
      })(GeneralGiftsToCharity)}
    </div>
    <Typography use="normal-text" className="mar-t-md font-weight-bold">{translate('periodic-gifts-to-charity')}</Typography>
    <div className="income-section__table">
      {/** Wrapped Common Row component with FieldArray HOC */}
      {FieldArray({
        values: periodicGiftsToCharity, name: `${name}.periodicGiftsToCharity`, isPartner, ...restProps,
      })(PeriodicGiftsToCharity)}
    </div>
    <ExpenditureTotalBar
      label={translate('total-deduction-for-gifts')}
      amount={totalDeductionForGiftsToCharity}
    />
  </IncomeSectionHeading>
);

const StyledTypography = styled.div`
  .display-inline-block : {
    display: inline-block;
  }
`;

GiftsToCharity.propTypes = {
  /** contains array of income fields with description, wages etc... */
  values: PropTypes.object,
  /** name for the filed array hoc */
  name: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
};

export default GiftsToCharity;

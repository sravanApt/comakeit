import React, { useContext } from 'react';
import { Typography } from '@visionplanner/ui-react-material';
import { TaxAmountWrapper } from '../../../../common/styled-wrapper';
import TaxForecastContext from '../../tax-forecast-context';
import { convertCurrency } from '../../../../common/utils';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

const TaxAmount = () => {
  const { taxableAmount } = useContext(TaxForecastContext);

  return (
    <TaxAmountWrapper className="taxAmount flex-column">
      <Typography className="label" use="normal-text">{translate('tax-amount')}</Typography>
      {convertCurrency({ value: taxableAmount })}
    </TaxAmountWrapper>
  );
};

export default TaxAmount;

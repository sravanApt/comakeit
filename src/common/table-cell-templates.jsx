import React from 'react';
import { Tooltip } from '@visionplanner/ui-react-material';
import {
  InputWrapper, IconWrapper, TableCellWrapper, CurrencyCellWrapper,
} from './styled-wrapper';
import { convertCurrency } from './utils';
import { taxForecastTranslate as translate } from '../component/tax-forecast/tax-forecast-translate';
import { DESCRIPTION_INPUT_WIDTH, CURRENCY_INPUT_WIDTH } from './constants';

const ActionsCell = ({
  lastIndex, handleDelete, index, dataTa, rubricId = null, disabled = false, className = '',
}) => (
  lastIndex !== index && (
    <Tooltip overlay={translate('delete')} placement="right">
      <IconWrapper icon="trash" className={`icon__actions icon__actions--trash ${className}`} onClick={(!rubricId && !disabled) && handleDelete} dataTa={dataTa} disabled={disabled || !!rubricId} />
    </Tooltip>
  )
);

const DescriptionCell = ({
  name, dataTa, disabled = false, width = DESCRIPTION_INPUT_WIDTH, className, customChangeHandler,
}) => (
  <InputWrapper
    width={width}
    className={`${className || ''} text-input description`}
    controlType="fastField"
    type="text"
    name={name}
    dataTa={dataTa}
    disabled={disabled}
    customChangeHandler={customChangeHandler}
  />
);

const CurrencyCell = ({
  name, dataTa, hasPrefix = true, customChangeHandler, className = 'col-currency',
  disabled = false, width = CURRENCY_INPUT_WIDTH, prefix = null, maxLimit, allowedDecimalSeparators, decimalScale,
}) => (
  <InputWrapper
    width={width}
    align="right"
    className={`text-input currency-input ${className}`}
    controlType="fastField"
    type="currency"
    name={name}
    prefix={hasPrefix ? <span>&euro;</span> : prefix}
    dataTa={dataTa}
    customChangeHandler={customChangeHandler}
    disabled={disabled}
    decimalScale={decimalScale}
    allowedDecimalSeparators={allowedDecimalSeparators}
    maxLimit={maxLimit}
  />
);

const NumberCell = ({
  name, dataTa, prefix, width = CURRENCY_INPUT_WIDTH, disabled = false, customChangeHandler,
}) => (
  <InputWrapper
    width={width}
    align="right"
    className="text-input"
    controlType="fastField"
    type="number"
    name={name}
    prefix={prefix}
    dataTa={dataTa}
    disabled={disabled}
    customChangeHandler={customChangeHandler}
  />
);

const FooterCell = ({ value, className = '' }) => (
  <TableCellWrapper title={convertCurrency({ value })} className={className}>
    { convertCurrency({ value }) }
  </TableCellWrapper>
);

const CurrencyLabelCell = ({ value, className = '' }) => (
  <CurrencyCellWrapper title={convertCurrency({ value })} className={className}>
    { convertCurrency({ value }) }
  </CurrencyCellWrapper>
);

const HeadCell = ({ name, date, className = '' }) => (
  <TableCellWrapper className={className}>
    <div>{name}</div>
    {date}
  </TableCellWrapper>
);

export {
  ActionsCell,
  DescriptionCell,
  CurrencyCell,
  NumberCell,
  FooterCell,
  CurrencyLabelCell,
  HeadCell,
};

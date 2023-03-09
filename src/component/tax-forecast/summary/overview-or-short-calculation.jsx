import React from 'react';
import PropTypes from 'prop-types';
import {
  ColumnLayout, Column, Typography, Tooltip,
} from '@visionplanner/ui-react-material';
import { convertCurrency } from '../../../common/utils';
import { summaryTranslate as translate } from './summary-translate';
import { TableCellWrapper } from '../../../common/styled-wrapper';

const RenderLineItem = ({ lineItem }) => (
  <>
    <Column span={8}>
      {lineItem.name}
    </Column>
    {
      (lineItem.alignment === 2) ? (
        <>
          <Column span={2} />
          <Column span={2} className="text-align-right">
            <Tooltip overlay={convertCurrency({ value: lineItem.amount })} placement="right">
              <TableCellWrapper width="100%">{convertCurrency({ value: lineItem.amount })}</TableCellWrapper>
            </Tooltip>
          </Column>
        </>
      ) : (
        <>
          <Column span={2} className="text-align-right">
            <Tooltip overlay={convertCurrency({ value: lineItem.amount })} placement="right">
              <TableCellWrapper width="100%">{convertCurrency({ value: lineItem.amount })}</TableCellWrapper>
            </Tooltip>
          </Column>
          <Column span={2} />
        </>
      )
    }
  </>
);

const RenderSubSection = ({ subSectionData }) => (
  <>
    <Column span={12}>
      <Typography use="normal-text" className="overview-or-short-calculation-heading">{subSectionData?.name}</Typography>
    </Column>
    {
      subSectionData?.lineItems?.map((lineItem, lineItemIndex) => (
        <RenderLineItem key={`sub-section-line-item-${lineItemIndex}`} lineItem={lineItem} />
      ))
    }
    <Column span={8}>
      {subSectionData?.summary?.name}
    </Column>
    <Column span={4} className="text-align-right">
      {convertCurrency({ value: subSectionData?.summary?.amount })}
    </Column>
  </>
);

/**
  * Tax Forecast - common component to display summary overview and short calculation.
  *
  */

const OverviewOrShortCalculation = ({ summarySubsectionData, netPay }) => (
  <ColumnLayout className="mar-t-sm">
    {summarySubsectionData?.map((subSectionData, index) => (
      <RenderSubSection key={`sub-section-${index}`} subSectionData={subSectionData}  />
    ))}

    { (netPay !== null) && (netPay !== undefined) && (
      <>
        <Column span={8}>
          <Typography use="normal-text" className="overview-or-short-calculation-heading">{translate('expected-outcome-of-income')}</Typography>
        </Column>
        <Column span={4} className="text-align-right">
          <Typography use="normal-text" className="overview-or-short-calculation-heading">{convertCurrency({ value: netPay })}</Typography>
        </Column>
      </>
    )}
  </ColumnLayout>
);

OverviewOrShortCalculation.propTypes = {
  /** prop which contains array of obects data related to overview or short calculation */
  summarySubsectionData: PropTypes.array.isRequired,
};

export default OverviewOrShortCalculation;

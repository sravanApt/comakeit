import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  ColumnLayout, ColumnInner, Column, Typography,
} from '@visionplanner/ui-react-material';
import {
  isFutureDate, getEndDateObjectWithYearAndMonth, getHundredYearsBackDateObjectWithYearAndMonth,
} from '../../../common/utils';
import { DateInputWrapper, SelectWrapper } from '../../../common/styled-wrapper';
import { personalDetailsTranslate as translate } from './personal-details-translate';

const conditionOptions = [
  { id: 'Yes', label: translate('yes'), value: true },
  { id: 'No', label: translate('no'), value: false },
];

const dateProps = {
  type: 'date',
  className: 'text-input',
  placeholder: translate('date'),
  showSelectOptions: true,
  minDate: getHundredYearsBackDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
};

const selectProps = {
  className: 'select-wrapper',
  type: 'selectOne',
  controlType: 'autocomplete',
  placeholder: translate('select'),
  hideSelectedOptions: false,
};

/**
  * Tax Forecast - Personal Form - Display Information when marital status value is Situation Changed
  *
  */

const StatusChangedInfo = ({
  values: { periodOfLivingTogether: { startDate, endDate } },
  fieldNamePrefix,
}) => (
  <div className="taxable-subject-situation-container" data-ta="taxable-subject-situation-container">
    <Typography use="h5" className="flex personal-info-heading pad-ver-xs mar-t-md">
      {translate('situation-changed')}
    </Typography>
    <ColumnLayout>
      <Column span={3} className="text-align-right">{translate('date-of-marriage-or-register-partnership')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3} className="date-of-marriage">
            <DateInputWrapper
              {...dateProps}
              name={`${fieldNamePrefix}.marriageDate`}
              isOutsideRange={isFutureDate}
              isDateReadOnly
              showClearDate
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('date-of-divorce')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3} className="date-of-divorce">
            <DateInputWrapper
              {...dateProps}
              name={`${fieldNamePrefix}.divorceDate`}
              isOutsideRange={isFutureDate}
              isDateReadOnly
              showClearDate
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('start-of-period-registered-on-same-address')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3} className="start-date-living-together">
            <DateInputWrapper
              {...dateProps}
              name={`${fieldNamePrefix}.periodOfLivingTogether.startDate`}
              isOutsideRange={isFutureDate}
              isDateReadOnly
              showClearDate
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('end-of-period-registered-on-same-address')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3} className="end-date-living-together">
            <DateInputWrapper
              {...dateProps}
              name={`${fieldNamePrefix}.periodOfLivingTogether.endDate`}
              isOutsideRange={isFutureDate}
              isDateReadOnly
              showClearDate
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('meets-conditions-for-fiscal-partnership?')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={4}>
            <SelectWrapper
              {...selectProps}
              name={`${fieldNamePrefix}.isFiscalPartnerCriteriaMet`}
              options={conditionOptions}
              className="meet-condition-partnership-select"
            />
          </Column>
        </ColumnInner>
      </Column>
      { (startDate && endDate) && (
        <>
          <Column span={3} className="text-align-right">{translate('conclusion-for-fiscal-partnership')}</Column>
          <Column span={9}>{`Fiscal partners from ${moment(startDate).format('DD MMMM')} Until ${moment(endDate).format('DD MMMM')}`}</Column>
        </>
      )}
      <Column span={3} className="text-align-right">{translate('apply-fiscal-partnership-for-the-whole-year?')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={4}>
            <SelectWrapper
              {...selectProps}
              name={`${fieldNamePrefix}.applyFiscalPartnerForWholeYear`}
              options={conditionOptions}
              className="apply-partnership-select"
            />

          </Column>
        </ColumnInner>
      </Column>
    </ColumnLayout>
  </div>
);

StatusChangedInfo.propTypes = {
  /** Provide personal details  */
  values: PropTypes.shape({
    /** specifies start date of marriage */
    marriageDate: PropTypes.string,
    /** specifies end date of marriage */
    divorceDate: PropTypes.string,
    periodOfLivingTogether: PropTypes.shape({
      /** specifies start date of living together period */
      startDate: PropTypes.string,
      /** specifies end date of living together period */
      endDate: PropTypes.string,
    }),
    /** specifies whether partner met the criteria */
    isFiscalPartnerCriteriaMet: PropTypes.bool,
    /** provides option for specifying partner for entire year */
    applyFiscalPartnerForWholeYear: PropTypes.bool,
  }).isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

export default StatusChangedInfo;

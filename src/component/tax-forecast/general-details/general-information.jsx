import React from 'react';
import PropTypes from 'prop-types';
import {
  ColumnLayout, Column, Typography, ColumnInner,
} from '@visionplanner/ui-react-material';
import { generalDetailsTranslate as translate } from './general-details-translate';
import { DateInputWrapper, InputWrapper } from '../../../common/styled-wrapper';
import {
  getStartDateObjectWithYearAndMonth, getEndDateObjectWithYearAndMonth, dateToDayMonthAndYearString, getYears,
} from '../../../common/utils';

/**
  * Tax Forecast - Display General Information
  *
  */

const GeneralInformation = ({
  heading,
  values,
  isPartner,
  fieldNamePrefix,
  handleDueDateChange,
  taxableYear,
  dataTa,
}) => (
  <div data-ta={dataTa}>
    <Typography use="h5" className="flex general-info-heading pad-ver-xs mar-t-md">
      {heading}
    </Typography>
    <ColumnLayout>
      <Column span={3} className="text-align-right">{translate('name')}</Column>
      <Column span={9}>
        {values.name}
      </Column>
      <Column span={3} className="text-align-right">{translate('becon-number')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.beconNumber`}
              dataTa={`${dataTa}-beconNumber`}
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{isPartner ? translate('due-date-fiscal-partner') : translate('due-date-taxable-subject')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            { !isPartner ? (
              <DateInputWrapper
                width="130px"
                className="due-date"
                type="date"
                name={`${fieldNamePrefix}.dueDate`}
                showSelectOptions
                placeholder={translate('date')}
                isDateReadOnly
                showClearDate
                minDate={getStartDateObjectWithYearAndMonth(taxableYear)}
                maxDate={getEndDateObjectWithYearAndMonth(taxableYear + 2)}
                customChangeHandler={handleDueDateChange}
                years={getYears(taxableYear)}
              />
            ) : (
              <>
                {values.dueDate && (
                  <Typography use="normal-text" dataTa="fiscal-partner-due-date">
                    {dateToDayMonthAndYearString(values.dueDate, 'DD-MM-YYYY')}
                  </Typography>
                )}
              </>
            ) }
          </Column>
        </ColumnInner>
      </Column>
    </ColumnLayout>
  </div>
);

GeneralInformation.propTypes = {
  /** Heading of general information  */
  heading: PropTypes.string.isRequired,
  /** general information details  */
  values: PropTypes.object.isRequired,
  /** Checks whether partner or not  */
  isPartner: PropTypes.bool,
  /** Provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** change handler for due date */
  handleDueDateChange: PropTypes.func,
  /** taxable year of dossier */
  taxableYear: PropTypes.number,
  /** test attribute to identify the element */
  dataTa: PropTypes.string,
};
export default GeneralInformation;

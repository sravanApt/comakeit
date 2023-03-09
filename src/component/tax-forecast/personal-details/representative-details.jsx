import React from 'react';
import PropTypes from 'prop-types';
import {
  ColumnLayout, ColumnInner, Column, Typography,
} from '@visionplanner/ui-react-material';
import { personalDetailsTranslate as translate } from './personal-details-translate';
import { SelectWrapper, DateInputWrapper, InputWrapper } from '../../../common/styled-wrapper';
import {
  isFutureDate, getDateObjectWithYearAndMonth, getHundredYearsBackDateObjectWithYearAndMonth,
} from '../../../common/utils';

const RepresentativeDetails = ({
  dataTa,
  fieldNamePrefix,
  countries,
}) => (
  <div data-ta={dataTa}>
    <Typography use="h5" className="flex personal-info-heading pad-ver-xs">
      {translate('representative-details')}
    </Typography>
    <ColumnLayout>
      <Column span={3} className="text-align-right">{translate('first-name')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.person.firstName`}
              dataTa="representative-first-name"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('initials')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={2}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.person.initials`}
              dataTa="representative-initials"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('middle-name')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.person.middleName`}
              dataTa="representative-middle-name"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('last-name')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.person.lastName`}
              dataTa="representative-last-name"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('bsn')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={4}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.person.bsn`}
              dataTa="representative-bsn"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('date-of-birth')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <DateInputWrapper
              className="representative-date-of-birth"
              dataTa="representative-date-of-birth"
              type="date"
              name={`${fieldNamePrefix}.person.dateOfBirth`}
              isOutsideRange={isFutureDate}
              showSelectOptions
              placeholder={translate('date')}
              isDateReadOnly
              showClearDate
              minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
              maxDate={getDateObjectWithYearAndMonth()}
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('street')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={4}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.address.street`}
              dataTa="representative-street"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('house-number')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={2}>
            <InputWrapper
              type="number"
              name={`${fieldNamePrefix}.address.houseNumber`}
              dataTa="representative-house-number"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('addition')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={2}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.address.additionToHouseNumber`}
              dataTa="representative-addition"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('zipcode')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.address.zipCode`}
              dataTa="representative-zip-code"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('city')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <InputWrapper
              type="text"
              name={`${fieldNamePrefix}.address.city`}
              dataTa="representative-city"
            />
          </Column>
        </ColumnInner>
      </Column>
      <Column span={3} className="text-align-right">{translate('country')}</Column>
      <Column span={9}>
        <ColumnInner>
          <Column span={3}>
            <SelectWrapper
              type="selectOne"
              controlType="autocomplete"
              menuPortalTarget
              name={`${fieldNamePrefix}.address.countryId`}
              dataTa="representative-country"
              options={countries}
              className="country-code-select"
              placeholder={translate('select')}
            />
          </Column>
        </ColumnInner>
      </Column>
    </ColumnLayout>
  </div>
);

RepresentativeDetails.propTypes = {
  /** Provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** test attribute to identify the element */
  dataTa: PropTypes.string,
  /** specifies list of countries */
  countries: PropTypes.array,
};

export default RepresentativeDetails;

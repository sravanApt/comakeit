import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {
  Tooltip, DataTable, Button, Typography, FieldArray,
} from '@visionplanner/ui-react-material';
import { personalDetailsTranslate as translate } from './personal-details-translate';
import {
  InputWrapper, IconWrapper, SelectWrapper, DescriptionCellWrapper,
} from '../../../common/styled-wrapper';
import {
  startDateofYear,
  formatMasterData,
  isDateWithInRange,
  getDateObjectWithYearAndMonth,
  getPreviousDate,
  getYear,
  getCurrentDate,
  endDateofYear,
} from '../../../common/utils';
import { REGISTRATION_ON_ADDRESS_VALUES, CHILD_TEMPLATE } from './personal-details.constants';
import { YYYY_MM_DD_FORMAT } from '../../../common/constants';

const inputProps = {
  type: 'text', width: '120px', className: 'text-input', placeholder: '',
};
const dateProps = {
  ...inputProps,
  type: 'date',
  width: '130px',
  placeholder: translate('date'),
  showSelectOptions: true,
  withPortal: true,
  isDateReadOnly: true,
  showClearDate: true,
};
const selectProps = {
  className: 'select-wrapper',
  type: 'selectOne',
  controlType: 'autocomplete',
  menuPortalTarget: true,
  placeholder: translate('select'),
  hideSelectedOptions: false,
};
const checkboxProps = { className: 'checkbox-wrapper', type: 'boolean', controlType: 'checkbox' };

/**
  * Tax Forecast - Personal Form - Display Children Information
  *
  */

const ChildrenInfo = ({
  values,
  fieldNamePrefix,
  childrenRegisteredAddresssesOptions,
  parentCollectingChildCareOptions,
  taxableYear,
  arrayHelpers,
  handleChildrenValues,
}) => {
  const CHILD_COLUMN_GROUP = useMemo(() => ([
    {
      id: 1,
      label: translate('first-name'),
      className: 'col-name',
    },
    {
      id: 2,
      label: translate('date-of-birth'),
      className: 'col-dob',
    },
    {
      id: 3,
      label: `${translate('age-on')} ${startDateofYear(taxableYear)}`,
      className: 'col-age',
    },
    {
      id: 4,
      label: translate('bsn'),
      className: 'col-bsn',
    },
    {
      id: 5,
      label: translate('parent-collects-childcare'),
      className: 'col-parent',
    },
    {
      id: 6,
      label: translate('date-of-death'),
      className: 'col-dod',
    },
    {
      id: 7,
      label: translate('registration-on-address'),
      className: 'col-registration',
    },
    {
      id: 8,
      label: translate('co-parenting'),
      className: 'col-co-parent',
    },
    {
      id: 9,
      label: () => (
        <p className="ellipsis" title={translate('living-with-taxable-subject-or-fiscal-partner-at-least-3-days-a-week')}>
          {translate('living-with-taxable-subject-or-fiscal-partner-at-least-3-days-a-week')}
        </p>
      ),
      className: 'col-living',
    },
    {
      id: 10,
      label: () => (
        <p className="ellipsis" title={translate('support-to-significant-extent')}>
          {translate('support-to-significant-extent')}
        </p>
      ),
      className: 'col-support',
    },
    {
      id: 11,
      label: translate('actions'),
      className: 'col-actions',
    },
  ]), [taxableYear]);

  const startDateRangeForBirthDate = useMemo(() => (startDateofYear(taxableYear - 99, YYYY_MM_DD_FORMAT)), [taxableYear]);
  const endDateRangeForTaxableYear = useMemo(() => ((getYear() == taxableYear) ? getCurrentDate(YYYY_MM_DD_FORMAT) : endDateofYear(taxableYear, YYYY_MM_DD_FORMAT)), [taxableYear]);

  const childRowTemplate = useMemo(() => ({
    name: ({ index }) => (
      <InputWrapper
        {...inputProps}
        name={`${fieldNamePrefix}.${index}.name`}
        dataTa={`name-child${index}`}
      />
    ),
    dateOfBirth: ({ index }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.dateOfBirth`}
        className="date-of-birth-child"
        isOutsideRange={isDateWithInRange(startDateRangeForBirthDate, endDateRangeForTaxableYear)}
        minDate={getDateObjectWithYearAndMonth(startDateRangeForBirthDate)}
        maxDate={getDateObjectWithYearAndMonth(endDateRangeForTaxableYear)}
      />
    ),
    age: ({ age, dateOfBirth }) => {
      const childAge = dateOfBirth && taxableYear >= moment(dateOfBirth).year() ? moment([taxableYear]).diff(moment(dateOfBirth, 'YYYY-MM-DD'), 'years', false) : age;
      return <DescriptionCellWrapper className="justify-content-center">{childAge}</DescriptionCellWrapper>;
    },
    bsn: ({ index }) => (
      <InputWrapper
        {...inputProps}
        name={`${fieldNamePrefix}.${index}.bsn`}
        dataTa={`bsn-child${index}`}
      />
    ),
    parentCollectingChildCare: ({ index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.parentCollectingChildCare`}
        options={formatMasterData(parentCollectingChildCareOptions)}
        className={`parent-collect-child-care${index}`}
      />
    ),
    dateOfDeath: ({ index, dateOfBirth }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.dateOfDeath`}
        className="date-of-death-child"
        isOutsideRange={isDateWithInRange(getPreviousDate(dateOfBirth), endDateRangeForTaxableYear)}
        disabled={!dateOfBirth}
        minDate={getDateObjectWithYearAndMonth(getPreviousDate(dateOfBirth))}
        maxDate={getDateObjectWithYearAndMonth(endDateRangeForTaxableYear)}
      />
    ),
    registrationOnAddress: ({ index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.registrationOnAddress`}
        options={formatMasterData(childrenRegisteredAddresssesOptions)}
        className="registration-on-select"
        customChangeHandler={(value) => handleChildrenValues(value, index, 'registrationOnAddress')}
      />
    ),
    isCoParenting: ({ registrationOnAddress, index }) => (
      <InputWrapper
        {...checkboxProps}
        name={`${fieldNamePrefix}.${index}.isCoParenting`}
        dataTa={`co-parent-check-box-${index}`}
        disabled={registrationOnAddress !== REGISTRATION_ON_ADDRESS_VALUES.EX_PARTNER}
        customChangeHandler={(value) => handleChildrenValues(value, index, 'isCoParenting')}
      />
    ),
    isAtleastThreeDaysPerWeekLiving: ({
      registrationOnAddress, isCoParenting, index,
    }) => (
      <InputWrapper
        {...checkboxProps}
        name={`${fieldNamePrefix}.${index}.isAtleastThreeDaysPerWeekLiving`}
        dataTa={`living-together-check-box-${index}`}
        disabled={(registrationOnAddress !== REGISTRATION_ON_ADDRESS_VALUES.EX_PARTNER) || !isCoParenting}
      />
    ),
    isSignificantSupportExtended: ({ registrationOnAddress, index }) => (
      <InputWrapper
        {...checkboxProps}
        name={`${fieldNamePrefix}.${index}.isSignificantSupportExtended`}
        dataTa={`support-check-box-${index}`}
        disabled={registrationOnAddress !== REGISTRATION_ON_ADDRESS_VALUES.EX_PARTNER}
      />
    ),
    actions: ({ index }) => (
      <>
        <Tooltip overlay={translate('delete')} placement="right">
          <IconWrapper icon="trash" className="icon__actions icon__actions--remove" onClick={() => arrayHelpers.remove(index)} />
        </Tooltip>
      </>
    ),
  }), [fieldNamePrefix, taxableYear, parentCollectingChildCareOptions, childrenRegisteredAddresssesOptions, handleChildrenValues, arrayHelpers]);

  const addNewChild = () => {
    arrayHelpers.push(CHILD_TEMPLATE);
  };

  return (
    <div className="children-container">
      <Typography use="h5" className="flex personal-info-heading pad-ver-xs">
        {`${translate('children')} (${values.length}) `}
        <Button buttonType="tertiary" dataTa="add-new-child" onClick={addNewChild}>{`+${translate('add')}`}</Button>
      </Typography>
      {!!values.length && (
        <div className="children-table pad-ver-lg">
          <DataTable
            columnGroups={CHILD_COLUMN_GROUP}
            rowTemplate={childRowTemplate}
            rows={values}
            stickyRows={1}
            stickyColumns={1}
            dataTa="children-table"
          />
        </div>
      )}
    </div>
  );
};

ChildrenInfo.propTypes = {
  /** Provide personal details  */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** array of registered address options */
  childrenRegisteredAddresssesOptions: PropTypes.PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      displayName: PropTypes.string,
    }),
  ),
  /** function that will update children values */
  handleChildrenValues: PropTypes.func.isRequired,
};

/** Exported Enhanced Children info Component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name: 'children', ...restProps })(ChildrenInfo));

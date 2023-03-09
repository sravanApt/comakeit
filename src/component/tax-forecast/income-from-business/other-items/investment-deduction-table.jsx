import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { INVESTMENT_DEDUCTION_COLUMN_GROUP, MIA_LETTER_OPTIONS } from './other-items.constants';
import { defaultYesOrNoOptions } from '../../income/income.constants';
import { InputWrapper, DateInputWrapper } from '../../../../common/styled-wrapper';
import {
  isOutsideRange, getHundredYearsBackDateObjectWithYearAndMonth, getDateObjectWithYearAndMonth,
} from '../../../../common/utils';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

const selectProps = {
  type: 'selectOne',
  width: '70px',
  controlType: 'autocomplete',
  placeholder: translate('select'),
  options: defaultYesOrNoOptions,
  menuPortalTarget: true,
  hideSelectedOptions: false,
};

const defaultRowTemplate = {
  description: '',
  commissioningDate: null,
  share: null,
  claimEIA: false,
  amountEIA: null,
  eiaReferenceNumber: null,
  claimMIA: false,
  amountMIA: null,
  miaReferenceNumber: null,
  miaLetter: null,
  claimKIA: false,
  amountKIA: null,
  amountPaid: 0,
  disinvestmentAddditionAmount: 0,
  percentageKIA: null,
};

const resetFieldValues = (setFieldValue, value, fieldNamePrefix, fields) => {
  if (!value) {
    fields.forEach((field) => setFieldValue(`${fieldNamePrefix}.${field.name}`, field.value));
  }
};

/**
  * Tax Forecast - Other Items Component - Investment deduction table component
  *
  */

const InvestmentDeductionTable = ({
  values, fieldNamePrefix, arrayHelpers, setFieldValue,
}) => {
  const rowTemplate = {
    description: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={!!rubricId}
      />
    ),
    commissioningDate: ({ index }) => (
      <DateInputWrapper
        type="date"
        className="input-date"
        width="130px"
        name={`${fieldNamePrefix}.${index}.commissioningDate`}
        isOutsideRange={isOutsideRange}
        showSelectOptions
        withPortal
        placeholder={translate('date')}
        isDateReadOnly
        showClearDate
        minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
        maxDate={getDateObjectWithYearAndMonth()}
      />
    ),
    claimKIA: ({ index }) => (
      <InputWrapper
        {...selectProps}
        placeholder="-"
        name={`${fieldNamePrefix}.${index}.claimKIA`}
        customChangeHandler={(value) => resetFieldValues(setFieldValue, value, `${fieldNamePrefix}.${index}`, [{ name: 'amountKIA', value: null }])}
        className="claimKIA-select"
      />
    ),
    amountKIA: ({ index, description, claimKIA }) => (
      <CurrencyCell
        disabled={!description || !claimKIA}
        name={`${fieldNamePrefix}.${index}.amountKIA`}
        className="amount-KIA"
      />
    ),
    share: ({ index, description }) => (
      <CurrencyCell
        disabled={!description}
        name={`${fieldNamePrefix}.${index}.share`}
      />
    ),
    amountPaid: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountPaid`}
        disabled={!description}
      />
    ),
    claimEIA: ({ claimMIA, index }) => (
      <InputWrapper
        {...selectProps}
        placeholder="-"
        name={`${fieldNamePrefix}.${index}.claimEIA`}
        className="claimEIA-select"
        disabled={claimMIA}
        customChangeHandler={(value) => resetFieldValues(setFieldValue, value, `${fieldNamePrefix}.${index}`, [{ name: 'amountEIA', value: null }, { name: 'eiaReferenceNumber', value: null }])}
      />
    ),
    amountEIA: ({
      claimEIA, claimMIA, index,
    }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountEIA`}
        disabled={claimMIA || !claimEIA}
        className="amount-EIA"
      />
    ),
    eiaReferenceNumber: ({
      claimEIA, claimMIA, index,
    }) => (
      <InputWrapper
        width="176px"
        type="text"
        name={`${fieldNamePrefix}.${index}.eiaReferenceNumber`}
        disabled={claimMIA || !claimEIA}
      />
    ),
    claimMIA: ({ claimEIA, index }) => (
      <InputWrapper
        {...selectProps}
        placeholder="-"
        name={`${fieldNamePrefix}.${index}.claimMIA`}
        className="claimMia-select"
        disabled={claimEIA}
        customChangeHandler={(value) => resetFieldValues(setFieldValue, value, `${fieldNamePrefix}.${index}`, [{ name: 'amountMIA', value: null }, { name: 'miaReferenceNumber', value: null }])}
      />
    ),
    amountMIA: ({
      claimMIA, claimEIA, index,
    }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountMIA`}
        disabled={claimEIA || !claimMIA}
        className="amount-MIA"
      />
    ),
    miaReferenceNumber: ({
      claimMIA, claimEIA, index,
    }) => (
      <InputWrapper
        width="176px"
        type="text"
        name={`${fieldNamePrefix}.${index}.miaReferenceNumber`}
        disabled={claimEIA || !claimMIA}
      />
    ),
    miaLetter: ({ claimEIA, index }) => (
      <InputWrapper
        {...selectProps}
        placeholder="-"
        name={`${fieldNamePrefix}.${index}.miaLetter`}
        className="miaLetter-select"
        options={MIA_LETTER_OPTIONS}
        disabled={claimEIA}
      />
    ),
    actions: ({ index, rubricId }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => arrayHelpers.remove(index)}
        dataTa={`investment-deduction-${index}`}
        index={index}
        rubricId={rubricId}
        className="pad-r-lg"
      />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
  });

  return (
    <DataTable
      className="correction-table"
      columnGroups={INVESTMENT_DEDUCTION_COLUMN_GROUP}
      rowTemplate={rowTemplate}
      rows={values}
      dataTa="correction-table"
    />
  );
};

InvestmentDeductionTable.propTypes = {
  /** contains array of income fields with description, amount etc... */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      commissioningDate: PropTypes.string,
      share: PropTypes.number,
      claimEIA: PropTypes.bool,
      amountEIA: PropTypes.number,
      eiaReferenceNumber: PropTypes.string,
      claimMIA: PropTypes.bool,
      amountMIA: PropTypes.number,
      miaReferenceNumber: PropTypes.string,
      miaLetter: PropTypes.string,
      claimKIA: PropTypes.bool,
      amountKIA: PropTypes.number,
      amountPaid: PropTypes.number,
      disinvestmentAddditionAmount: PropTypes.number,
      percentageKIA: PropTypes.number,
    }),
  ).isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provide function to update formik field value */
  setFieldValue: PropTypes.func,
};

export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(InvestmentDeductionTable));

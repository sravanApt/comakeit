import React, { useMemo, useEffect, useRef } from 'react';
import moment from 'moment';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from '../expenditure-translate';
import {
  ActionsCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import {
  InputWrapper, SelectWrapper, TableCellWrapper,
} from '../../../../common/styled-wrapper';
import { EDUCATIONAL_END_YEAR, EDUCATIONAL_START_YEAR } from '../expenditure.constants';
import { defaultYesOrNoOptions } from '../../income/income.constants';
import {
  enableDatesTillCurrentYear, getHundredYearsBackDateObjectWithYearAndMonth, getEndDateObjectWithYearAndMonth,
} from '../../../../common/utils';

/**
 * Modal - Component that can be used to show and edit Study Grant Repaid Modal
 *
 */

const CURRENT_COLUMN_GROUP = [
  {
    id: 'educationalYear',
    label: translate('educational-year'),
    className: 'col-annual-reserve',
  },
  {
    id: 'amount',
    label: () => <TableCellWrapper title={translate('amount-label')}>{translate('amount-label')}</TableCellWrapper>,
    className: 'col-annual-reserve text-align-right',
  },
  {
    id: 'mbo',
    label: translate('mbo'),
    className: 'col-annual-reserve',
  },
  {
    id: 'hbO_WO',
    label: translate('hbOWO'),
    className: 'col-annual-reserve',
  },
  {
    id: 'startDate',
    label: () => <TableCellWrapper width="130px" title={translate('start-of-study-period')}>{translate('start-of-study-period')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'endDate',
    label: () => <TableCellWrapper width="130px" title={translate('end-of-study-period')}>{translate('end-of-study-period')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 'actions',
    label: '',
    className: 'col-actions',
  },
];

const numberOfYears = (EDUCATIONAL_START_YEAR - EDUCATIONAL_END_YEAR) + 1;

const dateProps = {
  placeholder: translate('date'),
  type: 'date',
  width: '130px',
  showSelectOptions: true,
  withPortal: true,
  displayFormat: 'DD-MM-YYYY',
  minDate: getHundredYearsBackDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
};

const selectProps = {
  width: '130px',
  type: 'selectOne',
  controlType: 'autocomplete',
  placeholder: translate('select'),
  menuPortalTarget: true,
  hideSelectedOptions: false,
};

const educationalYearOptions = () => [...Array(numberOfYears)].map((item, index) => ({
  label: moment([EDUCATIONAL_START_YEAR]).subtract((index), 'year').format('YYYY'),
  value: (index + 1),
}));

/** it will not show the drop down option which is already selected/added  */
export const getRemainingOptions = (values, currentIndex, options) => options.filter((option) => {
  const optionIndex = values.findIndex((value) => value.educationalYear === option.value);
  return optionIndex === currentIndex ? true : (optionIndex < 0);
});

const defaultRowTemplate = {
  educationalYear: '',
  amountPaidBack: null,
  mbo: null,
  hbOWO: null,
  period: {
    startDate: '',
    endDate: '',
  },
};

const StudyGrantRepaidModal = ({
  values, fieldNamePrefix, taxableYear, arrayHelpers,
}) => {
  const getEducationalYearOptions = useMemo(() => (deductionValues, currentIndex) => getRemainingOptions(deductionValues, currentIndex, educationalYearOptions()), []);
  const currentRowTemplate = useMemo(() => ({
    educationalYear: ({ index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.educationalYear`}
        options={getEducationalYearOptions(values, index)}
        className="studygant-educational-year"
        dataTa={`studygant-educational-year${index}`}
      />
    ),
    amountPaidBack: ({ index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountPaidBack`}
        dataTa={`studygant-amount-paid${index}`}
      />
    ),
    mbo: ({ index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.mbo`}
        options={defaultYesOrNoOptions}
        dataTa={`mbo-${index}`}
      />
    ),
    hbOWO: ({ index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.hbOWO`}
        options={defaultYesOrNoOptions}
        dataTa={`hbOWO-${index}`}
      />
    ),
    startDate: ({ index }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.period.startDate`}
        dataTa={`studygant-start-date${index}`}
        className="studygant-start-date"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        isDateReadOnly
        showClearDate
      />
    ),
    endDate: ({ index }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.period.endDate`}
        dataTa={`studygant-end-date${index}`}
        className="studygant-end-date"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        isDateReadOnly
        showClearDate
      />
    ),
    actions: ({ educationalYear, index }) => (
      <ActionsCell
        lastIndex={
        /** no new row will be added after the rows length matches with the numberOfYears */
          educationalYear ? values.length : values.length - 1
        }
        handleDelete={() => {
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  }), [fieldNamePrefix, getEducationalYearOptions, values, taxableYear, arrayHelpers]);

  const studyGrantRef = useRef(null);

  useEffect(() => {
    studyGrantRef.current = {
      initializeDetails: () => {
        if (values && values.length > 0) {
          if (get(values[values.length - 1], 'educationalYear') && values.length !== numberOfYears) {
            arrayHelpers.push({ ...defaultRowTemplate });
          }
        }
      },
    };
  });

  useEffect(() => {
    studyGrantRef.current.initializeDetails();
  }, [values]);

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="study-grant-repaid-modal"
    />
  );
};

StudyGrantRepaidModal.propTypes = {
  /** Provides data to correction modal */
  values: PropTypes.array.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** specifies the taxable year */
  taxableYear: PropTypes.number,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(StudyGrantRepaidModal));

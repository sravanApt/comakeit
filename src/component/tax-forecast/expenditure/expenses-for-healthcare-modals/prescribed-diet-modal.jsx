import React, {
  useMemo, useState, useEffect, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from '../expenditure-translate';
import {
  ActionsCell,
} from '../../../../common/table-cell-templates';
import {
  InputWrapper, DateInputWrapper,
} from '../../../../common/styled-wrapper';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { getDiseaseConditions } from '../expenditure-requests';
import {
  enableDatesTillCurrentYear, getHundredYearsBackDateObjectWithYearAndMonth, getEndDateObjectWithYearAndMonth,
  startDateofYear, endDateofYear,
} from '../../../../common/utils';

/**
 * Modal - Component that can be used to show and edit Prescribed diet details
 *
 */

const CURRENT_COLUMN_GROUP = [
  {
    id: 'condition',
    label: translate('condition-label'),
    className: 'col-annual-reserve white-space-normal',
  },
  {
    id: 'startDate',
    label: translate('start-date'),
    className: 'col-annual-reserve white-space-normal',
  },
  {
    id: 'endDate',
    label: translate('end-date'),
    className: 'col-annual-reserve white-space-normal',
  },
  {
    id: 'actions',
    label: '',
    className: 'col-actions',
  },
];

const dateProps = {
  placeholder: translate('date'),
  type: 'date',
  showSelectOptions: true,
  minDate: getHundredYearsBackDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
};

const defaultRowTemplate = {
  condition: '',
  startDate: null,
  endDate: null,
};

const PrescribedDietModal = ({
  values, fieldNamePrefix, taxableYear, arrayHelpers,
}) => {
  const [conditionOptions, setConditionOptions] = useState([]);
  useEffect(() => {
    const getOptions = async () => {
      const data = conditionOptions.length ? conditionOptions : await getDiseaseConditions();
      setConditionOptions(data);
    };
    getOptions();
  }, [conditionOptions]);

  const updateDateValues = useCallback((conditionValue, rowIndex, startDate, endDate) => {
    let row = {
      ...values[rowIndex],
      condition: conditionValue,
      startDate: null,
      endDate: null,
    };

    if (conditionValue) {
      row = {
        ...values[rowIndex],
        condition: conditionValue,
        startDate: startDate || startDateofYear(taxableYear, 'YYYY-MM-DD'),
        endDate: endDate || endDateofYear(taxableYear, 'YYYY-MM-DD'),
      };
    }

    arrayHelpers.replace(rowIndex, row);
  }, [arrayHelpers, taxableYear, values]);

  const currentRowTemplate = useMemo(() => ({
    condition: ({ index, startDate, endDate }) => (
      <InputWrapper
        width="180px"
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.condition`}
        options={conditionOptions}
        placeholder=""
        className="prescried-diet-condition"
        dataTa={`prescried-diet-condition${index}`}
        menuPortalTarget
        customChangeHandler={(value) => updateDateValues(value, index, startDate, endDate)}
      />
    ),
    startDate: ({ index, condition }) => (
      <DateInputWrapper
        width="130px"
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.startDate`}
        displayFormat="DD-MM-YYYY"
        dataTa={`prescried-diet-start-date${index}`}
        className="prescried-diet-start-date"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        withPortal
        isDateReadOnly
        showClearDate
        disabled={!condition}
      />
    ),
    endDate: ({ index, condition }) => (
      <DateInputWrapper
        width="130px"
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.endDate`}
        displayFormat="DD-MM-YYYY"
        dataTa={`prescried-diet-end-date${index}`}
        className="prescried-diet-end-date"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        withPortal
        isDateReadOnly
        showClearDate
        disabled={!condition}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  }), [fieldNamePrefix, conditionOptions, updateDateValues, taxableYear, values.length, arrayHelpers]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    fieldToCheck: 'condition',
  });

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="prescribed-diet-modal"
    />
  );
};

PrescribedDietModal.propTypes = {
  /** Provides initial data to correction modal */
  values: PropTypes.array.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** specifies the taxable year */
  taxableYear: PropTypes.number,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(PrescribedDietModal));

import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from '../expenditure-translate';
import { ActionsCell, DescriptionCell } from '../../../../common/table-cell-templates';
import {
  InputWrapper, SelectWrapper, TableCellWrapper,
} from '../../../../common/styled-wrapper';
import { defaultYesOrNoOptions } from '../../income/income.constants';
import { enableDatesForSingleYear, getStartDateObjectWithYearAndMonth, getEndDateObjectWithYearAndMonth } from '../../../../common/utils';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

/**
 * Modal - Component that can be used to show and edit clothes and linen expenses Modal
 *
 */

const CURRENT_COLUMN_GROUP = [
  {
    id: 11,
    label: translate('description-label'),
    className: 'col-description',
  },
  {
    id: 12,
    label: () => <TableCellWrapper width="130px" title={translate('start-date')}>{translate('start-date')}</TableCellWrapper>,
    className: 'col-start-date',
  },
  {
    id: 13,
    label: () => <TableCellWrapper width="130px" title={translate('end-date')}>{translate('end-date')}</TableCellWrapper>,
    className: 'col-end-date',
  },
  {
    id: 14,
    label: () => <TableCellWrapper width="130px" title={translate('apply-standard-amount')}>{translate('apply-standard-amount')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 15,
    label: () => <TableCellWrapper width="130px" title={translate('raise-of-standard-amount')}>{translate('raise-of-standard-amount')}</TableCellWrapper>,
    className: 'col-annual-reserve',
  },
  {
    id: 16,
    label: '',
    className: 'col-actions',
  },
];

const dateProps = {
  placeholder: translate('date'),
  type: 'date',
  width: '130px',
  showSelectOptions: true,
  withPortal: true,
  displayFormat: 'DD-MM-YYYY',
  isDateReadOnly: true,
  showClearDate: true,
  minDate: getStartDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
};

const selectProps = {
  width: '130px',
  type: 'selectOne',
  controlType: 'autocomplete',
  options: defaultYesOrNoOptions,
  placeholder: translate('select'),
  menuPortalTarget: true,
  hideSelectedOptions: false,
};

const defaultRowTemplate = {
  description: '',
  isConditionMoreThanOneYear: null,
  isMoreThanStandardForfeit: null,
  period: {
    startDate: null,
    endDate: null,
  },
};

const ExpensesForClothesAndLinenModal = ({
  values, fieldNamePrefix, taxableYear, arrayHelpers,
}) => {
  const currentRowTemplate = {
    description: ({ index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        dataTa={`clothes-and-linen-description-${index}`}
      />
    ),
    startDate: ({ description, index }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.period.startDate`}
        dataTa={`clothes-linen-start-date${index}`}
        className="clothes-linen-start-date"
        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
        disabled={!description}
      />
    ),
    endDate: ({ description, index }) => (
      <InputWrapper
        {...dateProps}
        name={`${fieldNamePrefix}.${index}.period.endDate`}
        dataTa={`clothes-linen-end-date${index}`}
        className="clothes-linen-end-date"
        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
        disabled={!description}
      />
    ),
    isConditionMoreThanOneYear: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.isConditionMoreThanOneYear`}
        dataTa={`is-condition-more-than-one-year-${index}`}
        className="is-condition-more-than-one-year"
        disabled={!description}
      />
    ),
    isMoreThanStandardForfeit: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.isMoreThanStandardForfeit`}
        dataTa={`is-more-than-standard-forfeit-${index}`}
        className="is-more-than-standard-forfeit"
        disabled={!description}
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
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
  });

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="expenses-for-clothes-and-linen-modal"
    />
  );
};

ExpensesForClothesAndLinenModal.propTypes = {
  /** Provides data to correction modal */
  values: PropTypes.array,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** specifies the taxable year */
  taxableYear: PropTypes.number,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(ExpensesForClothesAndLinenModal));

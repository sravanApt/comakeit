import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import { DateInputWrapper, InputWrapper, TableCellWrapper } from '../../../common/styled-wrapper';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import ExpenditureTotalBar from './expenditure-total-bar';
import ExpenditureSectionHeading from '../income/common/income-section-heading';
import {
  isOutsideRange, getHundredYearsBackDateObjectWithYearAndMonth, getDateObjectWithYearAndMonth,
} from '../../../common/utils';
import { CURRENCY_INPUT_WIDTH as NumberInputWidth } from '../../../common/constants';
import { STICKY_CLOUMNS } from '../tax-forecast.constants';

const COLUMN_GROUP = [
  {
    id: 'first-name',
    label: `${translate('first-name')}`,
  },
  {
    id: 'birth-date',
    label: () => <TableCellWrapper width="130px" title={translate('date-of-birth')}>{translate('date-of-birth')}</TableCellWrapper>,
  },
  {
    id: 'days-of-care',
    label: () => <TableCellWrapper width="80px" title={translate('days-of-care')}>{translate('days-of-care')}</TableCellWrapper>,
  },
  {
    id: 'days-traveled',
    label: () => <TableCellWrapper width="80px" title={translate('days-traveled')}>{translate('days-traveled')}</TableCellWrapper>,
  },
  {
    id: 'distance-single-trip',
    label: () => <TableCellWrapper title={translate('distance-single-trip')}>{translate('distance-single-trip')}</TableCellWrapper>,
  },
  {
    id: 'compensation',
    label: () => <TableCellWrapper title={translate('compensation')}>{translate('compensation')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'actions',
    label: translate('actions-label'),
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  name: '',
  dateOfBirth: null,
  daysOfCare: null,
  daysTraveled: null,
  distanceOfTrip: null,
  compensation: 0,
};

/**
  * Tax Forecast - Expenditure Component - Display weekend expenses for children with disabilities
  *
  */

const WeekendExpensesForChildrenWithDisabilities = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, isPartner, callTaxCalculationReport, reportData,
}) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const rowTemplate = {
    name: ({ compensation, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.name`}
        disabled={isPartner}
        customChangeHandler={compensation ? (value) => {
          value && updateStatus();
        } : null
        }
        dataTa={`weekend-expenses-name${index}`}
      />
    ),
    dateOfBirth: ({ name, index }) => (
      <DateInputWrapper
        width="130px"
        className="date-of-birth"
        type="date"
        name={`${fieldNamePrefix}.${index}.dateOfBirth`}
        showSelectOptions
        withPortal
        disabled={isPartner || !name}
        isOutsideRange={isOutsideRange}
        placeholder={translate('date')}
        isDateReadOnly
        showClearDate
        minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
        maxDate={getDateObjectWithYearAndMonth()}
      />
    ),
    daysOfCare: ({ name, index }) => (
      <InputWrapper
        name={`${fieldNamePrefix}.${index}.daysOfCare`}
        controlType="fastField"
        type="number"
        width="80px"
        disabled={isPartner || !name}
        dataTa={`weekend-expenses-care-days${index}`}
        customChangeHandler={updateStatus}
      />
    ),
    daysTraveled: ({ name, index }) => (
      <InputWrapper
        name={`${fieldNamePrefix}.${index}.daysTraveled`}
        controlType="fastField"
        type="number"
        width="80px"
        disabled={isPartner || !name}
        dataTa={`weekend-expenses-travel-days${index}`}
        customChangeHandler={updateStatus}
      />
    ),
    distanceOfTrip: ({ name, index }) => (
      <InputWrapper
        name={`${fieldNamePrefix}.${index}.distanceOfTrip`}
        controlType="fastField"
        type="number"
        width={NumberInputWidth}
        disabled={isPartner || !name}
        dataTa={`weekend-expenses-distance${index}`}
        customChangeHandler={updateStatus}
      />
    ),
    compensation: ({
      name, dateOfBirth, daysOfCare, daysTraveled, distanceOfTrip, index,
    }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.compensation`}
        disabled={isPartner || !(name && dateOfBirth && daysOfCare && daysTraveled && distanceOfTrip)}
        customChangeHandler={name ? updateStatus : null}
        dataTa={`weekend-expenses-amount${index}`}
      />
    ),
    actions: ({ index }) => (
      !isPartner && (
        <ActionsCell
          lastIndex={values.weekendExpensesOfDisabledChildrens.length - 1}
          handleDelete={() => {
            updateStatus();
            arrayHelpers.remove(index);
          }}
          index={index}
        />
      )
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values: values.weekendExpensesOfDisabledChildrens,
    fieldToCheck: 'name',
  });

  const calculationRef = useRef();

  useEffect(() => {
    calculationRef.current = {
      callTaxCalculationReport,
    };
  });

  const updateStatus = () => {
    setIsUpdate(true);
  };

  useEffect(() => {
    const handleInputChange = () => {
      calculationRef.current.callTaxCalculationReport('ExpenditureTotalDeductionForChildrenWithDisabilities', 'totalDeductionForChildrenWithDisabilities');
      setIsUpdate(false);
    };
    isUpdate && handleInputChange();
  }, [isUpdate, values.weekendExpensesOfDisabledChildrens]);

  return (
    <ExpenditureSectionHeading
      heading={translate('weekend-expenses-for-children-with-disabilities')}
      handleRemove={handleRemove}
      dataTa="weekend-expenses-for-children-with-disabilities"
      hideDelete={isPartner}
    >
      <DataTable
        columnGroups={COLUMN_GROUP}
        dataTa="weekend-expenses-for-children"
        rowTemplate={rowTemplate}
        rows={values.weekendExpensesOfDisabledChildrens || []}
        className="income-section__table"
        stickyColumns={STICKY_CLOUMNS}
      />
      <ExpenditureTotalBar
        label={translate('total-deduction-for-children-with-disabilities')}
        amount={reportData.totalDeductionForChildrenWithDisabilities}
      />
    </ExpenditureSectionHeading>
  );
};

WeekendExpensesForChildrenWithDisabilities.propTypes = {
  /** contains array of waived venture capital section */
  values: PropTypes.object,
  /** name of the fields in array */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to handle the report tax calculation */
  callTaxCalculationReport: PropTypes.func,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name: `${name}.weekendExpensesOfDisabledChildrens`, ...restProps })(WeekendExpensesForChildrenWithDisabilities));

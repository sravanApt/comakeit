import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  getTotalValue, enableDatesTillCurrentYear, getHundredYearsBackDateObjectWithYearAndMonth,
  getEndDateObjectWithYearAndMonth, startDateofYear, endDateofYear,
} from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell, NumberCell,
} from '../../../common/table-cell-templates';
import PublicTransportDeductionsTable from '../income/common/income-common-table';
import { DateInputWrapper, TableCellWrapper } from '../../../common/styled-wrapper';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import ExpenditureTotalBar from './expenditure-total-bar';
import { CURRENCY_INPUT_WIDTH as DateInputWidth } from '../../../common/constants';
import { STICKY_CLOUMNS } from '../tax-forecast.constants';

const defaultRowTemplate = {
  description: '',
  singleTripDistance: null,
  daysInAWeek: null,
  startDate: null,
  endDate: null,
  compensation: 0,
};

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: `${translate('description-label')}`,
    className: 'mirage-label',
  },
  {
    id: 'distance-trip',
    label: () => <TableCellWrapper title={translate('distance-single-trip')}>{translate('distance-single-trip')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'week-days',
    label: () => <TableCellWrapper title={translate('days-a-week')}>{translate('days-a-week')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'start-date',
    label: () => <TableCellWrapper title={translate('start-date')}>{translate('start-date')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'end-date',
    label: () => <TableCellWrapper title={translate('end-date')}>{translate('end-date')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'compensation',
    label: () => <TableCellWrapper title={translate('compensation-label')}>{translate('compensation-label')}</TableCellWrapper>,
    className: 'mirage-label text-align-right',
  },
  {
    id: 'actions',
    label: `${translate('actions-label')}`,
    className: 'col-actions',
  },
];

/**
  * Tax Forecast - Expenditure Component - Deductions for public transport section
  *
  */

const PublicTransportDeductions = ({
  values: { travelDeliveryDetails },
  reportData: { totalDeductionForExpenses },
  fieldNamePrefix, handleRemove, arrayHelpers, callTaxCalculationReport, taxableYear,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  const updateDateValues = (descriptionValue, rowIndex, startDate, endDate) => {
    let row = {
      ...travelDeliveryDetails[rowIndex],
      description: descriptionValue,
      startDate: null,
      endDate: null,
    };

    if (descriptionValue) {
      row = {
        ...travelDeliveryDetails[rowIndex],
        description: descriptionValue,
        startDate: startDate || startDateofYear(taxableYear, 'YYYY-MM-DD'),
        endDate: endDate || endDateofYear(taxableYear, 'YYYY-MM-DD'),
      };
    }

    arrayHelpers.replace(rowIndex, row);
  };
  const currentRowTemplate = {
    description: ({
      compensation, index, startDate, endDate,
    }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={compensation ? (value) => {
          value && updateStatus();
        } : (value) => updateDateValues(value, index, startDate, endDate)
        }
        dataTa={`transport-description${index}`}
      />
    ),
    distanceTrip: ({ description, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.singleTripDistance`}
        dataTa={`transport-deduction-distance${index}`}
        disabled={!description}
        customChangeHandler={updateStatus}
      />
    ),
    numberOfWeekDays: ({ description, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.daysInAWeek`}
        dataTa={`transport-deduction-days-count${index}`}
        disabled={!description}
        customChangeHandler={updateStatus}
      />
    ),
    startDate: ({ description, index }) => (
      <DateInputWrapper
        width={DateInputWidth}
        dataTa={`transport-deduction-start-date${index}`}
        className="transport-deduction-start-date"
        type="date"
        name={`${fieldNamePrefix}.${index}.startDate`}
        showSelectOptions
        withPortal
        displayFormat="DD-MM"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        placeholder={translate('date')}
        isDateReadOnly
        showClearDate
        disabled={!description}
        customChangeHandler={updateStatus}
        minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
        maxDate={getEndDateObjectWithYearAndMonth()}
      />
    ),
    endDate: ({ description, index }) => (
      <DateInputWrapper
        width={DateInputWidth}
        dataTa={`transport-deduction-end-date${index}`}
        className="transport-deduction-end-date"
        type="date"
        name={`${fieldNamePrefix}.${index}.endDate`}
        showSelectOptions
        withPortal
        displayFormat="DD-MM"
        isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
        placeholder={translate('date')}
        isDateReadOnly
        showClearDate
        disabled={!description}
        customChangeHandler={updateStatus}
        minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
        maxDate={getEndDateObjectWithYearAndMonth()}
      />
    ),
    compensation: ({
      description, singleTripDistance, daysInAWeek, startDate, endDate, index,
    }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.compensation`}
        dataTa={`transport-deduction-compensation${index}`}
        customChangeHandler={updateStatus}
        disabled={!(description && singleTripDistance && daysInAWeek && startDate && endDate)}
      />
    ),
    currentEmploymentActions: ({ index }) => (
      <ActionsCell
        lastIndex={travelDeliveryDetails.length - 1}
        handleDelete={() => {
          updateStatus();
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  };

  const updateStatus = () => {
    setIsUpdate(true);
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values: travelDeliveryDetails,
    loadFooterData: () => {
      if (travelDeliveryDetails && travelDeliveryDetails.length) {
        const totalCompensation = getTotalValue(travelDeliveryDetails, 'compensation');
        if (totalCompensation) {
          setFooterData({
            compensation: totalCompensation,
          });
        } else {
          setFooterData(null);
        }
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    singleTripDistance: null,
    daysInAWeek: null,
    startDate: null,
    endDate: null,
    compensation: (<FooterCell value={footerData.compensation} />),
  } : null),
  [footerData]);

  const calculationRef = useRef();

  useEffect(() => {
    calculationRef.current = {
      callTaxCalculationReport,
    };
  });

  useEffect(() => {
    const handleInputChange = () => {
      calculationRef.current.callTaxCalculationReport('ExpenditureTotalDeductionForPublicTransportation', 'totalDeductionForExpenses');
      setIsUpdate(false);
    };
    isUpdate && handleInputChange();
  }, [travelDeliveryDetails, isUpdate]);

  return (
    <PublicTransportDeductionsTable
      heading={translate('public-transportation-expenses')}
      values={travelDeliveryDetails}
      columnGroup={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="public-transportation-expenses"
      hasFooter={!!footerData}
      footerData={footerValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
      className="income-section__table"
      stickyColumns={STICKY_CLOUMNS}
    >
      <ExpenditureTotalBar
        label={translate('total-transportation-deductions')}
        amount={totalDeductionForExpenses}
      />
    </PublicTransportDeductionsTable>
  );
};

PublicTransportDeductions.propTypes = {
  /** contains array of transport-deduction fields with description, trip distance, compensations, startdate and enddate */
  values: PropTypes.shape({
    travelDeliveryDetails: PropTypes.arrayOf(
      PropTypes.shape({
        description: PropTypes.string,
        singleTripDistance: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        daysInAWeek: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]),
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        compensation: PropTypes.number,
      }),
    ),
    totalDeductionForExpenses: PropTypes.number,
  }),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to handle the report tax calculation */
  callTaxCalculationReport: PropTypes.func,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name: `${name}.travelDeliveryDetails`, ...restProps })(PublicTransportDeductions));

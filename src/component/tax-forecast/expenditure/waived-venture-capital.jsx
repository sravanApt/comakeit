import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import { TableCellWrapper } from '../../../common/styled-wrapper';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import ExpenditureTotalBar from './expenditure-total-bar';
import ExpenditureSectionHeading from '../income/common/income-section-heading';

const COLUMN_GROUP = [
  {
    id: 'description',
    label: `${translate('description-label')}`,
  },
  {
    id: 'already-waived',
    label: () => <TableCellWrapper title={translate('already-waived')}>{translate('already-waived')}</TableCellWrapper>,
    className: 'text-align-right white-space-normal',
  },
  {
    id: 'amount-waived-this-year',
    label: () => <TableCellWrapper title={translate('amount-waived-this-year')}>{translate('amount-waived-this-year')}</TableCellWrapper>,
    className: 'text-align-right white-space-normal',
  },
  {
    id: 'actions',
    label: translate('actions-label'),
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '', alreadyWavedAmount: 0, amountWaivedThisYear: 0,
};

/**
  * Tax Forecast - Expenditure Component - Display waived venture capital
  *
  */

const WaivedVentureCapital = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, isPartner, updateTaxCalculation, callTaxCalculationReport,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const calculationRef = useRef();

  useEffect(() => {
    calculationRef.current = {
      updateTaxCalculation,
      callTaxCalculationReport,
    };
  });

  useEffect(() => {
    const changeHandler = () => {
      setAmountUpdateIndicator(0);
      calculationRef.current.updateTaxCalculation();
      calculationRef.current.callTaxCalculationReport('ExpenditureTotalDeductionForWaivedVentureCapital', 'totalDeductionForWaivedVentureCapital');
    };
    !!amountUpdateIndicator && changeHandler();
  }, [amountUpdateIndicator]);

  const rowTemplate = {
    description: ({ alreadyWavedAmount, amountWaivedThisYear, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={isPartner}
        customChangeHandler={(alreadyWavedAmount || amountWaivedThisYear) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
        dataTa={`waived-venture-description${index}`}
      />
    ),
    alreadyWaivedAmount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.alreadyWavedAmount`}
        disabled={isPartner || !description}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        dataTa={`already-waived-amount${index}`}
      />
    ),
    amountWaivedThisYear: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountWaivedThisYear`}
        disabled={isPartner || !description}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        dataTa={`amount-waived-this-year${index}`}
      />
    ),
    actions: ({ index }) => (
      !isPartner && (
        <ActionsCell
          lastIndex={values.waivedVentureCapitalDetails.length - 1}
          handleDelete={() => {
            setAmountUpdateIndicator(amountUpdateIndicator + 1);
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
    values: values.waivedVentureCapitalDetails,
    fieldToCheck: 'description',
  });

  return (
    <ExpenditureSectionHeading
      heading={translate('waived-venture-capital')}
      handleRemove={handleRemove}
      dataTa="waived-venture-capital"
      hideDelete={isPartner}
    >
      <DataTable
        columnGroups={COLUMN_GROUP}
        rowTemplate={rowTemplate}
        rows={values.waivedVentureCapitalDetails || []}
        className="income-section__table"
      />
      <ExpenditureTotalBar
        label={translate('total-deduction-for-waived-venture-capital')}
        amount={values.totalDeductionForWaivedVentureCapital}
      />
    </ExpenditureSectionHeading>
  );
};

WaivedVentureCapital.propTypes = {
  /** contains array of waived venture capital section */
  values: PropTypes.object,
  /** name of the fields in array */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** function that handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to handle the report tax calculation */
  callTaxCalculationReport: PropTypes.func,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name: `${name}.waivedVentureCapitalDetails`, ...restProps })(WaivedVentureCapital));

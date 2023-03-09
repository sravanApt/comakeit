import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  ActionsCell, DescriptionCell, CurrencyCell, NumberCell,
} from '../../../common/table-cell-templates';
import { SelectWrapper, TableCellWrapper } from '../../../common/styled-wrapper';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { defaultYesOrNoOptions } from '../income/income.constants';

const COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
  },
  {
    id: 'cultural-anbi-periodic',
    label: translate('cultural-anbi'),
  },
  {
    id: 'transaction-number',
    label: () => <TableCellWrapper title={translate('transaction-number')}>{translate('transaction-number')}</TableCellWrapper>,
  },
  {
    id: 'rsin',
    label: translate('rsin-label'),
  },
  {
    id: 'amount',
    label: translate('amount-label'),
    className: 'text-align-right',
  },
  {
    id: 'actions',
    label: translate('actions-label'),
    className: 'col-actions',
  },
];

const defaultTemplate = {
  transactionNumber: null,
  rsin: null,
  culturalANBI: null,
  description: '',
  amount: 0,
};

/**
  * Tax Forecast - Expenditure Component - Display periodic gifts to charity section
  *
  */

const PeriodicGiftsToCharity = ({
  values, fieldNamePrefix, arrayHelpers, isPartner, callTaxCalculationReport,
}) => {
  const calculationRef = useRef();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    calculationRef.current = {
      callTaxCalculationReport,
    };
  });

  const updateStatus = () => {
    setIsUpdate(true);
  };

  useEffect(() => {
    calculationRef.current = {
      callTaxCalculationReport,
    };
  });

  useEffect(() => {
    const handleInputChange = () => {
      calculationRef.current.callTaxCalculationReport('ExpenditureTotalDeductionForGiftsToCharity', 'totalDeductionForGiftsToCharity');
      setIsUpdate(false);
    };
    isUpdate && handleInputChange();
  }, [isUpdate, values]);

  const rowTemplate = {
    description: ({ amount, index, culturalANBI }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={isPartner}
        customChangeHandler={amount ? (value) => {
          value && updateStatus();
        } : (value) => updateCulturalANBI(value, index, culturalANBI)
        }
        dataTa={`periodic-description${index}`}
      />
    ),
    culturalANBI: ({ description, index }) => (
      <SelectWrapper
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.culturalANBI`}
        options={defaultYesOrNoOptions}
        dataTa={`cultural-anbi-select${index}`}
        menuPortalTarget
        placeholder="-"
        disabled={isPartner || !description}
      />
    ),
    transcationNumber: ({ description, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.transactionNumber`}
        dataTa={`transaction-number${index}`}
        disabled={isPartner || !description}
      />
    ),
    rsin: ({ description, index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.rsin`}
        dataTa={`periodic-gifts-rsin${index}`}
        disabled={isPartner || !description}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        dataTa={`periodic-gifts-amount${index}`}
        disabled={isPartner || !description}
        customChangeHandler={description ? updateStatus : null}
      />
    ),
    actions: ({ index }) => (
      !isPartner && (
        <ActionsCell
          lastIndex={values.length - 1}
          handleDelete={() => {
            updateStatus();
            arrayHelpers.remove(index);
          }}
          index={index}
        />
      )
    ),
  };
  const updateCulturalANBI = (descriptionValue, rowIndex, culturalANBI) => {
    let row = {
      ...values[rowIndex],
      description: descriptionValue,
      culturalANBI: null,
    };

    if (descriptionValue) {
      row = {
        ...values[rowIndex],
        description: descriptionValue,
        culturalANBI: culturalANBI || false,
      };
    }

    arrayHelpers.replace(rowIndex, row);
  };
  useRowTemplate({
    arrayHelpers,
    rowTemplate: { ...defaultTemplate },
    values,
  });

  return (
    <div className="income-section__table">
      <DataTable
        className="periodic-gifts-to-charity"
        dataTa="periodic-gifts-to-charity"
        columnGroups={COLUMN_GROUP}
        rowTemplate={rowTemplate}
        rows={values || []}
      />
    </div>
  );
};

PeriodicGiftsToCharity.propTypes = {
  /** contains array of periodic gift to charity section */
  values: PropTypes.array,
  /** name of the fields in array */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to handle the report tax calculation */
  callTaxCalculationReport: PropTypes.func,
};

export default PeriodicGiftsToCharity;

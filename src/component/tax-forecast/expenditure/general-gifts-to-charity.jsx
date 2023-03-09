import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import { SelectWrapper } from '../../../common/styled-wrapper';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { defaultYesOrNoOptions } from '../income/income.constants';

const COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
  },
  {
    id: 'cultural-anbi',
    label: translate('cultural-anbi'),
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
  description: '', culturalANBI: 0, amount: 0,
};

/**
  * Tax Forecast - Expenditure Component - Display general gifts to charity section
  *
  */

const GeneralGiftsToCharity = ({
  values, fieldNamePrefix, arrayHelpers, isPartner, callTaxCalculationReport,
}) => {
  const [isUpdate, setIsUpdate] = useState(false);
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
  const rowTemplate = {
    description: ({ amount, index, culturalANBI }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={amount ? (value) => {
          value && updateStatus();
        } : (value) => updateCulturalANBI(value, index, culturalANBI)
        }
        disabled={isPartner}
        dataTa={`general-gift-description${index}`}
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
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        dataTa={`general-gifts-amount${index}`}
        disabled={isPartner || !description}
        customChangeHandler={description ? updateStatus : null}
      />
    ),
    actions: ({ index }) => (
      !isPartner
      && (
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

  useRowTemplate({
    arrayHelpers,
    rowTemplate: { ...defaultTemplate },
    values,
  });

  const updateStatus = () => {
    setIsUpdate(true);
  };

  const calculationRef = useRef();

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

  return (
    <div className="income-section__table">
      <DataTable
        className="general-gifts-to-charity"
        dataTa="general-gifts-to-charity"
        columnGroups={COLUMN_GROUP}
        rowTemplate={rowTemplate}
        rows={values || []}
      />
    </div>
  );
};

GeneralGiftsToCharity.propTypes = {
  /** contains array of general gift to charity section */
  values: PropTypes.array,
  /** name of the fields in array */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to handle the report tax calculation */
  callTaxCalculationReport: PropTypes.func,
};

export default GeneralGiftsToCharity;

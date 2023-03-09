import React, {
  useContext, useRef, useEffect, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { assetsTranslate as translate } from './assets-translate';
import TaxForecastContext from '../tax-forecast-context';
import { SelectWrapper } from '../../../common/styled-wrapper';
import IncomeSectionHeading from '../income/common/income-section-heading';
import { SELECT_PROPS } from './assets.constants';
import { getOwners, getDefaultOwner } from '../income-from-business/common/utils';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
    className: 'col-description',
  },
  {
    id: 'belongs',
    label: translate('belongs-to'),
    className: 'col-belongs',
  },
  {
    id: 'value',
    label: translate('value'),
    className: 'col-amount text-align-right',
  },
  {
    id: 'actions',
    label: translate('actions'),
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '',
  belongsTo: null,
  amount: '',
};

const selectProps = {
  ...SELECT_PROPS,
  menuPortalTarget: true,
};

/**
 *
 * Data table to display assets common landing sub section information
 */
const CommonAutoIncrementTable = ({
  values, fieldNamePrefix, sectionKey, arrayHelpers, handleRemove, updateTaxCalculation,
}) => {
  const {
    dossierData: { masterData: { owners } },
  } = useContext(TaxForecastContext);

  const calculationRef = useRef();
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  useEffect(() => {
    calculationRef.current = {
      updateTaxCalculation,
    };
  });

  const ownerOptions = useMemo(() => getOwners(owners), [owners]);
  const updateBelongsToValue = (descriptionValue, rowIndex, belongsToValue) => {
    let updateRow = {
      ...values[rowIndex],
      description: descriptionValue,
      belongsTo: null,
    };

    if (descriptionValue) {
      updateRow = {
        ...values[rowIndex],
        description: descriptionValue,
        belongsTo: belongsToValue || getDefaultOwner(ownerOptions),
      };
    }

    arrayHelpers.replace(rowIndex, updateRow);
  };

  const currentRowTemplate = {
    description: ({ amount, belongsTo, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={amount ? () => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : (value) => updateBelongsToValue(value, index, belongsTo)}
        dataTa={`${sectionKey}-description-${index}`}
      />
    ),
    belongsTo: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.belongsTo`}
        options={ownerOptions}
        className="belongs-to-select"
        disabled={!description}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        disabled={!description}
        customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
        dataTa={`${sectionKey}-amount-${index}`}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
        dataTa={`${sectionKey}-row-${index}`}
      />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculationRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  return (
    <IncomeSectionHeading
      heading={translate(sectionKey)}
      handleRemove={handleRemove}
      dataTa={`${sectionKey}-section`}
    >
      <div className="assets-section__table margin-zero">
        <DataTable
          rows={values}
          columnGroups={CURRENT_COLUMN_GROUP}
          rowTemplate={currentRowTemplate}
          className={`${sectionKey}-table`}
          dataTa={`${sectionKey}-table`}
        />
      </div>
    </IncomeSectionHeading>
  );
};

CommonAutoIncrementTable.propTypes = {
  /** array of objects which contains section data */
  values: PropTypes.array.isRequired,
  /** field name prefix for the form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** provides unique key for section */
  sectionKey: PropTypes.string.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CommonAutoIncrementTable));

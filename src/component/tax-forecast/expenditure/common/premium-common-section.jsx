import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import {
  DescriptionCell,
  CurrencyCell,
  ActionsCell,
} from '../../../../common/table-cell-templates';
import { getTotalValue } from '../../../../common/utils';
import { expenditureTranslate as translate } from '../expenditure-translate';
import IncomeCommonTable from '../../income/common/income-common-table';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import ExpenditureTotalBar from '../expenditure-total-bar';
import { CURRENCY_INPUT_WIDTH } from '../../../../common/constants';

/*
 * Tax Forecast - Common Component to render Premium For Disability Insurance, Premium for general survivors law, Premium for annuity of child sections in Expenditure
 *
 */
const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: `${translate('description-label')}`,
    className: 'mirage-label',
  },
  {
    id: 'policy-number',
    label: `${translate('policy-number-label')}`,
    className: 'mirage-label',
  },
  {
    id: 'amount',
    label: `${translate('amount-label')}`,
    className: 'mirage-label text-align-right',
  },
  {
    id: 'actions',
    label: `${translate('actions-label')}`,
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  policyNumber: '',
  description: '',
  amount: 0,
};

const CommonSection = ({
  heading,
  tableDataTa,
  footerDataTa,
  footerLabel,
  values,
  fieldNamePrefix,
  handleRemove,
  arrayHelpers,
  updateTaxCalculation,
}) => {
  const [footerValue, setFooterValue] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalAmount = getTotalValue(values, 'amount');
        if (totalAmount) {
          setFooterValue(totalAmount);
        } else {
          setFooterValue(null);
        }
      }
    },
    fieldToCheck: 'description',
  });

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const rowTemplate = {
    description: ({ amount, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={amount ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
        dataTa={`premium-description${index}`}
      />
    ),
    policyNumber: ({ description, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}[${index}].policyNumber`}
        width={CURRENCY_INPUT_WIDTH}
        disabled={!description}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        dataTa={`premium-section-amount${index}`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!description}
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
      />
    ),
  };

  return (
    <IncomeCommonTable
      heading={heading}
      values={values}
      columnGroup={CURRENT_COLUMN_GROUP}
      rowTemplate={rowTemplate}
      dataTa={tableDataTa}
      handleRemove={handleRemove}
      className="income-section__table"
    >
      {footerValue && <ExpenditureTotalBar label={footerLabel} amount={footerValue} dataTa={footerDataTa} />}
    </IncomeCommonTable>
  );
};

CommonSection.propTypes = {
  /** Provides heading for the section */
  heading: PropTypes.string.isRequired,
  /** Provides test attribute for the DataTable */
  tableDataTa: PropTypes.string,
  /** Provides test attribute for the footer data */
  footerDataTa: PropTypes.string,
  /** Provides footer text */
  footerText: PropTypes.string,
  /** Provides array of row data */
  values: PropTypes.array,
  /** Provides path to the Array of Objects / row data  */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** Provides func to handle remove click */
  handleRemove: PropTypes.func.isRequired,
  /** Helper function from FieldArray Component */
  arrayHelpers: PropTypes.object.isRequired,
};

/** Exported Enhaced Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CommonSection);

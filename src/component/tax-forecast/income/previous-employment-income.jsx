import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { getTotalValue } from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../common/table-cell-templates';
import { tableHeaderCells } from './income.constants';
import PreviousEmploymentIncomeTable from './common/income-common-table';
import { incomeTranslate as translate } from './income-translate';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

const PREVIOUS_COLUMN_GROUP = [
  tableHeaderCells.description,
  tableHeaderCells.wagesTax,
  tableHeaderCells.amount,
  tableHeaderCells.actions,
];

const defaultRowTemplate = { salary: { description: '', amount: 0 }, withHeldWageTax: 0 };

/**
  * Tax Forecast - Income Component - Display Previous Employment Income section
  *
  */

const PreviousEmploymentIncome = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, updateTaxCalculation,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const previousRowTemplate = {
    description: ({ salary, withHeldWageTax, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.salary.description`}
        customChangeHandler={(salary?.amount || withHeldWageTax) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    previousEmploymentWageTax: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.withHeldWageTax`}
        className="previous-employment-wagetax"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    previousEmploymentAmount: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.salary.amount`}
        className="previous-employment-amount"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    previousEmploymentActions: ({ index }) => (
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

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalWageTax = getTotalValue(values, 'withHeldWageTax');
        const totalAmount = getTotalValue(values, 'salary.amount');
        if (totalAmount || totalWageTax) {
          setFooterData({
            withHeldWageTax: totalWageTax,
            amount: totalAmount,
          });
        } else {
          setFooterData(null);
        }
      }
    },
    fieldToCheck: 'salary.description',
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

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    withHeldWageTax: (<FooterCell value={footerData.withHeldWageTax} />),
    amount: (<FooterCell value={footerData.amount} />),
  } : null),
  [footerData]);

  return (
    <PreviousEmploymentIncomeTable
      heading={translate('previous-employment-income')}
      values={values}
      columnGroup={PREVIOUS_COLUMN_GROUP}
      rowTemplate={previousRowTemplate}
      dataTa="previous-employment"
      hasFooter={!!footerData}
      footerData={footerValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
    />
  );
};

PreviousEmploymentIncome.propTypes = {
  /** contains array of previous-income fields with description, wages and employment discount */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      withHeldWageTax: PropTypes.number,
      employmentDiscount: PropTypes.number,
      salary: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
      }),
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported Enhanced Component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(PreviousEmploymentIncome));

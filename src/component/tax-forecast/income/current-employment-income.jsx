import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { incomeTranslate as translate } from './income-translate';
import { getTotalValue } from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../common/table-cell-templates';
import { tableHeaderCells } from './income.constants';
import CurrentEmploymentIncomeTable from './common/income-common-table';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

const CURRENT_COLUMN_GROUP = [
  tableHeaderCells.description,
  tableHeaderCells.employmentDiscount,
  tableHeaderCells.wagesTax,
  tableHeaderCells.amount,
  tableHeaderCells.actions,
];

const defaultRowTemplate = { salary: { description: '', amount: 0 }, withHeldWageTax: 0, employmentDiscount: 0 };

/**
  * Tax Forecast - Income Component - Current Employment Income section
  *
  */

const CurrentEmploymentIncome = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, updateTaxCalculation,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const currentRowTemplate = useMemo(() => ({
    description: ({
      salary, employmentDiscount, withHeldWageTax, index,
    }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.salary.description`}
        customChangeHandler={(salary?.amount || withHeldWageTax || employmentDiscount) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
        className="current-employment-description"
      />
    ),
    discount: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.employmentDiscount`}
        className="current-employment-discount"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    currentEmploymentWageTax: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.withHeldWageTax`}
        className="current-employment-wagetax"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    currentEmploymentAmount: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.salary.amount`}
        className="current-employment-amount"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    currentEmploymentActions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  }), [amountUpdateIndicator, arrayHelpers, fieldNamePrefix, values]);

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalDiscount = getTotalValue(values, 'employmentDiscount');
        const totalWageTax = getTotalValue(values, 'withHeldWageTax');
        const totalAmount = getTotalValue(values, 'salary.amount');
        if (totalAmount || totalWageTax || totalDiscount) {
          setFooterData({
            employmentDiscount: totalDiscount,
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

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    employmentDiscount: (<FooterCell value={footerData.employmentDiscount} />),
    withHeldWageTax: (<FooterCell value={footerData.withHeldWageTax} />),
    amount: (<FooterCell value={footerData.amount} />),
  } : null),
  [footerData]);

  return (
    <CurrentEmploymentIncomeTable
      heading={translate('current-employment-income')}
      values={values}
      columnGroup={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="current-employment"
      hasFooter={!!footerData}
      footerData={footerValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
    />
  );
};

CurrentEmploymentIncome.propTypes = {
  /** contains array of current-income fields with description, salary, discount, wages etc... */
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

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(CurrentEmploymentIncome));

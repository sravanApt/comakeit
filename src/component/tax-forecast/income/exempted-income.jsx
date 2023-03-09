import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { incomeTranslate as translate } from './income-translate';
import { TableCellWrapper, SelectWrapper } from '../../../common/styled-wrapper';
import { getTotalValue } from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../common/table-cell-templates';
import { defaultYesOrNoOptions, tableHeaderCells } from './income.constants';
import ExemptedIncomeTable from './common/income-common-table';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

const EXCEMPT_COLUMN_GROUP = [
  tableHeaderCells.description,
  tableHeaderCells.amount,
  {
    id: 3,
    label: () => <TableCellWrapper width="92px" title={translate('current-employment')}>{translate('current-employment')}</TableCellWrapper>,
    className: 'col-employment col-select',
  },
  {
    id: 4,
    label: () => <TableCellWrapper title={translate('part-of-national-insurance-contribution')}>{translate('part-of-national-insurance-contribution')}</TableCellWrapper>,
    className: 'col-insurance col-input',
  },
  {
    id: 5,
    label: () => <TableCellWrapper title={translate('payment-zvw-yet-to-be-done')}>{translate('payment-zvw-yet-to-be-done')}</TableCellWrapper>,
    className: 'col-payment col-select',
  },
  tableHeaderCells.actions,
];

const defaultRowTemplate = {
  salary: { description: '', amount: 0 },
  isCurrentEmpoyment: null,
  nationalInsuranceContribution: 0,
  isPaymentZVWYetToBeDone: null,
};

/**
  * Tax Forecast - Income Component - Display Exempted Employment Income section
  *
  */

const ExemptedIncome = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, updateTaxCalculation,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const excemptRowTemplate = {
    description: ({ salary, nationalInsuranceContribution, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.salary.description`}
        customChangeHandler={(salary?.amount || nationalInsuranceContribution) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    amount: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.salary.amount`}
        className="exempted-income-amount"
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!salary?.description}
      />
    ),
    employment: ({ salary, index }) => (
      <SelectWrapper
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.isCurrentEmpoyment`}
        options={defaultYesOrNoOptions}
        className="countryCode-select"
        menuPortalTarget
        placeholder="-"
        disabled={!salary?.description}
      />
    ),
    insurance: ({ salary, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.nationalInsuranceContribution`}
        className="exempted-income-insurance"
        disabled={!salary?.description}
        customChangeHandler={salary?.description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
      />
    ),
    paymentYetDone: ({ salary, index }) => (
      <SelectWrapper
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.isPaymentZVWYetToBeDone`}
        options={defaultYesOrNoOptions}
        className="paymentYetDone-select"
        placeholder="-"
        menuPortalTarget
        disabled={!salary?.description}
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

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    loadFooterData: () => {
      if (values && values.length) {
        const totalInsurance = getTotalValue(values, 'nationalInsuranceContribution');
        const totalAmount = getTotalValue(values, 'salary.amount');
        if (totalAmount || totalInsurance) {
          setFooterData({
            amount: totalAmount,
            insurance: totalInsurance,
          });
        } else {
          setFooterData(null);
        }
      }
    },
    fieldToCheck: 'salary.description',
  });

  useEffect(() => {
    amountUpdateIndicator > 0 && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const exemptedIncomeFooterValues = useMemo(() => (footerData ? {
    description: '',
    amount: (<FooterCell value={footerData.amount} />),
    employment: '',
    insurance: (<FooterCell value={footerData.insurance} />),
    paymentYetDone: '',
  } : null),
  [footerData]);

  return (
    <ExemptedIncomeTable
      heading={translate('exempted-income-from-international-organization')}
      values={values}
      columnGroup={EXCEMPT_COLUMN_GROUP}
      rowTemplate={excemptRowTemplate}
      dataTa="exempted-income"
      hasFooter={!!footerData}
      footerData={exemptedIncomeFooterValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
    />
  );
};

ExemptedIncome.propTypes = {
  /** contains array of exempted-income fields with description, wages, insurance contribution etc... */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      salary: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
      }),
      isCurrentEmpoyment: PropTypes.bool,
      nationalInsuranceContribution: PropTypes.number,
      isPaymentZVWYetToBeDone: PropTypes.bool,
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported Enhanced Income Component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(ExemptedIncome));

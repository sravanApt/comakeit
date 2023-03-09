import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  FooterCell, ActionsCell, DescriptionCell, CurrencyCell, NumberCell,
} from '../../../../common/table-cell-templates';
import { DateInputWrapper } from '../../../../common/styled-wrapper';
import {
  getTotalValue, isOutsideRange, getHundredYearsBackDateObjectWithYearAndMonth, getDateObjectWithYearAndMonth,
} from '../../../../common/utils';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { DIVESTMENT_ADDITION_COLUMN_GROUP, ROW_TEMPLATES } from './other-items.constants';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

/**
 * Display/Edit Non or partly Deductable costs / tax-exempt components
 *
 */

const DivestmentAddition = ({
  values, fieldNamePrefix, arrayHelpers,
}) => {
  const [footerData, setFooterData] = useState(null);

  const rowTemplate = {
    description: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={!!rubricId}
      />
    ),
    commissioningDate: ({ index }) => (
      <DateInputWrapper
        type="date"
        width="130px"
        name={`${fieldNamePrefix}.${index}.commissioningDate`}
        className="input-date"
        showSelectOptions
        isOutsideRange={isOutsideRange}
        withPortal
        placeholder={translate('date')}
        isDateReadOnly
        showClearDate
        minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
        maxDate={getDateObjectWithYearAndMonth()}
      />
    ),
    base: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.base`}
        disabled={!description}
      />
    ),
    percentageKIA: ({ index }) => (
      <NumberCell
        name={`${fieldNamePrefix}.${index}.percentageKIA`}
        prefix="%"
      />
    ),
    actions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`divestment-addition-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: ROW_TEMPLATES.divestmentAddition,
    values,
    loadFooterData: () => {
      const totalBase = getTotalValue(values, 'base');
      if (totalBase) {
        setFooterData({
          ...ROW_TEMPLATES.divestmentAddition,
          totalBase,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    commissioningDate: '',
    base: (<FooterCell value={footerData.totalBase} />),
    percentageKIA: null,
  } : null),
  [footerData]);

  return (
    <DataTable
      className="correction-table"
      columnGroups={DIVESTMENT_ADDITION_COLUMN_GROUP}
      rowTemplate={rowTemplate}
      rows={values}
      footerValues={footerValues}
      hasFooter={!!footerData}
      dataTa="correction-table"
    />
  );
};

DivestmentAddition.propTypes = {
  /** values to render with in modal */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      commissioningDate: PropTypes.string,
      base: PropTypes.number,
      percentageKIA: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ).isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(DivestmentAddition);

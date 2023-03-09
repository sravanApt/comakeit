import React, {
  useState, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { getTotalValue } from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../common/table-cell-templates';
import OtherAmountsTable from '../income/common/income-common-table';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { TableCellWrapper, SelectWrapper } from '../../../common/styled-wrapper';
import { selectProps } from './liabilities.constants';
import { DEFAULT_COUNTRY_ID } from '../assets/assets.constants';
import { getDefaultOwner } from '../income-from-business/common/utils';
import { STICKY_CLOUMNS } from '../tax-forecast.constants';

const COLUMN_GROUP = [
  {
    id: 'other-loans-description',
    label: `${translate('description-label')}`,
    className: 'mirage-label',
  },
  {
    id: 'other-loans-belongs-to',
    label: () => <TableCellWrapper width="140px" title={translate('belongs-to')}>{translate('belongs-to')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'other-loans-account-number',
    label: () => <TableCellWrapper width="160px" title={translate('account-number')}>{translate('account-number')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'other-loans-countries',
    label: () => <TableCellWrapper width="160px" title={translate('country')}>{translate('country')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 'other-loans-principal-amount',
    label: () => <TableCellWrapper title={translate('amount-label')}>{translate('amount-label')}</TableCellWrapper>,
    className: 'mirage-label text-align-right',
  },
  {
    id: 'actions',
    label: `${translate('actions')}`,
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '',
  belongsTo: null,
  accountNumber: '',
  countryId: null,
  principalAmount: null,
};

/**
  * Tax Forecast - Other Amount Component - Display Other amount liability section section
  *
  */

const OtherAmounts = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, updateTaxCalculation, owners, countries,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const updateCountryOrBelongsToValues = (countryId, descriptionValue, rowIndex, belongsToValue) => {
    let updateRow = {
      ...values[rowIndex],
      countryId: null,
      description: descriptionValue,
      belongsTo: null,
    };

    if (descriptionValue) {
      updateRow = {
        ...values[rowIndex],
        countryId: !countryId ? DEFAULT_COUNTRY_ID : countryId,
        description: descriptionValue,
        belongsTo: !belongsToValue ? getDefaultOwner(owners) : belongsToValue,
      };
    }

    arrayHelpers.replace(rowIndex, updateRow);
  };

  const rowTemplate = {
    description: ({
      principalAmount, belongsTo, countryId, index,
    }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={principalAmount ? () => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : (value) => updateCountryOrBelongsToValues(countryId, value, index, belongsTo)}
        dataTa={`other-amounts-description-${index}`}
        width="160px"
      />
    ),
    belongsTo: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.belongsTo`}
        options={owners}
        className="belongs-to-select"
        placeholder={translate('select')}
        disabled={!description}
      />
    ),
    accountNumber: ({ description, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.accountNumber`}
        disabled={!description}
        width="160px"
      />
    ),
    countryId: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.countryId`}
        disabled={!description}
        options={countries}
        className="country-code-select"
        placeholder={translate('select')}
        width="160px"
      />
    ),
    principalAmount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.principalAmount`}
        dataTa={`other-amounts-principal-${index}`}
        customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
        disabled={!description}
      />
    ),
    otherAmountActions: ({ index }) => (
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
        const totalAmount = getTotalValue(values, 'principalAmount');
        if (totalAmount) {
          setFooterData({
            principalAmount: totalAmount,
          });
        } else {
          setFooterData(null);
        }
      }
    },
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
    belongsTo: null,
    accountNumber: '',
    countryId: null,
    principalAmount: (<FooterCell value={footerData.principalAmount} />),
  } : null),
  [footerData]);

  return (
    <OtherAmountsTable
      heading={translate('other-loans')}
      className="liabilites-section__table"
      values={values}
      columnGroup={COLUMN_GROUP}
      rowTemplate={rowTemplate}
      dataTa="other-amounts-liability"
      hasFooter={!!footerData}
      footerData={footerValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
      stickyColumns={STICKY_CLOUMNS}
    />
  );
};

OtherAmounts.propTypes = {
  /** contains array of other amount fields with description, belongsTo, etc.. */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      belongsTo: PropTypes.number,
      accountNumber: PropTypes.string,
      countryId: PropTypes.number,
      principalAmount: PropTypes.number,
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** specifies the list of owners - subjet/parner/both */
  owners: PropTypes.array,
  /** specifies the list of countries */
  countries: PropTypes.array,
};

/** Exported Enhanced Component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(OtherAmounts));

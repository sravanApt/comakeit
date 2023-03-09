import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import {
  ActionsCell, CurrencyCell,
} from '../../../../common/table-cell-templates';
import { SelectWrapper, TableCellWrapper } from '../../../../common/styled-wrapper';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { assetsTranslate as translate } from '../assets-translate';
import { getRemainingOptions } from '../../income-from-business/common/utils';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'countryId',
    label: translate('country'),
    className: 'col-description',
  },
  {
    id: 'dividend',
    label: () => <TableCellWrapper title={translate('dividend')}>{translate('dividend')}</TableCellWrapper>,
    className: 'col-amount text-align-right',
  },
  {
    id: 'dividendTax',
    label: () => <TableCellWrapper title={translate('withheld-source-tax')}>{translate('withheld-source-tax')}</TableCellWrapper>,
    className: 'col-amount',
  },
  {
    id: 'actions',
    label: '',
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  countryId: null,
  dividend: 0,
  dividendTax: 0,
};

const OtherCountryDividendTable = ({
  values, fieldNamePrefix, countries, dataTa = 'other-country-dividend-table', arrayHelpers,
}) => {

  const getOptionsToSelect = useMemo(() => (countryValues, currentIndex) => getRemainingOptions([...countryValues, { countryId: 1 }], currentIndex, countries, 'countryId'), [countries]);

  const currentRowTemplate = {
    countryId: ({ index }) => (
      <SelectWrapper
        width="160px"
        placeholder={translate('select')}
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.countryId`}
        options={getOptionsToSelect(values, index)}
        className="country-select"
        menuPortalTarget
      />
    ),
    dividend: ({ countryId, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.dividend`}
        disabled={!countryId}
        dataTa={`other-country-dividend-table-dividend-${index}`}
      />
    ),
    dividendTax: ({ countryId, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.dividendTax`}
        disabled={!countryId}
        dataTa={`other-country-dividend-table-tax-${index}`}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={values.length - 1}
        handleDelete={() => {
          arrayHelpers.remove(index);
        }}
        index={index}
        dataTa={`other-country-dividend-table-row-${index}`}
      />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    fieldToCheck: 'countryId',
  });

  return (
    <DataTable
      rows={values}
      columnGroups={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      className="other-country-dividend-table"
      dataTa={dataTa}
    />
  );
};

OtherCountryDividendTable.propTypes = {
  /** array of objects which contains different costs data */
  values: PropTypes.array.isRequired,
  /** field name prefix for the form */
  fieldNamePrefix: PropTypes.string.isRequired,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(OtherCountryDividendTable));

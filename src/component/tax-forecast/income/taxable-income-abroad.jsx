import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import { incomeTranslate as translate } from './income-translate';
import { TableCellWrapper, IconWrapper } from '../../../common/styled-wrapper';
import { convertCurrency } from '../../../common/utils';
import { ActionsCell } from '../../../common/table-cell-templates';
import { tableHeaderCells, NL_COUNTRY_CODE, defaultYesOrNoOptions } from './income.constants';
import TaxableIncomeAbroadTable from '../assets/assets-common-table';

const ABROAD_COLUMN_GROUP = [
  tableHeaderCells.description,
  {
    id: 2,
    label: () => <TableCellWrapper title={translate('amount')}>{translate('amount')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 3,
    label: translate('country-code'),
    className: 'col-countryCode',
  },
  {
    id: 4,
    label: () => <TableCellWrapper title={translate('subjected-to-dutch-tax')}>{translate('subjected-to-dutch-tax')}</TableCellWrapper>,
    className: 'col-tax col-input',
  },
  {
    id: 5,
    label: () => <TableCellWrapper title={translate('method-for-avoiding-double-taxation')}>{translate('method-for-avoiding-double-taxation')}</TableCellWrapper>,
    className: 'col-doubleTax col-select',
  },
  {
    id: 6,
    label: () => <TableCellWrapper width="92px" title={translate('payment-zvw-yet-to-be-done')}>{translate('payment-zvw-yet-to-be-done')}</TableCellWrapper>,
    className: 'col-payment col-select',
  },
  tableHeaderCells.actions,
];

const defaultRowTemplate = {
  salary: {
    description: '',
    amount: 0,
  },
  countryId: null,
  isIncomeFromEmployment: false,
  subjectedToDutchTax: 0,
  withheldWagesTaxAbroad: 0,
  isMethodForAvoidingDoubleTaxation: false,
  isPaymentZVWYetToBeDone: false,
  exploitedGeneralCompensationScheme: false,
  usedSpecialCompensationScheme: false,
  compensationSchemeGermany: false,
  changeOfEmployer: false,
  inBelgiumOrGermanyWithheldTax: 0,
};

/**
  * Tax Forecast - Income Component - Display Abroad Employment Income section
  *
  */

const TaxableIncomeAbroad = ({
  values, handleRemove, countries, updateAbroadIncomeData, handleRemoveAbroadIncomeRow,
}) => {
  const { showModal } = useModal();
  const countriesExceptNL = useMemo(() => countries.filter((country) => country.value !== NL_COUNTRY_CODE), [countries]);

  const abroadRowTemplate = {
    description: ({ salary }) => (
      <TableCellWrapper width="140px" title={salary?.description}>
        {salary?.description}
      </TableCellWrapper>
    ),
    amount: ({ salary }) => (
      <TableCellWrapper title={convertCurrency({ value: salary?.amount })}>
        {convertCurrency({ value: salary?.amount })}
      </TableCellWrapper>
    ),
    countryId: ({ countryId }) => {
      const countryName = countriesExceptNL.filter(i => i.value === countryId)?.[0]?.label;
      return (
        <TableCellWrapper title={countryName}>
          {countryName}
        </TableCellWrapper>
      );
    },
    tax: ({ subjectedToDutchTax }) => (
      <TableCellWrapper title={convertCurrency({ value: subjectedToDutchTax })}>
        {convertCurrency({ value: subjectedToDutchTax })}
      </TableCellWrapper>
    ),
    avoidDoubleTax: ({ isMethodForAvoidingDoubleTaxation }) => (
      <TableCellWrapper>
        {defaultYesOrNoOptions.filter(option => (option.value === isMethodForAvoidingDoubleTaxation))?.[0].label}
      </TableCellWrapper>
    ),
    paymentYetDone: ({ isPaymentZVWYetToBeDone }) => (
      <TableCellWrapper width="92px">
        {defaultYesOrNoOptions.filter(option => (option.value === isPaymentZVWYetToBeDone))?.[0].label}
      </TableCellWrapper>
    ),
    actions: ({ index }) => (
      <div className="actions-inline">
        <IconWrapper
          icon="pen"
          iconSet="fas"
          className="icon__edit edit"
          onClick={() => showSectionModal(index)}
          dataTa={`abroad-income-edit-${index}`}
        />
        <ActionsCell
          handleDelete={() => handleRemoveAbroadIncomeRow(index)}
          index={index}
          dataTa={`abroad-income-row-${index}`}
        />
      </div>
    ),
  };

  const showSectionModal = (index) => {
    const props = {
      abroadIncomeData: index !== undefined ? { ...values[index] } : { ...defaultRowTemplate },
      countriesExceptNL,
      className: 'styled-grid-modal',
      onSubmit: (data) => updateAbroadIncomeData(data, index),
    };
    showModal('income-from-abroad-modal', props);
  };

  return (
    <TaxableIncomeAbroadTable
      heading={translate('taxable-income-abroad')}
      values={values}
      columnGroup={ABROAD_COLUMN_GROUP}
      rowTemplate={abroadRowTemplate}
      dataTa="income-abroad"
      handleRemove={handleRemove}
      addButtonText={translate('taxable-income-abroad')}
      addButtonDataTa="add-taxable-income-abroad-button"
      showSectionModal={showSectionModal}
    />
  );
};

TaxableIncomeAbroad.propTypes = {
  /** contains array of income-abroad fields with salary, wages, countryId etc... */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      salary: PropTypes.shape({
        description: PropTypes.string,
        amount: PropTypes.number,
      }),
      countryId: PropTypes.number,
      isIncomeFromEmployment: PropTypes.bool,
      subjectedToDutchTax: PropTypes.number,
      withheldWagesTaxAbroad: PropTypes.number,
      isMethodForAvoidingDoubleTaxation: PropTypes.bool,
      isPaymentZVWYetToBeDone: PropTypes.bool,
      exploitedGeneralCompensationScheme: PropTypes.bool,
      usedSpecialCompensationScheme: PropTypes.bool,
      compensationSchemeGermany: PropTypes.bool,
      changeOfEmployer: PropTypes.bool,
      inBelgiumOrGermanyWithheldTax: PropTypes.number,
    }),
  ),
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** Provides options for select country component */
  countries: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  ).isRequired,
  /** callback to save abroad income data */
  updateAbroadIncomeData:  PropTypes.func.isRequired,
  /** callback to remove row of abroad income data */
  handleRemoveAbroadIncomeRow: PropTypes.func.isRequired,
};

export default TaxableIncomeAbroad;

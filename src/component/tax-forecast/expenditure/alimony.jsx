import React, {
  useState, useRef, useEffect, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from '@visionplanner/ui-react-material';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import { expenditureTranslate as translate } from './expenditure-translate';
import { getTotalValue, cleanDeep } from '../../../common/utils';
import {
  ActionsCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import AlimonyTable from '../income/common/income-common-table';
import { IconWrapper, TableCellWrapper, DescriptionCellWrapper } from '../../../common/styled-wrapper';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import ExpenditureTotalBar from './expenditure-total-bar';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'amount-paid-to',
    label: `${translate('alimony-paid-to')}`,
  },
  {
    id: 'periodic-payments',
    label: () => <TableCellWrapper title={translate('periodic-payments')}>{translate('periodic-payments')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'lump-sum',
    label: () => <TableCellWrapper title={translate('lump-sum')}>{translate('lump-sum')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'settlement-pension-rights',
    label: () => <TableCellWrapper title={translate('settlement-pension-rights')}>{translate('settlement-pension-rights')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'welfare',
    label: () => <TableCellWrapper title={translate('welfare')}>{translate('welfare')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'other-alimony',
    label: () => <TableCellWrapper title={translate('other-alimony')}>{translate('other-alimony')}</TableCellWrapper>,
    className: 'text-align-right',
  },
  {
    id: 'actions',
    label: `${translate('actions-label')}`,
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  alimonyPaidTo: '',
  periodicPayment: null,
  lumpSumAmount: null,
  settlementPensionRights: null,
  welfare: null,
  otherAlimony: null,
  alimonyBasicDetails: {
    firstName: '',
    initials: '',
    middleName: '',
    lastName: '',
    bsn: '',
    dateOfBirth: '',
    dateOfDeath: '',
  },
  address: {
    street: '',
    houseNumber: '',
    additionToHouseNumber: null,
    zipCode: '',
    city: '',
    countryId: '',
  },
};

/**
  * Tax Forecast - Expenditure Component - Alimony section
  *
  */

const Alimony = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, isPartner, handleAlimonySave, updateTaxCalculation, countries,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const rowIndex = useRef(null);
  const { showModal } = useModal();
  const handleAlimonyModal = (index) => {
    rowIndex.current = index;
    return showModal('alimony-modal',
      {
        showModal: true,
        data: values[index],
        title: translate('edit-alimony'),
        name: `${fieldNamePrefix}.${index}`,
        handleSubmit: updateAlimonyPersonalDetails,
        countries,
      });
  };

  const calculationRef = useRef();

  useEffect(() => {
    calculationRef.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculationRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const updateAlimonyPersonalDetails = (modalData) => {
    const firstName = modalData.correctionData.alimonyBasicDetails.firstName ? `${modalData.correctionData.alimonyBasicDetails.firstName} ` : '';
    const middleName = modalData.correctionData.alimonyBasicDetails.middleName ? `${modalData.correctionData.alimonyBasicDetails.middleName} ` : '';
    const lastName = modalData.correctionData.alimonyBasicDetails.lastName ? modalData.correctionData.alimonyBasicDetails.lastName : '';

    const updatedData = {
      ...modalData.correctionData,
      alimonyPaidTo: `${firstName}${middleName}${lastName}`,
    };
    arrayHelpers.replace(rowIndex.current, updatedData);
    handleAlimonySave(updatedData, rowIndex.current);
  };

  const getAmountCell = (dataTa, alimonyPaidTo, index, name) => (
    <CurrencyCell
      name={`${fieldNamePrefix}.${index}.${name}`}
      disabled={!alimonyPaidTo || isPartner}
      customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
      dataTa={`${dataTa}${index}`}
    />
  );
  const currentRowTemplate = {
    alimonyPaidTo: ({
      alimonyPaidTo, index,
    }) => (
      <div style={{ display: 'inline-flex' }}>
        { alimonyPaidTo && (
          <DescriptionCellWrapper>
            {alimonyPaidTo}
          </DescriptionCellWrapper>
        )
        }
        {!isPartner && <IconWrapper icon="pen" iconSet={Object.keys(cleanDeep(values[index])).length ? 'fas' : 'far'} className="icon__edit edit margin-auto" onClick={() => handleAlimonyModal(index)} dataTa={`edit-${index}`} />}
      </div>
    ),
    periodicPayment: ({ alimonyPaidTo, index }) => (
      getAmountCell('alimony-periodic-payment', alimonyPaidTo, index, 'periodicPayment')
    ),
    lumpSumAmount: ({ alimonyPaidTo, index }) => (
      getAmountCell('alimony-lumpsum-amount', alimonyPaidTo, index, 'lumpSumAmount')
    ),
    settlementPensionRights: ({ alimonyPaidTo, index }) => (
      getAmountCell('alimony-pension-rights', alimonyPaidTo, index, 'settlementPensionRights')
    ),
    welfare: ({ alimonyPaidTo, index }) => (
      getAmountCell('alimony-welfare', alimonyPaidTo, index, 'welfare')
    ),
    otherAlimony: ({ alimonyPaidTo, index }) => (
      getAmountCell('alimony-other-amount', alimonyPaidTo, index, 'otherAlimony')
    ),
    alimonyActions: ({ index }) => (
      !isPartner && (
        <ActionsCell
          lastIndex={values.length - 1}
          handleDelete={() => {
            setAmountUpdateIndicator(amountUpdateIndicator + 1);
            arrayHelpers.remove(index);
          }}
          index={index}
        />
      )
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values,
    fieldToCheck: 'alimonyPaidTo',
  });

  const totalDeductionForAlimony = useMemo(() => getTotalValue(values, 'periodicPayment') + getTotalValue(values, 'lumpSumAmount') + getTotalValue(values, 'settlementPensionRights') + getTotalValue(values, 'welfare') + getTotalValue(values, 'otherAlimony'), [values]);

  return (
    <div className="expenditure-sub-section">
      <AlimonyTable
        heading={translate('alimony-paid')}
        values={values}
        columnGroup={CURRENT_COLUMN_GROUP}
        rowTemplate={currentRowTemplate}
        dataTa="alimony-paid"
        handleRemove={handleRemove}
        arrayHelpers={arrayHelpers}
        defaultRowTemplate={defaultRowTemplate}
        className="income-section__table"
        hideDelete={isPartner}
      />
      <ExpenditureTotalBar
        label={translate('total-deduction-for-alimony')}
        amount={totalDeductionForAlimony}
      />
    </div>
  );
};

Alimony.propTypes = {
  /** contains array of alimony values */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      alimonyPaidTo: PropTypes.string,
      periodicPayment: PropTypes.number,
      lumpSumAmount: PropTypes.number,
      settlementPensionRights: PropTypes.number,
      welfare: PropTypes.number,
      otherAlimony: PropTypes.number,
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(Alimony));

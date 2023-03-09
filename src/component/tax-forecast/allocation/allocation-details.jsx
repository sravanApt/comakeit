import React, {
  useState, useEffect, useRef, useContext, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { ColumnLayout, Column } from '@visionplanner/ui-react-material';
import { useModal, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { ALLOCATION_DATA_KEYS } from '../tax-forecast.constants';
import {
  ALLOCATION_FIELD_NAME,
} from './allocation.constants';
import { allocationTranslate as translate } from './allocation-translate';
import {
  TableCellWrapper, DescriptionCellWrapper, InputWrapper, CurrencyCellWrapper,
} from '../../../common/styled-wrapper';
import { CurrencyCell } from '../../../common/table-cell-templates';
import { convertCurrency, cleanDeep } from '../../../common/utils';
import { allocationReport } from '../tax-forecast-request';
import TaxForecastContext from '../tax-forecast-context';
import { DESCRIPTION_INPUT_WIDTH as LABEL_WIDTH } from '../../../common/constants';

const renderAllocationRow = ({
  key,
  recommendedAllocation,
  values: { totalAmount, fiscalPartnerAmount, taxableSubjectAmount },
  updatedAmount,
}) => (
  <div className="flex" key={key}>
    <div className="common-data-table__cell">
      <DescriptionCellWrapper width={LABEL_WIDTH}>{translate(key.toLowerCase())}</DescriptionCellWrapper>
    </div>
    <div className="common-data-table__cell">
      {(!recommendedAllocation) ? (
        <CurrencyCell
          name={`${key}.taxableSubjectAmount`}
          dataTa={`${key}-taxable-subject-amount`}
          customChangeHandler={(value) => updatedAmount(value, key)}
        />
      ) : (
        <CurrencyCellWrapper title={convertCurrency({ value: Number(taxableSubjectAmount) })}>
          {convertCurrency({ value: Number(taxableSubjectAmount) })}
        </CurrencyCellWrapper>
      )}
    </div>
    <div className="common-data-table__cell">
      <CurrencyCellWrapper title={convertCurrency({ value: Number(fiscalPartnerAmount) })} data-ta={`${key}-fiscal-partner-amount`}>
        {convertCurrency({ value: Number(fiscalPartnerAmount) })}
      </CurrencyCellWrapper>
    </div>
    <div className="common-data-table__cell">
      <CurrencyCellWrapper title={convertCurrency({ value: Number(totalAmount) })}>
        {convertCurrency({ value: Number(totalAmount) })}
      </CurrencyCellWrapper>
    </div>
  </div>
);

/**
 * component to display allocation details for taxable subject and fiscal partner
 */

const AllocationDetails = ({
  personalDetails: { taxableSubjectDetails, fiscalPartner },
  values,
  updateTaxCalculation,
  setValues,
  handleSave,
}) => {
  const { dossierData } = useContext(TaxForecastContext);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const calculationRef = useRef();
  const { showModal } = useModal();

  useEffect(() => {
    calculationRef.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculationRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const updatedAmountField = useCallback((amount, key) => {
    setAmountUpdateIndicator(amountUpdateIndicator + 1);
    setValues({
      ...values,
      [key]: {
        ...values[key],
        fiscalPartnerAmount: Number(values[key].totalAmount) - (Number(amount) || 0),
        taxableSubjectAmount: amount,
      },
    });
  }, [values]);

  const fetchOptimiseAllocationDetails = useAsyncCallback(async (value) => {
    const data = await allocationReport(value, {
      ...cleanDeep(dossierData),
      [ALLOCATION_FIELD_NAME]: { ...cleanDeep({ ...values, recommendedAllocation: value }, false, [0]) },
    });
    const updatedAllocationData = {
      ...data,
      allocationFlag: value,
    };
    setValues(updatedAllocationData);
    handleSave(updatedAllocationData);
    setAmountUpdateIndicator(amountUpdateIndicator + 1);
  }, [values], { displayLoader: true });

  return (
    <ColumnLayout>
      <Column span={12} align="middle">
        <div className="flex">
          <div className="recommended__cell">
            <DescriptionCellWrapper width={LABEL_WIDTH}>{translate('recommended-allocation')}</DescriptionCellWrapper>
          </div>
          <div className="common-data-table__cell">
            <InputWrapper
              type="boolean"
              name="allocationFlag"
              dataTa="recommendedAllocation"
              controlType="switch"
              className="recommendedAllocation"
              customChangeHandler={(value) => {
                showModal('allocation-confirmation-modal', {
                  onConfirm: () => {
                    fetchOptimiseAllocationDetails(value);
                  },
                  onCancel: () => {
                    setValues({
                      ...values,
                      allocationFlag: values.recommendedAllocation,
                    });
                    setAmountUpdateIndicator(amountUpdateIndicator + 1);
                  },
                  dataTa: 'confirmation-modal',
                  modalTitle: translate('confirmation-title'),
                  confirmButtonText: translate('confirmation-yes'),
                  cancelButtonText: translate('confirmation-no'),
                  preventDismissalOnOutsideClick: true,
                  children: value ? translate('override-current-allocation') : translate('no-longer-automatic-optimized'),
                });
              }}
            />
          </div>
        </div>
      </Column>
      <Column span={12} align="middle">
        <div className="flex">
          <div className="common-data-table__cell">
            <TableCellWrapper className="common-data-table__head-cell" width={LABEL_WIDTH}>
              {translate('allocation-details')}
            </TableCellWrapper>
          </div>
          <div className="common-data-table__cell">
            <TableCellWrapper className="common-data-table__head-cell text-align-right" title={taxableSubjectDetails.firstName}>
              {taxableSubjectDetails.firstName}
            </TableCellWrapper>
          </div>
          <div className="common-data-table__cell">
            <TableCellWrapper className="common-data-table__head-cell text-align-right" title={fiscalPartner.firstName}>
              {fiscalPartner.firstName}
            </TableCellWrapper>
          </div>
          <div className="common-data-table__cell">
            <TableCellWrapper className="common-data-table__head-cell text-align-right" title={translate('total-amount')}>
              {translate('total-amount')}
            </TableCellWrapper>
          </div>
        </div>
        { ALLOCATION_DATA_KEYS.map((key) => renderAllocationRow({
          key, recommendedAllocation: values.recommendedAllocation, values: values[key], updatedAmount: updatedAmountField,
        })) }
      </Column>
    </ColumnLayout>
  );
};

AllocationDetails.propTypes = {
  /** object which contains allocation data */
  personalDetails: PropTypes.object.isRequired,
  /** provide allocation details */
  values: PropTypes.object.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
};

export default AllocationDetails;

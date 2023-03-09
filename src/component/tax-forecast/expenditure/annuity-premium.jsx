import React, {
  useState, useMemo, useRef, useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { Typography, FieldArray } from '@visionplanner/ui-react-material';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import { expenditureTranslate as translate } from './expenditure-translate';
import { getTotalValue, cleanDeep } from '../../../common/utils';
import {
  ActionsCell, DescriptionCell, CurrencyCell, FooterCell,
} from '../../../common/table-cell-templates';
import AnnuityPremiumTable from '../income/common/income-common-table';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { IconWrapper } from '../../../common/styled-wrapper';
import ExpenditureTotalBar from './expenditure-total-bar';
import { CURRENCY_INPUT_WIDTH } from '../../../common/constants';
import { checkDataInReserveDetailsExist } from './common/utils';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: `${translate('description-label')}`,
  },
  {
    id: 'policy-number',
    label: `${translate('policy-number')}`,
  },
  {
    id: 'amount',
    label: `${translate('amount-label')}`,
    className: 'text-align-right',
  },
  {
    id: 'actions',
    label: `${translate('actions-label')}`,
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '',
  policyNumber: '',
  amount: 0,
};

/**
    * Tax Forecast - Expenditure Component - Annuity premium section
    *
    */

const AnnuityPremium = ({
  values: { premiumsPaidDetails: { premiumDetails } },
  fieldNamePrefix,
  handleRemove,
  arrayHelpers,
  fieldName,
  annualAndReserveMarginDetails,
  handleModalSave,
  updateTaxCalculation,
  reportData: { totalDeductionForAnnuity },
}) => {
  const [footerData, setFooterData] = useState(null);
  const { showModal } = useModal();
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);

  const currentRowTemplate = useMemo(() => ({
    description: ({ amount, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        dataTa={`premium-annuity-description${index}`}
        customChangeHandler={amount ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    policyNumber: ({ description, index }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.policyNumber`}
        dataTa={`premium-annuity-policy-number${index}`}
        width={CURRENCY_INPUT_WIDTH}
        disabled={!description}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        dataTa={`premium-annuity-amount${index}`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        disabled={!description}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={premiumDetails.length - 1}
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  }), [amountUpdateIndicator, arrayHelpers, fieldNamePrefix, premiumDetails.length]);

  const self = useRef();

  useEffect(() => {
    self.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && self.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const handleAnnuityPremiumSave = (modalData, subSectionIndex) => {
    handleModalSave({
      modalData,
      subSectionIndex,
      reportType: 'ExpenditureTotalDeductionForAnnuity',
      fieldName: 'totalDeductionForAnnuity',
    });
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: defaultRowTemplate,
    values: premiumDetails,
    loadFooterData: () => {
      if (premiumDetails && premiumDetails.length) {
        const totalAmount = getTotalValue(premiumDetails, 'amount');
        if (totalAmount) {
          setFooterData({
            amount: totalAmount,
          });
        } else {
          setFooterData(null);
        }
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    policyNumber: '',
    amount: (<FooterCell value={footerData.amount} />),
  } : null),
  [footerData]);

  const hasReserveDetails = useMemo(
    () => !checkDataInReserveDetailsExist(cleanDeep(annualAndReserveMarginDetails)) && cleanDeep(premiumDetails).length, [annualAndReserveMarginDetails, premiumDetails],
  );

  return (
    <AnnuityPremiumTable
      heading={translate('premium-for-annuity')}
      values={premiumDetails}
      columnGroup={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="annuity-premium"
      hasFooter={!!footerData}
      footerData={footerValues}
      handleRemove={handleRemove}
      arrayHelpers={arrayHelpers}
      defaultRowTemplate={defaultRowTemplate}
      className="income-section__table"
    >
      <div className="mar-b-md">
        <Typography use="h6" className="font-weight-bold">{translate('annual-margin-and-reserve-margin')}</Typography>
        <IconWrapper
          icon="pen"
          iconSet={checkDataInReserveDetailsExist(cleanDeep(annualAndReserveMarginDetails)) ? 'fas' : 'far'}
          className={`icon__edit edit ${hasReserveDetails && 'icon-error'}`}
          dataTa="edit-annual-reserve-margins"
          onClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: annualAndReserveMarginDetails,
              title: translate('edit-annual-reserve-margins'),
              name: `${fieldName}.annualAndReserveMarginDetails`,
              modalKey: 'annualAndReserveMarginDetails',
              handleSubmit: (modalData) => handleAnnuityPremiumSave(modalData, 1),
              className: 'annual-and-reserve-margin-details',
            })}
        />
      </div>
      <ExpenditureTotalBar
        label={translate('total-deduction-for-annuity')}
        amount={totalDeductionForAnnuity}
      />
    </AnnuityPremiumTable>
  );
};

AnnuityPremium.propTypes = {
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** specifies the form path */
  fieldName: PropTypes.string,
  /** specifies the list of annual reserve margin values */
  annualAndReserveMarginDetails: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number,
      profitFromBusiness: PropTypes.number,
      allocationToFor: PropTypes.number,
      releaseOfFor: PropTypes.number,
      incomeFromEmployment: PropTypes.number,
      incomeFromOtherActivities: PropTypes.number,
      incomeFromBenefits: PropTypes.number,
      factorA: PropTypes.number,
      deductedPremiums: PropTypes.number,
    }),
  ),
  /** callback to handle the modal save */
  handleModalSave: PropTypes.func,
  /** callback to handle the on change tax calculation */
  updateTaxCalculation: PropTypes.func,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({
  values, fieldName: name, name: `${name}.premiumsPaidDetails.premiumDetails`, ...restProps,
})(AnnuityPremium));

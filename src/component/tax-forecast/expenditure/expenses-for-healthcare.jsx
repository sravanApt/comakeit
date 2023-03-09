import React from 'react';
import * as Yup from 'yup';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import PropTypes from 'prop-types';
import ExpensesForHealthcareHeading from '../income/common/income-section-heading';
import { expenditureTranslate as translate } from './expenditure-translate';
import { getTotalValue, cleanDeep } from '../../../common/utils';
import ExpenditureTotalBar from './expenditure-total-bar';
import ExpensesColumnLayout from './expenses-column-layout';
import { amountDescriptionSchema } from './expenditure-validation-schema';
import { checkExpenseDetailsExist } from './common/utils';
import { GridWrapper } from '../../../common/styled-wrapper';
import Threshold from './threshold';

/**
 * Expenditure form - Expenses for health care section
 */

const ExpensesForHealthcare = ({
  values, fieldNamePrefix, handleRemove, isPartner, handleModalSave, taxableYear,
  reportData: {
    reportValues,
    thresholdValues: { expensesForHealthcare },
  },
}) => {
  const { showModal } = useModal();
  const handleExpensesModalSave = (modalData, subSectionIndex, reportType, fieldName) => {
    handleModalSave({
      modalData,
      subSectionIndex,
      reportType,
      fieldName,
    });
  };
  return (
    <ExpensesForHealthcareHeading
      heading={translate('expenses-for-healthcare')}
      handleRemove={handleRemove}
      dataTa="expenses-for-healthcare"
      hideDelete={isPartner}
    >
      <Threshold thresholdAmount={expensesForHealthcare} />
      <GridWrapper>
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('treatment')}
          amount={getTotalValue(values.treatment.details, 'amount')}
          isDataExist={checkExpenseDetailsExist(values?.treatment?.details)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.treatment,
              title: translate('therapy-treatment'),
              name: `${fieldNamePrefix}.treatment`,
              modalKey: 'treatment',
              fieldName: 'details',
              handleSubmit: (modalData) => handleModalSave({ modalData, subSectionIndex: 0 }),
              validationSchema: Yup.object().shape({
                correctionData: Yup.object({
                  treatment: Yup.object({
                    details: Yup.array()
                      .of(amountDescriptionSchema())
                      .nullable(),
                  }).nullable(),
                }),
              }),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('prescribed-medication')}
          amount={getTotalValue(values.prescribedMedication.details, 'amount')}
          isDataExist={checkExpenseDetailsExist(values?.prescribedMedication?.details)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.prescribedMedication,
              title: translate('prescribed-medication'),
              name: `${fieldNamePrefix}.prescribedMedication`,
              modalKey: 'prescribedMedication',
              fieldName: 'details',
              handleSubmit: (modalData) => handleModalSave({ modalData, subSectionIndex: 1 }),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('aids')}
          amount={getTotalValue(values.aids.details, 'amount')}
          isDataExist={checkExpenseDetailsExist(values?.aids?.details)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.aids,
              title: translate('aids'),
              name: `${fieldNamePrefix}.aids`,
              modalKey: 'aids',
              fieldName: 'details',
              handleSubmit: (modalData) => handleModalSave({ modalData, subSectionIndex: 2 }),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('additional-family-support')}
          amount={reportValues.reportAmount}
          isDataExist={checkExpenseDetailsExist(values?.additionalFamilySupport?.details)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.additionalFamilySupport,
              title: translate('additional-family-support'),
              name: `${fieldNamePrefix}.additionalFamilySupport`,
              modalKey: 'additionalFamilySupport',
              fieldName: 'details',
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 3, 'ExpenditureAdditionalFamilySupport', 'reportAmount'),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('prescribed-diet')}
          amount={reportValues.totalExpensesPrescribedDiet}
          isDataExist={checkExpenseDetailsExist(values?.prescribedDiet?.dietDetails)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.prescribedDiet,
              title: translate('prescribed-diet'),
              name: `${fieldNamePrefix}.prescribedDiet`,
              modalKey: 'prescribedDiet',
              fieldName: 'dietDetails',
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 4, 'ExpenditurePrescribedDiet', 'totalExpensesPrescribedDiet'),
              taxableYear,
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('travel-expenses-for-healthcare')}
          amount={reportValues.totalExpensesForHealthcare}
          isDataExist={!!Object.keys(cleanDeep(values?.travelExpensesForHealthcare)).length}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.travelExpensesForHealthcare,
              title: translate('travel-expenses-for-healthcare-pop-up-label'),
              name: `${fieldNamePrefix}.travelExpensesForHealthcare`,
              modalKey: 'travelExpensesForHealthcare',
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 5, 'ExpenditureTravelExpensesForHealthcare', 'totalExpensesForHealthcare'),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('travel-expenses-for-hospital-visit-of-family-member')}
          amount={reportValues.totalTravelExpensesOfHospitalVisitOfFamilyMember}
          isDataExist={checkExpenseDetailsExist(values?.travelExpensesForHosipitalVisitOfFamilyMember?.travelExpensesForHoipitalVisitOfFamilyMembersDetails)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.travelExpensesForHosipitalVisitOfFamilyMember,
              title: translate('travel-expenses-for-hospital-visit-of-family-member'),
              name: `${fieldNamePrefix}.travelExpensesForHosipitalVisitOfFamilyMember`,
              modalKey: 'travelExpensesForHosipitalVisitOfFamilyMember',
              fieldName: 'travelExpensesForHoipitalVisitOfFamilyMembersDetails',
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 6, 'ExpenditureTravelExpensesForHospitalVisit', 'totalTravelExpensesOfHospitalVisitOfFamilyMember'),
            })
          }
        />
        <ExpensesColumnLayout
          disable={isPartner}
          label={translate('extra-expenses-for-clothes-and-linen')}
          amount={reportValues.totalExpensesForClothesAndLineen}
          isDataExist={checkExpenseDetailsExist(values?.extraExpensesForClothesAndLinen?.clothesAndLineenDetails)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.extraExpensesForClothesAndLinen,
              title: translate('extra-expenses-for-clothes-and-linen'),
              name: `${fieldNamePrefix}.extraExpensesForClothesAndLinen`,
              modalKey: 'extraExpensesForClothesAndLinen',
              fieldName: 'clothesAndLineenDetails',
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 7, 'ExtraExpensesForClothesAndLinnen', 'totalExpensesForClothesAndLineen'),
              taxableYear,
            })
          }
        />
      </GridWrapper>
      <ExpenditureTotalBar
        label={translate('total-deduction-for-healthcare-expenses')}
        amount={reportValues.totalDeductionForHealthcare}
      />
      {/* {modalKey && loadModal()} */}
    </ExpensesForHealthcareHeading>
  );
};

ExpensesForHealthcare.propTypes = {
  /** object which contains all the expenses for health care */
  values: PropTypes.object.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** indicates partner or subject */
  isPartner: PropTypes.bool.isRequired,
  /** callback to handle modal save */
  handleModalSave: PropTypes.func.isRequired,
  /** specifies the taxable year dossier */
  taxableYear: PropTypes.number,
};

export default ExpensesForHealthcare;

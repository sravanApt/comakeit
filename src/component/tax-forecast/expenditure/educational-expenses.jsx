import React from 'react';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import PropTypes from 'prop-types';
import ExpensesForHealthcareHeading from '../income/common/income-section-heading';
import { expenditureTranslate as translate } from './expenditure-translate';
import { getTotalValue } from '../../../common/utils';
import { checkExpenseDetailsExist } from './common/utils';
import ExpenditureTotalBar from './expenditure-total-bar';
import ExpensesColumnLayout from './expenses-column-layout';
import { GridWrapper } from '../../../common/styled-wrapper';
import Threshold from './threshold';

/**
 * Expenditure form - Expenses for education section
 */
const EducationalExpenses = ({
  values, fieldNamePrefix, handleRemove, handleModalSave, taxableYear,
  reportData: {
    reportValues: { totalDeductionForEducationalExpenses },
    thresholdValues: { educationalExpenses },
  },
}) => {
  const { showModal } = useModal();
  const handleExpensesModalSave = (modalData, subSectionIndex) => {
    handleModalSave({
      modalData,
      subSectionIndex,
      reportType: 'ExpenditureTotalDeductionForEducationExpenses',
      fieldName: 'totalDeductionForEducationalExpenses',
    });
  };
  return (
    <ExpensesForHealthcareHeading
      heading={translate('educational-expenses')}
      handleRemove={handleRemove}
      className="educational-expenses"
      dataTa="educational-expenses"
    >
      <Threshold thresholdAmount={educationalExpenses} />
      <GridWrapper>
        <ExpensesColumnLayout
          label={translate('expenses-for-education-without-study-grant')}
          amount={getTotalValue(values.expensesForEducationWithoutStudyGrant.details, 'amount') - (values.expensesForEducationWithoutStudyGrant.reimbursement || 0)}
          isDataExist={checkExpenseDetailsExist(values?.expensesForEducationWithoutStudyGrant?.details) || !!values.expensesForEducationWithoutStudyGrant.reimbursement}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.expensesForEducationWithoutStudyGrant,
              title: translate('expenses-for-education-without-study-grant'),
              name: `${fieldNamePrefix}.expensesForEducationWithoutStudyGrant`,
              modalKey: 'expensesForEducationWithoutStudyGrant',
              fieldName: 'details',
              showReimbursement: true,
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 0),
            })
          }
        />
        {/* Will be enabled after pilot
        <ExpensesColumnLayout
          label={translate('expenses-for-education-with-study-grant')}
          amount={getTotalValue(values.expensesForEducationWithStudyGrant.details, 'amount') - (values.expensesForEducationWithStudyGrant.reimbursement || 0)}
          isDataExist={checkExpenseDetailsExist(values?.expensesForEducationWithStudyGrant?.details)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.expensesForEducationWithStudyGrant,
              title: translate('expenses-for-education-with-study-grant'),
              name: `${fieldNamePrefix}.expensesForEducationWithStudyGrant`,
              modalKey: 'expensesForEducationWithStudyGrant',
              fieldName: 'details',
              showReimbursement: true,
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 1),
            })
          }
        />
        */}
        <ExpensesColumnLayout
          label={translate('study-grant-repaid')}
          amount={getTotalValue(values.studyGrantRepaid.studyGrantDetails, 'amountPaidBack')}
          isDataExist={checkExpenseDetailsExist(values?.studyGrantRepaid?.studyGrantDetails)}
          handleEditClick={() => showModal('expenditure-modal',
            {
              showModal: true,
              data: values.studyGrantRepaid,
              title: translate('study-grant-repaid'),
              name: `${fieldNamePrefix}.studyGrantRepaid`,
              modalKey: 'studyGrantRepaid',
              fieldName: 'studyGrantDetails',
              taxableYear,
              handleSubmit: (modalData) => handleExpensesModalSave(modalData, 1),
            })
          }
        />
      </GridWrapper>
      <ExpenditureTotalBar
        label={translate('total-deduction-for-educational-expenses')}
        amount={totalDeductionForEducationalExpenses}
      />
    </ExpensesForHealthcareHeading>
  );
};

EducationalExpenses.propTypes = {
  /** object which contains all the expenses for health care */
  values: PropTypes.object.isRequired,
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to handle modal save */
  handleModalSave: PropTypes.func.isRequired,
  /** specifies the taxable year dossier */
  taxableYear: PropTypes.number,
};

export default EducationalExpenses;

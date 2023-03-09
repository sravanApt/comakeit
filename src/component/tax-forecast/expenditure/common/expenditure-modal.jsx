import React from 'react';
import * as Yup from 'yup';
import {
  Button, ModalBody, Form, ModalFooter,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ModalWrapper,
  FilterButtonsWrapper,
  CorrectionTableWrapper,
  DescriptionCellWrapper,
  TableCellWrapper,
} from '../../../../common/styled-wrapper';
import { CurrencyCell, FooterCell } from '../../../../common/table-cell-templates';
import { expenditureTranslate as translate } from '../expenditure-translate';
import AnnualReserveMarginModal from '../annual-reserve-margin-modal';
import TreatmentModal from '../expenses-for-healthcare-modals/treatment-modal';
import StudyGrantRepaidModal from '../educational-expenses-modals/study-grant-repaid-modal';
import PrescribedDietModal from '../expenses-for-healthcare-modals/prescribed-diet-modal';
import TravelExpensesForHealthcareModal from '../expenses-for-healthcare-modals/travel-expenses-for-healthcare-modal';
import ExpensesForClothesAndLinenModal from '../expenses-for-healthcare-modals/expenses-for-clothes-and-linen-modal';
import TravelExpensesForHospitalVisitOfFamilyMemberModal from '../expenses-for-healthcare-modals/travel-expenses-for-hosipital-visit-of-family-member-modal';
import { amountDescriptionSchema, validateEndDate } from '../expenditure-validation-schema';
import { stringToClassName, getTotalValue } from '../../../../common/utils';
import { isEqualObjects } from '../../income-from-business/common/utils';
import { DESCRIPTION_INPUT_WIDTH } from '../../../../common/constants';

/**
 * Expenditure Modal - Component to render modal for expenditure
 *
 */

const getStudyGrantOrReimbursementElements = (fieldName, modalKey, values, dataKey) => (
  <>
    <StudyGrantOrReimbursementElementsWrapper className="flex pad-lg">
      <div className="common-data-table__cell">
        <DescriptionCellWrapper width={DESCRIPTION_INPUT_WIDTH} className="pad-t-xs label">
          {(modalKey === 'expensesForEducationWithStudyGrant' ? translate('study-grant') : translate('reimbursement'))}
        </DescriptionCellWrapper>
      </div>
      <div className="common-data-table__cell">
        <CurrencyCell
          name={`${fieldName}.reimbursement`}
          dataTa="expenditure-modal-reimbursement"
        />
      </div>
    </StudyGrantOrReimbursementElementsWrapper>
    { ((getTotalValue(values[dataKey], 'amount') - values.reimbursement) !== 0) && (
      <StudyGrantOrReimbursementElementsWrapper className="flex pad-lg">
        <div className="common-data-table__cell table-footer">
          <TableCellWrapper width={DESCRIPTION_INPUT_WIDTH} title={translate('total-after-reimbursement')}>
            {translate('total-after-reimbursement')}
          </TableCellWrapper>
        </div>
        <div className="common-data-table__cell table-footer">
          <FooterCell value={(getTotalValue(values[dataKey], 'amount') - (values.reimbursement || 0))} />
        </div>
      </StudyGrantOrReimbursementElementsWrapper>
    )}
  </>
);

const StudyGrantOrReimbursementElementsWrapper = styled.div`
  border-top: 1px solid ${({ theme }) => theme.inputBorder};

  & .label {
    font-size: ${({ theme }) => theme.fontSizes.fs14};
    color: ${({ theme }) => theme.fieldLabelText};
  }
`;

const renderModal = (values, modalKey, taxableYear, fieldName) => {
  switch (modalKey) {
    case 'expensesForEducationWithoutStudyGrant':
    case 'expensesForEducationWithStudyGrant':
    case 'treatment':
    case 'prescribedMedication':
    case 'aids':
    case 'additionalFamilySupport':
      return <TreatmentModal values={values} name={`correctionData.${fieldName}`} footerDescription={(modalKey === 'expensesForEducationWithoutStudyGrant') ? translate('total-expenses') : ''} />;
    case 'studyGrantRepaid':
      return <StudyGrantRepaidModal values={values} name={`correctionData.${fieldName}`} taxableYear={taxableYear} />;
    case 'annualAndReserveMarginDetails':
      return <AnnualReserveMarginModal values={values} name="correctionData" />;
    case 'prescribedDiet':
      return <PrescribedDietModal values={values} name={`correctionData.${fieldName}`} />;
    case 'travelExpensesForHealthcare':
      return <TravelExpensesForHealthcareModal values={values} name="correctionData" />;
    case 'extraExpensesForClothesAndLinen':
      return <ExpensesForClothesAndLinenModal values={values} name={`correctionData.${fieldName}`} />;
    case 'travelExpensesForHosipitalVisitOfFamilyMember':
    default:
      return <TravelExpensesForHospitalVisitOfFamilyMemberModal values={values} name={`correctionData.${fieldName}`} />;
  }
};

const periodValidation = Yup.object().shape({
  startDate: Yup.string().required(translate('required-field')).nullable(),
  endDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
    const { startDate } = this.parent;
    return validateEndDate(startDate, value);
  }).required(translate('required-field')).nullable(),
}).nullable();

const clothsAndLeninPeriodValidation = Yup.object().when('description', {
  is: (description) => !!description,
  then: periodValidation,
});

const travelExpensesForHealthcareValidation = Yup.object({
  correctionData: Yup.object().shape({
    totalDistanceForHealthcareInKM: Yup.string().when('expensesPerKMInCents', {
      is: (expensesPerKMInCents) => expensesPerKMInCents,
      then: Yup.string().required(translate('required-field')),
    }).nullable(),
    expensesPerKMInCents: Yup.string().test('expenses-test', translate('required-field'), function (value) {
      const { totalDistanceForHealthcareInKM } = this.parent;
      return totalDistanceForHealthcareInKM ? !!value : true;
    }).nullable(),
  }).nullable(),
});

const studyGrantRepaidSchema = Yup.object().shape({
  correctionData: Yup.object({
    studyGrantDetails: Yup.array()
      .of(Yup.object().shape({
        educationalYear: Yup.string().test('educational-year-test', translate('required-field'), function (value) {
          const {
            amountPaidBack, mbo, hbOWO, period,
          } = this.parent;
          return !!amountPaidBack || !!mbo || !!hbOWO || !!period?.startDate || !!period?.endDate ? !!value : true;
        }).nullable(),
        amountPaidBack: Yup.string().when('educationalYear', {
          is: (educationalYear) => !!educationalYear,
          then: Yup.string().test('amount-paid-back-test', translate('required-field'), (value) => !!Number(value)).nullable(),
        }).nullable(),
        mbo: Yup.boolean().when('educationalYear', {
          is: (educationalYear) => !!educationalYear,
          then: Yup.boolean().required(translate('required-field')),
        }).nullable(),
        hbOWO: Yup.boolean().when('educationalYear', {
          is: (educationalYear) => !!educationalYear,
          then: Yup.boolean().required(translate('required-field')),
        }).nullable(),
        period: Yup.object().when('educationalYear', {
          is: (educationalYear) => !!educationalYear,
          then: periodValidation,
        }),
      })).nullable(),
  }).nullable(),
});

const renderValidationschema = (modalKey) => {
  switch (modalKey) {
    case 'expensesForEducationWithoutStudyGrant':
    case 'expensesForEducationWithStudyGrant':
    case 'treatment':
    case 'prescribedMedication':
    case 'aids':
    case 'additionalFamilySupport':
      return getSchemaForAmountAndDescription('details');
    case 'prescribedDiet':
      return prescribedDietSchema;
    case 'studyGrantRepaid':
      return studyGrantRepaidSchema;
    case 'travelExpensesForHealthcare':
      return travelExpensesForHealthcareValidation;
    case 'travelExpensesForHosipitalVisitOfFamilyMember':
      return Yup.object().shape({
        correctionData: Yup.object({
          travelExpensesForHoipitalVisitOfFamilyMembersDetails: Yup.array()
            .of(Yup.object()
              .shape({
                description: Yup.string().when(['actualCostsPublicTransportationCost', 'numberOfVisits', 'distance'], {
                  is: (actualCostsPublicTransportationCost, numberOfVisits, distance) => !!Number(actualCostsPublicTransportationCost) || !!Number(numberOfVisits) || !!Number(distance),
                  then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
                  otherwise: Yup.string().max(500, translate('invalid-entry')).nullable(),
                }).nullable(),
                numberOfVisits: Yup.string().test('number-of-visits-test', translate('required-field'), function (value) {
                  const {
                    description, actualCostsPublicTransportationCost, distance,
                  } = this.parent;
                  return ((description && !actualCostsPublicTransportationCost) || distance) ? !!value : true;
                }).nullable(),
                distance: Yup.string().test('distance-test', translate('required-field'), function (value) {
                  const {
                    description, actualCostsPublicTransportationCost, numberOfVisits,
                  } = this.parent;
                  return ((description && !actualCostsPublicTransportationCost) || numberOfVisits) ? !!value : true;
                }).nullable(),
                actualCostsPublicTransportationCost: Yup.string().test('amount-test', translate('required-field'), function (value) {
                  const { description, numberOfVisits, distance } = this.parent;
                  return (description && (!numberOfVisits && !distance)) ? Number(value) : true;
                }).nullable(),
              }))
            .nullable(),
        }).nullable(),
      });
    case 'extraExpensesForClothesAndLinen':
      return Yup.object().shape({
        correctionData: Yup.object({
          clothesAndLineenDetails: Yup.array()
            .of(Yup.object().shape({
              description: Yup.string().test('desc-test', translate('required-field'), function (value) {
                const { isConditionMoreThanOneYear, isMoreThanStandardForfeit, period } = this.parent;
                return !!isConditionMoreThanOneYear || !!isMoreThanStandardForfeit || !!period?.startDate || !!period?.endDate ? !!value : true;
              }).nullable(),
              isConditionMoreThanOneYear: Yup.boolean().when('description', {
                is: (description) => !!description,
                then: Yup.boolean().required(translate('required-field')),
              }).nullable(),
              isMoreThanStandardForfeit: Yup.boolean().when('description', {
                is: (description) => !!description,
                then: Yup.boolean().required(translate('required-field')),
              }).nullable(),
              period: clothsAndLeninPeriodValidation,
            })).nullable(),
        }).nullable(),
      });
    default:
      return null;
  }
};

const getSchemaForAmountAndDescription = (key) => Yup.object().shape({
  correctionData: Yup.object({
    [key]: Yup.array()
      .of(amountDescriptionSchema())
      .nullable(),
  }).nullable(),
});

const prescribedDietSchema = Yup.object().shape({
  correctionData: Yup.object({
    dietDetails: Yup.array()
      .of(Yup.object().shape({
        startDate: Yup.string().when('condition', {
          is: (condition) => !!condition,
          then: Yup.string().required(translate('required-field')),
        }).nullable(),
        endDate: Yup.string().when('condition', {
          is: (condition) => !!condition,
          then: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
            const { startDate } = this.parent;
            return validateEndDate(startDate, value);
          }).required(translate('required-field')),
        }).nullable(),
      }))
      .nullable(),
  }).nullable(),
});

const ExpenditureModal = ({
  showModal, data, onCloseModal, title, className = '', dataTa = 'expenditure-modal-form', modalKey, handleSubmit, fieldName, taxableYear, showReimbursement = false,
}) => (
  <ExpenditureModalWrapper
    title={title}
    open={showModal}
    onClose={onCloseModal}
    dataTa="expenditure-correction-modal"
    className={`${className} expenditure__${stringToClassName(modalKey)}`}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={{ correctionData: data }}
      onSubmit={(formValues) => {
        handleSubmit(formValues);
        onCloseModal();
      }}
      validateFormSchema={renderValidationschema(modalKey)}
      dataTa={dataTa}
    >
      {({ values, isValid }) => (
        <>
          <ModalBody>
            <CorrectionTableWrapper className="income-section__table margin-zero">
              {renderModal(fieldName ? values.correctionData[fieldName] : values.correctionData, modalKey, taxableYear, fieldName)}
              { showReimbursement && getStudyGrantOrReimbursementElements('correctionData', modalKey, values.correctionData, fieldName)}
            </CorrectionTableWrapper>
          </ModalBody>
          <ModalFooter>
            <FilterButtonsWrapper className="mar-md text-align-right">
              <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
              <Button type="submit" dataTa="annual-reserve-margin-save-button" disabled={!isValid || isEqualObjects(data, values.correctionData)}>{translate('save')}</Button>
            </FilterButtonsWrapper>
          </ModalFooter>
        </>
      )}
    </Form>
  </ExpenditureModalWrapper>
);

const ExpenditureModalWrapper = styled(ModalWrapper)`
  .income-section__table {
    .common-data-table {
      &__head-cell {
        height: 2rem;
      }

      &__cell {
        vertical-align: top;
      }
    }

    .table-footer {
      color: ${({ theme }) => theme.currencyText};
      font-size: ${({ theme }) => theme.fontSizes.fs18};
      text-align: right;
    }
  }

  .currency-input {
    input {
      text-align: right;
    }
  }

  &&& .mdc-dialog {
    &__content {
      padding: 0;
    }

    &__surface {
      min-width: 400px;
    }
  }
`;

ExpenditureModal.propTypes = {
  /** to display or hide the modal */
  showModal: PropTypes.bool.isRequired,
  /** data to the modal values */
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  /** title of the modal */
  title: PropTypes.string,
  /** modal class name */
  className: PropTypes.string,
  /** dataTa for identifying the modal */
  dataTa: PropTypes.string,
  /** specify the sectional key */
  modalKey: PropTypes.string.isRequired,
  /** callback to handle submit of modal */
  handleSubmit: PropTypes.func.isRequired,
  /** specify the inner key to display the data */
  fieldName: PropTypes.string,
  /** indicates the taxable year of current dossier */
  taxableYear: PropTypes.number,
};

export default ExpenditureModal;

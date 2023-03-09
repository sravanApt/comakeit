import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ColumnLayout, Column, Button, ModalBody, Form, ModalFooter,
} from '@visionplanner/ui-react-material';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  InputWrapper, ModalWrapper, DateInputWrapper, SelectWrapper,
} from '../../../common/styled-wrapper';
import {
  enableDatesBeforeCurrentDay, getHundredYearsBackDateObjectWithYearAndMonth, getDateObjectWithYearAndMonth,
} from '../../../common/utils';
import {
  REG_EXP_BSN_NUMBER, REG_EXP_ZIP_CODE, REG_EXP_INITIALS,
} from '../../../common/constants';

const correctionSchema = Yup.object().shape({
  correctionData: Yup.object({
    alimonyBasicDetails: Yup.object().shape({
      initials: Yup.string()
        .matches(REG_EXP_INITIALS, translate('invalid-entry'))
        .required(translate('required-field')),
      firstName: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
      middleName: Yup.string().max(500, translate('invalid-entry')).nullable(),
      lastName: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
      dateOfBirth: Yup.string().required(translate('required-field')),
      bsn: Yup.string().matches(REG_EXP_BSN_NUMBER, translate('invalid-entry')).required(translate('required-field')),
    }).nullable(),
    address: Yup.object().shape({
      street: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
      houseNumber: Yup.string().required(translate('required-field')),
      countryId: Yup.string().required(translate('required-field')),
      additionToHouseNumber: Yup.string().max(4, translate('invalid-entry')).nullable(),
      zipCode: Yup.string().matches(REG_EXP_ZIP_CODE, translate('invalid-entry')).required(translate('required-field')),
      city: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    }).nullable(),
  }),
});

const AlimonyModalRow = ({
  className, type = 'text', controlType, placeholder,
  name, dataTa, label, options,
}) => (
  <>
    <Column span={4} className="text-align-right">
      {label}
    </Column>
    <Column span={6}>
      <InputWrapper
        placeholder={placeholder}
        type={type}
        controlType={controlType}
        className={`text-input ${className}`}
        name={name}
        options={options}
        dataTa={dataTa}
      />
    </Column>
  </>
);

const detailsFieldsArray = [
  {
    label: `${translate('initials')} *`,
    name: 'correctionData.alimonyBasicDetails.initials',
    dataTa: 'initials-input',
  },
  {
    label: `${translate('first-name')} *`,
    name: 'correctionData.alimonyBasicDetails.firstName',
    dataTa: 'first-name-input',
  },
  {
    label: translate('middle-name'),
    name: 'correctionData.alimonyBasicDetails.middleName',
    dataTa: 'middle-name-input',
  },
  {
    label: `${translate('last-name')} *`,
    name: 'correctionData.alimonyBasicDetails.lastName',
    dataTa: 'last-name-input',
  },
  {
    label: `${translate('bsn')} *`,
    name: 'correctionData.alimonyBasicDetails.bsn',
    dataTa: 'bsn-input',
  },
];

const adressFieldsArray = [
  {
    label: `${translate('street')} *`,
    name: 'correctionData.address.street',
    dataTa: 'street-input',
  },
  {
    label: `${translate('house-number')} *`,
    name: 'correctionData.address.houseNumber',
    dataTa: 'house-number-input',
    type: 'number',
  },
  {
    label: translate('addition-to-home-number'),
    name: 'correctionData.address.additionToHouseNumber',
    dataTa: 'addition-to-house-number-input',
  },
  {
    label: `${translate('zip-code')} *`,
    name: 'correctionData.address.zipCode',
    dataTa: 'zip-code-input',
  },
  {
    label: `${translate('city')} *`,
    name: 'correctionData.address.city',
    dataTa: 'city-input',
  },
];
/**
  * Tax Forecast - Alimony Details Component
  *
  */

const AlimonyPaidToModal = ({
  data, showModal, onCloseModal, title, countries, dataTa, className, handleSubmit,
}) => (
  <AlimonyPaidToModalWrapper
    title={title}
    open={showModal}
    onClose={onCloseModal}
    dataTa={dataTa}
    className={className}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={{ correctionData: data }}
      onSubmit={(formValues) => {
        handleSubmit(formValues);
        onCloseModal();
      }}
      validateFormSchema={correctionSchema}
      dataTa="alimony-correction-form"
    >
      {({ isValid, isDirty }) => (
        <>
          <ModalBody>
            <div className="income-section__table margin-zero">
              <ColumnLayout>
                {detailsFieldsArray.map((detail) => (
                  <AlimonyModalRow
                    label={detail.label}
                    name={detail.name}
                    dataTa={detail.dataTa}
                    key={detail.dataTa}
                  />
                ))}
                <Column span={4} className="text-align-right">
                  {`${translate('date-of-birth')} *`}
                </Column>
                <Column span={6}>
                  <DateInputWrapper
                    placeholder={translate('date')}
                    type="date"
                    showSelectOptions
                    className="text-input date-of-birth"
                    name="correctionData.alimonyBasicDetails.dateOfBirth"
                    isOutsideRange={enableDatesBeforeCurrentDay}
                    isDateReadOnly
                    minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
                    maxDate={getDateObjectWithYearAndMonth()}
                    withPortal
                  />
                </Column>
                {adressFieldsArray.map((detail) => (
                  <AlimonyModalRow
                    label={detail.label}
                    name={detail.name}
                    dataTa={detail.dataTa}
                    key={detail.dataTa}
                    type={detail.type}
                  />
                ))}
                <Column span={4} className="text-align-right">
                  {`${translate('country')} *`}
                </Column>
                <Column span={6}>
                  <SelectWrapper
                    placeholder={translate('select')}
                    type="selectOne"
                    controlType="autocomplete"
                    name="correctionData.address.countryId"
                    options={countries}
                    dataTa="country-input"
                    className="country-code"
                  />
                </Column>
              </ColumnLayout>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
            <Button type="submit" disabled={!isValid || !isDirty} dataTa="alimony-save-button" buttonType="primary">{translate('save')}</Button>
          </ModalFooter>
        </>
      )}
    </Form>
  </AlimonyPaidToModalWrapper>
);

AlimonyPaidToModal.propTypes = {
  /** to display or hide the modal */
  showModal: PropTypes.bool.isRequired,
  /** title of the modal */
  title: PropTypes.string,
  /** modal class name */
  className: PropTypes.string,
  /** dataTa for identifying the modal */
  dataTa: PropTypes.string,
  /** contains alimony personal info and address details */
  data: PropTypes.shape({
    /** alimony paid to personal details */
    alimonyBasicDetails: PropTypes.shape({
      firstName: PropTypes.string,
      initials: PropTypes.string,
      middleName: PropTypes.string,
      lastName: PropTypes.string,
      bsn: PropTypes.string,
      dateOfBirth: PropTypes.string,
    }),
    /** alimony paid to address details */
    address: PropTypes.shape({
      street: PropTypes.string,
      houseNumber: PropTypes.string,
      additionToHouseNumber: PropTypes.string,
      zipCode: PropTypes.string,
      city: PropTypes.string,
      countryId: PropTypes.string,
    }),
  }),
  /** callback to handle submit of modal */
  handleSubmit: PropTypes.func.isRequired,
};

export default AlimonyPaidToModal;

const AlimonyPaidToModalWrapper = styled(ModalWrapper)`
  &&& .mdc-dialog__surface {
    min-width: 400px;
  }

  .mdc-layout-grid__cell {
    &--span-4 {
      margin: auto 0;
    }
  }

  .country-code--select {
    & .react-select__menu-list {
      max-height: 200px;
    }
  }
`;

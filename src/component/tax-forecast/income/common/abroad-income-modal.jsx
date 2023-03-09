import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Form,
  ColumnLayout,
  Column,
  Button,
  Typography,
  ModalBody,
  ModalFooter,
} from '@visionplanner/ui-react-material';
import { ModalWrapper, SelectWrapper } from '../../../../common/styled-wrapper';
import { incomeTranslate as translate } from '../income-translate';
import { DescriptionCell, CurrencyCell } from '../../../../common/table-cell-templates';
import { formFieldSpans } from '../../assets/assets.constants';
import { defaultYesOrNoOptions, BELGIUM_GERMANY_COUNTRY_CODES } from '../income.constants';
import { abroadIncomeSchema } from '../income-validation-schema';

const SELECT_PROPS = {
  width: "100px",
  type: "selectOne",
  controlType: "autocomplete",
  options: defaultYesOrNoOptions,
};

const AbroadIncomeModalWrapper = styled(ModalWrapper)`
  &&& .mdc-dialog__surface {
    min-width: 600px;
  }
`;

/**
 * Modal Component - Component that is used to show Abroad income popup
 */
const AbroadIncomeModal = ({
  abroadIncomeData,
  onCloseModal,
  className,
  countriesExceptNL,
  onSubmit,
}) => (
  <AbroadIncomeModalWrapper
    title={translate('taxable-income-abroad')}
    open
    onClose={onCloseModal}
    dataTa="taxable-income-abroad-modal"
    className={className}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={abroadIncomeData}
      onSubmit={(formValues) => {
        onSubmit(formValues);
        onCloseModal();
      }}
      validateFormSchema={abroadIncomeSchema()}
      validateOnMount
      dataTa="taxable-income-abroad-form"
    >
      {({
        values, setValues, isValid, isDirty,
      }) => (
        <>
          <ModalBody>
            <ColumnLayout>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('description')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <DescriptionCell
                  name="salary.description"
                  dataTa="income-from-abroad-description"
                  width="180px"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('amount')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="salary.amount"
                  dataTa="income-from-abroad-amount"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('country-code')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  width="150px"
                  type="selectOne"
                  controlType="autocomplete"
                  name="countryId"
                  options={countriesExceptNL}
                  className="countryCode-select"
                  customChangeHandler={(selectedValue) => {
                    setValues({
                      ...values,
                      countryId: selectedValue,
                      exploitedGeneralCompensationScheme: false,
                      usedSpecialCompensationScheme: false,
                      compensationSchemeGermany: false,
                      changeOfEmployer: false,
                      inBelgiumOrGermanyWithheldTax: (!BELGIUM_GERMANY_COUNTRY_CODES.includes(selectedValue)) ? 0 : values.inBelgiumOrGermanyWithheldTax,
                    });
                  }}
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('income-from-employment')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="isIncomeFromEmployment"
                  className="empIncome-select"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('subjected-to-dutch-tax')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="subjectedToDutchTax"
                  dataTa="subjectedToDutchTax"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('withhold-wages-tax-abroad')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="withheldWagesTaxAbroad"
                  dataTa="withheldWagesTaxAbroad"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('method-for-avoiding-double-taxation')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="isMethodForAvoidingDoubleTaxation"
                  className="isMethodForAvoidingDoubleTaxation-select"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('payment-zvw-yet-to-be-done')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="isPaymentZVWYetToBeDone"
                  className="isPaymentZVWYetToBeDone-select"
                  menuPlacement="top"
                />
              </Column>
              {(BELGIUM_GERMANY_COUNTRY_CODES[0] === values.countryId) && (
                <>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">
                      {`${translate('general-compensation-applicable')} *`}
                    </Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <SelectWrapper
                      {...SELECT_PROPS}
                      name="exploitedGeneralCompensationScheme"
                      className="exploitedGeneralCompensationScheme-select"
                    />
                  </Column>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">
                      {`${translate('additional-compensation-applicable')} *`}
                    </Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <SelectWrapper
                      {...SELECT_PROPS}
                      name="usedSpecialCompensationScheme"
                      className="usedSpecialCompensationScheme-select"
                    />
                  </Column>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">
                      {`${translate('change-of-employer')} *`}
                    </Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <SelectWrapper
                      {...SELECT_PROPS}
                      name="changeOfEmployer"
                      className="changeOfEmployer-select"
                    />
                  </Column>
                </>
              )}
              {(BELGIUM_GERMANY_COUNTRY_CODES[1] === values.countryId) && (
                <>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">
                      {`${translate('compensation-scheme-in-germany')} *`}
                    </Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <SelectWrapper
                      {...SELECT_PROPS}
                      name="compensationSchemeGermany"
                      className="compensationSchemeGermany-select"
                      dataTa="compensationSchemeGermany"
                    />
                  </Column>
                </>
              )}
              {BELGIUM_GERMANY_COUNTRY_CODES.includes(values.countryId) && (
                <>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">
                      {`${translate('in-belgium-or-germany-withheld-tax')} *`}
                    </Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <CurrencyCell
                      name="inBelgiumOrGermanyWithheldTax"
                      dataTa="inBelgiumOrGermanyWithheldTax"
                    />
                  </Column>
                </>
              )}
            </ColumnLayout>
          </ModalBody>
          <ModalFooter>
            <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
            <Button type="submit" disabled={!isDirty || !isValid} dataTa="abroad-income-save-button">{translate('save')}</Button>
          </ModalFooter>
        </>
      )}
    </Form>
  </AbroadIncomeModalWrapper>
);

AbroadIncomeModal.propTypes = {
  /** object containing own homes data */
  abroadIncomeData: PropTypes.object,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** provides class name for modal */
  className: PropTypes.string,
  /** provides array of objects for countries list except NL */
  countriesExceptNL: PropTypes.array.isRequired,
  /** function to handle submit of own homes form */
  onSubmit: PropTypes.func.isRequired,
};

export default AbroadIncomeModal;

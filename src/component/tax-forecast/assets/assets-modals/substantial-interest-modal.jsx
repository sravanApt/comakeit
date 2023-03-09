import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Form,
  ColumnLayout,
  Column,
  Button,
  Typography,
  ModalBody,
  ModalFooter,
} from '@visionplanner/ui-react-material';
import {
  ModalWrapper,
  SelectWrapper,
  InputWrapper,
} from '../../../../common/styled-wrapper';
import { assetsTranslate as translate } from '../assets-translate';
import { CurrencyCell, NumberCell } from '../../../../common/table-cell-templates';
import {
  SELECT_PROPS,
  INPUT_PROPS,
  formFieldSpans,
  DEFAULT_OWNER_ID,
  BOTH_OWNER_ID,
} from '../assets.constants';
import { getOwners } from '../../income-from-business/common/utils';
import { getGuid } from '../../../../common/utils';
import { REG_EXP_POSITIVE } from '../../tax-forecast.constants';

const validationSchema = Yup.object().shape({
  belongsTo: Yup.string().required(translate('required-field')),
  businessName: Yup.string().required(translate('required-field')),
  acquisitionPrice: Yup.string().matches(REG_EXP_POSITIVE, translate('invalid-entry')).test('price-test', translate('required-field'), function (value) {
    const { businessName } = this.parent;
    return (businessName ? !!value : true);
  }).nullable(),
  numberOfShares: Yup.number().required(translate('required-field')),
});

/**
 * Modal Component - Component that is used to show Substantial Interest popup
 */
const SubstantialInterestModal = ({
  substantialInterestData,
  onCloseModal,
  className,
  owners,
  countries,
  // administrationOptions,
  onSubmit,
}) => (
  <ModalWrapper
    title={translate('substantial-interest')}
    open
    onClose={onCloseModal}
    dataTa="substantial-interest-modal"
    className={className}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={(substantialInterestData?.belongsTo) ? substantialInterestData : { ...substantialInterestData, belongsTo: (owners.length > 2) ? BOTH_OWNER_ID : DEFAULT_OWNER_ID }}
      onSubmit={(formValues) => {
        const formData = formValues.groupingId ? formValues : { ...formValues, groupingId: getGuid() };
        onSubmit(formData);
        onCloseModal();
      }}
      validateFormSchema={validationSchema}
      dataTa="substantial-interest-form"
    >
      {({
        values, errors, setFieldValue, isValid, isDirty,
      }) => (
        <>
          <ModalBody>
            <ColumnLayout>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('belongs-to')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="belongsTo"
                  options={getOwners(owners)}
                  className="belongs-to-select"
                />
              </Column>
              {/* TODO: VPC-36160 will be reverted when administration used for this section
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {translate('administration')}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="globalAdministrationId"
                  options={administrationOptions}
                  className="administration-select"
                  customChangeHandler={(selectedValue) => {
                    const administrationName = administrationOptions.filter((admin) => (admin.value === selectedValue))[0];
                    setFieldValue('businessName', administrationName?.label);
                  }}
                />
              </Column> */}
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('business-name')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  name="businessName"
                  dataTa="business-name"
                  customChangeHandler={(value) => !value && setFieldValue('acquisitionPrice', '')}
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('country')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="countryId"
                  options={countries}
                  className="country-select"
                  customChangeHandler={() => setFieldValue('regularBenefit', '')}
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('no-of-shares')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <NumberCell
                  name="numberOfShares"
                  dataTa="number-of-shares"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('acquisition-price')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="acquisitionPrice"
                  dataTa="acquisition-price"
                  disabled={!values.businessName}
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('regular-benefit')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="regularBenefit"
                  dataTa="regular-benefit"
                  disabled={values.countryId !== 1}
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('deductable-costs')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="deductibleCosts"
                  dataTa="deductable-costs"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('withheld-dividend-tax')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="withHeldDividendTax"
                  dataTa="withheld-dividend-tax"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('transfer-price')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="transferPrice"
                  dataTa="transfer-price"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('deductable-acquisition-price')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="deductibleAcquisitionPrice"
                  dataTa="deductable-acquisition-price"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('income-from-substantial-interest-abroad')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="incomeFromAbroad"
                  dataTa="income-from-substantial-interest-abroad"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('withheld-source-tax')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="withHeldSourceTax"
                  dataTa="withheld-source-tax"
                />
              </Column>
            </ColumnLayout>
          </ModalBody>
          <ModalFooter>
            <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
            <Button type="submit" disabled={!isDirty || !isValid || Object.keys(errors).length !== 0} dataTa="assets-save-button">{translate('save')}</Button>
          </ModalFooter>
        </>
      )}
    </Form>
  </ModalWrapper>
);

SubstantialInterestModal.propTypes = {
  /** object containing own homes data */
  substantialInterestData: PropTypes.object,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** provides class name for modal */
  className: PropTypes.string,
  /** provides array of objects */
  owners: PropTypes.array.isRequired,
  /** provides list of administrations */
  // TODO: VPC-36160 will be reverted when administration used for this section
  // administrationOptions: PropTypes.array.isRequired,
  /** provides array of objects for countries list */
  countries: PropTypes.array.isRequired,
  /** function to handle submit of own homes form */
  onSubmit: PropTypes.func.isRequired,
};

export default SubstantialInterestModal;

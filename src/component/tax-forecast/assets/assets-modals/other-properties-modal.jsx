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
  Tooltip,
} from '@visionplanner/ui-react-material';
import {
  ModalWrapper,
  SelectWrapper,
  InputWrapper,
  TableCellWrapper,
} from '../../../../common/styled-wrapper';
import { assetsTranslate as translate } from '../assets-translate';
import { CurrencyCell, NumberCell } from '../../../../common/table-cell-templates';
import { getOwners } from '../../income-from-business/common/utils';
import {
  RENTED_OR_LEASED_OPTIONS,
  SELECT_PROPS,
  INPUT_PROPS,
  formFieldSpans,
  DEFAULT_OWNER_ID,
  BOTH_OWNER_ID,
} from '../assets.constants';
import { NEW_OTHER_PROPERTIES_DATA } from '../assets-initial-data';
import { defaultYesOrNoOptions } from '../../income/income.constants';
import { REG_EXP_ZIP } from '../../tax-forecast.constants';
import { REG_NUMBER, PERCENTAGE_INPUT_PROPS } from '../../../../common/constants';
import { getGuid } from '../../../../common/utils';

const rentedOutOrLeasedFieldsValidation = Yup.string().test('rented-out-or-leased-fields-test', translate('invalid-entry'), function (value) {
  const { status } = this.parent;
  return (RENTED_OR_LEASED_OPTIONS[1].value === status) ? !!value : true;
}).nullable();
const validationSchema = Yup.object().shape({
  belongsTo: Yup.string().required(translate('required-field')),
  address: Yup.object({
    street: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    houseNumber: Yup.string().max(500, translate('invalid-entry')).matches(REG_NUMBER, translate('invalid-entry')).required(translate('required-field')),
    additionToHouseNumber: Yup.string().max(4, translate('invalid-entry')).nullable(),
    city: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    zipCode: Yup.string().matches(REG_EXP_ZIP, translate('invalid-entry')).required(translate('required-field')),
  }),
  percentageOfOwnership: Yup.number().max(100, translate('invalid-entry')).required(translate('required-field')),
  woz: Yup.number().typeError(translate('required-field')).required(translate('required-field')),
  rentedOutOrLeased: Yup.object({
    percentageOfRental: rentedOutOrLeasedFieldsValidation,
    tenantProtection: rentedOutOrLeasedFieldsValidation,
    annualRent: rentedOutOrLeasedFieldsValidation,
    unprofessionalRent: rentedOutOrLeasedFieldsValidation,
    isPropertyPartOfBiggerBuilding: rentedOutOrLeasedFieldsValidation,
  }),
});

/**
 * Modal Component - Component that is used to show Other Properties popup
 */
const OtherPropertiesModal = ({
  otherPropertiesData,
  onCloseModal,
  className,
  owners,
  countries,
  onSubmit,
}) => (
  <ModalWrapper
    title={translate('other-properties')}
    open
    onClose={onCloseModal}
    dataTa="other-properties-modal"
    className={className}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={(otherPropertiesData?.belongsTo) ? otherPropertiesData : { ...otherPropertiesData, belongsTo: (owners.length > 2) ? BOTH_OWNER_ID : DEFAULT_OWNER_ID }}
      onSubmit={(formValues) => {
        const formData = formValues.id ? formValues : { ...formValues, id: getGuid() };
        onSubmit(formData);
        onCloseModal();
      }}
      validateFormSchema={validationSchema}
      dataTa="other-properties-form"
    >
      {({
        values, errors, setValues, isDirty, isValid,
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
                  className="belongs-to"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('description-label')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan} className="grid-cell__label">
                <TableCellWrapper width="130px">
                  <Tooltip overlay={`${values.address.street} ${values.address.houseNumber || ''} ${values.address.additionToHouseNumber || ''} ${values.address.city}`}>
                    <span>
                      {`${values.address.street} ${values.address.houseNumber || ''} ${values.address.additionToHouseNumber || ''} ${values.address.city}`}
                    </span>
                  </Tooltip>
                </TableCellWrapper>
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('street')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  name="address.street"
                  dataTa="street"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('house-number')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  type="number"
                  name="address.houseNumber"
                  dataTa="house-number"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('addition')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  name="address.additionToHouseNumber"
                  dataTa="addition-to-house-number"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('zip-code')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  name="address.zipCode"
                  dataTa="zip-code"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('city')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <InputWrapper
                  {...INPUT_PROPS}
                  name="address.city"
                  dataTa="city"
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
                  name="address.countryId"
                  options={countries}
                  className="country-select"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('woz-reference-number')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <NumberCell
                  name="wozReferenceNumber"
                  dataTa="woz-reference-number"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('woz')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  name="woz"
                  dataTa="woz"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">
                  {`${translate('percentage-of-ownership')} *`}
                </Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <CurrencyCell
                  {...PERCENTAGE_INPUT_PROPS}
                  name="percentageOfOwnership"
                  prefix="%"
                  dataTa="percentage-of-ownership"
                />
              </Column>
              <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                <Typography use="normal-text">{translate('rent-or-lease')}</Typography>
              </Column>
              <Column span={formFieldSpans.fieldSpan}>
                <SelectWrapper
                  {...SELECT_PROPS}
                  name="rentedOutOrLeased.status"
                  options={RENTED_OR_LEASED_OPTIONS}
                  className="rent-or-lease-select"
                  customChangeHandler={(value) => {
                    setValues({
                      ...values,
                      rentedOutOrLeased: {
                        ...NEW_OTHER_PROPERTIES_DATA.rentedOutOrLeased,
                        status: value,
                      },
                    });
                  }}
                />
              </Column>
              {
                (values.rentedOutOrLeased.status === RENTED_OR_LEASED_OPTIONS[1].value) && (
                  <>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{`${translate('tenant-protection')} *`}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <SelectWrapper
                        {...SELECT_PROPS}
                        name="rentedOutOrLeased.tenantProtection"
                        options={defaultYesOrNoOptions}
                        className="tenant-protection-select"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{`${translate('year-rent')} *`}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        name="rentedOutOrLeased.annualRent"
                        dataTa="annual-rent"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{`${translate('used-to-mark-unusual-business-conditions-for-rent')} *`}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <SelectWrapper
                        {...SELECT_PROPS}
                        name="rentedOutOrLeased.unprofessionalRent"
                        options={defaultYesOrNoOptions}
                        className="unusual-conditions-rent-select"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{`${translate('used-to-declare-if-the-property-is-part-of-bigger-building')} *`}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <SelectWrapper
                        {...SELECT_PROPS}
                        name="rentedOutOrLeased.isPropertyPartOfBiggerBuilding"
                        options={defaultYesOrNoOptions}
                        className="property-is-a-part-select"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">
                        {`${translate('percentage-of-rental')} *`}
                      </Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        {...PERCENTAGE_INPUT_PROPS}
                        name="rentedOutOrLeased.percentageOfRental"
                        prefix="%"
                        dataTa="percentage-of-rental"
                      />
                    </Column>
                  </>
                )
              }
              {
                (values.rentedOutOrLeased.status === RENTED_OR_LEASED_OPTIONS[2].value) && (
                  <>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('lease-agreement-for-more-then-12-years')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <SelectWrapper
                        {...SELECT_PROPS}
                        name="rentedOutOrLeased.isLeaseAgreementForMoreThenTwelveYears"
                        options={defaultYesOrNoOptions}
                        className="lease-agreement-select"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('year-lease')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        name="rentedOutOrLeased.yearLease"
                        dataTa="year-lease"
                      />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('used-to-mark-unusual-business-conditions-for-lease')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <SelectWrapper
                        {...SELECT_PROPS}
                        name="rentedOutOrLeased.isUnusualBusinessConditionsForLease"
                        options={defaultYesOrNoOptions}
                        className="unusual-conditions-lease-select"
                      />
                    </Column>
                  </>
                )
              }
              {/* TODO: will revert after get confirmation from PO
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('monumental-reference-number')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <NumberCell
                    name="monumentalReferenceNumber"
                    dataTa="monumental-reference-number"
                  />
                </Column>
              */}
              {/* {values.monumentalReferenceNumber && (
                <>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">{translate('expenses-paid')}</Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <CurrencyCell
                      name="expensesPaid"
                      dataTa="expenses-paid"
                    />
                  </Column>
                  <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                    <Typography use="normal-text">{translate('received-subsidy')}</Typography>
                  </Column>
                  <Column span={formFieldSpans.fieldSpan}>
                    <CurrencyCell
                      name="subsidyReceived"
                      dataTa="received-subsidy"
                    />
                  </Column>
                </>
              )} */}
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

OtherPropertiesModal.propTypes = {
  /** object containing other properties data */
  otherPropertiesData: PropTypes.object,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** provides class name for modal */
  className: PropTypes.string,
  /** provides array of objects */
  owners: PropTypes.array.isRequired,
  /** provides array of objects for countries list */
  countries: PropTypes.array.isRequired,
  /** function to handle submit of other properties form */
  onSubmit: PropTypes.func.isRequired,
};

export default OtherPropertiesModal;

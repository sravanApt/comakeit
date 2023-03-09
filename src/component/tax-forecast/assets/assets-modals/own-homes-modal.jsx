import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Form,
  ColumnLayout,
  Column,
  ColumnInner,
  Button,
  Typography,
  ModalBody,
  ModalFooter,
  Tooltip,
} from '@visionplanner/ui-react-material';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import {
  ModalWrapper,
  TableCellWrapper,
  SelectWrapper,
  DateInputWrapper,
  IconWrapper,
  InputWrapper,
} from '../../../../common/styled-wrapper';
import { assetsTranslate as translate } from '../assets-translate';
import { CurrencyCell, NumberCell } from '../../../../common/table-cell-templates';
import {
  getTotalValue,
  convertCurrency,
  enableDatesForSingleYear,
  cleanDeep,
  getStartDateObjectWithYearAndMonth,
  getEndDateObjectWithYearAndMonth,
  formatMasterData,
} from '../../../../common/utils';
import { getOwners } from '../../income-from-business/common/utils';
import { REG_EXP_ZIP } from '../../tax-forecast.constants';
import { REG_NUMBER, PERCENTAGE_INPUT_PROPS } from '../../../../common/constants';
import {
  SELECT_PROPS,
  INPUT_PROPS,
  formFieldSpans,
  DEFAULT_OWNER_ID,
  BOTH_OWNER_ID,
} from '../assets.constants';
import { getVacancyOptions } from '../assets-requests';

const dateProps = {
  placeholder: translate('date'),
  type: 'date',
  width: '130px',
  showSelectOptions: true,
  isDateReadOnly: true,
  showClearDate: true,
  minDate: getStartDateObjectWithYearAndMonth(),
  maxDate: getEndDateObjectWithYearAndMonth(),
  withPortal: true,
};

const subModalTranslationKeys = {
  purchaseCosts: 'purchase-costs',
  sellingCosts: 'selling-costs',
  rentalIncome: 'rental-income',
  costOfRental: 'costs-of-rental',
};

const validationSchema = Yup.object().shape({
  belongsTo: Yup.string().required(translate('required-field')),
  address: Yup.object({
    street: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    houseNumber: Yup.string().max(500, translate('invalid-entry')).matches(REG_NUMBER, translate('invalid-entry')).required(translate('required-field')),
    additionToHouseNumber: Yup.string().max(4, translate('invalid-entry')).nullable(),
    city: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    zipCode: Yup.string().matches(REG_EXP_ZIP, translate('invalid-entry')).required(translate('required-field')),
  }),
  percentageOfOwnership: Yup.string().required(translate('required-field')).nullable(),
  woz: Yup.number().typeError(translate('required-field')).required(translate('required-field')),
  startDate: Yup.string().required(translate('required-field')).nullable(),
  endDate: Yup.string().required(translate('required-field')).test('date-test', translate('invalid-entry'), function (value) {
    const { startDate } = this.parent;
    if (!startDate && value) {
      return false;
    }
    return value ? (new Date(value)).getTime() > (new Date(startDate)).getTime() : true;
  }).nullable(),
  vacancyId: Yup.string().required(translate('required-field')),
  dateOfSelling: Yup.string().test('date-test-2', translate('invalid-entry'), function (value) {
    const { dateOfPurchase } = this.parent;
    return value && dateOfPurchase ? (new Date(value)).getTime() > (new Date(dateOfPurchase)).getTime() : true;
  }).nullable(),
  // TODO: hided this field based on the task VPC-44430
  // purchaseprice: Yup.string().test('purchase-price-test', translate('required-field'), function (value) {
  //   const { dateOfPurchase } = this.parent;
  //   return (dateOfPurchase ? (value === '0' || !!Number(value)) : true);
  // }).nullable(),
  // sellingPrice: Yup.string().test('selling-price-test', translate('required-field'), function (value) {
  //   const { dateOfSelling } = this.parent;
  //   return (dateOfSelling ? (value === '0' || !!Number(value)) : true);
  // }).nullable(),
});

/**
 * Modal Component - Component that is used to show Own Homes Main popup
 */
const OwnHomesModal = ({
  ownHomesData,
  onCloseModal,
  className,
  owners,
  countries,
  onSubmit,
  taxableYear,
}) => {
  const { showModal } = useModal();
  const [vacancyOptions, setVacancyOptions] = useState([]);

  const fetchVacancyOptions = async () => {
    const { content } = await getVacancyOptions();
    setVacancyOptions(formatMasterData(content));
  };

  useEffect(() => {
    fetchVacancyOptions();
  }, []);

  const showSubModal = (subModalKey, setValues, ownHomeValues) => {
    showModal('add-assets-own-homes-cost-modal',
      {
        subModalKey,
        ownHomeValues,
        title: `${translate('edit')} ${translate(subModalTranslationKeys[subModalKey])}`,
        name: subModalKey,
        handleSubModalChanges,
        setValues,
        dataTa: `${subModalKey}-modal`,
      });
  };

  const handleSubModalChanges = (subModalKey, subModalValues, setValues, ownHomeValues) => {
    setValues({
      ...ownHomeValues,
      [subModalKey]: [...subModalValues[subModalKey]],
    });
  };

  return (
    <ModalWrapper
      title={translate('own-home')}
      open
      onClose={onCloseModal}
      dataTa="own-home-modal"
      className={className}
      preventDismissalOnOutsideClick
    >
      <Form
        initialValues={(ownHomesData?.belongsTo) ? ownHomesData : { ...ownHomesData, belongsTo: (owners.length > 2) ? BOTH_OWNER_ID : DEFAULT_OWNER_ID }}
        onSubmit={(formValues) => {
          onSubmit(formValues);
          onCloseModal();
        }}
        validateFormSchema={validationSchema}
        dataTa="own-home-form"
      >
        {({
          values, setValues, errors, isValid, isDirty,
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
                  <Tooltip
                    placement="right"
                    overlay={`${values.address.street} ${values.address.houseNumber || ''} ${values.address.additionToHouseNumber || ''} ${values.address.city}`}
                  >
                    <TableCellWrapper width="130px">
                      {`${values.address.street} ${values.address.houseNumber || ''} ${values.address.additionToHouseNumber || ''} ${values.address.city}`}
                    </TableCellWrapper>
                  </Tooltip>
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
                  <Typography use="normal-text">{`${translate('start-date')} *`}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <ColumnInner>
                    <Column span={5}>
                      <DateInputWrapper
                        {...dateProps}
                        name="startDate"
                        className="start-date"
                        dataTa="startDate"
                        displayFormat="DD-MM"
                        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
                      />
                    </Column>
                  </ColumnInner>
                </Column>
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{`${translate('end-date')} *`}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <ColumnInner>
                    <Column span={5}>
                      <DateInputWrapper
                        {...dateProps}
                        name="endDate"
                        dataTa="endDate"
                        className="end-date"
                        displayFormat="DD-MM"
                        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
                      />
                    </Column>
                  </ColumnInner>
                </Column>
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">
                    {translate('vacancy-situation')}
                  </Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <SelectWrapper
                    {...SELECT_PROPS}
                    name="vacancyId"
                    options={vacancyOptions}
                    className="vacancy-select"
                  />
                </Column>
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('purchase-date')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <ColumnInner>
                    <Column span={5}>
                      <DateInputWrapper
                        {...dateProps}
                        name="dateOfPurchase"
                        className="date-of-purchase"
                        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
                        customChangeHandler={(value) => {
                          if (!value) {
                            setValues({
                              ...values,
                              dateOfPurchase: null,
                              purchaseprice: null,
                              purchaseCosts: null,
                            });
                          }
                        }}
                      />
                    </Column>
                  </ColumnInner>
                </Column>
                {values.dateOfPurchase && (
                  <>
                    {/* TODO: hided this field based on the task VPC-44430  */}
                    {/* <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('purchase-price')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        name="purchaseprice"
                        dataTa="purchase-price"
                      />
                    </Column> */}
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('purchase-costs')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan} align="middle">
                      <Typography use="normal-text" className="mar-r-sm">
                        {convertCurrency({ value: getTotalValue(values.purchaseCosts, 'amount') })}
                      </Typography>
                      <IconWrapper icon="pen" dataTa="edit-purchase-costs" iconSet={(cleanDeep(values.purchaseCosts).length > 0) ? 'fas' : 'far'} className="icon__edit edit" onClick={() => showSubModal('purchaseCosts', setValues, values)} />
                    </Column>
                  </>
                )}
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('date-of-sale')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <ColumnInner>
                    <Column span={5}>
                      <DateInputWrapper
                        {...dateProps}
                        name="dateOfSelling"
                        className="date-of-selling"
                        isOutsideRange={(day) => enableDatesForSingleYear(day, taxableYear)}
                        customChangeHandler={(value) => {
                          if (!value) {
                            setValues({
                              ...values,
                              dateOfSelling: null,
                              sellingPrice: null,
                              sellingCosts: null,
                              homeLoanLiability: null,
                            });
                          }
                        }}
                      />
                    </Column>
                  </ColumnInner>
                </Column>
                {values.dateOfSelling && (
                  <>
                    {/* TODO: hided this field based on the task VPC-44430  */}
                    {/* <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('selling-price')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        name="sellingPrice"
                        dataTa="selling-price"
                      />
                    </Column> */}
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('selling-costs')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan} align="middle">
                      <Typography use="normal-text" className="mar-r-sm">
                        {convertCurrency({ value: getTotalValue(values.sellingCosts, 'amount') })}
                      </Typography>
                      <IconWrapper icon="pen" dataTa="edit-selling-costs" iconSet={(cleanDeep(values.sellingCosts).length > 0) ? 'fas' : 'far'} className="icon__edit edit" onClick={() => showSubModal('sellingCosts', setValues, values)} />
                    </Column>
                    <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                      <Typography use="normal-text">{translate('loan-for-sold-home')}</Typography>
                    </Column>
                    <Column span={formFieldSpans.fieldSpan}>
                      <CurrencyCell
                        name="homeLoanLiability"
                        dataTa="home-loan-liability"
                      />
                    </Column>
                  </>
                )}
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('paid-ground-rent')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <CurrencyCell
                    name="paidGroundRent"
                    dataTa="paid-ground-rent"
                  />
                </Column>
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
                        name="receivedSubsidy"
                        dataTa="received-subsidy"
                      />
                    </Column>
                  </>
                )} */}
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('rental-income')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan} align="middle">
                  <Typography use="normal-text" className="rental-income mar-r-sm">
                    {convertCurrency({ value: getTotalValue(values.rentalIncome, 'amount') })}
                  </Typography>
                  <IconWrapper icon="pen" dataTa="edit-rental-income" iconSet={(cleanDeep(values.rentalIncome).length > 0) ? 'fas' : 'far'} className="icon__edit edit" onClick={() => showSubModal('rentalIncome', setValues, values)} />
                </Column>
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('costs-of-rental')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan} align="middle">
                  <Typography use="normal-text" className="mar-r-sm">
                    {convertCurrency({ value: getTotalValue(values.costOfRental, 'amount') })}
                  </Typography>
                  <IconWrapper icon="pen" dataTa="edit-cost-of-rental" iconSet={(cleanDeep(values.costOfRental).length > 0) ? 'fas' : 'far'} className="icon__edit edit" onClick={() => showSubModal('costOfRental', setValues, values)} />
                </Column>
                <Column span={formFieldSpans.labelSpan} className="grid-cell__label grid-cell__label--right">
                  <Typography use="normal-text">{translate('taxable-part-of-capital-insurance')}</Typography>
                </Column>
                <Column span={formFieldSpans.fieldSpan}>
                  <CurrencyCell
                    name="taxableCapitalInsurance"
                    dataTa="taxable-capital-insurance"
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
};

OwnHomesModal.propTypes = {
  /** object containing own homes data */
  ownHomesData: PropTypes.object,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** provides class name for modal */
  className: PropTypes.string,
  /** provides array of objects */
  owners: PropTypes.array.isRequired,
  /** provides array of objects for countries list */
  countries: PropTypes.array.isRequired,
  /** function to handle submit of own homes form */
  onSubmit: PropTypes.func.isRequired,
};

export default OwnHomesModal;

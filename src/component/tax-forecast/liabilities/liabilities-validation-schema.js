import * as Yup from 'yup';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import { REG_EXP_BSN_NUMBER, REG_NUMBER, REG_EXP_TITLE } from '../../../common/constants';
import { REG_EXP_ZIP } from '../tax-forecast.constants';

export const validateEndDate = (startDate, value) => {
  if (!startDate && value) {
    return false;
  }
  return value ? (new Date(value)).getTime() > (new Date(startDate)).getTime() : true;
};

export const getOwnHomeModalSchema = (isOwnHomeSection) => Yup.object().shape({
  loanDetails: Yup.object().shape({
    description: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    belongsTo: Yup.string().required(translate('required-field')),
    accountNumber: Yup.string().required(translate('required-field')).nullable(),
    countryId: Yup.string().required(translate('required-field')),
    percentageOfAmount: Yup.string().required(translate('required-field')).nullable(),
    ...(isOwnHomeSection ? {
      loanGiver: Yup.string().required(translate('required-field')).nullable(),
    } : {
      employeeCredit: Yup.string().test('amount-test', translate('required-field'), (value) => (value !== '0' ? Number(value) : true)).nullable(),
    }),
    loanPurpose: Yup.string().required(translate('required-field')),
    principalAmount: Yup.string().test('amount-test', translate('required-field'), (value) => (value !== '0' ? Number(value) : true)).nullable(),
    interest: Yup.string().test('amount-test', translate('required-field'), (value) => (value !== '0' ? Number(value) : true)).nullable(),
  }).nullable(),
  costs: Yup
    .array()
    .of(Yup.object().shape({
      amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
        const { description } = this.parent;
        return description && value !== '0' ? Number(value) : true;
      }).nullable(),
      description: Yup.string().max(500, translate('invalid-entry')).test('description-test', translate('required-field'), function (value) {
        const { amount } = this.parent;
        return !(Number(amount) && !value);
      }).nullable(),
    })),
  ...(isOwnHomeSection ? {
    loanGiverDetails: Yup.object({
      bsn: Yup.string().matches(REG_EXP_BSN_NUMBER, translate('invalid-entry')).required(translate('required-field')).nullable(),
      initials: Yup.string().matches(REG_EXP_TITLE, translate('invalid-entry')).required(translate('required-field')).nullable(),
      lastName: Yup.string().required(translate('required-field')).nullable(),
      dateOfBirth: Yup.string().required(translate('required-field')).nullable(),
      startDate: Yup.string().required(translate('required-field')).nullable(),
      endDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
        const { startDate } = this.parent;
        return validateEndDate(startDate, value);
      }).required(translate('required-field')).nullable(),
      originalPrincipalAmount: Yup.number().required(translate('required-field')).nullable(),
      interestRate: Yup.string().required(translate('required-field')).nullable(),
      payBackMethod: Yup.string().required(translate('required-field')).nullable(),
      address: Yup.object({
        street: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')).nullable(),
        houseNumber: Yup.string().max(500, translate('invalid-entry')).matches(REG_NUMBER, translate('invalid-entry')).required(translate('required-field'))
          .nullable(),
        additionToHouseNumber: Yup.string().max(4, translate('invalid-entry')).nullable(),
        city: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')).nullable(),
        zipCode: Yup.string().matches(REG_EXP_ZIP, translate('invalid-entry')).required(translate('required-field')).nullable(),
      }).nullable(),
    }).nullable(),
  } : {}),
});

export const liabilityValidationSchema = Yup.object().shape({
  jointLiabilities: Yup.object({
    otherLoans: Yup
      .array()
      .of(Yup.object().shape({
        description: Yup.string().when('amount', {
          is: (amount) => !!Number(amount),
          then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
          otherwise: Yup.string().max(500, translate('invalid-entry')),
        }).nullable(),
        accountNumber: Yup.string().test('account-number-test', translate('required-field'), function (value) {
          const { description } = this.parent;
          return (description ? !!value : true);
        }).nullable(),
        principalAmount: Yup.string().test('amount-test', translate('required-field'), function (value) {
          const { description } = this.parent;
          return (description ? (value === '0' || !!Number(value)) : true);
        }).nullable(),
      })).nullable(),
  }).nullable(),
}).nullable();

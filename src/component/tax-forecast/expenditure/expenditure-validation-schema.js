import * as Yup from 'yup';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  ALAPHA_NUMERIC_NO_SPACE_REGEX, RSIN_REGEX, NUMBER_REGEX,
} from '../tax-forecast.constants';

const amountAllowZeroValidation = Yup.string().test('amount-test', translate('required-field'), function (value) {
  const { description } = this.parent;
  return (description ? (value === '0' || !!Number(value)) : true);
}).nullable();

const amountDescriptionPolicySchema = Yup.object().shape({
  description: Yup.string().when(['amount', 'policyNumber'], {
    is: (amount, policyNumber) => !!(Number(amount) || policyNumber),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  amount: amountAllowZeroValidation,
  policyNumber: Yup.string().max(500, translate('invalid-entry')).when('description', {
    is: (description) => !!description,
    then: Yup.string().matches(ALAPHA_NUMERIC_NO_SPACE_REGEX, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().matches(ALAPHA_NUMERIC_NO_SPACE_REGEX, translate('invalid-entry')).nullable(),
  }).nullable(),
}, [['description', 'policyNumber']]);

export const validateEndDate = (startDate, value) => {
  if (!startDate && value) {
    return false;
  }
  return value ? (new Date(value)).getTime() > (new Date(startDate)).getTime() : true;
};
const subjectOrPartnerSchema = Yup.object({

  expensesForPublicTransportation: Yup.object({
    travelDeliveryDetails: Yup.array()
      .of(Yup.object()
        .shape({
          description: Yup.string().when(['compensation', 'singleTripDistance', 'daysInAWeek', 'startDate', 'endDate'], {
            is: (compensation, singleTripDistance, daysInAWeek, startDate, endDate) => !!(Number(compensation) || singleTripDistance || daysInAWeek || startDate || endDate),
            then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
            otherwise: Yup.string().max(500, translate('invalid-entry')),
          }).nullable(),
          singleTripDistance: Yup.number().when('description', {
            is: (description) => !!description,
            then: Yup.number().min(0, translate('invalid-entry')).max(999, translate('invalid-entry')).required(translate('required-field')),
          }).nullable(),
          daysInAWeek: Yup.number().when('description', {
            is: (description) => !!description,
            then: Yup.number().min(1, translate('invalid-entry')).max(7, translate('invalid-entry')).required(translate('required-field')),
          }).nullable(),
          startDate: Yup.string().when('description', {
            is: (description) => !!description,
            then: Yup.string().required(translate('required-field')),
          }).nullable(),
          endDate: Yup.string().when('description', {
            is: (description) => !!description,
            then: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
              const { startDate } = this.parent;
              return validateEndDate(startDate, value);
            }).required(translate('required-field')),
          }).nullable(),
        }, [['description', 'singleTripDistance'], ['description', 'daysInAWeek'], ['description', 'startDate'], ['description', 'endDate']]))
      .nullable(),
  }).nullable(),
  premiumForAnnuity: Yup.object({
    premiumsPaidDetails: Yup.object({
      premiumDetails: Yup.array()
        .of(amountDescriptionPolicySchema).nullable(),
    }),
  }).nullable(),
  premiumForDisabilityInsurance: Yup.object({
    premiumDetails: Yup.array()
      .of(amountDescriptionPolicySchema)
      .nullable(),
  }).nullable(),
  premiumForGeneralSurvivorsLaw: Yup.object({
    premiumDetails: Yup.array()
      .of(amountDescriptionPolicySchema)
      .nullable(),
  }).nullable(),
  premiumForAnnuityOfChild: Yup.object({
    premiumDetails: Yup.array()
      .of(amountDescriptionPolicySchema)
      .nullable(),
  }).nullable(),
});

const giftsToCharitySchema = {
  culturalANBI: Yup.string().when('description', {
    is: (description) => !!description,
    then: Yup.string().required(translate('required-field')),
  }).nullable(),
  description: Yup.string().when('amount', {
    is: (amount) => !!Number(amount),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  amount: amountAllowZeroValidation,
};

export const generalGiftsSchema = () => Yup.object().shape({
  ...giftsToCharitySchema,
});

export const amountDescriptionSchema = () => Yup.object().shape({
  description: Yup.string().when('amount', {
    is: (amount) => !!Number(amount),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
    const { description } = this.parent;
    return (description ? !!Number(value) : true);
  }).nullable(),
});

const jointSectionSchema = Yup.object({
  giftsToCharity: Yup.object({
    generalGiftsToCharity: Yup.array()
      .of(generalGiftsSchema()).nullable(),
    periodicGiftsToCharity: Yup.array()
      .of(Yup.object()
        .shape({
          ...giftsToCharitySchema,
          description: Yup.string().when(['amount', 'rsin', 'transactionNumber'], {
            is: (amount, rsin, transactionNumber) => !!(Number(amount) || rsin || transactionNumber),
            then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
            otherwise: Yup.string().max(500, translate('invalid-entry')),
          }).nullable(),
          rsin: Yup.string().when('description', {
            is: (description) => !!description,
            then: Yup.string().matches(RSIN_REGEX, translate('invalid-entry')).required(translate('required-field')),
          }).nullable(),
          transactionNumber: Yup.string().when('description', {
            is: (description) => !!description,
            then: Yup.string().matches(NUMBER_REGEX, translate('invalid-entry')).required(translate('required-field')),
          }).nullable(),
        }, [['description', 'transactionNumber'], ['description', 'rsin']])).nullable(),
  }).nullable(),
  weekendExpensesForChildrenWithDisabilities: Yup.object({
    weekendExpensesOfDisabledChildrens: Yup.array()
      .of(Yup.object()
        .shape({
          name: Yup.string().when(['compensation', 'dateOfBirth', 'daysOfCare', 'daysTraveled', 'distanceOfTrip'], {
            is: (compensation, dateOfBirth, daysOfCare, daysTraveled, distanceOfTrip) => !!(Number(compensation) || dateOfBirth || daysOfCare || daysTraveled || distanceOfTrip),
            then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
            otherwise: Yup.string().max(500, translate('invalid-entry')),
          }).nullable(),
          dateOfBirth: Yup.string().when('name', {
            is: (name) => !!name,
            then: Yup.string().required(translate('required-field')),
          }).nullable(),
          daysOfCare: Yup.string().when('name', {
            is: (name) => !!name,
            then: Yup.string().required(translate('required-field')),
          }).nullable(),
          daysTraveled: Yup.string().when('name', {
            is: (name) => !!name,
            then: Yup.string().required(translate('required-field')),
          }).nullable(),
          distanceOfTrip: Yup.string().when('name', {
            is: (name) => !!name,
            then: Yup.string().required(translate('required-field')),
          }).nullable(),
        }, [['name', 'dateOfBirth'], ['name', 'daysOfCare'], ['name', 'daysTraveled'], ['name', 'distanceOfTrip']])).nullable(),
  }).nullable(),
  waivedVentureCapital: Yup.object({
    waivedVentureCapitalDetails: Yup.array()
      .of(Yup.object()
        .shape({
          description: Yup.string().when(['alreadyWavedAmount', 'amountWaivedThisYear'], {
            is: (alreadyWavedAmount, amountWaivedThisYear) => !!Number(alreadyWavedAmount) || !!Number(amountWaivedThisYear),
            then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
            otherwise: Yup.string().max(500, translate('invalid-entry')),
          }).nullable(),
          alreadyWavedAmount: amountAllowZeroValidation,
          amountWaivedThisYear: amountAllowZeroValidation,

        })).nullable(),
  }).nullable(),
});

export const expenditureFormValidationSchema = Yup.object().shape({
  taxableSubjectExpenditureDetails: subjectOrPartnerSchema,
  fiscalPartnerExpendituresDetails: subjectOrPartnerSchema,
  jointExpendituresDetails: jointSectionSchema,
});

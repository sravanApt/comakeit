import * as Yup from 'yup';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

const eifValidation = /^([E]{1}\d{9})$/g;
const mifValidation = /^([M]{1}\d{9})$/g;

/**
 * validation schema of other items section
 *
 */

const commonValidationSchema = Yup
  .array()
  .of(Yup.object().shape({
    description: Yup.string().when(['amount', 'base'], {
      is: (amount, base) => (amount && !!Number(amount)) || (base && !!Number(base)),
      then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
      otherwise: Yup.string().max(500, translate('invalid-entry')),
    }).nullable(),
    amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
      const { description } = this.parent;
      return (description && value !== undefined && value !== '0') ? Number(value) : true;
    }).nullable(),
    base: Yup.string().test('base-amount-test', translate('required-field'), function (value) {
      const { description } = this.parent;
      return (description && value !== undefined && value !== '' && value !== null) ? (Number(value) > 0) : true;
    }).nullable(),
    percentageKIA: Yup.number().min(0.01, translate('invalid-entry')).max(100, translate('invalid-entry')).nullable(),
  })).nullable();

/** It is common validation for all sections in other items */
export const validationSchema = (sectionKey) => {
  switch (sectionKey) {
    case 'investmentDeduction':
      return Yup.object({
        correctionData: Yup.object({
          investmentDeductions: Yup
            .array()
            .of(Yup.object().shape({
              description: Yup.string().when('amountPaid', {
                is: (amountPaid) => amountPaid && !!Number(amountPaid),
                then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
                otherwise: Yup.string().max(500, translate('invalid-entry')),
              }).nullable(),
              share: Yup.string().test('share-test', translate('invalid-entry'), function (value) {
                const { description } = this.parent;
                return (description && value !== undefined && value !== '' && value !== null) ? (Number(value) > 0) : true;
              }).nullable(),
              amountKIA: Yup.string().test('amount-kia-test', translate('invalid-entry'), function (value) {
                const { description } = this.parent;
                return (description && value !== undefined && value !== '' && value !== null) ? (Number(value) > 0) : true;
              }).nullable(),
              amountEIA: Yup.string().test('amount-eia-test', translate('invalid-entry'), function (value) {
                const { description } = this.parent;
                return (description && value !== undefined && value !== '' && value !== null) ? (Number(value) > 0) : true;
              }).nullable(),
              amountMIA: Yup.string().test('amount-mia-test', translate('invalid-entry'), function (value) {
                const { description } = this.parent;
                return (description && value !== undefined && value !== '' && value !== null) ? (Number(value) > 0) : true;
              }).nullable(),
              eiaReferenceNumber: Yup.string().test('eiaReferenceNumber-test', translate('invalid-entry'), (value) => (value ? value.match(eifValidation) : true)).nullable(),
              miaReferenceNumber: Yup.string().test('miaReferenceNumber-test', translate('invalid-entry'), (value) => (value ? value.match(mifValidation) : true)).nullable(),
            })).nullable(),
          remainderInvestmentDeduction: Yup
            .array()
            .of(Yup.object().shape({
              description: Yup.string().when('amount', {
                is: (amount) => !!Number(amount),
                then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
                otherwise: Yup.string().max(500, translate('invalid-entry')),
              }).nullable(),
              amount: Yup.string().test('amount-test', translate('required-field'), function (value) {
                const { description } = this.parent;
                return (description && value !== undefined && value !== '0') ? Number(value) : true;
              }).test('amoun  t-negative-test', translate('invalid-entry'), (value) => (value !== undefined) && (Number(value) > -1)).nullable(),
            })).nullable(),
        }).nullable(),
      });
    case 'equalizationReserve':
    case 'reinvestmentReserve':
      return Yup.object({
        correctionData: reserveValidation,
      });
    default:
      return Yup.object({
        correctionData: commonValidationSchema,
      });
  }
};

const reserveValidation = Yup.array()
  .of(Yup.object().shape({
    description: Yup.string().when(['opening', 'allocation', 'release'], {
      is: (opening, allocation, release) => (opening && !!Number(opening)) || (allocation && !!Number(allocation)) || (release && !!Number(release)),
      then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
      otherwise: Yup.string().max(500, translate('invalid-entry')),
    }).nullable(),
  })).nullable();

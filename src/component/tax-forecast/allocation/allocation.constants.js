import deepFreeze from 'deep-freeze';
import * as Yup from 'yup';
import { allocationTranslate as translate } from './allocation-translate';

export const ALLOCATION_FIELD_NAME = 'allocationDetails';

const taxableSubjectAmountValidation = Yup.string().test('taxableSubjectAmount', 'error message', function (value) {
  const { totalAmount } = this.parent;
  if (value && (Number(totalAmount) >= 0) && ((Number(value) < 0) || (Number(value) > Number(totalAmount)))) {
    return this.createError({
      message: `${translate('required-amount-positive-1')} ${totalAmount || 0} ${translate('required-amount-positive-2')}`,
    });
  }
  if (value && (Number(totalAmount) < 0) && ((Number(value) > 0) || (Number(value) < Number(totalAmount)))) {
    return this.createError({
      message: `${translate('required-amount-negative-1')} ${totalAmount || 0} ${translate('required-amount-negative-2')}`,
    });
  }
  return true;
}).nullable();

export const ALLOCATION_VALIDATION_SCHEMA = Yup.object().shape({
  ownHomeDeduction: Yup.object({
    taxableSubjectAmount: taxableSubjectAmountValidation,
  }).nullable(),
  substantialInterest: Yup.object({
    taxableSubjectAmount: taxableSubjectAmountValidation,
  }).nullable(),
  box3TaxableBase: Yup.object({
    taxableSubjectAmount: taxableSubjectAmountValidation,
  }).nullable(),
  personalDeduction: Yup.object({
    taxableSubjectAmount: taxableSubjectAmountValidation,
  }).nullable(),
  dividendTax: Yup.object({
    taxableSubjectAmount: taxableSubjectAmountValidation,
  }).nullable(),
}).nullable();

export const INITIAL_ALLOCATION_DATA = deepFreeze({
  recommendedAllocation: true,
  ownHomeDeduction: {
    taxableSubjectAmount: 0,
    fiscalPartnerAmount: 0,
    totalAmount: 0,
  },
  substantialInterest: {
    taxableSubjectAmount: 0,
    fiscalPartnerAmount: 0,
    totalAmount: 0,
  },
  box3TaxableBase: {
    taxableSubjectAmount: 0,
    fiscalPartnerAmount: 0,
    totalAmount: 0,
  },
  personalDeduction: {
    taxableSubjectAmount: 0,
    fiscalPartnerAmount: 0,
    totalAmount: 0,
  },
  dividendTax: {
    taxableSubjectAmount: 0,
    fiscalPartnerAmount: 0,
    totalAmount: 0,
  },
});
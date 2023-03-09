import * as Yup from 'yup';
import { personalDetailsTranslate as translate } from './personal-details-translate';
import { MARITAL_STATUS_VALUES, TAX_FORM_TYPE_VALUES } from './personal-details.constants';
import { validateBsnNumber } from '../../../common/utils';
import { REG_EXP_ZIP } from '../tax-forecast.constants';

Yup.addMethod(Yup.mixed, 'defined', function (errorMsg) {
  return this.test('defined', errorMsg, (value) => value !== '');
});

const getChildrenValidationSchema = (subjectBsn, partnerBsn) => Yup.array().of(Yup.object().shape({
  name: Yup.string().test('name-required-test', translate('required-field'), (value) => !!value).nullable(),
  parentCollectingChildCare: Yup.string().test('childcare-required-test', translate('required-field'), (value) => !!value).nullable(),
  registrationOnAddress: Yup.string().test('registration-required-test', translate('required-field'), (value) => !!Number(value)).nullable(),
  bsn: Yup.string().test('bsn number', translate('invalid-entry'), (value) => (value ? (subjectBsn !== value && partnerBsn !== value && validateBsnNumber(value)) : true))
    .test('bsn-required-test', translate('required-field'), (value) => !!value).nullable(),
  dateOfBirth: Yup.string().test('dateOfBirth-test', translate('invalid-entry'), function (value) {
    const { dateOfDeath } = this.parent;
    return ((!!value && dateOfDeath) ? ((new Date(value)).getTime() < (new Date(dateOfDeath)).getTime()) : true);
  }).test('dob-required-test', translate('required-field'), (value) => !!value).nullable(),
  dateOfDeath: Yup.date().test('dateOfDeath-test', translate('invalid-entry'), function (value) {
    const { dateOfBirth } = this.parent;
    return ((!!value && dateOfBirth) ? ((new Date(value)).getTime() > (new Date(dateOfBirth)).getTime()) : true);
  }).nullable(),
})).nullable();

const personalDetailsValidationSchema = (taxableYear) => Yup.object({
  deathDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
    const { birthDate } = this.parent;
    return value ? ((new Date(value)).getTime() > (new Date(birthDate)).getTime()) && (new Date(value)).getFullYear() >= taxableYear : true;
  }).nullable(),
  taxationFormID: Yup.number().test('taxation-form-id-test', translate('required-field'), function (value) {
    const { deathDate } = this.parent;
    if (deathDate) return value === TAX_FORM_TYPE_VALUES.F_FORM;
    return (value === 0 ? true : !!value);
  }).nullable(),
}).nullable();

const getRepresentativeValidationSchema = (subjectBsn, partnerBsn, children) => Yup.object().shape({
  person: Yup.object({
    firstName: Yup.string().required(translate('required-field')),
    initials: Yup.string().required(translate('required-field')),
    lastName: Yup.string().required(translate('required-field')),
    bsn: Yup.string().test('bsn number', translate('invalid-entry'), (value) => (value ? (subjectBsn !== value && partnerBsn !== value && validateRepresentativeBsn(value, children) && validateBsnNumber(value)) : true))
      .test('required-test', translate('required-field'), (value) => !!value),
    dateOfBirth: Yup.string().required(translate('required-field')),
  }),
  address: Yup.object({
    street: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    houseNumber: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    additionToHouseNumber: Yup.string().max(4, translate('invalid-entry')).nullable(),
    city: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    zipCode: Yup.string().matches(REG_EXP_ZIP, translate('invalid-entry')).required(translate('required-field')),
  }),
}).nullable();
const situationChangedValidationSchema = (taxableYear) => Yup.object().when(['taxableSubjectDetails'], {
  is: (taxableSubjectDetails) => taxableSubjectDetails.maritalStatus === MARITAL_STATUS_VALUES.SITUATION_CHANGED_DURING_YEAR,
  then: Yup.object({
    divorceDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
      const { marriageDate } = this.parent;
      if (!marriageDate && value) {
        return false;
      }
      return value ? ((new Date(value)).getTime() > (new Date(marriageDate)).getTime()) && (new Date(value)).getFullYear() <= taxableYear : true;
    }).nullable(),
    marriageDate: Yup.string().test('date-test', translate('invalid-entry'), (value) => (value ? ((new Date(value)).getFullYear() <= taxableYear) : true)).nullable(),
    periodOfLivingTogether: Yup.object({
      endDate: Yup.string().required(translate('required-field')).test('date-test', translate('invalid-entry'), function (value) {
        const { startDate } = this.parent;
        if (!startDate && value) {
          return false;
        }
        return value ? ((new Date(value)).getTime() > (new Date(startDate)).getTime()) && (new Date(value)).getFullYear() <= taxableYear : true;
      }).nullable(),
      startDate: Yup.string().required(translate('required-field')).test('date-test', translate('invalid-entry'),
        (value) => (new Date(value)).getFullYear() <= taxableYear).nullable(),
    }).nullable(),
    isFiscalPartnerCriteriaMet: Yup.string().required(translate('required-field')).nullable(),
  }).nullable(),
  otherwise: Yup.object({}).nullable(),
});

const validateRepresentativeBsn = (value, children) => {
  let isValid = true;
  if (value.length && children?.length) {
    children.forEach((child) => {
      if (child.bsn === value) {
        isValid = false;
      }
    });
  }
  return isValid;
};
/** Will add few other schemas in upcoming PR's */

export {
  personalDetailsValidationSchema,
  situationChangedValidationSchema,
  getChildrenValidationSchema,
  getRepresentativeValidationSchema,
};

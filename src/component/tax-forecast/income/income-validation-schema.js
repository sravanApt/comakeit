import * as Yup from 'yup';
import { incomeTranslate as translate } from './income-translate';

const amountAllowZeroValidation = Yup.string().test('amount-test', translate('required-field'), function (value) {
  const { description } = this.parent;
  return (description ? (value === '0' || !!Number(value)) : true);
}).nullable();

const descriptionYesOrNoSelectValidation = Yup.string().test('yes-or-no-test', translate('required-field'), function (value) {
  const { salary } = this.parent;
  return !(!!(salary.description) && !value);
}).nullable();

const amountDescriptionSchema = () => Yup.object().shape({
  description: Yup.string().when('amount', {
    is: (amount) => !!Number(amount),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  amount: amountAllowZeroValidation,
});

const assetsDebtsSchema = () => Yup.object().shape({
  description: Yup.string().when(['openingValue', 'closingValue'], {
    is: (openingValue, closingValue) => !!Number(openingValue) || !!Number(closingValue),
    then: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')),
    otherwise: Yup.string().max(500, translate('invalid-entry')),
  }).nullable(),
  openingValue: amountAllowZeroValidation,
  closingValue: amountAllowZeroValidation,
});

const amountDescriptionDependentSchema = () => Yup.object({
  description: Yup.string().max(500, translate('invalid-entry')).required(translate('required-field')).nullable(),
  amount: amountAllowZeroValidation,
});

export const abroadIncomeSchema = () => Yup.object().shape({
  salary: amountDescriptionDependentSchema(),
  countryId: Yup.string().test('country-test', translate('required-field'), function (value) {
    const { salary } = this.parent;
    return !(!!(salary.description) && !Number(value));
  }).nullable(),
  isIncomeFromEmployment: descriptionYesOrNoSelectValidation,
  subjectedToDutchTax: Yup.string().test('amount-test', translate('required-field'), function (value) {
    const { salary } = this.parent;
    return (salary.description ? (value === '0' || !!Number(value)) : true);
  }).nullable(),
  withheldWagesTaxAbroad: Yup.string().test('amount-test', translate('required-field'), function (value) {
    const { salary } = this.parent;
    return (salary.description ? (value === '0' || !!Number(value)) : true);
  }).nullable(),
  isMethodForAvoidingDoubleTaxation: descriptionYesOrNoSelectValidation,
  isPaymentZVWYetToBeDone: descriptionYesOrNoSelectValidation,
  inBelgiumOrGermanyWithheldTax: Yup.string().test('bel-or-ger-tax-test', translate('required-field'), function (value) {
    return (value === '0' || !!Number(value));
  }),
}).nullable();

const getValidationSchema = () => Yup.object({
  taxableWages: Yup.object({
    currentEmploymentIncome:
        Yup
          .array()
          .of(Yup.object().shape({
            salary: Yup.object().when(['withHeldWageTax', 'employmentDiscount'], {
              is: (withHeldWageTax, employmentDiscount) => !!Number(withHeldWageTax) || !!Number(employmentDiscount),
              then: amountDescriptionDependentSchema(),
              otherwise: amountDescriptionSchema(),
            }),
          })).nullable(),
    previousEmploymentIncome:
      Yup
        .array()
        .of(Yup.object().shape({
          salary: Yup.object().when('withHeldWageTax', {
            is: (withHeldWageTax) => !!Number(withHeldWageTax),
            then: amountDescriptionDependentSchema(),
            otherwise: amountDescriptionSchema(),
          }),
        })).nullable(),
    taxableIncomeAbroad:
        Yup
          .array()
          .of(abroadIncomeSchema()).nullable(),
    exemptedIncomeFromInternationalOrganization:
          Yup
            .array()
            .of(Yup.object().shape({
              salary: Yup.object().when('nationalInsuranceContribution', {
                is: (nationalInsuranceContribution) => !!Number(nationalInsuranceContribution),
                then: amountDescriptionDependentSchema(),
                otherwise: amountDescriptionSchema(),
              }),
              isCurrentEmpoyment: descriptionYesOrNoSelectValidation,
              nationalInsuranceContribution: Yup.string().test('amount-test', translate('required-field'), function (value) {
                const { salary } = this.parent;
                return (salary.description ? (value === '0' || !!Number(value)) : true);
              }).nullable(),
              isPaymentZVWYetToBeDone: descriptionYesOrNoSelectValidation,
            })).nullable(),
  }).nullable(),
  gainCostFromOtherActivities: Yup.object({
    gainFromOtherActivities: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    costOfOtherActivities: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    gainFromAssetsToOwnCompany: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    costFromAssetsToOwnCompany: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    otherAssets: Yup
      .array()
      .of(assetsDebtsSchema()).nullable(),
    tangibleProperty: Yup
      .array()
      .of(assetsDebtsSchema()).nullable(),
    otherActivitiesLiabilities: Yup
      .array()
      .of(assetsDebtsSchema()).nullable(),
  }).nullable(),
  incomeOutOfBenefits: Yup.object({
    incomeFromBenefits: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    costToBenefits: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    alimony: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
    costToAlimony: Yup
      .array()
      .of(amountDescriptionSchema()).nullable(),
  }).nullable(),
}).nullable();

export const incomeValidationSchema = Yup.object().shape({
  taxableSubjectIncome: getValidationSchema(),
  fiscalPartnerIncome: getValidationSchema(),
});

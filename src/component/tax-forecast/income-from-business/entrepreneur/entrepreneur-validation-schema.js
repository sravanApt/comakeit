import * as Yup from 'yup';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';

const amountAllowZeroValidation = Yup.string().test('amount-test', translate('required-field'), function (value) {
  const { description } = this.parent;
  return (description ? (value === '0' || !!Number(value)) : true);
}).nullable();

const getValidationSchema = () => Yup.object({
  entrepreneurialDeductions: Yup.object({
    researchAndDevelopmentStatementNumber: Yup.object().shape({
      currentYearAmount: Yup.number().positive(translate('required-field')).nullable(),
    }).nullable(),
    numberOfHoursWorkedByAssistingPartner: Yup.object().shape({
      currentYearAmount: Yup.number().positive(translate('required-field')).nullable(),
    }).nullable(),
  }).nullable(),
  remainderSelfEmployedDeductions: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().when('opening', {
        is: (opening) => !!Number(opening),
        then: Yup.string().required(translate('required-field')),
      }).nullable(),
      opening: amountAllowZeroValidation,
    }),
  ).nullable(),
  fiscalPensionReserve: Yup.object({
    pensionReserveDetails: Yup.array().of(
      Yup.object().shape({
        description: Yup.string().when('opening', {
          is: (opening) => !!Number(opening),
          then: Yup.string().required(translate('required-field')),
        }).nullable(),
        opening: amountAllowZeroValidation,
      }),
    ).nullable(),
  }),
}).nullable();

export const entrepreneurValidationSchema = Yup.object().shape({
  taxableSubjectEntrepreneurDetails: getValidationSchema(),
  fiscalPartnerEntrepreneurDetails: getValidationSchema(),
});

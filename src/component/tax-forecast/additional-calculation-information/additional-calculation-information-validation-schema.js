import * as Yup from 'yup';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';

const endDateShouldNotBeBeforeOrEqualToStartDate = Yup.object({
  endDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
    const { startDate } = this.parent;
    if (!startDate && value) {
      return false;
    }
    return value ? ((new Date(value)).getTime() > (new Date(startDate)).getTime()) : true;
  }).nullable(),
}).nullable();

const premiumObligationValidationSchema = Yup.object({
  periodNotInsuredForBasePensionAndGeneralSurviersLaw: endDateShouldNotBeBeforeOrEqualToStartDate,
  periodNotInsuredForHealthcareLaw: endDateShouldNotBeBeforeOrEqualToStartDate,
});

const getValidationSchema = Yup.object({
  premiumObligation: premiumObligationValidationSchema,
});

export const additionalCalculationInformationValidationSchema = Yup.object().shape({
  taxableSubjectAdditionalCalculations: getValidationSchema,
  fiscalPartnerAdditionalCalculations: getValidationSchema,
});

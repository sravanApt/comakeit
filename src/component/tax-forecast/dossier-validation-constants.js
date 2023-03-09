import { incomeValidationSchema } from './income/income-validation-schema';
import { liabilityValidationSchema } from './liabilities/liabilities-validation-schema';
import { entrepreneurValidationSchema } from './income-from-business/entrepreneur/entrepreneur-validation-schema';
import { expenditureFormValidationSchema } from './expenditure/expenditure-validation-schema';
import { ALLOCATION_VALIDATION_SCHEMA } from './allocation/allocation.constants';
import { ASSETS_VALIDATION } from './assets/assets.constants';
import { additionalCalculationInformationValidationSchema } from './additional-calculation-information/additional-calculation-information-validation-schema';
import { taxForecastTranslate as translate } from './tax-forecast-translate';

export const DOSSIER_SECTIONS_VALIDATION_SCHEMA = [
  {
    key: 'personalDetails',
    label: translate('personal-details'),
  }, {
    key: 'generalDetails',
    label: translate('general-information'),
  }, {
    key: 'income',
    schema: incomeValidationSchema,
    label: translate('income'),
  }, {
    key: 'liabilitiesScreen',
    schema: liabilityValidationSchema,
    label: translate('liabilities'),
  }, {
    key: 'entrepreneurDetails',
    schema: entrepreneurValidationSchema,
    label: translate('entrepreneur-allowance'),
  }, {
    key: 'expenditureDetails',
    schema: expenditureFormValidationSchema,
    label: translate('expenditure'),
  }, {
    key: 'allocationDetails',
    schema: ALLOCATION_VALIDATION_SCHEMA,
    label: translate('allocation'),
  }, {
    key: 'assetsScreen',
    schema: ASSETS_VALIDATION,
    label: translate('assets'),
  }, {
    key: 'additionalCalculationDetails',
    schema: additionalCalculationInformationValidationSchema,
    label: translate('additional-calculation-information'),
  },
];

import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const generalDetailsTranslate = translateWithPrefix('tax-forecast-general-details');
extend('nl', {
  'tax-forecast-general-details': {
    'general-information': 'Algemene informatie',
    'due-date-taxable-subject': 'Deadline belastingplichtige',
    'due-date-fiscal-partner': 'Deadline fiscaal partner',
    'becon-number': 'Beconnummer',
    name: 'Naam',
    'approver-for-taxable-subject': 'Accorderen voor belastingplichtige',
    'approver-for-fiscal-partner': 'Accorderen voor fiscaal partner',
    'taxable-subject': 'Belastingplichtige',
    'fiscal-partner': 'Fiscaal partner',
    select: 'Selecteren',
    date: 'Datum',
    'invalid-entry': 'Ongeldige invoer',
    'required-field': 'Verplicht veld',
  },
});

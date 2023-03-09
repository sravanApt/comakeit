import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const auditTrailTranslate = translateWithPrefix('tax-forecast-audit-trail');
extend('nl', {
  'tax-forecast-audit-trail': {
    'audit-trail': 'Audit Trail',
    'taxable-subject': 'Belastingplichtige',
    'date-time': 'Datum en tijd',
    action: 'Acties',
    'error-details': 'Fout',
    user: 'Gebruiker',
    view: 'View',
    ok: 'Ok',
  },
});

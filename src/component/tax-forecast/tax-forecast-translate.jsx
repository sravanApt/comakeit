import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const taxForecastTranslate = translateWithPrefix('tax-forecast');

extend('nl', {
  'tax-forecast': {
    'required-field': 'Verplicht veld',
    'invalid-entry': 'Ongeldige invoer',
    'taxable-subject-label': 'Belastingplichtige',
    'fiscal-partner-label': 'Fiscaal partner',
    'taxable-subjects': 'Belastingplichtigen',
    'tax-forecast': 'Belastingprognose',
    dossiers: 'Dossiers',
    'view-details': 'View details',
    'personal-details': 'Persoonlijke gegevens',
    'general-information': 'Algemene informatie',
    'income-from-business': 'Inkomsten uit onderneming',
    'profit-and-loss': 'Winst- en verliesrekening',
    'balance-sheet': 'Balans',
    'other-items': 'Fiscaal resultaat',
    entrepreneur: 'Ondernemer',
    'entrepreneur-allowance': 'Ondernemersaftrek',
    income: 'Inkomsten',
    expenditure: 'Uitgaven',
    assets: 'Bezittingen',
    liabilities: 'Schulden',
    'additional-calculation-information': 'Berekeningsinformatie',
    'loss-settlement': 'Verliesverrekening',
    allocation: 'Verdeling',
    summary: 'Samenvatting',
    'audit-trail': 'Audit Trail',
    'immovable-property': 'Immovable Property',
    'allowance-calculations': 'Allowance Calculations',
    delete: 'Verwijderen',
    'auto-sync-in-process': 'Even geduld, terwijl wij het dossier voor je synchroniseren',
    'sync-completed': 'Synchroniseren voltooid',
    'import-dossier-title': 'Importeer dossier',
    'reopen-dossier': 'Ontgrendel dossier',
    cancel: 'Annuleren',
    'import-save': 'Importeer',
    'import-warning-text': 'Hiermee worden de bestaande gegevens overschreven in het dossier',
    'send-for-client-approval': 'Naar klant voor akkoord',
    'form-error-list': 'List of invalid forms', // TODO: update with translations
    'send-label': 'Send', // TODO: update with translations
    'submit-label': 'Submit', // TODO: update with translations
    'send-for-client-approval-confirmation-message': 'Het dossier wordt voor accordering en verzending naar de klant gestuurd',
    'submit-to-tax-authority': 'Verzenden naar belastingdienst',
    'submit-to-tax-authority-confirmation-message': 'Het dossier wordt verzonden naar de belastingdienst. Wij sturen een bevestiging per e-mail naar jouw klant als het dossier succesvol verzonden is.',
    'submit-to-tax-authority-when-send-for-client-approval-confirmation-message': 'Weet je zeker dat je het dossier wilt verzenden zonder akkoord van de klant? De accorderingstaak van de klant wordt ingetrokken door deze actie',
    'errors-in-dossier': 'Dossier Errors', // TODO: update with translations
    'reopen-dossier-confiramtion-message': 'Weet je zeker dat je het dossier wilt ontgrendelen. De accorderingstaak wordt ingetrokken',
  },
});

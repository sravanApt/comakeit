import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const incomeTaxClientTranslate = translateWithPrefix('tax-dossier-container');

extend('nl', {
  'tax-dossier-container': {
    dossiers: 'Dossiers',
    dossier: 'Dossier',
    'general-information': 'Algemene informatie',
    'taxable-subjects': 'Belastingplichtigen',
    'tax-dossier-monitor': 'Aangiftemonitor',
    'dossier-name': 'Dossiernaam',
    name: 'Naam',
    'dossier-type': 'Dossiertype ',
    period: 'Tijdvak',
    year: 'Jaar',
    version: 'Versie',
    status: 'Status',
    'last-modified': 'Laatste wijziging',
    tasks: 'Taken',
    search: 'Zoeken',
    forecast: 'Prognose',
    'provisional-declaration': 'Voorlopige aangifte',
    declaration: 'Aangifte',
    'in-progress': 'Opstellen',
    'in-review': 'Controleren',
    submitted: 'Ingediend',
    'in-approval': 'Accorderen',
    completed: 'Afgerond',
    'select-label': 'Selecteren',
    'select-all': 'Alles selecteren',
    'selected-label': 'Selected',
    'type-label': 'Type',
    'taxable-subject-label': 'Belastingplichtige',
    'create-button': 'Toevoegen',
    cancel: 'Annuleren',
    apply: 'Toepassen',
    'clear-all': 'Verwijderen',
    'tax-form': 'Biljet soort',
    'p-form': 'P-Biljet',
    'f-form': ' F-biljet',
    'c-form': 'C-biljet',
    'm-form': 'M-biljet',
    'joint-declaration': 'Doet samen aangifte?',
    'fiscal-partner': 'Fiscaal Partner',
    'create-dossier': 'Toevoegen inkomstenbelastingdossier',
    'required-field': 'Verplicht veld',
    'invalid-entry': 'Ongeldige invoer',
    initials: 'Voorletters',
    'first-name': 'Voornaam',
    'middle-name': 'Tussenvoegsel',
    'last-name': 'Achternaam',
    'full-name': 'Naam',
    'date-of-birth': 'Geboortedatum',
    'bsn-number': 'BSN',
    'email-address': 'E-mailadres',
    'client-number': 'Klantnummer',
    gender: 'Geslacht',
    male: 'Man',
    female: 'Vrouw',
    others: 'Onbekend',
    active: 'Actief',
    save: 'Opslaan',
    date: 'Datum',
    delete: 'Verwijderen',
    actions: 'Acties',
    // confirmation dialog translations
    'confirmation-no': 'Annuleren',
    'confirmation-yes': 'Verwijderen',
    'confirmation-question': 'Weet je zeker dat je het dossier wilt verwijderen?',
    'confirmation-title': 'Bevestiging',
  },
});

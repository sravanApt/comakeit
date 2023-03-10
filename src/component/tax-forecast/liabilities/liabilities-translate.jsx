import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const liabilitiesTranslate = translateWithPrefix('tax-forecast-liabilities-form');
extend('nl', {
  'tax-forecast-liabilities-form': {
    liabilities: 'Schulden',
    'required-field': 'Verplicht veld',
    'invalid-entry': 'Ongeldige invoer',
    // loan for own home section
    edit: 'Wijzigen',
    'loans-for-own-home': 'Eigenwoningleningen',
    'description-label': 'Omschrijving',
    'belongs-to': 'Eigendom van',
    'account-number': 'Rekeningnummer',
    country: 'Land',
    actions: 'Acties',
    'loan-giver': 'Geldverstrekker',
    bank: 'Bank',
    pensionfunds: 'Pensioenfonds',
    'insurrance-company': 'Verzekeraar',
    'non-administrative-subject': 'Niet-administratieplichtige',
    purpose: 'Aanwending',
    'percentage-used-for-own-home': 'Percentage gebruikt voor eigen woning',
    'amount-31-12': 'Bedrag 31-12',
    interest: 'Rente',
    'employee-discount': 'Personeelskorting',
    'house-netherlands': 'Woning Nederland',
    'home-abroad': 'Woning buitenland',
    OTHER: 'Anders',
    annuitary: 'Annuitair',
    linear: 'Liniair',
    other: 'Overig',
    cost: 'Kosten',
    'amount-31-12-label': 'Bedrag 31-12',
    'intrest-label': 'Rente',
    'total-cost': 'Totale kosten',
    'loan-box1': 'Lening',
    'amount-label': 'Bedrag',
    'loan-giver-details': 'Gegevens geldverstrekker',
    'start-date': 'Startdatum',
    'end-date': 'Einddatum',
    'original-principal-amount': 'Oorspronkelijke hoofdsom',
    'interest-rate-in-decimals': 'Rentepercentage in decimalen',
    'method-of-repayment': 'Aflossingsmethode',
    bsn: 'BSN',
    'first-name': 'Voornaam',
    'middle-name': 'Tussenvoegsel',
    'last-name': 'Achternaam',
    initials: 'Voorletters',
    'zip-code': 'Postcode',
    'house-number': 'Huisnummer',
    addition: 'Toevoeging',
    'street-name': 'Straat',
    city: 'Woonplaats',
    select: 'Selecteren',
    save: 'Opslaan',
    cancel: 'Annuleren',
    'name-label': 'Naam',
    'date-of-birth': 'Geboortedatum',
    date: 'Datum',
    'fiscal-number': 'Fiscaal nummer',
    /** Residual loans for own home */
    'residual-loan-for-own-home': 'Restschuld eigen woning (Box 1)',
    'residual-loan-add-text': 'Restschuld eigen woning',
    /** Other loans */
    'other-loans': 'Andere leningen (Box 3)',
    'own-homes-label': 'Eigenwoninglening',
  },
});

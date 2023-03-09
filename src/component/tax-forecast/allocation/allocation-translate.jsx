import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const allocationTranslate = translateWithPrefix('tax-forecast-allocation-form');
extend('nl', {
  'tax-forecast-allocation-form': {
    allocation: 'Verdeling',
    'allocation-details': 'Omschrijving',
    ownhomededuction: 'Aftrek eigen woning',
    substantialinterest: 'Aanmerkelijk belang',
    box3taxablebase: 'Grondslag sparen en beleggen',
    personaldeduction: 'Persoonsgebonden aftrek',
    dividendtax: 'Dividendbelasting',
    'recommended-allocation': 'Automatische optimalisatie',
    'total-amount': 'Totaal',
    'override-current-allocation': 'Hiermee overschrijf je de huidige verdeling, wil je doorgaan?',
    'no-longer-automatic-optimized': 'Het dossier wordt niet meer automatisch geoptimaliseerd',
    on: 'Aan',
    off: 'Uit',
    'confirmation-title': 'Bevestiging',
    'confirmation-no': 'Annuleren',
    'confirmation-yes': 'Verwijderen',
    'required-amount-negative-1': 'Het getal moet tussen',
    'required-amount-negative-2': 'en 0 liggen',
    'required-amount-positive-1': 'Het getal moet tussen 0 en',
    'required-amount-positive-2': 'liggen',
  },
});

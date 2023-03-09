import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const additionalCalculationInformationTranslate = translateWithPrefix('tax-forecast-additional-calculation-information-form');
extend('nl', {
  'tax-forecast-additional-calculation-information-form': {
    'tax-calculation-information': 'Belastingberekeningsinformatie',
    'additional-calculation-information': 'Berekeningsinformatie',
    'add-additional-calculation-information': 'Berekeningsinformatie toevoegen',
    'description-label': 'Omschrijving',
    'amount-label': 'Bedrag',
    'invalid-entry': 'Ongeldige invoer',
    date: 'Datum',
    // resedual personal deductions for past years section
    'residual-personal-deductions-label': 'Restant persoonsgebonden aftrek vorige jaren',
    'residualPersonalDeductionsOfLastYear-description': 'Totaal restant persoonsgebonden aftrek vorige jaren',
    // revision interest section
    'revision-interest-label': 'Revisierente',
    'revisionInterest-description': 'Revisierente',
    // tax credit section
    'tax-credit-label': 'Heffingskorting',
    'income-out-of-labor-fiscal-partner': 'Inkomen uit arbeid fiscaal partner',
    'date-of-birth-fiscal-partner': 'Geboortedatum fiscaal partner',
    'entitled-to-income-for-people': 'Recht op jonggehandicaptenkorting (Wajong)',
    'entitled-to-tax-credit-for-single-elderly': 'Recht op heffingskorting voor alleenstaande ouderen',
    'life-course-leave-used': 'Gebruikt levensloopverlofkorting',
    'life-course-leave-applied': 'Toegepaste levensloopverlofkorting',
    // withholding section
    'withholdings-label': 'Voorheffingen',
    // premium obligation section
    'premium-obligation-label': 'Premieplicht',
    'period-not-insured-for-base-pension-and-general-survivers-law': 'Periode niet in Nederland verzekerd voor de AOW en ANW',
    'period-not-insured-for-healthcare-law': 'Periode niet verzekerd voor de WLZ en ZVW',
    'start-date': 'Startdatum',
    'end-date': 'Einddatum',
    // lossed yet to be settle sections
    'losses-yet-to-settle-box-1-label': 'Nog te verrekenen verliezen box 1',
    'lossesYetToSettleBoxOne-description': 'Totaal van de nog te verrekenen verliezen box 1',
    'losses-yet-to-settle-box-2-label': 'Nog te verrekenen verliezen box 2',
    'lossesYetToSettleBoxTwo-description': 'Totaal van de nog te verrekenen verliezen box 2',
    'payroll-taxes-on-wages-part-of-income-out-of-business': 'Loonheffing over loon als onderdeel van winst',
    'wage-as-part-of-income-from-business': 'Loon als onderdeel van winst',
    'provisional-assessment-income-tax': 'Voorlopige aanslag inkomstenbelasting',
    'provisional-assessment-health-insurance-act': 'Voorlopige aanslag zorgverzekeringswet',
  },
});

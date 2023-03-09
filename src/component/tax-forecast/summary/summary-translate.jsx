import { localize } from '@visionplanner/vp-ui-fiscal-library';

const { extend, translateWithPrefix } = localize();
export const summaryTranslate = translateWithPrefix('summary');

extend('nl', {
  summary: {
    summary: 'Samenvatting',
    'expected-outcome-of-income': 'Resultaat van aangifte',
    'adviser-advice': 'Advies',
    'advice-placeholder': 'Type je tekst',
    'advice-error': 'Advies mag maximaal 350 tekens bevatten',
    'to-pay': 'Te betalen',
    'to-receive': 'Te ontvangen',
    payable: 'Verschuldigd',
    paid: 'Betaald',
    'required-field': 'Verplicht veld',
    'download-pdf': 'Download PDF',
  },
});

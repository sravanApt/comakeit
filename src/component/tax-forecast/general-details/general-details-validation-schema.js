import * as Yup from 'yup';
import { generalDetailsTranslate as translate } from './general-details-translate';

const REG_BCON_NUMBER = /^([0-9]){6}$/;
export const generalDetailsValidationSchema = Yup.object({
  beconNumber: Yup.string().matches(REG_BCON_NUMBER, translate('invalid-entry')).required(translate('required-field'))
    .nullable(),
  emailId: Yup.string().required(translate('required-field')).nullable(),
}).nullable();

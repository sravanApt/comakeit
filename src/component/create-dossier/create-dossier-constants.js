import deepFreeze from 'deep-freeze';
import { getCurrentYear } from '../../common/utils';

export const INPUT_CHANGE = 'input-change';
export const MENU_CLOSE = 'menu-close';
export const INPUT_BLUR = 'input-blur';

export const NEW_DOSSIER_OBJECT = deepFreeze({
  taxationYearID: '',
  declarationTypeID: '',
  taxationFormID: 1,
  dateOfDeath: null,
  fiscalPartnerId: '',
  isJointDeclaration: false,
  copyGlobalDossierID: '',
});

export const CREATE_DOSSIER_DROPDOWN_OPTIONS = deepFreeze({
  dossierTypes: [],
  suggetionsForTaxableSubject: [],
  suggestionsForFiscalPartner: [],
});

export const PROGNOSE_VALUE = 3;
export const CURRENT_YEAR = getCurrentYear();
export const P_FORM_VALUE = 1;
export const F_FORM_VALUE = 2;
export const NOTIFICATION_TIMEOUT = 3000;

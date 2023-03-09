import deepFreeze from 'deep-freeze';
import { taxForecastTranslate as translate } from './tax-forecast-translate';

export const DOSSIER_STATUS = deepFreeze({
  inProgress: 1,
  sendForClientApproval: 3,
  clientApproved: 4,
  submitToTaxAuthorityInProgress: 5,
  submitToTaxAuthorityFailed: 6,
  partiallySubmittedToTaxAuthority: 7,
  waitingForResponseFromTaxAuthority: 8,
  acceptedByTaxAuthority: 9,
  rejectedByTaxAuthority: 11,
  partiallyAcceptedByTaxAuthority: 12,
});

export const PROVISIOANL_IB_DECLARATION_DOSSIER_TYPES = [4, 5]; // 4 -> Provisional, 5 -> IB-declaraion
export const REOPEN_CHECK_DECLARATION_STATUS = [DOSSIER_STATUS.sendForClientApproval, DOSSIER_STATUS.submitToTaxAuthorityFailed];
export const LOCK_DOSSIER_CHECK_STATUS = [DOSSIER_STATUS.partiallySubmittedToTaxAuthority, DOSSIER_STATUS.partiallyAcceptedByTaxAuthority];
export const APPROVAL_DOSSIER_CHECK_STATUS = [DOSSIER_STATUS.inProgress, DOSSIER_STATUS.sendForClientApproval];
export const DOSSIER_SUBMIT_TYPES = [
  'SendForClientApproval',
  'SubmitDirectly',
  'Reopen',
  'SkipClientApprovalsAndSubmit',
];

export const BUSINESS_DETAILS = 'businessDetails';
export const DOSSIER_SECTIONS = ['income', 'expenditureDetails', 'entrepreneurDetails', 'additionalCalculationDetails', 'liabilitiesScreen', 'assetsScreen'];
export const STICKY_ROWS = 1;
export const STICKY_CLOUMNS = 1;
export const PERSONAL_DETAILS = 'personalDetails';
export const GENERAL_DETAILS = 'generalDetails';
export const FISCAL_PARTNER_BUSINESS_ID = 'fiscalPartnerBusinessId';
export const TAXABLE_SUBJECT_BUSINESS_ID = 'taxableSubjectBusinessId';
export const TAXABLE_SUBJECT_BUSINESS_DETAILS_KEY = 'taxableSubjectBusinessDetails';
export const FISCAL_PARTNER_BUSINESS_DETAILS_KEY = 'fiscalPartnerBusinessDetails';
export const MASTER_DATA = 'masterData';
export const VPC_DATA_SECTIONS = [
  {
    sectionKey: 'profitAndLossDetails', vpcResponseKey: 'profitAndLoss', parnterPrefix: 'fiscalPartnerProfitAndLoss', subjectPrefix: 'taxableSubjectProfitAndLoss',
  },
  {
    sectionKey: 'balanceSheetDetails', vpcResponseKey: 'balanceSheet', parnterPrefix: 'fiscalPartnerBalanceSheet', subjectPrefix: 'taxableSubjectBalanceSheet',
  },
  {
    sectionKey: 'otherItemsDetails', vpcResponseKey: 'otherItemsDetails', parnterPrefix: 'fiscalPartnerOtherItems', subjectPrefix: 'taxableSubjectOtherItems',
  },
];

export const STICKY_CUSTOM_STYLES = {
  top: '64px',
};

export const PROPRIETORSHIP_VALUE = 2;
export const PARTNERSHIP_VALUE = 3;
export const VOF_VALUE = 5;
export const BELONGS_TO_VALUES = {
  TAXABLE_SUBJECT: 1,
  FISCAL_PARTNER: 2,
  BOTH: 3,
};

export const ALAPHA_NUMERIC_REGEX = /^([ a-zA-Z0-9]+){0,500}$/;

export const ALAPHA_NUMERIC_REGEX_REQUIRED = /^([ a-zA-Z0-9]+){1,500}$/;

export const ALAPHA_NUMERIC_NO_SPACE_REGEX = /^([a-zA-Z0-9]+){0,500}$/;

export const NUMBER_REGEX = /^([0-9]){0,9}$/;

export const RSIN_REGEX = /^([0-9]){9}$/;

export const ALPHABET_REGEX = /^([ a-zA-Z]+)$/;

export const REG_EXP_RSIN = /^([0-9]){9}$/;

export const REG_EXP_ZIP = /^([0-9]){4}([a-zA-Z]){2}$/;

export const REG_EXP_POSITIVE = /^[0-9]\d*$/;

export const FORM_AND_PARTNER_KEYS_ARRAY = [
  {
    formKey: 'businessDetails',
    partnerKey: 'fiscalPartnerBusinessDetails',
  },
  {
    formKey: 'profitAndLossDetails',
    partnerKey: 'fiscalPartnerProfitAndLoss',
  },
  {
    formKey: 'balanceSheetDetails',
    partnerKey: 'fiscalPartnerBalanceSheet',
  },
  {
    formKey: 'entrepreneurDetails',
    partnerKey: 'fiscalPartnerEntrepreneurDetails',
  },
  {
    formKey: 'expenditureDetails',
    partnerKey: 'fiscalPartnerExpendituresDetails',
  },
  {
    formKey: 'income',
    partnerKey: 'fiscalPartnerIncome',
  },
  {
    formKey: 'otherItemsDetails',
    partnerKey: 'fiscalPartnerOtherItems',
  },
  {
    formKey: 'assetsScreen',
    partnerKey: null,
    jointKey: 'jointAssets',
  },
  {
    formKey: 'liabilitiesScreen',
    partnerKey: null,
    jointKey: 'jointLiabilities',
  },
  {
    formKey: 'additionalCalculationDetails',
    partnerKey: 'fiscalPartnerAdditionalCalculations',
  },
  {
    formKey: 'allocationDetails',
    partnerKey: null,
    jointKey: null,
  },
];

export const PARTNERSHIP_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY = [
  {
    sectionKey: 'profitAndLossDetails',
    subjectKey: 'taxableSubjectProfitAndLoss',
    partnerKey: 'fiscalPartnerProfitAndLoss',
  },
  {
    sectionKey: 'balanceSheetDetails',
    subjectKey: 'taxableSubjectBalanceSheet',
    partnerKey: 'fiscalPartnerBalanceSheet',
  },
];

export const BUSINESS_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY = [
  {
    sectionKey: 'businessDetails',
    subjectKey: 'taxableSubjectBusinessDetails',
    partnerKey: 'fiscalPartnerBusinessDetails',
  },
  {
    sectionKey: 'profitAndLossDetails',
    subjectKey: 'taxableSubjectProfitAndLoss',
    partnerKey: 'fiscalPartnerProfitAndLoss',
  },
  {
    sectionKey: 'balanceSheetDetails',
    subjectKey: 'taxableSubjectBalanceSheet',
    partnerKey: 'fiscalPartnerBalanceSheet',
  },
  {
    sectionKey: 'otherItemsDetails',
    subjectKey: 'taxableSubjectOtherItems',
    partnerKey: 'fiscalPartnerOtherItems',
  },
  {
    sectionKey: 'entrepreneurDetails',
    subjectKey: 'taxableSubjectEntrepreneurDetails',
    partnerKey: 'fiscalPartnerEntrepreneurDetails',
  },
  {
    sectionKey: 'assetsScreen',
    subjectKey: null,
    partnerKey: null,
    jointKey: 'jointAssets',
    sectionsWithAdministrations: [
      'substantialInterests',
    ],
  },
];

export const DOSSIER_SUBMIT_STATUS = 6;
export const LEGAL_FORM_FILTERS = '[legalformid]=in:2,3,5';
export const AUTO_SYNC_STATUSES = {
  IN_PROCESS: 1,
  COMPLETED: 2,
};

export const DOSSIER_ACTIONS_OPTIONS = [
  { label: translate('import-dossier-title'), value: 0 },
  { label: translate('reopen-dossier'), value: 1 },
];

export const ALLOCATION_DATA_KEYS = deepFreeze([
  'ownHomeDeduction',
  'substantialInterest',
  'box3TaxableBase',
  'personalDeduction',
  'dividendTax',
]);

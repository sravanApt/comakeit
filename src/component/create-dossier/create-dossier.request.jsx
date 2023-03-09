import { ApiClient } from '../../config/api-client';

const {
  get, post, validateAndExtractResponseContent,
} = ApiClient;

export const getDossierTypes = (options) => get('/itx-api/v1/declaration/declaration-types', { queryStringParameters: options })
  .then(validateAndExtractResponseContent);

export const getTaxationYears = (options) => get('/itx-api/v1/declaration/taxation-years', { queryStringParameters: options })
  .then(validateAndExtractResponseContent);

export const getTaxFormTypes = () => get('/itx-api/v1/declaration/taxform-types')
  .then(validateAndExtractResponseContent);

export const createNewDossier = (globalClientId, data) => post(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers`, data)
  .then(validateAndExtractResponseContent);

export const getDossierList = (globalClientId, options) => get(`/itx-api/v1/declaration/${globalClientId}/dossier-names`, { queryStringParameters: options })
  .then(validateAndExtractResponseContent);

export const getSelectedDossierInfo = (globalClientId, options) => get(`/itx-api/v1/declaration/${globalClientId}/dossier-info`, { queryStringParameters: options })
  .then(validateAndExtractResponseContent);

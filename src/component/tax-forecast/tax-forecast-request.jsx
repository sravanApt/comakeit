import { ApiClient } from '../../config/api-client';
import { isLockedDossier } from './common/utils';

const {
  get, validateResponse, post, validateAndExtractResponseContent, put,
} = ApiClient;

export const getDossierData = (globalClientId, declarationId) => get(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers/${declarationId}`)
  .then(validateAndExtractResponseContent);

export const getAutoSyncData = (globalClientId, declarationId) => get(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossier-with-vpc-Details/${declarationId}`)
  .then(validateAndExtractResponseContent);

export const getDossierDataSources = (options) => get('/itx-api/v1/lookup/dossier-data-sources', { queryStringParameters: options })
  .then(validateAndExtractResponseContent);

export const calculateTax = (data) => post('/itx-api/v1/declaration/calculate-income-tax', data)
  .then(validateResponse);

export const saveDeclaration = (globalClientId, declarationId, data) => !isLockedDossier(data?.dossierManifest?.declarationStatusId) && put(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers/${declarationId}`, data)
  .then(validateResponse);

export const getVPCFinancialData = (options) => get('/itx-api/v1/declaration/VPC-financial-details', { queryStringParameters: options })
  .then(validateResponse);

export const getDossierLatestFinancialData = (options) => get('/itx-api/v1/declaration/dossier-with-latest-financial-details', { queryStringParameters: options })
  .then(validateResponse);

export const allocationReport = (recommendedAllocation, data) => post(`/itx-api/v1/declaration/allocation-report?recommendedAllocation=${recommendedAllocation}`, data)
  .then(validateAndExtractResponseContent);

export const importDossier = (globalClientId, data) => post(`/itx-api/v1/client-dossiers/${globalClientId}/import-dossier`, data)
  .then(validateAndExtractResponseContent);

export const submitDossier = (globalAdviserId, globalDossierId, data) => post(`/itx-api/v1/declaration/${globalAdviserId}/${globalDossierId}/action-on-dossier`, data)
  .then(validateAndExtractResponseContent);
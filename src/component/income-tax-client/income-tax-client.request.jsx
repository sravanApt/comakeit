import { CommonApiClient, ApiClient } from '../../config/api-client';

const {
  get, validateResponse, validateAndExtractResponseContent,
} = CommonApiClient;

export const getDossierList = (globalClientId, queryParams) => {
  const options = {
    queryStringParameters: queryParams,
  };
  return get(`/api/v1/it-declaration-monitor/${globalClientId}/declaration-dossiers-metadata`, options)
    .then(validateResponse);
};

export const getDossierMasterData = () => get('/api/v1/lookup/incometax-dossier-master-data').then(validateAndExtractResponseContent);

export const getDossierYears = (globalClientId) => get(`/api/v1/taxableyear/${globalClientId}/incometax`).then(validateAndExtractResponseContent);

export const deleteDossierData = (globalClientId, globalDossierId) => ApiClient.delete(`/itx-api/v1/client-dossiers/${globalClientId}/declaration-dossiers/${globalDossierId}`, {});

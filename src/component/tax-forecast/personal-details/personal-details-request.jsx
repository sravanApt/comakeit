import { ApiClient } from '../../../config/api-client';

const { get, validateResponse } = ApiClient;

export const getMaritalStatuses = () => get('/itx-api/v1/lookup/marital-statuses')
  .then(validateResponse);

export const getLivingTogetherSituations = () => get('/itx-api/v1/lookup/living-together-situation-statuses')
  .then(validateResponse);

export const getFiscalPartnerDetails = (options) => get('/itx-api/v1/declaration/fiscal-partner', { queryStringParameters: options })
  .then(validateResponse);

import { ApiClient } from '../../../config/api-client';

const { get, validateResponse } = ApiClient;

export const getVacancyOptions = () => get('/itx-api/v1/lookup/vacancy-options')
  .then(validateResponse);

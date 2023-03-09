import { ApiClient } from '../config/api-client';

const { get, validateAndExtractResponseContent, validateResponse } = ApiClient;

export const getCountriesList = () => get('/itx-api/v1/lookup/countries')
  .then(validateAndExtractResponseContent);

export const getTaxableSubjectDetails = (globalClientId) => get(`/itx-api/v1/income-tax-client/${globalClientId}`)
  .then(validateResponse);

export const getTaxableSubjects = (globalAdviserId, searchBy) => get(`/itx-api/v1/income-tax-client/${globalAdviserId}/client/search-by-name`, { queryStringParameters: { searchBy } })
  .then(validateAndExtractResponseContent);

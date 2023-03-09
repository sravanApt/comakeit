import { LEGAL_FORM_FILTERS } from '../tax-forecast.constants';
import { ApiClient } from '../../../config/api-client';

const {
  get, validateResponse, post, validateAndExtractResponseContent,
} = ApiClient;

export const saveAdministrationDetails = (data) => post('/itx-api/v1/declaration/add-administration', data, {})
  .then(validateResponse);

export const getBusinessFormTypes = () => get('/itx-api/v1/lookup/business-form-types')
  .then(validateResponse);

export const getVpcAdministrationDetails = (id) => get(`/itx-api/v1/administration/${id}`)
  .then(validateAndExtractResponseContent);

export const getVpcAdministrations = (adviserId, searchBy) => get(`/itx-api/v1/administration/search-by-name/${adviserId}`, { queryStringParameters: { searchBy, filter: LEGAL_FORM_FILTERS } })
  .then(validateAndExtractResponseContent);

export const getBusinessPartners = () => get('/itx-api/v1/lookup/business-partners')
  .then(validateResponse);

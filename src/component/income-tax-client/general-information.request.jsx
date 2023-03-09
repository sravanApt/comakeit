import { ApiClient } from '../../config/api-client';

const { post, validateResponse } = ApiClient;

export const updateTaxableSubject = (globalAdviserId, globalClientId, data) => post(`/itx-api/v1/income-tax-client/${globalAdviserId}/client/${globalClientId}`, data).then(validateResponse);

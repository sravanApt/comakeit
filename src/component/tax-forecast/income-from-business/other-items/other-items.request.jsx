import { ApiClient } from '../../../../config/api-client';

const { post, validateAndExtractResponseContent } = ApiClient;

export const taxCalculationReport = (reportType, isPartner, data) => post(`/itx-api/v1/tax-calculation-report?reportType=${reportType}&forFiscalPartner=${isPartner}`, data)
  .then(validateAndExtractResponseContent).then((res) => res.result);

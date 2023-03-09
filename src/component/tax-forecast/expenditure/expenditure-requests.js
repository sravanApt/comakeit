import { ApiClient } from '../../../config/api-client';
import { formatMasterData } from '../../../common/utils';

const { get, post, validateAndExtractResponseContent } = ApiClient;

export const getDiseaseConditions = () => get('/itx-api/v1/lookup/disease-conditions')
  .then(validateAndExtractResponseContent).then(((res) => formatMasterData(res)));

export const taxCalculationReport = (reportType, isPartner, data) => post(`/itx-api/v1/tax-calculation-report?reportType=${reportType}&forFiscalPartner=${isPartner}`, data)
  .then(validateAndExtractResponseContent).then((res) => res.result);

export const aggrigatedTaxCalculationReport = (isPartner, data) => post(`/itx-api/v1/aggregated-tax-calculation-report?forFiscalPartner=${isPartner}`, data)
  .then(validateAndExtractResponseContent).then((res) => res.result);

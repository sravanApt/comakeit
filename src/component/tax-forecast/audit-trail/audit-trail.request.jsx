import { ApiClient } from '../../../config/api-client';

const {
  get, validateAndExtractResponseContent,
} = ApiClient;

export const getAuditTrail = (globalDossierId) => get(`/itx-api/v1.0/audit-trial/${globalDossierId}`)
  .then(validateAndExtractResponseContent);

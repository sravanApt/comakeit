import { ApiClient } from '../../../config/api-client';
import { createQueryString } from '../../../common/utils';

const {
  post, validateResponse,
} = ApiClient;

export const getSummaryData = (data, options) => post(`/itx-api/v1/declaration/incometax-summary${createQueryString(options)}`, data)
  .then(validateResponse);

export const getPdfData = (data, options) => post(`/itx-api/v1/declaration/incometax-summary-pdf${createQueryString(options)}`, data)
  .then(validateResponse);

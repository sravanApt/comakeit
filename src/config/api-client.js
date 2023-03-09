import { createApiClient } from '@visionplanner/vp-ui-fiscal-library';

const applicationRoot = document.getElementById('application-container');
const apiUrls = applicationRoot && JSON.parse(applicationRoot.getAttribute('data-backend'));

export const ApiClient = createApiClient();
export const CommonApiClient = createApiClient();
export const VPDApiClient = createApiClient();

if (apiUrls) {
  ApiClient.setBaseUrl(apiUrls.incomeTaxBaseUrl);
  CommonApiClient.setBaseUrl(apiUrls.baseUrl);
  VPDApiClient.setBaseUrl(apiUrls.vpdBaseUrl);
}

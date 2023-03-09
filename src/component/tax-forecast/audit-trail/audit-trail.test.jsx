import React from 'react';
import {
  render,
  wait,
  waitForElement,
  fireEvent,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import AuditTrail from './audit-trail';
import TaxForecastContext from '../tax-forecast-context';
import { FORECAST_DATA } from '../tax-forecast.test.data';
import { MOCK_AUDIT_TRAIL_DATA } from './audit-trail.test.data';

const MOCK_DOSSIER_ID = 'ad979398-592d-4f10-8801-aacd008f0546';
const mockGetAuditTrail = () => fetchMock.get(
  `/itx-api/v1.0/audit-trial/${MOCK_DOSSIER_ID}`,
  {
    body: MOCK_AUDIT_TRAIL_DATA,
  },
);

const setupComponent = ({
  initialData = FORECAST_DATA.content,
  searchQuery = '',
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
    }
  }
  >
    <AuditTrail location={{ search: searchQuery }} />
  </TaxForecastContext.Provider>,
  mockGetAuditTrail(),
);

describe('Tax Forecast Audit Trail', () => {
  afterEach(fetchMock.restore);

  it('should be able to load audit trail section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Assert
    await wait(() => expect(getByTestId('audit-trail-table')).toBeInTheDocument());
  });

  it('should display the error detail modal onclick of view button', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    const viewButton = await waitForElement(() => getByTestId('view-button1'));
    fireEvent.click(viewButton);

    // Assert
    await wait(() => expect(getByTestId('error-detail-modal')).toBeInTheDocument());
  });
});

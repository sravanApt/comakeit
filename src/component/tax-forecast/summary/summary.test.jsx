import React from 'react';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import TaxForecastContext from '../tax-forecast-context';
import {
  TAB_OPTIONS,
  ACTIVE_TAB,
  mockAutoSaveDeclaration,
  GLOBAL_CLIENT_ID,
  DECLARATION_ID,
} from '../tax-forecast.test.data';
import { changeInput, getActivePartnerTab } from '../../../common/test-helpers';
import { MOCK_DOSSIER_DATA, SUMMARY_MOCK_DATA, PDF_MOCK_DATA } from './summary.test.data';
import Summary from './summary';

const setActiveTab = jest.fn();

const mockGetSummaryData = ({ data = SUMMARY_MOCK_DATA, isPartner = false } = {}) => fetchMock.post(`/itx-api/v1/declaration/incometax-summary?forFiscalPartner=${isPartner}`, {
  body: data,
});

const mockGetPdfData = ({ data = PDF_MOCK_DATA, isPartner = false } = {}) => fetchMock.post(`/itx-api/v1/declaration/incometax-summary-pdf?forFiscalPartner=${isPartner}`, {
  body: data,
});

const setupDom = ({ initialData = MOCK_DOSSIER_DATA, activeTab = ACTIVE_TAB } = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      tabOptions: TAB_OPTIONS,
      activeTab,
      setActiveTab,
      isPartner: !!activeTab,
      globalClientId: GLOBAL_CLIENT_ID,
    }
  }
  >
    <Summary />
  </TaxForecastContext.Provider>,
);

describe('summary', () => {
  afterEach(fetchMock.restore);

  it('should load taxable subject summary component', async () => {
    await act(async () => {
      // Arrange
      mockGetSummaryData({
        data: {
          ...SUMMARY_MOCK_DATA,
          declarationOutcome: {
            payable: 2000,
            paid: 2000,
            netPay: 0,
          },
        },
      });
      const { getByTestId } = setupDom();

      // Act
      const summarySection = await waitForElement(() => getByTestId('taxable-subject-summary-section'));

      // Assert
      expect(summarySection).toBeInTheDocument();
    });
  });

  it('should load fiscal partner summary component', async () => {
    await act(async () => {
      // Arrange
      mockGetSummaryData({
        data: {
          ...SUMMARY_MOCK_DATA,
          declarationOutcome: {
            payable: 18000,
            paid: 20000,
            netPay: -2000,
          },
        },
        isPartner: true,
      });
      const { getByTestId } = setupDom({ activeTab: 1 });

      // Act
      getActivePartnerTab(getByTestId);
      const summarySection = await waitForElement(() => getByTestId('partner-summary-section'));

      // Assert
      expect(summarySection).toBeInTheDocument();
    });
  });

  it('should call save end point when save button is clicked after making changes in adviser advice input', async () => {
    // Arrange
    mockGetSummaryData();
    const inputText = 'sample advice text';
    const saveUrl = `/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/declaration-dossiers/${DECLARATION_ID}`;
    mockAutoSaveDeclaration({ data: { ...MOCK_DOSSIER_DATA, adviserAdvice: { adviceToTaxableSubject: inputText } } });
    const { getByTestId } = setupDom();

    // Act
    const adviceElement = await waitForElement(() => getByTestId('advice-field'));
    fireEvent.focus(adviceElement);
    changeInput(adviceElement, inputText);

    const quickEditElementButtonGruop = getByTestId('quick-edit-button-group');
    const saveButton = quickEditElementButtonGruop.querySelectorAll('button')[0];
    act(() => {
      fireEvent.click(saveButton);
    });

    // Assert
    await wait(() => expect(fetchMock.called(saveUrl)).toEqual(true));
  });

  it('should get the error if enters more than 350 characters in adviser advice field', async () => {
    // Arrange
    mockGetSummaryData();
    const { getByTestId } = setupDom();

    // Act
    const inputText = 'sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text sample advice text ';
    const adviceElement = await waitForElement(() => getByTestId('advice-field'));
    fireEvent.focus(adviceElement);
    changeInput(adviceElement, inputText);
    fireEvent.blur(adviceElement);

    // Assert
    await wait(() => expect(getByTestId('error-advice')).toBeInTheDocument());
  });

  it('should call download pdf end point on click of download pdf button', async () => {
    // Arrange
    mockGetSummaryData();
    mockGetPdfData();
    const { getByTestId } = setupDom();

    // Act
    const downloadPdfButton = await waitForElement(() => getByTestId('download-pdf-button'));
    fireEvent.click(downloadPdfButton);

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/incometax-summary-pdf?forFiscalPartner=false')).toEqual(true));
  });
});

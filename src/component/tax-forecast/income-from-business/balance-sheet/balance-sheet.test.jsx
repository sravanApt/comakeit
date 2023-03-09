import React from 'react';
import {
  render, fireEvent, wait, waitForElement, act, getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import BalaneSheet from './balance-sheet';
import TaxForecastContext from '../../tax-forecast-context';
import {
  DATA_SOURCES,
  DEFAULT_PROFIT_LOSS_DATA,
} from '../profit-loss/profit-loss.test.data';
import {
  MOCK_BALANCE_SHEET_DATA,
  MOCK_DOSSIER_DATA,
  ADMINISTRATION_IDS,
  BALANCE_SHEET_TEST_ID,
  BALANCE_SHEET_CORRECTION_MODAL,
  BALANCE_SHEET_CORRECTION_FORM,
  BALANCE_SHEET_CORRECTION_FIELDS,
  VAT_CORRECTION_FIELDS,
  MOCK_DEPOSIT_WITHDRAWAL_DATA,
} from './balance-sheet.test.data';
import {
  selectAutoCompleteOption,
  getActivePartnerTab,
  changeInput,
} from '../../../../common/test-helpers';
import { TAB_OPTIONS, ACTIVE_TAB, ACTIVE_PARTNER_OBJECT } from '../../tax-forecast.test.data';
import {
  handleAdministrationsAndSourceChange, deleteTableRow, getCorrectionModal, updateAndSubmitCorrectionForm,
} from '../../tax-forecast-test-helpers';
import { DEFAULT_TANGIBLE_ASSETS_DESCRIPTION, DEFAULT_DESCRIPTION } from './balance-sheet.constants';

const setActiveTab = jest.fn();
const saveDossierDetails = jest.fn();
const fetchVPCFinancialData = jest.fn();
const setAdministrationIds = jest.fn();
const calculateUpdatedTax = jest.fn();

const INITIAL_DATA = {
  ...MOCK_DOSSIER_DATA,
  balanceSheetDetails: { taxableSubjectBalanceSheet: MOCK_BALANCE_SHEET_DATA.taxableSubjectBalanceSheet, fiscalPartnerBalanceSheet: null },
  profitAndLossDetails: { taxableSubjectProfitAndLoss: [{ globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c', ...DEFAULT_PROFIT_LOSS_DATA }], fiscalPartnerProfitAndLoss: null },
};

const setupDom = ({
  initialData = INITIAL_DATA,
  administrationIds = ADMINISTRATION_IDS,
  taxableAmount = 0,
  tabOptions = TAB_OPTIONS,
  dossierDataSources = DATA_SOURCES,
  activeTab = ACTIVE_TAB,
} = {}) => render(
  <TaxForecastContext.Provider value={{
    dossierData: initialData,
    saveDossierDetails,
    administrationIds,
    taxableAmount,
    tabOptions,
    dossierDataSources,
    setAdministrationIds,
    fetchVPCFinancialData,
    setActiveTab,
    isPartner: !!activeTab,
    activeTab,
    calculateUpdatedTax,
  }}
  >
    <BalaneSheet />
  </TaxForecastContext.Provider>,
);

describe('balance sheet', () => {
  afterEach(fetchMock.restore);

  it('should be able to select option in administration dropdown in taxable subject tab', async () => {
    // Arrange
    const administrationValue = { value: 0, label: 'Farming' };
    const { getByTestId } = setupDom();
    const balanceSheetContainer = await waitForElement(() => getByTestId(BALANCE_SHEET_TEST_ID));
    const administrationOption = selectAutoCompleteOption(balanceSheetContainer, '.administrations-select', administrationValue.value);

    // Act
    fireEvent.click(administrationOption);

    // Assert
    expect(administrationOption.textContent).toEqual(administrationValue.label);
  });

  it('should be able to change administration and source dropdowns in taxable subject tab', async () => {
    // Arrange
    const administrationValue = { value: 1, label: 'Pharma' };
    const sourceValue = { value: 0, label: 'Actual' };
    const { getByTestId } = setupDom({ administrationIds: {} });

    // Act
    const balanceSheetContainer = await waitForElement(() => getByTestId(BALANCE_SHEET_TEST_ID));
    const { administrationOption, dataSourceOption } = handleAdministrationsAndSourceChange(balanceSheetContainer, sourceValue.value, administrationValue.value);

    // Assert
    expect(administrationOption.textContent).toEqual(administrationValue.label);
    expect(dataSourceOption.textContent).toEqual(sourceValue.label);
  });

  it('should be able to call fetchVPCFinancialData function when select options in administration and source dropdowns in balance sheet', async () => {
    // Arrange
    const administrationValue = { value: 0, label: 'Farming' };
    const sourceValue = {value: 2, displayName: "Actueel + vorig jaar"};
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS } });

    // Act
    const balanceSheetContainer = await waitForElement(() => getByTestId(BALANCE_SHEET_TEST_ID));
    handleAdministrationsAndSourceChange(balanceSheetContainer, sourceValue.value, administrationValue.value);

    // Assert
    expect(getByTestId('override-corrections-and-values-confirmation-modal')).toBeInTheDocument();

    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('confirm-dialog-submit'));
    });

    // Assert
    expect(fetchVPCFinancialData).toHaveBeenCalledTimes(1);
  });

  it('should check whether the partner tab is active', async () => {
    // Arrange
    const { getByTestId } = setupDom(ACTIVE_PARTNER_OBJECT);

    // Act
    const partnerTab = getActivePartnerTab(getByTestId);

    // Assert
    await wait(() => expect(partnerTab.classList.contains('mdc-tab--active')).toEqual(true));
  });

  it('should be able to select one option in administration dropdown in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId, getByText } = setupDom(ACTIVE_PARTNER_OBJECT);

    // Act
    const balanceSheetContainer = await waitForElement(() => getByTestId(BALANCE_SHEET_TEST_ID));
    getActivePartnerTab(getByTestId);
    const administrationOption = selectAutoCompleteOption(balanceSheetContainer, '.administrations-select', 0);
    fireEvent.click(administrationOption);

    // Assert
    expect(getByText('Pharma')).toBeInTheDocument();
  });

  it('should display intangible fixed assets correction modal in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-intangibleFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display intangible fixed assets correction modal with values in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-intangibleFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);
    const intangibleAssetsFirstDescription = MOCK_BALANCE_SHEET_DATA.taxableSubjectBalanceSheet[1].assets.intangibleFixedAssets.intangibleAssets[0].description;

    // Assert
    expect(correctionModal.querySelector('.col-description input').value).toEqual(intangibleAssetsFirstDescription);
  });

  it('should display the error if previous year correction value is empty in intangible fixed assets correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    await getCorrectionModal(getByTestId, 'edit-intangibleFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);
    const previousYearCorrectionInput = getByNameAttribute(getByTestId('previous-year-correction0'), 'correctionData.0.previousYear.correction');
    changeInput(previousYearCorrectionInput, '');
    fireEvent.blur(previousYearCorrectionInput);

    // Assert
    await wait(() => expect(getByTestId('error-correctionData.0.previousYear.correction')).toBeInTheDocument());
  });

  it('should delete row in intangible fixed assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-intangibleFixedAssets', 'correction-table', 'intangible-fixed-assets-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should hide intangible assets correction form after submit with correction data', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-intangibleFixedAssets', BALANCE_SHEET_CORRECTION_FORM, BALANCE_SHEET_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(queryByTestId(BALANCE_SHEET_CORRECTION_FORM)).toBeNull());
  });

  it('should display tangible fixed assets correction modal in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-tangibleFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display the tangible fixed assets correction modal with values in assets section', async () => {
    // Arrange
    const { getByTestId, getByText } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    await getCorrectionModal(getByTestId, 'edit-tangibleFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(getByText(DEFAULT_TANGIBLE_ASSETS_DESCRIPTION)).toBeInTheDocument();
  });

  it('should delete row in tangible fixed assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-tangibleFixedAssets', 'correction-table', 'tangible-fixed-assets-1');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display the financial fixed assets correction modal in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-financialFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in financial fixed assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-financialFixedAssets', 'correction-table', 'common-assets-liabilities-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display the receivables correction modal without values in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-receivables', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display the receivables correction modal with values in assets section', async () => {
    // Arrange
    const { getByTestId, getByText } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    await getCorrectionModal(getByTestId, 'edit-receivables', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(getByText(DEFAULT_DESCRIPTION)).toBeInTheDocument();
  });

  it('should delete row in receivables assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-receivables', 'correction-table', 'receivables-1');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display the short term liabilities correction modal without values in liabilities section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-shortTermLiabilities', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display the short term liabilities correction modal with values in liabilities section', async () => {
    // Arrange
    const { getByTestId, getByText } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    await getCorrectionModal(getByTestId, 'edit-shortTermLiabilities', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(getByText(DEFAULT_DESCRIPTION)).toBeInTheDocument();
  });

  it('should hide short term liabilities correction form after submit with correction data', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, fiscalPartnerBusinessId: null } });

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-shortTermLiabilities', BALANCE_SHEET_CORRECTION_FORM, [...BALANCE_SHEET_CORRECTION_FIELDS, ...VAT_CORRECTION_FIELDS]);
    });

    // Assert
    await wait(() => expect(queryByTestId(BALANCE_SHEET_CORRECTION_FORM)).toBeNull());
  }, 10000);

  it('pencil icons should be filled if data exists for assets and liabilities', async () => {
    // Arrange
    const sectionsIncludingShares = 8;
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const balanceSheetContainer = await waitForElement(() => getByTestId(BALANCE_SHEET_TEST_ID));
    const filledPencilIcons = balanceSheetContainer.querySelectorAll('.icon__edit .fas');

    // Assert
    expect(filledPencilIcons.length).toEqual(sectionsIncludingShares);
  });

  it('should display the financial fixed assets correction modal in assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-financialFixedAssets', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in financial fixed assets section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-financialFixedAssets', 'correction-table', 'common-assets-liabilities-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display the deposits correction modal in deposit and withdrawals section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-depositDetails', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in deposits correction modal in deposit and withdrawals section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-depositDetails', 'correction-table', 'common-assets-liabilities-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display the withdrawals correction modal in deposit and withdrawals section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-withdrawalDetails', BALANCE_SHEET_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in withdrawals correction modal in deposit and withdrawals section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-withdrawalDetails', 'correction-table', 'common-assets-liabilities-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });
  
  it('should call saveDossierDetails after submit with withdrawals correction data', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, fiscalPartnerBusinessId: null } });

    // Act
    const editButton = await waitForElement(() => getByTestId('edit-withdrawalDetails'));
    fireEvent.click(editButton);

    const correctionForm = await waitForElement(() => getByTestId(BALANCE_SHEET_CORRECTION_FORM));
    const descriptionInput = getByNameAttribute(correctionForm, 'correctionData.0.description');
    changeInput(descriptionInput, MOCK_DEPOSIT_WITHDRAWAL_DATA.description);
    const openingInput = getByNameAttribute(correctionForm, 'correctionData.0.currentYear.correction');
    changeInput(openingInput, MOCK_DEPOSIT_WITHDRAWAL_DATA.amount);
    await act(async () => {
      await fireEvent.submit(correctionForm);
    });

    // Assert
    await wait(() => expect(saveDossierDetails).toHaveBeenCalledTimes(1));
  }, 10000);

  it('should display the alert when closing balance for assets and liabilities are not balanced ', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const ClosingBalanceAlert = await waitForElement(() => getByTestId('closing-balance-alert'));

    // Assert
    expect(ClosingBalanceAlert).toBeInTheDocument();
    await wait(() => expect(document.querySelector('.icon__closing-balance')).toBeInTheDocument());
  });

  it('should display the alert when opening balance for assets and liabilities are not balanced ', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const OpeningBalanceAlert = await waitForElement(() => getByTestId('opening-balance-alert'));

    // Assert
    expect(OpeningBalanceAlert).toBeInTheDocument();
    await wait(() => expect(document.querySelector('.icon__opening-balance')).toBeInTheDocument());
  });

  it('should display the shares section when business form is partnership', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c' } });

    // Assert
    await wait(() => expect(getByTestId('balance-sheet-shares')).toBeInTheDocument());
  });

  it('should display the shares section when business form is VOF', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Assert
    await wait(() => expect(getByTestId('balance-sheet-shares')).toBeInTheDocument());
  });

  it('should display the correction modal for shares with values', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c' } });

    // Act
    const sharesEquityFirstDescription = MOCK_BALANCE_SHEET_DATA.taxableSubjectBalanceSheet[0].shares.transactions[0].description;
    await getCorrectionModal(getByTestId, 'edit-shares', BALANCE_SHEET_CORRECTION_MODAL);
    const descriptionInput = getByNameAttribute(getByTestId('common-correction-description0'), 'correctionData.0.description');

    // Assert
    expect(descriptionInput.value).toBe(sharesEquityFirstDescription);
  });

  it('should call saveDossierDetails and hide the correction modal for shares after submitting the form', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c' } });
    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-shares', BALANCE_SHEET_CORRECTION_FORM, BALANCE_SHEET_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(queryByTestId(BALANCE_SHEET_CORRECTION_FORM)).toBeNull());
    expect(saveDossierDetails).toHaveBeenCalledTimes(1);
  });
});

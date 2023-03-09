import React from 'react';
import deepFreeze from 'deep-freeze';
import {
  render, wait, fireEvent, waitForElement, act,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import OtherItems from './other-items';
import TaxForecastContext from '../../tax-forecast-context';
import {
  TAB_OPTIONS,
  ACTIVE_TAB,
  ACTIVE_PARTNER_OBJECT,
  GLOBAL_CLIENT_ID,
} from '../../tax-forecast.test.data';
import { DATA_SOURCES, DEFAULT_PROFIT_LOSS_DATA } from '../profit-loss/profit-loss.test.data';
import {
  MOCK_DOSSIER_DATA,
  ADMINISTRATION_IDS,
} from '../balance-sheet/balance-sheet.test.data';
import {
  MOCK_OTHER_ITEMS_DEFAULT_DATA,
  MOCK_OTHER_ITEMS_TEST_DATA,
  OTHER_ITEMS_CORRECTION_MODAL,
  OTHER_ITEMS_CORRECTION_FORM,
  MOCK_OTHER_ITEMS_EMPTY_TEST_DATA,
} from './other-items.test.data';
import { getActivePartnerTab, selectAutoCompleteOption, changeInput } from '../../../../common/test-helpers';
import {
  getCorrectionModal, deleteTableRow, updateAndSubmitCorrectionForm,
} from '../../tax-forecast-test-helpers';

const setActiveTab = jest.fn();
const saveDossierDetails = jest.fn();
const setAdministrationIds = jest.fn();
const fetchVPCFinancialData = jest.fn();
const administrationValue = { value: 0, label: 'Farming' };

const getMockReportData = (reportType) => deepFreeze({
  content: {
    result: {
      [reportType]: {
        totalAmount: 100,
        totalDeductionAmount: 0,
      },
    },
  },
  meta: { totalRecords: '1' },
  errors: null,
});

const mockGetReportBokkzData = (reportType, isPartner = false) => fetchMock.post(
  `/itx-api/v1/tax-calculation-report?reportType=${reportType}&forFiscalPartner=${isPartner}`,
  {
    body: getMockReportData(reportType),
  },
);

const INITIAL_DATA = {
  ...MOCK_DOSSIER_DATA,
  otherItemsDetails: MOCK_OTHER_ITEMS_DEFAULT_DATA,
};

const OTHER_ITEMS_TEST_DATA = {
  ...INITIAL_DATA,
  otherItemsDetails: { ...INITIAL_DATA.otherItemsDetails, taxableSubjectOtherItems: MOCK_OTHER_ITEMS_TEST_DATA },
  profitAndLossDetails: { taxableSubjectProfitAndLoss: [{ globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c', ...DEFAULT_PROFIT_LOSS_DATA }], fiscalPartnerProfitAndLoss: null },
};

const selectAdministration = async (getByTestId) => {
  const otherItemsContainer = await waitForElement(() => getByTestId('other-items'));
  const administrationOption = selectAutoCompleteOption(otherItemsContainer, '.administrations-select', administrationValue.value);
  fireEvent.click(administrationOption);
  return administrationOption;
};

const updateInvestmentSectionTable = async (getByTestId, selectId, inputId, inputValue) => {
  const editButton = await waitForElement(() => getByTestId('edit-investmentDeduction'));
  fireEvent.click(editButton);
  const correctionForm = await waitForElement(() => getByTestId('correction-table'));
  const selectYes = selectAutoCompleteOption(correctionForm, selectId, 0, true);
  fireEvent.click(selectYes);
  const inputContainer = correctionForm.querySelector(`.common-data-table__body .common-data-table__row ${inputId} input`);
  act(() => {
    changeInput(inputContainer, inputValue);
  });
  const selectNo = selectAutoCompleteOption(correctionForm, selectId, 1, true);
  fireEvent.click(selectNo);
  return inputContainer;
};

const setupDom = ({
  initialData = INITIAL_DATA,
  administrationIds = ADMINISTRATION_IDS,
  taxableAmount = 0,
  tabOptions = TAB_OPTIONS,
  dossierDataSources = DATA_SOURCES,
  activeTab = ACTIVE_TAB,
  calculateUpdatedTax = jest.fn(),
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
    globalClientId: GLOBAL_CLIENT_ID,
    calculateUpdatedTax,
  }}
  >
    <OtherItems />
  </TaxForecastContext.Provider>,
);

describe('other items', () => {
  afterEach(fetchMock.restore);

  it('should check whether the partner tab is active', async () => {
    // Arrange
    const { getByTestId } = setupDom(ACTIVE_PARTNER_OBJECT);

    // Act
    const partnerTab = getActivePartnerTab(getByTestId);

    // Assert
    await wait(() => expect(partnerTab.classList.contains('mdc-tab--active')).toEqual(true));
  });

  it('should be able to select option in administration dropdown in taxable subject tab', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const administrationOption = await selectAdministration(getByTestId);

    // Assert
    expect(administrationOption.textContent).toEqual(administrationValue.label);
  });

  it('should be able to select option in administration dropdown in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...INITIAL_DATA, otherItemsDetails: null },
      ...ACTIVE_PARTNER_OBJECT,
    });

    // Act
    const administrationOption = await selectAdministration(getByTestId);

    // Assert
    expect(administrationOption.textContent).toEqual('Pharma');
  });

  it('should display partly deductable costs correction modal in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: '2dd4095f-c490-4ad9-b4ba-aacd008df97c' } });

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-nonOrPartlyDeductableCost', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in non or partly deductable costs section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-nonOrPartlyDeductableCost', 'correction-table', 'partly-deductable-costs-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display equalization reserve correction modal in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-equalizationReserve', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in equalization reserve section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-equalizationReserve', 'correction-table', 'allocation-reserve-costs-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should hide equalization reserve correction form after submit with correction data', async () => {
    // Arrange
    const formInputs = [{
      selector: '.common-data-table__body .common-data-table__row .col-description input',
      value: 'test',
    }, {
      selector: '.common-data-table__body .common-data-table__row .col-opening input',
      value: 1000,
    }];
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-equalizationReserve', OTHER_ITEMS_CORRECTION_FORM, formInputs);
    });

    // Assert
    await wait(() => expect(queryByTestId(OTHER_ITEMS_CORRECTION_FORM)).toBeNull());
  }, 10000);

  it('should display cessation profit correction modal in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-cessationProfit', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should delete row in cessation profit section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-cessationProfit', 'correction-table', 'cessation-profit-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should hide cessation profit correction form after submit with correction data', async () => {
    // Arrange
    const formInputs = [{
      selector: '.common-data-table__body .common-data-table__row .col-description input',
      value: 'test',
    }, {
      selector: '.common-data-table__body .common-data-table__row .col-correction input',
      value: 1000,
    }];
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-cessationProfit', OTHER_ITEMS_CORRECTION_FORM, formInputs);
    });

    // Assert
    await wait(() => expect(queryByTestId(OTHER_ITEMS_CORRECTION_FORM)).toBeNull());
  }, 10000);

  it('should display investment deduction correction modal in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: {
        ...INITIAL_DATA,
        otherItemsDetails: {
          ...MOCK_OTHER_ITEMS_DEFAULT_DATA,
          taxableSubjectOtherItems: [{
            ...MOCK_OTHER_ITEMS_DEFAULT_DATA.taxableSubjectOtherItems[0],
            businessResult: {
              ...MOCK_OTHER_ITEMS_DEFAULT_DATA.taxableSubjectOtherItems[0].businessResult,
              investmentDeduction: {
                ...MOCK_OTHER_ITEMS_DEFAULT_DATA.taxableSubjectOtherItems[0].businessResult.investmentDeduction,
                deductions: {},
              },
            },
          }],
        },
      },
    });

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-investmentDeduction', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  }, 10000);

  it('should delete row in investment deduction section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-investmentDeduction', 'correction-table', 'investment-deduction-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display investment deduction correction modal for fiscal partner in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA, activeTab: 1 });

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-investmentDeduction', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should be able to reset KIA amount value after select no option for cliam KIA in investment dedcution section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const resetAmountKIAInput = await updateInvestmentSectionTable(getByTestId, '.claimKIA-select', '.amount-KIA', 2000);

    // Assert
    await wait(() => expect(resetAmountKIAInput.value).toEqual(''));
  }, 10000);

  it('should be able to reset EIA amount value after select no option for cliam EIA in investment dedcution section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const resetAmountEIAInput = await updateInvestmentSectionTable(getByTestId, '.claimEIA-select', '.amount-EIA', 2000);

    // Assert
    await wait(() => expect(resetAmountEIAInput.value).toEqual(''));
  }, 10000);

  it('should be able to reset MIA amount value after select no option for cliam MIA in investment dedcution section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const resetAmountMIAInput = await updateInvestmentSectionTable(getByTestId, '.claimMia-select', '.amount-MIA', 2000);

    // Assert
    await wait(() => expect(resetAmountMIAInput.value).toEqual(''));
  }, 10000);

  it('should hide investment deduction remainder correction form after submit with correction data', async () => {
    // Arrange
    const formInputs = [{
      selector: '.common-data-table__body .common-data-table__row .description input',
      value: 'test',
    }, {
      selector: '.common-data-table__body .common-data-table__row .common-description-amount input',
      value: 1000,
    }];
    mockGetReportBokkzData('InvestmentDeduction');
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-investmentDeduction', 'remainder-correction-table', formInputs);
    });

    // Assert
    await wait(() => expect(queryByTestId('remainder-correction-table')).toBeNull());
  }, 10000);

  it('should display divestment addition correction modal in other items section', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-divestmentAddition', OTHER_ITEMS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('pencil icons should not be filled if data is not exist for other items', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: {
        ...INITIAL_DATA,
        otherItemsDetails: { ...INITIAL_DATA.otherItemsDetails, taxableSubjectOtherItems: MOCK_OTHER_ITEMS_EMPTY_TEST_DATA },
        profitAndLossDetails: { taxableSubjectProfitAndLoss: [{ globalAdministrationId: 'f6fe55a0-f78d-4003-80cd-aacd008dd90c', ...DEFAULT_PROFIT_LOSS_DATA }], fiscalPartnerProfitAndLoss: null },
      },
    });

    // Act
    const OtherItemsContainer = await waitForElement(() => getByTestId('other-items'));
    const filledPencilIcons = OtherItemsContainer.querySelectorAll('.icon__edit .fas');

    // Assert
    expect(filledPencilIcons.length).toEqual(0);
  });

  it('should delete row in divestment addition section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: OTHER_ITEMS_TEST_DATA });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-divestmentAddition', 'correction-table', 'divestment-addition-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should hide divestment addition correction form after submit with correction data', async () => {
    // Arrange
    const formInputs = [{
      selector: '.common-data-table__body .common-data-table__row .col-description input',
      value: 'test',
    }, {
      selector: '.common-data-table__body .common-data-table__row .col-base input',
      value: 1000,
    }];
    mockGetReportBokkzData('DivestmentAddition');
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-divestmentAddition', OTHER_ITEMS_CORRECTION_FORM, formInputs);
    });

    // Assert
    await wait(() => expect(queryByTestId(OTHER_ITEMS_CORRECTION_FORM)).toBeNull());
  }, 10000);
});

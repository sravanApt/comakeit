import React from 'react';
import {
  render, fireEvent, wait, waitForElement, act,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import ProfitAndLoss from './profit-and-loss';
import TaxForecastContext from '../../tax-forecast-context';
import {
  MOCK_PROFIT_LOSS_DATA,
  MOCK_DOSSIER_DATA,
  DATA_SOURCES,
  ADMINISTRATION_IDS,
  PROFIT_LOSS_TEST_ID,
  PROFIT_LOSS_CORRECTION_MODAL,
  PROFIT_LOSS_CORRECTION_FORM,
  PROFIT_LOSS_CORRECTION_FIELDS,
} from './profit-loss.test.data';
import { TAB_OPTIONS, ACTIVE_TAB, ACTIVE_PARTNER_OBJECT } from '../../tax-forecast.test.data';
import {
  selectAutoCompleteOption, getActivePartnerTab,
} from '../../../../common/test-helpers';
import {
  handleAdministrationsAndSourceChange, updateAndSubmitCorrectionForm, getCorrectionModal, deleteTableRow,
} from '../../tax-forecast-test-helpers';

const setActiveTab = jest.fn();
const saveDossierDetails = jest.fn();
const setAdministrationIds = jest.fn();
const fetchVPCFinancialData = jest.fn();
const calculateUpdatedTax = jest.fn();
const INITIAL_DATA = { ...MOCK_DOSSIER_DATA, profitAndLossDetails: { taxableSubjectProfitAndLoss: MOCK_PROFIT_LOSS_DATA, fiscalPartnerProfitAndLoss: null } };

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
    <ProfitAndLoss />
  </TaxForecastContext.Provider>,
);

describe('profit and loss', () => {
  afterEach(fetchMock.restore);

  it('should load profit and loss component with empty administrations', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...MOCK_DOSSIER_DATA, businessDetails: { fiscalPartnerBusinessDetails: null, taxableSubjectBusinessDetails: null } }, administrationIds: {},
    });
    const profitLossContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_TEST_ID));

    // Act
    const adminiStrationsDropdownField = profitLossContainer.querySelector('.administrations-select input');
    fireEvent.focus(adminiStrationsDropdownField);
    fireEvent.mouseDown(adminiStrationsDropdownField);

    // Act
    expect(adminiStrationsDropdownField.querySelectorAll('.react-select__menu .react-select__option').length).toBe(0);
  });

  it('should be able to change option in administration dropdown in taxable subject tab', async () => {
    // Arrange
    const administrationValue = { value: 1, label: 'Pharma' };
    const { getByTestId } = setupDom({
      initialData: MOCK_DOSSIER_DATA,
    });

    // Act
    const profitLossContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_TEST_ID));
    const administrationOption = selectAutoCompleteOption(profitLossContainer, '.administrations-select', administrationValue.value);
    fireEvent.click(administrationOption);

    // Assert
    expect(administrationOption.textContent).toEqual(administrationValue.label);
  });

  it('should be able to change options in data source dropdown in taxable subject tab', async () => {
    // Arrange
    const sourceValue = { value: 0, label: 'Actual' };
    const administrationValue = { value: 1, label: 'Pharma' };
    const { getByTestId } = setupDom({ administrationIds: {} });

    // Act
    const profitLossContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_TEST_ID));
    const { dataSourceOption } = handleAdministrationsAndSourceChange(profitLossContainer, sourceValue.value, administrationValue.value);

    // Assert
    expect(dataSourceOption.textContent).toEqual(sourceValue.label);
  });

  it('should be able to call fetch vpc financial data function when select options in administration and source dropdowns in profit and loss', async () => {
    // Arrange
    const sourceValue = {value: 2, displayName: "Actueel + vorig jaar"};
    const administrationValue = { value: 1, label: 'Pharma' };
    const { getByTestId } = setupDom({
      administrationIds: { ...ADMINISTRATION_IDS },
    });

    // Act
    const profitLossContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_TEST_ID));
    handleAdministrationsAndSourceChange(profitLossContainer, sourceValue.value, administrationValue.value);

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

  it('should display revenue correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-revenue', PROFIT_LOSS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display financial benefits correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-financialBenifitsForBusiness', PROFIT_LOSS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display cost correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-purchaseCost', PROFIT_LOSS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should display financial cost correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const correctionModal = await getCorrectionModal(getByTestId, 'edit-financialCostsForBusiness', PROFIT_LOSS_CORRECTION_MODAL);

    // Assert
    expect(correctionModal).toBeInTheDocument();
  });

  it('should close revenue correction modal', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const showCorrectionModal = await waitForElement(() => getByTestId('edit-revenue'));
    fireEvent.click(showCorrectionModal);
    const correctionModalContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_CORRECTION_MODAL));
    const closeIcon = getByTestId('close-icon');
    fireEvent.click(closeIcon);

    // Assert
    expect(correctionModalContainer).not.toBeInTheDocument();
  });

  it('should hide financial benefits correction form after submit with correction data', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-financialBenifitsForBusiness', PROFIT_LOSS_CORRECTION_FORM, PROFIT_LOSS_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(queryByTestId(PROFIT_LOSS_CORRECTION_FORM)).toBeNull());
  });

  it('should delete row in revenue correction modal when click on delete icon', async () => {
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-revenue', PROFIT_LOSS_CORRECTION_MODAL, 'profit-loss-correction-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('pencil icons should be filled if data exists for revenue and costs', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      administrationIds: { ...ADMINISTRATION_IDS },
    });

    // Act
    const profitLossContainer = await waitForElement(() => getByTestId(PROFIT_LOSS_TEST_ID));
    const filledPencilIcons = profitLossContainer.querySelectorAll('.icon__edit .fas');

    // Assert
    expect(filledPencilIcons.length).toEqual(9);
  });

  it('should display the allocation to partner section when business form is partnership', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed52' } });

    // Assert
    await wait(() => expect(getByTestId('partner-allocation-details')).toBeInTheDocument());
  });

  it('should display the allocation to partner section when business form is VOF', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed55' } });

    // Assert
    await wait(() => expect(getByTestId('partner-allocation-details')).toBeInTheDocument());
  });

  it('should delete row in allocation for partner correction modal when click on delete icon', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed52' } });

    // Act
    const { initialTableRows, remianingTableRows } = await deleteTableRow(getByTestId, 'edit-shares', PROFIT_LOSS_CORRECTION_MODAL, 'common-assets-liabilities-0');

    // Assert
    expect(remianingTableRows).toBe(initialTableRows - 1);
  });

  it('should display correction modal onclick of allocation to partner edit icon', async () => {
    // Arrange
    const { getByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed52' } });
    const allocationDetails = await waitForElement(() => getByTestId('partner-allocation-details'));

    // Act
    const editIcon = allocationDetails.querySelector('.icon__edit');
    fireEvent.click(editIcon);

    // Assert
    await wait(() => expect(getByTestId('correction-table')).toBeInTheDocument());
  });

  it('should hide the correction modal for allocation for partner after submitting the form', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ administrationIds: { ...ADMINISTRATION_IDS, taxableSubjectBusinessId: 'b91f1cd8-5284-4e78-a579-aae10050ed52' } });

    // Act
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-shares', PROFIT_LOSS_CORRECTION_FORM, PROFIT_LOSS_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(queryByTestId(PROFIT_LOSS_CORRECTION_FORM)).toBeNull());
  });
});

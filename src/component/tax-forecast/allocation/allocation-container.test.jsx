import React from 'react';
import {
  render,
  wait,
  waitForElement,
  getByNameAttribute,
  act,
  cleanup,
  fireEvent,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import AllocationContainer from './allocation-container';
import TaxForecastContext from '../tax-forecast-context';
import {
  TAB_OPTIONS, ACTIVE_TAB, GLOBAL_CLIENT_ID, mockAutoSaveDeclaration,
} from '../tax-forecast.test.data';
import {
  MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
  MOCK_ALLOCATION_DATA,
  mockGetRecommendedAllocationData,
  MOCK_RECOMMENDED_ALLOCATION_NULL_DATA,
} from './allocation.test.data';
import { changeInput, setBooleanField } from '../../../common/test-helpers';

const calculateTaxSpy = jest.fn();

const setupComponent = ({
  initialData = MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
  options = TAB_OPTIONS,
  calculateUpdatedTax = calculateTaxSpy,
  activeTab = ACTIVE_TAB,
  saveDossierDetails = jest.fn(),
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      tabOptions: options,
      calculateUpdatedTax,
      activeTab,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails,
    }
  }
  >
    <AllocationContainer />
  </TaxForecastContext.Provider>,
);

describe('Tax Forecast - Allocation', () => {
  afterEach(cleanup);
  afterEach(fetchMock.restore);

  it('should load allocation section with default data', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));

    // Assert
    expect(allocationSection).toBeInTheDocument();
  });

  it('should load allocation section with saved data', async () => {
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: {
          ...MOCK_ALLOCATION_DATA,
          ownHomeDeduction: null,
        },
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const subjectDeductionInput = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');

    // Assert
    expect(subjectDeductionInput.value).toStrictEqual('');
  });

  it('should be able to assign total amount to fiscal partner when removed data for taxable subject in allocation deductions', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const subjectDeductionInput = await waitForElement(() => getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount'));
    act(() => {
      changeInput(subjectDeductionInput, '');
    });
    fireEvent.blur(subjectDeductionInput);

    // Assert
    expect(getByTestId('ownHomeDeduction-fiscal-partner-amount').textContent).toEqual('€20');
  });

  it('should be hide taxable subject amount input when recommended allocation changes to true in allocation section', async () => {
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    mockGetRecommendedAllocationData({ recommendedAllocation: true, data: MOCK_RECOMMENDED_ALLOCATION_NULL_DATA });
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const subjectDeductionInput = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');
    const recommendedAllocationInput = getByNameAttribute(allocationSection, 'allocationFlag');
    act(() => {
      setBooleanField(recommendedAllocationInput, true);
    });
    await waitForElement(() => getByTestId('confirmation-modal'));
    const confirmButton = getByTestId('confirm-dialog-submit');
    fireEvent.click(confirmButton);

    // Assert
    await wait(() => expect(subjectDeductionInput).not.toBeInTheDocument());
  });

  it('should display taxable subject amount input when did not update recommended allocation change in allocation section', async () => {
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const subjectDeductionInput = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');
    const recommendedAllocationInput = getByNameAttribute(allocationSection, 'allocationFlag');
    act(() => {
      setBooleanField(recommendedAllocationInput, true);
    });
    await waitForElement(() => getByTestId('confirmation-modal'));
    const cancelButton = getByTestId('confirm-dialog-cancel');
    fireEvent.click(cancelButton);

    // Assert
    expect(subjectDeductionInput).toBeInTheDocument();
  });

  it('should be able to show error if subject amount is less than total amount in allocation section', async () => {
    mockAutoSaveDeclaration();
    mockGetRecommendedAllocationData({
      recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation,
      data: {
        ...MOCK_RECOMMENDED_ALLOCATION_NULL_DATA,
        content: {
          ...MOCK_RECOMMENDED_ALLOCATION_NULL_DATA.content,
          ownHomeDeduction: {
            taxableSubjectAmount: '-120',
            fiscalPartnerAmount: '0',
            totalAmount: '-199',
          },
        },
      },
    });
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const amountField = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');

    act(() => {
      changeInput(amountField, 999);
      changeInput(amountField, '-999');
    });

    // Assert
    await wait(() => expect(getByTestId('error-ownHomeDeduction.taxableSubjectAmount')).toBeInTheDocument());
  });

  it('should be able to show error if subject amount is greater than total amount in allocation section', async () => {
    mockAutoSaveDeclaration();
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const amountField = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');

    act(() => {
      changeInput(amountField, 999);
    });

    // Assert
    await wait(() => expect(getByTestId('error-ownHomeDeduction.taxableSubjectAmount')).toBeInTheDocument());
  });

  it('should call save dossier details when updated values in allocation', async () => {
    mockAutoSaveDeclaration();
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    // Arrange
    const saveSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: MOCK_ALLOCATION_DATA,
      },
      saveDossierDetails: saveSpy,
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const amountField = getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount');

    act(() => {
      changeInput(amountField, 99);
    });

    // Assert
    await wait(() => expect(saveSpy).toHaveBeenCalled());
  }, 10000);

  it('should be able to assign taxableSubjectAmount to taxable subject when recommended allocation resets to false in allocation deductions', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    mockGetRecommendedAllocationData({ recommendedAllocation: MOCK_ALLOCATION_DATA.recommendedAllocation });
    mockGetRecommendedAllocationData({ recommendedAllocation: true });
    const { getByTestId } = setupComponent({
      initialData: {
        ...MOCK_FISCAL_DATA_WITH_NULL_ALLOCATION_DATA,
        allocationDetails: {
          ...MOCK_ALLOCATION_DATA,
          recommendedAllocation: true,
        },
      },
    });

    // Act
    const allocationSection = await waitForElement(() => getByTestId('allocation-details-section'));
    const recommendedAllocationInput = getByNameAttribute(allocationSection, 'allocationFlag');
    act(() => {
      setBooleanField(recommendedAllocationInput, false);
    });
    await waitForElement(() => getByTestId('confirmation-modal'));
    const confirmButton = getByTestId('confirm-dialog-submit');
    fireEvent.click(confirmButton);
    const subjectDeductionInput = await waitForElement(() => getByNameAttribute(allocationSection, 'ownHomeDeduction.taxableSubjectAmount'));

    // Assert
    await wait(() => expect(subjectDeductionInput.value).toStrictEqual(MOCK_ALLOCATION_DATA.ownHomeDeduction.taxableSubjectAmount));
  });
});

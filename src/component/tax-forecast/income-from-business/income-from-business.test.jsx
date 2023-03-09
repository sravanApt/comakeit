import React from 'react';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  act,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import IncomeFromBusiness from './income-from-business';
import TaxForecastContext from '../tax-forecast-context';
import {
  INCOME_FROM_BUSINESS_DETAILS,
  mockGetBusinessFormTypes,
  mockGetBusinessPartners,
} from './income-from-business.test.data';
import {
  COUNTRIES, TAB_OPTIONS, ACTIVE_TAB, ACTIVE_PARTNER_OBJECT,
} from '../tax-forecast.test.data';
import { getActivePartnerTab, changeInput } from '../../../common/test-helpers';

const saveDossierDetails = jest.fn();
const setActiveTab = jest.fn();

const openModalAndChangeField = async (getByTestId, modalTestId, inputFieldTestId, inputFieldValue, inputName) => {
  fireEvent.click(getByTestId(modalTestId));
  const inputField = await waitForElement(() => getByNameAttribute(getByTestId(inputFieldTestId), inputName));
  changeInput(inputField, inputFieldValue);
  fireEvent.blur(inputField);
};

const setupDom = ({
  initialData = INCOME_FROM_BUSINESS_DETAILS, countries = COUNTRIES, tabOptions = TAB_OPTIONS, activeTab = ACTIVE_TAB,
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      saveDossierDetails,
      countries,
      tabOptions,
      setActiveTab,
      isPartner: !!activeTab,
      activeTab,
    }
  }
  >
    <IncomeFromBusiness />
  </TaxForecastContext.Provider>,
  mockGetBusinessFormTypes(),
);

describe('Income from Business', () => {
  afterEach(fetchMock.restore);
  it('should be switch to the parner tab in income from business', async () => {
    // Arrange
    const { getByTestId } = setupDom(ACTIVE_PARTNER_OBJECT);

    // Act
    const partnerTab = getActivePartnerTab(getByTestId);

    // Assert
    await wait(() => expect(partnerTab.classList.contains('mdc-tab--active')).toEqual(true));
  });

  it('should be able to display add administration modal', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('add-administration'));
    });

    // Assert
    expect(getByTestId('add-administration-modal')).toBeInTheDocument();
  });

  it('should be able to close add administration modal', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('add-administration'));
    });

    const administrationModalContainer = await waitForElement(() => getByTestId('add-administration-modal'));
    const closeIcon = getByTestId('close-icon');
    fireEvent.click(closeIcon);

    // Assert
    expect(administrationModalContainer).not.toBeInTheDocument();
  });

  it('should be able to display edit administration modal', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId } = setupDom();

    // Act
    await act(async () => {
      await fireEvent.click(getByTestId('edit-0'));
    });

    // Assert
    expect(getByTestId('edit-administration-modal')).toBeInTheDocument();
  });

  it('should display validation message when rsin field is not numeric and length is not equal to 9', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId } = setupDom({ initialData: INCOME_FROM_BUSINESS_DETAILS });

    // Act
    await act(async () => {
      await openModalAndChangeField(getByTestId, 'add-administration', 'rsin-input', 'a12345', 'rsin');
    });

    // Assert
    await wait(() => expect(getByTestId('error-rsin')).toBeInTheDocument());
  });

  it('should not display error message when rsin field is empty', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: INCOME_FROM_BUSINESS_DETAILS });

    // Act
    await act(async () => {
      await openModalAndChangeField(getByTestId, 'add-administration', 'rsin-input', '', 'rsin');
    });

    // Assert
    await wait(() => expect(queryByTestId('error-rsin')).toBeNull());
  });

  it('should not display error message when rsin field value is numeric and length equal to 9', async () => {
    mockGetBusinessPartners();
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: INCOME_FROM_BUSINESS_DETAILS });

    // Act
    await act(async () => {
      await openModalAndChangeField(getByTestId, 'add-administration', 'rsin-input', '123456789', 'rsin');
    });

    // Assert
    await wait(() => expect(queryByTestId('error-rsin')).toBeNull());
  });
});

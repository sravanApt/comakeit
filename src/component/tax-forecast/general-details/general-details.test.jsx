import React from 'react';
import {
  render,
  wait,
  waitForElement,
  act,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import GeneralDetails from './general-details';
import TaxForecastContext from '../tax-forecast-context';
import { GLOBAL_CLIENT_ID } from '../tax-forecast.test.data';
import {
  changeInput,
} from '../../../common/test-helpers';
import { GENERAL_DETAILS } from './general-details.test.data';
import { getCurrentDate } from '../../../common/utils';

const saveDossierDetails = jest.fn();

// TODO: Will be reverted after Elfin release
// const mockGetEmailList = () => fetchMock.get(
//   `/vpd-api/v1.0/organization-units/${MOCK_TAXABLE_SUBJECT_ID}/user-list`,
//   {
//     body: EMAIL_OPTIONS,
//   },
// );

const setupComponent = ({
  initialData = GENERAL_DETAILS,
  searchQuery = '',
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails,
    }
  }
  >
    <GeneralDetails location={{ search: searchQuery }} />
  </TaxForecastContext.Provider>,
  // mockGetEmailList(),
);

describe('Tax Forecast General Information', () => {
  afterEach(fetchMock.restore);

  it('should be able to load general details section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Assert
    await wait(() => expect(getByTestId('general-details-container')).toBeInTheDocument());
  });

  it('should be able to call the saveDossierDetails function', async () => {
    // Arrange
    const { getByTestId } = setupComponent();
    const subjectedToDutchTaxInput = await waitForElement(() => getByTestId('taxable-subject-general-info-section-beconNumber'));

    // Act
    await act(() => {
      changeInput(getByNameAttribute(subjectedToDutchTaxInput, 'taxablesubjectGeneralInformation.beconNumber'), '123456');
    });

    // Assert
    await wait(() => expect(saveDossierDetails).toHaveBeenCalled());
  });

  it('should set due date for fiscal partner on change of taxable subject due date', async () => {
    // Arrange
    const { getByTestId } = setupComponent();
    const generalDetailsContainer = await waitForElement(() => getByTestId('general-details-container'));
    const dueDateInput = generalDetailsContainer.querySelector('.due-date .SingleDatePickerInput .DateInput_input');

    // Act
    await act(() => {
      changeInput(dueDateInput, getCurrentDate('YYYY-MM-DD'));
    });

    // Assert
    await wait(() => expect(getByTestId('fiscal-partner-due-date').innerHTML).toBe(getCurrentDate('DD-MM-YYYY')));
  });
});

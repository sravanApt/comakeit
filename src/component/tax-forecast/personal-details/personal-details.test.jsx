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
import PersonalDetails from './personal-details';
import TaxForecastContext from '../tax-forecast-context';
import {
  mockGetMaritalStatuses,
  mockGetLivingTogetherSituations,
  mockGetChildrenRegisteredAddresses,
  mockGetTaxFormTypes,
  PERSONAL_DETAILS,
  PERSONAL_DETAILS_EMPTY_VALUES,
  PERSONAL_DETAILS_WITHOUT_MARITAL_STATUS,
  PERSONAL_DETAILS_WITHOUT_PARTNER,
  F_FORM,
  MOCK_INCOME_TAX_CLIENT_DETAILS,
  MOCK_INCOME_TAX_CLIENTS,
  SEARCH_STRING,
  TAXABLE_SUBJECT_ID,
  MOCK_GLOBAL_ADVISER_ID,
  MOCK_SUBJECT_BSN,
  MOCK_PARTNER_BSN,
  PERSONALDETAILS_PARTNER_DOD,
} from './personal-details.test.data';
import { GLOBAL_CLIENT_ID, mockAutoSaveDeclaration } from '../tax-forecast.test.data';
import {
  selectAutoCompleteOption, changeInput, setBooleanField, getAsyncAutocompleteOptions,
} from '../../../common/test-helpers';

const { dossierManifest: { taxableYear, declarationTypeId } } = PERSONAL_DETAILS;

const FISAL_PARTNER_DETAILS_ERROR_RESPONSE = {
  meta: null,
  errors: [
    {
      id: 'faf20887-f9c0-4b52-b3d7-7570417ea2ab',
      status: 400,
      detail: 'Failed due to fiscal partner already has another open dossier',
    },
  ],
  content: null,
};

const mockGetTaxableSubjectDetails = (data = MOCK_INCOME_TAX_CLIENT_DETAILS) => fetchMock.get(
  `/itx-api/v1/declaration/fiscal-partner?fiscalPartnerClientId=${TAXABLE_SUBJECT_ID}&taxationYear=${taxableYear}&declarationTypeId=${declarationTypeId}`,
  {
    body: data,
  },
);

const mockGetIncomeTaxClients = (response = MOCK_INCOME_TAX_CLIENTS) => fetchMock.get(
  `/itx-api/v1/income-tax-client/${MOCK_GLOBAL_ADVISER_ID}/client/search-by-name?searchBy=${SEARCH_STRING}`,
  {
    body: response,
  },
);

const setupDom = ({ initialData = PERSONAL_DETAILS } = {}) => render(
  <TaxForecastContext.Provider
    value={{
      dossierData: initialData,
      saveDossierDetails: jest.fn(),
      globalClientId: GLOBAL_CLIENT_ID,
      globalAdviserId: MOCK_GLOBAL_ADVISER_ID,
      removePartnerData: jest.fn(),
    }}
  >
    <PersonalDetails />
  </TaxForecastContext.Provider>,
  mockGetMaritalStatuses(),
  mockGetLivingTogetherSituations(),
  mockGetChildrenRegisteredAddresses(),
  mockGetTaxFormTypes(),
  mockAutoSaveDeclaration(),
);

describe('tax forecast personal details - personal-details.test.jsx', () => {
  afterEach(fetchMock.restore);

  it('should display taxable subject personal details', async () => {
    await act(async () => {
      // Arrange
      const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });

      // Act
      const personalDetails = await waitForElement(() => getByTestId('personal-details-container'));

      // Assert
      expect(personalDetails).toBeInTheDocument();
    });
  }, 10000);

  it('should be able to select living togehter value in status dropdown and show living togehter component', async () => {
    // Arrange
    const { getByText, getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 1);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    expect(getByText('Samenwoonsituatie')).toBeInTheDocument();
  });

  it('should be able to select single for whole year value in status dropdown', async () => {
    // Arrange
    const { getAllByText, getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 2);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    expect(getAllByText('Single for whole year').length).toBe(1);
  });

  it('should be able to select status changed value in status dropdown and show status changed component', async () => {
    // Arrange
    const { getByText, getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 3);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    expect(getByText('Situatie gewijzigd')).toBeInTheDocument();
  });

  it('should be able to select the sitution changed option in taxable subject section', async () => {
    // Arrange
    const { getAllByText, getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const maritalStatusOption = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 1);
    fireEvent.click(maritalStatusOption);
    const situationChangedOption = selectAutoCompleteOption(personalDetailsContainer, '.situation-status-select', 1);
    act(() => {
      fireEvent.click(situationChangedOption);
    });

    // Assert
    expect(getAllByText('A child together').length).toBe(1);
  });

  it('should be able to select the Married/registered partnership for whole year if partner data is there', async () => {
    // Arrange
    const { getAllByText } = setupDom({ initialData: PERSONAL_DETAILS_WITHOUT_MARITAL_STATUS });

    // Assert
    await wait(() => expect(getAllByText('Married/registered partnership for whole year').length).toBe(2));
  });

  it('should display representative section if death date is available for subject', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_WITHOUT_MARITAL_STATUS });

    // Assert
    await wait(() => expect(getByTestId('representative-details')).toBeInTheDocument());
  });

  it('should display representative section if death date is available for partner', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONALDETAILS_PARTNER_DOD });

    // Assert
    await wait(() => expect(getByTestId('representative-details')).toBeInTheDocument());
  });

  it('should be able to remove the date in date of death for partner', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONALDETAILS_PARTNER_DOD });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const removeIcon = await waitForElement(() => personalDetailsContainer.querySelector('.partner-death-date .SingleDatePickerInput .SingleDatePickerInput_clearDate'));

    // Act
    act(() => {
      fireEvent.click(removeIcon);
    });

    // Assert
    const deathDateInput = personalDetailsContainer.querySelector('.partner-death-date .SingleDatePickerInput .DateInput_input');
    await wait(() => expect(deathDateInput.value).toBe(''));
  }, 10000);

  it('should display the error if wrong zip code is entered', async () => {
    // Arrange
    const zipCodeValue = 'FFTATF';
    const { getByTestId, queryByTestId } = setupDom({ initialData: PERSONALDETAILS_PARTNER_DOD });

    const zipCode = await waitForElement(() => getByNameAttribute(getByTestId('representative-zip-code'), 'representative.address.zipCode'));

    // Act
    act(() => {
      changeInput(zipCode, zipCodeValue);
      fireEvent.blur(zipCode);
    });

    // Assert
    await wait(() => expect(queryByTestId('error-representative.address.zipCode')).toBeInTheDocument());
  }, 20000);

  it('should display the error if representative bsn is same as child bsn', async () => {
    // Arrange
    const childBsnValue = '757398303';
    const { getByTestId, queryByTestId } = setupDom({ initialData: PERSONALDETAILS_PARTNER_DOD });
    const bsn = await waitForElement(() => getByNameAttribute(getByTestId('representative-bsn'), 'representative.person.bsn'));

    // Act
    act(() => {
      changeInput(bsn, childBsnValue);
      fireEvent.blur(bsn);
    });

    // Assert
    await wait(() => expect(queryByTestId('error-representative.person.bsn')).toBeInTheDocument());
  });

  it('should display the same value in fiscal partner section on select of living together precise situation select component in taxble subject monitor', async () => {
    // Arrange
    const { getAllByText, getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const maritalStatusOption = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 1);
    fireEvent.click(maritalStatusOption);
    const situationChangedOption = selectAutoCompleteOption(personalDetailsContainer, '.situation-status-select', 1);
    act(() => {
      fireEvent.click(situationChangedOption);
    });

    // Assert
    expect(getAllByText('A child together').length).toBe(2);
  });

  it('should be able to select the Single for whole year if partner data is not there', async () => {
    // Arrange
    const { getAllByText } = setupDom({ initialData: PERSONAL_DETAILS_WITHOUT_PARTNER });

    // Assert
    await wait(() => expect(getAllByText('Single for whole year').length).toBe(1));
  });

  it('should be able remove the date in date of death', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_WITHOUT_PARTNER });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const removeIcon = await waitForElement(() => personalDetailsContainer.querySelector('.date-of-death .SingleDatePickerInput .SingleDatePickerInput_clearDate'));

    // Act
    act(() => {
      fireEvent.click(removeIcon);
    });

    // Assert
    const deathDateInput = personalDetailsContainer.querySelector('.date-of-death .SingleDatePickerInput .DateInput_input');
    await wait(() => expect(deathDateInput.value).toBe(''));
  }, 10000);

  it('should be able to add and remove child in personal details', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const addChild = await waitForElement(() => getByTestId('add-new-child'));
    const childrenTable = await waitForElement(() => getByTestId('children-table'));
    const initialrows = childrenTable.querySelectorAll('.common-data-table__row');

    // Act - add child
    act(() => {
      fireEvent.click(addChild);
    });

    const removeChild = childrenTable.querySelector('.icon__actions--remove');
    // Act - remove child
    act(() => {
      fireEvent.click(removeChild);
    });

    // Assert
    const rows = childrenTable.querySelectorAll('.common-data-table__row');
    await wait(() => expect(rows.length).toBe(initialrows.length));
  });

  it('should display error if name value is empty in child section', async () => {
    // Arrange
    const row = 1;
    const { getByTestId, queryByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const addChild = await waitForElement(() => getByTestId('add-new-child'));

    // Act - add child
    act(() => {
      fireEvent.click(addChild);
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.name`)).toBeInTheDocument());
  }, 10000);

  it('should display error if name date of birth is empty in child section', async () => {
    // Arrange
    const row = 1;
    const { getByTestId, queryByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const addChild = await waitForElement(() => getByTestId('add-new-child'));

    // Act - add child
    act(() => {
      fireEvent.click(addChild);
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.dateOfBirth`)).toBeInTheDocument());
  }, 10000);

  it('should be able to change registration address of child in children table', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const childrenTable = await waitForElement(() => getByTestId('children-table'));
    const tableRow = childrenTable.querySelector('.common-data-table__body .common-data-table__row');

    // Act
    expect(tableRow.querySelector('.registration-on-select .react-select__single-value').textContent).toEqual(PERSONAL_DETAILS_EMPTY_VALUES.masterData.childRegisteredOnAddressOptions[0].displayName);
    const option = selectAutoCompleteOption(tableRow, '.registration-on-select', 1, true);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    await wait(() => expect(tableRow.querySelector('.registration-on-select .react-select__single-value').textContent).toEqual(PERSONAL_DETAILS_EMPTY_VALUES.masterData.childRegisteredOnAddressOptions[1].displayName));
  }, 10000);

  it('should be able to un-check co-parenting checkbox of child in children table', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const coParentingCheckBox = await waitForElement(() => getByNameAttribute(getByTestId('co-parent-check-box-1'), 'children.1.isCoParenting'));

    // Act
    act(() => {
      setBooleanField(coParentingCheckBox, false);
    });

    // Assert
    expect(coParentingCheckBox.checked).toEqual(false);
  });

  it('should be able to un-check co-parenting checkbox of child when updated registration address other than ex-partner in children table', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const childrenTable = await waitForElement(() => getByTestId('children-table'));
    const tableRow = childrenTable.querySelector('.common-data-table__body .common-data-table__row');
    const coParentingCheckBox = await waitForElement(() => getByNameAttribute(getByTestId('co-parent-check-box-1'), 'children.1.isCoParenting'));
    setBooleanField(coParentingCheckBox, true);

    // Act
    const option = selectAutoCompleteOption(tableRow, '.registration-on-select', 2, true);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    await wait(() => expect(coParentingCheckBox.checked).toEqual(false));
  }, 10000);

  it('should disable form type drop down and default it to f-form, if date of death is entered', async () => {
    // Arrange
    const { getByTestId, queryAllByText } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const deathDateInput = personalDetailsContainer.querySelector('.date-of-death .SingleDatePickerInput .DateInput_input');

    // Act - enter death date
    act(() => {
      changeInput(deathDateInput, '2018-02-03');
    });

    // Assert
    expect(queryAllByText(F_FORM)).not.toBeNull();
  });

  it('should disable form type drop down and default it to f-form, if date of death is entered for fiscal partner', async () => {
    // Arrange
    const { getByTestId, queryAllByText } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const deathDateInput = personalDetailsContainer.querySelector('.partner-death-date .SingleDatePickerInput .DateInput_input');

    // Act - enter death date
    act(() => {
      changeInput(deathDateInput, '2018-02-03');
    });

    // Assert
    expect(queryAllByText(F_FORM)).not.toBeNull();
  });

  it('should show the fiscal partner section when click on add fiscal partner button', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });

    // Act
    const addFiscalPartnerButton = await waitForElement(() => getByTestId('add-new-fiscal-partner'));
    await act(async () => {
      await fireEvent.click(addFiscalPartnerButton);
    });
    const fiscalPartnerContainer = await waitForElement(() => getByTestId('fiscal-partner-details-section'));

    // Assert
    expect(fiscalPartnerContainer).toBeInTheDocument();
  }, 10000);

  it('should display the confirmation modal when select single for whole year value in marital status dropdown', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS });
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 2);
    act(() => {
      fireEvent.click(option);
    });

    // Assert
    await wait(() => expect(getByTestId('remove-fiscal-partner-modal')).toBeInTheDocument());
  }, 10000);

  it('should display the confirmation modal on click of remove fiscal partner', async () => {
    // Arrange
    mockGetIncomeTaxClients();
    mockGetTaxableSubjectDetails();
    const { getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const options = await getAsyncAutocompleteOptions(personalDetailsContainer, '.search-fiscal-partner-list', SEARCH_STRING);
    act(() => {
      fireEvent.click(options[0]);
    });
    const removeButton = await waitForElement(() => getByTestId('remove-fiscal-partner'));
    fireEvent.click(removeButton);

    // Assert
    await wait(() => expect(getByTestId('remove-fiscal-partner-modal')).toBeInTheDocument());
  }, 20000);

  it('should remove the fiscal partner on click of confirm button in confirmation modal', async () => {
    // Arrange
    mockGetIncomeTaxClients();
    mockGetTaxableSubjectDetails();
    const { getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const options = await getAsyncAutocompleteOptions(personalDetailsContainer, '.search-fiscal-partner-list', SEARCH_STRING);
    act(() => {
      fireEvent.click(options[0]);
    });
    const removeButton = await waitForElement(() => getByTestId('remove-fiscal-partner'));
    fireEvent.click(removeButton);

    const confirmButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(confirmButton);
    const input = await waitForElement(() => personalDetailsContainer.querySelector('.search-fiscal-partner-list input'));
    // Assert
    expect(input.value).toBe('');
  }, 10000);

  it('should remove fiscal partner options on blur of search input', async () => {
    // Arrange
    mockGetIncomeTaxClients();
    mockGetTaxableSubjectDetails();
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const addFiscalPartnerButton = await waitForElement(() => getByTestId('add-new-fiscal-partner'));
    await act(async () => {
      await fireEvent.click(addFiscalPartnerButton);
    });
    const fiscalPartnerContainer = await waitForElement(() => getByTestId('fiscal-partner-details-section'));

    // Act - search  for taxableSubject
    const input = fiscalPartnerContainer.querySelector('.search-fiscal-partner-list input');
    fireEvent.change(input, { target: { value: SEARCH_STRING } });
    await act(async () => {
      fireEvent.blur(input);
    });

    // Assert
    expect(fiscalPartnerContainer.querySelectorAll('.search-fiscal-partner-list .react-select__option').length).toEqual(0);
  }, 20000);

  it('should not show error if birthDate is less than deathDate in children table', async () => {
    // Arrange
    const row = 0;
    const { getByTestId, queryByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });
    const addChild = await waitForElement(() => getByTestId('add-new-child'));
    const childrenTable = await waitForElement(() => getByTestId('children-table'));

    // Act - add child row
    act(() => {
      fireEvent.click(addChild);
    });

    const birthDate = childrenTable.querySelector('.date-of-birth-child .SingleDatePickerInput .DateInput_input');
    const deathDate = childrenTable.querySelector('.date-of-death-child .SingleDatePickerInput .DateInput_input');

    // Act - enter dates
    act(() => {
      changeInput(birthDate, '1999-02-03');
      changeInput(deathDate, '2019-02-03');
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.dateOfBirth`)).toBeNull());
    await wait(() => expect(queryByTestId(`error-children.${row}.dateOfDeath`)).toBeNull());
  }, 10000);

  it('should show error if children bsn is same as subject bsn', async () => {
    // Arrange
    const row = 0;
    const { getByTestId, queryByTestId } = await setupDom({ initialData: PERSONAL_DETAILS });
    const childBsn = await waitForElement(() => getByNameAttribute(getByTestId(`bsn-child${row}`), `children.${row}.bsn`));

    // Act - enter bsn
    act(() => {
      changeInput(childBsn, MOCK_SUBJECT_BSN);
      fireEvent.blur(childBsn);
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.bsn`)).toBeInTheDocument());
  }, 10000);

  it('should show error if children bsn is same as partner bsn', async () => {
    // Arrange
    const row = 0;
    const { getByTestId, queryByTestId } = await setupDom({ initialData: PERSONAL_DETAILS });
    const childBsn = await waitForElement(() => getByNameAttribute(getByTestId(`bsn-child${row}`), `children.${row}.bsn`));

    // Act - enter bsn
    act(() => {
      changeInput(childBsn, MOCK_PARTNER_BSN);
      fireEvent.blur(childBsn);
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.bsn`)).toBeInTheDocument());
  }, 10000);

  it('should show error if empty value given as children bsn', async () => {
    // Arrange
    const row = 0;
    const { getByTestId, queryByTestId } = await setupDom({ initialData: PERSONAL_DETAILS });
    const childBsn = await waitForElement(() => getByNameAttribute(getByTestId(`bsn-child${row}`), `children.${row}.bsn`));

    // Act - enter bsn
    act(() => {
      changeInput(childBsn, '');
      fireEvent.blur(childBsn);
    });

    // Assert
    await wait(() => expect(queryByTestId(`error-children.${row}.bsn`)).toBeInTheDocument());
  }, 10000);

  it('is joint declaration checkbox should be disabled if fiscal partner is not selected', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: PERSONAL_DETAILS_EMPTY_VALUES });

    // Act
    const addFiscalPartnerButton = await waitForElement(() => getByTestId('add-new-fiscal-partner'));
    await act(async () => {
      await fireEvent.click(addFiscalPartnerButton);
    });
    const jointDeclarationCheckbox = await waitForElement(() => getByTestId('joint-declaration'));

    // Assert
    expect(getByNameAttribute(jointDeclarationCheckbox, 'isJointDeclaration').disabled).toBe(true);
  });

  it('is joint declaration checkbox should be enabled if fiscal partner is selected', async () => {
    // Arrange
    mockGetIncomeTaxClients();
    mockGetTaxableSubjectDetails();
    const { getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const options = await getAsyncAutocompleteOptions(personalDetailsContainer, '.search-fiscal-partner-list', SEARCH_STRING);
    act(() => {
      fireEvent.click(options[0]);
    });
    const jointDeclarationCheckbox = await waitForElement(() => getByNameAttribute(getByTestId('joint-declaration'), 'isJointDeclaration'));
    setBooleanField(jointDeclarationCheckbox, true);

    // Assert
    expect(jointDeclarationCheckbox.disabled).toBe(false);
    expect(jointDeclarationCheckbox.checked).toBe(true);
  }, 10000);

  it('should display the error if failed to fetch the fiscal parner details', async () => {
    // Arrange
    mockGetIncomeTaxClients();
    const { getByTestId } = setupDom();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const options = await getAsyncAutocompleteOptions(personalDetailsContainer, '.search-fiscal-partner-list', SEARCH_STRING);
    mockGetTaxableSubjectDetails(FISAL_PARTNER_DETAILS_ERROR_RESPONSE);
    act(() => {
      fireEvent.click(options[0]);
    });

    // Assert
    await wait(() => expect(getByTestId('error-fiscal-partner')).toBeInTheDocument());
  }, 20000);
});

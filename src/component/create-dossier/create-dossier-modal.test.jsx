import React from 'react';
import {
  render,
  wait,
  fireEvent,
  waitForElement,
  act,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import CreateDossierModal from './create-dossier-modal';
import { getAsyncAutocompleteOptions, selectAutoCompleteOption, changeInput } from '../../common/test-helpers';
import {
  MOCK_TAXABLE_SUBJECTS,
  MOCK_TAXABLESUBJECT_DETAILS,
  SEARCH_STRING,
  PARTNER_SEARCH_STRING,
  PERIODS,
  DOSSIER_TYPES,
  VIOLATIONS,
  mockGetTaxFormTypes,
  mockGetTaxationYearsWithTaxableYear,
  MOCK_GLOBAL_CLIENT_ID,
  MOCK_GLOBAL_ADVISER_ID,
  mockGetDossierList,
  mockGetDossierInfo,
} from './create-dossier-modal.test.data';
import { CURRENT_YEAR } from './create-dossier-constants';

const mockGetDossierTypes = ({ data = DOSSIER_TYPES, taxableYear = CURRENT_YEAR } = {}) => fetchMock.get(
  `/itx-api/v1/declaration/declaration-types?taxableYear=${taxableYear}`,
  {
    body: data,
  },
);

const mockGetTaxableSubjects = (response = MOCK_TAXABLE_SUBJECTS) => fetchMock.get(
  `/itx-api/v1/income-tax-client/${MOCK_GLOBAL_ADVISER_ID}/client/search-by-name?searchBy=${SEARCH_STRING}`,
  {
    body: response,
  },
);

const mockSaveDossier = (data = {}) => fetchMock.post(
  `/itx-api/v1/client-dossiers/${MOCK_GLOBAL_CLIENT_ID}/declaration-dossiers`,
  {
    body: data,
  },
);

const mockGetTaxableSubjectDetails = ({ data = MOCK_TAXABLESUBJECT_DETAILS } = { birthDate: '' }) => fetchMock.get(
  `/itx-api/v1/income-tax-client/${MOCK_GLOBAL_CLIENT_ID}`,
  {
    body: data,
  },
);

const createNewDossier = async (dossierForm) => {
  mockGetDossierTypes();
  mockGetDossierList();
  await wait();
  const periodOption = selectAutoCompleteOption(dossierForm, '.period-options', 0, true);
  fireEvent.click(periodOption);
  await wait();
  const typeoption = selectAutoCompleteOption(dossierForm, '.dossier-type-options', 0, true);
  fireEvent.click(typeoption);

  const formOption = selectAutoCompleteOption(dossierForm, '.tax-form-options', 0, true);
  fireEvent.click(formOption);

  const partnerOptions = await getAsyncAutocompleteOptions(dossierForm, '.search-fiscal-partner-list', PARTNER_SEARCH_STRING, true);
  fireEvent.click(partnerOptions[0]);

  fireEvent.submit(dossierForm);
};

const setupDom = ({
  showModal = true,
  preiods = PERIODS.content,
  dossierTypes = DOSSIER_TYPES.content,
  onClose = jest.fn(),
  taxableSubjectData = MOCK_TAXABLESUBJECT_DETAILS,
  globalAdviserId = MOCK_GLOBAL_ADVISER_ID,
} = {}) => render(
  <CreateDossierModal
    showModal={showModal}
    periodOptions={preiods}
    dossierTypeOptions={dossierTypes}
    onCloseModal={onClose}
    taxableSubjectData={taxableSubjectData}
    globalAdviserId={globalAdviserId}
  />,
  mockGetTaxableSubjectDetails(),
  mockGetTaxFormTypes(),
  mockGetTaxableSubjects(),
  mockGetTaxationYearsWithTaxableYear(),
);

describe('Create Dossier Modal', () => {
  afterEach(fetchMock.restore);

  it('should load the fiscal partner list options, other than selected taxable subject', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act - search & select 1st option for taxableSubject
    const fiscalPartnerOptions = await getAsyncAutocompleteOptions(dossierForm, '.search-fiscal-partner-list', SEARCH_STRING, true);

    // Assert - subtracting 1, since an option is already selected as taxableSubject
    expect(fiscalPartnerOptions.length).toEqual(MOCK_TAXABLE_SUBJECTS.content.length - 1);
  });

  it('should remove fiscal patner name on click of close icon', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act - search  for taxableSubject
    const fiscalPartnerOptions = await getAsyncAutocompleteOptions(dossierForm, '.search-fiscal-partner-list', SEARCH_STRING, true);
    fireEvent.click(fiscalPartnerOptions[1]);
    const removeIcon = await waitForElement(() => dossierForm.querySelector('.search-fiscal-partner-list .react-select__clear-indicator'));
    fireEvent.click(removeIcon);
    const input = dossierForm.querySelector('.search-fiscal-partner-list input');

    // Assert
    expect(input.value).toBe('');
  });

  it('should remove options on blur of partner input', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act - search  for taxableSubject
    const input = dossierForm.querySelector('.search-fiscal-partner-list input');
    fireEvent.change(input, { target: { value: SEARCH_STRING } });
    await act(async () => {
      fireEvent.blur(input);
    });

    // Assert
    expect(dossierForm.querySelectorAll('.search-fiscal-partner-list .react-select__option').length).toEqual(0);
  });

  it('should always show only current year in taxationYear dropdown', async () => {
    // Arrange
    mockGetDossierTypes();
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act - select first option
    const firstOptionInPeriodDropdown = selectAutoCompleteOption(dossierForm, '.period-options', 0, true);
    act(() => {
      fireEvent.click(firstOptionInPeriodDropdown);
    });
    const selectedPeriodValue = dossierForm.querySelector('.period-options .react-select__single-value').textContent;

    // Assert
    await wait(() => expect(selectedPeriodValue).toBe(CURRENT_YEAR));
  });

  it('should not show death date field, if form type is P-FORM', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act
    const formOption = await selectAutoCompleteOption(dossierForm, '.tax-form-options', 0, true);
    fireEvent.click(formOption);

    // Assert
    expect(dossierForm.querySelector('.taxable-subject-death-date')).toBeNull();
  });

  it('should show death date validation error if dateOfDeath less than birthDate', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act
    const formOption = await selectAutoCompleteOption(dossierForm, '.tax-form-options', 1, true);
    fireEvent.click(formOption);
    const dateOfDeath = await waitForElement(() => dossierForm.querySelector('.taxable-subject-death-date .SingleDatePickerInput .DateInput_input'));
    await changeInput(dateOfDeath, '04-04-1990');

    // Assert
    await wait(() => expect(getByTestId('error-dateOfDeath')).not.toBeNull());
  });

  it('should be able to call api after submit create dossier form', async () => {
    // Arrange
    mockSaveDossier();
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act
    await act(async () => {
      await createNewDossier(dossierForm);
    });

    // Assert
    await wait(() => expect(fetchMock.called(`/itx-api/v1/client-dossiers/${MOCK_GLOBAL_CLIENT_ID}/declaration-dossiers`)).toEqual(true));
  }, 10000);

  it('should be able to display error when failed create new dossier', async () => {
    // Arrange
    mockSaveDossier(VIOLATIONS);
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act
    await act(async () => {
      await createNewDossier(dossierForm);
    });

    // Assert
    const errorNotification = await waitForElement(() => getByTestId('create-dossier-notification-bar'));
    await wait(() => expect(errorNotification).toBeInTheDocument());
  }, 10000);

  it('should call dossier list api on select of dossier form', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const dossierForm = await waitForElement(() => getByTestId('create-tax-dossier-form'));

    // Act
    await act(async () => {
      mockGetDossierTypes();
      await wait();
      const periodOption = selectAutoCompleteOption(dossierForm, '.period-options', 0, true);
      fireEvent.click(periodOption);
      mockGetDossierList();
      await wait();
      const typeoption = selectAutoCompleteOption(dossierForm, '.dossier-type-options', 0, true);
      fireEvent.click(typeoption);
      mockGetDossierInfo();
      await wait();
      const dossierOption = selectAutoCompleteOption(dossierForm, '.copy-dossier-list-select', 0, true);
      fireEvent.click(dossierOption);
    });

    // Assert
    expect(fetchMock.called(`/itx-api/v1/declaration/${MOCK_GLOBAL_CLIENT_ID}/dossier-names?globalAdviserId=${MOCK_GLOBAL_ADVISER_ID}&taxationYear=${CURRENT_YEAR}`)).toEqual(true);
  }, 10000);
});

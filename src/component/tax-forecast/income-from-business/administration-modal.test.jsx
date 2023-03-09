import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  wait,
  act,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import { createQueryString } from '@visionplanner/vp-ui-fiscal-library';
import AdministrationModal from './administration-modal';
import {
  INCOME_FROM_BUSINESS_DETAILS,
  INCOME_FROM_BUSINESS_DETAILS_WITH_EMPTY_SUBJECT,
  mockGetBusinessFormTypes,
  mockGetBusinessPartners,
  mockSaveAdministrationDetails,
  MOCK_NEW_ADMINISTRATION_DATA_SUBJECT,
  MOCK_NEW_ADMINISTRATION_DATA_PARTNER,
  MOCK_VPC_ADMINISTRATION_LIST,
  MOCK_VPC_ADMINISTRATION_DETAILS,
  SEARCH_STRING,
  ADMINISTRATION_ID,
  ADVISER_ID,
  MOCK_EDIT_ADMINISTRATION_DATA,
  MOCK_EDIT_ADMINISTRATION_DATA_WITH_PARTNER,
} from './income-from-business.test.data';
import {
  COUNTRIES,
  ACTIVE_TAB,
  ACTIVE_PARTNER_OBJECT,
} from '../tax-forecast.test.data';
import { changeInput, selectAutoCompleteOption, getAsyncAutocompleteOptions } from '../../../common/test-helpers';
import {
  dateToDayMonthAndYearString,
  startDateofYear,
  endDateofYear,
  getCurrentYear,
} from '../../../common/utils';
import { LEGAL_FORM_FILTERS } from '../tax-forecast.constants';

const saveDossierDetails = jest.fn();
const fetchVPCFinancialData = jest.fn();
const onClose = jest.fn();

const mockGetAdministrationDetails = (data = MOCK_VPC_ADMINISTRATION_DETAILS) => fetchMock.get(
  `/itx-api/v1/administration/${ADMINISTRATION_ID}`,
  {
    body: data,
  },
);

const createSearchAdministrationUrl = (SEARCH_STRING) => {
  const url = `/itx-api/v1/administration/search-by-name/${ADVISER_ID}`;
  const queryString = createQueryString({
    searchBy: SEARCH_STRING, filter: LEGAL_FORM_FILTERS,
  });
  return `${url}${queryString}`;
};

const mockGetVpcAdministrations = (response = MOCK_VPC_ADMINISTRATION_LIST) => fetchMock.get(
  createSearchAdministrationUrl(SEARCH_STRING),
  {
    body: response,
  },
);

const setupDom = ({
  initialData = INCOME_FROM_BUSINESS_DETAILS,
  activeTab = ACTIVE_TAB,
  globalAdministrationId = '',
  isEditMode = false,
  dataTa = 'add-administration-modal',
} = {}) => render(
  <AdministrationModal
    onCloseModal={onClose}
    contextData={{
      dossierData: initialData,
      saveDossierDetails,
      globalAdviserId: ADVISER_ID,
      countries: COUNTRIES,
      isPartner: !!activeTab,
      fetchVPCFinancialData,
      taxableYear: initialData.dossierManifest.taxableYear,
    }}
    administrationId={globalAdministrationId}
    isEditMode={isEditMode}
    dataTa={dataTa}
  />,
  mockGetBusinessFormTypes(),
  mockGetBusinessPartners(),
);

const submitCreateAdministrationForm = async (getByTestId, administrationForm, data) => {
  mockSaveAdministrationDetails();
  changeInput(getByNameAttribute(getByTestId('business-name-input'), 'businessName'), data.businessName);
  changeInput(getByNameAttribute(getByTestId('business-activity-input'), 'businessActivities'), data.businessActivities);
  const option = selectAutoCompleteOption(administrationForm, '.business-form--select', data.businessPartnerId ? 1 : 0, true);
  fireEvent.click(option);
  changeInput(administrationForm.querySelector('.fiscal-year-start-date .SingleDatePickerInput .DateInput_input'), data.fiscalYearStartDate);
  changeInput(administrationForm.querySelector('.fiscal-year-end-date .SingleDatePickerInput .DateInput_input'), data.fiscalYearEndDate);
  if (data.businessPartnerId) {
    const partnerOption = selectAutoCompleteOption(administrationForm, '.business-partner--select', 1, true);
    fireEvent.click(partnerOption);
  }
  const countryOption = selectAutoCompleteOption(administrationForm, '.country-code--select', 0, true);
  fireEvent.click(countryOption);
  changeInput(administrationForm.querySelector('.business-start-date .SingleDatePickerInput .DateInput_input'), dateToDayMonthAndYearString(data.businessStartDate, 'DD-MM-YYYY'));
  changeInput(administrationForm.querySelector('.business-end-date .SingleDatePickerInput .DateInput_input'), dateToDayMonthAndYearString(data.businessEndDate, 'DD-MM-YYYY'));
  changeInput(getByNameAttribute(getByTestId('rsin-input'), 'rsin'), data.rsin);
};

describe('Add Administration Modal', () => {
  afterEach(fetchMock.restore);
  it('should be able to display add administration modal', async () => {
    await act(async () => {
      // Arrange
      const { getByTestId } = setupDom();

      // Act
      const administrationModal = await waitForElement(() => getByTestId('add-administration-modal'));

      // Assert
      expect(administrationModal).toBeInTheDocument();
    });
  });

  it('should get the error message when fiscal year start date cleared', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    const adminModal = await waitForElement(() => getByTestId('add-administration-modal'));
    const fiscalYearStartDate = await waitForElement(() => getByNameAttribute(adminModal, 'fiscalYearStartDate'));
    act(() => {
      changeInput(fiscalYearStartDate, '2020-01-01');
    });
    const removeIcon = await waitForElement(() => adminModal.querySelector('.fiscal-year-start-date .SingleDatePickerInput .SingleDatePickerInput_clearDate'));
    act(() => {
      fireEvent.click(removeIcon);
    });

    // Assert
    await wait(() => expect(queryByTestId('error-fiscalYearStartDate')).toBeInTheDocument());
  });

  it('should get the error message when fiscal year end date cleared', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom();

    // Act
    const adminModal = await waitForElement(() => getByTestId('add-administration-modal'));
    const fiscalYearEndDate = await waitForElement(() => getByNameAttribute(adminModal, 'fiscalYearEndDate'));
    act(() => {
      changeInput(fiscalYearEndDate, '2020-12-31');
    });
    const removeIcon = await waitForElement(() => adminModal.querySelector('.fiscal-year-end-date .SingleDatePickerInput .SingleDatePickerInput_clearDate'));
    act(() => {
      fireEvent.click(removeIcon);
    });

    // Assert
    await wait(() => expect(queryByTestId('error-fiscalYearEndDate')).toBeInTheDocument());
  });

  it('should get the error message when rsin is empty and business form value is partnership', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: INCOME_FROM_BUSINESS_DETAILS_WITH_EMPTY_SUBJECT });

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const option = await waitForElement(() => selectAutoCompleteOption(administrationForm, '.business-form--select', 1, true));
    fireEvent.click(option);
    const rsin = getByNameAttribute(getByTestId('rsin-input'), 'rsin');
    fireEvent.focus(rsin);
    fireEvent.blur(rsin);

    // Assert
    await wait(() => expect(queryByTestId('error-rsin')).toBeInTheDocument());
  });

  it('should load vpc administration options based on select input value', async () => {
    // Arrange
    mockGetVpcAdministrations();
    const { getByTestId } = setupDom();
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const options = await getAsyncAutocompleteOptions(createAdministrationFrom, '.search-vpc-administration-list', SEARCH_STRING, true);

    // Assert
    expect(options.length).toEqual(MOCK_VPC_ADMINISTRATION_LIST.content.length);
  });

  it('should display notification when get administration list api fails', async () => {
    // Arrange
    const FAILURE_RESPONSE = {
      meta: null,
      errors: [
        {
          id: '8696bd94-273e-4b69-9e91-8204256e8e1b',
          status: 400,
          detail: 'some error',
        },
      ],
    };
    mockGetVpcAdministrations(FAILURE_RESPONSE);
    const { getByTestId } = setupDom();
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const input = createAdministrationFrom.querySelector('.search-vpc-administration-list input');
    act(() => {
      fireEvent.change(input, { target: { value: SEARCH_STRING } });
    });
    const notificationBar = await waitForElement(() => getByTestId('notification'));

    // Assert
    expect(notificationBar).toBeInTheDocument();
  });

  it('should call get administration details end point when select the administration from the options', async () => {
    // Arrange
    mockGetVpcAdministrations();
    mockGetAdministrationDetails();
    const { getByTestId } = setupDom();
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const options = await getAsyncAutocompleteOptions(createAdministrationFrom, '.search-vpc-administration-list', SEARCH_STRING, true);
    await act(async () => {
      await fireEvent.click(options[3]);
    });

    // Assert
    expect(fetchMock.called(`/itx-api/v1/administration/${ADMINISTRATION_ID}`)).toBe(true);
  });

  it('should call get administration details end point when select the administration from the fiscal partner options', async () => {
    // Arrange
    mockGetVpcAdministrations();
    mockGetAdministrationDetails();
    const { getByTestId } = setupDom(ACTIVE_PARTNER_OBJECT);
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const options = await getAsyncAutocompleteOptions(createAdministrationFrom, '.search-vpc-administration-list', SEARCH_STRING, true);
    await act(async () => {
      await fireEvent.click(options[3]);
    });

    // Assert
    expect(fetchMock.called(`/itx-api/v1/administration/${ADMINISTRATION_ID}`)).toBe(true);
  });

  it('should get the error message when business partner is empty and business form value is VOF', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({
      globalAdministrationId: '482501e9-0000-0000-0000-zzd30056f55e',
      isEditMode: true,
    });

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const option = selectAutoCompleteOption(administrationForm, '.business-form--select', 2, true);
    fireEvent.click(option);
    const businessPartner = administrationForm.querySelector('.business-partner--select input');
    fireEvent.focus(businessPartner);
    fireEvent.blur(businessPartner);

    // Assert
    await wait(() => expect(queryByTestId('error-businessPartnerId')).toBeInTheDocument());
  });

  it('should remove the administration when click on the remove icon', async () => {
    // Arrange
    mockGetVpcAdministrations();
    mockGetAdministrationDetails();
    const { getByTestId } = setupDom();
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const options = await getAsyncAutocompleteOptions(createAdministrationFrom, '.search-vpc-administration-list', SEARCH_STRING, true);
    fireEvent.click(options[1]);
    const removeIcon = await waitForElement(() => createAdministrationFrom.querySelector('.search-vpc-administration-list .react-select__clear-indicator'));
    fireEvent.click(removeIcon);

    const input = createAdministrationFrom.querySelector('.search-vpc-administration-list input');

    // Assert
    expect(input.value).toBe('');
  });

  it('should be able to call save administration method on submit administration form for taxable subject', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: INCOME_FROM_BUSINESS_DETAILS_WITH_EMPTY_SUBJECT });

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    await submitCreateAdministrationForm(getByTestId, administrationForm, MOCK_NEW_ADMINISTRATION_DATA_SUBJECT);
    await act(async () => {
      fireEvent.submit(administrationForm);
    });

    // Assert
    expect(fetchMock.called('/itx-api/v1/declaration/add-administration')).toBe(true);
  }, 10000);

  it('should be able to call save administration method on submit administration form for partner', async () => {
    // Arrange
    const { getByTestId } = setupDom(ACTIVE_PARTNER_OBJECT);

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    await submitCreateAdministrationForm(getByTestId, administrationForm, MOCK_NEW_ADMINISTRATION_DATA_PARTNER);
    await act(async () => {
      await fireEvent.submit(administrationForm);
    });

    // Assert
    expect(fetchMock.called('/itx-api/v1/declaration/add-administration')).toBe(true);
  }, 10000);

  it('should be able to display notification when failed to fetch VPC administration details', async () => {
    // Arrange
    mockGetVpcAdministrations();
    const { getByTestId } = setupDom();
    const createAdministrationFrom = await waitForElement(() => getByTestId('create-administration-form'));

    // Act
    const options = await getAsyncAutocompleteOptions(createAdministrationFrom, '.search-vpc-administration-list', SEARCH_STRING, true);
    mockGetAdministrationDetails(
      {
        meta: null,
        errors: [
          {
            id: '4e13f9d5-cb6d-4c1f-ab3a-261cbbe8e6d3',
            status: 500,
            detail: 'Failed due to some error',
          },
        ],
      },
    );
    await act(async () => {
      await fireEvent.click(options[1]);
    });

    // Assert
    const errorNotification = await waitForElement(() => document.querySelector('.mdc-snackbar__label'));
    await wait(() => expect(errorNotification).toBeInTheDocument());
  });

  // edit mode
  it('should be able to call save administration method on submit administration form in edit mode', async () => {
    // Arrange
    const { getByTestId } = setupDom({ globalAdministrationId: '482501e9-0000-0000-0000-zzd30056f55e', isEditMode: true });

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    await submitCreateAdministrationForm(getByTestId, administrationForm, MOCK_EDIT_ADMINISTRATION_DATA);
    await act(async () => {
      fireEvent.submit(administrationForm);
    });

    // Assert
    expect(saveDossierDetails).toHaveBeenCalled();
  }, 10000);

  it('should be able to call fetchVPCFinancialData method on submit administration form in edit mode', async () => {
    // Arrange
    const { getByTestId } = setupDom({ globalAdministrationId: '302501e8-0000-0000-0000-abd30056f58d', isEditMode: true });

    // Act
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    await submitCreateAdministrationForm(getByTestId, administrationForm, MOCK_EDIT_ADMINISTRATION_DATA_WITH_PARTNER);
    await act(async () => {
      fireEvent.submit(administrationForm);
    });

    // Assert
    expect(fetchVPCFinancialData).toHaveBeenCalled();
  }, 10000);
});

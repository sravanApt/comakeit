import React from 'react';
import { Route } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import {
  render, wait, waitForElement, fireEvent, getByNameAttribute, getByValueAttribute,
} from 'test-utils';
import { createQueryString } from '@visionplanner/vp-ui-fiscal-library';
import IncomeTaxClientContainer from './income-tax-client-container';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  DOSSIERS,
  DOSSIERS_COUNT,
  MASTER_DATA,
  MOCK_GLOBAL_CLIENT_ID,
  DOSSIER_YEARS_DATA,
  SEARCH_STRING,
  TAXABLE_SUBJECT_DETAILS,
  MOCK_GLOBAL_ADVISER_ID,
  MOCK_DELETE_DOSSIER_RESPONSE,
} from './income-tax-client.test.data';
import {
  selectAutoCompleteOption,
  setBooleanField,
  changeInput,
} from '../../common/test-helpers';
import { mockGetTaxFormTypes, mockGetTaxationYearsWithTaxableYear } from '../create-dossier/create-dossier-modal.test.data';
import { MOCK_LOGGED_IN_USER, MOCK_USER_PROFILE } from '../../common/auth.test.data';

const historyListenerFunction = jest.fn();

const createFetchDossierUrl = (globalClientId, parameters) => {
  const url = `/api/v1/it-declaration-monitor/${globalClientId}/declaration-dossiers-metadata`;
  const queryString = createQueryString(parameters);
  return `${url}${queryString}`;
};

// eslint-disable-next-line jest/no-export
export const mockGetDossiers = (taxableSubjectId, queryParams, data) => {
  fetchMock.get(createFetchDossierUrl(taxableSubjectId, queryParams), { body: data });
};

// eslint-disable-next-line jest/no-export
export const mockURL = (url, data) => fetchMock.get(url, { body: data });

const mockGetDossierMasterData = () => fetchMock.get('/api/v1/lookup/incometax-dossier-master-data', {
  body: MASTER_DATA,
});

const mockGetDossierYears = (clientId = MOCK_GLOBAL_CLIENT_ID) => fetchMock.get(`/api/v1/taxableyear/${clientId}/incometax`, {
  body: DOSSIER_YEARS_DATA,
});

const mockGetTaxableSubjectDetails = ({ data = TAXABLE_SUBJECT_DETAILS } = {}) => fetchMock.get(
  `/itx-api/v1/income-tax-client/${MOCK_GLOBAL_CLIENT_ID}`,
  {
    body: data,
  },
);

const mockDeleteDossierData = (globalDossierId) => fetchMock.delete(
  `/itx-api/v1/client-dossiers/${MOCK_GLOBAL_CLIENT_ID}/declaration-dossiers/${globalDossierId}`,
  {
    body: MOCK_DELETE_DOSSIER_RESPONSE,
  },
);

const mockUpdateTaxableSubject = (updateUrl) => fetchMock.post(updateUrl, {
  data: { content: TAXABLE_SUBJECT_DETAILS, errors: null },
});

const setupComponent = ({
  route = 'monitor',
  historyListener = historyListenerFunction,
  searchQuery = '',
} = {}) => render(
  <Route
    path="/taxable-subject/:globalClientId/dossiers"
    render={({ history, match }) => (
      <IncomeTaxClientContainer
        match={match}
        history={history}
        auth={{
          user: MOCK_LOGGED_IN_USER,
          userProfile: MOCK_USER_PROFILE,
        }}
        location={{ search: searchQuery }}
      />
    )}
  />,
  {
    initialRoute: `/taxable-subject/${MOCK_GLOBAL_CLIENT_ID}/dossiers/${route}`,
    historyListener,
  },
  mockGetTaxableSubjectDetails(),
  mockGetDossiers(MOCK_GLOBAL_CLIENT_ID,
    {
      sort: [DEFAULT_SORT],
      'page[limit]': DEFAULT_LIMIT,
      'page[offset]': DEFAULT_OFFSET,
    },
    DOSSIERS_COUNT),
  mockGetDossiers(MOCK_GLOBAL_CLIENT_ID,
    {
      sort: [DEFAULT_SORT],
      'page[limit]': DOSSIERS.meta.totalRecords,
      'page[offset]': DEFAULT_OFFSET,
    },
    DOSSIERS),
  mockGetDossierMasterData(),
  mockGetDossierYears(),
);

describe('Tax Dossier Container', () => {
  afterEach(fetchMock.restore);

  it('should display tax dossier container section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const container = await waitForElement(() => getByTestId('tax-dossier-container'));

    // Assert
    expect(container).toBeInTheDocument();
  });

  it('should display create dossier modal', async () => {
    // Arrange
    mockGetTaxFormTypes();
    mockGetTaxationYearsWithTaxableYear();
    const { getByTestId } = setupComponent();

    // Act
    const addDossier = await waitForElement(() => getByTestId('add-dossier-button'));
    fireEvent.click(addDossier);

    // Assert
    await wait(() => expect(getByTestId('create-tax-dossier-form')).toBeInTheDocument());
  });

  it('should be able to call api based on entered search string in tax dossier monitor', async () => {
    // Arrange
    const urlToFetchTotalCountWithSearch = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          `[dossierName]=like:${SEARCH_STRING}`,
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DEFAULT_LIMIT,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    const urlToFetchDataWithSearch = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          `[dossierName]=like:${SEARCH_STRING}`,
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DOSSIERS.meta.totalRecords,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    mockURL(urlToFetchTotalCountWithSearch, DOSSIERS_COUNT);
    mockURL(urlToFetchDataWithSearch, DOSSIERS);
    const { getByTestId } = setupComponent();
    const searchInput = await waitForElement(() => getByTestId('search-dossiers'));

    // Act
    changeInput(searchInput, SEARCH_STRING);

    // Assert
    await wait(() => expect(fetchMock.called(urlToFetchTotalCountWithSearch)).toBe(true));
  });

  it('should display tax dossier monitor filters section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const filterIcon = await waitForElement(() => getByTestId('show-filters-icon'));
    fireEvent.click(filterIcon);

    // Assert
    expect(getByTestId('dossier-filters-container')).toBeInTheDocument();
  });

  it('should call api after submit filters based on selected status filter in tax dossier filters', async () => {
    // Arrange
    const urlToFetchTotalCountWithStatusFilter = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          '[dossierStatusId]=in:1',
          '[dossierTypeId]=in:4',
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DEFAULT_LIMIT,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    const urlToFetchDataWithStatusFilter = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          '[dossierStatusId]=in:1',
          '[dossierTypeId]=in:4',
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DOSSIERS.meta.totalRecords,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    mockURL(urlToFetchTotalCountWithStatusFilter, DOSSIERS_COUNT);
    mockURL(urlToFetchDataWithStatusFilter, DOSSIERS);

    const { getByTestId } = setupComponent();
    const showFilters = await waitForElement(() => getByTestId('show-filters-icon'));
    fireEvent.click(showFilters);
    const dossierTypeCheckBox = await waitForElement(() => getByValueAttribute(getByTestId('dossier-type-filters'), '4'));
    const statusCheckBox = await waitForElement(() => getByValueAttribute(getByTestId('status-filters'), '1'));

    // Act
    setBooleanField(dossierTypeCheckBox);
    setBooleanField(statusCheckBox);
    await wait(() => fireEvent.submit(getByTestId('tax-dossier-monitor-filters-form')));

    // Assert
    await wait(() => expect(fetchMock.called(urlToFetchDataWithStatusFilter)).toBe(true));
  });

  it('should call api after submit filters based on selected period filter in tax dossier filters', async () => {
    // Arrange
    const urlToFetchTotalCountWithPeriodFilter = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          '[periodId]=in:2019',
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DEFAULT_LIMIT,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    const urlToFetchDataWithPeriodFilter = createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        filter: [
          '[periodId]=in:2019',
        ],
        sort: [DEFAULT_SORT],
        'page[limit]': DOSSIERS.meta.totalRecords,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    mockURL(urlToFetchTotalCountWithPeriodFilter, DOSSIERS_COUNT);
    mockURL(urlToFetchDataWithPeriodFilter, DOSSIERS);
    const { getByTestId } = setupComponent();
    const showFilters = await waitForElement(() => getByTestId('show-filters-icon'));
    fireEvent.click(showFilters);
    const filterContainer = await waitForElement(() => getByTestId('tax-dossier-monitor-filters-form'));
    const option = selectAutoCompleteOption(filterContainer, '.period-select', 0);
    fireEvent.click(option);

    // Act
    await wait(() => fireEvent.submit(getByTestId('tax-dossier-monitor-filters-form')));

    // Assert
    await wait(() => expect(fetchMock.called(urlToFetchDataWithPeriodFilter)).toBe(true));
  });

  it('should close filter container after click on clear filters in tax dossier filters', async () => {
    // Arrange
    const { getByTestId } = setupComponent();
    const showFilters = await waitForElement(() => getByTestId('show-filters-icon'));
    fireEvent.click(showFilters);
    const filterContainer = await waitForElement(() => getByTestId('tax-dossier-monitor-filters-form'));

    // Act
    const clearButton = await waitForElement(() => getByTestId('clear-dossier-filters'));
    fireEvent.click(clearButton);

    // Assert
    await wait(() => expect(filterContainer).not.toBeInTheDocument());
  });

  it('should be able to perform sort functionality in tax dossier overview', async () => {
    // Arrange
    const urlToFetchTotalCountWithSort = (sort) => createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        sort: [sort],
        'page[limit]': DEFAULT_LIMIT,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    const urlToFetchDataWithSort = (sort) => createFetchDossierUrl(
      MOCK_GLOBAL_CLIENT_ID,
      {
        sort: [sort],
        'page[limit]': DOSSIERS.meta.totalRecords,
        'page[offset]': DEFAULT_OFFSET,
      },
    );
    mockURL(urlToFetchTotalCountWithSort('dossierName'), DOSSIERS_COUNT);
    mockURL(urlToFetchDataWithSort('dossierName'), DOSSIERS);
    mockURL(urlToFetchTotalCountWithSort('-dossierName'), DOSSIERS_COUNT);
    mockURL(urlToFetchDataWithSort('-dossierName'), DOSSIERS);
    const { getByTestId } = setupComponent();
    const tableContainer = await waitForElement(() => getByTestId('tax-dossier-monitor-table'));
    const sortName = await waitForElement(() => tableContainer.querySelector('.col-dossier-name'));

    // Act
    /** sort api call with ascending order */
    fireEvent.click(sortName);
    /** sort api call with descending order */
    await wait(() => fireEvent.click(sortName));
    /** sort api call again with ascending order */
    await wait(() => fireEvent.click(sortName));

    // Assert
    await wait(() => expect(fetchMock.called(urlToFetchTotalCountWithSort('dossierName'))).toBe(true));
  }, 15000);

  it('should display taxable subject general information section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const menu = await waitForElement(() => getByTestId('dossier-sidebar-menu'));
    const menuItems = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItems[1]);

    // Assert
    expect(getByTestId('general-info-form')).toBeInTheDocument();
  });

  it('should able to update and submit taxable subject general information', async () => {
    // Arrange
    const updateUrl = `/itx-api/v1/income-tax-client/${MOCK_GLOBAL_ADVISER_ID}/client/${MOCK_GLOBAL_CLIENT_ID}`;
    mockUpdateTaxableSubject(updateUrl);
    const { getByTestId } = setupComponent();

    // Act
    const menu = await waitForElement(() => getByTestId('dossier-sidebar-menu'));
    const menuItems = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItems[1]);

    const firstNameInput = await waitForElement(() => getByTestId('first-name-input'));
    changeInput(getByNameAttribute(firstNameInput, 'firstName'), 'firstName');
    const infoForm = await waitForElement(() => getByTestId('general-info-form'));
    fireEvent.submit(infoForm);

    // Assert
    await wait(() => expect(fetchMock.called(updateUrl)).toEqual(true));
  }, 10000);

  it('should display the error message is BSN number is invalid', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const menu = await waitForElement(() => getByTestId('dossier-sidebar-menu'));
    const menuItems = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItems[1]);

    const bsnNumberInput = await waitForElement(() => getByNameAttribute(getByTestId('bsn-input'), 'bsnNumber'));
    changeInput(bsnNumberInput, 123);
    changeInput(bsnNumberInput, 123456789);
    fireEvent.blur(bsnNumberInput);
    const errorBsnNumberElement = await waitForElement(() => getByTestId('error-bsnNumber'));

    // Assert
    expect(errorBsnNumberElement).toBeInTheDocument();
  });

  it('should be able to delete dossier when clicked on delete icon and on click of confirm', async () => {
    // Arrange
    const dossierId = 'e2e1d2e2-1e8d-47ce-a5c8-aba40055164c';
    mockDeleteDossierData(dossierId);
    const { getByTestId } = setupComponent();
    const deleteIcon = await waitForElement(() => getByTestId(`delete-dossier-${dossierId}`));

    // Act
    fireEvent.click(deleteIcon);
    const confirmButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(confirmButton);

    // Assert
    await wait(() => expect(fetchMock.called(`/itx-api/v1/client-dossiers/${MOCK_GLOBAL_CLIENT_ID}/declaration-dossiers/${dossierId}`)).toBe(true));
  });

  it('should render declaration container with route to common dossier monitor screen', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      searchQuery: '?source=common_dossiers',
    });

    // Act
    await waitForElement(() => getByTestId('tax-dossier-container'));
    const breadCrumb = await waitForElement(() => getByTestId('bread-crumbs'));

    const navigation = breadCrumb.querySelectorAll('.mdc-typography--body1');
    // Assert
    // "Dossiers┬á/┬áBartel Abel Hiddie
    expect(navigation[0].textContent).toBe('Dossiers');
    expect(navigation[1].textContent).toBe(`${TAXABLE_SUBJECT_DETAILS.firstName} ${TAXABLE_SUBJECT_DETAILS.middleName} ${TAXABLE_SUBJECT_DETAILS.lastName}`);
  });
});

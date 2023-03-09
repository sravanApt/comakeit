import React from 'react';
import {
  render, wait, fireEvent, waitForElement, act, getByNameAttribute, getByValueAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import { Route } from 'react-router-dom';
import Forecast from './tax-forecast';
import {
  VPC_OPTIONS,
  VPC_DATA,
  CALCULATE_TAX,
  mockGetInititalForeCastData,
  mockGetAutoSyncData,
  mockGetCountriesList,
  DECLARATION_ID,
  mockGetDossierDataSources,
  mockAutoSaveDeclaration,
  GLOBAL_CLIENT_ID,
  mockGetDossierList,
  mockImportDossier,
  FORECAST_DATA,
  PROGNOSE_FORECAST_DATA,
  PROVISIONAL_FORECAST_DATA,
  MOCK_SINGLE_DOSSIER_FORECAST_DATA,
  mockSubmitDossier,
  JOINT_FORECAST_DATA,
  ALLOCATION_FORECAST_DATA,
  fetchDossierDataWithUpdatedStatus,
  GLOBAL_ADVISER_ID,
  MOCK_JOINT_DOSSIER_DATA,
} from './tax-forecast.test.data';
import {
  getActivePartnerTab, getTableRowsCount, selectAutoCompleteOption, setBooleanField,
} from '../../common/test-helpers';
import {
  mockGetMaritalStatuses, mockGetLivingTogetherSituations, mockGetTaxFormTypes,
} from './personal-details/personal-details.test.data';
import { mockGetBusinessFormTypes, mockGetBusinessPartners } from './income-from-business/income-from-business.test.data';
import { PROFIT_LOSS_CORRECTION_FIELDS, PROFIT_LOSS_CORRECTION_FORM } from './income-from-business/profit-loss/profit-loss.test.data';
import { createQueryString } from '../../common/utils';
import { handleAdministrationsAndSourceChange, updateAndSubmitCorrectionForm } from './tax-forecast-test-helpers';
import { MOCK_LOGGED_IN_USER, MOCK_USER_PROFILE } from '../../common/auth.test.data';
import { mockGetRecommendedAllocationData } from './allocation/allocation.test.data';

const mockCalculateTax = ({ response = CALCULATE_TAX } = {}) => fetchMock.post(
  '/itx-api/v1/declaration/calculate-income-tax',
  {
    body: response,
  },
);

const mockGetVPCFinancialData = ({ parameters, response = VPC_DATA } = {}) => fetchMock.get(
  `/itx-api/v1/declaration/VPC-financial-details${createQueryString(parameters)}`,
  {
    body: response,
  },
);

const mockGetDossierLatestFinancialData = ({ parameters, response = VPC_DATA } = {}) => fetchMock.get(
  `/itx-api/v1/declaration/dossier-with-latest-financial-details${createQueryString(parameters)}`,
  {
    body: response,
  },
);

const setupComponent = ({
  route = 'personal-details',
  historyListener,
  searchQuery = '',
  globalClientId = GLOBAL_CLIENT_ID,
  declarationId = DECLARATION_ID,
  response = FORECAST_DATA,
} = {}) => render(
  <Route
    path="/:globalClientId/forecast/:declarationId"
    render={({ history, match }) => (
      <Forecast
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
    initialRoute: `/${GLOBAL_CLIENT_ID}/forecast/${DECLARATION_ID}/${route}`,
    historyListener,
  },
  mockGetInititalForeCastData({ globalClientId, declarationId, response }),
  mockGetCountriesList(),
  mockGetDossierDataSources(),
  mockGetMaritalStatuses(),
  mockGetLivingTogetherSituations(),
  mockCalculateTax(),
  mockGetTaxFormTypes(),
  mockGetAutoSyncData({ globalClientId, declarationId, response }),
);

const checkIfRoutedToSection = async (route, historyListener) => {
  await wait(() => expect(historyListener).toHaveBeenCalled());
  const locationFromListener = historyListener.mock.calls[0][0];
  const actionFromListener = historyListener.mock.calls[0][1];
  expect(locationFromListener.pathname).toBe(`/${GLOBAL_CLIENT_ID}/forecast/${DECLARATION_ID}/${route}`);
  expect(actionFromListener).toBe('PUSH');
};

describe('Tax Forecast', () => {
  afterEach(fetchMock.restore);

  it('should clear and disable Income from employment tax partner & Date of birth tax partner in Additional Calculation Information - Tax Credit, on true of Joint Declaration Checkbox', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
    const sectionKey = 'taxCredit';
    const fieldNamePrefix = `${taxableSubjectKey}.${sectionKey}`;

    const { getByTestId } = setupComponent({
      searchQuery: '?source=common_dossiers',
    });
    const jointDeclarationCheckbox = await waitForElement(() => getByNameAttribute(getByTestId('joint-declaration'), 'isJointDeclaration'));
    // Act
    setBooleanField(jointDeclarationCheckbox, true);

    // Navigate back to Additional Calculation Screen
    const menu = await waitForElement(() => getByTestId('forecast-menu'));
    const menuItem = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItem[11]);

    const updatedFromLaborForFiscalPartner = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-incomeOutOfLaborForFiscalPartner`),
      `${fieldNamePrefix}.incomeOutOfLaborForFiscalPartner`,
    ));
    const additionalContainer = await waitForElement(() => getByTestId('additional-calculation-container'));
    const dateOfBirthOfFiscalPartner = additionalContainer.querySelector('.date-of-birth-fiscal-partner .SingleDatePickerInput .DateInput_input');

    // Assert
    await wait(() => expect(updatedFromLaborForFiscalPartner.value).toBe(''));
    await wait(() => expect(updatedFromLaborForFiscalPartner).toBeDisabled());
    await wait(() => expect(dateOfBirthOfFiscalPartner.value).toBe(''));
    await wait(() => expect(dateOfBirthOfFiscalPartner).toBeDisabled());
  }, 10000);

  it('should clear and disable Income from employment tax partner & Date of birth tax partner in Additional Calculation Information - Tax Credit, when marital status is single all year', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
    const sectionKey = 'taxCredit';
    const fieldNamePrefix = `${taxableSubjectKey}.${sectionKey}`;

    const { getByTestId } = setupComponent();
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));

    // Act
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 2);
    act(() => {
      fireEvent.click(option);
    });
    const submitButton = getByTestId('confirm-dialog-submit');
    await act(async () => {
      await fireEvent.click(submitButton);
    });

    // Navigate back to Additional Calculation Screen
    const menu = await waitForElement(() => getByTestId('forecast-menu'));
    const menuItem = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItem[11]);

    const updatedFromLaborForFiscalPartner = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-incomeOutOfLaborForFiscalPartner`),
      `${fieldNamePrefix}.incomeOutOfLaborForFiscalPartner`,
    ));
    const additionalContainer = await waitForElement(() => getByTestId('additional-calculation-container'));
    const dateOfBirthOfFiscalPartner = additionalContainer.querySelector('.date-of-birth-fiscal-partner .SingleDatePickerInput .DateInput_input');

    // Assert
    await wait(() => expect(updatedFromLaborForFiscalPartner.value).toBe(''));
    await wait(() => expect(updatedFromLaborForFiscalPartner).toBeDisabled());
    await wait(() => expect(dateOfBirthOfFiscalPartner.value).toBe(''));
    await wait(() => expect(dateOfBirthOfFiscalPartner).toBeDisabled());
  }, 10000);

  it('should display tax forecast section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();

    // Act
    const forecastSection = await waitForElement(() => getByTestId('tax-forecast-section'));

    // Assert
    expect(forecastSection).toBeInTheDocument();
  }, 10000);

  it('should call auto sync api to synchronize the VPC data when dossier status is inprogress', async () => {
    await act(async () => {
      // Arrange
      setupComponent();
    });

    // Assert
    expect(fetchMock.called(`/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/declaration-dossier-with-vpc-Details/${DECLARATION_ID}`)).toEqual(true);
  });

  it('should not call auto sync api when dossier status is other than inprogress', async () => {
    await act(async () => {
      // Arrange
      const SentForPeersApprovalStatus = 2;
      setupComponent({ response: fetchDossierDataWithUpdatedStatus(SentForPeersApprovalStatus) });
    });

    // Assert
    expect(fetchMock.called(`/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/declaration-dossier-with-vpc-Details/${DECLARATION_ID}`)).toEqual(false);
  });

  it('should be able to select menu in tax forecast menu', async () => {
    // Arrange
    const { getByTestId, container } = setupComponent();
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItems = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItems[1]);

    // Assert
    await wait(() => expect(container).toMatchSnapshot());
  });

  it('should display balance sheet section after selecting balance sheet in tax forecast menu', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent();
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItems = menu.querySelectorAll('.rmwc-collapsible-list .mdc-list-item');
    fireEvent.click(menuItems[2]);

    // Assert
    await wait(() => expect(getByTestId('balance-sheet')).toBeInTheDocument());
  });

  it('should display other items section after selecting other items in tax forecast menu', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent();
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItems = menu.querySelectorAll('.rmwc-collapsible-list .mdc-list-item');
    fireEvent.click(menuItems[3]);

    // Assert
    await wait(() => expect(getByTestId('other-items')).toBeInTheDocument());
  });

  it('should display income section after selecting income in tax forecast menu', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent();
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItem = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItem[7]);

    // Assert
    await wait(() => expect(getByTestId('tax-forecast-income-form')).toBeInTheDocument());
  });

  it('should display error grid in the modal on click of direct submit if data is invalid', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent({
      response: PROVISIONAL_FORECAST_DATA,
    });
    const approval = await waitForElement(() => getByTestId('send-direct-approval'));

    // Act
    fireEvent.click(approval);

    // Assert
    await wait(() => expect(getByTestId('invalid-form-grid')).toBeInTheDocument());
  });

  // TODO: will be reverted after Elfin release
  // it('should be able to send to client approval if it is Provisional dossier', async () => {
  //   // Arrange
  //   mockSubmitDossier();
  //   const { getByTestId } = setupComponent({
  //     response: MOCK_SINGLE_DOSSIER_FORECAST_DATA,
  //   });
  //   const approval = await waitForElement(() => getByTestId('send-for-client-approval'));

  //   // Act
  //   fireEvent.click(approval);
  //   const approveModal = await waitForElement(() => getByTestId('approve-dossier'));
  //   const submitButton = getByTestId('send-for-approval');
  //   fireEvent.click(submitButton);

  //   // Assert
  //   await wait(() => expect(approveModal).not.toBeInTheDocument());
  //   await wait(() => expect(fetchMock.called(`/itx-api/v1/declaration/${GLOBAL_ADVISER_ID}/${DECLARATION_ID}/action-on-dossier`)).toBe(true));
  // });

  it('should be able to submit dossier directly if it is Provisional dossier with inprogress status', async () => {
    // Arrange
    mockSubmitDossier();
    const { getByTestId } = setupComponent({
      response: MOCK_SINGLE_DOSSIER_FORECAST_DATA,
    });
    const approval = await waitForElement(() => getByTestId('send-direct-approval'));

    // Act
    fireEvent.click(approval);
    const approveDossierModal = await waitForElement(() => getByTestId('approve-dossier'));
    const submitButton = getByTestId('send-for-approval');
    fireEvent.click(submitButton);

    // Assert
    await wait(() => expect(approveDossierModal).not.toBeInTheDocument());
    await wait(() => expect(fetchMock.called(`/itx-api/v1/declaration/${GLOBAL_ADVISER_ID}/${DECLARATION_ID}/action-on-dossier`)).toBe(true));
  });

  it('should be able to submit dossier directly if it is Provisional dossier with send for client approval status', async () => {
    // Arrange
    mockSubmitDossier();
    const { getByTestId } = setupComponent({
      response: {
        ...MOCK_SINGLE_DOSSIER_FORECAST_DATA,
        content: {
          ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content,
          dossierManifest: {
            ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content.dossierManifest,
            declarationStatusId: 3,
          }
        }
      },
    });
    const approval = await waitForElement(() => getByTestId('send-direct-approval'));

    // Act
    fireEvent.click(approval);
    const approveDossierModal = await waitForElement(() => getByTestId('approve-dossier'));
    const submitButton = getByTestId('send-for-approval');
    fireEvent.click(submitButton);

    // Assert
    await wait(() => expect(approveDossierModal).not.toBeInTheDocument());
    await wait(() => expect(fetchMock.called(`/itx-api/v1/declaration/${GLOBAL_ADVISER_ID}/${DECLARATION_ID}/action-on-dossier`)).toBe(true));
  });

  it('should be able to submit dossier directly for joint dossier', async () => {
    // Arrange
    mockSubmitDossier();
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent({
      response: MOCK_JOINT_DOSSIER_DATA,
    });
    const approval = await waitForElement(() => getByTestId('send-direct-approval'));

    // Act
    fireEvent.click(approval);
    const approveDossierModal = await waitForElement(() => getByTestId('approve-dossier'));
    const submitButton = getByTestId('send-for-approval');
    fireEvent.click(submitButton);

    // Assert
    await wait(() => expect(approveDossierModal).not.toBeInTheDocument());
    await wait(() => expect(fetchMock.called(`/itx-api/v1/declaration/${GLOBAL_ADVISER_ID}/${DECLARATION_ID}/action-on-dossier`)).toBe(true));
  });

  it('should be able to reopen dossier if it is Provisional dossier', async () => {
    // Arrange
    mockSubmitDossier();
    const { getByTestId } = setupComponent({
      response: {
        ...MOCK_SINGLE_DOSSIER_FORECAST_DATA,
        content: {
          ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content,
          dossierManifest: {
            ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content.dossierManifest,
            declarationStatusId: 6,
          }
        }
      },
    });
    const actionIcon = await waitForElement(() => getByTestId('dossier-actions-icon'));

    // Act
    fireEvent.click(actionIcon);
    const reopenItem = await waitForElement(() => getByTestId('header-list-item1'));
    fireEvent.click(reopenItem);
    const approveModal = await waitForElement(() => getByTestId('approve-dossier'));
    const submitButton = getByTestId('send-for-approval');
    fireEvent.click(submitButton);

    // Assert
    await wait(() => expect(approveModal).not.toBeInTheDocument());
    await wait(() => expect(fetchMock.called(`/itx-api/v1/declaration/${GLOBAL_ADVISER_ID}/${DECLARATION_ID}/action-on-dossier`)).toBe(true));
  });

  it('should be able to lock dossier if status of dossier is partilally submitted', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      route: 'audit-trail',
      response: {
        ...MOCK_SINGLE_DOSSIER_FORECAST_DATA,
        content: {
          ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content,
          dossierManifest: {
            ...MOCK_SINGLE_DOSSIER_FORECAST_DATA.content.dossierManifest,
            declarationStatusId: 7,
          }
        }
      },
    });

    // Act
    const lockedDossier = await waitForElement(() => getByTestId('locked-dossier'));

    // Assert
    expect(lockedDossier).toBeInTheDocument();
  });

  it('should be able to navigate to profit and loss section onclick of row in income business list for taxable subject', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const historyListener = jest.fn();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    const businessNameElement = await waitForElement(() => getByTestId('business-name0'));
    fireEvent.click(businessNameElement);

    // Assert
    await checkIfRoutedToSection('profit-and-loss', historyListener);
  });

  it('should be able to navigate to profit and loss section onclick of row in income business list for fiscal partner', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const historyListener = jest.fn();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    await wait(() => getActivePartnerTab(getByTestId));
    const businessNameElement = await waitForElement(() => getByTestId('business-name0'));
    fireEvent.click(businessNameElement);

    // Assert
    await checkIfRoutedToSection('profit-and-loss', historyListener);
  });

  it('should call saveDossierDetails onclick of save button in administration modal edit for taxable subject', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const saveUrl = `/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/declaration-dossiers/${DECLARATION_ID}`;
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    mockGetBusinessFormTypes();
    mockGetBusinessPartners();
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__edit'));
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const option = selectAutoCompleteOption(administrationForm, '.business-form--select', 0, true);
    fireEvent.click(option);
    await act(async () => {
      await fireEvent.submit(administrationForm);
    });

    // Assert
    await wait(() => expect(fetchMock.called(saveUrl)).toEqual(true));
  });

  it('should call fetchVPCFinancialData onclick of save button in administration modal edit for taxable subject', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const globalAdministrationId = '5f7f7079-5fe4-4fee-99a3-ac0500a03adf';
    const declarationId = 'b106308c-13be-4aef-8860-aacd008f0540';
    const parameters = {
      TaxableSubjectID: '00000000-0000-0000-0000-000000000000',
      globalAdministrationId,
      dataSource: 1,
      declarationId,
      declarationTypeId: 2,
      taxableYear: 2018,
      businessPartnerId: 2,
    };
    const fetchVpcUrl = `/itx-api/v1/declaration/VPC-financial-details${createQueryString(parameters)}`;
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });
    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    mockGetBusinessFormTypes();
    mockGetBusinessPartners();
    mockGetVPCFinancialData({ parameters });
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__edit'));
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const option = selectAutoCompleteOption(administrationForm, '.business-form--select', 1, true);
    fireEvent.click(option);
    const partnerOption = selectAutoCompleteOption(administrationForm, '.business-partner--select', 1, true);
    fireEvent.click(partnerOption);
    await act(async () => {
      await fireEvent.submit(administrationForm);
    });
    // Assert
    await wait(() => expect(fetchMock.called(fetchVpcUrl)).toEqual(true));
  }, 10000);

  it('should call fetchVPCFinancialData onclick of save button in administration modal edit for partner', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const globalAdministrationId = '38a273d3-5df8-4d32-872d-aad8008c5fb1';
    const declarationId = 'b106308c-13be-4aef-8860-aacd008f0540';
    const parameters = {
      TaxableSubjectID: '00000000-0000-0000-0000-000000000000',
      globalAdministrationId,
      dataSource: 1,
      declarationId,
      declarationTypeId: 2,
      taxableYear: 2018,
      businessPartnerId: 2,
    };
    const fetchVpcUrl = `/itx-api/v1/declaration/VPC-financial-details${createQueryString(parameters)}`;
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });
    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    getActivePartnerTab(getByTestId);
    mockGetBusinessFormTypes();
    mockGetBusinessPartners();
    mockGetVPCFinancialData({ parameters });
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__edit'));
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const partnerOption = selectAutoCompleteOption(administrationForm, '.business-partner--select', 1, true);
    fireEvent.click(partnerOption);
    await act(async () => {
      await fireEvent.submit(administrationForm);
    });
    // Assert
    await wait(() => expect(fetchMock.called(fetchVpcUrl)).toEqual(true));
  }, 10000);

  it('should call saveDossierDetails onclick of save button in administration modal edit for fiscal partner', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const saveUrl = `/itx-api/v1/client-dossiers/${GLOBAL_CLIENT_ID}/declaration-dossiers/${DECLARATION_ID}`;
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    getActivePartnerTab(getByTestId);
    mockGetBusinessFormTypes();
    mockGetBusinessPartners();
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__edit'));
    const administrationForm = await waitForElement(() => getByTestId('create-administration-form'));
    const option = selectAutoCompleteOption(administrationForm, '.business-form--select', 0, true);
    fireEvent.click(option);
    await act(async () => {
      await fireEvent.submit(administrationForm);
    });

    // Assert
    await wait(() => expect(fetchMock.called(saveUrl)).toEqual(true));
  });

  it('should be able to delete the administration onclick of delete icon in income business list for fiscal partner', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    getActivePartnerTab(getByTestId);
    const tableRowsBeforeDelete = incomeFromBusinessSection.querySelectorAll('.common-data-table .common-data-table__body .common-data-table__row');
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__actions--remove'));
    const deleteConfirmationButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(deleteConfirmationButton);
    const tableRowsAfterDelete = await waitForElement(() => incomeFromBusinessSection.querySelectorAll('.common-data-table .common-data-table__body .common-data-table__row'));

    // Assert
    expect(tableRowsBeforeDelete.length - 1).toEqual(tableRowsAfterDelete.length);
  });

  it('should be able to delete the administration onclick of delete icon in income business list for taxable subject', async () => {
    // Arrange
    const historyListener = jest.fn();
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
      historyListener,
    });

    // Act
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    const tableRowsBeforeDelete = incomeFromBusinessSection.querySelectorAll('.common-data-table .common-data-table__body .common-data-table__row');
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__actions--remove'));
    const deleteConfirmationButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(deleteConfirmationButton);
    const tableRowsAfterDelete = await waitForElement(() => incomeFromBusinessSection.querySelectorAll('.common-data-table .common-data-table__body .common-data-table__row'));

    // Assert
    expect(tableRowsBeforeDelete.length - 1).toEqual(tableRowsAfterDelete.length);
  });

  it('should be able to call calculate tax after making corrections in profit and loss section for taxable subject', async () => {
    // Arrange
    const calculateTaxUrl = '/itx-api/v1/declaration/calculate-income-tax';
    mockGetVPCFinancialData({ parameters: { ...VPC_OPTIONS, globalAdministrationId: '6f7f7079-5fe4-4fee-99a3-ac0500a03adf' } });
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
    });

    // Act
    const businessNameElement = await waitForElement(() => getByTestId('business-name1'));
    fireEvent.click(businessNameElement);
    const ProfitLossContainer = await waitForElement(() => getByTestId('profit-loss'));
    handleAdministrationsAndSourceChange(ProfitLossContainer, 0, 1);
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-revenue', PROFIT_LOSS_CORRECTION_FORM, PROFIT_LOSS_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(fetchMock.called(calculateTaxUrl)).toEqual(true));
  }, 10000);

  it('should be able to call calculate tax after making corrections in profit and loss section for fiscal partner', async () => {
    // Arrange
    const calculateTaxUrl = '/itx-api/v1/declaration/calculate-income-tax';
    mockGetVPCFinancialData({ parameters: VPC_OPTIONS });
    mockAutoSaveDeclaration();

    const { getByTestId } = setupComponent({
      route: 'income-from-business',
    });

    // Act
    const businessNameElement = await waitForElement(() => getByTestId('business-name0'));
    fireEvent.click(businessNameElement);
    const ProfitLossContainer = await waitForElement(() => getByTestId('profit-loss'));
    await getActivePartnerTab(getByTestId);
    handleAdministrationsAndSourceChange(ProfitLossContainer, 0, 0);
    await act(async () => {
      await updateAndSubmitCorrectionForm(getByTestId, 'edit-revenue', PROFIT_LOSS_CORRECTION_FORM, PROFIT_LOSS_CORRECTION_FIELDS);
    });

    // Assert
    await wait(() => expect(fetchMock.called(calculateTaxUrl)).toEqual(true));
  }, 10000);

  it('should be able to call dossier-with-latest-financial-details to make corrections available if same datasource got selected in profit and loss section for taxable subject', async () => {
    // Arrange
    const LATEST_FINANCIAL_DETAILS_VPC_OPTIONS = {
      businessPartnerId: 1,
      forFiscalPartner: false,
      globalDossierId: 'ad979398-592d-4f10-8801-aacd008f0546',
      globalClientId: '00000000-0000-0000-0000-000000000000',
      globalAdministrationId: '5f7f7079-5fe4-4fee-99a3-ac0500a03adf',
      taxableYear: 2018,
      declarationTypeId: 2,
      dataSource: 1,
    };
    const latestFinancialDetailsUrl = `/itx-api/v1/declaration/dossier-with-latest-financial-details${createQueryString(LATEST_FINANCIAL_DETAILS_VPC_OPTIONS)}`;
    mockGetDossierLatestFinancialData({ parameters: LATEST_FINANCIAL_DETAILS_VPC_OPTIONS });
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'income-from-business',
    });

    // Act
    const businessNameElement = await waitForElement(() => getByTestId('business-name0'));
    fireEvent.click(businessNameElement);
    const ProfitLossContainer = await waitForElement(() => getByTestId('profit-loss'));
    handleAdministrationsAndSourceChange(ProfitLossContainer, 0, 0);

    // Assert
    await wait(() => expect(fetchMock.called(latestFinancialDetailsUrl)).toEqual(true));
  }, 10000);

  it('should be able to delete the records of deleted administration in substantial interest', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'assets',
    });

    let substantialInterestSection = await waitForElement(() => getByTestId('substantial-interest'));
    const initialSubstantialInterestRows = getTableRowsCount(substantialInterestSection);
    const menu = await waitForElement(() => getByTestId('forecast-menu'));
    const menuItem = menu.querySelectorAll('.mdc-list-item');

    // Act - navigate to income from business and delete the first administration
    fireEvent.click(menuItem[2]);
    const incomeFromBusinessSection = await waitForElement(() => getByTestId('income-from-business-section'));
    fireEvent.click(incomeFromBusinessSection.querySelector('.common-data-table .common-data-table__body .common-data-table__row .icon__actions--remove'));
    const deleteConfirmationButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(deleteConfirmationButton);

    // Act - navigate back to Assets
    fireEvent.click(menuItem[9]);
    substantialInterestSection = await waitForElement(() => getByTestId('substantial-interest'));
    const updatedRowsInsubstantialInterestSection = getTableRowsCount(substantialInterestSection);

    // Assert
    expect(updatedRowsInsubstantialInterestSection).toEqual(initialSubstantialInterestRows - 1);
  });

  it('should remove fiscal partner data from assets when disconnected from dossier', async () => {
    // Arrange
    const NUMBER_OF_FISCAL_PARTNER_RECORDS = 1;
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'assets',
    });

    let substantialInterestSection = await waitForElement(() => getByTestId('substantial-interest'));
    const initialSubstantialInterestRows = getTableRowsCount(substantialInterestSection);
    const menu = await waitForElement(() => getByTestId('forecast-menu'));
    const menuItem = menu.querySelectorAll('.mdc-list-item');

    // Act - navigate to personal details and update marital status to single all year
    fireEvent.click(menuItem[1]);
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 2);
    act(() => {
      fireEvent.click(option);
    });
    const confirmButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(confirmButton);

    // Act - navigate back to Assets
    fireEvent.click(menuItem[9]);
    substantialInterestSection = await waitForElement(() => getByTestId('substantial-interest'));
    const updatedRowsInsubstantialInterestSection = getTableRowsCount(substantialInterestSection);

    // Assert
    expect(updatedRowsInsubstantialInterestSection).toEqual(initialSubstantialInterestRows - NUMBER_OF_FISCAL_PARTNER_RECORDS);
  }, 10000);

  it('should remove fiscal partner data from liabilities when disconnected from dossier', async () => {
    // Arrange
    const NUMBER_OF_FISCAL_PARTNER_RECORDS = 1;
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({
      route: 'liabilities',
    });

    let loansForOwnHomeSection = await waitForElement(() => getByTestId('loans-for-own-home-section'));
    const initialLoansForOwnHomeRows = getTableRowsCount(loansForOwnHomeSection);
    const menu = await waitForElement(() => getByTestId('forecast-menu'));
    const menuItem = menu.querySelectorAll('.mdc-list-item');

    // Act - navigate to personal details and update marital status to single all year
    fireEvent.click(menuItem[1]);
    const personalDetailsContainer = await waitForElement(() => getByTestId('personal-details-container'));
    const option = selectAutoCompleteOption(personalDetailsContainer, '.marital-status-select', 2);
    act(() => {
      fireEvent.click(option);
    });
    const confirmButton = await waitForElement(() => getByTestId('confirm-dialog-submit'));
    fireEvent.click(confirmButton);

    // Act - navigate back to Liabilites
    fireEvent.click(menuItem[10]);
    loansForOwnHomeSection = await waitForElement(() => getByTestId('loans-for-own-home-section'));
    const updatedRowsInLoansForOwnHomeRows = getTableRowsCount(loansForOwnHomeSection);

    // Assert
    expect(updatedRowsInLoansForOwnHomeRows).toEqual(initialLoansForOwnHomeRows - NUMBER_OF_FISCAL_PARTNER_RECORDS);
  }, 10000);

  it('should not show import icons for prognose dossier', async () => {
    // Arrange
    mockGetDossierList();
    const { queryByTestId } = setupComponent({
      declarationId: 3, response: PROGNOSE_FORECAST_DATA,
    });

    // Assert
    await wait(() => expect(queryByTestId('dossier-actions-icon')).toBeNull());
  });

  it('should show import modal on click of import icon', async () => {
    // Arrange
    mockGetDossierList();
    const { getByTestId } = setupComponent();
    const importIcon = await waitForElement(() => getByTestId('dossier-actions-icon'));

    // Act
    fireEvent.click(importIcon);
    const importItem = await waitForElement(() => getByTestId('header-list-item0'));
    fireEvent.click(importItem);

    // Assert
    await wait(() => expect(getByTestId('import-dossier-form')).not.toBe(null));
  });

  it('should close modal on click of import icon in import dossier modal', async () => {
    // Arrange
    mockGetDossierList();
    const copyDossierId = '16af6eeb-00e1-4cfe-b875-ac6300572b71';
    mockImportDossier(copyDossierId);
    const { getByTestId } = setupComponent();
    const importIcon = await waitForElement(() => getByTestId('dossier-actions-icon'));

    // Act
    fireEvent.click(importIcon);
    const importItem = await waitForElement(() => getByTestId('header-list-item0'));
    fireEvent.click(importItem);
    const importDossierModal = await waitForElement(() => getByTestId('import-dossier-form'));
    fireEvent.click(getByValueAttribute(getByTestId('copy-dossier-id'), copyDossierId));
    const importButton = getByTestId('import-dossier-save-button');
    fireEvent.click(importButton);

    // Assert
    await wait(() => expect(importDossierModal).not.toBeInTheDocument());
  }, 10000);

  it('should call allocation api on selcting income tab in tax forecast menu', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    const { getByTestId } = setupComponent({ response: JOINT_FORECAST_DATA });
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItem = menu.querySelectorAll('.mdc-list-item');
    fireEvent.click(menuItem[7]);

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/allocation-report?recommendedAllocation=true')).toEqual(true));
  });

  it('should call allocation api on selcting other items tab in tax forecast menu', async () => {
    // Arrange
    mockGetRecommendedAllocationData({ recommendedAllocation: false });
    const { getByTestId } = setupComponent({ response: ALLOCATION_FORECAST_DATA });
    const menu = await waitForElement(() => getByTestId('forecast-menu'));

    // Act
    const menuItems = menu.querySelectorAll('.rmwc-collapsible-list .mdc-list-item');
    fireEvent.click(menuItems[3]);

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/allocation-report?recommendedAllocation=false')).toEqual(true));
  });
});

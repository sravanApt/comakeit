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
import TaxForecastContext from '../tax-forecast-context';
import {
  COUNTRIES,
  TAB_OPTIONS,
  ACTIVE_TAB,
  mockAutoSaveDeclaration,
} from '../tax-forecast.test.data';
import { mockGetRecommendedAllocationData } from '../allocation/allocation.test.data';
import { changeInput, selectAutoCompleteOption, getTableRowsCount } from '../../../common/test-helpers';
import {
  MOCK_DATA_OWN_HOMES,
  MOCK_DATA_SUBSTANTIAL_INTEREST,
  MOCK_DATA_BANK_ACCOUNTS,
  MOCK_DATA_INVESTMENT_ACCOUNTS,
  MOCK_DATA_ENVIRONMENTAL_INVESTMENTS,
  MOCK_DATA_OTHER_PROPERTIES,
  MOCK_DATA_OTHER_ASSETS,
  MOCK_DATA_PERIODICAL_ASSETS,
  MOCK_DATA_OUTSTANDING_LOAN_ASSETS,
  MOCK_DATA_NON_EXEMPT_INSURANCES,
  MOCK_ASSETS_DATA,
  MOCK_REPORT_DATA,
  GLOBAL_CLIENT_ID,
  DEFAULT_ROW_INDEX,
  MOCK_VACANCY_OPTIONS,
} from './assets.test.data';
import AssetsContainer from './assets-container';
import { SECTION_LIST, OTHER_PROPERTIES_REPORT_KEY } from './assets.constants';
import { removeSection } from '../tax-forecast-test-helpers';

const mockGetReportBokkzData = (reportType = OTHER_PROPERTIES_REPORT_KEY, isPartner = false, data = MOCK_REPORT_DATA) => fetchMock.post(
  `/itx-api/v1/tax-calculation-report?reportType=${reportType}&forFiscalPartner=${isPartner}`,
  {
    body: data,
  },
);

const mockGetVacancyOptions = () => fetchMock.get('/itx-api/v1/lookup/vacancy-options',
  {
    body: MOCK_VACANCY_OPTIONS,
  });

const saveDossierDetails = jest.fn();

const setupDom = ({
  initialData = MOCK_ASSETS_DATA, calculateUpdatedTax = jest.fn(),
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      saveDossierDetails,
      countries: COUNTRIES,
      tabOptions: TAB_OPTIONS,
      activeTab: ACTIVE_TAB,
      globalClientId: GLOBAL_CLIENT_ID,
      calculateUpdatedTax,
    }
  }
  >
    <AssetsContainer />
  </TaxForecastContext.Provider>,
);

const updateFields = async (data, taxSpy, fieldDataTa, fieldName) => {
  mockAutoSaveDeclaration();
  const { getByTestId } = setupDom({ initialData: data, calculateUpdatedTax: taxSpy });
  const description = await waitForElement(() => getByNameAttribute(getByTestId(fieldDataTa), fieldName));

  // Act
  await act(async () => {
    changeInput(description, 'test descz');
  });
};

const updateCommonFormFields = (getByTestId) => {
  changeInput(getByNameAttribute(getByTestId('street'), 'address.street'), 'streetz');
  changeInput(getByNameAttribute(getByTestId('house-number'), 'address.houseNumber'), 1500);
  changeInput(getByNameAttribute(getByTestId('addition-to-house-number'), 'address.additionToHouseNumber'), '233');
  changeInput(getByNameAttribute(getByTestId('zip-code'), 'address.zipCode'), '4557ZQ');
  changeInput(getByNameAttribute(getByTestId('city'), 'address.city'), 'test');
  changeInput(getByNameAttribute(getByTestId('woz-reference-number'), 'wozReferenceNumber'), 123456);
  jest.useFakeTimers();
  changeInput(getByNameAttribute(getByTestId('woz'), 'woz'), 1000);
  jest.runOnlyPendingTimers();
  jest.useFakeTimers();
  changeInput(getByNameAttribute(getByTestId('percentage-of-ownership'), 'percentageOfOwnership'), 10);
  jest.runOnlyPendingTimers();
};

describe('assets', () => {
  afterEach(fetchMock.restore);

  it('should load assets component', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        businessDetails: null,
        masterData: {
          ...MOCK_ASSETS_DATA.masterData,
          owners: [
            {
              displayName: 'Sem Abel Hiddie',
              value: '1',
            },
            {
              displayName: 'Both',
              value: '3',
            },
          ],
        },
      },
    });

    // Act
    const assetsSection = await waitForElement(() => getByTestId('tax-forecast-assets'));

    // Assert
    expect(assetsSection).toBeInTheDocument();
  });

  it('should be able to call allocation end point with recommendedAllocation is false when update data in environmental investments section in assets', async () => {
    // Arrange
    mockGetRecommendedAllocationData({ recommendedAllocation: false });
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        dossierManifest: {
          ...MOCK_ASSETS_DATA.dossierManifest,
          isJointDeclaration: true,
        },
        personalDetails: {
          ...MOCK_ASSETS_DATA.personalDetails,
          isJointDeclaration: true,
          fiscalPartner: {
            taxableSubjectId: '2f7d389d-2bea-4fc5-9e40-aaa80087ab84',
            firstName: 'Thijs',
            initials: null,
            middleName: 'lk',
            lastName: 'c',
            bsn: '32131231-1',
            birthDate: '2019-08-29T13:29:26.4106301',
            deathDate: '',
            livingTogetherPreciseSituation: 2,
            maritalStatus: 2,
            age: 0,
            fullName: 'Thijs lk c',
          },
        },
        assetsScreen: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS,
      },
    });
    const dividendButton = await waitForElement(() => getByTestId(`environmental-investments-dividend-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(dividendButton);
    const editForm = await waitForElement(() => getByTestId('environmental-investments-modal-form'));
    await act(() => {
      changeInput(getByNameAttribute(getByTestId('netherLandDividend-dividend-tax'), 'netherLandDividend.dividendTax'), 550);
    });

    await wait(() => fireEvent.submit(editForm));

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/allocation-report?recommendedAllocation=false')).toEqual(true));
  }, 10000);

  it('should be able to call allocation end point with recommendedAllocation is true when update data in environmental investments section in assets', async () => {
    // Arrange
    mockGetRecommendedAllocationData({ recommendedAllocation: true });
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        dossierManifest: {
          ...MOCK_ASSETS_DATA.dossierManifest,
          isJointDeclaration: true,
        },
        personalDetails: {
          ...MOCK_ASSETS_DATA.personalDetails,
          isJointDeclaration: true,
          fiscalPartner: {
            taxableSubjectId: '2f7d389d-2bea-4fc5-9e40-aaa80087ab84',
            firstName: 'Thijs',
            initials: null,
            middleName: 'lk',
            lastName: 'c',
            bsn: '32131231-1',
            birthDate: '2019-08-29T13:29:26.4106301',
            deathDate: '',
            livingTogetherPreciseSituation: 2,
            maritalStatus: 2,
            age: 0,
            fullName: 'Thijs lk c',
          },
        },
        assetsScreen: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS,
        allocationDetails: null,
      },
    });
    const dividendButton = await waitForElement(() => getByTestId(`environmental-investments-dividend-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(dividendButton);
    const editForm = await waitForElement(() => getByTestId('environmental-investments-modal-form'));
    await act(() => {
      changeInput(getByNameAttribute(getByTestId('netherLandDividend-dividend-tax'), 'netherLandDividend.dividendTax'), 580);
    });

    await wait(() => fireEvent.submit(editForm));

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/allocation-report?recommendedAllocation=true')).toEqual(true));
  }, 10000);

  // TODO: hided this field based on the task VPC-44430
  // it('should display the error in own home modal if purchase price is empty', async () => {
  //   // Arrange
  //   const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
  //   const editButton = await waitForElement(() => getByTestId(`own-home-edit-${DEFAULT_ROW_INDEX}`));

  //   // Act
  //   fireEvent.click(editButton);
  //   const purchasePriceField = await waitForElement(() => getByNameAttribute(getByTestId('purchase-price'), 'purchaseprice'));

  //   act(() => {
  //     changeInput(purchasePriceField, '');
  //     fireEvent.blur(purchasePriceField);
  //   });

  //   // Assert
  //   await wait(() => expect(getByTestId('error-purchaseprice')).toBeInTheDocument());
  // });

  // it('should display the error in own home modal if selling price is empty', async () => {
  //   // Arrange
  //   const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
  //   const editButton = await waitForElement(() => getByTestId(`own-home-edit-${DEFAULT_ROW_INDEX}`));

  //   // Act
  //   fireEvent.click(editButton);
  //   const sellingPriceField = await waitForElement(() => getByNameAttribute(getByTestId('selling-price'), 'sellingPrice'));

  //   act(() => {
  //     changeInput(sellingPriceField, '');
  //     fireEvent.blur(sellingPriceField);
  //   });

  //   // Assert
  //   await wait(() => expect(getByTestId('error-sellingPrice')).toBeInTheDocument());
  // });

  it('should display the invalid error for end date if start date is empty in own home modal', async () => {
    // Arrange
    mockGetVacancyOptions();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const editButton = await waitForElement(() => getByTestId(`own-home-edit-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(editButton);
    const startDateField = await waitForElement(() => getByNameAttribute(getByTestId('startDate'), 'startDate'));
    const endDateField = await waitForElement(() => getByNameAttribute(getByTestId('endDate'), 'endDate'));
    act(() => {
      changeInput(startDateField, '');
      changeInput(endDateField, '');
      changeInput(endDateField, '2020-04-09');
      fireEvent.blur(endDateField);
    });

    // Assert
    await wait(() => expect(getByTestId('error-endDate')).toBeInTheDocument());
  });

  it('should display all the available assets section links onClick of add item button', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const showSectionsListButton = await waitForElement(() => getByTestId('add-assets-section-button'));
    const assetsForm = await waitForElement(() => getByTestId('tax-forecast-assets'));

    // Act
    fireEvent.click(showSectionsListButton);
    const assetsSectionsList = assetsForm.querySelectorAll('.mdc-list-item');

    // Assert
    expect(assetsSectionsList.length).toBe(SECTION_LIST.length);
  });

  it('should disable the section link in add-sections menu list after adding the particular asset section', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const showSectionsListButton = await waitForElement(() => getByTestId('add-assets-section-button'));
    const assetsForm = await waitForElement(() => getByTestId('tax-forecast-assets'));

    // Act
    fireEvent.click(showSectionsListButton);
    SECTION_LIST.forEach((section, index) => {
      const assetsSectionList = assetsForm.querySelectorAll('.mdc-list-item');
      fireEvent.click(assetsSectionList[index]);
      if (index < (SECTION_LIST.length - 1)) {
        fireEvent.click(showSectionsListButton);

        // Assert
        expect(assetsForm.querySelectorAll('.mdc-list-item')[index].classList.contains('mdc-list-item--disabled')).toBe(true);
      } else {
        // Assert
        expect(showSectionsListButton).toBeDisabled();
      }
    });
  });

  it('should delete the own home section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });

    // Act
    await removeSection(getByTestId, 'remove-own-home');

    // Assert
    expect(queryByTestId('own-home')).toBeNull();
  });

  it('should delete the substantial interest section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_SUBSTANTIAL_INTEREST } });

    // Act
    await removeSection(getByTestId, 'remove-substantial-interest');

    // Assert
    expect(queryByTestId('substantial-interest')).toBeNull();
  });

  it('should delete the other properties section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_PROPERTIES } });

    // Act
    await removeSection(getByTestId, 'remove-other-properties');

    // Assert
    expect(queryByTestId('other-properties')).toBeNull();
  });

  it('should delete the bank account section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_BANK_ACCOUNTS } });

    // Act
    await removeSection(getByTestId, 'remove-bank-account-section');

    // Assert
    expect(queryByTestId('bank-account-section')).toBeNull();
  });

  it('should delete the investment accounts section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_INVESTMENT_ACCOUNTS } });

    // Act
    await removeSection(getByTestId, 'remove-investment-accounts-section');

    // Assert
    expect(queryByTestId('investment-accounts-section')).toBeNull();
  });

  it('should delete the environmental investments section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS } });

    // Act
    await removeSection(getByTestId, 'remove-environmental-investments-section');

    // Assert
    expect(queryByTestId('environmental-investments-section')).toBeNull();
  });

  it('should delete the net worth of periodical benefits section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_PERIODICAL_ASSETS } });

    // Act
    await removeSection(getByTestId, 'remove-net-worth-of-periodical-benefits-section');

    // Assert
    expect(queryByTestId('net-worth-of-periodical-benefits-section')).toBeNull();
  });

  it('should delete the outstanding loan or cash section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OUTSTANDING_LOAN_ASSETS } });

    // Act
    await removeSection(getByTestId, 'remove-outstanding-loan-or-cash-section');

    // Assert
    expect(queryByTestId('outstanding-loan-or-cash-section')).toBeNull();
  });

  it('should delete the other assets section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_ASSETS } });

    // Act
    await removeSection(getByTestId, 'remove-other-assets-section');

    // Assert
    expect(queryByTestId('other-assets-section')).toBeNull();
  });

  it('should delete the non exempt capital insurance section on click of remove', async () => {
    // Arrange
    mockGetReportBokkzData();
    mockAutoSaveDeclaration();
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_NON_EXEMPT_INSURANCES } });

    // Act
    await removeSection(getByTestId, 'remove-non-exempt-capital-insurance-section');

    // Assert
    expect(queryByTestId('non-exempt-capital-insurance-section')).toBeNull();
  });

  it('should be able to call tax calculation on change of description on bank account section in assets', async () => {
    // Arrange
    const taxSpy = jest.fn();
    await updateFields({ ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_BANK_ACCOUNTS }, taxSpy, `bank-account-description-${DEFAULT_ROW_INDEX}`, `jointAssets.bankAccounts.${DEFAULT_ROW_INDEX}.description`);

    // Assert
    await wait(() => expect(taxSpy).toHaveBeenCalledTimes(1));
  }, 10000);

  it('it should select country as nederland by default if description is entered in bank accounts section', async () => {
    // Arrange
    const { getByTestId, getByText } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: null } });
    const showSectionsListButton = await waitForElement(() => getByTestId('add-assets-section-button'));
    const assetsForm = await waitForElement(() => getByTestId('tax-forecast-assets'));

    // Act
    fireEvent.click(showSectionsListButton);
    const assetsSectionsList = assetsForm.querySelectorAll('.mdc-list-item');
    fireEvent.click(assetsSectionsList[3]);
    const description = await waitForElement(() => getByNameAttribute(getByTestId(`bank-account-description-${DEFAULT_ROW_INDEX}`), `jointAssets.bankAccounts.${DEFAULT_ROW_INDEX}.description`));

    // Act
    act(() => {
      changeInput(description, 'test desc');
    });

    // Assert
    await wait(() => expect(getByText('NL')).toBeInTheDocument());
  }, 10000);

  it('should be able to call tax calculation on change of description in other account section in assets', async () => {
    // Arrange
    const taxSpy = jest.fn();
    await updateFields({ ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_ASSETS }, taxSpy, `other-assets-description-${DEFAULT_ROW_INDEX}`, `jointAssets.otherAssets.${DEFAULT_ROW_INDEX}.description`);

    // Assert
    await wait(() => expect(taxSpy).toHaveBeenCalledTimes(1));
  }, 10000);

  it('should be able to call tax calculation on change of description in periodic benefits section in assets', async () => {
    // Arrange
    const taxSpy = jest.fn();
    await updateFields({ ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_PERIODICAL_ASSETS }, taxSpy, `net-worth-of-periodical-benefits-description-${DEFAULT_ROW_INDEX}`, `jointAssets.periodicalBenefits.${DEFAULT_ROW_INDEX}.description`);

    // Assert
    await wait(() => expect(taxSpy).toHaveBeenCalledTimes(1));
  }, 10000);

  it('should be able to call tax calculation on change of description in oustanding loan section in assets', async () => {
    // Arrange
    const taxSpy = jest.fn();
    await updateFields({ ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OUTSTANDING_LOAN_ASSETS }, taxSpy, `outstanding-loan-or-cash-description-${DEFAULT_ROW_INDEX}`, `jointAssets.outStandingLoansOrCash.${DEFAULT_ROW_INDEX}.description`);

    // Assert
    await wait(() => expect(taxSpy).toHaveBeenCalledTimes(1));
  }, 10000);

  it('should be able to call tax calculation on change of description in capital insurance section in assets', async () => {
    // Arrange
    const taxSpy = jest.fn();
    await updateFields({ ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_NON_EXEMPT_INSURANCES }, taxSpy, `non-exempt-capital-insurance-description-${DEFAULT_ROW_INDEX}`, `jointAssets.nonExemptCapitalInsurances.${DEFAULT_ROW_INDEX}.description`);

    // Assert
    await wait(() => expect(taxSpy).toHaveBeenCalledTimes(1));
  }, 10000);

  it('should be able to delete row from own homes section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const ownHomeSection = await waitForElement(() => getByTestId('own-home'));
    const deleteIcon = await waitForElement(() => getByTestId(`own-home-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(ownHomeSection);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(ownHomeSection)).toBe(initialRows - 1));
  });

  it('should be able to delete row from substantial interest section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_SUBSTANTIAL_INTEREST } });
    const substantialInterestSection = await waitForElement(() => getByTestId('substantial-interest'));
    const deleteIcon = await waitForElement(() => getByTestId(`substantial-interest-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(substantialInterestSection);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(substantialInterestSection)).toBe(initialRows - 1));
  });

  it('should be able to delete row from bank account section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_BANK_ACCOUNTS } });
    const bankAccountTable = await waitForElement(() => getByTestId('bank-account-table'));
    const deleteIcon = await waitForElement(() => getByTestId(`bank-account-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(bankAccountTable);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(bankAccountTable)).toBe(initialRows - 1));
  });

  it('should be able to delete row from investment accounts section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_INVESTMENT_ACCOUNTS } });
    const investmentAccountTable = await waitForElement(() => getByTestId('investment-accounts-table'));
    const deleteIcon = await waitForElement(() => getByTestId(`investment-accounts-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(investmentAccountTable);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(investmentAccountTable)).toBe(initialRows - 1));
  });

  it('should be able to delete row from environmental investments section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS } });
    const environmentalInvestmentsTable = await waitForElement(() => getByTestId('environmental-investments-table'));
    const deleteIcon = await waitForElement(() => getByTestId(`environmental-investments-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(environmentalInvestmentsTable);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(environmentalInvestmentsTable)).toBe(initialRows - 1));
  });
  
  it('should display error when rentedOutOrLeased is rented and annualRent is empty in other properties modal', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        assetsScreen: MOCK_DATA_OTHER_PROPERTIES,
      },
    });
    const addButton = await waitForElement(() => getByTestId('add-other-properties-button'));

    // Act
    fireEvent.click(addButton);
    const assetsModalForm = await waitForElement(() => getByTestId('other-properties-form'));
    const rentedOption = selectAutoCompleteOption(assetsModalForm, '.rent-or-lease-select', 1, true);
    fireEvent.click(rentedOption);
    const annualRentField = await waitForElement(() => getByNameAttribute(getByTestId('annual-rent'), 'rentedOutOrLeased.annualRent'));

    act(() => {
      changeInput(annualRentField, '');
      fireEvent.blur(annualRentField);
    });
    const errorDom = await waitForElement(() => getByTestId('error-rentedOutOrLeased.annualRent'));

    // Assert
    expect(errorDom).toBeInTheDocument();
  }, 10000);

  it('should be able to delete row from other properties section in assets', async () => {
    // Arrange
    mockGetReportBokkzData();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_PROPERTIES } });
    const otherPropertiesSection = await waitForElement(() => getByTestId('other-properties'));
    const initialRows = getTableRowsCount(otherPropertiesSection);
    const deleteIcon = await waitForElement(() => getByTestId(`other-properties-row-${DEFAULT_ROW_INDEX}`));

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(otherPropertiesSection)).toBe(initialRows - 1));
  });

  it('should be able to delete row from other assets section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_ASSETS } });
    const otherAssetsSection = await waitForElement(() => getByTestId('other-assets-table'));
    const deleteIcon = await waitForElement(() => getByTestId(`other-assets-row-${DEFAULT_ROW_INDEX}`));
    const initialRows = getTableRowsCount(otherAssetsSection);

    // Act
    const description = await waitForElement(() => getByNameAttribute(getByTestId(`other-assets-description-${DEFAULT_ROW_INDEX}`), `jointAssets.otherAssets.${DEFAULT_ROW_INDEX}.description`));
    const amount = await waitForElement(() => getByNameAttribute(getByTestId(`other-assets-amount-${DEFAULT_ROW_INDEX}`), `jointAssets.otherAssets.${DEFAULT_ROW_INDEX}.amount`));

    // Act
    changeInput(description, 'test desc');
    jest.useFakeTimers();
    changeInput(amount, 299);
    jest.runOnlyPendingTimers();

    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(otherAssetsSection)).toBe(initialRows - 1));
  }, 15000);

  it('should be able to display add modal in substantial interest section in assets', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_SUBSTANTIAL_INTEREST } });
    const addButton = await waitForElement(() => getByTestId('add-substantial-interest-button'));

    // Act
    act(() => {
      fireEvent.click(addButton);
    });
    const addModal = await waitForElement(() => getByTestId('substantial-interest-modal'));

    // Assert
    expect(addModal).toBeInTheDocument();
  });

  it('should be able to reset acquisition price if business name is cleared in assets substantial interest modal', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_SUBSTANTIAL_INTEREST } });
    const editButton = await waitForElement(() => getByTestId(`substantial-interest-edit-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(editButton);
    const businessNameInput = await waitForElement(() => getByNameAttribute(getByTestId('business-name'), 'businessName'));
    changeInput(businessNameInput, '');

    // Assert
    await wait(() => expect(getByNameAttribute(getByTestId('acquisition-price'), 'acquisitionPrice').value).toEqual(''));
  }, 10000);

  it('should load the rental income modal onclick of edit rental income icon in own homes section', async () => {
    // Arrange
    mockGetVacancyOptions();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const addButton = await waitForElement(() => getByTestId('add-own-home-button'));

    // Act
    fireEvent.click(addButton);
    const editIcon = await waitForElement(() => getByTestId('edit-rental-income'));
    fireEvent.click(editIcon);
    const rentalIncomeModal = await waitForElement(() => getByTestId('rentalIncome-modal'));

    // Assert
    expect(rentalIncomeModal).toBeInTheDocument();
  });

  it('should load the costs of rental modal onclick of edit const of rental icon in own homes section', async () => {
    // Arrange
    mockGetVacancyOptions();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const addButton = await waitForElement(() => getByTestId('add-own-home-button'));

    // Act
    fireEvent.click(addButton);
    const editIcon = await waitForElement(() => getByTestId('edit-cost-of-rental'));
    fireEvent.click(editIcon);
    const costOfRentalModal = await waitForElement(() => getByTestId('costOfRental-modal'));

    // Assert
    expect(costOfRentalModal).toBeInTheDocument();
  });

  // TODO: hided this field based on the task VPC-44430
  // it('should be able to hide purchase price input while removing purchase date in own homes section', async () => {
  //   // Arrange
  //   const { getByTestId } = setupDom({ initialData: {
  //     ...MOCK_ASSETS_DATA,
  //     assetsScreen: MOCK_DATA_OWN_HOMES,
  //     masterData: {
  //       ...MOCK_ASSETS_DATA.masterData,
  //       owners: [
  //         {
  //           displayName: 'Sem Abel Hiddie',
  //           value: '1',
  //         },
  //       ],
  //     }
  //   }});
  //   const addButton = await waitForElement(() => getByTestId('add-own-home-button'));

  //   // Act
  //   fireEvent.click(addButton);
  //   const assetsModalForm = await waitForElement(() => getByTestId('own-home-form'));

  //   const purchaseDateInput = assetsModalForm.querySelector('.date-of-purchase .SingleDatePickerInput .DateInput_input');
  //   changeInput(purchaseDateInput, '2020-08-09');
  //   const purchasePrice = await waitForElement(() => getByTestId('purchase-price'));
  //   const purchaseDateRemoveIcon = assetsModalForm.querySelector('.date-of-purchase .SingleDatePickerInput .SingleDatePickerInput_clearDate');
  //   fireEvent.click(purchaseDateRemoveIcon);

  //   await wait(() => expect(purchasePrice).not.toBeInTheDocument());
  // }, 10000);

  // it('should be able to hide selling price input while removing selling date in own homes section', async () => {
  //   // Arrange
  //   const { getByTestId } = setupDom({ initialData: {
  //     ...MOCK_ASSETS_DATA,
  //     assetsScreen: MOCK_DATA_OWN_HOMES,
  //     masterData: {
  //       ...MOCK_ASSETS_DATA.masterData,
  //       owners: [
  //         {
  //           displayName: 'Sem Abel Hiddie',
  //           value: '1',
  //         },
  //       ],
  //     }
  //   }});
  //   const addButton = await waitForElement(() => getByTestId('add-own-home-button'));

  //   // Act
  //   fireEvent.click(addButton);
  //   const assetsModalForm = await waitForElement(() => getByTestId('own-home-form'));

  //   const sellingDateInput = assetsModalForm.querySelector('.date-of-selling .SingleDatePickerInput .DateInput_input');
  //   changeInput(sellingDateInput, '2020-10-09');
  //   const sellingPrice = await waitForElement(() => getByTestId('selling-price'));
  //   const sellingDateRemoveIcon = assetsModalForm.querySelector('.date-of-selling .SingleDatePickerInput .SingleDatePickerInput_clearDate');
  //   fireEvent.click(sellingDateRemoveIcon);

  //   await wait(() => expect(sellingPrice).not.toBeInTheDocument());
  // }, 10000);

  it('should be able to add new row and submit in own homes section in assets', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    mockGetVacancyOptions();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const addButton = await waitForElement(() => getByTestId('add-own-home-button'));

    // Act
    fireEvent.click(addButton);
    const assetsModalForm = await waitForElement(() => getByTestId('own-home-form'));
    const belongsToOption = selectAutoCompleteOption(assetsModalForm, '.belongs-to', 0, true);
    fireEvent.click(belongsToOption);
    updateCommonFormFields(getByTestId);
    const startDateInput = assetsModalForm.querySelector('.start-date .SingleDatePickerInput .DateInput_input');
    changeInput(startDateInput, '2020-08-09');
    const endDateInput = assetsModalForm.querySelector('.end-date .SingleDatePickerInput .DateInput_input');
    changeInput(endDateInput, '2020-10-09');

    const vacancyOption = selectAutoCompleteOption(assetsModalForm, '.vacancy-select', 0, true);
    fireEvent.click(vacancyOption);

    const sellingDateInput = assetsModalForm.querySelector('.date-of-selling .SingleDatePickerInput .DateInput_input');
    changeInput(sellingDateInput, '2020-09-09');
    const purchaseDateInput = assetsModalForm.querySelector('.date-of-purchase .SingleDatePickerInput .DateInput_input');
    changeInput(purchaseDateInput, '2020-08-09');
    const editPurchaseCost = await waitForElement(() => getByTestId('edit-purchase-costs'));
    fireEvent.click(editPurchaseCost);

    const costForm = await waitForElement(() => getByTestId('costs-table-form'));
    changeInput(getByNameAttribute(costForm, `purchaseCosts.${DEFAULT_ROW_INDEX}.description`), 'test desc');
    changeInput(getByNameAttribute(costForm, `purchaseCosts.${DEFAULT_ROW_INDEX}.amount`), 500);
    await wait(() => fireEvent.submit(costForm));

    const editSellingCost = await waitForElement(() => getByTestId('edit-selling-costs'));
    fireEvent.click(editSellingCost);

    const sellingForm = await waitForElement(() => getByTestId('costs-table-form'));
    changeInput(getByNameAttribute(sellingForm, `sellingCosts.${DEFAULT_ROW_INDEX}.description`), 'test data');
    changeInput(getByNameAttribute(sellingForm, `sellingCosts.${DEFAULT_ROW_INDEX}.amount`), 700);
    await wait(() => fireEvent.submit(sellingForm));

    await wait(() => fireEvent.submit(assetsModalForm));

    // Assert
    await wait(() => expect(assetsModalForm).not.toBeInTheDocument());
  }, 15000);

  it('should be able to add new row and submit in other properties section in assets', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        assetsScreen: MOCK_DATA_OTHER_PROPERTIES,
        masterData: {
          ...MOCK_ASSETS_DATA.masterData,
          owners: [
            {
              displayName: 'Sem Abel Hiddie',
              value: '1',
            },
            {
              displayName: 'Both',
              value: '3',
            },
          ],
        },
      },
    });
    const addButton = await waitForElement(() => getByTestId('add-other-properties-button'));

    // Act
    fireEvent.click(addButton);
    const assetsModalForm = await waitForElement(() => getByTestId('other-properties-form'));
    updateCommonFormFields(getByTestId);

    fireEvent.submit(assetsModalForm);

    // Assert
    await wait(() => expect(assetsModalForm).not.toBeInTheDocument());
  }, 15000);

  it('should display lease agreement when leased option is selected in rentedOutOrLeased dropdown ', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        assetsScreen: MOCK_DATA_OTHER_PROPERTIES,
      },
    });
    const addButton = await waitForElement(() => getByTestId('add-other-properties-button'));

    // Act
    fireEvent.click(addButton);
    const assetsModalForm = await waitForElement(() => getByTestId('other-properties-form'));
    const leasedOption = selectAutoCompleteOption(assetsModalForm, '.rent-or-lease-select', 2, true);
    fireEvent.click(leasedOption);

    // Assert
    await wait(() => expect(assetsModalForm.querySelector('.lease-agreement-select')).toBeInTheDocument());
  }, 10000);

  it('should be able to update and submit data in substantial interest section in assets', async () => {
    // Arrange
    mockGetRecommendedAllocationData();
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({
      initialData: {
        ...MOCK_ASSETS_DATA,
        assetsScreen: MOCK_DATA_SUBSTANTIAL_INTEREST,
      },
    });
    const editButton = await waitForElement(() => getByTestId(`substantial-interest-edit-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(editButton);
    const editForm = await waitForElement(() => getByTestId('substantial-interest-form'));
    changeInput(getByNameAttribute(getByTestId('acquisition-price'), 'acquisitionPrice'), 1300);
    const countryOption = selectAutoCompleteOption(editForm, '.country-select', 1, true);
    fireEvent.click(countryOption);

    fireEvent.submit(editForm);

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
  }, 10000);

  it('should be able to update and submit data in own home section in assets', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    mockGetVacancyOptions();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OWN_HOMES } });
    const editButton = await waitForElement(() => getByTestId(`own-home-edit-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(editButton);
    const editForm = await waitForElement(() => getByTestId('own-home-form'));
    changeInput(getByNameAttribute(getByTestId('house-number'), 'address.houseNumber'), 150);

    act(() => {
      fireEvent.submit(editForm);
    });

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
  }, 10000);

  it('should be able to update and submit data in other properties section in assets', async () => {
    // Arrange
    const reportResponse = {
      content: {
        result: {
          AssetsImmovableOtherProperty: [{
            id: 'da761885-0f79-4b80-9278-e4d0df147aec',
            amount: 1250,
          }],
        },
      },
      meta: {
        totalRecords: '1',
      },
      errors: null,
    };
    mockGetReportBokkzData(OTHER_PROPERTIES_REPORT_KEY, false, reportResponse);
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_OTHER_PROPERTIES } });
    const editButton = await waitForElement(() => getByTestId(`other-properties-edit-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(editButton);
    const editForm = await waitForElement(() => getByTestId('other-properties-form'));
    changeInput(getByNameAttribute(getByTestId('house-number'), 'address.houseNumber'), 150);

    act(() => {
      fireEvent.submit(editForm);
    });

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
  }, 10000);

  it('should be able to update and submit dividend data in investment accounts section in assets', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_INVESTMENT_ACCOUNTS } });
    const dividendButton = await waitForElement(() => getByTestId(`investment-accounts-dividend-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(dividendButton);
    const editForm = await waitForElement(() => getByTestId('investment-accounts-modal-form'));
    jest.useFakeTimers();
    changeInput(getByNameAttribute(getByTestId('netherLandDividend-dividend-tax'), 'netherLandDividend.dividendTax'), 550);
    jest.runOnlyPendingTimers();
    const deleteRow = getByTestId(`other-country-dividend-table-row-${DEFAULT_ROW_INDEX}`);
    fireEvent.click(deleteRow);

    fireEvent.submit(editForm);

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
  }, 10000);

  it('should be able to update and submit dividend data in environmental investments section in assets', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupDom({ initialData: { ...MOCK_ASSETS_DATA, assetsScreen: MOCK_DATA_ENVIRONMENTAL_INVESTMENTS } });
    const dividendButton = await waitForElement(() => getByTestId(`environmental-investments-dividend-${DEFAULT_ROW_INDEX}`));

    // Act
    fireEvent.click(dividendButton);
    const editForm = await waitForElement(() => getByTestId('environmental-investments-modal-form'));
    jest.useFakeTimers();
    changeInput(getByNameAttribute(getByTestId('netherLandDividend-dividend-tax'), 'netherLandDividend.dividendTax'), 550);
    jest.runOnlyPendingTimers();

    fireEvent.submit(editForm);

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
  }, 10000);
});

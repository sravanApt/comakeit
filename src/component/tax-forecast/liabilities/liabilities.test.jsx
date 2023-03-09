import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  act,
  wait,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import TaxForecastContext from '../tax-forecast-context';
import {
  COUNTRIES,
  TAB_OPTIONS,
  ACTIVE_TAB,
  mockAutoSaveDeclaration,
  GLOBAL_CLIENT_ID,
} from '../tax-forecast.test.data';
import {
  MOCK_LIABILITIES_DATA,
  LIABILITIES_DATA_WITH_OUT_COSTS,
  EMPTY_LIABILITY_DATA,
  LIABILITIES_DATA_WITH_LOAN_GIVER,
  MOCK_LIABILITIES_OTHER_LOANS_DATA,
  MOCK_LIABILITIES_DATA_WITH_OWN_HOME,
  MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS,
} from './liabilities.test.data';
import LiabilitiesContainer from './liabilities-container';
import { changeInput, selectAutoCompleteOption } from '../../../common/test-helpers';
import { removeSection } from '../tax-forecast-test-helpers';
import { mockGetRecommendedAllocationData } from '../allocation/allocation.test.data';

const setupDom = ({
  initialData = MOCK_LIABILITIES_DATA, saveDossierDetails = jest.fn(), calculateUpdatedTax = jest.fn(),
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
    <LiabilitiesContainer />
  </TaxForecastContext.Provider>,
  mockAutoSaveDeclaration(),
  mockGetRecommendedAllocationData(),
);

const addNewSection = async (getByTestId, index = 0) => {
  const incomeForm = await waitForElement(() => getByTestId('liabilities-form'));
  const showIncomeSectionsListButton = getByTestId('add-liabilities-sections');
  fireEvent.click(showIncomeSectionsListButton);
  const incomeSectionsList = incomeForm.querySelectorAll('.mdc-list-item');
  fireEvent.click(incomeSectionsList[index]);
  fireEvent.click(showIncomeSectionsListButton);
};

const openModal = async (getByTestId, rowIndex = 0, dataTa = 'loans-for-own-home-section') => {
  const editIcon = await waitForElement(() => getByTestId(`edit-${dataTa}-${rowIndex}`));
  fireEvent.click(editIcon);
};

describe('Liabilities', () => {
  afterEach(fetchMock.restore);

  it('should load liabilities component', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: null } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('liabilities-form'));

    // Assert
    expect(liabilitiesSection).toBeInTheDocument();
  });

  it('should add own home liabilities section on selecting it from menu list', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: null } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('liabilities-form'));
    await addNewSection(getByTestId);

    // Assert
    expect(liabilitiesSection.querySelectorAll('.mdc-list-item--disabled').length).toBe(1);
  });

  it('should open modal on click of edit icon in own home section', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);

    // Assert
    await wait(() => expect(getByTestId('loans-for-own-home-section-form')).toBeInTheDocument());
  });

  it('should close modal on click of save button in own home section modal', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const dateOfBirth = await waitForElement(() => ownHomeModal.querySelector('.loan-giver-date-of-birth .SingleDatePickerInput .DateInput_input'));
    act(() => {
      changeInput(dateOfBirth, '1991-10-12');
    });
    const saveButton = getByTestId('loans-for-own-homes-modal-save-button');
    fireEvent.click(saveButton);

    // Assert
    await wait(() => expect(ownHomeModal).not.toBeInTheDocument());
  }, 10000);

  it('should be able to save a new row in own home section modal', async () => {
    // Arrange
    const saveSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: MOCK_LIABILITIES_OTHER_LOANS_DATA,
      saveDossierDetails: saveSpy,
    });

    // Act
    await addNewSection(getByTestId, 0);
    const addButton = await waitForElement(() => getByTestId('add-loans-for-own-home-section'));
    fireEvent.click(addButton);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const description = getByNameAttribute(getByTestId('own-home-description'), 'loanDetails.description');
    changeInput(description, 'test');
    const accountNumber = getByNameAttribute(getByTestId('own-home-account-number'), 'loanDetails.accountNumber');
    changeInput(accountNumber, '123456');
    const loanGiverOption = selectAutoCompleteOption(ownHomeModal, '.loan-giver-select', 1, true);
    fireEvent.click(loanGiverOption);
    const loanPurposeOption = selectAutoCompleteOption(ownHomeModal, '.loan-purpose-select', 1, true);
    fireEvent.click(loanPurposeOption);
    const percentageOfAmount = getByNameAttribute(getByTestId('own-home-percentage-amount'), 'loanDetails.percentageOfAmount');
    act(() => {
      changeInput(percentageOfAmount, 85);
    });
    const principalAmount = getByNameAttribute(getByTestId('principal-amount'), 'loanDetails.principalAmount');
    act(() => {
      changeInput(principalAmount, 10000);
    });
    const interest = getByNameAttribute(getByTestId('interest'), 'loanDetails.interest');
    act(() => {
      changeInput(interest, 90);
    });
    await wait(() => fireEvent.submit(ownHomeModal));

    // Assert
    await wait(() => expect(saveSpy).toHaveBeenCalled());
  }, 10000);

  it('should delete a row in costs table on click of remove icon', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const costsTable = await waitForElement(() => getByTestId('liabilities-for-own-home-costs-table'));
    const deleteIcons = costsTable.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    expect(costsTable.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1);
  }, 10000);

  it('should open modal on click of add button in own home section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    const addButton = await waitForElement(() => getByTestId('add-loans-for-own-home-section'));
    fireEvent.click(addButton);

    // Assert
    expect(getByTestId('loans-for-own-home-section-form')).toBeInTheDocument();
  }, 10000);

  it('should be able to delete a row in own home liabilities section on click of delete icon', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('liabilities-form'));
    const deleteIcons = liabilitiesSection.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    expect(liabilitiesSection.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1);
  });

  it('should be able to add loan giver section if non-administrative-subject option is selected as loan giver value', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId, getByText } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const loanGiverOption = await selectAutoCompleteOption(ownHomeModal, '.loan-giver-select', 3, true);
    act(() => {
      fireEvent.click(loanGiverOption);
    });

    // Assert
    await wait(() => expect(getByText('Gegevens geldverstrekker')).toBeInTheDocument());
  }, 10000);

  it('should be able to select an option in loan giver field in own home section modal', async () => {
    // Arrange
    const rowIndex = 0;
    const bankOption = 0;
    const { getByTestId, getByText } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const loanGiverOption = await selectAutoCompleteOption(ownHomeModal, '.loan-giver-select', bankOption, true);
    act(() => {
      fireEvent.click(loanGiverOption);
    });

    // Assert
    await wait(() => expect(getByText('Bank')).toBeInTheDocument());
  }, 10000);

  it('should be able to delete a section and enable link in menu list on removal of section', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: LIABILITIES_DATA_WITH_OUT_COSTS } });

    // Act
    await removeSection(getByTestId, 'remove-loans-for-own-home-section');

    // Assert
    expect(queryByTestId('loans-for-own-home-section')).toBeNull();
  });

  it('should open modal on click of edit icon in own home section with out costs data', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: LIABILITIES_DATA_WITH_OUT_COSTS } });

    // Act
    await openModal(getByTestId, rowIndex);

    // Assert
    expect(getByTestId('loans-for-own-home-section-form')).toBeInTheDocument();
  });

  it('should open modal on click of add details button with no liability data', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: EMPTY_LIABILITY_DATA } });

    // Act
    await addNewSection(getByTestId);
    const addButton = await waitForElement(() => getByTestId('add-loans-for-own-home-section'));
    fireEvent.click(addButton);

    // Assert
    expect(getByTestId('loans-for-own-home-section-form')).toBeInTheDocument();
  });

  it('should display the error if principle amount value is empty in own home section', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const principalAmountField = await waitForElement(() => getByNameAttribute(getByTestId('principal-amount'), 'loanDetails.principalAmount'));
    act(() => {
      changeInput(principalAmountField, '');
      fireEvent.blur(principalAmountField);
    });

    // Assert
    await wait(() => expect(getByTestId('error-loanDetails.principalAmount')).toBeInTheDocument());
  }, 10000);

  it('should display the error if interest value is empty in own home section', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_OWN_HOME } });

    // Act
    await openModal(getByTestId, rowIndex);
    const interestField = await waitForElement(() => getByNameAttribute(getByTestId('interest'), 'loanDetails.interest'));
    act(() => {
      changeInput(interestField, '');
      fireEvent.blur(interestField);
    });

    // Assert
    await wait(() => expect(getByTestId('error-loanDetails.interest')).toBeInTheDocument());
  }, 10000);

  it('should display the error if employee credit value is empty in residual own home section modal', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS } });

    // Act
    await openModal(getByTestId, rowIndex, 'loans-for-residual-own-home-section');
    const employeeCreditField = await waitForElement(() => getByNameAttribute(getByTestId('employee-credit'), 'loanDetails.employeeCredit'));
    act(() => {
      changeInput(employeeCreditField, '');
      fireEvent.blur(employeeCreditField);
    });

    // Assert
    await wait(() => expect(getByTestId('error-loanDetails.employeeCredit')).toBeInTheDocument());
  }, 10000);

  it('should show error if start date is greater than end date', async () => {
    // Arrange
    const rowIndex = 1;
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: LIABILITIES_DATA_WITH_LOAN_GIVER } });

    // Act
    await openModal(getByTestId, rowIndex);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const startDate = await waitForElement(() => ownHomeModal.querySelector('.loan-giver-start-date .SingleDatePickerInput .DateInput_input'));
    act(() => {
      changeInput(startDate, '2020-12-12');
    });
    const endDate = await waitForElement(() => ownHomeModal.querySelector('.loan-giver-end-date .SingleDatePickerInput .DateInput_input'));
    act(() => {
      changeInput(endDate, '2020-01-01');
    });

    // Assert
    await wait(() => expect(queryByTestId('error-loanGiverDetails.endDate')).toBeInTheDocument());
  });

  it('should show error if end date is given without start date', async () => {
    // Arrange
    const rowIndex = 0;
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: LIABILITIES_DATA_WITH_LOAN_GIVER } });

    // Act
    await openModal(getByTestId, rowIndex);
    const ownHomeModal = await waitForElement(() => getByTestId('loans-for-own-home-section-form'));
    const endDate = await waitForElement(() => ownHomeModal.querySelector('.loan-giver-end-date .SingleDatePickerInput .DateInput_input'));
    act(() => {
      changeInput(endDate, '2020-01-01');
    });

    // Assert
    await wait(() => expect(queryByTestId('error-loanGiverDetails.endDate')).toBeInTheDocument());
  });
  it('should add residual own home liabilities section on selecting it from menu list', async () => {
    // Arrange
    const sectionIndex = 1;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: null } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('liabilities-form'));
    await addNewSection(getByTestId, sectionIndex);

    // Assert
    expect(liabilitiesSection.querySelectorAll('.mdc-list-item--disabled').length).toBe(1);
  });

  it('should add other amount liabilities section on selecting it from menu list', async () => {
    // Arrange
    const sectionIndex = 2;
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: null } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('liabilities-form'));
    await addNewSection(getByTestId, sectionIndex);

    // Assert
    expect(liabilitiesSection.querySelectorAll('.mdc-list-item--disabled').length).toBe(1);
  });

  it('should add a new row and display the error under the account number field in other amount liabilities section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: MOCK_LIABILITIES_OTHER_LOANS_DATA });

    // Act
    const otherAmountSection = await waitForElement(() => getByTestId('other-amounts-liability'));
    const inputRows = otherAmountSection.querySelectorAll('.fa-trash').length;
    const descriptionField = await waitForElement(() => getByNameAttribute(getByTestId(`other-amounts-description-${inputRows}`), `jointLiabilities.otherLoans.${inputRows}.description`));
    changeInput(descriptionField, 'test');
    fireEvent.blur(descriptionField);

    // Assert
    expect(otherAmountSection.querySelectorAll('.fa-trash').length).toBe(inputRows + 1);
    await wait(() => expect(getByTestId(`error-jointLiabilities.otherLoans.${inputRows}.accountNumber`)).toBeInTheDocument());
  }, 20000);

  it('should call taxcalculation api on change of fields in other amount liabilities section', async () => {
    // Arrange
    const rowIndex = 0;
    const taxcalculationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: MOCK_LIABILITIES_OTHER_LOANS_DATA,
      calculateUpdatedTax: taxcalculationSpy,
    });

    // Act
    const descriptionField = await waitForElement(() => getByNameAttribute(getByTestId(`other-amounts-description-${rowIndex}`), `jointLiabilities.otherLoans.${rowIndex}.description`));
    const amountField = getByNameAttribute(getByTestId(`other-amounts-principal-${rowIndex}`), `jointLiabilities.otherLoans.${rowIndex}.principalAmount`);
    await wait(() => changeInput(descriptionField, 'test'));
    jest.useFakeTimers();
    act(() => {
      changeInput(amountField, 300);
    });
    jest.runOnlyPendingTimers();

    // Assert
    await wait(() => expect(taxcalculationSpy).toHaveBeenCalledTimes(2));
  }, 20000);

  it('should be able to delete a row in other amount liabilities section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: MOCK_LIABILITIES_OTHER_LOANS_DATA });

    // Act
    const otherAmountSection = await waitForElement(() => getByTestId('other-amounts-liability'));
    const inputRows = otherAmountSection.querySelectorAll('.fa-trash');
    fireEvent.click(inputRows[0]);

    // Assert
    expect(otherAmountSection.querySelectorAll('.fa-trash').length).toBe(inputRows.length - 1);
  });

  it('should be able to delete residual own home section and enable link in menu list on removal of section', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS } });

    // Act
    await removeSection(getByTestId, 'remove-loans-for-residual-own-home-section');

    // Assert
    expect(queryByTestId('loans-for-residual-own-home-section')).toBeNull();
  });

  it('should be able to delete other amounts section and enable link in menu list on removal of section', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({ initialData: MOCK_LIABILITIES_OTHER_LOANS_DATA });

    // Act
    await removeSection(getByTestId, 'remove-other-amounts-liability');

    // Assert
    expect(queryByTestId('other-amounts-liability')).not.toBeInTheDocument();
  });

  it('should be able to delete a row in residual own home liabilities section on click of delete icon', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS } });

    // Act
    const liabilitiesSection = await waitForElement(() => getByTestId('loans-for-residual-own-home-section'));
    const deleteIcons = liabilitiesSection.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(liabilitiesSection.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  });

  it('should call save function on click of save button in residual own home section modal', async () => {
    // Arrange
    const saveSpy = jest.fn();
    const rowIndex = 0;
    const { getByTestId } = setupDom({
      initialData: { ...MOCK_LIABILITIES_DATA, liabilitiesScreen: MOCK_LIABILITIES_DATA_WITH_RESIDUAL_LOANS },
      saveDossierDetails: saveSpy,
    });

    // Act
    await openModal(getByTestId, rowIndex, 'loans-for-residual-own-home-section');
    const saveButton = getByTestId('loans-for-own-homes-modal-save-button');
    fireEvent.click(saveButton);

    // Assert
    await wait(() => expect(saveSpy).toHaveBeenCalled());
  });
});

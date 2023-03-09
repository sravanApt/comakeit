import React from 'react';
import {
  render,
  wait,
  waitForElement,
  fireEvent,
  act,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import { changeInput, selectAutoCompleteOption } from '../../../common/test-helpers';
import ExpenditureContainer from './expenditure-container';
import TaxForecastContext from '../tax-forecast-context';
import {
  COUNTRIES,
  ACTIVE_TAB,
  ACTIVE_PARTNER_OBJECT,
  TAB_OPTIONS,
  mockAutoSaveDeclaration,
  GLOBAL_CLIENT_ID,
  CALCULATE_TAX,
  JOINT_FORECAST_DATA,
} from '../tax-forecast.test.data';
import {
  EXPENDITURE_MODAL_FORM,
  DOSSIER_DATA,
  EXPENDITURE_EMPTY_DATA,
  PUBLIC_TRANSPORT_DATA,
  ANNUITY_PREMIUM_DATA,
  PREMIUM_DISABLE_INSURANCE_DATA,
  // WAIVED_EXPENDITURE_CAPITAL_DATA,
  WEEKEND_EXPENSE_DATA,
  GIFTS_DATA,
  EDUCATIONAL_EXPENSES_DATA,
  EDUCATIONAL_EXPENSES_DATA_WITH_OUT_DETAILS,
  EXPENSES_FOR_HEALTH_CARE_DATA,
  ALIMONY_DATA,
  PREMIUM_GENERAL_SURVIVORS_DATA,
  PREMIUM_CHILD_DATA,
  STUDYGRANT_EDUCATIONAL_EXPENSES_DATA,
  mockGetDeceaseList,
  mockGetReportBokkzData,
  mockGetAggrigatedReportData,
} from './expenditure.test.data';
import { mockGetRecommendedAllocationData } from '../allocation/allocation.test.data';
import {
  endDateofYear, startDateofYear, dateToDayMonthAndYearString, getCurrentYear,
} from '../../../common/utils';

const dateFormat = 'DD-MM-YYYY';
const currentYear = getCurrentYear();

const setActiveTab = jest.fn();
const saveDossierDetails = jest.fn();
const currentRowIndex = 0;

const setupDom = ({
  initialData = DOSSIER_DATA,
  calculateUpdatedTax = jest.fn(),
  tabOptions = TAB_OPTIONS,
  activeTab = ACTIVE_TAB,
  setTaxableAmount = jest.fn(),
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      countries: COUNTRIES,
      calculateUpdatedTax,
      setActiveTab,
      isPartner: !!activeTab,
      activeTab,
      tabOptions,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails,
      setTaxableAmount,
    }
  }
  >
    <ExpenditureContainer />
  </TaxForecastContext.Provider>,
  mockGetAggrigatedReportData(),
);

const mockCalculateTax = ({ response = CALCULATE_TAX } = {}) => fetchMock.post(
  '/itx-api/v1/declaration/calculate-income-tax',
  {
    body: response,
  },
);

const addNewSection = async (getByTestId, expenditureForm, sectionIndexToAdd = 0) => {
  const showExpenditureSectionsListButton = await waitForElement(() => getByTestId('add-expenditure-sections-button'));
  await wait(() => fireEvent.click(showExpenditureSectionsListButton));

  const expenditureSectionsList = expenditureForm.querySelectorAll('.mdc-list-item');
  fireEvent.click(expenditureSectionsList[sectionIndexToAdd]);
};

const deleteSection = async (getByTestId, expenditureForm) => {
  const sectionDeleteElement = await waitForElement(() => expenditureForm.querySelector('.income-section__remove'));
  fireEvent.click(sectionDeleteElement);
  await wait(() => fireEvent.click(getByTestId('confirm-dialog-submit')));
  const menulistButton = getByTestId('add-expenditure-sections-button');
  fireEvent.click(menulistButton);

  return sectionDeleteElement;
};

const deleteRow = (section) => {
  const deleteIcon = section.querySelector('.icon__actions--trash');
  fireEvent.click(deleteIcon);
};

const updateCurrecnyInputFields = async (item) => {
  jest.useFakeTimers();
  await changeInput(getByNameAttribute(item.node, item.path), 110);
  jest.runOnlyPendingTimers();
};

const addAndDeleteSection = async (getByTestId, expenditureForm, index) => {
  await addNewSection(getByTestId, expenditureForm, index);
  const sectionDeleteElement = deleteSection(getByTestId, expenditureForm);
  return sectionDeleteElement;
};

const openEditModalAndSave = async (getByTestId, dataTa, editIconIndex, rowIndex = 0, reimbursement = false) => {
  const path = `correctionData.details.${currentRowIndex}`;
  mockAutoSaveDeclaration();
  await openEditModal(getByTestId, dataTa, editIconIndex);

  const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
  await wait(() => changeInput(getByNameAttribute(getByTestId(`treatment-modal-description${rowIndex}`), `${path}.description`), 'Elcucuy'));
  jest.useFakeTimers();
  changeInput(getByNameAttribute(getByTestId(`treatment-modal-amount${rowIndex}`), `${path}.amount`), 1100);
  jest.runOnlyPendingTimers();
  if (reimbursement) {
    jest.useFakeTimers();
    changeInput(getByNameAttribute(getByTestId('expenditure-modal-reimbursement'), 'correctionData.reimbursement'), '');
    jest.runOnlyPendingTimers();
  }

  fireEvent.submit(expenditureForm);
};

const openEditModal = async (getByTestId, dataTa, editIconIndex) => {
  const section = await waitForElement(() => getByTestId(dataTa));
  const editIcons = section.querySelectorAll('.icon__edit');
  fireEvent.click(editIcons[editIconIndex]);
};

describe('tax forecast - expenditure form', () => {
  afterEach(fetchMock.restore);

  it('should display drawer on click of add expenditure button', async () => {
    // Arrange
    const { getByTestId } = setupDom();
    const expenditureSectionButton = await waitForElement(() => getByTestId('add-expenditure-sections-button'));
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    fireEvent.click(expenditureSectionButton);

    // Assert
    expect(expenditureForm.querySelectorAll('.mdc-list').length).toBe(1);
  });

  it('should be able add a row in deductions for public transport section and disable amount field if description is empty', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    const currentRowIndex = 0;
    const path = `taxableSubjectExpenditureDetails.expensesForPublicTransportation.travelDeliveryDetails.${currentRowIndex}`;

    // Act
    await addNewSection(getByTestId, expenditureForm, 0);
    const description = await waitForElement(() => getByTestId('transport-description0'));
    changeInput(getByNameAttribute(description, `${path}.description`), 'Nate');

    // Assert
    await wait(() => expect(getByTestId('public-transportation-expenses').querySelectorAll('.icon__actions').length).toBe(1));

    // Act
    changeInput(getByNameAttribute(description, `${path}.description`), '');
    const amountField = await waitForElement(() => getByTestId('transport-deduction-compensation0'));

    // Assert
    await wait(() => expect(amountField.querySelector('input')).toBeDisabled());
  }, 10000);

  it('should be able to remove the deductions for public transport section', async () => {
    // Arrange
    mockGetReportBokkzData('ExpenditureTotalDeductionForPublicTransportation');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const deductionSectionDelete = await addAndDeleteSection(getByTestId, expenditureForm, 0);

    // Assert
    expect(deductionSectionDelete).not.toBeInTheDocument();
  }, 10000);

  it('should be able to remove the deductions for public transport section in partner tab', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA },
      tabOptions: TAB_OPTIONS,
      ...ACTIVE_PARTNER_OBJECT,
    });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const deductionSectionDelete = await addAndDeleteSection(getByTestId, expenditureForm, 0);

    // Assert
    expect(deductionSectionDelete).not.toBeInTheDocument();
  });

  it('should be able to remove row in deduction for travel section', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForPublicTransportation');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: PUBLIC_TRANSPORT_DATA } });
    const travelDeductionSection = await waitForElement(() => getByTestId('public-transportation-expenses'));
    const inputRows = travelDeductionSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(travelDeductionSection);

    // Assert
    await wait(() => expect(travelDeductionSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  it('should be able to remove the premium annuity section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const annuityPremiumSectionDelete = await addAndDeleteSection(getByTestId, expenditureForm, 1);

    // Assert
    expect(annuityPremiumSectionDelete).not.toBeInTheDocument();
  });

  it('should be able to remove row in annuity premium section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: ANNUITY_PREMIUM_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('annuity-premium'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  it('should be able to remove the premium for disability insurance section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const disabilityInsuranceSection = await addAndDeleteSection(getByTestId, expenditureForm, 2);

    // Assert
    expect(disabilityInsuranceSection).not.toBeInTheDocument();
  });

  it('should be able to remove row in premium-for-disability-insurance section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: PREMIUM_DISABLE_INSURANCE_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('premium-for-disability-insurance'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  it('should be able to remove the premium for general survivors section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const generalSurvivorsSection = await addAndDeleteSection(getByTestId, expenditureForm, 3);

    // Assert
    expect(generalSurvivorsSection).not.toBeInTheDocument();
  });

  it('should be able to remove the premium for annuity of child section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const annuityPremiumSectionDelete = await addAndDeleteSection(getByTestId, expenditureForm, 4);

    // Assert
    expect(annuityPremiumSectionDelete).not.toBeInTheDocument();
  });

  it('should be able to remove the alimony paid section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const alimonySectionDelete = await addAndDeleteSection(getByTestId, expenditureForm, 5);

    // Assert
    expect(alimonySectionDelete).not.toBeInTheDocument();
  });

  it('should be able to remove the gifts to charity section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const giftToCharitySection = await addAndDeleteSection(getByTestId, expenditureForm, 6);

    // Assert
    expect(giftToCharitySection).not.toBeInTheDocument();
  });

  it('should be able add a row in general gifts to charity section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    const currentRowIndex = 0;
    const path = `jointExpendituresDetails.giftsToCharity.generalGiftsToCharity.${currentRowIndex}`;

    // Act
    await addNewSection(getByTestId, expenditureForm, 6);
    const description = await waitForElement(() => getByTestId('general-gift-description0'));
    changeInput(getByNameAttribute(description, `${path}.description`), 'Nate diaz');

    // Assert
    await wait(() => expect(getByTestId('general-gifts-to-charity').querySelectorAll('.icon__actions').length).toBe(1));
  }, 10000);

  it('should disable amount if description is empty in general gifts', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA } });
    const currentRowIndex = 0;
    const path = `jointExpendituresDetails.giftsToCharity.generalGiftsToCharity.${currentRowIndex}`;
    const description = await waitForElement(() => getByTestId('general-gift-description0'));

    // Act
    changeInput(getByNameAttribute(description, `${path}.description`), '');
    const amountField = await waitForElement(() => getByTestId('general-gifts-amount0'));

    // Assert
    await wait(() => expect(amountField.querySelector('input')).toBeDisabled());
  }, 10000);

  it('should be able add a row in periodic gifts to charity section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    const currentRowIndex = 0;
    const path = `jointExpendituresDetails.giftsToCharity.periodicGiftsToCharity.${currentRowIndex}`;

    // Act
    await addNewSection(getByTestId, expenditureForm, 6);
    const description = await waitForElement(() => getByTestId('periodic-description0'));
    changeInput(getByNameAttribute(description, `${path}.description`), 'Nate diaz');

    // Assert
    await wait(() => expect(getByTestId('periodic-gifts-to-charity').querySelectorAll('.icon__actions').length).toBe(1));
  }, 10000);

  it('should disable amount if description is empty in periodic gifts section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA } });
    const currentRowIndex = 0;
    const path = `jointExpendituresDetails.giftsToCharity.periodicGiftsToCharity.${currentRowIndex}`;
    const description = await waitForElement(() => getByTestId('periodic-description0'));
    // Act
    changeInput(getByNameAttribute(description, `${path}.description`), '');
    const amountField = await waitForElement(() => getByTestId('periodic-gifts-amount0'));

    // Assert
    await wait(() => expect(amountField.querySelector('input')).toBeDisabled());
  }, 10000);

  it('should be able to remove row in general gifts to charity section', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForGiftsToCharity');
    mockGetReportBokkzData('GiftsToCharity');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('general-gifts-to-charity'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  it('should be able to remove row in periodic gifts to charity section', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForGiftsToCharity');
    mockGetReportBokkzData('GiftsToCharity');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('periodic-gifts-to-charity'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  it('should be able to remove the expenses for healthcare section section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const healthCareSection = await addAndDeleteSection(getByTestId, expenditureForm, 7);

    // Assert
    expect(healthCareSection).not.toBeInTheDocument();
  });

  it('should be able to remove the educational expenses section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const educationExpenseSection = await addAndDeleteSection(getByTestId, expenditureForm, 8);

    // Assert
    expect(educationExpenseSection).not.toBeInTheDocument();
  });

  it('should be able to remove the weekend expenses for children with disabilities section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const childExpenseSection = await addAndDeleteSection(getByTestId, expenditureForm, 9);

    // Assert
    expect(childExpenseSection).not.toBeInTheDocument();
  });

  it('should be able to remove row in weekend expenses for children section', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForChildrenWithDisabilities');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: WEEKEND_EXPENSE_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('weekend-expenses-for-children'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  });

  /** Will be enabled after pilot
  it('should be able to remove the waived venture capital section', async () => {
    // Arrange
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA } });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    const ventureCapitalSection = await addAndDeleteSection(getByTestId, expenditureForm, 10);

    // Assert
    expect(ventureCapitalSection).not.toBeInTheDocument();
  });

  it('should be able to remove row in waived venture capital section', async () => {
    // Arrange
    mockGetReportBokkzData('ExpenditureTotalDeductionForWaivedVentureCapital');
    const { getByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: WAIVED_EXPENDITURE_CAPITAL_DATA } });
    const expenditureSection = await waitForElement(() => getByTestId('waived-venture-capital'));
    const inputRows = expenditureSection.querySelectorAll('.icon__actions--trash').length;

    // Act
    deleteRow(expenditureSection);

    // Assert
    await wait(() => expect(expenditureSection.querySelectorAll('.icon__actions--trash').length).toBe(inputRows - 1));
  }); */

  it('should be able to update and close click of save in premium annuity modal', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForAnnuity');
    const { getByTestId, queryByTestId } = setupDom({ initialData: { ...DOSSIER_DATA, expenditureDetails: ANNUITY_PREMIUM_DATA } });

    // Act
    const edit = await waitForElement(() => getByTestId('edit-annual-reserve-margins'));
    fireEvent.click(edit);
    const modalForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const amountNode = modalForm.querySelector('.annual-profit-from-business input');
    jest.useFakeTimers();
    changeInput(amountNode, 110);
    jest.runOnlyPendingTimers();
    fireEvent.submit(modalForm);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount fields in deductons for transport section', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.expensesForPublicTransportation.travelDeliveryDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForPublicTransportation');
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PUBLIC_TRANSPORT_DATA },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('transport-deduction-compensation0'));
    const descriptionNode = getByTestId('transport-description0');

    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.compensation` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of number fields in deductons for transport section', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.expensesForPublicTransportation.travelDeliveryDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForPublicTransportation');
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PUBLIC_TRANSPORT_DATA },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const distanceNode = await waitForElement(() => getByTestId('transport-deduction-distance0'));
    const numberOfDaysNode = getByTestId('transport-deduction-days-count0');

    await act(async () => {
      await updateCurrecnyInputFields({ node: distanceNode, path: `${path}.singleTripDistance` });
      await updateCurrecnyInputFields({ node: numberOfDaysNode, path: `${path}.daysInAWeek` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should call the calculateUpdatedTax function on change of date fields in deductons for transport section', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForPublicTransportation');
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PUBLIC_TRANSPORT_DATA },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const expenditurForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    const startDate = await waitForElement(() => expenditurForm.querySelector('.transport-deduction-start-date .SingleDatePickerInput .DateInput_input'));
    const endDate = expenditurForm.querySelector('.transport-deduction-end-date .SingleDatePickerInput .DateInput_input');
    changeInput(startDate, dateToDayMonthAndYearString('01-01-2018', 'DD-MM'));
    changeInput(endDate, dateToDayMonthAndYearString('03-03-2018', 'DD-MM'));

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount fields in annuity premium section', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.premiumForAnnuity.premiumsPaidDetails.premiumDetails.${currentRowIndex}`;
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: ANNUITY_PREMIUM_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('premium-annuity-amount0'));
    const descriptionNode = getByTestId('premium-annuity-description0');
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount fields in premium for disability insurance', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.premiumForDisabilityInsurance.premiumDetails.${currentRowIndex}`;
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PREMIUM_DISABLE_INSURANCE_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('premium-section-amount0'));
    const descriptionNode = await waitForElement(() => getByTestId('premium-description0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount fields in premium for general survivors section', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.premiumForGeneralSurvivorsLaw.premiumDetails.${currentRowIndex}`;
    const numberOfCurrencyFields = 1;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PREMIUM_GENERAL_SURVIVORS_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('premium-section-amount0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  });

  it('should call the calculateUpdatedTax function on change of amount fields in premium for annuity of child section', async () => {
    // Arrange
    const path = `taxableSubjectExpenditureDetails.premiumForAnnuityOfChild.premiumDetails.${currentRowIndex}`;
    const numberOfCurrencyFields = 1;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: PREMIUM_CHILD_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('premium-section-amount0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  });

  it('should be able to remove a row in the alimony section', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: ALIMONY_DATA },
    });
    const alimonySection = await waitForElement(() => getByTestId('alimony-paid'));

    // Act
    const deleteIcons = alimonySection.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(alimonySection.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  }, 10000);

  it('should hide the remove link of alimony section in partner tab', async () => {
    // Arrange
    const { queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: ALIMONY_DATA },
      tabOptions: TAB_OPTIONS,
      ...ACTIVE_PARTNER_OBJECT,
    });

    // Assert
    expect(queryByTestId('remove-alimony-paid')).not.toBeInTheDocument();
  });

  it('should call the calculateUpdatedTax function on change of alimony currency inputs in alimony section', async () => {
    // Arrange
    const path = `jointExpendituresDetails.alimony.${currentRowIndex}`;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: ALIMONY_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    const periodicAmountNode = await waitForElement(() => getByTestId('alimony-periodic-payment0'));
    const lumpsumAmountNode = await waitForElement(() => getByTestId('alimony-lumpsum-amount0'));
    const pensionAmountNode = await waitForElement(() => getByTestId('alimony-pension-rights0'));
    const welfareAmountNode = await waitForElement(() => getByTestId('alimony-welfare0'));
    const otherAmountNode = await waitForElement(() => getByTestId('alimony-other-amount0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: periodicAmountNode, path: `${path}.periodicPayment` });
      await updateCurrecnyInputFields({ node: lumpsumAmountNode, path: `${path}.lumpSumAmount` });
      await updateCurrecnyInputFields({ node: welfareAmountNode, path: `${path}.welfare` });
      await updateCurrecnyInputFields({ node: otherAmountNode, path: `${path}.otherAlimony` });
      await updateCurrecnyInputFields({ node: pensionAmountNode, path: `${path}.settlementPensionRights` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 40000);

  it('should call allocation endpoint and calculateUpdatedTax function on change of periodic-gifts-amount in gift to charity section', async () => {
    mockGetRecommendedAllocationData({ recommendedAllocation: true });
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForGiftsToCharity');
    mockGetReportBokkzData('GiftsToCharity');
    
    // Arrange
    const path = `jointExpendituresDetails.giftsToCharity.periodicGiftsToCharity.${currentRowIndex}`;
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupDom({
      initialData: {
        ...JOINT_FORECAST_DATA.content,
        expenditureDetails: GIFTS_DATA,
      },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('periodic-gifts-amount0'));
    const descriptionNode = getByTestId('periodic-description0');
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });

    // Assert
    await wait(() => expect(fetchMock.called('/itx-api/v1/declaration/allocation-report?recommendedAllocation=true')).toEqual(true));
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should show initial threshold value as ... on adding gifts to charity section', async () => {
    // Arrange
    const INITIAL_THRESHOLD_VALUE = '...';
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA },
    });
    const expenditureContainer = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    await addNewSection(getByTestId, expenditureContainer, 6);
    const thresholdValues = expenditureContainer.querySelectorAll('.threshold-label');

    // Assert
    await wait(() => expect(thresholdValues[0].textContent).toBe(`Drempel € ${INITIAL_THRESHOLD_VALUE}`));
  });

  it('should fetch and update threshold on entering amount in gifts to charity section', async () => {
    // Arrange
    const path = `jointExpendituresDetails.giftsToCharity.generalGiftsToCharity.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForGiftsToCharity');
    mockGetReportBokkzData('GiftsToCharity');
    const EXPECTED_THRESHOLD_VALUE = 250;
    const ROW_INDEX = 0;
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA },
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId(`general-gifts-amount${ROW_INDEX}`));
    const descriptionNode = getByTestId(`general-gift-description${ROW_INDEX}`);
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    const thresholdValues = expenditureForm.querySelectorAll('.threshold-label');

    // Assert
    await wait(() => expect(thresholdValues[0].textContent).toBe(`Drempel €${EXPECTED_THRESHOLD_VALUE}`));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of general-gifts-amount in gift to charity section', async () => {
    // Arrange
    const path = `jointExpendituresDetails.giftsToCharity.generalGiftsToCharity.${currentRowIndex}`;
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForGiftsToCharity');
    mockGetReportBokkzData('GiftsToCharity');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: GIFTS_DATA },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('general-gifts-amount0'));
    const descriptionNode = getByTestId('general-gift-description0');
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.amount` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.description` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount fields in weekend expenses for children with disabilities section', async () => {
    // Arrange
    const path = `jointExpendituresDetails.weekendExpensesForChildrenWithDisabilities.weekendExpensesOfDisabledChildrens.${currentRowIndex}`;
    const numberOfCurrencyFields = 5;
    const taxCalcuationSpy = jest.fn();
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForChildrenWithDisabilities');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: WEEKEND_EXPENSE_DATA },
      setTaxableAmount: taxCalcuationSpy,
    });

    // Act
    const amountNode = await waitForElement(() => getByTestId('weekend-expenses-amount0'));
    const descriptionNode = await waitForElement(() => getByTestId('weekend-expenses-name0'));
    const careDaysNode = await waitForElement(() => getByTestId('weekend-expenses-care-days0'));
    const travelDaysNode = await waitForElement(() => getByTestId('weekend-expenses-travel-days0'));
    const distanceNode = await waitForElement(() => getByTestId('weekend-expenses-distance0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amountNode, path: `${path}.compensation` });
      await updateCurrecnyInputFields({ node: descriptionNode, path: `${path}.name` });
      await updateCurrecnyInputFields({ node: careDaysNode, path: `${path}.daysOfCare` });
      await updateCurrecnyInputFields({ node: travelDaysNode, path: `${path}.daysTraveled` });
      await updateCurrecnyInputFields({ node: distanceNode, path: `${path}.distanceOfTrip` });
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 30000);

  /** will be enabled after pilot
   it('should call the calculateUpdatedTax function on change of amount-waived-this-year in waived venture capital section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    mockGetReportBokkzData('ExpenditureTotalDeductionForWaivedVentureCapital');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: WAIVED_EXPENDITURE_CAPITAL_DATA },
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    const waivedAmount = await waitForElement(() => getByTestId('amount-waived-this-year0'));
    const alreadyWaivedAmount = await waitForElement(() => getByTestId('already-waived-amount0'));
    const descriptionNode = getByTestId('waived-venture-description0');
    act(() => {
      updateCurrecnyInputFields([waivedAmount, alreadyWaivedAmount, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);
  */

  it('should update and close alimony details modal', async () => {
    // Arrange
    const path = 'correctionData.alimonyBasicDetails';
    const addressPath = 'correctionData.address';
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: ALIMONY_DATA },
      calculateUpdatedTax: jest.fn(),
    });
    const alimonySection = await waitForElement(() => getByTestId('alimony-paid'));
    const editIcons = alimonySection.querySelectorAll('.icon__edit');

    // Act
    fireEvent.click(editIcons[1]);
    const correctionForm = await waitForElement(() => getByTestId('alimony-correction-form'));
    const initialInput = await waitForElement(() => getByTestId('initials-input'));
    await act(async () => {
      changeInput(getByNameAttribute(initialInput, `${path}.initials`), 'Elcucuy');
      changeInput(getByNameAttribute(getByTestId('first-name-input'), `${path}.firstName`), 'Tony');
      changeInput(getByNameAttribute(getByTestId('last-name-input'), `${path}.lastName`), 'Tony');
      changeInput(getByNameAttribute(getByTestId('bsn-input'), `${path}.bsn`), '123456789');
      const dob = correctionForm.querySelector('.date-of-birth .SingleDatePickerInput .DateInput_input');
      changeInput(dob, dateToDayMonthAndYearString('01-01-2018', 'DD-MM-YYYY'));
      changeInput(getByNameAttribute(getByTestId('street-input'), `${addressPath}.street`), 'test');
      changeInput(getByNameAttribute(getByTestId('house-number-input'), `${addressPath}.houseNumber`), '12345');
      changeInput(getByNameAttribute(getByTestId('zip-code-input'), `${addressPath}.zipCode`), '1234AB');
      changeInput(getByNameAttribute(getByTestId('city-input'), `${addressPath}.city`), 'test');
      const yearOption = await waitForElement(() => selectAutoCompleteOption(correctionForm, '.country-code', 1));
      fireEvent.click(yearOption);
    });
    fireEvent.submit(correctionForm);

    // Assert
    await wait(() => expect(getByTestId('alimony-paid').querySelectorAll('.icon__edit').length).toBe(3));
    expect(correctionForm).not.toBeInTheDocument();
  }, 20000);

  it('should update and close the modal on click of educational expenses without study grant modal save', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'educational-expenses', 0);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should be able to update and close the modal for empty reimbursement value in educational expenses without study grant modal save', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'educational-expenses', 0, 0, true);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should show initial threshold value as 0 on adding educational expenses section', async () => {
    const INITIAL_THRESHOLD_VALUE = '0';
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    await addNewSection(getByTestId, expenditureForm, 8);

    const thresholdValues = expenditureForm.querySelectorAll('.threshold-label');

    // Assert
    await wait(() => expect(thresholdValues[0].textContent).toBe(`Drempel €${INITIAL_THRESHOLD_VALUE}`));
  });

  it('should fetch and update threshold on click of educational expenses modal save', async () => {
    const EXPECTED_THRESHOLD_VALUE = 250;
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId, rerender } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'educational-expenses', 0);

    await wait();
    rerender(
      <TaxForecastContext.Provider value={
        {
          dossierData: DOSSIER_DATA,
          countries: COUNTRIES,
          calculateUpdatedTax: jest.fn(),
          setActiveTab,
          isPartner: !!ACTIVE_TAB,
          activeTab: ACTIVE_TAB,
          tabOptions: TAB_OPTIONS,
          globalClientId: GLOBAL_CLIENT_ID,
          saveDossierDetails,
          setTaxableAmount: jest.fn(),
        }
      }
      >
        <ExpenditureContainer />
      </TaxForecastContext.Provider>,
    );

    const educationaExpenses = await waitForElement(() => getByTestId('educational-expenses'));
    const thresholdValues = educationaExpenses.querySelectorAll('.threshold-label');

    // Assert
    await wait(() => expect(thresholdValues[0].textContent).toBe(`Drempel €${EXPECTED_THRESHOLD_VALUE}`));
  }, 20000);

  it('should be able to open the modal on click of educational expenses without study grant edit icon', async () => {
    // Arrange
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA_WITH_OUT_DETAILS },
    });

    // Act
    await openEditModal(getByTestId, 'educational-expenses', 0);

    const expenditureModalForm = getByTestId(EXPENDITURE_MODAL_FORM);

    // Assert
    await wait(() => expect(expenditureModalForm).toBeInTheDocument());
  });

  // Will be enabled after pilot
  // it('should update and close the modal on click of educational expenses with study grant modal save', async () => {
  //   // Arrange
  //   mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
  //   const { getByTestId, queryByTestId } = setupDom({
  //     initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
  //   });

  //   // Act
  //   await act(async () => {
  //     await openEditModalAndSave(getByTestId, 'educational-expenses', 1);
  //   });

  //   // Assert
  //   await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  // }, 10000);

  it('should not display a new row when all the options selected in studygrant modal', async () => {
    // Arrange
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    const numberOfYearOptions = 13;
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: STUDYGRANT_EDUCATIONAL_EXPENSES_DATA },
    });
    await openEditModal(getByTestId, 'educational-expenses', 1);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const rowsList = expenditureForm.querySelectorAll('.studygant-educational-year');

    // Assert
    await wait(() => expect(rowsList.length).toBe(numberOfYearOptions));
  }, 20000);

  it('should update and close the modal on click of studygrant modal save', async () => {
    // Arrange
    const path = `correctionData.studyGrantDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });
    await openEditModal(getByTestId, 'educational-expenses', 1);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const yearOption = selectAutoCompleteOption(expenditureForm, '.studygant-educational-year', 0, true);
    fireEvent.click(yearOption);
    const amount = await waitForElement(() => getByTestId('studygant-amount-paid0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amount, path: `${path}.amountPaidBack` });
    });

    fireEvent.submit(expenditureForm);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 20000);

  it('should display the error for amount payback fields of studygrant modal when educational year is selected', async () => {
    // Arrange
    const path = `correctionData.studyGrantDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTotalDeductionForEducationExpenses');
    mockGetReportBokkzData('EducationalExpense');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });
    await openEditModal(getByTestId, 'educational-expenses', 1);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const yearOption = selectAutoCompleteOption(expenditureForm, '.studygant-educational-year', 0, true);
    fireEvent.click(yearOption);
    const amount = await waitForElement(() => getByNameAttribute(getByTestId('studygant-amount-paid0'), `${path}.amountPaidBack`));
    await act(async () => {
      jest.useFakeTimers();
      await changeInput(amount, 0);
      jest.runOnlyPendingTimers();
      fireEvent.blur(amount);
    });

    // Assert
    await wait(() => expect(getByTestId(`error-${path}.amountPaidBack`)).toBeInTheDocument());
  });

  it('should show initial threshold value as 0 on adding expenses for healthcare section', async () => {
    const INITIAL_THRESHOLD_VALUE = 0;
    // Arrange
    mockGetReportBokkzData('ExpenditureAdditionalFamilySupport');
    mockGetReportBokkzData('ExpenseForHealthcare');
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    const expenditureForm = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));

    // Act
    await addNewSection(getByTestId, expenditureForm, 3);
    const thresholdValues = expenditureForm.querySelectorAll('.threshold-label');

    // Assert
    await wait(() => expect(thresholdValues[0].textContent).toBe(`Drempel €${INITIAL_THRESHOLD_VALUE}`));
  }, 10000);

  it('should fetch and update threshold on click of expenses for healthcare modal save', async () => {
    const EXPECTED_THRESHOLD_VALUE = 250;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureAdditionalFamilySupport');
    mockGetReportBokkzData('ExpenseForHealthcare');
    // Arrange
    const { getByTestId, rerender } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'expenses-for-healthcare', 3);

    await wait();
    rerender(
      <TaxForecastContext.Provider value={
        {
          dossierData: DOSSIER_DATA,
          countries: COUNTRIES,
          calculateUpdatedTax: jest.fn(),
          setActiveTab,
          isPartner: !!ACTIVE_TAB,
          activeTab: ACTIVE_TAB,
          tabOptions: TAB_OPTIONS,
          globalClientId: GLOBAL_CLIENT_ID,
          saveDossierDetails,
          setTaxableAmount: jest.fn(),
        }
      }
      >
        <ExpenditureContainer />
      </TaxForecastContext.Provider>,
    );

    const healthExpenses = await waitForElement(() => getByTestId('expenses-for-healthcare'));
    const thresholdValue = healthExpenses.querySelector('.threshold-label');
    // Assert
    await wait(() => expect(thresholdValue.textContent).toBe(`Drempel €${EXPECTED_THRESHOLD_VALUE}`));
  }, 20000);

  it('should update and close the modal on click of treatment modal save', async () => {
    mockCalculateTax();
    mockGetReportBokkzData('ExpenseForHealthcare');
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'expenses-for-healthcare', 0);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should update and close the modal on click of prescribed medication modal save', async () => {
    mockCalculateTax();
    mockGetReportBokkzData('ExpenseForHealthcare');
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'expenses-for-healthcare', 1);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should update and close the modal on click of aids modal save', async () => {
    mockCalculateTax();
    mockGetReportBokkzData('ExpenseForHealthcare');
    // Arrange
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'expenses-for-healthcare', 2);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should update and close the modal on click of additional family support modal save', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureAdditionalFamilySupport');
    mockGetReportBokkzData('ExpenseForHealthcare');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    await openEditModalAndSave(getByTestId, 'expenses-for-healthcare', 3);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should update and close the modal on click of prescribed diet modal save', async () => {
    // Arrange
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditurePrescribedDiet');
    mockGetReportBokkzData('ExpenseForHealthcare');
    mockGetDeceaseList();
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 4);

    // Act
    await act(async () => {
      const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
      const treatmentOption = await waitForElement(() => selectAutoCompleteOption(expenditureForm, '.prescried-diet-condition', 0, true));
      fireEvent.click(treatmentOption);
      changeInput(expenditureForm.querySelector('.prescried-diet-start-date input'), dateToDayMonthAndYearString(startDateofYear(currentYear, 'YYYY-MM-DD'), dateFormat));
      changeInput(expenditureForm.querySelector('.prescried-diet-end-date input'), dateToDayMonthAndYearString(endDateofYear(currentYear, 'YYYY-MM-DD'), dateFormat));

      fireEvent.submit(expenditureForm);
    });

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 20000);

  it('should close the modal on click of travel expenses for hospital visit modal save', async () => {
    // Arrange
    const path = `correctionData.travelExpensesForHoipitalVisitOfFamilyMembersDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTravelExpensesForHospitalVisit');
    mockGetReportBokkzData('ExpenseForHealthcare');
    mockGetDeceaseList();
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 6);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));

    const rowIndex = 0;
    const cost = await waitForElement(() => getByTestId(`hospital-visit-cost${rowIndex}`));
    await act(async () => {
      await updateCurrecnyInputFields({ node: cost, path: `${path}.actualCostsPublicTransportationCost` });
      changeInput(getByNameAttribute(getByTestId(`hospital-visit-description${rowIndex}`), `${path}.description`), 'checkup');
      changeInput(getByNameAttribute(getByTestId(`number-of-hospital-visits${rowIndex}`), `${path}.numberOfVisits`), 2);
      changeInput(getByNameAttribute(getByTestId(`hospital-visit-distance${rowIndex}`), `${path}.distance`), 20);
    });

    fireEvent.submit(expenditureForm);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 10000);

  it('should update and close the modal on click of clothes and linen modal save', async () => {
    // Arrange
    const path = `correctionData.clothesAndLineenDetails.${currentRowIndex}`;
    mockCalculateTax();
    mockGetReportBokkzData('ExtraExpensesForClothesAndLinnen');
    mockGetReportBokkzData('ExpenseForHealthcare');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 7);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    changeInput(getByNameAttribute(await waitForElement(() => getByTestId('clothes-and-linen-description-0')), `${path}.description`), 'test description');
    await act(async () => {
      const startDate = await waitForElement(() => expenditureForm.querySelector('.clothes-linen-start-date .SingleDatePickerInput .DateInput_input'));
      changeInput(startDate, dateToDayMonthAndYearString(startDateofYear(currentYear, 'YYYY-MM-DD'), dateFormat));
      const endDate = await waitForElement(() => expenditureForm.querySelector('.clothes-linen-end-date .SingleDatePickerInput .DateInput_input'));
      changeInput(endDate, dateToDayMonthAndYearString(endDateofYear(currentYear, 'YYYY-MM-DD'), dateFormat));
      const yearOption = selectAutoCompleteOption(expenditureForm, '.is-condition-more-than-one-year', 1, true);
      fireEvent.click(yearOption);
      const forfeitOption = selectAutoCompleteOption(expenditureForm, '.is-more-than-standard-forfeit', 1, true);
      fireEvent.click(forfeitOption);

      fireEvent.submit(expenditureForm);
    });

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  }, 20000);

  it('should close the modal on click of travel expenses healthcare save', async () => {
    // Arrange
    const path = 'correctionData';
    mockGetDeceaseList();
    mockCalculateTax();
    mockGetReportBokkzData('ExpenditureTravelExpensesForHealthcare');
    mockGetReportBokkzData('ExpenseForHealthcare');
    const { getByTestId, queryByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 5);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    act(() => {
      changeInput(getByNameAttribute(getByTestId('travel-expenses-description'), `${path}.extraExpensesForHealthcare`), 'checkup');
      changeInput(getByNameAttribute(getByTestId('travel-expenses-for-ambulance'), `${path}.expensesForTravelByAmbulance`), 2);
      changeInput(getByNameAttribute(getByTestId('travel-expenses-disatance'), `${path}.totalDistanceForHealthcareInKM`), 20);
      changeInput(getByNameAttribute(getByTestId('travel-expenses-perKM'), `${path}.expensesPerKMInCents`), 100);
    });

    fireEvent.submit(expenditureForm);

    // Assert
    await wait(() => expect(queryByTestId(EXPENDITURE_MODAL_FORM)).toBeNull());
  });

  it('should delete a row in study grant modal', async () => {
    const path = `correctionData.studyGrantDetails.${currentRowIndex}`;
    mockGetReportBokkzData('EducationalExpense');
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA },
    });
    const expenditureContainer = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    await addNewSection(getByTestId, expenditureContainer, 8);
    await openEditModal(getByTestId, 'educational-expenses', 1);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const yearOption = selectAutoCompleteOption(expenditureForm, '.studygant-educational-year', 0, true);
    fireEvent.click(yearOption);
    const amount = await waitForElement(() => getByTestId('studygant-amount-paid0'));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amount, path: `${path}.amountPaidBack` });
      changeInput(expenditureForm.querySelector('.studygant-start-date input'), '2020-01-01');
      changeInput(expenditureForm.querySelector('.studygant-end-date input'), '2020-31-01');
    });

    const deleteIcons = expenditureForm.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(expenditureForm.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  }, 20000);

  it('should delete a row in prescribed diet modal', async () => {
    // Arrange
    mockGetDeceaseList();
    mockGetReportBokkzData();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENDITURE_EMPTY_DATA },
    });
    const expenditureContainer = await waitForElement(() => getByTestId('tax-forecast-expenditure-form'));
    await addNewSection(getByTestId, expenditureContainer, 7);
    await openEditModal(getByTestId, 'expenses-for-healthcare', 4);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const treatmentOption = await waitForElement(() => selectAutoCompleteOption(expenditureForm, '.prescried-diet-condition', 0, true));
    fireEvent.click(treatmentOption);

    changeInput(expenditureForm.querySelector('.prescried-diet-start-date input'), '2020-02-01');
    changeInput(expenditureForm.querySelector('.prescried-diet-end-date input'), '2020-02-21');
    const deleteIcons = expenditureForm.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(expenditureForm.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  }, 10000);

  it('should delete a row in treatment modal', async () => {
    // Arrange
    const path = `correctionData.details.${currentRowIndex}`;
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 0);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const rowIndex = 0;
    changeInput(getByNameAttribute(getByTestId(`treatment-modal-description${rowIndex}`), `${path}.description`), 'Elcucuy');
    const amount = await waitForElement(() => getByTestId(`treatment-modal-amount${rowIndex}`));
    await act(async () => {
      await updateCurrecnyInputFields({ node: amount, path: `${path}.amount` });
    });
    const deleteIcons = expenditureForm.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(expenditureForm.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  });

  it('should delete a row in travel expenses for hospital visit modal', async () => {
    // Arrange
    const path = `correctionData.travelExpensesForHoipitalVisitOfFamilyMembersDetails.${currentRowIndex}`;
    mockGetDeceaseList();
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 6);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    const rowIndex = 0;
    changeInput(getByNameAttribute(getByTestId(`hospital-visit-description${rowIndex}`), `${path}.description`), 'checkup');
    changeInput(getByNameAttribute(getByTestId(`number-of-hospital-visits${rowIndex}`), `${path}.numberOfVisits`), 2);
    changeInput(getByNameAttribute(getByTestId(`hospital-visit-distance${rowIndex}`), `${path}.distance`), 20);
    const cost = await waitForElement(() => getByTestId(`hospital-visit-cost${rowIndex}`));

    await act(async () => {
      await updateCurrecnyInputFields({ node: cost, path: `${path}.actualCostsPublicTransportationCost` });
    });
    const deleteIcons = expenditureForm.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(expenditureForm.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  }, 10000);

  it('should delete a row in travel expenses for clothes and linen modal', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });
    await openEditModal(getByTestId, 'expenses-for-healthcare', 7);

    // Act
    const expenditureForm = await waitForElement(() => getByTestId(EXPENDITURE_MODAL_FORM));
    changeInput(expenditureForm.querySelector('.clothes-linen-start-date input'), '2020-01-01');
    changeInput(expenditureForm.querySelector('.clothes-linen-end-date input'), '2020-07-07');
    const deleteIcons = expenditureForm.querySelectorAll('.icon__actions--trash');
    fireEvent.click(deleteIcons[0]);

    // Assert
    await wait(() => expect(expenditureForm.querySelectorAll('.icon__actions--trash').length).toBe(deleteIcons.length - 1));
  });

  it('pencil icons should be filled if details exist in expenses for health care ', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EXPENSES_FOR_HEALTH_CARE_DATA },
    });

    // Act
    const expensesForHealthCareContainer = await waitForElement(() => getByTestId('expenses-for-healthcare'));
    const filledPencilIcons = expensesForHealthCareContainer.querySelectorAll('.icon__edit .fas');

    // Assert
    expect(filledPencilIcons.length).toEqual(7);
  });

  it('pencil icons should be filled if details exist in educational expenses', async () => {
    // Arrange
    const { getByTestId } = setupDom({
      initialData: { ...DOSSIER_DATA, expenditureDetails: EDUCATIONAL_EXPENSES_DATA },
    });

    // Act
    const educationalExpensesContainer = await waitForElement(() => getByTestId('educational-expenses'));
    const filledPencilIcons = educationalExpensesContainer.querySelectorAll('.icon__edit .fas');

    // Assert
    expect(filledPencilIcons.length).toEqual(2);
  });
});

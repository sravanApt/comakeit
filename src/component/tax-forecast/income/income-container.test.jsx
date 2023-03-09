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
import IncomeContainer from './income-container';
import TaxForecastContext from '../tax-forecast-context';
import {
  TAB_OPTIONS,
  COUNTRIES,
  ACTIVE_TAB,
  ACTIVE_PARTNER_OBJECT,
  GLOBAL_CLIENT_ID,
} from '../tax-forecast.test.data';
import { SECTION_LIST } from './income.constants';
import {
  INCOME_DATA_WITH_NULL,
  INCOME_DATA,
  EXEMPTED_INCOME,
  GAIN_OR_COST_OTHER_ACTIVITIES_INCOME,
  CURRENT_EMPLOYMENT_INCOME,
  PREVIOUS_EMPLOYMENT_INCOME,
  EMPTY_ABROAD_INCOME_DATA,
  ABROAD_INCOME,
  INCOME_COST_BENEFITS,
  ALIMONY_INCOME,
  GAIN_COST_ASSETS_OWN_COMPANY_INCOME,
  ASSETS_LIABILITIES_INCOME,
  OTHER_INCOME,
  REFUND_INCOME,
} from './income.test.data';
import {
  changeInput, getTableRowsCount, selectAutoCompleteOption,
} from '../../../common/test-helpers';
import { removeSection } from '../tax-forecast-test-helpers';

const setActiveTab = jest.fn();
const saveDossierDetails = jest.fn();

const setupComponent = ({
  initialData = INCOME_DATA, options = TAB_OPTIONS, calculateUpdatedTax = jest.fn(), activeTab = ACTIVE_TAB,
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      countries: COUNTRIES,
      tabOptions: options,
      calculateUpdatedTax,
      setActiveTab,
      isPartner: !!activeTab,
      activeTab,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails,
    }
  }
  >
    <IncomeContainer taxableAmount={0} />
  </TaxForecastContext.Provider>,
);

const addNewSection = async (getByTestId, index = 0) => {
  const incomeForm = await waitForElement(() => getByTestId('tax-forecast-income-form'));
  const showIncomeSectionsListButton = getByTestId('add-income-sections-button');
  fireEvent.click(showIncomeSectionsListButton);
  const incomeSectionsList = incomeForm.querySelectorAll('.mdc-list-item');
  fireEvent.click(incomeSectionsList[index]);
  fireEvent.click(showIncomeSectionsListButton);
};

const deleteRow = (section) => {
  const deleteIcon = section.querySelector('.icon__actions--trash');
  fireEvent.click(deleteIcon);
};

const updateInputFields = (list) => {
  list.forEach((item) => {
    jest.useFakeTimers();
    changeInput(item, 100);
    jest.runOnlyPendingTimers();
  });
};

describe('Tax Forecast Income', () => {
  afterEach(fetchMock.restore);

  it('should be able to add a section on click of the section list item in taxable subject tab', async () => {
    // Arrange
    const data = { ...INCOME_DATA, income: { ...INCOME_DATA_WITH_NULL, taxableSubjectIncome: null } };
    const { getByTestId } = setupComponent({ initialData: data });
    const incomeForm = await waitForElement(() => getByTestId('tax-forecast-income-form'));

    // Act
    await addNewSection(getByTestId);

    // Assert
    await wait(() => expect(incomeForm.querySelectorAll('.mdc-list-item--disabled').length).toBe(1));
  });

  it('should be able to add a section on click of the section list item in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: INCOME_DATA_WITH_NULL },
      ...ACTIVE_PARTNER_OBJECT,
    });
    const incomeForm = await waitForElement(() => getByTestId('tax-forecast-income-form'));

    // Act
    await addNewSection(getByTestId);

    // Assert
    expect(incomeForm.querySelectorAll('.mdc-list-item--disabled').length).toBe(1);
  });

  it('should show the income sections list options on click of add income button ', async () => {
    // Arrange
    const { getByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: INCOME_DATA_WITH_NULL } });

    // Act
    const showIncomeSectionsListButton = await waitForElement(() => getByTestId('add-income-sections-button'));
    fireEvent.click(showIncomeSectionsListButton);
    const incomeForm = await waitForElement(() => getByTestId('tax-forecast-income-form'));
    const incomeSectionsList = incomeForm.querySelectorAll('.mdc-list-item');

    // Assert
    expect(incomeSectionsList.length).toBe(SECTION_LIST.length);
  });

  it('should be able to remove row in exempted-income section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: EXEMPTED_INCOME } });
    const exemptedIncomeSection = await waitForElement(() => getByTestId('exempted-income'));
    const inputRows = exemptedIncomeSection.querySelectorAll('.description input').length;

    // Act
    deleteRow(exemptedIncomeSection);

    // Assert
    await wait(() => expect(exemptedIncomeSection.querySelectorAll('.description input').length).toBe(inputRows - 1));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in exempted-income section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: EXEMPTED_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const exemptedIncomeSection = await waitForElement(() => getByTestId('exempted-income'));

    // Act
    const amountNode = exemptedIncomeSection.querySelector('.exempted-income-amount input');
    const insuranceNode = exemptedIncomeSection.querySelector('.exempted-income-insurance input');
    const descriptionNode = exemptedIncomeSection.querySelector('.description input');

    act(() => {
      updateInputFields([insuranceNode, amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should call the calculateUpdatedTax on change of amount and description fields in gain-cost-other-activities section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: GAIN_OR_COST_OTHER_ACTIVITIES_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const gainCostOtherActivitiesSection = await waitForElement(() => getByTestId('gain-cost-other-activities'));

    // Act
    const amountNode = gainCostOtherActivitiesSection.querySelector('.common-description-amount input');
    const descriptionNode = gainCostOtherActivitiesSection.querySelector('.description input');
    act(() => {
      updateInputFields([amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in current-employment section', async () => {
    // Arrange
    const numberOfCurrencyFields = 4;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: CURRENT_EMPLOYMENT_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const currentEmploymentSection = await waitForElement(() => getByTestId('current-employment'));
    const discountNode = currentEmploymentSection.querySelector('.current-employment-discount input');
    const wageTaxNode = currentEmploymentSection.querySelector('.current-employment-wagetax input');
    const amountNode = currentEmploymentSection.querySelector('.current-employment-amount input');
    const descriptionNode = currentEmploymentSection.querySelector('.description input');

    // Act
    act(() => {
      updateInputFields([discountNode, wageTaxNode, amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 15000);

  it('should be able to remove row in current-employment section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: CURRENT_EMPLOYMENT_INCOME },
    });
    const currentEmploymentSection = await waitForElement(() => getByTestId('current-employment'));
    const inputRows = currentEmploymentSection.querySelectorAll('.description input').length;

    // Act
    deleteRow(currentEmploymentSection);

    // Assert
    await wait(() => expect(currentEmploymentSection.querySelectorAll('.description input').length).toBe(inputRows - 1));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in previous-employment section', async () => {
    // Arrange
    const numberOfCurrencyFields = 3;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: PREVIOUS_EMPLOYMENT_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const previousEmploymentSection = await waitForElement(() => getByTestId('previous-employment'));

    // Act
    const wageTaxNode = previousEmploymentSection.querySelector('.previous-employment-wagetax input');
    const amountNode = previousEmploymentSection.querySelector('.previous-employment-amount input');
    const descriptionNode = previousEmploymentSection.querySelector('.description input');
    act(() => {
      updateInputFields([wageTaxNode, amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should be able to remove row in previous-employment section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: PREVIOUS_EMPLOYMENT_INCOME },
    });
    const previousEmploymentSection = await waitForElement(() => getByTestId('previous-employment'));
    const inputRows = previousEmploymentSection.querySelectorAll('.description input').length;

    // Act
    deleteRow(previousEmploymentSection);

    // Assert
    await wait(() => expect(previousEmploymentSection.querySelectorAll('.description input').length).toBe(inputRows - 1));
  });

  it('should not display inBelgiumOrGermanyWithheldTax input when select country other than begium or germany in income from abroad section modal', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: taxCalcuationSpy, initialData: { ...INCOME_DATA, income: ABROAD_INCOME } });
    const addButton = await waitForElement(() => getByTestId('add-taxable-income-abroad-button'));

    // Act
    act(() => {
      fireEvent.click(addButton);
    });
    const addForm = await waitForElement(() => getByTestId('taxable-income-abroad-form'));
    const descriptionInput = getByNameAttribute(getByTestId('income-from-abroad-description'), 'salary.description');
    updateInputFields([descriptionInput]);
    const belgiumCountryOption = selectAutoCompleteOption(addForm, '.countryCode-select', 2);
    fireEvent.click(belgiumCountryOption);
    const inBelgiumOrGermanyWithheldTaxInput = await waitForElement(() => getByTestId('inBelgiumOrGermanyWithheldTax'));
    const usCountryOption = selectAutoCompleteOption(addForm, '.countryCode-select', 1);
    fireEvent.click(usCountryOption);

    // Assert
    await wait(() => expect(inBelgiumOrGermanyWithheldTaxInput).not.toBeInTheDocument());
  }, 10000);

  it('should display and update inBelgiumOrGermanyWithheldTax input when select no compensation option for belgium country in income from abroad section modal', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: taxCalcuationSpy, initialData: { ...INCOME_DATA, income: ABROAD_INCOME } });
    const addButton = await waitForElement(() => getByTestId('add-taxable-income-abroad-button'));

    // Act
    act(() => {
      fireEvent.click(addButton);
    });
    const addForm = await waitForElement(() => getByTestId('taxable-income-abroad-form'));
    const descriptionInput = getByNameAttribute(getByTestId('income-from-abroad-description'), 'salary.description');
    updateInputFields([descriptionInput]);
    const countryOption = selectAutoCompleteOption(addForm, '.countryCode-select', 2);
    fireEvent.click(countryOption);

    const compensationYesOption = selectAutoCompleteOption(addForm, '.exploitedGeneralCompensationScheme-select', 0);
    fireEvent.click(compensationYesOption);
    const inBelgiumOrGermanyWithheldTaxInput = getByNameAttribute(getByTestId('inBelgiumOrGermanyWithheldTax'), 'inBelgiumOrGermanyWithheldTax');
    updateInputFields([inBelgiumOrGermanyWithheldTaxInput]);
    const compensationNoOption = selectAutoCompleteOption(addForm, '.exploitedGeneralCompensationScheme-select', 1);
    fireEvent.click(compensationNoOption);

    // Assert
    await wait(() => expect(inBelgiumOrGermanyWithheldTaxInput).toBeInTheDocument());
    await wait(() => expect(Number(inBelgiumOrGermanyWithheldTaxInput.value)).toEqual(100));
  }, 10000);

  it('should display and update inBelgiumOrGermanyWithheldTax input when select no compensation option for germany country in income from abroad section modal', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: taxCalcuationSpy, initialData: { ...INCOME_DATA, income: ABROAD_INCOME } });
    const addButton = await waitForElement(() => getByTestId('add-taxable-income-abroad-button'));

    // Act
    act(() => {
      fireEvent.click(addButton);
    });
    const addForm = await waitForElement(() => getByTestId('taxable-income-abroad-form'));
    const descriptionInput = getByNameAttribute(getByTestId('income-from-abroad-description'), 'salary.description');
    updateInputFields([descriptionInput]);
    const countryOption = selectAutoCompleteOption(addForm, '.countryCode-select', 3);
    fireEvent.click(countryOption);
    const compensationYesOption = selectAutoCompleteOption(addForm, '.compensationSchemeGermany-select', 0);
    fireEvent.click(compensationYesOption);
    const inBelgiumOrGermanyWithheldTaxInput = getByNameAttribute(getByTestId('inBelgiumOrGermanyWithheldTax'), 'inBelgiumOrGermanyWithheldTax');
    updateInputFields([inBelgiumOrGermanyWithheldTaxInput]);
    const compensationNoOption = selectAutoCompleteOption(addForm, '.compensationSchemeGermany-select', 1);
    fireEvent.click(compensationNoOption);

    // Assert
    await wait(() => expect(inBelgiumOrGermanyWithheldTaxInput).toBeInTheDocument());
    await wait(() => expect(Number(inBelgiumOrGermanyWithheldTaxInput.value)).toEqual(100));
  }, 10000);

  it('should add new data and submit abroad income section modal', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: taxCalcuationSpy, initialData: { ...INCOME_DATA, income: EMPTY_ABROAD_INCOME_DATA } });

    // Act
    await addNewSection(getByTestId, 2);
    const addButton = await waitForElement(() => getByTestId('add-taxable-income-abroad-button'));
    fireEvent.click(addButton);
    const addForm = await waitForElement(() => getByTestId('taxable-income-abroad-form'));

    const descriptionInput = getByNameAttribute(getByTestId('income-from-abroad-description'), 'salary.description');
    updateInputFields([descriptionInput]);

    const countryOption = selectAutoCompleteOption(addForm, '.countryCode-select', 2);
    fireEvent.click(countryOption);

    const subjectToTaxInput = getByNameAttribute(addForm, 'subjectedToDutchTax');
    const withheldWagesInput = getByNameAttribute(getByTestId('withheldWagesTaxAbroad'), 'withheldWagesTaxAbroad');
    const taxInput = getByNameAttribute(getByTestId('inBelgiumOrGermanyWithheldTax'), 'inBelgiumOrGermanyWithheldTax');
    updateInputFields([subjectToTaxInput, withheldWagesInput, taxInput]);

    act(() => {
      fireEvent.submit(addForm);
    });

    // Assert
    await wait(() => expect(addForm).not.toBeInTheDocument());
  }, 10000);

  it('should be able to update data and calculate tax in income from abroad section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: taxCalcuationSpy, initialData: { ...INCOME_DATA, income: ABROAD_INCOME } });

    const editButton = await waitForElement(() => getByTestId('abroad-income-edit-0'));

    // Act
    fireEvent.click(editButton);
    const editForm = await waitForElement(() => getByTestId('taxable-income-abroad-form'));
    const taxInput = getByNameAttribute(editForm, 'subjectedToDutchTax');
    updateInputFields([taxInput]);

    fireEvent.submit(editForm);

    // Assert
    await wait(() => expect(editForm).not.toBeInTheDocument());
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should be able to remove row in income-abroad section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: ABROAD_INCOME },
    });
    const incomeAbroadSection = await waitForElement(() => getByTestId('income-abroad'));
    const deleteIcon = await waitForElement(() => getByTestId("abroad-income-row-0"));
    const initialRows = getTableRowsCount(incomeAbroadSection);

    // Act
    act(() => {
      fireEvent.click(deleteIcon);
    });

    // Assert
    await wait(() => expect(getTableRowsCount(incomeAbroadSection)).toBe(initialRows - 1));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in income-cost-benefits section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: INCOME_COST_BENEFITS },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const incomeCostBenefitsSection = await waitForElement(() => getByTestId('income-cost-benefits'));

    // Act
    const amountNode = incomeCostBenefitsSection.querySelector('.common-description-amount input');
    const descriptionNode = incomeCostBenefitsSection.querySelector('.description input');
    act(() => {
      updateInputFields([amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount and description fields in alimony section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: ALIMONY_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const alimonySection = await waitForElement(() => getByTestId('alimony-section'));

    // Act
    const amountNode = alimonySection.querySelector('.common-description-amount input');
    const descriptionNode = alimonySection.querySelector('.description input');
    act(() => {
      updateInputFields([amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should be able to remove row in alimony section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: ALIMONY_INCOME },
    });
    const alimonySection = await waitForElement(() => getByTestId('alimony-section'));
    const inputRows = alimonySection.querySelectorAll('.description input').length;

    // Act
    deleteRow(alimonySection);

    // Assert
    await wait(() => expect(alimonySection.querySelectorAll('.description input').length).toBe(inputRows - 1));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in gain-cost-assets-own-company section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: GAIN_COST_ASSETS_OWN_COMPANY_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const gainCostToAssetsOwnCompanySection = await waitForElement(() => getByTestId('gain-cost-assets-own-company'));

    // Act
    const amountNode = gainCostToAssetsOwnCompanySection.querySelector('.common-description-amount input');
    const descriptionNode = gainCostToAssetsOwnCompanySection.querySelector('.description input');
    act(() => {
      updateInputFields([amountNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount and description fields in assets-liabilities section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: ASSETS_LIABILITIES_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });
    const assetLiabilitiesSection = await waitForElement(() => getByTestId('assets-liabilities'));
    const openingValueNode = assetLiabilitiesSection.querySelector('.assets-liabilities-opening-value input');
    const closingValueNode = assetLiabilitiesSection.querySelector('.assets-liabilities-closing-value input');
    const descriptionNode = assetLiabilitiesSection.querySelector('.description input');

    // Act
    act(() => {
      updateInputFields([openingValueNode, closingValueNode, descriptionNode]);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should be able to remove row in assets-liabilities section', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: ASSETS_LIABILITIES_INCOME },
    });
    const assetLiabilitiesSection = await waitForElement(() => getByTestId('assets-liabilities'));
    const inputRows = assetLiabilitiesSection.querySelectorAll('.description input').length;

    // Act
    deleteRow(assetLiabilitiesSection);

    // Assert
    await wait(() => expect(assetLiabilitiesSection.querySelectorAll('.description input').length).toBe(inputRows - 1));
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in other-income-section section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: OTHER_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    await addNewSection(getByTestId, 10);
    const otherIncomeSection = await waitForElement(() => getByTestId('other-income-section'));
    const otherIncomeAmountNodeList = otherIncomeSection.querySelectorAll('.text-input input');
    act(() => {
      updateInputFields(otherIncomeAmountNodeList);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should call the calculateUpdatedTax function on change of amount and description fields in refund-expenses section', async () => {
    // Arrange
    const taxCalcuationSpy = jest.fn();
    const { getByTestId } = setupComponent({
      initialData: { ...INCOME_DATA, income: REFUND_INCOME },
      options: TAB_OPTIONS,
      calculateUpdatedTax: taxCalcuationSpy,
    });

    // Act
    await addNewSection(getByTestId, 9);
    const refundExpensesSection = await waitForElement(() => getByTestId('refund-expenses'));
    const refundExpensesAmountNodeList = refundExpensesSection.querySelectorAll('.text-input input');
    act(() => {
      updateInputFields(refundExpensesAmountNodeList);
    });

    // Assert
    await wait(() => expect(taxCalcuationSpy).toHaveBeenCalled());
  }, 10000);

  it('should remove the current employment section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: CURRENT_EMPLOYMENT_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-current-employment');

    // Assert
    expect(queryByTestId('current-employment')).toBeNull();
  });

  it('should remove the previous employment section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: PREVIOUS_EMPLOYMENT_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-previous-employment');

    // Assert
    expect(queryByTestId('previous-employment')).toBeNull();
  });

  it('should remove the taxable income abroad section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: ABROAD_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-income-abroad');

    // Assert
    expect(queryByTestId('income-abroad')).toBeNull();
  });

  it('should remove the exempted income section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: EXEMPTED_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-exempted-income');

    // Assert
    expect(queryByTestId('exempted-income')).toBeNull();
  });

  it('should remove the gain costs from other activities section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: GAIN_OR_COST_OTHER_ACTIVITIES_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-gain-cost-other-activities');

    // Assert
    expect(queryByTestId('gain-cost-other-activities')).toBeNull();
  });

  it('should remove the gain from assets to own company section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: GAIN_COST_ASSETS_OWN_COMPANY_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-gain-cost-assets-own-company');

    // Assert
    expect(queryByTestId('gain-cost-assets-own-company')).toBeNull();
  });

  it('should remove the assets and liabilities section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: ASSETS_LIABILITIES_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-assets-liabilities');

    // Assert
    expect(queryByTestId('assets-liabilities')).toBeNull();
  });

  it('should remove the alimony section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: ALIMONY_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-alimony-section');

    // Assert
    expect(queryByTestId('alimony-section')).toBeNull();
  });

  it('should remove the income and costs benefits section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: INCOME_COST_BENEFITS } });

    // Act
    await removeSection(getByTestId, 'remove-income-cost-benefits');

    // Assert
    expect(queryByTestId('income-cost-benefits')).toBeNull();
  });

  it('should remove the refunded expenses section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: REFUND_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-refund-expenses');

    // Assert
    expect(queryByTestId('refund-expenses')).toBeNull();
  });

  it('should remove the other income section on click of confirm button', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({ initialData: { ...INCOME_DATA, income: OTHER_INCOME } });

    // Act
    await removeSection(getByTestId, 'remove-other-income-section');

    // Assert
    expect(queryByTestId('other-income-section')).toBeNull();
  });
});

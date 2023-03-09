import React from 'react';
import {
  render,
  wait,
  waitForElement,
  act,
  getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import { changeInput, setBooleanField, getActivePartnerTab } from '../../../common/test-helpers';
import { removeSection } from '../tax-forecast-test-helpers';
import AdditionalCalculationInformationContainer from './additional-calculation-information-container';
import TaxForecastContext from '../tax-forecast-context';
import {
  TAB_OPTIONS,
  ACTIVE_PARTNER_OBJECT,
  ACTIVE_TAB,
  GLOBAL_CLIENT_ID,
  mockAutoSaveDeclaration,
} from '../tax-forecast.test.data';
import {
  FISCAL_DATA,
  FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS,
  FISCAL_DATA_EMPTY_ADDITIONAL_DETAILS,
  INITIAL_ADDITIONAL_CALCULATION_DATA,
} from './additional-calculation-information-container.test.data';

const setActiveTab = jest.fn();
const calculateTaxSpy = jest.fn();

const updateCurrecnyInputFields = (list) => {
  list.forEach((item) => {
    jest.useFakeTimers();
    changeInput(item, 199);
    jest.runOnlyPendingTimers();
  });
};

const setUpPremiumObligationSection = async (getByTestId) => {
  const additionalContainer = await waitForElement(() => getByTestId('additional-calculation-container'));
  const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
  const sectionKey = 'premiumObligation';
  const basePensionKey = 'periodNotInsuredForBasePensionAndGeneralSurviersLaw';
  const healthCareLawKey = 'periodNotInsuredForHealthcareLaw';

  const basePensionStartDate = additionalContainer.querySelector(`.${taxableSubjectKey}-${sectionKey}-${basePensionKey}-start-date .SingleDatePickerInput .DateInput_input`);
  const basePensionEndDate = additionalContainer.querySelector(`.${taxableSubjectKey}-${sectionKey}-${basePensionKey}-end-date .SingleDatePickerInput .DateInput_input`);
  const healthCareLawStartDate = additionalContainer.querySelector(`.${taxableSubjectKey}-${sectionKey}-${healthCareLawKey}-start-date .SingleDatePickerInput .DateInput_input`);
  const healthCareLawEndDate = additionalContainer.querySelector(`.${taxableSubjectKey}-${sectionKey}-${healthCareLawKey}-end-date .SingleDatePickerInput .DateInput_input`);

  const basePensionErrorMessageDataTa = `error-${taxableSubjectKey}.${sectionKey}.${basePensionKey}.endDate`;
  const healthCareErrorMessageDataTa = `error-${taxableSubjectKey}.${sectionKey}.${healthCareLawKey}.endDate`;

  return [
    basePensionStartDate,
    basePensionEndDate,
    healthCareLawStartDate,
    healthCareLawEndDate,
    basePensionErrorMessageDataTa,
    healthCareErrorMessageDataTa,
  ];
};

const setupComponent = ({
  initialData = FISCAL_DATA, options = TAB_OPTIONS, calculateUpdatedTax = calculateTaxSpy, activeTab = ACTIVE_TAB,
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      tabOptions: options,
      calculateUpdatedTax,
      setActiveTab,
      isPartner: !!activeTab,
      activeTab,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails: jest.fn(),
    }
  }
  >
    <AdditionalCalculationInformationContainer taxableAmount={0} />
  </TaxForecastContext.Provider>,
);

describe('Tax Forecast - Additional Calclation Information', () => {
  afterEach(fetchMock.restore);

  it('should load Additional Calculation Information Form with null data', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS,
      },
    });

    // Act
    const informationForm = await waitForElement(() => getByTestId('tax-forecast-additional-calculation-information-form'));

    // Assert
    expect(informationForm).toBeInTheDocument();
  });

  it('should check whether the partner tab is active', async () => {
    // Arrange
    const { getByTestId } = setupComponent(ACTIVE_PARTNER_OBJECT);

    // Act
    const partnerTab = getActivePartnerTab(getByTestId);

    // Assert
    await wait(() => expect(partnerTab.classList.contains('mdc-tab--active')).toEqual(true));
  });

  it('should load Additional Calculation Information Form', async () => {
    // Arrange
    const { getByTestId } = setupComponent({
      initialData: {
        ...FISCAL_DATA_WITH_NULL_ADDITIONAL_CALCULATION_INFORMATION_FIELDS,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            residualPersonalDeductionsOfLastYear: {
              description: 'test',
              amount: 1000,
            },
          },
        },
      },
    });

    // Act
    const informationForm = await waitForElement(() => getByTestId('tax-forecast-additional-calculation-information-form'));

    // Assert
    expect(informationForm).toBeInTheDocument();
  });

  it('should delete the withholding section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            withholdingTax: INITIAL_ADDITIONAL_CALCULATION_DATA.withholdingTax,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-withholding-section');

    // Assert
    expect(queryByTestId('withholding-section')).toBeNull();
  });

  it('should delete the tax credit section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            taxCredit: INITIAL_ADDITIONAL_CALCULATION_DATA.taxCredit,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-taxCredit-section');

    // Assert
    expect(queryByTestId('taxCredit-section')).toBeNull();
  });

  it('should delete the lossesYetToSettleBoxOne section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            lossesYetToSettleBoxOne: INITIAL_ADDITIONAL_CALCULATION_DATA.lossesYetToSettleBoxOne,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-lossesYetToSettleBoxOne-section');

    // Assert
    expect(queryByTestId('lossesYetToSettleBoxOne-section')).toBeNull();
  });

  it('should delete the residualPersonalDeductionsOfLastYear section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            residualPersonalDeductionsOfLastYear: INITIAL_ADDITIONAL_CALCULATION_DATA.residualPersonalDeductionsOfLastYear,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-residualPersonalDeductionsOfLastYear-section');

    // Assert
    expect(queryByTestId('residualPersonalDeductionsOfLastYear-section')).toBeNull();
  });

  it('should delete the lossesYetToSettleBoxTwo section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            lossesYetToSettleBoxTwo: INITIAL_ADDITIONAL_CALCULATION_DATA.lossesYetToSettleBoxTwo,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-lossesYetToSettleBoxTwo-section');

    // Assert
    expect(queryByTestId('withholding-section')).toBeNull();
  });

  it('should delete the premiumObligation section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            premiumObligation: INITIAL_ADDITIONAL_CALCULATION_DATA.premiumObligation,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-premiumObligation-section');

    // Assert
    expect(queryByTestId('premiumObligation-section')).toBeNull();
  });

  it('should delete the revisionInterest section on click of remove', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData:{
        ...FISCAL_DATA,
        additionalCalculationDetails: {
          taxableSubjectAdditionalCalculations: {
            revisionInterest: INITIAL_ADDITIONAL_CALCULATION_DATA.revisionInterest,
          },
        },
      },
    });
    // Act
    await removeSection(getByTestId, 'remove-revisionInterest-section');

    // Assert
    expect(queryByTestId('revisionInterest-section')).toBeNull();
  });

  it('should display error message if end date is before start date in premeiun obligation section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const [
      basePensionStartDate,
      basePensionEndDate,
      healthCareLawStartDate,
      healthCareLawEndDate,
      basePensionErrorMessageDataTa,
      healthCareErrorMessageDataTa,
    ] = await setUpPremiumObligationSection(getByTestId);

    // Act
    act(() => {
      changeInput(basePensionStartDate, '2019-02-02');
      changeInput(basePensionEndDate, '2019-01-01');
      changeInput(healthCareLawStartDate, '2019-02-02');
      changeInput(healthCareLawEndDate, '2019-01-01');
    });

    // Assert
    await wait(() => expect(getByTestId(basePensionErrorMessageDataTa)).toBeInTheDocument());
    await wait(() => expect(getByTestId(healthCareErrorMessageDataTa)).toBeInTheDocument());
  });

  it('should display error message if there is end date without start date in premeiun obligation section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const [
      basePensionStartDate,
      basePensionEndDate,
      healthCareLawStartDate,
      healthCareLawEndDate,
      basePensionErrorMessageDataTa,
      healthCareErrorMessageDataTa,
    ] = await setUpPremiumObligationSection(getByTestId);

    // Act
    changeInput(basePensionStartDate, '');
    changeInput(basePensionEndDate, '2019-09-03');
    changeInput(healthCareLawStartDate, '');
    changeInput(healthCareLawEndDate, '2019-09-03');

    // Assert
    await wait(() => expect(getByTestId(basePensionErrorMessageDataTa)).toBeInTheDocument());
    await wait(() => expect(getByTestId(healthCareErrorMessageDataTa)).toBeInTheDocument());
  });

  it('should call calculateUpdatedTax on change of amount fields in withholdings section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const numberOfCalculateUpdatedTaxCalls = 4;
    const fieldNamePrefix = 'taxableSubjectAdditionalCalculations.withholdingTax';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const payrollTaxesOnWagesThatArePartOfIncomeOutOfBusinessField = await waitForElement(() => getByNameAttribute(getByTestId('payroll-taxes-on-wages-that-are-part-of-income-out-of-business'), `${fieldNamePrefix}.payrollTaxesOnWagesThatArePartOfIncomeOutOfBusiness.currentYearAmount`));
    const wageAsPartOfIncomeFromBusinessField = await waitForElement(() => getByNameAttribute(getByTestId('wage-as-part-of-income-from-business'), `${fieldNamePrefix}.wageAsPartOfIncomeFromBusiness.currentYearAmount`));
    const provisionalIncomeTaxAssessmentField = await waitForElement(() => getByNameAttribute(getByTestId('provisional-income-tax-assessment'), `${fieldNamePrefix}.provisionalIncomeTaxAssessment.currentYearAmount`));
    const provisionalRemittanceHealthInsuranceLawField = await waitForElement(() => getByNameAttribute(getByTestId('provisional-remittance-health-insurance-law'), `${fieldNamePrefix}.provisionalRemittanceHealthInsuranceLaw.currentYearAmount`));

    // Act
    act(() => {
      updateCurrecnyInputFields([
        payrollTaxesOnWagesThatArePartOfIncomeOutOfBusinessField,
        wageAsPartOfIncomeFromBusinessField,
        provisionalIncomeTaxAssessmentField,
        provisionalRemittanceHealthInsuranceLawField,
      ]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  }, 20000);

  it('should call calculateUpdatedTax on change of amount fields in residual personal deductions section', async () => {
    // Arrange
    const numberOfCalculateUpdatedTaxCalls = 1;
    const fieldNamePrefix = 'taxableSubjectAdditionalCalculations.residualPersonalDeductionsOfLastYear';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const amountField = await waitForElement(() => getByNameAttribute(getByTestId('residualPersonalDeductionsOfLastYear-amount'), `${fieldNamePrefix}.amount`));

    // Act
    act(() => {
      jest.useFakeTimers();
      changeInput(amountField, null);
      jest.runOnlyPendingTimers();
      updateCurrecnyInputFields([amountField]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call calculateUpdatedTax on change of amount fields in revision interest section', async () => {
    // Arrange
    const numberOfCalculateUpdatedTaxCalls = 1;
    const fieldNamePrefix = 'taxableSubjectAdditionalCalculations.revisionInterest';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const amountField = await waitForElement(() => getByNameAttribute(getByTestId('revisionInterest-amount'), `${fieldNamePrefix}.amount`));

    // Act
    act(() => {
      updateCurrecnyInputFields([amountField]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call calculateUpdatedTax on change of amount fields in lossed yet to be settled box 1 section', async () => {
    // Arrange
    const numberOfCalculateUpdatedTaxCalls = 1;
    const fieldNamePrefix = 'taxableSubjectAdditionalCalculations.lossesYetToSettleBoxOne';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const amountField = await waitForElement(() => getByNameAttribute(getByTestId('lossesYetToSettleBoxOne-amount'), `${fieldNamePrefix}.amount`));

    // Act
    act(() => {
      updateCurrecnyInputFields([amountField]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call calculateUpdatedTax on change of amount fields in lossed yet to be settled box 2 section', async () => {
    // Arrange
    const numberOfCalculateUpdatedTaxCalls = 1;
    const fieldNamePrefix = 'taxableSubjectAdditionalCalculations.lossesYetToSettleBoxTwo';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const amountField = await waitForElement(() => getByNameAttribute(getByTestId('lossesYetToSettleBoxTwo-amount'), `${fieldNamePrefix}.amount`));

    // Act
    act(() => {
      updateCurrecnyInputFields([amountField]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call calculateUpdatedTax on change of amount fields in tax credit section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const numberOfCalculateUpdatedTaxCalls = 2;
    const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
    const sectionKey = 'taxCredit';
    const fieldNamePrefix = `${taxableSubjectKey}.${sectionKey}`;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });

    const incomeFromLaborForFiscalPartner = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-incomeOutOfLaborForFiscalPartner`),
      `${fieldNamePrefix}.incomeOutOfLaborForFiscalPartner`,
    ));
    const numberOfLeavesApplied = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-numberOfLeavesApplied`),
      `${fieldNamePrefix}.numberOfLeavesApplied`,
    ));

    // Act
    act(() => {
      updateCurrecnyInputFields([
        incomeFromLaborForFiscalPartner,
        numberOfLeavesApplied,
      ]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should put default value and disable number of leaves applied field when are leaves used is unchecked in tax credit section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const numberOfCalculateUpdatedTaxCalls = 1;
    const updatedNumberOfLeavesApplied = '';
    const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
    const sectionKey = 'taxCredit';
    const fieldNamePrefix = `${taxableSubjectKey}.${sectionKey}`;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });

    const numberOfLeavesApplied = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-numberOfLeavesApplied`),
      `${fieldNamePrefix}.numberOfLeavesApplied`,
    ));
    const areLeavesUsed = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-areLeavesUsed`),
      `${fieldNamePrefix}.areLeavesUsed`,
    ));

    // Act
    act(() => {
      updateCurrecnyInputFields([
        numberOfLeavesApplied,
      ]);
    });
    setBooleanField(areLeavesUsed, false);

    // Assert
    await wait(() => expect(numberOfLeavesApplied.value).toBe(updatedNumberOfLeavesApplied));
    expect(numberOfLeavesApplied).toBeDisabled();
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call tax caculation if areLeavesUsed ischecked in tax credit section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const numberOfCalculateUpdatedTaxCalls = 1;
    const taxableSubjectKey = 'taxableSubjectAdditionalCalculations';
    const sectionKey = 'taxCredit';
    const fieldNamePrefix = `${taxableSubjectKey}.${sectionKey}`;
    const { getByTestId } = setupComponent({
      initialData: FISCAL_DATA_EMPTY_ADDITIONAL_DETAILS,
      calculateUpdatedTax: calculateTaxSpy,
    });

    const areLeavesUsed = await waitForElement(() => getByNameAttribute(
      getByTestId(`${taxableSubjectKey}-areLeavesUsed`),
      `${fieldNamePrefix}.areLeavesUsed`,
    ));

    // Act
    act(() => {
      setBooleanField(areLeavesUsed);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });

  it('should call tax calculation api on change of date in premeiun obligation section', async () => {
    // Arrange
    mockAutoSaveDeclaration();
    const numberOfCalculateUpdatedTaxCalls = 4;
    const { getByTestId } = setupComponent({
      calculateUpdatedTax: calculateTaxSpy,
    });
    const [
      basePensionStartDate,
      basePensionEndDate,
      healthCareLawStartDate,
      healthCareLawEndDate,
    ] = await setUpPremiumObligationSection(getByTestId);

    // Act
    await act(async () => {
      changeInput(basePensionStartDate, '2019-02-02');
      await wait(() => changeInput(basePensionEndDate, '2019-10-01'));
      await wait(() => changeInput(healthCareLawStartDate, '2019-02-02'));
      await wait(() => changeInput(healthCareLawEndDate, '2019-10-01'));
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculateUpdatedTaxCalls));
  });
});

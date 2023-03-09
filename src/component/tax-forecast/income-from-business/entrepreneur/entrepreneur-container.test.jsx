import React from 'react';
import {
  render, fireEvent, wait, waitForElement, act, getByNameAttribute,
} from 'test-utils';
import fetchMock from 'fetch-mock';
import EntrepreneurContainer from './entrepreneur-container';
import TaxForecastContext from '../../tax-forecast-context';
import {
  TAB_OPTIONS,
  ACTIVE_TAB,
  ACTIVE_PARTNER_OBJECT,
  GLOBAL_CLIENT_ID,
} from '../../tax-forecast.test.data';
import {
  ENTREPRENEUR_FORM,
  DOSSIER_DATA,
  ENTREPRENEUR_DATA_WITH_EMPTY_PARTNER_DATA,
  MOCK_ENTERPRENEURIAL_DEDUCTIONS,
  MOCK_REMAINDER_SELF_DEDUCTIONS,
  MOCK_FISCAL_PENSION_RESERVE,
} from './entrepreneur.test.data';
import { SECTION_LIST } from './entrepreneur.constants';
import {
  getActivePartnerTab,
  changeInput,
  getTableRowsCount,
  selectAutoCompleteOption,
  setBooleanField,
} from '../../../../common/test-helpers';
import { removeSection } from '../../tax-forecast-test-helpers';

const setActiveTab = jest.fn();
const calculateTaxSpy = jest.fn();
const saveDossierDetails = jest.fn();
const setupComponent = ({
  initialData = DOSSIER_DATA, options = TAB_OPTIONS, activeTab = ACTIVE_TAB, calculateUpdatedTax = jest.fn(),
} = {}) => render(
  <TaxForecastContext.Provider value={
    {
      dossierData: initialData,
      tabOptions: options,
      setActiveTab,
      isPartner: !!activeTab,
      activeTab,
      calculateUpdatedTax,
      globalClientId: GLOBAL_CLIENT_ID,
      saveDossierDetails,
    }
  }
  >
    <EntrepreneurContainer />
  </TaxForecastContext.Provider>,
);

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

describe('entrepreneur form', () => {
  afterEach(fetchMock.restore);

  it('should display all the available entrepreneur section links onClick of add item button ', async () => {
    // Arrange
    const { getByTestId } = setupComponent({ initialData: { ...DOSSIER_DATA, entrepreneurDetails: null }, options: TAB_OPTIONS });
    const entrepreneurForm = await waitForElement(() => getByTestId(ENTREPRENEUR_FORM));
    const showSectionsListButton = getByTestId('add-entrepreneur-sections-button');

    // Act
    fireEvent.click(showSectionsListButton);
    const entrepreneursectionsList = entrepreneurForm.querySelectorAll('.mdc-list-item');

    // Assert
    expect(entrepreneursectionsList.length).toBe(SECTION_LIST.length);
  }, 10000);

  it('should disable the section link in add-sections menu list after adding the particular entrepreneur section in taxable subject tab', async () => {
    // Arrange
    const data = { ...DOSSIER_DATA };
    data.entrepreneurDetails = null;
    const { getByTestId } = setupComponent({ initialData: data, options: TAB_OPTIONS });
    const entrepreneurForm = await waitForElement(() => getByTestId(ENTREPRENEUR_FORM));
    const showEntrepreneurSectionsListButton = getByTestId('add-entrepreneur-sections-button');

    // Act
    fireEvent.click(showEntrepreneurSectionsListButton);
    const sectionsListItems = entrepreneurForm.querySelectorAll('.mdc-list-item');
    fireEvent.click(sectionsListItems[0]);
    fireEvent.click(showEntrepreneurSectionsListButton);

    // Assert
    await wait(() => expect(entrepreneurForm.querySelectorAll('.mdc-list-item--disabled').length).toBe(1));
  });

  it('should delete the entrepreneurial deductions section on click of remove in taxable subject tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          taxableSubjectEntrepreneurDetails: {
            ...MOCK_ENTERPRENEURIAL_DEDUCTIONS,
          },
        },
      },
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions')).toBeNull();
  });

  it('should delete the entrepreneurial remainder self deductions section on click of remove in taxable subject tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          taxableSubjectEntrepreneurDetails: {
            ...MOCK_REMAINDER_SELF_DEDUCTIONS,
          },
        },
      },
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions-remainder-deduction');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions-remainder-deduction')).toBeNull();
  });

  it('should delete the fiscal pension reserve section on click of remove in taxable subject tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          taxableSubjectEntrepreneurDetails: {
            ...MOCK_FISCAL_PENSION_RESERVE,
          },
        },
      },
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions-fiscal-pension-reserve');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions-fiscal-pension-reserve')).toBeNull();
  });

  it('should delete the entrepreneurial deductions section on click of remove in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          fiscalPartnerEntrepreneurDetails: {
            ...MOCK_ENTERPRENEURIAL_DEDUCTIONS,
          },
        },
      },
      activeTab: 1,
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions')).toBeNull();
  });

  it('should delete the entrepreneurial remainder self deductions section on click of remove in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          fiscalPartnerEntrepreneurDetails: {
            ...MOCK_REMAINDER_SELF_DEDUCTIONS,
          },
        },
      },
      activeTab: 1,
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions-remainder-deduction');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions-remainder-deduction')).toBeNull();
  });

  it('should delete the fiscal pension reserve section on click of remove in fiscal partner tab', async () => {
    // Arrange
    const { getByTestId, queryByTestId } = setupComponent({
      initialData: {
        ...DOSSIER_DATA,
        entrepreneurDetails: {
          fiscalPartnerEntrepreneurDetails: {
            ...MOCK_FISCAL_PENSION_RESERVE,
          },
        },
      },
      activeTab: 1,
    });

    // Act
    await removeSection(getByTestId, 'remove-entrepreneurial-deductions-fiscal-pension-reserve');

    // Assert
    expect(queryByTestId('entrepreneurial-deductions-fiscal-pension-reserve')).toBeNull();
  });

  it('should check whether the partner tab is active', async () => {
    // Arrange
    const { getByTestId } = setupComponent(ACTIVE_PARTNER_OBJECT);

    // Act
    const partnerTab = getActivePartnerTab(getByTestId);

    // Assert
    await wait(() => expect(partnerTab.classList.contains('mdc-tab--active')).toEqual(true));
  });

  it('should disable the section link in the menu list adding the particular entrepreneur section in partner tab', async () => {
    // Arrange
    const data = { ...DOSSIER_DATA };
    data.entrepreneurDetails = { ...ENTREPRENEUR_DATA_WITH_EMPTY_PARTNER_DATA };
    const { getByTestId } = setupComponent({ initialData: data, options: TAB_OPTIONS, ...ACTIVE_PARTNER_OBJECT });
    const entrepreneurForm = await waitForElement(() => getByTestId(ENTREPRENEUR_FORM));
    const showEntrepreneurSectionsListButton = getByTestId('add-entrepreneur-sections-button');

    // Act
    fireEvent.click(showEntrepreneurSectionsListButton);
    const sectionsListItems = entrepreneurForm.querySelectorAll('.mdc-list-item');
    fireEvent.click(sectionsListItems[0]);
    fireEvent.click(showEntrepreneurSectionsListButton);

    // Assert
    expect(entrepreneurForm.querySelectorAll('.mdc-list-item--disabled').length).toBe(1);
  });

  it('should call the calculateUpdatedTax function on change of description fields in fiscal pension reserve allocation details section', async () => {
    // Arrange
    const numberOfInputFields = 1;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const allocationDetailsSection = await waitForElement(() => getByTestId('pension-reserve-allocation-details'));

    // Act
    const bussinessOption = selectAutoCompleteOption(allocationDetailsSection, '.allocation-select', 0, true);
    fireEvent.click(bussinessOption);

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfInputFields));
  }, 10000);

  it('should delete row on click of delete in remainder-self-deductions section', async () => {
    // Arrange
    const data = { ...DOSSIER_DATA };
    const entrepreneurDetails = {
      taxableSubjectEntrepreneurDetails: { ...data.entrepreneurDetails.taxableSubjectEntrepreneurDetails },
      fiscalPartnerEntrepreneurDetails: null,
    };
    data.entrepreneurDetails = entrepreneurDetails;
    const { getByTestId } = setupComponent({ initialData: data, options: TAB_OPTIONS });
    const remainderSelfSection = await waitForElement(() => getByTestId('remainder-self-employed-deduction'));
    const inputRows = getTableRowsCount(remainderSelfSection);

    // Act
    act(() => {
      deleteRow(remainderSelfSection);
    });

    // Assert
    expect(getTableRowsCount(remainderSelfSection)).toBe(inputRows - 1);
  });

  it('should call the calculateUpdatedTax function on change of opening amount and description fields in remainder self employed deduction section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const selfEmployedDeductionSection = await waitForElement(() => getByTestId('remainder-self-employed-deduction'));

    // Act
    const yearOption = selectAutoCompleteOption(selfEmployedDeductionSection, '.self-deduction-select', 0, true);
    fireEvent.click(yearOption);
    const openingNode = selfEmployedDeductionSection.querySelector('.self-deduction-applied input');
    act(() => {
      updateInputFields([openingNode]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should delete row on click of delete in fiscal-pension-reserve section', async () => {
    // Arrange
    const { getByTestId } = setupComponent();
    const pensionReserveAllocation = await waitForElement(() => getByTestId('pension-reserve-allocation-details'));
    const inputRows = getTableRowsCount(pensionReserveAllocation);

    // Act
    act(() => {
      deleteRow(pensionReserveAllocation);
    });

    // Assert
    expect(getTableRowsCount(pensionReserveAllocation)).toBe(inputRows - 1);
  });

  it('should call the calculateUpdatedTax function on change of amount and description fields in fiscal pension reserve allocation details section', async () => {
    // Arrange
    const numberOfCurrencyFields = 4;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const allocationDetailsSection = await waitForElement(() => getByTestId('pension-reserve-allocation-details'));

    // Act
    const openingNode = allocationDetailsSection.querySelector('.allocation-details-opening input');
    const allocationNode = allocationDetailsSection.querySelector('.allocation-details-allocation-amount input');
    const releaseNode = allocationDetailsSection.querySelector('.allocation-details-release input');

    updateInputFields([openingNode, allocationNode, releaseNode]);
    const bussinessOption = selectAutoCompleteOption(allocationDetailsSection, '.allocation-select', 0, true);
    await wait(() => fireEvent.click(bussinessOption));

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 20000);

  it('should call the calculateUpdatedTax function on change of previously used cessation deduction field in entrepreneur deductions section', async () => {
    // Arrange
    const numberOfCurrencyFields = 2;
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const entrepreneurDeductionSection = await waitForElement(() => getByTestId('entrepreneurial-deductions'));
    const numberOfHoursNode = entrepreneurDeductionSection.querySelector('.no-of-hours-worked-input input');
    const openingNode = entrepreneurDeductionSection.querySelector('.previous_used_cessation_current input');

    // Act
    act(() => {
      updateInputFields([numberOfHoursNode, openingNode]);
    });

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function onclick of checkbox in deduction field in entrepreneur deductions section', async () => {
    // Arrange
    const numberOfCurrencyFields = 6;
    const namePrefix = 'taxableSubjectEntrepreneurDetails.entrepreneurialDeductions';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const selfDeductionCheck = await waitForElement(() => getByNameAttribute(getByTestId('self_deduction_current'), `${namePrefix}.entitledToSelfEmployedDeduction.currentYearAmount`));
    const startUpDeductionCheck = getByNameAttribute(getByTestId('start_up_deduction_current'), `${namePrefix}.entitledToStartUpDeduction.currentYearAmount`);
    const startupDisabilityCheck = getByNameAttribute(getByTestId('start_up_deduction_disability_current'), `${namePrefix}.entitledToStartUpDeductionWithDisablity.currentYearAmount`);
    const rndCheck = getByNameAttribute(getByTestId('research_development_current'), `${namePrefix}.entitledToResearchAndDevelopmentDeduction.currentYearAmount`);
    const rndDeductionCheck = getByNameAttribute(getByTestId('research_development_deduction_current'), `${namePrefix}.entitledToIncreaseResearchAndDevelopmentDeduction.currentYearAmount`);
    const cessationCheck = getByNameAttribute(getByTestId('entitled_cessation_current'), `${namePrefix}.entitledToCessationDeduction.currentYearAmount`);

    // Act
    setBooleanField(selfDeductionCheck);
    setBooleanField(startUpDeductionCheck);
    setBooleanField(startupDisabilityCheck);
    setBooleanField(rndCheck);
    setBooleanField(rndDeductionCheck);
    setBooleanField(cessationCheck);

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCurrencyFields));
  }, 10000);

  it('should call the calculateUpdatedTax function onclick of checkbox in entrepreneur deduction field in entrepreneur deductions section', async () => {
    // Arrange
    const numberOfCalculationActions = 2;
    const namePrefix = 'taxableSubjectEntrepreneurDetails.entrepreneurialDeductions';
    const { getByTestId } = setupComponent({ calculateUpdatedTax: calculateTaxSpy });
    const selfDeductionCheck = await waitForElement(() => getByNameAttribute(getByTestId('self_deduction_current'), `${namePrefix}.entitledToSelfEmployedDeduction.currentYearAmount`));

    // Act
    act(() => {
      setBooleanField(selfDeductionCheck, false);
    });
    setBooleanField(selfDeductionCheck, true);

    // Assert
    await wait(() => expect(calculateTaxSpy).toHaveBeenCalledTimes(numberOfCalculationActions));
  });
});

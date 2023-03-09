import { fireEvent, waitForElement, wait } from 'test-utils';
import { selectAutoCompleteOption, changeInput, getTableRowsCount } from '../../common/test-helpers';

/**
 * Function to change administration and source dropdown values
 * @param {*} getByTestId
 * @param {*} domId
 * @param {*} sourceValue
 * @param {*} administrationValue
 */
export const handleAdministrationsAndSourceChange = (container, sourceValue, administrationValue) => {
  const dataSourceOption = selectAutoCompleteOption(container, '.data-source-select', sourceValue);
  fireEvent.click(dataSourceOption);
  const administrationOption = selectAutoCompleteOption(container, '.administrations-select', administrationValue);
  fireEvent.click(administrationOption);
  return { dataSourceOption, administrationOption };
};

/**
 * Function to update inputs of correction form and submit the form
 * @param {*} getByTestId
 * @param {*} editId
 * @param {*} formId
 * @param {*} inputs
 */
export const updateAndSubmitCorrectionForm = async (getByTestId, editId, formId, inputs) => {
  const editButton = await waitForElement(() => getByTestId(editId));
  fireEvent.click(editButton);

  const correctionForm = await waitForElement(() => getByTestId(formId));
  inputs.forEach(async (input) => {
    const inputContainer = await waitForElement(() => correctionForm.querySelector(input.selector));
    if (typeof input.value === 'string') {
      changeInput(inputContainer, input.value);
    } else {
      jest.useFakeTimers();
      changeInput(inputContainer, input.value);
      jest.runOnlyPendingTimers();
    }
  });

  fireEvent.submit(correctionForm);
};

/** Function to return rendered correction modal */
export const getCorrectionModal = async (getByTestId, editId, modalId) => {
  const editButton = await waitForElement(() => getByTestId(editId));
  fireEvent.click(editButton);

  const correctionModal = await waitForElement(() => getByTestId(modalId));
  return correctionModal;
};

/** Function to delete table row */
export const deleteTableRow = async (getByTestId, editButtonId, tableId, deleteIconId) => {
  const editButton = await waitForElement(() => getByTestId(editButtonId));
  fireEvent.click(editButton);

  const correctionTable = await waitForElement(() => getByTestId(tableId));
  const initialTableRows = getTableRowsCount(correctionTable);

  const deleteIcon = getByTestId(deleteIconId);
  fireEvent.click(deleteIcon);

  const remianingTableRows = getTableRowsCount(correctionTable);

  return { initialTableRows, remianingTableRows };
};

/** Function to handle click on rendered confirmation dialog submit */
export const removeSection = async (getByTestId, dataTa) => {
  const removeSectionButton = await waitForElement(() => getByTestId(dataTa));
  fireEvent.click(removeSectionButton);
  await wait(() => fireEvent.click(getByTestId('confirm-dialog-submit')));
};

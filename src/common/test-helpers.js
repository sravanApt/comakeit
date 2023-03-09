import { fireEvent, waitForElement } from 'test-utils';

/**
 * This helper can be used to check or uncheck a boolean field.
 * @param {*} element: is a DOM element
 * @param {*} checked: cheked state
 */
export const setBooleanField = (element, checked = true) => {
  fireEvent.click(element);
  fireEvent.change(element, { target: { checked } });
};

/**
 * This helper can be used to change input field value.
 * @param {*} input: is a DOM element
 * @param {*} value: is a value to be enterd in DOM
 */
export const changeInput = (input, value) => {
  fireEvent.change(input, { target: { value } });
};

/**
  * Return autocomplete option elements.
  * @param {*} container: is a form container
  * @param {*} element: is a DOM element
  * @param {*} selectedItemIndex: is selected option index
  */
export const selectAutoCompleteOption = (container, element, selectedItemIndex, isMenuPortableTarget) => {
  const dropdownField = container.querySelector(`${element} input`);
  fireEvent.focus(dropdownField);
  fireEvent.mouseDown(dropdownField);
  if (isMenuPortableTarget) {
    return document.body.querySelectorAll('.react-select__option')[selectedItemIndex];
  }
  return container.querySelectorAll(`${element} .react-select__option`)[selectedItemIndex];
};

/**
 * Return async autocomplete option elements.
 * @param {*} container: is a form container
 * @param {*} element: is class of select element
 * @param {*} selectedItemIndex: is selected option index
 */
export const getAsyncAutocompleteOptions = async (container, element, searchString, isMenuPortableTarget) => {
  const input = container.querySelector(`${element} input`);
  fireEvent.change(input, { target: { value: searchString } });
  if (isMenuPortableTarget) {
    await waitForElement(() => document.body.querySelector('.react-select__option'));
    return document.body.querySelectorAll('.react-select__option');
  }
  await waitForElement(() => container.querySelector(`${element} .react-select__option`));
  return container.querySelectorAll(`${element} .react-select__option`);
};

/**
* Return active tab component.
* @param {} getByTestId: is a option to find element, provided by react testing library
*/
export const getActivePartnerTab = (getByTestId, tabContainerId = 'income-from-business-common-tabs', tabId = '.mdc-tab', tabPosition = 1) => {
  const tabContainer = getByTestId(tabContainerId);
  const tabs = tabContainer.querySelectorAll(tabId);
  // Act
  fireEvent.click(tabs[tabPosition]);
  return tabs[1];
};

/**
 *
 * @param {*} container: is a dom which contains table to find row count
 */
export const getTableRowsCount = (container) => container.querySelectorAll('.common-data-table__body .common-data-table__row').length;

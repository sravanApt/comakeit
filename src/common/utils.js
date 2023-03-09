import moment from 'moment';
import toPairs from 'lodash.topairs';
import isPlainObject from 'lodash.isplainobject';
import transform from 'lodash.transform';
import isEmpty from 'lodash.isempty';
import { isInclusivelyBeforeDay } from 'react-dates';
import sumBy from 'lodash.sumby';
import get from 'lodash.get';
import { REG_EXP_BSN_NUMBER } from './constants';

export const getGlobalAdvisorId = (userProfile) => userProfile?.organisationIds[0];

/** export an empty function */
export const emptyFunction = () => {};

/** it return date with given format as parameter */
export const dateToDayMonthAndYearString = (date, format = 'DD/MM/YYYY') => moment(date).format(format);

/**
 * Converts a parameters object to a query-string.
 * @param parameters
 *
 * Example: parametersToQueryString({ name: 'Henkie', company: 'Henkie & zonen' }) -> '?name=Henkie&company=Henkie%20%26%20zonen'
 */
export const createQueryString = function (parameters) {
  if (Object.keys(parameters).length > 0) {
    return toPairs(parameters).reduce((accumulator, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        return `${accumulator}${accumulator === '' ? '?' : '&'}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
      return accumulator;
    }, '');
  }
  return '';
};

/** to remove the empty, undefined, 0 and null values (can skip custom values using skipValues) from an object to reduce the payload which we send to api */
export const cleanDeep = (objectToBeCleaned, skipFirstElement = false, skipValues = []) => (
  transform(objectToBeCleaned, (result, value, key) => {
    // To skip the clean for first Element of an array
    if (skipFirstElement && key === 0) {
      result[0] = value;
      return;
    }
    // To skip the cleandeep for the object which has description & skipValues
    if ((isPlainObject(value) && (!isEmpty(value.description) || !isEmpty(value.name)))
      || (isPlainObject(value) && isPlainObject(value.salary) && !isEmpty(value.salary.description))
      || (skipValues.includes(value))) {
      result[key] = value;
      return;
    }

    if ((isPlainObject(value) && value.hasOwnProperty('description') && isEmpty(value.description))
    || (isPlainObject(value) && isPlainObject(value.salary) && isEmpty(value.salary.description))) {
      return;
    }

    // Recurse into arrays and objects.
    if (Array.isArray(value) || isPlainObject(value)) {
      value = cleanDeep(value, skipFirstElement, skipValues);
    }

    // Removes null, undefined, 0, empty values and empty arrays and objects
    if ((isPlainObject(value) && isPlainObject(value.salary) && isEmpty(value.salary.description))
    || (isPlainObject(value) && isEmpty(value))
    || (Array.isArray(value) && !value.length)
    || (value === '' || value === 0)
    || (value === null)
    || (value === undefined)) {
      return;
    }

    if (Array.isArray(result)) {
      result.push(value);
    }
    result[key] = value;
  })
);

/** it returns list of years from current date */
export const getYears = (startYear = new Date().getFullYear(), back = 3) => Array.from({ length: back }, (_, i) => parseInt(startYear, 10) + i);

/** to disable the out side range date */
export const isOutsideRange = (day) => !isInclusivelyBeforeDay(day, moment());

/** to allow only year range */
export const enableDatesForSingleYear = (day, year = moment().year()) => moment(day).year() !== year;

/** to allow date range until current year */
export const enableDatesTillCurrentYear = (day, year = moment().year()) => moment(day).year() > year;

/** returns year of given date */
export const getYear = (date = moment()) => moment(date).format('YYYY');

/** return previous date for given date or current date */
export const getPreviousDate = (date = moment(), format = 'YYYY-MM-DD') => moment(date).subtract(1, 'day').format(format);

/** it return start date of year */
export const startDateofYear = (year = moment().year(), format = 'D-M-YYYY') => moment([year]).startOf('year').format(format);

/** it return end date of year */
export const endDateofYear = (year = moment().year(), format = 'D-M-YYYY') => moment([year]).endOf('year').format(format);

/** Specifies the selected date is a future date or not */
export const isFutureDate = (day) => !isInclusivelyBeforeDay(day, moment());

/** moment object for current month with provided date */
export const getDateObjectWithYearAndMonth = (date = undefined) => moment(moment(date).format('YYYY-MM'));
/** moment object for starting month with provided date */
export const getStartDateObjectWithYearAndMonth = (year = moment().year(), month = '01') => moment(`${year}-${month}`);
/** moment object for end month with provided date */
export const getEndDateObjectWithYearAndMonth = (year = moment().year(), month = '12') => moment(`${year}-${month}`);

/** moment object for return start month with 100 years back date */
export const getHundredYearsBackDateObjectWithYearAndMonth = (year = moment().year(), month = '01') => moment(moment(`${year}-${month}`).subtract(99, 'year').format('YYYY-MM'));

/** it will convert the amount in the specified format */
export const convertCurrency = ({ format = 'nl-NL', value, currency = 'EUR' }) => new Intl.NumberFormat(format, { style: 'currency', currency, minimumFractionDigits: 0 }).format(value);

/** get total in array based on key */
export const getTotalValue = (array, key) => sumBy(array, (obj) => {
  const parsedValue = parseInt(get(obj, key), 10);
  return isNaN(parsedValue) ? 0 : parsedValue;
});

export const enableDatesBeforeCurrentDay = (day) => day.isAfter(moment().subtract(1, 'day'));

/** it returns current year value */
export const getCurrentYear = (year = moment().year()) => moment([year]).format('YYYY');

/** it returns previous year value */
export const getPreviousYear = (year = moment().year()) => moment([year]).subtract(1, 'year').format('YYYY');

/** it will merge array1 into array2.
* var arr1 = [{id: 1, value: '1'}, {id: 2, value: '2'}, {id: 3 , value: '3'}]; and
* var arr2 = [{id: 3, value: '33'}, {id: 4, value: '4'}, {id: 5, value: '5'}];
* and the result will be [{id: 1, value: '1'}, {id: 2, value: '2'}, {id: 3 , value: '33'}, {id: 4, value: '4'}, {id: 5, value: '5'}];
*/
export const mergeArrays = (arr1, arr2) => arr1 && arr1.map((obj) => (arr2 && arr2.find((p) => p.id === obj.id)) || obj);

/** it returns subtracted year value from given year */
export const getSubtractedYear = (year, subtractValue) => moment([year]).subtract(subtractValue, 'year').format('YYYY');

/** it returns string that coverted like class name naming convetion for given string */
export const stringToClassName = (key) => {
  const updatedClass = key.replace(/([a-z])([A-Z])/g, '$1-$2');
  return updatedClass.toLowerCase();
};

/** function to format the autocomplete options */
export const getSuggestions = (suggestions) => (suggestions.map((suggestion) => ({
  ...suggestion,
  label: suggestion.name,
  value: suggestion.id,
})));

/** it returns given master data as array of label and value objects */
export const formatMasterData = (data) => data && data.map((item) => ({
  value: item.value,
  label: item.displayName,
}));

/** to disable outside range of start date and current date */
export const isDateWithInRange = (startDate, endDate = moment()) => (day) => isInclusivelyBeforeDay(day, moment(startDate)) || !isInclusivelyBeforeDay(day, moment(endDate));

/** it returns current date */
export const getCurrentDate = (format) => moment().format(format);

/** BSN Number should have 9 digits.
 * Each digit will be multiplied as below.
 * Number 1 = ... * 9;
 * Number 2 = ... * 8;
 * Number 3 = ... * 7;
 * Number 4 = ... * 6;
 * Number 5 = ... * 5;
 * Number 6 = ... * 4;
 * Number 7 = ... * 3;
 * Number 8 = ... * 2;
 * Number 9 = ... * -1;
 * and the summation of all the resulted number should be divided by 11
 * and the first digit should not be 8.
 */
export const validateBsnNumber = (value) => {
  if (!REG_EXP_BSN_NUMBER.test(value)) {
    return false;
  }
  const bsnNumberDigitsArray = value.split('');
  let multiplier = 9;
  let digitsSum = 0;
  for (let i = 0; i < bsnNumberDigitsArray.length; i += 1) {
    if (i === 8) digitsSum += (bsnNumberDigitsArray[i] * -1);
    else digitsSum += (bsnNumberDigitsArray[i] * multiplier);
    multiplier -= 1;
  }
  if ((digitsSum / 11) % 1 !== 0) return false;
  return true;
};

/** function that returns unique Guid */
export const getGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

import { cleanDeep } from '../../../../common/utils';

/** function to check if details exist or not */
export const checkExpenseDetailsExist = (details) => !!cleanDeep(details)?.length;

export const checkDataInReserveDetailsExist = (annualAndReserveMarginDetails) => annualAndReserveMarginDetails.some((row) => Object.keys(row).length > 1);

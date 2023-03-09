import isEqual from 'lodash.isequal';
import { cleanDeep, formatMasterData } from '../../../../common/utils';
import {
  TAXABLE_SUBJECT_BUSINESS_ID, FISCAL_PARTNER_BUSINESS_ID,
} from '../../tax-forecast.constants';
import { INVESTMENT_DEDUCTION } from '../other-items/other-items.constants';

// Function which will return the object with the passed values
export const getTotalAmountsObject = (description, currentYearAmount, previousYearAmount) => ({
  description,
  currentYearAmount,
  previousYearAmount,
});

// Function which will return the company id from business details
export const checkIsVpcAdministartion = (businessId, businessDetails) => {
  if (businessDetails) {
    const matchedBusiness = businessDetails.find((businessData) => businessData.globalAdministrationId === businessId);
    return matchedBusiness?.fromVPC;
  }
  return null;
};

/** It returns array of object values from given object which consists of previous and current year amounts */
export const getArrayOfAmountsWithDescription = (obj, labels, correctionDataKeys) => Object.keys(obj).map((key) => {
  const dataObj = {
    previousYearAmount: obj[key]?.previousYearAmount || 0,
    currentYearAmount: obj[key]?.currentYearAmount || 0,
    description: labels[key],
    key,
  };
  if (key === INVESTMENT_DEDUCTION) {
    return {
      ...dataObj,
      isCorrectionDataExist: correctionDataKeys && obj[key] ? !!Object.keys(cleanDeep(obj[key][correctionDataKeys[key]])).length : false,
    };
  }
  return {
    ...dataObj,
    isCorrectionDataExist: correctionDataKeys && obj[key] ? !!obj[key][typeof correctionDataKeys !== 'string' ? correctionDataKeys[key] : correctionDataKeys]?.length : false,
  };
});

// Function can be used to set the correction input value to 0 if the value is empty or - and it will return the entered value if the entered value is other than 0 and -.
export const manageCorrection = (value) => ((value === '-' || !value) ? 0 : value);

/** Function which will update partner or taxable subject profit and loss or balancesheet or other items details for specific business */
export const getPartnerOrSubjectIncomeFromBusinessData = (businessId, dossierDetails, isPartner, labels) => {
  const fieldNamePrefix = isPartner ? labels.fiscalPartner : labels.taxableSubject;
  if (businessId && dossierDetails?.[fieldNamePrefix]) {
    return dossierDetails[fieldNamePrefix].find((obj) => obj.globalAdministrationId === businessId);
  }
  return null;
};

/** Function which will update partner or taxable subject profit and loss or balancesheet or other items details for specific business */
export const getPartnerOrSubjectUpdatedIncomeFromBusinessDetails = (dossierDetails, updatedDossierData, key, businessId, isDataFromVpc) => {
  if (businessId) {
    const partnerOrSubjectDossierData = (dossierDetails?.[key]) ? [...dossierDetails[key]] : [];
    const businessIdIndex = partnerOrSubjectDossierData.findIndex((obj) => obj.globalAdministrationId === businessId);
    const businessProfitAndLossOrBalanceSheetObject = { ...(!isDataFromVpc ? updatedDossierData[key] : updatedDossierData), globalAdministrationId: businessId };
    if (businessIdIndex > -1) {
      partnerOrSubjectDossierData[businessIdIndex] = businessProfitAndLossOrBalanceSheetObject;
      return partnerOrSubjectDossierData;
    }
    return [...partnerOrSubjectDossierData, businessProfitAndLossOrBalanceSheetObject];
  }
  return null;
};

/**
 * It returns Administrations and Sources related Id's & taxableSubject, fiscalPartner Id's and Business details
 * @param {isPartner, administrationIds, businessDetails}
 * @returns {administrationId, sourceId, hideAction, taxableSubjectBusinessId, fiscalPartnerBusinessId, fiscalPartnerOrTaxableSubjectBusinessDetails}
 * */
export const getCommonBusinessDetailsAndIds = (isPartner, administrationIds, { fiscalPartnerBusinessDetails, taxableSubjectBusinessDetails }) => {
  const administrationIdKey = isPartner ? FISCAL_PARTNER_BUSINESS_ID : TAXABLE_SUBJECT_BUSINESS_ID;
  const administrationId = administrationIds[administrationIdKey];
  const { taxableSubjectBusinessId, fiscalPartnerBusinessId } = administrationIds;
  const hideAction = isPartner ? !fiscalPartnerBusinessId : !taxableSubjectBusinessId;
  const fiscalPartnerOrTaxableSubjectBusinessDetails = isPartner ? fiscalPartnerBusinessDetails : taxableSubjectBusinessDetails;
  const sourceId = fiscalPartnerOrTaxableSubjectBusinessDetails ? fiscalPartnerOrTaxableSubjectBusinessDetails.filter((business) => business.globalAdministrationId === administrationId)[0]?.dataSourceId : null;
  const businessForm = fiscalPartnerOrTaxableSubjectBusinessDetails
    ? fiscalPartnerOrTaxableSubjectBusinessDetails.filter((business) => business.globalAdministrationId === administrationId)[0]?.businessFormId
    : null;
  return {
    administrationId,
    sourceId,
    taxableSubjectBusinessId,
    fiscalPartnerBusinessId,
    hideAction,
    fiscalPartnerOrTaxableSubjectBusinessDetails,
    businessForm,
  };
};

/** it will not show the drop down option which is already selected/added  */
export const getRemainingOptions = (values, currentIndex, options, fieldToCheck= 'description') => options.filter((option) => {
  const optionIndex = values.findIndex((value) => value[fieldToCheck] === option.value);
  /** it will written true for current slected option and options which are not selected
     * and returns false for the options which are already selected and not current option.
     */
  return optionIndex === currentIndex ? true : (optionIndex < 0);
});

/** it returns if two objects are euqal or not */
export const isEqualObjects = (newObject, oldObject) => isEqual(cleanDeep(newObject), cleanDeep(oldObject));

/** it checks whether business id is there or not in array of data */
export const containsGlobalAdministrationId = (dataArray, value) => dataArray.some((item) => item.globalAdministrationId === value);

/** returns owners array based on fiscal partner */
export const getOwners = (owners) => formatMasterData((owners.length < 3) ? [owners[0]] : owners);

export const DEFAULT_OWNER_ID = 1;
export const BOTH_OWNER_ID = 3;
export const getDefaultOwner = (owners) => (owners.length === 1 ? DEFAULT_OWNER_ID : BOTH_OWNER_ID);

/** it returns dossier data with updated allocation details based on joint declartaion field in personal details */
export const updateAllocationData = (dossierDetails, isJointDeclaration) => ({
  ...dossierDetails,
  allocationDetails: (isJointDeclaration) ? dossierDetails.allocationDetails : null,
});

import { allocationReport } from '../tax-forecast-request';
import { ALLOCATION_DATA_KEYS, DOSSIER_STATUS } from '../tax-forecast.constants';
import { cleanDeep } from '../../../common/utils';

export const getUpdatedAllocationDetails = async (dossierDetails) => {
  const recommendedAllocationFlag = dossierDetails?.allocationDetails ? !!dossierDetails?.allocationDetails?.recommendedAllocation : true;
  const updatedAllocationData = await allocationReport(recommendedAllocationFlag, { ...cleanDeep(dossierDetails) });
  if (!recommendedAllocationFlag) {
    ALLOCATION_DATA_KEYS.forEach((allocationKey) => {
      updatedAllocationData[allocationKey] = {
        ...updatedAllocationData[allocationKey],
        fiscalPartnerAmount: Number(updatedAllocationData[allocationKey].totalAmount) - Number(dossierDetails?.allocationDetails?.[allocationKey]?.taxableSubjectAmount || 0),
        taxableSubjectAmount: dossierDetails?.allocationDetails?.[allocationKey]?.taxableSubjectAmount || 0,
      };
    });
  }
  return ({
    ...dossierDetails,
    allocationDetails: { ...updatedAllocationData },
  });
};

/** returns boolean value whether dossier is locked or not */
export const isLockedDossier = (dossierStatus) => (dossierStatus !== DOSSIER_STATUS.inProgress);

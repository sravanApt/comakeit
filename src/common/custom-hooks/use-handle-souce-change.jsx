import { useCallback } from 'react';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import { incomeFromBusinessTranslate as translate } from '../../component/tax-forecast/income-from-business/income-from-business-translate';

/**
 * custom hook to handle data source change in P & L and Balance sheet
 */

 const useHandleSouceChange = (
  administrationId,
  sourceId,
  fetchVPCFinancialData,
  administrationSourceChangeParameters,
  isPartner,
  ...restDependencies
  ) => {
    const { showModal } = useModal();
    const handleSourceChange = useCallback((value) => {
      if (administrationId) {
        if (value !== sourceId) {
          showModal('delete-confirmation-modal', {
            onConfirm: () => fetchVPCFinancialData({ ...administrationSourceChangeParameters, dataSource: value }, isPartner),
            dataTa: 'override-corrections-and-values-confirmation-modal',
            modalTitle: translate('confirmation-title'),
            confirmButtonText: translate('confirmation-yes'),
            cancelButtonText: translate('confirmation-no'),
            children: translate('confirmation-question-to-update-data-source'),
          });
        } else {
          fetchVPCFinancialData({ ...administrationSourceChangeParameters, dataSource: value }, isPartner);
        }
      }
    }, [administrationId, fetchVPCFinancialData, administrationSourceChangeParameters, isPartner, ...restDependencies]);
    return handleSourceChange;
 };

 export default useHandleSouceChange;
import { ConfirmationModal } from '@visionplanner/ui-react-material';
import CreateDossierModal from '../../component/create-dossier/create-dossier-modal';
import OwnHomesModal from '../../component/tax-forecast/assets/assets-modals/own-homes-modal';
import CostsModal from '../../component/tax-forecast/assets/assets-modals/costs-modal';
import SubstantialInterestModal from '../../component/tax-forecast/assets/assets-modals/substantial-interest-modal';
import OtherPropertiesModal from '../../component/tax-forecast/assets/assets-modals/other-properties-modal';
import DividendModal from '../../component/tax-forecast/assets/assets-modals/dividend-modal';
import ExpenditureModal from '../../component/tax-forecast/expenditure/common/expenditure-modal';
import AlimonyPaidToModal from '../../component/tax-forecast/expenditure/alimony-paid-to-modal';
import AdministrationModal from '../../component/tax-forecast/income-from-business/administration-modal';
import LoansForOwnHomeModal from '../../component/tax-forecast/liabilities/loans-for-own-home-modal';
import ImportDossierModal from '../../component/tax-forecast/import-dossier-modal';
import AllocationConfirmationModal from '../../component/tax-forecast/allocation/allocation-confirmation-modal';
import ApprovalModal from '../../component/tax-forecast/approval-modal';
import ErrorDetailModal from '../../component/tax-forecast/audit-trail/error-detail-modal';
import AbroadIncomeModal from '../../component/tax-forecast/income/common/abroad-income-modal';

/**
 * An object where all modals are registered with a unique id. Every modal that needs to be displayed or hidden using modal container
 * should be registered here.
 */
const modalsList = ({
  'expenditure-modal': ExpenditureModal,
  'add-tax-dossier': CreateDossierModal,
  'add-assets-own-homes-modal': OwnHomesModal,
  'add-assets-own-homes-cost-modal': CostsModal,
  'add-assets-substantial-interest-modal': SubstantialInterestModal,
  'add-assets-other-properties-modal': OtherPropertiesModal,
  'alimony-modal': AlimonyPaidToModal,
  'delete-confirmation-modal': ConfirmationModal,
  'administration-modal': AdministrationModal,
  'loans-for-own-home-modal': LoansForOwnHomeModal,
  'dividend-modal': DividendModal,
  'import-dossier-modal': ImportDossierModal,
  'allocation-confirmation-modal': AllocationConfirmationModal,
  'approval-modal': ApprovalModal,
  'audit-trail-error-detail-modal': ErrorDetailModal,
  'income-from-abroad-modal': AbroadIncomeModal,
});

export default modalsList;

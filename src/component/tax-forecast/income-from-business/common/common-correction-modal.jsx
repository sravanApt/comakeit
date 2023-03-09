import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Form, Button, ModalBody, ModalFooter,
} from '@visionplanner/ui-react-material';
import {
  ModalWrapper, CorrectionTableWrapper,
} from '../../../../common/styled-wrapper';
import { isEqualObjects } from './utils';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { ASSETS_LIABILITIES_CHILDREN_KEYS } from '../balance-sheet/balance-sheet.constants';
import { OTHER_ITEMS_CHILD_KEYS } from '../other-items/other-items.constants';
import IntangibleFixedAssets from '../balance-sheet/intangible-fixed-assets';
import TangibleFixedAssets from '../balance-sheet/tangible-fixed-assets';
import CommonAssetsLiabilities from '../balance-sheet/common-assets-liabilities';
import Receivables from '../balance-sheet/receivables';
import ShortTermLiabilities from '../balance-sheet/short-term-liabilities';
import PartlyDeductableOrTaxExemptCosts from '../other-items/partly-deductable-costs';
import AllocationReserveCosts from '../other-items/allocation-reserve-costs';
import CessationProfit from '../other-items/cessation-profit';
import InvestmentDeduction from '../other-items/investment-deduction';
import DivestmentAddition from '../other-items/divestment-addition';

const renderCorrectionSection = (values, sectionType, parentSectionType, setFieldValue) => {
  switch (sectionType) {
    case OTHER_ITEMS_CHILD_KEYS.nonOrPartlyDeductableCost:
    case OTHER_ITEMS_CHILD_KEYS.taxationExemptComponents:
      return <PartlyDeductableOrTaxExemptCosts values={values} name="correctionData" />;
    case OTHER_ITEMS_CHILD_KEYS.equalizationReserve:
    case OTHER_ITEMS_CHILD_KEYS.reinvestmentReserve:
      return <AllocationReserveCosts values={values} name="correctionData" />;
    case OTHER_ITEMS_CHILD_KEYS.cessationProfit:
      return <CessationProfit values={values} name="correctionData" />;
    case OTHER_ITEMS_CHILD_KEYS.investmentDeduction:
      return <InvestmentDeduction values={values} name="correctionData" setFieldValue={setFieldValue} />;
    case OTHER_ITEMS_CHILD_KEYS.divestmentAddition:
      return <DivestmentAddition values={values} name="correctionData" />;
    case ASSETS_LIABILITIES_CHILDREN_KEYS.intangibleFixedAssets:
      return <IntangibleFixedAssets values={values} name="correctionData" />;
    case ASSETS_LIABILITIES_CHILDREN_KEYS.tangibleFixedAssets:
      return <TangibleFixedAssets values={values} name="correctionData" />;
    case ASSETS_LIABILITIES_CHILDREN_KEYS.financialFixedAssets:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.stockOrInventory:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.liquidAssets:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.securities:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.equityCapital:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.provisions:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.longTermLiabilities:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.shares:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.depositDetails:
    case ASSETS_LIABILITIES_CHILDREN_KEYS.withdrawalDetails:
      return <CommonAssetsLiabilities parentSectionType={parentSectionType} values={values} name="correctionData" />;
    case ASSETS_LIABILITIES_CHILDREN_KEYS.receivables:
      return <Receivables values={values} name="correctionData" />;
    case ASSETS_LIABILITIES_CHILDREN_KEYS.shortTermLiabilities:
    default:
      return <ShortTermLiabilities values={values} name="correctionData" />;
  }
};

const CommonModalWrapper = styled(ModalWrapper)`
  &.balance-sheet {
    &__tangibleAssets,
    &__shortTermLiabilities {
      .mdc-dialog__surface {
        @media (max-width: 1400px) {
          max-width: 95%;
        }
      }
    }

    &__receivables {
      .mdc-dialog__surface {
        @media (max-width: 1550px) {
          max-width: 85%;
        }
      }
    }
  }

  &.other-items__investment-deduction {
    .description-amount-section {
      .section-heading {
        padding: 0 ${({ theme }) => theme.paddings.large};
        margin-top: ${({ theme }) => theme.margins.base};
      }

      .common-data-table {
        width: auto;
      }
    }
  }
`;

/**
 * Correction Modal - Component that can be used to show correction sections
 *
 */

const CommonCorrectionModal = ({
  showModal, data, onClose, handleSubmit, title, dataTa, className, validationSchema, sectionType, parentSectionType,
}) => (
  <CommonModalWrapper
    title={`${translate('edit')} ${title}`}
    open={showModal}
    onClose={onClose}
    className={className}
    dataTa={dataTa}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={{ correctionData: data }}
      onSubmit={handleSubmit}
      dataTa={`${dataTa}-form`}
      validateFormSchema={validationSchema}
    >
      {
        ({
          values, isValid, setFieldValue,
        }) => (
          <>
            <ModalBody>
              <CorrectionTableWrapper className="forecast-section">
                <div className="common-correction-table">
                  {renderCorrectionSection(values.correctionData, sectionType, parentSectionType, setFieldValue)}
                </div>
              </CorrectionTableWrapper>
            </ModalBody>
            <ModalFooter>
              <Button type="button" className="mar-r-md" buttonType="secondary" onClick={onClose}>{translate('cancel')}</Button>
              <Button type="submit" dataTa="correction-modal-save-button" disabled={!isValid || isEqualObjects(data, values.correctionData)}>{translate('save')}</Button>
            </ModalFooter>
          </>
        )
      }
    </Form>
  </CommonModalWrapper>
);

CommonCorrectionModal.propTypes = {
  /** To show or hide the modal. */
  showModal: PropTypes.bool.isRequired,
  /** Data to display in modal */
  data: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
  /** Function which handles close event of the modal. */
  onClose: PropTypes.func.isRequired,
  /** Function that handle form submit */
  handleSubmit: PropTypes.func.isRequired,
  /** Title for display correction modal */
  title: PropTypes.string.isRequired,
  /** Provide test attribute for section */
  dataTa: PropTypes.string,
  /** Provide class name for section */
  className: PropTypes.string.isRequired,
  /** Provide form validation schema */
  validationSchema: PropTypes.object,
  /** Flag for section type to display component */
  sectionType: PropTypes.string,
};

export default CommonCorrectionModal;

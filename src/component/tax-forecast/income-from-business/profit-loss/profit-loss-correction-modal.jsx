import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {
  Form, Button, ModalBody, ModalFooter,
} from '@visionplanner/ui-react-material';
import { ModalWrapper } from '../../../../common/styled-wrapper';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import ProfitLossCorrectionTable from './profit-loss-correction-table';
import AllocationCorrectionTable from './allocation-correction-table';
import { isEqualObjects } from '../common/utils';
import { SHARES } from './profit-loss.constants';

const descriptionSchema = {
  description: Yup.string().max(500, translate('invalid-entry'))
    .test('description', translate('required-field'), function (value) {
      const { amountCorrection } = this.parent;
      return !(!value && Number(amountCorrection));
    }),
};

const validationSchema = Yup.object({
  correctionData: Yup
    .array()
    .of(Yup.object().shape({
      ...descriptionSchema,
      amountCorrection: Yup.string().test('correction-test', translate('required-field'), (value) => ((value === '0') ? true : !!Number(value))).nullable(),
    })).nullable(),
});

const sharesValidationSchema = Yup.object({
  correctionData: Yup
    .array()
    .of(Yup.object().shape({
      ...descriptionSchema,
      currentYear: Yup.object({
        correction: Yup.string().test('correction-test', translate('required-field'), (value) => ((value === '0') ? true : !!Number(value))).nullable(),
      }).nullable(),
    })).nullable(),
});
/**
 * Modal - Component that can be used to show the detail of profit - loss corrections
 *
 */

const ProfitLossCorrectionModal = ({
  showModal, data, onClose, title, handleCorrection, taxableYear, className, keys,
}) => (
  <ModalWrapper
    title={`${translate('edit')} ${title}`}
    open={showModal}
    onClose={onClose}
    dataTa="profit-loss-correction-modal"
    className={className}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={{ correctionData: [...data] }}
      onSubmit={handleCorrection}
      dataTa="tax-forecast-profit-and-loss-correction-form"
      validateFormSchema={keys.childKey === SHARES ? sharesValidationSchema : validationSchema}
    >
      {
        ({
          values, isValid,
        }) => (
          <>
            <ModalBody>
              {keys.childKey === SHARES
                ? <AllocationCorrectionTable onClose={onClose} isValid={isValid} values={values.correctionData} name="correctionData" taxableYear={taxableYear} />
                : <ProfitLossCorrectionTable onClose={onClose} isValid={isValid} values={values.correctionData} name="correctionData" taxableYear={taxableYear} />}
            </ModalBody>
            <ModalFooter>
              <Button type="button" className="mar-r-md" onClick={onClose} buttonType="secondary">{translate('cancel')}</Button>
              <Button type="submit" dataTa="correction-save-button" disabled={!isValid || isEqualObjects(data, values.correctionData)}>{translate('save')}</Button>
            </ModalFooter>
          </>
        )
      }
    </Form>
  </ModalWrapper>
);

ProfitLossCorrectionModal.propTypes = {
  /** To show or hide the model. */
  showModal: PropTypes.bool.isRequired,
  /** provide initaila data to correction modal */
  data: PropTypes.array.isRequired,
  /** Function which handles close event of the modal. */
  onClose: PropTypes.func.isRequired,
  /** Title of modal */
  title: PropTypes.string.isRequired,
  /** Function that handle correction of amount input */
  handleCorrection: PropTypes.func.isRequired,
  /** taxable year for dossier */
  taxableYear: PropTypes.number.isRequired,
  /** provides classname for component */
  className: PropTypes.string,
  /** provides key names for multiple object */
  keys: PropTypes.object,
};

export default ProfitLossCorrectionModal;

import React from 'react';
import PropTypes from 'prop-types';
import {
  ModalBody, Button, Typography, ModalFooter,
} from '@visionplanner/ui-react-material';
import { ModalWrapper } from '../../../common/styled-wrapper';
import { auditTrailTranslate as translate } from './audit-trail-translate';

/**
 * Modal to display error details
 *
 */
const ErrorDetailModal = ({
  onCloseModal, error, actionName, dataTa,
}) => (
  <ModalWrapper
    open
    title={actionName}
    onClose={onCloseModal}
    dataTa={dataTa}
    preventDismissalOnOutsideClick
  >
    <ModalBody>
      <Typography use="normal-text" className="pad-hor-lg">{ error }</Typography>
    </ModalBody>
    <ModalFooter>
      <Button
        buttonType="secondary"
        onClick={onCloseModal}
      >
        {translate('ok')}
      </Button>
    </ModalFooter>
  </ModalWrapper>
);

ErrorDetailModal.propTypes = {
  /** Function which handles close event of the modal. */
  onCloseModal: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  /** Name of the action */
  actionName: PropTypes.string.isRequired,
  /** test attribute for component */
  dataTa: PropTypes.string.isRequired,
};

export default ErrorDetailModal;

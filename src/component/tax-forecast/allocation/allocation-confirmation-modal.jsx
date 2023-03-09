import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  ModalBody, ModalFooter, Modal, Button,
} from '@visionplanner/ui-react-material';

// TODO: this will be remove after correction in common component in ui-react-material. right now, onCloseModal firing after submit also
// As per requirement need to hit while click on cancel button in modal, But present common component hitting while submit click also...

/**
 * Shows a modal dialog that asserts whether the user is sure
 * they want to proceed with the initiated action.
 */
const AllocationConfirmationModal = ({
  children,
  className = 'confirmation-modal',
  onCloseModal,
  onConfirm,
  onCancel,
  modalTitle,
  confirmButtonType,
  cancelButtonType,
  confirmButtonText,
  cancelButtonText,
  preventDismissalOnOutsideClick,
  dataTa,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleConfirm = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await onConfirm();
    } finally {
      setIsSubmitting(false);
      onCloseModal();
    }
  }, [onCloseModal, onConfirm]);

  const handleClose = useCallback(() => {
    onCancel && onCancel();
    onCloseModal();
  }, [onCloseModal, onCancel]);

  return (
    <Modal
      open
      title={modalTitle}
      onClose={onCloseModal}
      className={className}
      preventDismissalOnOutsideClick={preventDismissalOnOutsideClick}
      dataTa={dataTa}
      showCloseIcon={false}
    >
      <ModalBody>
        {children}
      </ModalBody>
      <ModalFooter>
        <Button
          buttonType={cancelButtonType}
          disabled={isSubmitting}
          dataTa="confirm-dialog-cancel"
          onClick={handleClose}
        >
          {cancelButtonText}
        </Button>
        <Button
          buttonType={confirmButtonType}
          disabled={isSubmitting}
          dataTa="confirm-dialog-submit"
          onClick={handleConfirm}
          className="mar-l-xs"
        >
          {confirmButtonText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

AllocationConfirmationModal.defaultProps = {
  confirmButtonType: 'danger',
  cancelButtonType: 'tertiary',
  onCloseModal: () => {},
};

AllocationConfirmationModal.propTypes = {
  /** Modal children  */
  children: PropTypes.node.isRequired,
  /** Class for applying styling overrides to the dialog. */
  className: PropTypes.string,
  /**
   * Callback inserted by the modal dialog container that should be invoked when the
   * dialog is closed. The callback accepts a parameter that represents the dialog result.
   */
  onCloseModal: PropTypes.func,
  /** Callback that is invoked when the user triggers the default confirm button. */
  onConfirm: PropTypes.func.isRequired,
  /** Callback that is invoked when the user triggers the default cancle/close button. */
  onCancel: PropTypes.func,
  /** Modal title  */
  modalTitle: PropTypes.string.isRequired,
  /** Confirm button text for modal */
  confirmButtonText: PropTypes.string.isRequired,
  /** Cancel button text for modal */
  cancelButtonText: PropTypes.string.isRequired,
  confirmButtonType: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  cancelButtonType: PropTypes.oneOf(['tertiary', 'secondary']),
  /** Prevent the dialog from closing when clicked outside of modal */
  preventDismissalOnOutsideClick: PropTypes.bool,
  /** attribute value of the custom data-ta attribute that can be used to locate a specific element for testing purposes */
  dataTa: PropTypes.string,
};

export default AllocationConfirmationModal;

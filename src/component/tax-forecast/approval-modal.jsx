import React, { useCallback } from 'react';
import * as Yup from 'yup';
import {
  ColumnLayout,
  Column,
  Button,
  ModalBody,
  ModalFooter,
  Alert,
  Icon,
  Typography,
  Form,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ModalWrapper, InputWrapper } from '../../common/styled-wrapper';
import { taxForecastTranslate as translate } from './tax-forecast-translate';
import { REG_EXP_EMAIL } from '../../common/constants';

const inputProps = {
  className: "text-input",
  type: "email",
};

const validationSchema = (emailsData) => Yup.object().shape({
  taxableSubjectEmailId: Yup.string()
    .required(translate('required-field'))
    .matches(REG_EXP_EMAIL, translate('invalid-entry')),
  ...(emailsData?.fiscalPartnerEmailId ? {
    fiscalPartnerEmailId: Yup.string()
    .required(translate('required-field'))
    .matches(REG_EXP_EMAIL, translate('invalid-entry')),
  }: {})
});

/**
 * Approval modal - show list of error forms or approval text
 */
const ApprovalModal = ({
  title,
  onCloseModal,
  confimationText,
  submitBtnText,
  inValidFormsList,
  className,
  submitDossier,
  confirmationEmailsForDirectSubmit,
  dataTa,
}) => {
  const handleSubmit = useCallback(async (formData) => {
    try {
      submitDossier && await submitDossier(formData);
    } finally {
      onCloseModal();
    }
  }, [onCloseModal, submitDossier]);

  return (
    <Form
      initialValues={confirmationEmailsForDirectSubmit}
      onSubmit={handleSubmit}
      dataTa={`${dataTa}-form`}
      validateFormSchema={(confirmationEmailsForDirectSubmit?.taxableSubjectEmailId) ? validationSchema(confirmationEmailsForDirectSubmit) : null}
      validateOnMount
    >
      {({ isValid, isSubmitting }) => (
        <ApprovalModalWrapper
          title={(inValidFormsList.length > 0) ? translate('errors-in-dossier') : title}
          open
          onClose={onCloseModal}
          className={className}
          preventDismissalOnOutsideClick
          dataTa={dataTa}
        >
          <>
            <ModalBody>
              {(inValidFormsList.length > 0) ? (
                <ColumnLayout dataTa="invalid-form-grid">
                  <Column span={12}>
                    <Alert
                      type="danger"
                      dataTa="invalid-dossier-alert"
                    >
                      {translate('form-error-list')}
                    </Alert>
                  </Column>
                  <Column span={12}>
                    <ul className="errors__list">
                      {/* TODO: Need to update css after getting confirmation from gaurav */}
                      {inValidFormsList.map((form) => (<li key={form}><Icon iconSet="fas" name="exclamation-triangle" className="error__icon mar-r-sm" />{form}</li>))}
                    </ul>
                  </Column>
                </ColumnLayout>
              ) : (
                <>
                  <Typography use="h6" className="pad-lg flex">{confimationText}</Typography>
                  {confirmationEmailsForDirectSubmit?.taxableSubjectEmailId && (
                    <ColumnLayout>
                      <Column span={6} className="grid-cell__label mar-b-sm">{`Email ${translate('taxable-subject-label')} *`}</Column>
                      <Column span={6} className="mar-b-sm">
                        <InputWrapper
                          {...inputProps}
                          name="taxableSubjectEmailId"
                          dataTa="taxableSubjectEmailId-input"
                        />
                      </Column>
                      {confirmationEmailsForDirectSubmit?.fiscalPartnerEmailId && (
                        <>
                          <Column span={6} className="grid-cell__label mar-b-sm">{`Email ${translate('fiscal-partner-label')} *`}</Column>
                          <Column span={6} className="mar-b-sm">
                            <InputWrapper
                              {...inputProps}
                              name="fiscalPartnerEmailId"
                              dataTa="fiscalPartnerEmailId-input"
                            />
                          </Column>
                        </>
                      )}
                    </ColumnLayout>
                  )}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button type="button" className="mar-r-sm" buttonType="secondary" onClick={onCloseModal}>{translate('cancel')}</Button>
              <Button type="submit" dataTa="send-for-approval" disabled={!!inValidFormsList.length || !isValid || isSubmitting}>{submitBtnText}</Button>
            </ModalFooter>
          </>
        </ApprovalModalWrapper>
      )}
    </Form>
  );
};

const ApprovalModalWrapper = styled(ModalWrapper)`
  &&& .mdc-dialog {
    &__surface {
      max-width: 600px;
    }

    &__content {
      padding-top: 10px;
    }
  }

  .mdc-layout-grid {
    .mdc-layout-grid__inner {
      grid-gap: 0px;

      .mdc-layout-grid__cell {

        .errors__list {
          list-style: none;

          li {
            padding: 10px;
            margin: 5px 0;
            box-shadow: 0px 1px 3px 0px #888;
            border-radius: 5px;

            .error__icon {
              color: ${({ theme }) => theme.colors.thunderBird};
            }
          }
        }
      }
    }
  }
`;

ApprovalModal.defaultProps = {
  title: 'Confiramtion',
  dataTa: 'approve-dossier',
  className: 'approve-dossier',
  confirmationEmailsForDirectSubmit: {
    taxableSubjectEmailId: '',
    fiscalPartnerEmailId: '',
  }
};

ApprovalModal.propTypes = {
  /** Specifies the title of modal */
  title: PropTypes.string,
  className: PropTypes.string,
  dataTa: PropTypes.string,
  /** Provides subject, partner email id's, used to correct before submission */
  confirmationEmailsForDirectSubmit: PropTypes.object,
  /** Provide confirmation text for modal */
  confimationText: PropTypes.string.isRequired,
  /** Provide text for submit button */
  submitBtnText: PropTypes.string.isRequired,
  /** Specifies the list of invalid forms */
  inValidFormsList: PropTypes.array.isRequired,
  /** Submit dossier data */
  submitDossier: PropTypes.func,
};

export default ApprovalModal;

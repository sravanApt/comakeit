import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import {
  Button, ModalBody, Form, ModalFooter,
} from '@visionplanner/ui-react-material';
import styled from 'styled-components';
import { assetsTranslate as translate } from '../assets-translate';
import CostsTable from './costs-table';
import { SubModalWrapper as ModalWrapper } from './dividend-modal';

const CostsModal = ({
  subModalKey, ownHomeValues, onCloseModal, title, name, handleSubModalChanges, setValues, dataTa,
}) => {
  const validationSchema = useMemo(() => Yup.object({
    [subModalKey]: Yup.array()
      .of(Yup.object()
        .shape({
          description: Yup.string().max(500, translate('invalid-entry')).nullable(),
        })).nullable(),
  }).nullable(), [subModalKey]);

  return (
    <SubModalWrapper
      title={title}
      open
      onClose={onCloseModal}
      dataTa={dataTa}
      preventDismissalOnOutsideClick
    >
      <Form
        initialValues={{ [subModalKey]: ownHomeValues[subModalKey] }}
        onSubmit={(formValues) => {
          handleSubModalChanges(subModalKey, formValues, setValues, ownHomeValues);
          onCloseModal();
        }}
        dataTa="costs-table-form"
        validateFormSchema={validationSchema}
      >
        {({ values }) => (
          <div className="tab-container">
            <div className="assets-section__table margin-zero">
              <ModalBody>
                <CostsTable
                  values={values[subModalKey] || []}
                  name={name}
                />
              </ModalBody>
              <ModalFooter>
                <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
                <Button type="submit" dataTa="annual-reserve-margin-save-button">{translate('save')}</Button>
              </ModalFooter>
            </div>
          </div>
        )}
      </Form>
    </SubModalWrapper>
  )};

const SubModalWrapper = styled(ModalWrapper)`
  &&& .assets-section__table {
    .common-data-table {
      padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large} 0 ${({ theme }) => theme.paddings.large};

      .table-footer {
        color: ${({ theme }) => theme.currencyText};
        font-size: ${({ theme }) => theme.fontSizes.fs18};
        text-align: right;
      }
    }
  }

  &&& .mdc-dialog {
    &__surface {
      min-width: 400px;
    }

    &__content {
      padding: 0;
    }
  }
`;

CostsModal.propTypes = {
  /** sub modal key to access specific sub modal data like cost of rental, rental income etc. */
  subModalKey: PropTypes.string.isRequired,
  /** object containing own homes data */
  ownHomeValues: PropTypes.object.isRequired,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** title of the modal */
  title: PropTypes.string.isRequired,
  /** field name prefix for the form */
  name: PropTypes.string.isRequired,
  /** function to save/handle sub modal data  */
  handleSubModalChanges: PropTypes.func.isRequired,
  /** callback function to update the sub modal values in the own home main object   */
  setValues: PropTypes.func.isRequired,
  /** provides test attribute for component */
  dataTa: PropTypes.string.isRequired,
};

export default CostsModal;

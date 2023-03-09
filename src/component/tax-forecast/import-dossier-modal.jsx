import React, { useState, useEffect } from 'react';
import {
  Form, ColumnLayout, Column, Button, ModalBody, ModalFooter, FieldSet, Alert,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  ModalWrapper,
} from '../../common/styled-wrapper';
import { taxForecastTranslate as translate } from './tax-forecast-translate';
import { getDossierList } from '../create-dossier/create-dossier.request';
import { formatMasterData } from '../../common/utils';

/**
 * Import dossier modal.
 */
const ImportDossierModal = ({
  title, onCloseModal, taxationYear, globalAdviserId, globalClientId, currentDossierId, handleImportClick, className, dataTa = 'import-dossier',
}) => {
  const [dossierList, setDossierList] = useState(null);

  useEffect(() => {
    const fetchDossiers = async () => {
      const dossiers = await getDossierList(
        globalClientId,
        {
          globalAdviserId,
          taxationYear,
        },
      );
      setDossierList(dossiers.filter((dossier) => dossier.value !== currentDossierId.toString()));
    };
    fetchDossiers();
  }, [currentDossierId, globalAdviserId, globalClientId, taxationYear]);

  return (
    dossierList && (
      <ImportDossierModalWrapper
        title={title}
        open
        onClose={onCloseModal}
        className={className}
        preventDismissalOnOutsideClick
      >
        <Form
          initialValues={{ copyGlobalDossierID: null }}
          onSubmit={(formValues) => {
            handleImportClick(formValues);
            onCloseModal();
          }}
          dataTa={`${dataTa}-form`}
        >
          {
            ({
              isDirty,
            }) => (
              <>
                <ModalBody>
                  <ColumnLayout>
                    <Column span={12}>
                      <Alert
                        type="danger"
                        dataTa="import-dossier-alert"
                      >
                        {translate('import-warning-text')}
                      </Alert>
                    </Column>
                    <Column span={12}>
                      <FieldSet
                        type="selectOne"
                        controlType="buttongroup"
                        name="copyGlobalDossierID"
                        options={formatMasterData(dossierList)}
                        dataTa="copy-dossier-id"
                        orientation="vertical"
                        className="dossier-group"
                      />
                    </Column>
                  </ColumnLayout>
                </ModalBody>
                <ModalFooter>
                  <Button type="button" className="mar-r-sm" buttonType="secondary" onClick={onCloseModal}>{translate('cancel')}</Button>
                  <Button type="submit" dataTa="import-dossier-save-button" buttonType="primary" disabled={!isDirty}>{translate('import-save')}</Button>
                </ModalFooter>
              </>
            )}
        </Form>
      </ImportDossierModalWrapper>
    )
  );
};

const ImportDossierModalWrapper = styled(ModalWrapper)`
  .mdc-layout-grid {
    padding-top: 0px;

    .mdc-layout-grid__inner {
      grid-gap: 0px;

      .mdc-layout-grid__cell {
        .dossier-group {
          margin: 0;
        }
      }
    }
  }
`;

ImportDossierModal.propTypes = {
  /** Specifies the title of modal */
  title: PropTypes.string,
  className: PropTypes.string,
  dataTa: PropTypes.string,
  /** Specifies the logged in adviser */
  globalAdviserId: PropTypes.string.isRequired,
  /** taxable subject id */
  globalClientId: PropTypes.string.isRequired,
  /** taxation year */
  taxationYear: PropTypes.number.isRequired,
  /** function to handle import click */
  handleImportClick: PropTypes.func.isRequired,
};

export default ImportDossierModal;

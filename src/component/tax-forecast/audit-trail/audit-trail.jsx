import React, {
  useEffect, useContext, useState, useMemo,
} from 'react';
import { withTheme } from 'styled-components';
import { DataTable, Button } from '@visionplanner/ui-react-material';
import {
  StickyContainer, useModal, useAsyncCallback,
} from '@visionplanner/vp-ui-fiscal-library';
import { auditTrailTranslate as translate } from './audit-trail-translate';
import {
  STICKY_CUSTOM_STYLES, STICKY_ROWS,
} from '../tax-forecast.constants';
import TaxForecastHeading from '../tax-forecast-heading';
import TaxForecastContext from '../tax-forecast-context';
import * as requests from './audit-trail.request';
import { dateToDayMonthAndYearString } from '../../../common/utils';

const colTemplate = [
  {
    id: 21,
    label: translate('action'),
  },
  {
    id: 22,
    label: translate('taxable-subject'),
  },
  {
    id: 23,
    label: translate('date-time'),
  },
  {
    id: 24,
    label: translate('user'),
  },
  {
    id: 32,
    label: translate('error-details'),
  },
];

/**
  * Audit Trial - Display information of all dossier actions
  */

const AuditTrail = ({ theme, location }) => {
  const [auditTrailList, setAuditTrailList] = useState([]);
  const {
    dossierData: {
      dossierManifest: { dossierId },
    },
  } = useContext(TaxForecastContext);

  const { showModal } = useModal();
  const fetchAuditTrail = useAsyncCallback(async () => {
    const { actionItems } = await requests.getAuditTrail(dossierId);
    setAuditTrailList(actionItems || []);
  }, [dossierId]);

  useEffect(() => {
    fetchAuditTrail();
  }, [fetchAuditTrail]);

  const rowTemplate = useMemo(() => ({
    action: ({ actionName }) => actionName,
    name: ({ name }) => (name || '-'),
    date: ({ lastModified }) => lastModified && dateToDayMonthAndYearString(lastModified, 'DD-MM-YYYY hh:mm:ss'),
    user: ({ user }) => user,
    error: ({ error, actionName, index }) => (error
      ? (
        <Button
          buttonType="secondary"
          onClick={() => {
            showModal('audit-trail-error-detail-modal', {
              error,
              actionName,
              dataTa: 'error-detail-modal',
            });
          }}
          dataTa={`view-button${index}`}
        >
          {translate('view')}
        </Button>
      ) : '-'),
  }), [showModal]);

  return (
    <>
      <StickyContainer
        customStyles={{
          ...STICKY_CUSTOM_STYLES,
          borderBottom: `1px solid ${theme.inputBorder}`,
        }}
        stickyContent={(
          <div className="flex-1">
            <TaxForecastHeading
              heading={translate('audit-trail')}
              location={location}
            />
          </div>
        )}
      >
        <DataTable
          columnGroups={colTemplate}
          rowTemplate={rowTemplate}
          rows={auditTrailList}
          stickyRows={STICKY_ROWS}
          dataTa="audit-trail-table"
        />
      </StickyContainer>
    </>
  );
};

export default withTheme(AuditTrail);

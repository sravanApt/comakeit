import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Alert } from '@visionplanner/ui-react-material';
import { BreadCrumbs } from '@visionplanner/vp-ui-fiscal-library';
import TaxForecastContext from './tax-forecast-context';
import { taxForecastTranslate as translate } from './tax-forecast-translate';
import { AUTO_SYNC_STATUSES } from './tax-forecast.constants';

const COMMON_DOSSIERS = 'common_dossiers';

const TaxForecastHeading = ({ heading, location }) => {
  const source = new URLSearchParams(location?.search).get('source');
  const {
    dossierData: {
      personalDetails: { taxableSubjectDetails: { fullName, taxableSubjectId } },
      dossierManifest: { name },
    },
    autoSyncStatus,
  } = useContext(TaxForecastContext);

  const navItems = useMemo(() => (source === COMMON_DOSSIERS
    ? [
      {
        link: '/tax/dossiers',
        text: translate('dossiers'),
        useSpa: true,
      },
      {
        link: `/taxable-subject/${taxableSubjectId}/dossiers?source=${source}`,
        text: fullName,
      },
      {
        text: name,
      },
    ] : [
      {
        link: '/tax',
        text: translate('taxable-subjects'),
        useSpa: true,
      },
      {
        link: `/taxable-subject/${taxableSubjectId}/dossiers`,
        text: fullName,
      },
      {
        text: name,
      },
    ]), [fullName, name, source, taxableSubjectId]);

  return (
    <>
      { autoSyncStatus === AUTO_SYNC_STATUSES.IN_PROCESS && (
        <Alert
          type="warning"
          dataTa="auto-sync-in-process-alert"
        >
          {translate('auto-sync-in-process')}
        </Alert>
      )}
      { autoSyncStatus === AUTO_SYNC_STATUSES.COMPLETED && (
        <Alert
          type="info"
          className="auto-sync-success"
          dataTa="auto-sync-success-alert"
        >
          {translate('sync-completed')}
        </Alert>
      )}
      <BreadCrumbs
        navItems={navItems}
      />
      <Typography use="h3" className="flex">
        {heading}
      </Typography>
    </>
  );
};

TaxForecastHeading.propTypes = {
  /** provide heading for tax forecast component */
  heading: PropTypes.string.isRequired,
};

export default TaxForecastHeading;

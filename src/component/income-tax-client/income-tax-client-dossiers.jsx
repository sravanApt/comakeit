import React, { useContext } from 'react';
import styled from 'styled-components';
import {
  DataTable, Typography, Tooltip, SkeletonLoader,
} from '@visionplanner/ui-react-material';
import {
  useDataTableParams,
  NavigationLinkWithTooltip,
  useModal,
  useAsyncCallback,
} from '@visionplanner/vp-ui-fiscal-library';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import IncomeTaxClientActionSection from './income-tax-client-action-section';
import { MONITOR_BATCH_SIZE } from '../../common/constants';
import {
  DOSSIER_COLUMN_GROUP,
  LAST_MODIFIED,
  DOSSIER_IN_PROGRESS_STATUS,
} from './income-tax-client-constants';
import * as requests from './income-tax-client.request';
import { dateToDayMonthAndYearString } from '../../common/utils';
import TaxableSubjectContext from './taxable-subject-context';
import { IconWrapper } from '../../common/styled-wrapper';

const NameWrapper = styled(NavigationLinkWithTooltip)`
  color: ${({ theme }) => theme.primary};
`;

const DataTableWrapper = styled.div`
  {
    height: 100%;
    width: 100%;

    .common-table {
      &-header__cell {
        color: ${({ theme }) => theme.currencyText};
        font-size: ${({ theme }) => theme.fontSizes.fs12};
        font-weight: 500;
      }

      &__header {
        border: 1px solid ${({ theme }) => theme.tableBorderColor};
      }

      &__content {
        border: none;
        width: 100%;
      }
    }
  }
`;

/**
 * Tax Dossier Monitor - Component that can be used to display the list of tax dossiers of taxable subject
 *
 */
const IncomeTaxClientDossiers = ({
  history,
  match: { params: { globalClientId } },
  location: { search },
}) => {
  const { globalAdviserId } = useContext(TaxableSubjectContext);
  const { showModal } = useModal();

  const dossierRowTemplate = {
    dossierName: ({ dossierName, globalDossierId }) => (
      <NameWrapper
        to={`/${globalClientId}/forecast/${globalDossierId}${search}`}
        tooltipMessage={dossierName}
        tooltipPlacement="topLeft"
      >
        {dossierName}
      </NameWrapper>
    ),
    dossierType: ({ dossierType }) => dossierType,
    period: ({ period }) => period,
    version: ({ version }) => version,
    status: ({ status }) => status,
    lastModified: ({ lastModified }) => dateToDayMonthAndYearString(lastModified),
    actions: ({ globalDossierId, status }) => (
      <Tooltip overlay={translate('delete')} placement="right">
        <IconWrapper
          icon="trash"
          className="icon__actions icon__actions--remove"
          dataTa={`delete-dossier-${globalDossierId}`}
          disabled={status !== DOSSIER_IN_PROGRESS_STATUS}
          onClick={() => (status === DOSSIER_IN_PROGRESS_STATUS) && showModal('delete-confirmation-modal', {
            onConfirm: () => deleteDossier(globalDossierId),
            dataTa: 'delete-dossier-modal',
            modalTitle: translate('confirmation-title'),
            confirmButtonText: translate('confirmation-yes'),
            cancelButtonText: translate('confirmation-no'),
            children: translate('confirmation-question'),
          })}
        />
      </Tooltip>
    ),
  };
  const getDataFunction = useAsyncCallback(
    (queryParameters) => requests.getDossierList(globalClientId, queryParameters),
    [globalClientId],
    { displayLoader: false },
  );

  const {
    applyFilters,
    sortColumn,
    sortDirection,
    onSortColumn,
    dataCacheKey,
    rows,
    setRows,
    loadBatchOfRows,
    clearParamsAndRefresh,
    createFilter,
    filterOperations,
  } = useDataTableParams(getDataFunction, {
    initialSort: [LAST_MODIFIED],
  });

  const handleFilters = ({ selectedStatus, selectedDossierType, selectedPeriod }) => {
    applyFilters([
      createFilter(filterOperations.in, 'dossierStatusId', selectedStatus.join()),
      createFilter(filterOperations.in, 'dossierTypeId', selectedDossierType.join()),
      createFilter(filterOperations.in, 'periodId', selectedPeriod.join()),
    ]);
  };

  const handleOnDossierSave = (globalDossierId) => history.push(`/${globalClientId}/forecast/${globalDossierId}`);

  const deleteDossier = useAsyncCallback(async (globalDossierId) => {
    await requests.deleteDossierData(globalClientId, globalDossierId);
    clearParamsAndRefresh();
  }, [globalClientId]);

  return (
    <>
      <Typography use="h3" className="align-self-start">
        {translate('dossiers')}
      </Typography>
      <IncomeTaxClientActionSection
        globalAdviserId={globalAdviserId}
        globalClientId={globalClientId}
        handleFilters={handleFilters}
        handleSearch={applyFilters}
        handleOnDossierSave={handleOnDossierSave}
      />
      <DataTableWrapper
        className="tax-dossier-monitor"
        data-ta="tax-dossier-monitor-table"
      >
        <DataTable
          dataTa="client-dossier-monitor"
          dataCacheKey={dataCacheKey}
          columnGroups={DOSSIER_COLUMN_GROUP}
          rowTemplate={dossierRowTemplate}
          loadBatchOfRows={loadBatchOfRows}
          minimumBatchSize={MONITOR_BATCH_SIZE}
          rows={rows}
          setRows={setRows}
          onHeaderClick={onSortColumn}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          infiniteScroll
          loadingIndicator={<SkeletonLoader />}
        />
      </DataTableWrapper>
    </>
  );
};

export default IncomeTaxClientDossiers;

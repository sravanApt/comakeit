import React, {
  useState, useContext, useEffect, useMemo,
} from 'react';
import styled from 'styled-components';
import {
  ColumnLayout, Column, DataTable, Button, Typography,
} from '@visionplanner/ui-react-material';
import { StickyContainer, useModal } from '@visionplanner/vp-ui-fiscal-library';
import { IconWrapper } from '../../../common/styled-wrapper';
import { incomeFromBusinessTranslate as translate } from './income-from-business-translate';
import IncomeFromBusinessHeading from './common/income-from-business-heading';
import TaxAmount from './common/tax-amount';
import { dateToDayMonthAndYearString } from '../../../common/utils';
import TaxForecastContext from '../tax-forecast-context';
import { STICKY_ROWS, STICKY_CLOUMNS, DOSSIER_SUBMIT_STATUS } from '../tax-forecast.constants';

const dateFormat = 'DD-MM-YYYY';
const colTemplate = [
  {
    id: 21,
    label: translate('name'),
  },
  {
    id: 22,
    label: translate('visionplanner-administration'),
  },
  {
    id: 23,
    label: translate('business-activities'),
  },
  {
    id: 24,
    label: translate('legal-form'),
  },
  {
    id: 32,
    label: translate('Partnership-label'),
  },
  {
    id: 25,
    label: translate('start-fiscal-year'),
  },
  {
    id: 26,
    label: translate('end-fiscal-year'),
  },
  {
    id: 27,
    label: translate('country'),
  },
  {
    id: 28,
    label: translate('start-date-of-business'),
  },
  {
    id: 29,
    label: translate('end-date-of-business'),
  },
  {
    id: 30,
    label: translate('RSIN'),
  },
  {
    id: 31,
    label: translate('actions'),
  },
];
/**
  * Tax Forecast - Income From Business - It renders IncomeFromBusiness Administration table...
  *
  */

const IncomeFromBusiness = ({ className, location }) => {
  const [administrationsList, setAdministrationList] = useState([]);
  const {
    dossierData: {
      businessDetails: {
        fiscalPartnerBusinessDetails,
        taxableSubjectBusinessDetails,
      },
      dossierManifest: {
        declarationStatusId,
      },
    },
    setAdministrationIds,
    isPartner,
    removeAdministration,
    dossierData, countries, saveDossierDetails, globalAdviserId,
    dossierData: {
      dossierManifest: { taxableYear, declarationTypeId },
      declarationID,
      businessDetails,
      personalDetails: {
        taxableSubjectDetails: { taxableSubjectId },
      },
    },
    administrationIds,
    fetchVPCFinancialData,
  } = useContext(TaxForecastContext);

  useEffect(() => {
    const administrations = isPartner ? fiscalPartnerBusinessDetails : taxableSubjectBusinessDetails;
    setAdministrationList(administrations || []);
  }, [fiscalPartnerBusinessDetails, isPartner, taxableSubjectBusinessDetails]);

  const { showModal } = useModal();

  const rowTemplate = useMemo(() => ({
    businessName: ({ businessName, globalAdministrationId, index }) => <a className="business-name" data-ta={`business-name${index}`} onClick={() => setAdministrationIds(globalAdministrationId, true)}>{ businessName }</a>,
    vpBusinessName: ({ vpBusinessName }) => <>{ vpBusinessName || '-' }</>,
    businessActivities: ({ businessActivities }) => businessActivities,
    businessForm: ({ businessFormName }) => businessFormName,
    businessPartnerName: ({ businessPartnerName }) => businessPartnerName,
    startFiscalYear: ({ fiscalYearStartDate }) => fiscalYearStartDate && dateToDayMonthAndYearString(fiscalYearStartDate, 'DD-MM'),
    endFiscalYear: ({ fiscalYearEndDate }) => fiscalYearEndDate && dateToDayMonthAndYearString(fiscalYearEndDate, 'DD-MM'),
    countryName: ({ countryName }) => countryName,
    businessStartDate: ({ businessStartDate }) => businessStartDate && dateToDayMonthAndYearString(businessStartDate, dateFormat),
    businessEndDate: ({ businessEndDate }) => businessEndDate && dateToDayMonthAndYearString(businessEndDate, dateFormat),
    rsin: ({ rsin }) => rsin,
    actions: ({ globalAdministrationId, index }) => (
      <>
        <IconWrapper
          icon="pen"
          iconSet="fas"
          className="icon__edit edit mar-hor-xs"
          dataTa={`edit-${index}`}
          disabled={declarationStatusId === DOSSIER_SUBMIT_STATUS}
          onClick={() => (declarationStatusId !== DOSSIER_SUBMIT_STATUS) && showModal('administration-modal', {
            isEditMode: true,
            administrationId: globalAdministrationId,
            contextData: {
              dossierData,
              saveDossierDetails,
              globalAdviserId,
              countries,
              isPartner,
              fetchVPCFinancialData,
              administrationIds,
              businessDetails,
              declarationID,
              taxableYear,
              declarationTypeId,
              taxableSubjectId,
            },
            className: 'styled-grid-modal',
            dataTa: 'edit-administration-modal',
          })}
        />
        <IconWrapper
          icon="trash"
          className="icon__actions icon__actions--remove  mar-hor-xs"
          disabled={declarationStatusId === DOSSIER_SUBMIT_STATUS}
          onClick={() => (declarationStatusId !== DOSSIER_SUBMIT_STATUS) && showModal('delete-confirmation-modal', {
            onConfirm: () => removeAdministration(globalAdministrationId, isPartner),
            dataTa: 'delete-administration-modal',
            modalTitle: translate('confirmation-title'),
            confirmButtonText: translate('confirmation-yes'),
            cancelButtonText: translate('confirmation-no'),
            children: translate('confirmation-question'),
          })}
        />
      </>
    ),
  }), [countries, declarationStatusId, dossierData, globalAdviserId, isPartner, removeAdministration, saveDossierDetails, setAdministrationIds, showModal]);

  return (
    <IncomeFromBusinessWrapper className={`${className} income-from-business`}>
      <TaxAmount />
      <StickyContainer
        stickyContent={(
          <IncomeFromBusinessHeading
            heading={translate('income-from-business')}
            location={location}
          />
        )}
      >
        <div className="tab-container">
          <div className="pad-t-md" data-ta="income-from-business-section">
            <ColumnLayout>
              <Column span={8}>
                <Typography use="h6">{translate('business-details')}</Typography>
              </Column>
              <Column span={4} className="text-align-right">
                <Button
                  buttonType="secondary"
                  className="add-administration-button"
                  onClick={() => showModal('administration-modal', {
                    contextData: {
                      dossierData,
                      saveDossierDetails,
                      globalAdviserId,
                      countries,
                      isPartner,
                      taxableYear,
                    },
                    dataTa: 'add-administration-modal',
                    className: 'styled-grid-modal',
                  })}
                  dataTa="add-administration"
                >
                  {`+ ${translate('business')}`}
                </Button>
              </Column>
              {!!administrationsList.length && (
                <Column span={12}>
                  <DataTable
                    columnGroups={colTemplate}
                    rowTemplate={rowTemplate}
                    rows={administrationsList}
                    stickyRows={STICKY_ROWS}
                    stickyColumns={STICKY_CLOUMNS}
                  />
                </Column>
              )}
            </ColumnLayout>
          </div>
        </div>
      </StickyContainer>
    </IncomeFromBusinessWrapper>
  );
};

export default IncomeFromBusiness;

const IncomeFromBusinessWrapper = styled.div`
  && .common-data-table {
    display: block;

    &__head-cell {
      padding: ${({ theme }) => theme.paddings.medium};
    }

    &__body {
      .common-data-table__row {
        &:hover {
          background: none;
        }

        .business-name {
          cursor: pointer;
        }

        .icon__edit,
        .icon__actions {
          display: inline;
        }
      }
    }

    &.rmwc-data-table--sticky-rows-1 .common-data-table__head .common-data-table__row:nth-child(-n + 1) .common-data-table__cell {
      border: none;
      box-shadow: 0 0 0 1px ${({ theme }) => theme.secondaryBorder};
    }
  }
`;

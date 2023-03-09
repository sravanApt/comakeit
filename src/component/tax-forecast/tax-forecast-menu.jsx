import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  Drawer, MenuSurface, Typography, Icon,
} from '@visionplanner/ui-react-material';
import { taxForecastTranslate as translate } from './tax-forecast-translate';
import {
  DOSSIER_ACTIONS_OPTIONS,
  PROVISIOANL_IB_DECLARATION_DOSSIER_TYPES,
  REOPEN_CHECK_DECLARATION_STATUS,
  LOCK_DOSSIER_CHECK_STATUS,
} from './tax-forecast.constants';
import { PROGNOSE_VALUE } from '../create-dossier/create-dossier-constants';
import { isLockedDossier } from './common/utils';
import { BUSINESS_DETAILS_KEYS_ARRAY } from './income-from-business/entrepreneur/entrepreneur.constants';

export const getForcastMenuSections = (matchUrl, fiscalData, search, tabIndex) => {
  const isJointWithPartner = fiscalData?.personalDetails?.isJointDeclaration;
  const showBusinessMenuList = fiscalData?.businessDetails[`${BUSINESS_DETAILS_KEYS_ARRAY[tabIndex]}`]
  && fiscalData?.businessDetails[`${BUSINESS_DETAILS_KEYS_ARRAY[tabIndex]}`].length;
  return ([
    {
      id: 1,
      value: `${matchUrl}/general-information${search}`,
      label: translate('general-information'),
    },
    {
      id: 2,
      value: `${matchUrl}/personal-details${search}`,
      label: translate('personal-details'),
    },
    {
      id: 3,
      value: `${matchUrl}/income-from-business${search}`,
      label: translate('income-from-business'),
      children: showBusinessMenuList ? [
        {
          id: 1,
          value: `${matchUrl}/profit-and-loss${search}`,
          label: translate('profit-and-loss'),
        },
        {
          id: 2,
          value: `${matchUrl}/balance-sheet${search}`,
          label: translate('balance-sheet'),
        },
        {
          id: 3,
          value: `${matchUrl}/other-items${search}`,
          label: translate('other-items'),
        },
        {
          id: 4,
          value: `${matchUrl}/entrepreneur${search}`,
          label: translate('entrepreneur-allowance'),
        },
      ] : [],
    },
    {
      id: 4,
      value: `${matchUrl}/income${search}`,
      label: translate('income'),
    },
    {
      id: 5,
      value: `${matchUrl}/expenditure${search}`,
      label: translate('expenditure'),
    },
    {
      id: 6,
      value: `${matchUrl}/assets${search}`,
      label: translate('assets'),
    },
    {
      id: 7,
      value: `${matchUrl}/liabilities${search}`,
      label: translate('liabilities'),
    },
    {
      id: 8,
      value: `${matchUrl}/additional-calculation-information${search}`,
      label: translate('additional-calculation-information'),
    },
    ...(isJointWithPartner ? [{
      id: 9,
      value: `${matchUrl}/allocation${search}`,
      label: translate('allocation'),
    }] : []),
    {
      id: 10,
      value: `${matchUrl}/summary${search}`,
      label: translate('summary'),
    },
    {
      id: 11,
      value: `${matchUrl}/audit-trail${search}`,
      label: translate('audit-trail'),
    },
  ]);
};

export const TaxForecastMenu = styled(Drawer)`
  position: fixed;
  .mdc-drawer {
    &__content {
      height: 70%;

      .mdc-list-item {
        color: ${({ theme }) => theme.primary};
        font-family: ${({ theme }) => theme.fontStyles.body};
        letter-spacing: 0;
      }
    }
  }

  &.forecast-menu {
    .mdc-drawer__title {
      &::before,
      &::after {
        height: 0;
      },
      &:: after {
        vertical-align: 0;
      }
    }
  }
`;

const MenuTitleWrapper = styled(Typography)`
  display: flex;

  .dossier-title {
    flex: 1;
  }

  .lock__icon {
    cursor: unset;
  }

  .mdc-menu-surface--anchor {

    .mdc-menu-surface {
      left: -165px !important;
      min-width: 180px;

      span {
        cursor: pointer;
        font-weight: 500;
        font-size: ${({ theme }) => theme.fontSizes.fs14};
      }
    }
  }

  .menu-options {
    align-items: center;
    justify-content: space-between;
  }
`;

export const TaxForecastMenuTitle = ({
  title, handleImport, handleReopen, declarationTypeId, declarationStatusId,
}) => {
  const showImportDossierOption = useMemo(() => (declarationTypeId !== PROGNOSE_VALUE), [declarationTypeId]);
  const showReopenDossierOption = useMemo(() => (REOPEN_CHECK_DECLARATION_STATUS.includes(declarationStatusId) && PROVISIOANL_IB_DECLARATION_DOSSIER_TYPES.includes(declarationTypeId)), [declarationStatusId, declarationTypeId]);
  const isDossierLocked = useMemo(() => isLockedDossier(declarationStatusId), [declarationStatusId]);
  const lockIconName = useMemo(() => ((LOCK_DOSSIER_CHECK_STATUS.includes(declarationStatusId) || isDossierLocked) ? 'lock-alt' : 'lock-open-alt'), [declarationStatusId]);

  return (
    <MenuTitleWrapper use="h6">
      <div className="dossier-title">
        {title}
      </div>
      <Icon iconSet="fas" name={lockIconName} className="mar-hor-sm mar-ver-xs lock__icon" />
      {(showReopenDossierOption || (showImportDossierOption && !isDossierLocked)) && (
        <MenuSurface
          className="menu-surface"
          handle={
            (
              <Icon iconSet="fas" name="ellipsis-h" dataTa="dossier-actions-icon" />
            )
          }
          position="bottomLeft"
        >
          {showImportDossierOption && !isDossierLocked && (
            <span className="flex pad-ver-sm menu-options" key={DOSSIER_ACTIONS_OPTIONS[0].label} data-ta={`header-list-item${DOSSIER_ACTIONS_OPTIONS[0].value}`} role="presentation" onClick={() => handleImport && handleImport()}>
              {DOSSIER_ACTIONS_OPTIONS[0].label}
              <Icon iconSet="far" name="download" dataTa="import-icon" className="pad-l-sm" />
            </span>
          )}
          {showReopenDossierOption && (
            <span className="flex pad-ver-sm menu-options" key={DOSSIER_ACTIONS_OPTIONS[1].label} data-ta={`header-list-item${DOSSIER_ACTIONS_OPTIONS[1].value}`} role="presentation" onClick={() => handleReopen && handleReopen()}>
              {DOSSIER_ACTIONS_OPTIONS[1].label}
              <Icon iconSet="far" name="lock-open-alt" dataTa="reopen-icon" className="pad-l-sm" />
            </span>
          )}
        </MenuSurface>
      )}
    </MenuTitleWrapper>
  );
};

TaxForecastMenuTitle.propTypes = {
  /** Title for menu */
  title: PropTypes.string.isRequired,
  /** Handles import dossier functionality */
  handleImport: PropTypes.func,
  /** Handles reopen dossier functionality */
  handleReopen: PropTypes.func,
  /** Declaration type id */
  declarationTypeId: PropTypes.number.isRequired,
  /** Declaration status id */
  declarationStatusId: PropTypes.number.isRequired,
};

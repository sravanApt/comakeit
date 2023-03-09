import React, { useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useDataSource, BusyIndicator, BreadCrumbs } from '@visionplanner/vp-ui-fiscal-library';
import { TaxForecastMenu } from '../tax-forecast/tax-forecast-menu';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import GeneralInformation from './general-information';
import IncomeTaxClientDossiers from './income-tax-client-dossiers';
import { getTaxableSubjectDetails } from '../../common/global-requests';
import TaxableSubjectContext from './taxable-subject-context';
import { getGlobalAdvisorId } from '../../common/utils';

const getSideBarMenuItems = (matchUrl, currentPath, search) => ([
  {
    id: 1,
    value: `${matchUrl}/monitor${search}`,
    label: translate('dossiers'),
    disabled: currentPath === `${matchUrl}/monitor${search}`,
  },
  {
    id: 1,
    value: `${matchUrl}/general-information${search}`,
    label: translate('general-information'),
    disabled: currentPath === `${matchUrl}/general-information${search}`,
  },
]);

/**
 * Income Tax Client Container Section display dossier-monitor and general info tabs based on tab selection
 *
 */
const COMMON_DOSSIERS = 'common_dossiers';

const IncomeTaxClientContainer = ({
  match,
  history,
  auth,
  location: { search },
}) => {
  const menuItems = useMemo(() => getSideBarMenuItems(match.url, history.location.pathname, search), [match.url, history.location.pathname, search]);
  const getTaxableSubjectData = useCallback(() => getTaxableSubjectDetails(match.params.globalClientId), [match.params.globalClientId]);
  const [subjectData, refreshSubjectData] = useDataSource(getTaxableSubjectData);
  const source = new URLSearchParams(search).get('source');

  const updateTaxableSubjectContext = useCallback((data) => {
    refreshSubjectData(data);
  }, [refreshSubjectData]);

  const globalAdviserId = useMemo(() => getGlobalAdvisorId(auth?.userProfile), [auth]);
  const navigationlink = source === COMMON_DOSSIERS ? '/tax/dossiers' : '/tax';
  const navigationText = source === COMMON_DOSSIERS ? translate('dossiers') : translate('taxable-subjects');

  return (
    <ContainerSection className="main-container">
      <TaxForecastMenu
        title={null}
        menuList={menuItems}
        handleClick={(item) => history.push(item.value)}
        dataTa="dossier-sidebar-menu"
        activeMenu={`${history.location.pathname}${search}`}
      />
      {
        subjectData ? (
          <div className="main-section main-section--container" data-ta="tax-dossier-container">
            <BreadCrumbs
              navItems={[
                {
                  link: navigationlink,
                  text: navigationText,
                  useSpa: true,
                },
                {
                  text: `${subjectData.firstName} ${subjectData.middleName} ${subjectData.lastName}`,
                },
              ]}
            />
            <TaxableSubjectContext.Provider
              value={{
                taxableSubjectData: subjectData,
                updateTaxableSubjectContext,
                globalAdviserId,
              }}
            >
              <Switch>
                <Route path={`${match.path}/monitor`} component={IncomeTaxClientDossiers} />
                <Route path={`${match.path}/general-information`} component={GeneralInformation} />
                <Route>
                  <Redirect to={`${match.url}/monitor${search}`} />
                </Route>
              </Switch>
            </TaxableSubjectContext.Provider>
          </div>
        ) : <BusyIndicator />
      }
    </ContainerSection>
  );
};

export default IncomeTaxClientContainer;

const ContainerSection = styled.section`
  &&& .main-section--container {
    margin-left: 265px;
    padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large} 0;
  }

  &&& .mdc-typography--headline3 {
    font-family: ${({ theme }) => theme.fontStyles.title};
    line-height: 3.125rem;
  }

  .dossier-filters-container {
    width: 450px;
  }

  .add-dossier-button {
    min-height: 36px;
    height: auto;
  }

  .general-info-form {
    width: 80%;

    .mdc-layout-grid {
      padding: ${({ theme }) => theme.paddings.base} 0;
    }

    .gender-group {
      margin-left: -${({ theme }) => theme.margins.base};
    }
  }
`;

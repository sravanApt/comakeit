import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Sticky } from 'react-sticky';
import {
  ColumnLayout, Column, Autocomplete, ColumnInner,
} from '@visionplanner/ui-react-material';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import TaxForecastContext from '../../tax-forecast-context';
import { AUTO_SYNC_STATUSES } from '../../tax-forecast.constants';
import { formatMasterData } from '../../../../common/utils';

const selectProps = {
  placeholder: translate('select'),
  type: 'selectOne',
  controlType: 'autocomplete',
  hideSelectedOptions: false,
};

const SectionWrapper = styled.div`
  .data-source-select {
    .react-select {
      float: right;
    }
  }

  &&& .react-select {
    width: 260px;

    &__control {
      border-color: ${({ theme }) => theme.inputBorder};

      &:hover,
      &--is-focused {
        border-color: ${({ theme }) => theme.inputFocus};
      }
    }

    &__placeholder {
      color: ${({ theme }) => theme.currencyText};
    }
  }
`;

/**
  * Tax Forecast - Profit & Loss - Display Administration section
  *
  */

const AdministrationsAndSources = ({
  administration, source, hideSource, handleAdministrationChange, handleSourceChange, className, disableSource,
}) => {
  const {
    dossierData: { businessDetails },
    dossierDataSources,
    isPartner,
    autoSyncStatus,
  } = useContext(TaxForecastContext);
  const administrations = isPartner ? businessDetails.fiscalPartnerBusinessDetails : businessDetails.taxableSubjectBusinessDetails;
  const administrationOptions = useMemo(() => administrations && (administrations).map((administrationItem) => ({
    label: administrationItem.businessName,
    value: administrationItem.globalAdministrationId,
  })), [administrations]);

  return (
    <Sticky>
      {({
        style,
        isSticky,
      }) => (
        <div className={`${className} administrations-sources-container ${isSticky && 'sticky sticky__dropdowns'}`} style={style}>
          <SectionWrapper className="forecast-section">
            <ColumnLayout>
              <Column span={8}>
                <ColumnInner>
                  <Column span={6} className="administrations-select">
                    <Autocomplete
                      {...selectProps}
                      options={administrationOptions || []}
                      value={administration}
                      onChange={handleAdministrationChange}
                      name="administration"
                      withPortal
                      disabled={autoSyncStatus === AUTO_SYNC_STATUSES.IN_PROCESS}
                    />
                  </Column>
                </ColumnInner>
              </Column>
              { !hideSource && (
                <Column span={4} className="data-source-select">
                  <Autocomplete
                    {...selectProps}
                    options={formatMasterData(dossierDataSources)}
                    value={source}
                    onChange={handleSourceChange}
                    name="datasource"
                    disabled={disableSource || autoSyncStatus === AUTO_SYNC_STATUSES.IN_PROCESS}
                  />
                </Column>
              ) }
            </ColumnLayout>
          </SectionWrapper>
        </div>
      )}
    </Sticky>
  );
};

AdministrationsAndSources.defaultProps = {
  className: '',
  hideSource: false,
  administration: '',
  source: '',
  disableSource: false,
};

AdministrationsAndSources.propTypes = {
  /** selected value of administration */
  administration: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /** selected value of source */
  source: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  /** prop to hide/show source dropdown */
  hideSource: PropTypes.bool,
  /** callback function to be called on change of administration */
  handleAdministrationChange: PropTypes.func,
  /** callback function to be called on change of source */
  handleSourceChange: PropTypes.func,
  /** provide class name */
  className: PropTypes.string,
  /** prop to disable source dropdown or not */
  disableSource: PropTypes.bool,
};

export default AdministrationsAndSources;

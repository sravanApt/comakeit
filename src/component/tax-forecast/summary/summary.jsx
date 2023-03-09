import React, {
  useState, useContext, useEffect,
} from 'react';
import styled from 'styled-components';
import {
  ColumnLayout, Column, Typography, Button,
} from '@visionplanner/ui-react-material';
import { StickyContainer, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { summaryTranslate as translate } from './summary-translate';
import IncomeFromBusinessHeading from '../income-from-business/common/income-from-business-heading';
import TaxAmount from '../income-from-business/common/tax-amount';
import TaxForecastContext from '../tax-forecast-context';
import OverviewOrShortCalculation from './overview-or-short-calculation';
import ExpectedOutCome from './expected-outcome';
import AdviserAdviceQuickEditInput from './adviser-advice-quick-edit-input';
import { cleanDeep } from '../../../common/utils';
import * as requests from './summary.request';
import { saveDeclaration } from '../tax-forecast-request';
import { ALLOCATION_FIELD_NAME } from '../allocation/allocation.constants';

/**
  * Tax Forecast - Component to display the summary of dossier.
  *
  */

const Summary = ({ className, location }) => {
  const [summaryData, setSummaryData] = useState(null);
  const {
    dossierData,
    isPartner,
    globalClientId,
    saveDossierDetails,
    isDossierLocked,
  } = useContext(TaxForecastContext);
  const adviserAdviceKey = isPartner ? 'adviceToFiscalPartner' : 'adviceToTaxableSubject';

  const fetchSummaryData = useAsyncCallback(async () => {
    const content = await requests.getSummaryData({
      ...cleanDeep(dossierData),
      [ALLOCATION_FIELD_NAME]: { ...cleanDeep(dossierData[ALLOCATION_FIELD_NAME], false, [0]) },
    }, {
      forFiscalPartner: isPartner,
    });
    setSummaryData(content);
  }, [isPartner]);

  useEffect(() => {
    fetchSummaryData();
  }, [fetchSummaryData]);

  const handleAdviserAdviceSave = useAsyncCallback(async (value) => {
    const adviserAdvice = { ...dossierData.adviserAdvice, [adviserAdviceKey]: value };
    await saveDeclaration(globalClientId, dossierData.dossierManifest.dossierId, {
      ...cleanDeep({
        ...dossierData,
        adviserAdvice,
      }),
    });
    saveDossierDetails(adviserAdvice, 'adviserAdvice', false);
  }, [dossierData, adviserAdviceKey], {});

  const downloadPdf = useAsyncCallback(async () => {
    const { documentName, encodeData } = await requests.getPdfData({
      ...cleanDeep(dossierData),
    }, {
      forFiscalPartner: isPartner,
    });
    const link = document.createElement('a');
    link.download = documentName;
    link.href = `data:application/octet-stream;base64,${encodeData}`;
    link.click();
  }, [isPartner]);

  return (
    <SummaryStyleWrapper className={`${className} summary`}>
      <TaxAmount />
      <StickyContainer
        stickyContent={(
          <IncomeFromBusinessHeading
            heading={translate('summary')}
            location={location}
          />
        )}
      >
        <div className="tab-container" data-ta={`${isPartner ? 'partner' : 'taxable-subject'}-summary-section`}>
          {summaryData && (
            <div className="pad-t-md">
              <ColumnLayout>
                <Column span={12}>
                  <Button
                    className="pull-right"
                    buttonType="secondary"
                    trailingIcon={{
                      icon: 'download',
                      basename: 'far',
                    }}
                    onClick={downloadPdf}
                    dataTa="download-pdf-button"
                  >
                    {translate('download-pdf')}
                  </Button>
                </Column>
                <Column span={6} className="summary-sub-section">
                  <Typography use="subtitle1" className="summary-sub-section-heading">{translate('expected-outcome-of-income')}</Typography>
                  <ExpectedOutCome
                    declarationOutcome={summaryData.declarationOutcome}
                  />
                </Column>
                <Column span={6} className="summary-sub-section">
                  <Typography use="subtitle1" className="summary-sub-section-heading">{translate('adviser-advice')}</Typography>
                  <AdviserAdviceQuickEditInput
                    type="textarea"
                    name="advice"
                    fieldValue={dossierData.adviserAdvice?.[adviserAdviceKey] || ''}
                    onFieldSave={handleAdviserAdviceSave}
                    disabledInput={isDossierLocked}
                  />
                </Column>
              </ColumnLayout>
              <ColumnLayout>
                <Column span={6} className="summary-sub-section overview-or-short-calculation">
                  <Typography use="subtitle1" className="summary-sub-section-heading">{summaryData?.overView?.name}</Typography>
                  <OverviewOrShortCalculation
                    summarySubsectionData={summaryData.overView?.subSections}
                  />
                </Column>
                <Column span={6} className="summary-sub-section overview-or-short-calculation">
                  <Typography use="subtitle1" className="summary-sub-section-heading">{summaryData?.shortCalculation?.name}</Typography>
                  <OverviewOrShortCalculation
                    summarySubsectionData={summaryData.shortCalculation?.subSections}
                    netPay={summaryData.declarationOutcome?.netPay}
                  />
                </Column>
              </ColumnLayout>
            </div>
          )}
        </div>
      </StickyContainer>
    </SummaryStyleWrapper>
  );
};

const SummaryStyleWrapper = styled.div`
  .mdc-layout-grid {
    &__cell {
      font-size: ${({ theme }) => theme.fontSizes.fs12} !important;
      font-weight: normal;
    }

    &__cell--span-6 {
      margin: unset !important;
    }

    .summary-sub-section {
      .mdc-layout-grid {
        padding: ${({ theme }) => theme.paddings.medium};
        border: 1px solid ${({ theme }) => theme.colors.pampas};
        box-sizing: border-box;
        border-radius: 4px;
      }
    }

    .overview-or-short-calculation {
      .mdc-layout-grid {
        background: ${({ theme }) => theme.colors.desertStorm};

        &__inner {
          grid-gap: 12px;
        }
      }

      &-heading {
        font-weight: 600;
      }
    }

    .mdc-text-field__input {
      height: 13.53rem;
      resize: none;
    }
  }
`;

export default Summary;

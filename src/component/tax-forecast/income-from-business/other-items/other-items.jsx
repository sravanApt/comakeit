import React, {
  useState, useContext, useCallback, useEffect,
} from 'react';
import styled from 'styled-components';
import { StickyContainer, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import AdministrationsAndSources from '../common/administrations-and-sources';
import IncomeFromBusinessHeading from '../common/income-from-business-heading';
import TaxAmount from '../common/tax-amount';
import CommonTable from '../common/common-table';
import TaxForecastContext from '../../tax-forecast-context';
import * as constants from './other-items.constants';
import * as requests from './other-items.request';
import {
  getCommonBusinessDetailsAndIds,
  getArrayOfAmountsWithDescription,
  getPartnerOrSubjectUpdatedIncomeFromBusinessDetails,
  getPartnerOrSubjectIncomeFromBusinessData,
  containsGlobalAdministrationId,
} from '../common/utils';
import { getTotalValue, cleanDeep, stringToClassName } from '../../../../common/utils';
import { getProfitAndLossTotalAmounts } from '../profit-loss/profit-and-loss';
import {
  currentPreviousColums, PROFIT_LOSS_OBJECT_KEYS,
} from '../profit-loss/profit-loss.constants';
import OtherItemsCorrectionModal from '../common/common-correction-modal';
import { validationSchema } from './other-items-validation-schema';
import { STICKY_CUSTOM_STYLES } from '../../tax-forecast.constants';
import { SectionTableWrapper } from '../../../../common/styled-wrapper';

const OtherItemsWrapper = styled.div`
  && .other-items {
    &__investment-deduction {
      .mdc-dialog__surface {
        @media (max-width: 1800px) {
          max-width: 70%;
        }
      }
    }

    &__business-result-section {
      border: none;

      .common-data-table__body {
        .common-data-table {
          &__cell {
            color: ${({ theme }) => theme.colors.mirage};
            font-size: ${({ theme }) => theme.fontSizes.fs14};
          }
        }
      }
    }

    &__result-section {
      margin-top: -${({ theme }) => theme.margins.large};

      .common-data-table__body {
        .common-data-table {
          &__cell {
            color: ${({ theme }) => theme.colors.mirage};
            font-size: ${({ theme }) => theme.fontSizes.fs18};
          }
        }
      }
    }
  }
`;

const initialOtherItemsData = {
  fiscalPartnerOtherItems: { ...constants.DEFAULT_OTHER_ITEMS_DATA },
  taxableSubjectOtherItems: { ...constants.DEFAULT_OTHER_ITEMS_DATA },
};

const businessResultCalcualtions = (data) => getArrayOfAmountsWithDescription(data, constants.LABELS, constants.OTHER_ITEMS_CHILD_KEYS);

/**
  * Tax Forecast - Other Items - It renders all sections in Other Items...
  *
  */

const OtherItems = ({ location }) => {
  const [otherItemsBusinessResult, setOtherItemsBusinessResult] = useState(null);
  const [otherItemsData, setOtherItemsData] = useState(initialOtherItemsData);
  const [correctionModalTitle, setCorrectionModalTitle] = useState('');
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [sectionType, setSectionType] = useState(null);
  const [otherItemsCorrectionData, setOtherItemsCorrectionData] = useState([]);

  const {
    dossierData,
    dossierData: {
      dossierManifest: { taxableYear },
      otherItemsDetails,
      profitAndLossDetails,
      businessDetails,
    },
    administrationIds,
    setAdministrationIds,
    isPartner,
    saveDossierDetails,
    calculateUpdatedTax,
  } = useContext(TaxForecastContext);

  const {
    administrationId,
    sourceId,
    hideAction,
    fiscalPartnerBusinessId,
    taxableSubjectBusinessId,
  } = getCommonBusinessDetailsAndIds(isPartner, administrationIds, businessDetails);
  const fieldNamePrefix = isPartner ? constants.OTHER_ITEMS_OBJECT_KEYS.fiscalPartner : constants.OTHER_ITEMS_OBJECT_KEYS.taxableSubject;

  const getUpdatedOtherItemsDetails = useCallback((updatedOtherItemsData) => {
    const taxableSubjectOtherItems = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      otherItemsDetails,
      updatedOtherItemsData,
      constants.OTHER_ITEMS_OBJECT_KEYS.taxableSubject,
      taxableSubjectBusinessId,
    );
    const fiscalPartnerOtherItems = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      otherItemsDetails,
      updatedOtherItemsData,
      constants.OTHER_ITEMS_OBJECT_KEYS.fiscalPartner,
      fiscalPartnerBusinessId,
    );
    return { ...otherItemsDetails, taxableSubjectOtherItems, fiscalPartnerOtherItems };
  }, [fiscalPartnerBusinessId, otherItemsDetails, taxableSubjectBusinessId]);

  const handleAdministrationChange = useCallback(
    (value) => {
      setAdministrationIds(value);
      formatOtherItemsDetails(value, false);
    },
    [setAdministrationIds, formatOtherItemsDetails],
  );

  const updateBusinessResults = useCallback(async () => {
    let profitLossResults = constants.DEFAULT_OTHER_ITEMS_BUSINESS_RESULT.profitLossData;
    const profitAndLossData = getPartnerOrSubjectIncomeFromBusinessData(administrationId, profitAndLossDetails, isPartner, PROFIT_LOSS_OBJECT_KEYS);
    if (profitAndLossData) {
      const { result } = getProfitAndLossTotalAmounts(profitAndLossData);
      if (result) {
        profitLossResults = { ...profitLossResults, currentYearAmount: result[0].currentYearAmount, previousYearAmount: result[0].previousYearAmount };
      }
    }
    setOtherItemsBusinessResult({
      ...constants.DEFAULT_OTHER_ITEMS_BUSINESS_RESULT,
      profitLossData: profitLossResults,
    });
  }, [administrationId, profitAndLossDetails, isPartner]);

  const formatOtherItemsDetails = useCallback((administration, updateResults = true) => {
    let otherItemsUpdatedData = { ...constants.DEFAULT_OTHER_ITEMS_DATA };
    if (administration && otherItemsDetails?.[fieldNamePrefix] && containsGlobalAdministrationId(otherItemsDetails[fieldNamePrefix], administration)) {
      otherItemsUpdatedData = otherItemsDetails[fieldNamePrefix].find((obj) => obj.globalAdministrationId === administration);
    }
    setOtherItemsData((prevState) => ({ ...prevState, [fieldNamePrefix]: otherItemsUpdatedData }));
    if (updateResults) {
      updateBusinessResults();
    }
  }, [fieldNamePrefix, otherItemsDetails, updateBusinessResults]);

  useEffect(() => {
    formatOtherItemsDetails(administrationId);
  }, [administrationId, formatOtherItemsDetails]);

  const handleOtherItemsCorrectionModal = (title, key) => {
    if (otherItemsData?.[fieldNamePrefix]?.businessResult[key]) {
      setOtherItemsCorrectionData(otherItemsData[fieldNamePrefix].businessResult[key][constants.OTHER_ITEMS_CHILD_KEYS[key]]);
    }
    setCorrectionModalTitle(title.toLowerCase());
    setSectionType({ parentKey: key, childKey: constants.OTHER_ITEMS_CHILD_KEYS[key] });
    setShowCorrectionModal(!showCorrectionModal);
  };

  // function for update and save of investment deduction and divestment addition updates in other items section
  const updateWithBokkzData = useAsyncCallback(async (updatedOtherItemDetails, updatedOtherItemsData, reportType) => {
    const formattedOtherItemData = { ...cleanDeep(dossierData), [constants.OTHER_ITEMS_DETAILS]: updatedOtherItemDetails };
    const response = await requests.taxCalculationReport(reportType, isPartner, formattedOtherItemData);
    const responseData = response[reportType].totalAmount;
    const updatedWithBokkzObject = {
      ...updatedOtherItemsData[fieldNamePrefix],
      businessResult: {
        ...updatedOtherItemsData[fieldNamePrefix].businessResult,
        [sectionType.parentKey]: {
          ...updatedOtherItemsData[fieldNamePrefix].businessResult[sectionType.parentKey],
          currentYearAmount: responseData || 0,
        },
      },
    };
    const bokkzUpdatedOtherItems = getUpdatedOtherItemsDetails({ ...otherItemsData, [fieldNamePrefix]: updatedWithBokkzObject });
    saveDossierDetails(bokkzUpdatedOtherItems, constants.OTHER_ITEMS_DETAILS);
    calculateUpdatedTax(bokkzUpdatedOtherItems, constants.OTHER_ITEMS_DETAILS);
  }, [dossierData, fieldNamePrefix, sectionType, saveDossierDetails, getUpdatedOtherItemsDetails, otherItemsData]);

  const handleOtherItemsCorrectionChanges = useCallback(async ({ correctionData }) => {
    const updatedCorrectionData = cleanDeep(correctionData);
    let currentYearAmount = 0;
    if ((sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.nonOrPartlyDeductableCost)
      || (sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.taxationExemptComponents)
      || (sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.cessationProfit)) {
      currentYearAmount = getTotalValue(updatedCorrectionData, 'amount');
    } else if ((sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.equalizationReserve || sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.reinvestmentReserve)) {
      currentYearAmount = getTotalValue(updatedCorrectionData, 'release') - getTotalValue(updatedCorrectionData, 'allocation');
    } else if (sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.divestmentAddition) {
      currentYearAmount = getTotalValue(updatedCorrectionData, 'base');
    } else {
      currentYearAmount = getTotalValue(updatedCorrectionData, 'remainderInvestmentDeduction.amount');
    }

    const otherItemsObject = {
      ...otherItemsData[fieldNamePrefix],
      businessResult: {
        ...otherItemsData[fieldNamePrefix].businessResult,
        [sectionType.parentKey]: {
          ...otherItemsData[fieldNamePrefix].businessResult[sectionType.parentKey],
          [sectionType.childKey]: updatedCorrectionData,
          currentYearAmount,
        },
      },
    };

    const updatedOtherItemsData = { ...otherItemsData, [fieldNamePrefix]: otherItemsObject };
    const updatedOtherItemDetails = getUpdatedOtherItemsDetails(updatedOtherItemsData);
    setShowCorrectionModal(false);
    if ((sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.investmentDeduction) || (sectionType.childKey === constants.OTHER_ITEMS_CHILD_KEYS.divestmentAddition)) {
      updateWithBokkzData(updatedOtherItemDetails, updatedOtherItemsData, constants.REPORT_KEYS[sectionType.childKey]);
    } else {
      saveDossierDetails(updatedOtherItemDetails, constants.OTHER_ITEMS_DETAILS);
      calculateUpdatedTax(updatedOtherItemDetails, constants.OTHER_ITEMS_DETAILS);
    }
  }, [sectionType, otherItemsData, fieldNamePrefix, getUpdatedOtherItemsDetails, updateWithBokkzData, saveDossierDetails, calculateUpdatedTax]);

  return (
    otherItemsBusinessResult && (
      <OtherItemsWrapper className="other-items income-from-business" data-ta="other-items">
        <TaxAmount />
        <StickyContainer
          customStyles={STICKY_CUSTOM_STYLES}
          stickyContent={
            (
              <IncomeFromBusinessHeading
                heading={`${translate('other-items')}`}
                location={location}
              />
            )
          }
        >
          <div className="tab-container">
            <AdministrationsAndSources
              administration={administrationId}
              source={sourceId}
              hideSource
              handleAdministrationChange={handleAdministrationChange}
            />
            <SectionTableWrapper className="other-items__business-result-section forecast-section">
              <CommonTable
                columns={currentPreviousColums(taxableYear)}
                values={[otherItemsBusinessResult.profitLossData]}
                hideAction
              />
            </SectionTableWrapper>
            <SectionTableWrapper className="other-items-section forecast-section">
              <CommonTable
                columns={constants.COMMON_TABLE_HEADER}
                values={businessResultCalcualtions(otherItemsData[fieldNamePrefix].businessResult)}
                dataTa="other-items-results"
                hideAction={hideAction}
                handleCorrectionModal={handleOtherItemsCorrectionModal}
              />
            </SectionTableWrapper>
            {/*
            // TODO: will be reverted after pilot
            <SectionTableWrapper className="other-items__result-section forecast-section">
              <CommonTable
                columns={constants.COMMON_TABLE_HEADER}
                values={businessResultsTotal(otherItemsData[fieldNamePrefix].businessResult, otherItemsBusinessResult.profitLossData)}
                hideAction
              />
            </SectionTableWrapper> */}
          </div>
        </StickyContainer>
        {showCorrectionModal && (
          <OtherItemsCorrectionModal
            showModal={showCorrectionModal}
            onClose={() => setShowCorrectionModal(false)}
            data={otherItemsCorrectionData}
            handleSubmit={handleOtherItemsCorrectionChanges}
            title={correctionModalTitle}
            sectionType={sectionType.childKey}
            dataTa="other-items-correction-modal"
            className={`income-from-business-correction-modal other-items__${stringToClassName(sectionType.parentKey)}`}
            validationSchema={validationSchema(sectionType.parentKey)}
          />
        )}
      </OtherItemsWrapper>
    )
  );
};

export default OtherItems;

import React, {
  useState, useEffect, useContext, useMemo, useCallback,
} from 'react';
import styled from 'styled-components';
import { Typography } from '@visionplanner/ui-react-material';
import { StickyContainer } from '@visionplanner/vp-ui-fiscal-library';
import AdministrationsAndSources from '../common/administrations-and-sources';
import CommonTable from '../common/common-table';
import ProfitLossCorrectionModal from './profit-loss-correction-modal';
import {
  getTotalAmountsObject,
  checkIsVpcAdministartion,
  manageCorrection,
  getArrayOfAmountsWithDescription,
  getPartnerOrSubjectUpdatedIncomeFromBusinessDetails,
  getCommonBusinessDetailsAndIds,
  containsGlobalAdministrationId,
} from '../common/utils';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import IncomeFromBusinessHeading from '../common/income-from-business-heading';
import TaxAmount from '../common/tax-amount';
import { getTotalValue, cleanDeep } from '../../../../common/utils';
import TaxForecastContext from '../../tax-forecast-context';
import * as constants from './profit-loss.constants';
import { DEFAULT_PROFIT_LOSS_DATA } from './profit-loss.test.data';
import { STICKY_CUSTOM_STYLES, PARTNERSHIP_VALUE, VOF_VALUE } from '../../tax-forecast.constants';
import { SectionTableWrapper } from '../../../../common/styled-wrapper';
import useHanldeSourceChange from '../../../../common/custom-hooks/use-handle-souce-change';

const initialProfitLossData = {
  fiscalPartnerProfitAndLoss: { ...DEFAULT_PROFIT_LOSS_DATA },
  taxableSubjectProfitAndLoss: { ...DEFAULT_PROFIT_LOSS_DATA },
};

const initialProfitLossTotals = {
  totalIncome: [],
  totalBusinessCost: [],
  totalFinanceCost: [],
  totalCost: [],
  result: [],
};

/** This will return sum of profit and loss amounts based on previous and current year amounts */
export const getProfitAndLossTotalAmounts = (profitAndLossData) => {
  const incomeValues = getArrayOfAmountsWithDescription({ ...profitAndLossData.plBenefitsDetails, revenue: profitAndLossData.revenue }, constants.LABELS);
  const totalIncome = getTotalAmountsObject(
    constants.LABELS.totalIncome,
    getTotalValue(incomeValues, constants.CURRENT_YEAR_AMOUNT),
    getTotalValue(incomeValues, constants.PREVIOUS_YEAR_AMOUNT),
  );

  const businessCostValues = getArrayOfAmountsWithDescription(profitAndLossData.costsOfBusiness, constants.LABELS);
  const totalBusinessCost = getTotalAmountsObject(
    constants.LABELS.totalBusinessCost,
    getTotalValue(businessCostValues, constants.CURRENT_YEAR_AMOUNT),
    getTotalValue(businessCostValues, constants.PREVIOUS_YEAR_AMOUNT),
  );

  const financeCostValues = getArrayOfAmountsWithDescription(profitAndLossData.plCostDetails, constants.LABELS);
  const totalFinanceCost = getTotalAmountsObject(
    constants.LABELS.totalFinanceCost,
    getTotalValue(financeCostValues, constants.CURRENT_YEAR_AMOUNT),
    getTotalValue(financeCostValues, constants.PREVIOUS_YEAR_AMOUNT),
  );

  const totalCost = getTotalAmountsObject(
    constants.LABELS.totalCost,
    totalFinanceCost.currentYearAmount + totalBusinessCost.currentYearAmount,
    totalFinanceCost.previousYearAmount + totalBusinessCost.previousYearAmount,
  );
  return {
    totalIncome: [totalIncome],
    totalBusinessCost: [totalBusinessCost],
    totalFinanceCost: [totalFinanceCost],
    totalCost: [totalCost],
    result: [
      getTotalAmountsObject(constants.LABELS.result, totalIncome.currentYearAmount - totalCost.currentYearAmount, totalIncome.previousYearAmount - totalCost.previousYearAmount),
    ],
  };
};

const ProfitAndLossWrapper = styled.div`
  &&& .pl-section {
    .common-data-table {
      &__body {
        .table-sub-footer {
          color: ${({ theme }) => theme.currencyText};
          font-size: ${({ theme }) => theme.fontSizes.fs16};
        }
      }
    }

    &--result {
      margin-top: -20px;

      .common-data-table {
        &__cell.table-footer {
          color: ${({ theme }) => theme.colors.mirage};
        }
      }
    }
  }
`;

/**
  * Tax Forecast - Profit & Loss - It renders different sections in Profit and Loss of Income from business.
  *
  */
const ProfitAndLoss = ({ location }) => {
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionData, setCorrectionData] = useState([]);
  const [correctionModalTitle, setCorrectionModalTitle] = useState('');
  const [profitLossData, setProfitLossData] = useState(initialProfitLossData);
  const [totals, setTotals] = useState(initialProfitLossTotals);
  const [keys, setKeys] = useState({});

  const {
    dossierData: {
      dossierManifest: { taxableYear, declarationTypeId },
      profitAndLossDetails,
      declarationID,
      businessDetails,
      personalDetails: {
        taxableSubjectDetails: { taxableSubjectId },
      },
    },
    administrationIds,
    setAdministrationIds,
    saveDossierDetails,
    fetchVPCFinancialData,
    isPartner,
    calculateUpdatedTax,
  } = useContext(TaxForecastContext);

  const {
    administrationId,
    sourceId,
    fiscalPartnerBusinessId,
    taxableSubjectBusinessId,
    hideAction,
    fiscalPartnerOrTaxableSubjectBusinessDetails,
    businessForm,
  } = getCommonBusinessDetailsAndIds(isPartner, administrationIds, businessDetails);
  const fieldNamePrefix = isPartner ? constants.PROFIT_LOSS_OBJECT_KEYS.fiscalPartner : constants.PROFIT_LOSS_OBJECT_KEYS.taxableSubject;

  const formatProfitLossDetails = useCallback((administration, updateTotals = true) => {
    let profitAndLossData = { ...DEFAULT_PROFIT_LOSS_DATA };
    if (administration && profitAndLossDetails?.[fieldNamePrefix] && containsGlobalAdministrationId(profitAndLossDetails[fieldNamePrefix], administration)) {
      profitAndLossData = profitAndLossDetails[fieldNamePrefix].find((obj) => obj.globalAdministrationId === administration);
    }
    setProfitLossData((prevState) => ({ ...prevState, [fieldNamePrefix]: profitAndLossData }));
    if (updateTotals) {
      setTotals(getProfitAndLossTotalAmounts(profitAndLossData));
    }
  }, [fieldNamePrefix, profitAndLossDetails]);

  useEffect(() => {
    formatProfitLossDetails(administrationId);
  }, [administrationId, formatProfitLossDetails]);

  const administrationSourceChangeParameters = {
    TaxableSubjectID: taxableSubjectId,
    globalAdministrationId: administrationId,
    dataSource: sourceId,
    declarationId: declarationID,
    declarationTypeId,
    taxableYear,
  };

  const handleAdministrationChange = useCallback(
    (value) => {
      setAdministrationIds(value);
      formatProfitLossDetails(value, false);
    },
    [setAdministrationIds, sourceId, fetchVPCFinancialData, administrationSourceChangeParameters, formatProfitLossDetails],
  );

  const handleSourceChange = useHanldeSourceChange(administrationId, sourceId, fetchVPCFinancialData, administrationSourceChangeParameters, isPartner, setAdministrationIds);

  const handleCorrectionModal = useCallback((title, parentKey, childKey, fieldName = constants.BUSINESS_PROFIT_AND_LOSS_DETAILS) => {
    setCorrectionModalTitle(title.toLowerCase());
    let correctionObject = null;
    if (parentKey) {
      correctionObject = profitLossData[fieldNamePrefix][parentKey][childKey][fieldName];
    } else {
      correctionObject = profitLossData[fieldNamePrefix][childKey][fieldName];
    }
    setCorrectionData(correctionObject);
    setKeys({ parentKey, childKey });
    setShowCorrectionModal(true);
  }, [fieldNamePrefix, profitLossData]);

  const handleCorrection = useCallback(async (data) => {
    let profitLossObject = null;
    const updatedCorrectionData = cleanDeep(data.correctionData.filter((correction) => correction.description).map((obj) => ({
      ...obj,
      amount: manageCorrection(obj.amountVPC) + manageCorrection(obj.amountCorrection),
      amountCorrection: manageCorrection(obj.amountCorrection),
      amountVPC: manageCorrection(obj.amountVPC),
    })));
    const currentYearAmount = getTotalValue(updatedCorrectionData, constants.AMOUNT_VPC) + getTotalValue(updatedCorrectionData, constants.AMOUNT_CORRECTION);
    if (keys.parentKey) {
      profitLossObject = {
        ...profitLossData[fieldNamePrefix],
        [keys.parentKey]: {
          ...profitLossData[fieldNamePrefix][keys.parentKey],
          [keys.childKey]: {
            ...profitLossData[fieldNamePrefix][keys.parentKey][keys.childKey],
            businessProfitAndLossDetails: updatedCorrectionData,
            currentYearAmount,
          },
        },
      };
    } else {
      const fieldName = keys.childKey === constants.SHARES ? constants.SHARES_IN_EQUITY_CAPITAL : constants.BUSINESS_PROFIT_AND_LOSS_DETAILS;
      profitLossObject = {
        ...profitLossData[fieldNamePrefix],
        [keys.childKey]: {
          ...profitLossData[fieldNamePrefix][keys.childKey],
          [fieldName]: updatedCorrectionData,
          currentYearAmount,
        },
      };
    }
    const updatedProfitLossData = { ...profitLossData, [fieldNamePrefix]: profitLossObject };
    saveDossierDetails(getUpdatedProfitAndLossDetails(updatedProfitLossData), constants.PROFIT_LOSS_DETAILS, true, true);
    calculateUpdatedTax(getUpdatedProfitAndLossDetails(updatedProfitLossData), constants.PROFIT_LOSS_DETAILS);
    setShowCorrectionModal(false);
  }, [calculateUpdatedTax, fieldNamePrefix, getUpdatedProfitAndLossDetails, keys.childKey, keys.parentKey, profitLossData, saveDossierDetails]);

  const getUpdatedProfitAndLossDetails = useCallback((updatedProfitLossData) => {
    const taxableSubjectProfitAndLoss = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      profitAndLossDetails,
      updatedProfitLossData,
      constants.PROFIT_LOSS_OBJECT_KEYS.taxableSubject,
      taxableSubjectBusinessId,
    );
    const fiscalPartnerProfitAndLoss = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      profitAndLossDetails,
      updatedProfitLossData,
      constants.PROFIT_LOSS_OBJECT_KEYS.fiscalPartner,
      fiscalPartnerBusinessId,
    );
    return { ...profitAndLossDetails, taxableSubjectProfitAndLoss, fiscalPartnerProfitAndLoss };
  }, [fiscalPartnerBusinessId, profitAndLossDetails, taxableSubjectBusinessId]);

  const revenue = useMemo(() => [{
    description: constants.LABELS.revenue,
    previousYearAmount: profitLossData[fieldNamePrefix].revenue.previousYearAmount,
    currentYearAmount: profitLossData[fieldNamePrefix].revenue.currentYearAmount,
    key: constants.REVENUE,
    isCorrectionDataExist: !!profitLossData[fieldNamePrefix].revenue?.businessProfitAndLossDetails?.length,
  }], [fieldNamePrefix, profitLossData]);

  const financialBenifits = useMemo(() => getArrayOfAmountsWithDescription(profitLossData[fieldNamePrefix].plBenefitsDetails, constants.LABELS, constants.BUSINESS_PROFIT_AND_LOSS_DETAILS), [fieldNamePrefix, profitLossData]);

  const cost = useMemo(() => getArrayOfAmountsWithDescription(profitLossData[fieldNamePrefix].costsOfBusiness, constants.LABELS, constants.BUSINESS_PROFIT_AND_LOSS_DETAILS), [fieldNamePrefix, profitLossData]);

  const financialCosts = useMemo(() => getArrayOfAmountsWithDescription(profitLossData[fieldNamePrefix].plCostDetails, constants.LABELS, constants.BUSINESS_PROFIT_AND_LOSS_DETAILS), [fieldNamePrefix, profitLossData]);

  const shares = useMemo(() => [{
    description: constants.LABELS.shares,
    previousYearAmount: profitLossData[fieldNamePrefix]?.shares?.previousYearAmount,
    currentYearAmount: profitLossData[fieldNamePrefix]?.shares?.currentYearAmount,
    key: constants.SHARES,
    isCorrectionDataExist: !!profitLossData[fieldNamePrefix].shares?.transactions?.length,
  }], [fieldNamePrefix, profitLossData]);

  const totalShares = useMemo(() => [{
    description: constants.LABELS.totalShares,
    previousYearAmount: profitLossData[fieldNamePrefix]?.shares?.previousYearAmount,
    currentYearAmount: profitLossData[fieldNamePrefix]?.shares?.currentYearAmount,
  }], [fieldNamePrefix, profitLossData]);

  return (
    <ProfitAndLossWrapper className="profit-loss" data-ta="profit-loss">
      <TaxAmount />
      <StickyContainer
        customStyles={STICKY_CUSTOM_STYLES}
        stickyContent={
          (
            <IncomeFromBusinessHeading
              heading={`${translate('profit-and-loss')}`}
              location={location}
            />
          )
        }
      >
        <div className="tab-container">
          <AdministrationsAndSources
            administration={administrationId}
            source={sourceId}
            handleAdministrationChange={handleAdministrationChange}
            handleSourceChange={handleSourceChange}
            disableSource={!checkIsVpcAdministartion(administrationId, fiscalPartnerOrTaxableSubjectBusinessDetails)}
          />
          <SectionTableWrapper className="pl-section forecast-section">
            <Typography use="h6" className="flex pad-l-xs mar-b-sm">{translate('income')}</Typography>
            <CommonTable
              values={revenue}
              columns={constants.revenueColumns(taxableYear)}
              dataTa="profit-loss-revenue"
              handleCorrectionModal={(title, key) => handleCorrectionModal(title, '', key)}
              hideAction={hideAction}
            />

            <CommonTable
              values={financialBenifits}
              columns={constants.PROFIT_LOSS_COLUMNS.plBenefitsDetails}
              dataTa="profit-loss-benefits"
              handleCorrectionModal={(title, key) => handleCorrectionModal(title, constants.PL_BENEFITS, key)}
              hideAction={hideAction}
            />

            <CommonTable
              values={(totals?.totalIncome)}
              className="totals-table"
            />
          </SectionTableWrapper>
          <SectionTableWrapper className="pl-section forecast-section">
            <Typography use="h6" className="flex pad-l-xs mar-b-sm">{translate('cost')}</Typography>
            <CommonTable
              values={cost}
              columns={constants.businessCostColumns(taxableYear)}
              dataTa="profit-loss-costs"
              handleCorrectionModal={(title, key) => handleCorrectionModal(title, constants.COST_OF_BUSINESS, key)}
              hideAction={hideAction}
            />

            <CommonTable
              values={(totals?.totalBusinessCost)}
              className="totals-table"
            />

            <CommonTable
              values={financialCosts}
              columns={constants.PROFIT_LOSS_COLUMNS.financialCost}
              dataTa="profit-loss-financial-costs"
              handleCorrectionModal={(title, key) => handleCorrectionModal(title, constants.PL_COSTS, key)}
              hideAction={hideAction}
            />

            <CommonTable
              values={(totals?.totalFinanceCost)}
              className="totals-table"
            />

            <CommonTable
              values={(totals?.totalCost)}
              className="totals-table"
            />
          </SectionTableWrapper>
          <SectionTableWrapper className="pl-section forecast-section pl-section--result">
            <CommonTable
              values={(totals?.result)}
              className="totals-table"
            />
          </SectionTableWrapper>
          { (businessForm === PARTNERSHIP_VALUE || businessForm === VOF_VALUE) && (
            <SectionTableWrapper className="balance-sheet-section forecast-section">
              <CommonTable
                values={shares}
                columns={constants.SHARES_COLUMNS}
                dataTa="partner-allocation-details"
                handleCorrectionModal={(title, key) => handleCorrectionModal(title, '', key, constants.SHARES_IN_EQUITY_CAPITAL)}
                hideAction={hideAction}
              />
              <CommonTable
                values={totalShares}
                className="totals-table"
              />
            </SectionTableWrapper>
          )}
        </div>
      </StickyContainer>
      { showCorrectionModal && (
        <ProfitLossCorrectionModal
          showModal={showCorrectionModal}
          onClose={() => { setShowCorrectionModal(false); }}
          title={correctionModalTitle}
          data={correctionData}
          handleCorrection={handleCorrection}
          taxableYear={taxableYear}
          className="income-from-business-correction-modal"
          keys={keys}
        />
      )}
    </ProfitAndLossWrapper>
  );
};

export default ProfitAndLoss;

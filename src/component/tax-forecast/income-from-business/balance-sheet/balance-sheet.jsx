import React, {
  useState, useContext, useMemo, useEffect, useCallback,
} from 'react';
import { StickyContainer } from '@visionplanner/vp-ui-fiscal-library';
import { Alert } from '@visionplanner/ui-react-material';
import AdministrationsAndSources from '../common/administrations-and-sources';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import IncomeFromBusinessHeading from '../common/income-from-business-heading';
import TaxAmount from '../common/tax-amount';
import CommonTable from '../common/common-table';
import {
  getTotalAmountsObject,
  checkIsVpcAdministartion,
  getArrayOfAmountsWithDescription,
  manageCorrection,
  getPartnerOrSubjectUpdatedIncomeFromBusinessDetails,
  getCommonBusinessDetailsAndIds,
  containsGlobalAdministrationId,
  getPartnerOrSubjectIncomeFromBusinessData,
} from '../common/utils';
import {
  startDateofYear, endDateofYear, getTotalValue, cleanDeep,
} from '../../../../common/utils';
import TaxForecastContext from '../../tax-forecast-context';
import {
  LABELS,
  BALANCE_SHEET_OBJECT_KEYS,
  BALANCE_SHEET_DETAILS,
  INITIAL_BALANCE_SHEET_DATA,
  BALANCE_SHEET_TYPES,
  ASSETS_LIABILITIES_CHILDREN_KEYS,
  DEFAULT_BUSINESS_RESULT,
} from './balance-sheet.constants';
import DepositWithdrawalsDifference from './deposit-withdrawals-difference';
import { CURRENT_YEAR_AMOUNT, PREVIOUS_YEAR_AMOUNT, PROFIT_LOSS_OBJECT_KEYS } from '../profit-loss/profit-loss.constants';
import { getProfitAndLossTotalAmounts } from '../profit-loss/profit-and-loss';
import BalanceSheetCorrectionModal from '../common/common-correction-modal';
import { validationSchema } from './balance-sheet-validation-schema';
import { STICKY_CUSTOM_STYLES, PARTNERSHIP_VALUE, VOF_VALUE } from '../../tax-forecast.constants';
import { SectionTableWrapper } from '../../../../common/styled-wrapper';
import useHanldeSourceChange from '../../../../common/custom-hooks/use-handle-souce-change';

const initialBalanceSheetData = {
  taxableSubjectBalanceSheet: { ...INITIAL_BALANCE_SHEET_DATA },
  fiscalPartnerBalanceSheet: { ...INITIAL_BALANCE_SHEET_DATA },
};

const initialBalanceSheetTotals = {
  totalAssets: [],
  totalLiabilities: [],
};

const getStartEndDateColumns = (taxableYear) => [
  {
    id: 2,
    label: startDateofYear(taxableYear),
    className: 'mirage-label text-align-right',
  },
  {
    id: 3,
    label: endDateofYear(taxableYear),
    className: 'mirage-label text-align-right',
  },
];

const getBalanceSheetTotalAmounts = (balanceSheetInfo) => {
  const assets = getArrayOfAmountsWithDescription(balanceSheetInfo.assets, LABELS);
  const totalAssets = getTotalAmountsObject(
    LABELS.totalAssets,
    getTotalValue(assets, CURRENT_YEAR_AMOUNT),
    getTotalValue(assets, PREVIOUS_YEAR_AMOUNT),
  );

  const liabilities = getArrayOfAmountsWithDescription(balanceSheetInfo.liabilities, LABELS);
  const totalLiabilities = getTotalAmountsObject(
    LABELS.totalLiabilities,
    getTotalValue(liabilities, CURRENT_YEAR_AMOUNT),
    getTotalValue(liabilities, PREVIOUS_YEAR_AMOUNT),
  );

  return {
    totalAssets: [totalAssets],
    totalLiabilities: [totalLiabilities],
  };
};

/**
  * Tax Forecast - Balance  Sheet - It renders Assets and Liabilities sections in Balance Sheet
  *
  */

const BalanceSheet = ({ location }) => {
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [balanceSheetCorrectionData, setBalanceSheetCorrectionData] = useState([]);
  const [balanceSheetData, setBalanceSheetData] = useState(initialBalanceSheetData);
  const [correctionModalTitle, setCorrectionModalTitle] = useState('');
  const [totals, setTotals] = useState(initialBalanceSheetTotals);
  const [balanceSheetKeys, setBalanceSheetKeys] = useState({});
  const [businessResult, setBusinessResult] = useState(null);
  const {
    dossierData: {
      dossierManifest: { taxableYear, declarationTypeId },
      balanceSheetDetails,
      profitAndLossDetails,
      declarationID,
      personalDetails: {
        taxableSubjectDetails: {
          taxableSubjectId,
        },
      },
      businessDetails,
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
  const fieldNamePrefix = isPartner ? BALANCE_SHEET_OBJECT_KEYS.fiscalPartner : BALANCE_SHEET_OBJECT_KEYS.taxableSubject;

  const columns = useMemo(() => ({
    assets: [
      {
        id: 1,
        label: translate('assets'),
        className: 'mirage-label',
      },
      ...getStartEndDateColumns(taxableYear),
    ],
    liabilities: [
      {
        id: 1,
        label: translate('liabilities'),
        className: 'mirage-label',
      },
      ...getStartEndDateColumns(taxableYear),
    ],
    shares: [
      {
        id: 1,
        label: translate('share-in-equity-capital-of-partner'),
        className: 'mirage-label',
      },
    ],
    depositsAndWithdrawals: [
      {
        id: 1,
        label: translate('deposits-withdrawals'),
        className: 'mirage-label',
      },
    ]
  }), [taxableYear]);

  const updateBusinessResultsAndDifferences = useCallback(async () => {
    let profitLossResults = DEFAULT_BUSINESS_RESULT.profitLossData;
    let balanceSheetResults = DEFAULT_BUSINESS_RESULT.balanceSheetData;
    const profitAndLossData = getPartnerOrSubjectIncomeFromBusinessData(administrationId, profitAndLossDetails, isPartner, PROFIT_LOSS_OBJECT_KEYS);
    if (profitAndLossData) {
      const { result } = getProfitAndLossTotalAmounts(profitAndLossData);
      if (result) {
        profitLossResults = { ...profitLossResults, currentYearAmount: result[0].currentYearAmount, previousYearAmount: result[0].previousYearAmount };
      }
    }
    const balanceSheetBusinessData = getPartnerOrSubjectIncomeFromBusinessData(administrationId, balanceSheetDetails, isPartner, BALANCE_SHEET_OBJECT_KEYS);
    if (balanceSheetBusinessData?.liabilities?.equityCapital) {
      balanceSheetResults = balanceSheetBusinessData.liabilities.equityCapital.currentYearAmount - balanceSheetBusinessData.liabilities.equityCapital.previousYearAmount;
    }
    setBusinessResult({
      ...DEFAULT_BUSINESS_RESULT,
      profitLossData: profitLossResults,
      balanceSheetData: balanceSheetResults,
    });
  }, [administrationId, balanceSheetDetails, profitAndLossDetails, isPartner]);

  const fetchBalanceSheetDetails = useCallback((administration, updateTotals = true) => {
    let balanceSheetObject = { ...INITIAL_BALANCE_SHEET_DATA };
    if (administration && balanceSheetDetails?.[fieldNamePrefix] && containsGlobalAdministrationId(balanceSheetDetails[fieldNamePrefix], administration)) {
      balanceSheetObject = balanceSheetDetails[fieldNamePrefix].find((obj) => obj.globalAdministrationId === administration);
    }
    setBalanceSheetData((prevState) => ({ ...prevState, [fieldNamePrefix]: balanceSheetObject }));
    if (updateTotals) {
      setTotals(getBalanceSheetTotalAmounts(balanceSheetObject));
      updateBusinessResultsAndDifferences();
    }
  }, [balanceSheetDetails, fieldNamePrefix, updateBusinessResultsAndDifferences]);

  useEffect(() => {
    fetchBalanceSheetDetails(administrationId);
  }, [administrationId, fetchBalanceSheetDetails]);

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
      fetchBalanceSheetDetails(value, false);
    },
    [setAdministrationIds, sourceId, fetchVPCFinancialData, administrationSourceChangeParameters, isPartner, fetchBalanceSheetDetails],
  );

  const handleSourceChange = useHanldeSourceChange(administrationId, sourceId, fetchVPCFinancialData, administrationSourceChangeParameters, isPartner);

  const getUpdatedBalanceSheetDetails = useCallback((updatedBalanceSheetData) => {
    const taxableSubjectBalanceSheet = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      balanceSheetDetails,
      updatedBalanceSheetData,
      BALANCE_SHEET_OBJECT_KEYS.taxableSubject,
      taxableSubjectBusinessId,
    );
    const fiscalPartnerBalanceSheet = getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(
      balanceSheetDetails,
      updatedBalanceSheetData,
      BALANCE_SHEET_OBJECT_KEYS.fiscalPartner,
      fiscalPartnerBusinessId,
    );
    return { ...balanceSheetDetails, taxableSubjectBalanceSheet, fiscalPartnerBalanceSheet };
  }, [balanceSheetDetails, fiscalPartnerBusinessId, taxableSubjectBusinessId]);

  const balanceSheetAssets = useMemo(() => getArrayOfAmountsWithDescription(balanceSheetData[fieldNamePrefix].assets, LABELS, ASSETS_LIABILITIES_CHILDREN_KEYS), [balanceSheetData, fieldNamePrefix]);
  const balanceSheetLiabilities = useMemo(() => getArrayOfAmountsWithDescription(balanceSheetData[fieldNamePrefix].liabilities, LABELS, ASSETS_LIABILITIES_CHILDREN_KEYS), [balanceSheetData, fieldNamePrefix]);
  const depositAndWithdrawals = useMemo(() => getArrayOfAmountsWithDescription(balanceSheetData[fieldNamePrefix].depositsAndWithdrawals, LABELS, ASSETS_LIABILITIES_CHILDREN_KEYS), [balanceSheetData, fieldNamePrefix]);
  const shares = useMemo(() => [{
    description: LABELS.shares,
    previousYearAmount: balanceSheetData[fieldNamePrefix].shares.previousYearAmount,
    currentYearAmount: balanceSheetData[fieldNamePrefix].shares.currentYearAmount,
    key: BALANCE_SHEET_TYPES.shares,
    isCorrectionDataExist: !!balanceSheetData[fieldNamePrefix].shares?.transactions?.length,
  }], [fieldNamePrefix, balanceSheetData]);
  const handleAssetsLiabilitiesModal = useCallback((title, balanceSheetDataType, parentKey) => {
    setBalanceSheetCorrectionData(
      ((balanceSheetDataType)
        ? balanceSheetData[fieldNamePrefix][balanceSheetDataType][parentKey][ASSETS_LIABILITIES_CHILDREN_KEYS[parentKey]]
        : balanceSheetData[fieldNamePrefix][parentKey][ASSETS_LIABILITIES_CHILDREN_KEYS[parentKey]]
      ),
    );
    setCorrectionModalTitle(title.toLowerCase());
    setBalanceSheetKeys({ parentKey, childKey: ASSETS_LIABILITIES_CHILDREN_KEYS[parentKey], balanceSheetDataType });
    setShowCorrectionModal(!showCorrectionModal);
  }, [balanceSheetData, fieldNamePrefix, showCorrectionModal]);

  const getUpdatedCorrectionData = useCallback((correctionData) => cleanDeep(correctionData.filter((correction) => correction.description).map((obj) => ({
    ...obj,
    ...(
      obj.currentYear && {
        currentYear: {
          ...obj.currentYear,
          baseAmount: obj.currentYear.baseAmount || 0,
          finalAmount: (obj.currentYear.baseAmount || 0) + manageCorrection(obj.currentYear.correction),
          correction: manageCorrection(obj.currentYear.correction),
        },
      }
    ),
    ...(
      obj.previousYear && {
        previousYear: {
          ...obj.previousYear,
          baseAmount: obj.previousYear.baseAmount || 0,
          finalAmount: (obj.previousYear.baseAmount || 0) + manageCorrection(obj.previousYear.correction),
          correction: manageCorrection(obj.previousYear.correction),
        },
      }
    ),
  })), true), []);

  const handleAssetsLiabilitiesChanges = useCallback(async ({ correctionData }) => {
    const updatedCorrectionData = getUpdatedCorrectionData(correctionData);
    const assetsLiabilitiesKey = balanceSheetKeys.balanceSheetDataType;
    const { parentKey, childKey } = balanceSheetKeys;
    const updatedParentData = {
      [childKey]: updatedCorrectionData,
      currentYearAmount: getTotalValue(updatedCorrectionData, 'currentYear.baseAmount') + getTotalValue(updatedCorrectionData, 'currentYear.correction'),
      previousYearAmount: getTotalValue(updatedCorrectionData, 'previousYear.baseAmount') + getTotalValue(updatedCorrectionData, 'previousYear.correction'),
    };
    const updatedBalanceSheetData = {
      ...balanceSheetData,
      [fieldNamePrefix]: {
        ...balanceSheetData[fieldNamePrefix],
        ...(assetsLiabilitiesKey ? {
          [assetsLiabilitiesKey]: {
            ...balanceSheetData[fieldNamePrefix][assetsLiabilitiesKey],
            [parentKey]: {
              ...balanceSheetData[fieldNamePrefix][assetsLiabilitiesKey][parentKey],
              ...updatedParentData,
            },
          },
        } : {
          [parentKey]: {
            ...balanceSheetData[fieldNamePrefix][parentKey],
            ...updatedParentData,
          },
        }
        ),
      },
    };
    saveDossierDetails(getUpdatedBalanceSheetDetails(updatedBalanceSheetData), BALANCE_SHEET_DETAILS, true, true);
    calculateUpdatedTax(getUpdatedBalanceSheetDetails(updatedBalanceSheetData), BALANCE_SHEET_DETAILS);
    setShowCorrectionModal(false);
  }, [balanceSheetData, fieldNamePrefix, getUpdatedCorrectionData, balanceSheetKeys, saveDossierDetails, getUpdatedBalanceSheetDetails, calculateUpdatedTax]);

  const isOpeningBalanceNotMatched = getTotalValue(totals.totalAssets, PREVIOUS_YEAR_AMOUNT) !== getTotalValue(totals.totalLiabilities, PREVIOUS_YEAR_AMOUNT);
  const isClosingBalanceNotMatched = getTotalValue(totals.totalAssets, CURRENT_YEAR_AMOUNT) !== getTotalValue(totals.totalLiabilities, CURRENT_YEAR_AMOUNT);

  const totalShares = useMemo(() => [{
    description: LABELS.totalShares,
    previousYearAmount: balanceSheetData[fieldNamePrefix].shares.previousYearAmount,
    currentYearAmount: balanceSheetData[fieldNamePrefix].shares.currentYearAmount,
  }], [balanceSheetData, fieldNamePrefix]);

  return (
    <div className="balance-sheet" data-ta="balance-sheet">
      <TaxAmount />
      <StickyContainer
        customStyles={STICKY_CUSTOM_STYLES}
        stickyContent={(
          <IncomeFromBusinessHeading
            heading={`${translate('balance-sheet')}`}
            location={location}
          />
        )}
      >
        <div className="tab-container">
          <AdministrationsAndSources
            administration={administrationId}
            source={sourceId}
            handleAdministrationChange={handleAdministrationChange}
            handleSourceChange={handleSourceChange}
            disableSource={!checkIsVpcAdministartion(administrationId, fiscalPartnerOrTaxableSubjectBusinessDetails)}
          />
          <SectionTableWrapper className="balance-sheet-section forecast-section">
            { isOpeningBalanceNotMatched && (
              <Alert
                type="danger"
                dataTa="opening-balance-alert"
              >
                <strong>{`${translate('note')}:`}</strong>
                {translate('opening-balance-warning')}
              </Alert>
            )}
            { isClosingBalanceNotMatched && (
              <Alert
                type="danger"
                dataTa="closing-balance-alert"
              >
                <strong>{`${translate('note')}:`}</strong>
                {translate('closing-balance-warning')}
              </Alert>
            )}
            <CommonTable
              values={balanceSheetAssets}
              columns={columns.assets}
              dataTa="balance-sheet-assets"
              handleCorrectionModal={(title, key) => handleAssetsLiabilitiesModal(title, BALANCE_SHEET_TYPES.assets, key)}
              hideAction={hideAction}
            />
            <CommonTable
              values={totals.totalAssets}
              className="totals-table"
              isOpeningBalanceNotMatched={isOpeningBalanceNotMatched}
              isClosingBalanceNotMatched={isClosingBalanceNotMatched}
            />
          </SectionTableWrapper>
          <SectionTableWrapper className="balance-sheet-section forecast-section">
            <CommonTable
              values={balanceSheetLiabilities}
              columns={columns.liabilities}
              dataTa="balance-sheet-liabilities"
              handleCorrectionModal={(title, key) => handleAssetsLiabilitiesModal(title, BALANCE_SHEET_TYPES.liabilities, key)}
              hideAction={hideAction}
            />
            <CommonTable
              values={totals.totalLiabilities}
              className="totals-table"
              isOpeningBalanceNotMatched={isOpeningBalanceNotMatched}
              isClosingBalanceNotMatched={isClosingBalanceNotMatched}
            />
          </SectionTableWrapper>
          { (businessForm === PARTNERSHIP_VALUE || businessForm === VOF_VALUE) && (
            <SectionTableWrapper className="balance-sheet-section forecast-section">
              <CommonTable
                values={shares}
                columns={columns.shares}
                dataTa="balance-sheet-shares"
                handleCorrectionModal={(title, key) => handleAssetsLiabilitiesModal(title, '', key)}
                hideAction={hideAction}
              />
              <CommonTable
                values={totalShares}
                className="totals-table"
              />
            </SectionTableWrapper>
          )}
          <SectionTableWrapper className="balance-sheet-section forecast-section">
            <CommonTable
              values={depositAndWithdrawals}
              columns={columns.depositsAndWithdrawals}
              dataTa="deposits-and-withdrawals"
              handleCorrectionModal={(title, key) => handleAssetsLiabilitiesModal(title, BALANCE_SHEET_TYPES.depositsAndWithdrawals, key)}
              hideAction={hideAction}
            />
            <DepositWithdrawalsDifference
              businessResult={businessResult}
              fieldNamePrefix={fieldNamePrefix}
              balanceSheetData={balanceSheetData}
            />
          </SectionTableWrapper>
        </div>
      </StickyContainer>
      { showCorrectionModal && (
        <BalanceSheetCorrectionModal
          showModal={showCorrectionModal}
          onClose={() => setShowCorrectionModal(false)}
          data={balanceSheetCorrectionData}
          handleSubmit={handleAssetsLiabilitiesChanges}
          title={correctionModalTitle}
          sectionType={balanceSheetKeys.childKey}
          parentSectionType={balanceSheetKeys?.parentKey}
          dataTa="balance-sheet-correction-modal"
          className={`income-from-business-correction-modal balance-sheet__${balanceSheetKeys.childKey}`}
          validationSchema={validationSchema}
        />
      )}
    </div>
  );
};

export default BalanceSheet;

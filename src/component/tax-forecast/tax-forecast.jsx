import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import styled from 'styled-components';
import cloneDeep from 'lodash.clonedeep';
import set from 'lodash.set';
import * as Yup from 'yup';
import { Button, Icon, Tooltip, StatusIndicator } from '@visionplanner/ui-react-material';
import { useAsyncCallback, useDataSource, useModal } from '@visionplanner/vp-ui-fiscal-library';
import { TaxForecastMenu, getForcastMenuSections, TaxForecastMenuTitle } from './tax-forecast-menu';
import * as requests from './tax-forecast-request';
import { getCountriesList } from '../../common/global-requests';
import TaxForecastContext from './tax-forecast-context';
import { cleanDeep, formatMasterData, getGlobalAdvisorId } from '../../common/utils';
import {
  DOSSIER_STATUS,
  APPROVAL_DOSSIER_CHECK_STATUS,
  PROVISIOANL_IB_DECLARATION_DOSSIER_TYPES,
  DOSSIER_SUBMIT_TYPES,
  GENERAL_DETAILS,
  VPC_DATA_SECTIONS,
  DOSSIER_SECTIONS,
  FORM_AND_PARTNER_KEYS_ARRAY,
  FISCAL_PARTNER_BUSINESS_DETAILS_KEY,
  TAXABLE_SUBJECT_BUSINESS_DETAILS_KEY,
  BUSINESS_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY,
  BELONGS_TO_VALUES,
  AUTO_SYNC_STATUSES,
  PERSONAL_DETAILS,
  PARTNERSHIP_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY,
} from './tax-forecast.constants';
import {
  SECTION_KEY as ADDITIONAL_CALCULATION_INFORMATION_KEY,
  SUBJECT_AND_FISCAL_PARTNER_KEYS as ADDITIONAL_CALCULATION_INFORMATION_SUBJECT_AND_FISCAL_PARTNER_KEYS,
} from './additional-calculation-information/additional-calculation-information.constants';
import { LIABILITIES_KEY } from './liabilities/liabilities.constants';
import GeneralDetails from './general-details/general-details';
import PersonalDetails from './personal-details/personal-details';
import { MARITAL_STATUS_VALUES } from './personal-details/personal-details.constants';
import { ALLOCATION_FIELD_NAME } from './allocation/allocation.constants';
import IncomeFromBusiness from './income-from-business/income-from-business';
import ProfitAndLoss from './income-from-business/profit-loss/profit-and-loss';
import BalanceSheet from './income-from-business/balance-sheet/balance-sheet';
import EntrepreneurContainer from './income-from-business/entrepreneur/entrepreneur-container';
import OtherItems from './income-from-business/other-items/other-items';
import IncomeContainer from './income/income-container';
import ExpenditureContainer from './expenditure/expenditure-container';
import AdditionalCalculationInformationContainer from './additional-calculation-information/additional-calculation-information-container';
import AssetsContainer from './assets/assets-container';
import LiabilitiesContainer from './liabilities/liabilities-container';
import AllocationContainer from './allocation/allocation-container';
import Summary from './summary/summary';
import AuditTrail from './audit-trail/audit-trail';
import { getPartnerOrSubjectUpdatedIncomeFromBusinessDetails, updateAllocationData } from './income-from-business/common/utils';
import { taxForecastTranslate as translate } from './tax-forecast-translate';
import { getUpdatedAllocationDetails, isLockedDossier } from './common/utils';
import {
  personalDetailsValidationSchema,
  situationChangedValidationSchema,
  getChildrenValidationSchema,
  getRepresentativeValidationSchema,
} from './personal-details/personal-details-validation-schema';
import { generalDetailsValidationSchema } from './general-details/general-details-validation-schema';
import { DOSSIER_SECTIONS_VALIDATION_SCHEMA } from './dossier-validation-constants';

const dossierStatusTypes = {
  submitToTaxAuthorityFailed: 6,
  acceptedByTaxAuthority: 9,
  rejectedByTaxAuthority: 11,
}

const getDeclarationStatusType = (statusId) => {
  if(statusId === dossierStatusTypes.submitToTaxAuthorityFailed || statusId === dossierStatusTypes.rejectedByTaxAuthority) {
    return 'danger';
  } else if(statusId === dossierStatusTypes.acceptedByTaxAuthority) {
    return 'success';
  } else {
    return 'info';
  }
}

/**
 * Tax Forecast Component display different sections in it based on selection
 *
 */

const TaxForecast = ({
  match,
  history,
  auth,
  location: { search },
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [taxableAmount, setTaxableAmount] = useState(0);
  const [businessIds, setBusinessIds] = useState({});
  const [autoSyncStatus, setAutoSyncStatus] = useState(0);
  const globalClientId = match.params.globalClientId;
  const globalAdviserId = useMemo(() => getGlobalAdvisorId(auth?.userProfile), [auth]);

  const [fiscalData, refreshFiscalData] = useState(null);
  const { showModal } = useModal();

  const fetchCountriesList = useAsyncCallback(() => getCountriesList(), [], { displayLoader: false });
  const [countries] = useDataSource(fetchCountriesList);

  const fetchDossierData = useAsyncCallback(async () => {
    const response = await requests.getDossierData(globalClientId, match.params.declarationId);
    refreshFiscalData(response);
    cleanDeepDossierInfoAndGetInitialTax(response);
    if (response.dossierManifest.declarationStatusId === DOSSIER_STATUS.inProgress) {
      setAutoSyncStatus(AUTO_SYNC_STATUSES.IN_PROCESS);
      const autoSyncResponse = await requests.getAutoSyncData(globalClientId, match.params.declarationId);
      refreshFiscalData(autoSyncResponse);
      setAutoSyncStatus(AUTO_SYNC_STATUSES.COMPLETED);
      setTimeout(() => setAutoSyncStatus(0), 5000);
      cleanDeepDossierInfoAndGetInitialTax(autoSyncResponse);
    }
  }, [globalClientId, match.params.declarationId], { displayLoader: false });

  useEffect(() => {
    fetchDossierData();
  }, [fetchDossierData]);

  const cleanDeepDossierInfoAndGetInitialTax = async (dossierInformation) => {
    DOSSIER_SECTIONS.forEach((section) => {
      dossierInformation[section] = cleanDeep(dossierInformation[section]);
    });
    const { content } = await requests.calculateTax(dossierInformation);
    setTaxableAmount(content.taxableAmount);
  };

  const tabOptions = useMemo(() => {
    const tabs = [];
    if (fiscalData && fiscalData.personalDetails.taxableSubjectDetails) {
      tabs.push({ label: fiscalData.personalDetails.taxableSubjectDetails.firstName });
    }
    if (fiscalData && fiscalData.personalDetails.fiscalPartner) {
      tabs.push({ label: fiscalData.personalDetails.fiscalPartner.firstName });
    }
    return tabs;
  }, [fiscalData]);

  const dossierManifest = fiscalData?.dossierManifest;
  const fetchDataSources = useAsyncCallback(() => {
    if (dossierManifest?.taxableYear && dossierManifest?.declarationTypeId) {
      return requests.getDossierDataSources({
        declarationType: dossierManifest.declarationTypeId,
        taxableYear: dossierManifest.taxableYear,
      });
    }
    return [];
  }, [dossierManifest?.taxableYear, dossierManifest?.declarationTypeId], { displayLoader: false });

  const [dossierDataSources] = useDataSource(fetchDataSources);

  const calculateUpdatedTax = useAsyncCallback(async (data, key, formData = null, fetchAllocationDetails = false) => {
    let dossierDetails = formData ? { ...formData } : { ...fiscalData };
    if (key) {
      dossierDetails[key] = { ...cleanDeep(data, false, (key === ALLOCATION_FIELD_NAME) ? [0] : []) };
    }
    if (fetchAllocationDetails && dossierDetails?.personalDetails?.isJointDeclaration) {
      dossierDetails = await getUpdatedAllocationDetails(dossierDetails);
    }
    /** To save initialized data in context - without cleandeep */
    refreshFiscalData({
      ...dossierDetails,
      ...(key && { [key]: data }),
    });

    DOSSIER_SECTIONS.forEach((section) => {
      dossierDetails[section] = cleanDeep(dossierDetails[section]);
    });
    const { content } = await requests.calculateTax(dossierDetails);
    setTaxableAmount(content.taxableAmount);
  }, [fiscalData], { displayLoader: false, handleErrors: false });

  const saveDossierDetails = useAsyncCallback(async (data, key, callSaveDeclaration = true, fetchUpdatedData = false, isBusinessFormModified = false, businessId = '') => {
    let dossierDetails = key ? { ...fiscalData, [key]: { ...data } } : { ...fiscalData, ...data };
    if (data?.isJointDeclaration || data?.taxableSubjectDetails?.maritalStatus === MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR) {
      ADDITIONAL_CALCULATION_INFORMATION_SUBJECT_AND_FISCAL_PARTNER_KEYS.forEach((subjectOrPartner) => {
        set(dossierDetails,
          `${ADDITIONAL_CALCULATION_INFORMATION_KEY}.${subjectOrPartner}.taxCredit.incomeOutOfLaborForFiscalPartner`,
          null);
        set(dossierDetails,
          `${ADDITIONAL_CALCULATION_INFORMATION_KEY}.${subjectOrPartner}.taxCredit.dateOfBirthOfFiscalPartner`,
          null);
      });
    }
    if (key === PERSONAL_DETAILS) {
      // remove additional calculation information if joint decalration removed in personal details
      dossierDetails = updateAllocationData(dossierDetails, data.isJointDeclaration);
    }
    if (isBusinessFormModified && businessId) {
      dossierDetails = removePartnershipData(dossierDetails, businessId);
    }
    if (callSaveDeclaration) {
      await requests.saveDeclaration(globalClientId, match.params.declarationId, {
        ...cleanDeep({
          ...dossierDetails,
          [key]: { ...data },
        }),
      });
    }
    if (fetchUpdatedData) {
      const updatedData = await requests.getDossierData(globalClientId, match.params.declarationId);
      dossierDetails = { ...fiscalData, ...updatedData };
    }
    refreshFiscalData(dossierDetails);
  }, [fiscalData, refreshFiscalData, activeTab]);

  const removePartnershipData = (dossierDetails, globalAdministrationId) => {
    const isPartner = !!activeTab;
    PARTNERSHIP_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY.forEach(({
      sectionKey, subjectKey, partnerKey,
    }) => {
      const sectionData = { ...dossierDetails[sectionKey] };
      const subjectOrPartnerKey = isPartner ? partnerKey : subjectKey;
      if (sectionData?.[subjectOrPartnerKey]) {
        const businessIndex = sectionData?.[subjectOrPartnerKey].findIndex((business) => business.globalAdministrationId === globalAdministrationId);
        if (businessIndex > -1) {
          sectionData[subjectOrPartnerKey][businessIndex] = {
            ...sectionData[subjectOrPartnerKey][businessIndex],
            shares: {
              transactions: [],
              previousYearAmount: 0,
              currentYearAmount: 0,
            },
          };
          dossierDetails[sectionKey] = {
            ...sectionData,
          };
        }
      }
    });
    return dossierDetails;
  };

  useEffect(() => {
    if (fiscalData && isEmpty(businessIds)) {
      const { taxableSubjectBusinessDetails, fiscalPartnerBusinessDetails } = fiscalData.businessDetails;
      setBusinessIds({
        taxableSubjectBusinessId: taxableSubjectBusinessDetails?.[0]?.globalAdministrationId,
        fiscalPartnerBusinessId: fiscalPartnerBusinessDetails?.[0]?.globalAdministrationId,
      });
    }
  }, [businessIds, fiscalData]);

  const setAdministrationIds = useCallback((id, redirect = false) => {
    if (activeTab) {
      setBusinessIds({
        ...businessIds,
        fiscalPartnerBusinessId: id,
      });
    } else {
      setBusinessIds({
        ...businessIds,
        taxableSubjectBusinessId: id,
      });
    }
    if (redirect) {
      history.push(`${match.url}/profit-and-loss`);
    }
  }, [activeTab, businessIds, history, match.url]);

  const fetchVPCFinancialData = useAsyncCallback(async (parameters, isPartner, businessData = null) => {
    let taxableSubjectOrFiscalPartnerBusinessDetails = {};
    let businessDetailsKey = '';
    const currentFiscalData = businessData ? { ...fiscalData, businessDetails: { ...businessData } } : { ...fiscalData };
    if (isPartner) {
      taxableSubjectOrFiscalPartnerBusinessDetails = [...currentFiscalData.businessDetails[FISCAL_PARTNER_BUSINESS_DETAILS_KEY]];
      businessDetailsKey = FISCAL_PARTNER_BUSINESS_DETAILS_KEY;
    } else {
      taxableSubjectOrFiscalPartnerBusinessDetails = [...currentFiscalData.businessDetails[TAXABLE_SUBJECT_BUSINESS_DETAILS_KEY]];
      businessDetailsKey = TAXABLE_SUBJECT_BUSINESS_DETAILS_KEY;
    }
    const { dataSourceId, businessPartnerId } = taxableSubjectOrFiscalPartnerBusinessDetails.find((business) => business.globalAdministrationId === parameters.globalAdministrationId);
    let vpcResponse;
    if (dataSourceId === parameters.dataSource && !businessData) {
      const { content } = await requests.getDossierLatestFinancialData({
        businessPartnerId,
        forFiscalPartner: isPartner,
        globalDossierId: currentFiscalData.dossierManifest.dossierId,
        globalClientId: parameters.TaxableSubjectID,
        globalAdministrationId: parameters.globalAdministrationId,
        taxableYear: parameters.taxableYear,
        declarationTypeId: parameters.declarationTypeId,
        dataSource: parameters.dataSource,
      });
      vpcResponse = content;
    } else {
      const { content } = await requests.getVPCFinancialData({ ...parameters, businessPartnerId });
      vpcResponse = content;
    }
    const updateDossierWithVPCData = {};
    VPC_DATA_SECTIONS.forEach(({
      sectionKey, subjectPrefix, parnterPrefix, vpcResponseKey,
    }) => {
      const fiscalDetails = { ...currentFiscalData[sectionKey] };
      if (!isPartner) {
        // Updating taxable subject Details
        fiscalDetails[subjectPrefix] = (fiscalDetails?.[subjectPrefix])
          ? getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(fiscalDetails, vpcResponse[vpcResponseKey], subjectPrefix, parameters.globalAdministrationId, true)
          : [vpcResponse[vpcResponseKey]];
      } else {
        // Updating fiscal partner Details
        fiscalDetails[parnterPrefix] = (fiscalDetails?.[parnterPrefix])
          ? getPartnerOrSubjectUpdatedIncomeFromBusinessDetails(fiscalDetails, vpcResponse[vpcResponseKey], parnterPrefix, parameters.globalAdministrationId, true)
          : [vpcResponse[vpcResponseKey]];
      }
      updateDossierWithVPCData[sectionKey] = fiscalDetails;
    });

    const businessIdIndex = taxableSubjectOrFiscalPartnerBusinessDetails.findIndex((business) => business.globalAdministrationId === parameters.globalAdministrationId);
    const updatedBusinessDetails = {
      ...taxableSubjectOrFiscalPartnerBusinessDetails[businessIdIndex],
      dataSourceId: parameters.dataSource,
    };
    taxableSubjectOrFiscalPartnerBusinessDetails[businessIdIndex] = updatedBusinessDetails;
    const updatedFiscalData = {
      ...currentFiscalData,
      businessDetails: {
        ...currentFiscalData.businessDetails,
        [businessDetailsKey]: taxableSubjectOrFiscalPartnerBusinessDetails,
      },
      ...updateDossierWithVPCData,
    };
    refreshFiscalData(updatedFiscalData);
    calculateUpdatedTax(null, null, updatedFiscalData);
    await requests.saveDeclaration(globalClientId, match.params.declarationId, cleanDeep(updatedFiscalData));
  }, [fiscalData]);

  const menuItems = useMemo(() => getForcastMenuSections(match.url, fiscalData, search, activeTab), [match.url, fiscalData, search, activeTab]);

  const removePartnerDataFromJointSections = (form, formKey, jointKey) => {
    const jointData = { ...form[jointKey] };
    if (formKey === LIABILITIES_KEY) {
      /** remove fiscal partner values and update with taxable subject which are having both in belongs to option in loans for own home */
      jointData.loansForOwnHome = jointData?.loansForOwnHome?.map((item) => {
        item.loanDetails.belongsTo = (item.loanDetails.belongsTo === BELONGS_TO_VALUES.BOTH ? BELONGS_TO_VALUES.TAXABLE_SUBJECT : item.loanDetails.belongsTo);
        return item;
      });
      jointData.loansForOwnHome = jointData?.loansForOwnHome?.filter((item) => item.loanDetails.belongsTo !== BELONGS_TO_VALUES.FISCAL_PARTNER);

      /** remove fiscal partner values and update with taxable subject which are having both in belongs to option in other loans */
      jointData.otherLoans = jointData?.otherLoans?.map((item) => {
        item.belongsTo = (item.belongsTo === BELONGS_TO_VALUES.BOTH ? BELONGS_TO_VALUES.TAXABLE_SUBJECT : item.belongsTo);
        return item;
      });
      jointData.otherLoans = jointData?.otherLoans?.filter((item) => item.belongsTo !== BELONGS_TO_VALUES.FISCAL_PARTNER);

      /** remove fiscal partner values and update with taxable subject which are having both in belongs to option in residual loans */
      jointData.residualLoans = jointData?.residualLoans?.map((item) => {
        item.loanDetails.belongsTo = (item.loanDetails.belongsTo === BELONGS_TO_VALUES.BOTH ? BELONGS_TO_VALUES.TAXABLE_SUBJECT : item.loanDetails.belongsTo);
        return item;
      });
      jointData.residualLoans = jointData?.residualLoans?.filter((item) => item.loanDetails.belongsTo !== BELONGS_TO_VALUES.FISCAL_PARTNER);
    } else {
      const jointSectionKeys = Object.keys(jointData);
      jointSectionKeys.forEach((section) => {
        jointData[section] = jointData?.[section]?.map((item) => {
          item.belongsTo = (item.belongsTo === BELONGS_TO_VALUES.BOTH ? BELONGS_TO_VALUES.TAXABLE_SUBJECT : item.belongsTo);
          return item;
        });
      });
      jointSectionKeys.forEach((section) => {
        jointData[section] = jointData?.[section]?.filter((item) => item.belongsTo !== BELONGS_TO_VALUES.FISCAL_PARTNER);
      });
    }

    return jointData;
  };

  const removePartnerData = async (personalDetails) => {
    setActiveTab(0);
    const dossierDetails = cloneDeep(fiscalData);
    dossierDetails.personalDetails = { ...personalDetails };
    /** Clear Income from employment tax partner & Date of birth tax partner in Additional Calculation Information - Tax Credit */
    set(dossierDetails,
      `${ADDITIONAL_CALCULATION_INFORMATION_KEY}.${ADDITIONAL_CALCULATION_INFORMATION_SUBJECT_AND_FISCAL_PARTNER_KEYS[0]}.taxCredit.incomeOutOfLaborForFiscalPartner`,
      null);
    set(dossierDetails,
      `${ADDITIONAL_CALCULATION_INFORMATION_KEY}.${ADDITIONAL_CALCULATION_INFORMATION_SUBJECT_AND_FISCAL_PARTNER_KEYS[0]}.taxCredit.dateOfBirthOfFiscalPartner`,
      null);
    FORM_AND_PARTNER_KEYS_ARRAY.forEach(({ formKey, partnerKey, jointKey }) => {
      let sectionData = { ...dossierDetails[formKey] };
      if (jointKey && sectionData?.[jointKey]) {
        sectionData[jointKey] = removePartnerDataFromJointSections(sectionData, formKey, jointKey);
      } else if (partnerKey && sectionData?.[partnerKey]) {
        sectionData[partnerKey] = null;
      } else {
        sectionData = null;
      }
      dossierDetails[formKey] = { ...sectionData };
    });
    dossierDetails.masterData.owners = dossierDetails.masterData.owners.filter((item) => item.value === BELONGS_TO_VALUES.TAXABLE_SUBJECT);
    dossierDetails.masterData.parentCollectingChildCareOptions = dossierDetails.masterData.parentCollectingChildCareOptions.filter((item) => item.value === BELONGS_TO_VALUES.TAXABLE_SUBJECT);

    refreshFiscalData({ ...dossierDetails });
    await requests.saveDeclaration(globalClientId, match.params.declarationId, cleanDeep(dossierDetails));
  };

  const removeDeletedAdministrationRecordsFromJointSection = (sectionData, jointKey, sectionsWithAdministrations, globalAdministrationId) => {
    const jointSection = { ...sectionData?.[jointKey] };
    sectionsWithAdministrations.forEach((section) => {
      if (jointSection?.[section]) {
        jointSection[section] = jointSection[section].filter((obj) => obj.globalAdministrationId !== globalAdministrationId);
      }
    });
    return jointSection;
  };

  const removeAdministration = async (globalAdministrationId, isPartner) => {
    const dossierDetails = { ...fiscalData };
    BUSINESS_SECTION_AND_SUBJECT_PARTNER_KEYS_ARRAY.forEach(({
      sectionKey, subjectKey, partnerKey, jointKey, sectionsWithAdministrations,
    }) => {
      const sectionData = { ...dossierDetails[sectionKey] };
      const subjectOrPartnerKey = isPartner ? partnerKey : subjectKey;
      if (jointKey && sectionData?.[jointKey]) {
        dossierDetails[sectionKey] = {
          ...sectionData,
          [jointKey]: removeDeletedAdministrationRecordsFromJointSection({ ...sectionData }, jointKey, sectionsWithAdministrations, globalAdministrationId),
        };
      } else if (sectionData?.[subjectOrPartnerKey] && sectionKey !== 'entrepreneurDetails') {
        dossierDetails[sectionKey] = {
          ...sectionData,
          [subjectOrPartnerKey]: sectionData?.[subjectOrPartnerKey].filter((obj) => obj.globalAdministrationId !== globalAdministrationId),
        };
      } else if (sectionData?.[subjectOrPartnerKey]?.fiscalPensionReserve?.pensionReserveDetails?.length) {
        dossierDetails[sectionKey] = {
          ...sectionData,
          [subjectOrPartnerKey]: {
            ...sectionData[subjectOrPartnerKey],
            fiscalPensionReserve: {
              ...sectionData[subjectOrPartnerKey].fiscalPensionReserve,
              pensionReserveDetails: sectionData[subjectOrPartnerKey].fiscalPensionReserve.pensionReserveDetails.filter((obj) => obj.description !== globalAdministrationId),
            },
          },
        };
      }
    });
    refreshFiscalData({ ...dossierDetails });
    const { taxableSubjectBusinessDetails, fiscalPartnerBusinessDetails } = dossierDetails.businessDetails;
    setBusinessIds({
      taxableSubjectBusinessId: taxableSubjectBusinessDetails?.[0]?.globalAdministrationId,
      fiscalPartnerBusinessId: fiscalPartnerBusinessDetails?.[0]?.globalAdministrationId,
    });
    const { content } = await requests.calculateTax(cleanDeep(dossierDetails));
    setTaxableAmount(content.taxableAmount);
    await requests.saveDeclaration(globalClientId, match.params.declarationId, cleanDeep(dossierDetails));
  };

  const handleReopenDossier = async () => {
    showModal('approval-modal', {
      title: translate('reopen-dossier'),
      inValidFormsList: await checkDossierValidation(),
      confimationText: translate('reopen-dossier-confiramtion-message'),
      submitBtnText: translate('submit-label'),
      submitDossier: () => submitDossier(DOSSIER_SUBMIT_TYPES[2]),
    });
  };

  const handleImportDossier = () => {
    showModal('import-dossier-modal',
      {
        title: translate('import-dossier-title'),
        taxationYear: dossierManifest.taxableYear,
        globalAdviserId,
        globalClientId,
        handleImportClick,
        currentDossierId: match.params.declarationId,
      });
  };

  const handleImportClick = useAsyncCallback(async (data) => {
    const dossierId = await requests.importDossier(
      globalClientId,
      {
        globalAdviserId,
        globalDossierID: match.params.declarationId,
        ...data,
      },
    );
    !!dossierId && fetchDossierData();
  }, [globalAdviserId, globalClientId, match.params.declarationId, fetchDossierData]);

  const checkDossierValidation = async () => {
    const inValidFormsList = [];
    await Promise.all(DOSSIER_SECTIONS_VALIDATION_SCHEMA.map(async (form) => {
      if (form.key === PERSONAL_DETAILS) {
        const validationSchema = Yup.object().shape({
          taxableSubjectDetails: personalDetailsValidationSchema(fiscalData.dossierManifest.taxableYear),
          fiscalPartner: personalDetailsValidationSchema(fiscalData.dossierManifest.taxableYear),
          relationShipSituation: situationChangedValidationSchema(fiscalData.dossierManifest.taxableYear),
          children: getChildrenValidationSchema(fiscalData.personalDetails.taxableSubjectDetails.bsn, fiscalData.personalDetails?.fiscalPartner?.bsn),
          representative: getRepresentativeValidationSchema(),
        });
        const result = await validationSchema.isValid(fiscalData.personalDetails);
        if (!result) {
          inValidFormsList.push(form.label);
        }
      } else if (form.key === GENERAL_DETAILS) {
        const validationSchema = Yup.object().shape({
          taxablesubjectGeneralInformation: generalDetailsValidationSchema,
          ...(fiscalData?.personalDetails?.generalDetails?.fiscalPartnerGeneralInformation && { fiscalPartnerGeneralInformation: generalDetailsValidationSchema }),
        });
        const result = await validationSchema.isValid(fiscalData.personalDetails?.generalDetails);
        if (!result) {
          inValidFormsList.push(form.label);
        }
      } else if (fiscalData?.[form.key]) {
        const result = await form.schema.isValid(fiscalData[form.key]);
        if (!result) {
          inValidFormsList.push(form.label);
        }
      }
    }));
    return inValidFormsList;
  };

  const submitDossier = useAsyncCallback(async (actionType, data = {}) => {
    const submitStatus = await requests.submitDossier(globalAdviserId, match.params.declarationId, { actionType: actionType, ...data });
    submitStatus && fetchDossierData();
  }, [globalAdviserId, match.params.declarationId, fetchDossierData]);

  const isDossierLocked = useMemo(() => isLockedDossier(fiscalData?.dossierManifest?.declarationStatusId), [fiscalData?.dossierManifest?.declarationStatusId]);

  const confirmationEmailsForDirectSubmit = useMemo(() => ({
    taxableSubjectEmailId: fiscalData?.personalDetails?.generalDetails?.taxablesubjectGeneralInformation?.emailId,
    fiscalPartnerEmailId: fiscalData?.personalDetails?.generalDetails?.fiscalPartnerGeneralInformation?.emailId,
  }), [fiscalData]);

  // this will be enable audit trail secion, download PDF in summary secion if dossier is locked
  const enableAuditTrailSectionOrDownloadPdf = useMemo(() => (isDossierLocked && ((`${match.url}/audit-trail` === history.location.pathname) || (`${match.url}/summary` === history.location.pathname))), [match.url, history.location.pathname]);

  return (
    <TaxForecastSection className="main-container">
      {fiscalData && (
        <>
          <TaxForecastMenu
            menuList={menuItems}
            className="forecast-menu"
            handleClick={(item) => {
              item.value !== `${match.url}/personal-details` && calculateUpdatedTax(null, null, null, true);
              if (item.value !== history.location.pathname) {
                history.push(item.value);
              }
            }}
            dataTa="forecast-menu"
            title={(
              <TaxForecastMenuTitle
                title={`${fiscalData.dossierManifest.declarationType} ${fiscalData.dossierManifest.taxableYear}`}
                handleImport={handleImportDossier}
                handleReopen={handleReopenDossier}
                declarationTypeId={dossierManifest?.declarationTypeId}
                declarationStatusId={dossierManifest?.declarationStatusId}
              />
            )}
            subTitle={(
              <>
                <StatusIndicator
                  data-ta="declaration-status"
                  className="mar-t-xs"
                  type={getDeclarationStatusType(fiscalData?.dossierManifest?.declarationStatusId)}
                >
                  {fiscalData.dossierManifest.declarationStatus}
                </StatusIndicator>
                {(APPROVAL_DOSSIER_CHECK_STATUS.includes(fiscalData.dossierManifest?.declarationStatusId) && PROVISIOANL_IB_DECLARATION_DOSSIER_TYPES.includes(fiscalData.dossierManifest?.declarationTypeId)) && (<div className="flex mar-t-md">
                  {/* TODO: will be reverted after Elfin release */}
                  {/* {(fiscalData.dossierManifest?.declarationStatusId === DOSSIER_STATUS.inProgress) && (<Button
                    dataTa="send-for-client-approval"
                    onClick={async () => {
                      showModal('approval-modal',
                        {
                          title: translate('send-for-client-approval'),
                          inValidFormsList: await checkDossierValidation(),
                          confimationText: translate('send-for-client-approval-confirmation-message'),
                          submitBtnText: translate('send-label'),
                          submitDossier: () => submitDossier(DOSSIER_SUBMIT_TYPES[0]),
                        });
                    }}
                    buttonType="secondary"
                  >
                    {translate('send-for-client-approval')}
                  </Button>)} */}
                  <Tooltip overlay={translate('submit-to-tax-authority')} placement="bottomLeft">
                    <span className="direct-approval-btn pad-l-xs">
                      <Button
                        buttonType="secondary"
                        onClick={async () => {
                          showModal('approval-modal',
                            {
                              title: translate('submit-to-tax-authority'),
                              inValidFormsList: await checkDossierValidation(),
                              confimationText: translate((fiscalData.dossierManifest?.declarationStatusId === DOSSIER_STATUS.inProgress) ? 'submit-to-tax-authority-confirmation-message' : 'submit-to-tax-authority-when-send-for-client-approval-confirmation-message'),
                              submitBtnText: translate('submit-label'),
                              submitDossier: (data) => submitDossier(DOSSIER_SUBMIT_TYPES[1], data),
                              confirmationEmailsForDirectSubmit,
                            });
                        }}
                        dataTa="send-direct-approval"
                      >
                        <Icon iconSet="far" name="paper-plane" className="paper-plane-icon" />
                      </Button>
                    </span>
                  </Tooltip>
                </div>)}
              </>
            )}
            activeMenu={`${history.location.pathname}${search}`}
          />
          <section className="dossier-forecast-section" data-ta="dossier-forecast-section">
            <div className={`main-section main-section--forecast ${enableAuditTrailSectionOrDownloadPdf && 'main-section--forecast--enable'}`} data-ta="tax-forecast-section">
              { autoSyncStatus === 1 && <div className="overlay" /> }
              <TaxForecastContext.Provider
                value={{
                  dossierData: fiscalData,
                  countries: formatMasterData(countries),
                  isPartner: !!activeTab,
                  activeTab,
                  setActiveTab,
                  tabOptions,
                  dossierDataSources,
                  administrationIds: businessIds,
                  taxableAmount,
                  calculateUpdatedTax,
                  saveDossierDetails,
                  setAdministrationIds,
                  fetchVPCFinancialData,
                  globalClientId,
                  globalAdviserId,
                  removePartnerData,
                  removeAdministration,
                  setTaxableAmount,
                  autoSyncStatus,
                  isDossierLocked,
                }}
              >
                <Switch>
                  <Route path={`${match.path}/general-information`} component={GeneralDetails} />
                  <Route path={`${match.path}/personal-details`} component={PersonalDetails} />
                  <Route path={`${match.path}/income-from-business`} component={IncomeFromBusiness} />
                  <Route path={`${match.path}/profit-and-loss`} component={ProfitAndLoss} />
                  <Route path={`${match.path}/balance-sheet`} component={BalanceSheet} />
                  <Route path={`${match.path}/other-items`} component={OtherItems} />
                  <Route path={`${match.path}/entrepreneur`} component={EntrepreneurContainer} />
                  <Route path={`${match.path}/income`} component={IncomeContainer} />
                  <Route path={`${match.path}/expenditure`} component={ExpenditureContainer} />
                  <Route path={`${match.path}/assets`} component={AssetsContainer} />
                  <Route path={`${match.path}/liabilities`} component={LiabilitiesContainer} />
                  <Route path={`${match.path}/additional-calculation-information`} component={AdditionalCalculationInformationContainer} />
                  {
                    (fiscalData?.personalDetails?.fiscalPartner && fiscalData?.personalDetails?.isJointDeclaration) && <Route path={`${match.path}/allocation`} component={AllocationContainer} />
                  }
                  <Route path={`${match.path}/summary`} component={Summary} />
                  <Route path={`${match.path}/audit-trail`} component={AuditTrail} />
                  <Route>
                    <Redirect to={`${match.url}/general-information${search}`} />
                  </Route>
                </Switch>
              </TaxForecastContext.Provider>
            </div>
            {
              (isDossierLocked) && (
                <div data-ta="locked-dossier" className="overlay overlay__lock" />
              )
            }
          </section>
        </>
      )}
    </TaxForecastSection>
  );
};

TaxForecast.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      declarationId: PropTypes.string,
    }),
  }),
};

export default TaxForecast;

const TaxForecastSection = styled.section`
  .direct-approval-btn {
    margin-left: auto;
    & > button {
      min-width: 35px;
    }
  }

  .dossier-forecast-section {
    position: relative;
    flex: 1 1 auto;
    padding-left: 265px;
    width: 0;
  }

  &&& .main-section--forecast {
    position: relative;
    margin: 0;
    max-width: 880px;
    padding: 0 ${({ theme }) => theme.paddings.large};

    &--enable {
      z-index: 3;
    }

    @media (min-width: 1450px) {
      max-width: 80%;
    }
  }

  .rmwc-collapsible-list__children-inner {
    margin-left: ${({ theme }) => theme.margins.large};
    border-left: 2px solid ${({ theme }) => theme.secondaryBorder};
  }

  .sticky-container,
  .administrations-sources-container {
    background-color: ${({ theme }) => theme.whiteBackground};
    padding-top: ${({ theme }) => theme.paddings.base};
    position: relative;
    z-index: 4;

    .data-source-select {
      .react-select__single-value {
        text-transform: capitalize;
      }
    }

    .mdc-typography--headline3 {
      font-family: ${({ theme }) => theme.fontStyles.title};
      line-height: 3.125rem;
    }

    &.sticky {
      border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
      top: 64px !important;

      &__dropdowns {
        border: none;
        top: 189px !important;
      }
    }
  }

  .income-from-business,
  .income-container,
  .assets-container,
  .liabilities-container,
  .balance-sheet,
  .summary,
  .profit-loss {
    .sticky-container {
      border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
    }
  }

  .common-data-table {
    overflow-y: hidden;
    border-color: ${({ theme }) => theme.inputBorder};
    width: 100%;

    &__cell {
      border-color: ${({ theme }) => theme.inputBorder};
      font-size: ${({ theme }) => theme.fontSizes.fs14};
      padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.medium};
    }

    &__head-cell {
      text-transform: uppercase;
      color: ${({ theme }) => theme.currencyText};
      font-size: ${({ theme }) => theme.fontSizes.fs12};
      font-weight: 500;
      height: auto;
    }
  }

  .tabs-list {
    .mdc-tab-scroller__scroll-content {
      flex: 0 0 auto;
    }

    .mdc-tab-scroller--animating .mdc-tab-scroller__scroll-content {
      transition: none;
    }

    .mdc-tab {
      letter-spacing: 0;

      &__content {
        font-size: ${({ theme }) => theme.fontSizes.fs18};
      }

      &__text-label {
        color: ${({ theme }) => theme.colors.mirage};
        text-transform: capitalize;
      }
    }
  }

  .forecast-section {
    border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
    margin-bottom: ${({ theme }) => theme.margins.large};
    position: relative;

    .common-data-table {
      border: none;

      &__cell {
        border: none;
        line-height: 1.2;
        padding: ${({ theme }) => theme.paddings.small} 0 ${({ theme }) => theme.paddings.small};
        vertical-align: top;

        &.text-align-right {
          > div {
            float: right;
          }
        }
      }

      &__body {
        .col-actions {
          .edit {
            color: ${({ theme }) => theme.primary};
            cursor: pointer;
          }
        }

        .table-footer {
          color: ${({ theme }) => theme.currencyText};
          font-size: ${({ theme }) => theme.fontSizes.fs18};
          text-align: right;

          &.col-description {
            text-align: left;
          }
        }
      }
    }
  }

  .mdc-layout-grid {
    padding: ${({ theme }) => theme.paddings.base} 0;

    &__cell {
      color: ${({ theme }) => theme.colors.mirage};
      font-size: ${({ theme }) => theme.fontSizes.fs14};
      margin: auto 0;
    }
  }

  .currency-input {
    input {
      text-align: right;
    }
  }

  .mdc-drawer {
    z-index: 3;
  }

  .income-section,
  .income-from-business-correction-modal {
    .common-data-table__body {
      .common-data-table__row:hover {
        background-color: transparent;
      }
    }
  }

  .overlay {
    position: fixed;
    display: block;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    cursor: progress;

    &__lock {
      cursor: not-allowed;
    }
  }

  /** will be removed after making changes in common component */
  .auto-sync-success {
    background: ${({ theme }) => theme.colors.panache};
    border-left: 4px #86c994 solid !important;
  }
`;

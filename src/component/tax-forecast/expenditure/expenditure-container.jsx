import React, {
  useContext, useCallback, useEffect, useState, useRef,
} from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AutoSave, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { expenditureTranslate as translate } from './expenditure-translate';
import {
  SECTION_LIST, EXPENDITURE_KEY_TYPE_ARRAY, EXPENDITURE_SECTION_KEYS_ARRAY,
  JOINT_SECTION_KEYS_ARRAY, EXPENDITURE_FIELD_NAME, SECTION_KEYS, RESERVE_MARGIN_YEARS,
  THRESHOLD_REPORT_TYPE, REPORT_KEYS, HEALTH_REPORT_KEYS, STARTING_HEALTH_REPORT_SECTION_INDEX,
  HEALTHCARE_SECTION_KEY, STUDY_GRANT_KEY, EDUCATIONAL_SECTION_KEY, ALIMONY_KEY, REPORT_REMOVAL_KEYS,
} from './expenditure.constants';
import TaxForecastContext from '../tax-forecast-context';
import { INITIAL_EXPENDITURE_DATA, INITIAL_REPORT_DATA } from './expenditure-initial-data';
import { expenditureFormValidationSchema } from './expenditure-validation-schema';
import PublicTransportDeductions from './deduction-for-public-transport';
import AnnuityPremium from './annuity-premium';
import PremiumCommonSection from './common/premium-common-section';
import { ContainerWrapper as ExpenditureWrapper } from '../../../common/styled-wrapper';
import DossierGenericContainer from '../common/dossier-generic-container';
import { cleanDeep } from '../../../common/utils';
import * as requests from '../tax-forecast-request';
import { getUpdatedAllocationDetails } from '../common/utils';
import Alimony from './alimony';
import GiftsToCharity from './gifts-to-charity';
import ExpensesForHealthcare from './expenses-for-healthcare';
import EducationalExpenses from './educational-expenses';
import WeekendExpensesForChildrenWithDisabilities from './weekend-expenses-for-children-with-disabilities';
/** Will be enabled after pilot */
// import WaivedVentureCapital from './waived-venture-capital';
import { taxCalculationReport, aggrigatedTaxCalculationReport } from './expenditure-requests';
import { ALLOCATION_FIELD_NAME } from '../allocation/allocation.constants';

/**
 *
 * Tax Forecast - Expenditure Component which contains multiple expenditure sections for Taxable Subject, Fiscal Partner and Joints (Common)
 */

const ExpenditureContainer = ({
  fieldNamePrefix,
  shouldDisplaySection,
  values,
  setValues,
  handleSelectedSection,
  calculateUpdatedTax,
  isDirty,
  isSubmitting,
  setFormChanged,
  reportTotalValues,
}) => {
  const {
    dossierData: {
      dossierManifest: {
        taxableYear,
        dossierId,
      },
    },
    dossierData,
    isPartner,
    countries,
    saveDossierDetails,
    globalClientId,
    setTaxableAmount,
  } = useContext(TaxForecastContext);
  const [reportData, setReportData] = useState(INITIAL_REPORT_DATA);
  const initialCalculateReportRef = useRef(true);

  useEffect(() => {
    if (reportTotalValues) {
      if (initialCalculateReportRef.current) {
        if (shouldDisplaySection(SECTION_LIST[6].value) || shouldDisplaySection(SECTION_LIST[7].value)) {
          updateThresholdAndTotals(reportTotalValues);
        } else {
          setReportData(reportTotalValues);
        }
      }
      initialCalculateReportRef.current = false;
    }
  }, [reportTotalValues, shouldDisplaySection, updateThresholdAndTotals]);

  const updateSubjectOrPartnerData = (formValues, subjectOrPartnerKey) => ({
    ...formValues[subjectOrPartnerKey],
    expensesForPublicTransportation: {
      ...formValues[subjectOrPartnerKey].expensesForPublicTransportation,
      totalDeductionForExpenses: reportData[subjectOrPartnerKey].reportValues.totalDeductionForExpenses,
    },
    premiumForAnnuity: {
      ...formValues[subjectOrPartnerKey].premiumForAnnuity,
      totalDeductionForAnnuity: reportData[subjectOrPartnerKey].reportValues.totalDeductionForAnnuity,
    },
    educationalExpenses: {
      ...formValues[subjectOrPartnerKey].educationalExpenses,
      totalDeductionForEducationalExpenses: reportData[subjectOrPartnerKey].reportValues.totalDeductionForEducationalExpenses,
      treshold: reportData[subjectOrPartnerKey].thresholdValues.educationalExpenses,
    },
  });
  const handleSave = useAsyncCallback(async (formValues, isReportTotalsUpdateRequired = true) => {
    let dossierDetails = { ...dossierData };
    const formData = isReportTotalsUpdateRequired ? {
      ...formValues,
      taxableSubjectExpenditureDetails: { ...updateSubjectOrPartnerData(formValues, 'taxableSubjectExpenditureDetails') },
      fiscalPartnerExpendituresDetails: { ...updateSubjectOrPartnerData(formValues, 'fiscalPartnerExpendituresDetails') },
      jointExpendituresDetails: {
        ...formValues.jointExpendituresDetails,
        giftsToCharity: {
          ...formValues.jointExpendituresDetails.giftsToCharity,
          totalDeductionForGiftsToCharity: reportData.jointExpendituresDetails.reportValues.totalDeductionForGiftsToCharity,
          threshold: reportData.jointExpendituresDetails.thresholdValues.giftsToCharity,
        },
        weekendExpensesForChildrenWithDisabilities: {
          ...formValues.jointExpendituresDetails.weekendExpensesForChildrenWithDisabilities,
          totalDeductionForChildrenWithDisabilities: reportData.jointExpendituresDetails.reportValues.totalDeductionForChildrenWithDisabilities,
        },
        expensesForHealthcare: {
          ...formValues.jointExpendituresDetails.expensesForHealthcare,
          totalDeductionForHealthcare: reportData.jointExpendituresDetails.reportValues.totalDeductionForHealthcare,
          threshold: reportData.jointExpendituresDetails.thresholdValues.expensesForHealthcare,
          additionalFamilySupport: {
            ...formValues.jointExpendituresDetails.expensesForHealthcare.additionalFamilySupport,
            reportAmount: reportData.jointExpendituresDetails.reportValues.reportAmount,
          },
          prescribedDiet: {
            ...formValues.jointExpendituresDetails.expensesForHealthcare.prescribedDiet,
            totalExpensesPrescribedDiet: reportData.jointExpendituresDetails.reportValues.totalExpensesPrescribedDiet,
          },
          travelExpensesForHealthcare: {
            ...formValues.jointExpendituresDetails.expensesForHealthcare.travelExpensesForHealthcare,
            totalExpensesForHealthcare: reportData.jointExpendituresDetails.reportValues.totalExpensesForHealthcare,
          },
          travelExpensesForHosipitalVisitOfFamilyMember: {
            ...formValues.jointExpendituresDetails.expensesForHealthcare.travelExpensesForHosipitalVisitOfFamilyMember,
            totalTravelExpensesOfHospitalVisitOfFamilyMember: reportData.jointExpendituresDetails.reportValues.totalTravelExpensesOfHospitalVisitOfFamilyMember,
          },
          extraExpensesForClothesAndLinen: {
            ...formValues.jointExpendituresDetails.expensesForHealthcare.extraExpensesForClothesAndLinen,
            totalExpensesForClothesAndLineen: reportData.jointExpendituresDetails.reportValues.totalExpensesForClothesAndLineen,
          },
        },
      },
    } : formValues;
    if (dossierDetails?.personalDetails?.isJointDeclaration) {
      dossierDetails = await getUpdatedAllocationDetails({ ...dossierDetails, [EXPENDITURE_FIELD_NAME]: cleanDeep(formData) });
    }
    saveDossierDetails({ [EXPENDITURE_FIELD_NAME]: formData, [ALLOCATION_FIELD_NAME]: dossierDetails[ALLOCATION_FIELD_NAME] }, null, false);
    await requests.saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep({
        ...dossierDetails,
        [EXPENDITURE_FIELD_NAME]: { ...formData },
      }),
    });
  }, [reportData], { displayLoader: false });

  /** Will update the form values with the respective modal values
   * on click of modal save button.
   */
  const handleModalSave = useAsyncCallback(async (
    {
      modalData, subSectionIndex, reportType, fieldName,
    },
    section, isJointSection, isHealthExpenseSection, thresholdReportType = '', fetchAllocation = false,
  ) => {
    const field = isJointSection ? 'jointExpendituresDetails' : fieldNamePrefix;
    const topLevelFieldIndex = isJointSection ? section.value - EXPENDITURE_SECTION_KEYS_ARRAY.length : section.value;
    const currentValues = { ...values };
    const currentTabOwner = { ...values[field] };
    const sectionKeysArray = isJointSection ? JOINT_SECTION_KEYS_ARRAY : EXPENDITURE_SECTION_KEYS_ARRAY;
    const topLevelField = sectionKeysArray[topLevelFieldIndex][0];
    const innerField = sectionKeysArray[topLevelFieldIndex][1][subSectionIndex];
    const currentSection = { ...currentTabOwner[topLevelField] };
    currentSection[innerField] = modalData.correctionData;
    currentTabOwner[topLevelField] = currentSection;
    currentValues[field] = currentTabOwner;
    if (!reportType) {
      calculateUpdatedTax(currentValues, EXPENDITURE_FIELD_NAME, null, fetchAllocation);
      if (isHealthExpenseSection) {
        const sectionKeyName = JOINT_SECTION_KEYS_ARRAY[section.value - EXPENDITURE_SECTION_KEYS_ARRAY.length][0];
        const fieldBasedReportValues = { ...reportData.jointExpendituresDetails };
        const thresholdResponse = await taxCalculationReport(thresholdReportType, isPartner, cleanDeep({
          ...dossierData,
          [EXPENDITURE_FIELD_NAME]: { ...currentValues },
        }));
        const amount = thresholdResponse[thresholdReportType]?.totalAmount;
        currentSection.threshold = amount;
        currentSection.totalDeductionForHealthcare = thresholdResponse[thresholdReportType].totalDeductionAmount;
        fieldBasedReportValues.thresholdValues = { ...fieldBasedReportValues.thresholdValues, [sectionKeyName]: amount };
        fieldBasedReportValues.reportValues = {
          ...fieldBasedReportValues.reportValues,
          totalDeductionForHealthcare: thresholdResponse[thresholdReportType].totalDeductionAmount,
        };
        setReportData({
          ...reportData,
          jointExpendituresDetails: fieldBasedReportValues,
        });
      }
      setFormChanged(true);
      setValues(currentValues);
    } else {
      setValues(currentValues);
      callTaxCalculationReport(reportType, fieldName, currentValues, section, innerField, isHealthExpenseSection, thresholdReportType, fetchAllocation);
    }
  }, [calculateUpdatedTax, callTaxCalculationReport, dossierData, fieldNamePrefix, isPartner, reportData, setFormChanged, setValues, values], { displayLoader: false });

  const handleAlimonySave = useCallback((formValues, currentIndex) => {
    const currentValues = { ...values };
    const currentTabOwner = { ...values.jointExpendituresDetails };
    currentTabOwner.alimony = values.jointExpendituresDetails.alimony.map((details, index) => {
      if (index !== currentIndex) {
        return details;
      }
      return formValues;
    });
    currentValues.jointExpendituresDetails = currentTabOwner;
    setValues(currentValues);
    setFormChanged(true);
  }, [setFormChanged, setValues, values]);

  /** fetch the report endpoint values
   * and will update those value to the form sections
   * depends on joint or individual sections.
   */
  const callTaxCalculationReport = useAsyncCallback(async (reportType, fieldName, formValues, { value, isJointSection }, innerField, isHealthExpenseSection, thresholdReportType = '', fetchAllocation = false) => {
    const expenditureData = { ...formValues };
    let data = {
      ...cleanDeep({
        ...dossierData,
        [EXPENDITURE_FIELD_NAME]: { ...formValues },
      }),
    };
    if (fetchAllocation && dossierData?.personalDetails?.isJointDeclaration) {
      data = await getUpdatedAllocationDetails(data);
    }
    const [taxResponse, reportResponse, thresholdResponse] = await Promise.all([
      requests.calculateTax(data),
      taxCalculationReport(reportType, isPartner, data),
      thresholdReportType ? taxCalculationReport(thresholdReportType, isPartner, data) : null,
    ]);
    const sectionKeysArray = isJointSection ? JOINT_SECTION_KEYS_ARRAY : EXPENDITURE_SECTION_KEYS_ARRAY;
    const expenditureKey = isJointSection ? 'jointExpendituresDetails' : fieldNamePrefix;
    const sectionIndex = isJointSection ? value - EXPENDITURE_SECTION_KEYS_ARRAY.length : value;
    const currentTabOwner = { ...expenditureData[expenditureKey] };
    const sectionKeyName = sectionKeysArray[sectionIndex][0];
    const currentSection = { ...currentTabOwner[sectionKeyName] };
    const currentReportData = { ...reportData };
    const fieldBasedReportValues = { ...currentReportData[expenditureKey] };
    if (thresholdResponse) {
      const amount = thresholdResponse[thresholdReportType]?.totalAmount;
      if ('treshold' in currentSection) {
        currentSection.treshold = amount;
      } else {
        currentSection.threshold = amount;
      }
      fieldBasedReportValues.thresholdValues = { ...fieldBasedReportValues.thresholdValues, [sectionKeyName]: amount };
    }

    if (isHealthExpenseSection) {
      currentSection.totalDeductionForHealthcare = reportResponse[reportType].totalDeductionAmount;
      fieldBasedReportValues.reportValues = { ...fieldBasedReportValues.reportValues, totalDeductionForHealthcare: reportResponse[reportType].totalDeductionAmount };
      const subSection = { ...currentSection[innerField] };
      subSection[fieldName] = reportResponse[reportType].totalAmount;
      currentSection[innerField] = { ...subSection };
    } else {
      currentSection[fieldName] = reportResponse[reportType].totalAmount;
    }
    fieldBasedReportValues.reportValues = { ...fieldBasedReportValues.reportValues, [fieldName]: reportResponse[reportType].totalAmount };
    currentReportData[expenditureKey] = { ...fieldBasedReportValues };
    setReportData(currentReportData);
    handleSave({
      ...expenditureData,
      [expenditureKey]: {
        ...currentTabOwner,
        [sectionKeyName]: currentSection,
      },
    });
    setTaxableAmount(taxResponse.content.taxableAmount);
  }, [dossierData, fieldNamePrefix, handleSave, isPartner, reportData, setTaxableAmount], { displayLoader: false });

  const handleRemoveSection = (section, isSelected, formValues) => {
    const data = REPORT_REMOVAL_KEYS[section.reportIndex];
    const expenditureKey = section.isJointSection ? 'jointExpendituresDetails' : fieldNamePrefix;
    setReportData({
      ...reportData,
      [expenditureKey]: {
        ...reportData[expenditureKey],
        reportValues: {
          ...reportData[expenditureKey].reportValues,
          ...data.reportValues,
        },
        thresholdValues: {
          ...reportData[expenditureKey].thresholdValues,
          ...data.thresholdValues,
        },
      },
    });
    handleSelectedSection(section.value, isSelected, formValues, setValues, section.isJointSection);
  };

  const updateThresholdAndTotals = useCallback(async (reports) => {
    const data = {
      ...cleanDeep({
        ...dossierData,
        [EXPENDITURE_FIELD_NAME]: { ...values },
      }),
    };
    const reportResponse = await aggrigatedTaxCalculationReport(isPartner, data);
    setReportData({
      ...reports,
      jointExpendituresDetails: {
        ...reports.jointExpendituresDetails,
        reportValues: {
          ...reports.jointExpendituresDetails.reportValues,
          totalDeductionForGiftsToCharity: reportResponse.ExpenditureTotalDeductionForGiftsToCharity.totalAmount,
          totalDeductionForHealthcare: reportResponse.ExpenseForHealthcare.totalDeductionAmount,
        },
        thresholdValues: {
          ...reports.jointExpendituresDetails.thresholdValues,
          expensesForHealthcare: reportResponse.ExpenseForHealthcare.totalAmount,
          giftsToCharity: reportResponse.GiftsToCharity.totalAmount,
        },
      },
    });

    handleSave({
      ...values,
      jointExpendituresDetails: {
        ...values.jointExpendituresDetails,
        giftsToCharity: {
          ...values.jointExpendituresDetails.giftsToCharity,
          totalDeductionForGiftsToCharity: reportResponse.ExpenditureTotalDeductionForGiftsToCharity.totalAmount,
          threshold: reportResponse.GiftsToCharity.totalAmount,
        },
        expensesForHealthcare: {
          ...values.jointExpendituresDetails.expensesForHealthcare,
          totalDeductionForHealthcare: reportResponse.ExpenseForHealthcare.totalDeductionAmount,
          threshold: reportResponse.ExpenseForHealthcare.totalAmount,
        },
      },
    }, false);
  }, [dossierData, values, isPartner, handleSave]);

  return (
    <ExpenditureStyledWrapper data-ta="expenditure-section" className="expenditure-container">
      <div className="tab-container">
        {shouldDisplaySection(SECTION_LIST[0].value) && (
          <PublicTransportDeductions
            handleRemove={() => handleRemoveSection(SECTION_LIST[0], false, values)}
            name={`${fieldNamePrefix}.expensesForPublicTransportation`}
            values={values[fieldNamePrefix].expensesForPublicTransportation}
            callTaxCalculationReport={(reportType, fieldName) => callTaxCalculationReport(reportType, fieldName, values, SECTION_LIST[0])}
            taxableYear={taxableYear}
            reportData={reportData[fieldNamePrefix].reportValues}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[1].value) && (
          <AnnuityPremium
            handleRemove={() => handleRemoveSection(SECTION_LIST[1], false, values)}
            name={`${fieldNamePrefix}.premiumForAnnuity`}
            values={values[fieldNamePrefix].premiumForAnnuity}
            taxableYear={taxableYear}
            annualAndReserveMarginDetails={getAnnualReserveMarginValues(taxableYear, values[fieldNamePrefix].premiumForAnnuity.annualAndReserveMarginDetails)}
            handleModalSave={(data) => handleModalSave(data, SECTION_LIST[1])}
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME)}
            reportData={reportData[fieldNamePrefix].reportValues}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[2].value) && (
          <PremiumCommonSection
            handleRemove={() => handleSelectedSection(SECTION_LIST[2].value, false, values, setValues)}
            name={`${fieldNamePrefix}.premiumForDisabilityInsurance.premiumDetails`}
            values={values[fieldNamePrefix].premiumForDisabilityInsurance.premiumDetails}
            heading={translate('premium-for-disability-insurance')}
            footerLabel={translate('total-deduction-for-premium-for-disability-insurance')}
            footerDataTa="premium-for-disability-insurance-footer"
            tableDataTa="premium-for-disability-insurance"
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME)}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[3].value) && (
          <PremiumCommonSection
            handleRemove={() => handleSelectedSection(SECTION_LIST[3].value, false, values, setValues)}
            name={`${fieldNamePrefix}.premiumForGeneralSurvivorsLaw.premiumDetails`}
            values={values[fieldNamePrefix].premiumForGeneralSurvivorsLaw.premiumDetails}
            heading={translate('premium-for-general-survivors-law')}
            footerLabel={translate('total-deduction-for-premium-for-general-survivors-law')}
            footerDataTa="premium-for-general-survivors-law-footer"
            tableDataTa="premium-for-general-survivors-law"
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME)}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[4].value) && (
          <PremiumCommonSection
            handleRemove={() => handleSelectedSection(SECTION_LIST[4].value, false, values, setValues)}
            name={`${fieldNamePrefix}.premiumForAnnuityOfChild.premiumDetails`}
            values={values[fieldNamePrefix].premiumForAnnuityOfChild.premiumDetails}
            heading={translate('premium-for-annuity-of-child')}
            footerLabel={translate('total-deduction-for-premium-for-annuity-of-child')}
            footerDataTa="premium-for-annuity-of-child-footer"
            tableDataTa="premium-for-annuity-of-child"
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME)}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[5].value) && (
          <Alimony
            handleRemove={() => handleSelectedSection(SECTION_LIST[5].value, false, values, setValues, true)}
            name="jointExpendituresDetails.alimony"
            values={values.jointExpendituresDetails.alimony}
            isPartner={isPartner}
            countries={countries}
            handleAlimonySave={handleAlimonySave}
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME, null, true)}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[6].value) && (
          <GiftsToCharity
            handleRemove={() => handleRemoveSection(SECTION_LIST[6], false, values)}
            name="jointExpendituresDetails.giftsToCharity"
            values={values.jointExpendituresDetails.giftsToCharity}
            isPartner={isPartner}
            callTaxCalculationReport={(reportType, fieldName) => callTaxCalculationReport(reportType, fieldName, values, SECTION_LIST[6], null, false, THRESHOLD_REPORT_TYPE.GIFTS_TO_CHARITY, true)}
            reportData={reportData.jointExpendituresDetails}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[7].value) && (
          <ExpensesForHealthcare
            handleRemove={() => handleRemoveSection(SECTION_LIST[7], false, values)}
            fieldNamePrefix="jointExpendituresDetails.expensesForHealthcare"
            values={values.jointExpendituresDetails.expensesForHealthcare}
            isPartner={isPartner}
            handleModalSave={(data) => handleModalSave(data, SECTION_LIST[7], true, true, THRESHOLD_REPORT_TYPE.EXPENSES_FOR_HEALTHCARE, true)}
            taxableYear={taxableYear}
            reportData={reportData.jointExpendituresDetails}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[8].value) && (
          <EducationalExpenses
            handleRemove={() => handleRemoveSection(SECTION_LIST[8], false, values)}
            fieldNamePrefix={`${fieldNamePrefix}.educationalExpenses`}
            values={values[fieldNamePrefix].educationalExpenses}
            setValues={setValues}
            handleModalSave={(data) => handleModalSave(data, SECTION_LIST[8], false, false, THRESHOLD_REPORT_TYPE.EDUCATIONAL_EXPENSES, true)}
            taxableYear={taxableYear}
            reportData={reportData[fieldNamePrefix]}
          />
        )}

        {shouldDisplaySection(SECTION_LIST[9].value) && (
          <WeekendExpensesForChildrenWithDisabilities
            handleRemove={() => handleRemoveSection(SECTION_LIST[9], false, values)}
            name="jointExpendituresDetails.weekendExpensesForChildrenWithDisabilities"
            values={values.jointExpendituresDetails.weekendExpensesForChildrenWithDisabilities}
            isPartner={isPartner}
            callTaxCalculationReport={(reportType, fieldName) => callTaxCalculationReport(reportType, fieldName, values, SECTION_LIST[9], null, false, '', true)}
            reportData={reportData.jointExpendituresDetails.reportValues}
          />
        )}
        {/* Will be enabled after pilot
        {shouldDisplaySection(SECTION_LIST[10].value) && (
          <WaivedVentureCapital
            handleRemove={() => handleSelectedSection(SECTION_LIST[10].value, false, values, setValues, true)}
            name="jointExpendituresDetails.waivedVentureCapital"
            values={values.jointExpendituresDetails.waivedVentureCapital}
            isPartner={isPartner}
            updateTaxCalculation={() => calculateUpdatedTax(values, EXPENDITURE_FIELD_NAME)}
            callTaxCalculationReport={(reportType, fieldName) => callTaxCalculationReport(reportType, fieldName, values, SECTION_LIST[10])}
          />
        )} */}
      </div>
      <AutoSave
        enable={isDirty && !isSubmitting}
        values={values}
        onSave={handleSave}
      />
    </ExpenditureStyledWrapper>
  );
};

/** remove data from Formik state */
const removeAddedData = async (field, setValues, values, fieldNamePrefix, calculateUpdatedTax, isJointSection) => {
  const sectionKeysArray = isJointSection ? JOINT_SECTION_KEYS_ARRAY : EXPENDITURE_SECTION_KEYS_ARRAY;
  const expenditureKey = isJointSection ? 'jointExpendituresDetails' : fieldNamePrefix;
  const key = isJointSection ? field - EXPENDITURE_SECTION_KEYS_ARRAY.length : field;
  const currentFieldName = sectionKeysArray[key][0];
  const currentFieldInnerChildren = sectionKeysArray[key][1];

  const currentExpenditureData = { ...values };
  // update the form values based on the specified keys
  currentExpenditureData[expenditureKey] = await updateFormValues(currentFieldInnerChildren, currentExpenditureData, expenditureKey, currentFieldName);
  setValues(currentExpenditureData);
  calculateUpdatedTax(currentExpenditureData, EXPENDITURE_FIELD_NAME);
};

/** After deletion it will set the form with initial data,
 * Initial data updation will be assigne in following way
 * subject/partner -> sectional keys -> sub sectional objects which has data
 * if the data is available and sectional level then we'll initialize at section level
 */
const updateFormValues = (currentFieldInnerChildren, currentExpenditureData, expenditureKey, currentFieldName) => {
  const currentTabOwner = { ...currentExpenditureData[expenditureKey] };
  if (currentFieldInnerChildren.length) {
    currentFieldInnerChildren.forEach((subField) => {
      const initialSectionValue = INITIAL_EXPENDITURE_DATA.expenditureDetails[expenditureKey][currentFieldName][subField];
      const currentSection = { ...currentTabOwner[currentFieldName] };
      currentSection[subField] = initialSectionValue;
      currentTabOwner[currentFieldName] = { ...currentSection };
    });
  } else {
    const initialSectionValue = INITIAL_EXPENDITURE_DATA.expenditureDetails[expenditureKey][currentFieldName];
    currentTabOwner[currentFieldName] = initialSectionValue;
  }
  return currentTabOwner;
};

/** If the data is available from api, available sections to display will be updated
 * based on the recieved sections data. For not recieved sections it'll initialize those
 * sections with the initial data, If joint section is avialable then it should be displayed in both tabs
 * Initial data updation will be assigne in following way
 * subject/partner -> sectional keys -> sub sectional objects which has data
 * if the data is available and sectional level then we'll initialize at section level.
 *
 * sectionKeysArray - contains the list of array of all the available sections in form.
 * each sectional array has follwing elements,
 * sectional object (topLevelField) and sub sectional object array (innerFields)
 */

const getInitialExpenditureDataAndUpdateDefaultSections = (previousExpenditureData, setSelectedSections, setReportTotalValues) => {
  const expenditureData = { ...previousExpenditureData };
  let sectionsToDisplay = { fiscalPartnerSections: [], taxableSubjectSections: [] };
  const reportTotalValues = { ...INITIAL_REPORT_DATA };
  EXPENDITURE_KEY_TYPE_ARRAY.forEach((subjectOrPartner, subjectOrPartnerIndex) => {
    /** to read the initial report and threshold data */
    let reportValues = { ...reportTotalValues[subjectOrPartner].reportValues };
    let thresholdValues = { ...reportTotalValues[subjectOrPartner].thresholdValues };
    if (previousExpenditureData?.[subjectOrPartner]) {
      const sectionKeysArray = subjectOrPartner === 'jointExpendituresDetails' ? JOINT_SECTION_KEYS_ARRAY : EXPENDITURE_SECTION_KEYS_ARRAY;
      const currentTabOwner = { ...expenditureData[subjectOrPartner] };
      sectionKeysArray.forEach((section, index) => {
        const topLevelField = section[0];
        const innerFields = section[1];
        /**
         * returns section data - if it is available dossier, if not returns the initial data
         * return isSectionDataAvailable - it'll specify if the section data is already available in dossier
         */
        const {
          sectionData, isSectionDataAvailable, reportObj, thresholdObj,
        } = initializeSectionAndCheckDataAvailability(previousExpenditureData, subjectOrPartner, topLevelField, innerFields);
        reportValues = { ...reportValues, ...reportObj };
        thresholdValues = { ...thresholdValues, ...thresholdObj };
        currentTabOwner[topLevelField] = sectionData;
        if (isSectionDataAvailable) {
          /** joint section has to be displayed in both the subject and partner tabs */
          if (subjectOrPartner === 'jointExpendituresDetails') {
            sectionsToDisplay = {
              ...sectionsToDisplay,
              taxableSubjectSections: [...sectionsToDisplay.taxableSubjectSections, EXPENDITURE_SECTION_KEYS_ARRAY.length + index],
              fiscalPartnerSections: [...sectionsToDisplay.fiscalPartnerSections, EXPENDITURE_SECTION_KEYS_ARRAY.length + index],
            };
          } else {
            sectionsToDisplay = { ...sectionsToDisplay, [SECTION_KEYS[subjectOrPartnerIndex]]: [...sectionsToDisplay[SECTION_KEYS[subjectOrPartnerIndex]], index] };
          }
        }
      });
      expenditureData[subjectOrPartner] = { ...currentTabOwner };
    } else {
      expenditureData[subjectOrPartner] = { ...INITIAL_EXPENDITURE_DATA.expenditureDetails[subjectOrPartner] };
    }
    const currentReportValues = { ...reportTotalValues[subjectOrPartner] };
    currentReportValues.reportValues = { ...reportValues };
    currentReportValues.thresholdValues = { ...thresholdValues };
    reportTotalValues[subjectOrPartner] = { ...currentReportValues };
  });
  setReportTotalValues(reportTotalValues);
  setSelectedSections(sectionsToDisplay);
  return expenditureData;
};

const initializeSectionAndCheckDataAvailability = (previousExpenditureData, subjectOrPartner, topLevelField, innerFields) => {
  let sectionData;
  const reportObj = {};
  const thresholdObj = {};
  const initialSectionValue = { ...INITIAL_EXPENDITURE_DATA.expenditureDetails[subjectOrPartner][topLevelField] };
  let isSectionDataAvailable = false;
  if (Object.keys(cleanDeep(previousExpenditureData[subjectOrPartner][topLevelField])).length) {
    sectionData = topLevelField === ALIMONY_KEY ? [...previousExpenditureData[subjectOrPartner][topLevelField]] : { ...previousExpenditureData[subjectOrPartner][topLevelField] };
    if ('treshold' in sectionData || 'threshold' in sectionData) {
      thresholdObj[topLevelField] = topLevelField === EDUCATIONAL_SECTION_KEY ? sectionData.treshold : sectionData.threshold;
    }
    if (innerFields.length) {
      innerFields.forEach((field, index) => {
        if (Object.keys(cleanDeep(sectionData[field])).length || (sectionData[field] && !isNaN(sectionData[field]))) {
          const isReportFieldExist = REPORT_KEYS.findIndex((key) => key === field) !== -1;
          if (isReportFieldExist || (topLevelField === HEALTHCARE_SECTION_KEY && index > (STARTING_HEALTH_REPORT_SECTION_INDEX - 1))) {
            reportObj[isReportFieldExist ? field
              : HEALTH_REPORT_KEYS[(index - STARTING_HEALTH_REPORT_SECTION_INDEX)]] = isReportFieldExist
              ? sectionData[field] : sectionData[field][HEALTH_REPORT_KEYS[(index - STARTING_HEALTH_REPORT_SECTION_INDEX)]];
          }
          // As section is available and initialization is not required. So returning true to indicate section presence.
          if (field === STUDY_GRANT_KEY && !sectionData[field].details) {
            const childSection = { ...sectionData[field] };
            childSection.details = [...initialSectionValue[field].details];
            sectionData[field] = childSection;
          }
          isSectionDataAvailable = true;
        } else {
          sectionData[field] = initialSectionValue[field];
        }
      });
    } else {
      isSectionDataAvailable = true;
    }
  } else {
    sectionData = topLevelField === ALIMONY_KEY
      ? [...INITIAL_EXPENDITURE_DATA.expenditureDetails[subjectOrPartner][topLevelField]]
      : { ...INITIAL_EXPENDITURE_DATA.expenditureDetails[subjectOrPartner][topLevelField] };
  }
  // initialization of sectional objects
  return {
    sectionData, isSectionDataAvailable, reportObj, thresholdObj,
  };
};

const getYears = (taxableYear) => [...Array(RESERVE_MARGIN_YEARS)].map((item, index) => Number(moment([taxableYear]).subtract(index, 'year').format('YYYY')));

const getAnnualReserveMarginValues = (taxableYear, annualAndReserveMarginDetails) => getYears(taxableYear).map((value) => {
  const annualReserveMargin = annualAndReserveMarginDetails && (annualAndReserveMarginDetails.find((detail) => detail.year === value));
  return annualReserveMargin || { ...defaultReserveMarginTemplate, year: value };
});

const defaultReserveMarginTemplate = {
  year: null,
  profitFromBusiness: null,
  allocationToFor: null,
  releaseOfFor: null,
  incomeFromEmployment: null,
  incomeFromOtherActivities: null,
  incomeFromBenefits: null,
  factorA: null,
  deductedPremiums: null,
  openingAmount: null,
  appliedAmount: null,
  closingAmount: null,
};

const ExpenditureStyledWrapper = styled(ExpenditureWrapper)`
  .expneses-footer {
    color: ${({ theme }) => theme.currencyText};
    font-size: ${({ theme }) => theme.fontSizes.fs18};
  }

  .threshold-label {
    font-size: ${({ theme }) => theme.fontSizes.fs12};
  }

  .icon-error {
    i {
      color: ${({ theme }) => theme.error};
    }
  }

  .expenditure-sub-section {
    margin-bottom: ${({ theme }) => theme.margins.large};

    .forecast-section {
      border-bottom: none;
    }

    border-bottom: 1px solid ${({ theme }) => theme.tableBorderColor};
  }
`;

ExpenditureContainer.propTypes = {
  /** prefix for name of the input for partner/subject */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** function that specify whether to display a section or not */
  shouldDisplaySection: PropTypes.func.isRequired,
  /** specifies the form values */
  values: PropTypes.object.isRequired,
  /** callback for setting values */
  setValues: PropTypes.func.isRequired,
  /** function to handle selection/deletion of a section */
  handleSelectedSection: PropTypes.func.isRequired,
  /** callback for calculation of updated tax */
  calculateUpdatedTax: PropTypes.func.isRequired,
  /** specifies form values are updated or not */
  isDirty: PropTypes.bool.isRequired,
  /** specifies submitting status of the form */
  isSubmitting: PropTypes.bool.isRequired,
};

/** Exported enhanced component wrapped with DossierGenericContainer HOC */
export default (({
  dossierDataKey = EXPENDITURE_FIELD_NAME,
  dataTa = 'tax-forecast-expenditure-form',
  validationSchema = expenditureFormValidationSchema,
  sectionList = SECTION_LIST,
  subjecAndPartnerKeys = EXPENDITURE_KEY_TYPE_ARRAY,
  getInitialDataAndUpdateDefaultSections = getInitialExpenditureDataAndUpdateDefaultSections,
  removeData = removeAddedData,
  addSectionButtonText = translate('expenditure-heading'),
  addSectionButtonDataTa = 'add-expenditure-sections-button',
  heading = translate('expenditure-heading'),
  location,
}) => DossierGenericContainer({
  dossierDataKey,
  dataTa,
  validationSchema,
  sectionList,
  subjecAndPartnerKeys,
  getInitialDataAndUpdateDefaultSections,
  removeData,
  addSectionButtonText,
  addSectionButtonDataTa,
  heading,
  location,
})(ExpenditureContainer));

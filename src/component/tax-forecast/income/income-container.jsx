import React, { useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import deepFreeze from 'deep-freeze';
import { AutoSave, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { incomeTranslate as translate } from './income-translate';
import {
  SECTION_LIST,
  incomeFieldName,
  incomeSectionalKeysArray,
  incomeKeyTypeArray,
  SECTION_KEYS,
  tableHeaderCells,
} from './income.constants';
import TaxForecastContext from '../tax-forecast-context';
import { INITIAL_INCOME_DATA } from './income-initial-data';
import { cleanDeep } from '../../../common/utils';
import ExemptedIncome from './exempted-income';
import GainCostOtherActivities from './gain-cost-other-activities';
import GainCostAssetsOwnCompany from './gain-cost-assets-own-company';
import RefundedExpenses from './refunded-expenses';
import OtherIncome from './other-income';
import CurrentEmploymentIncome from './current-employment-income';
import PreviousEmploymentIncome from './previous-employment-income';
import TaxableIncomeAbroad from './taxable-income-abroad';
import IncomeCostBenefits from './income-cost-benefits';
import AssetsLiabilities from './assets-liabilities';
import Alimony from './alimony';
import { incomeValidationSchema } from './income-validation-schema';
import DossierGenericContainer from '../common/dossier-generic-container';
import { saveDeclaration } from '../tax-forecast-request';
import { ContainerWrapper } from '../../../common/styled-wrapper';

/**
  * Tax Forecast - Income Component with several income sections for the both taxable subject and fiscal partner
  *
  */

const INCOME_COST_COLUMN_GROUPS = deepFreeze({
  INCOME_COLUMN_GROUP: [
    tableHeaderCells.income,
    tableHeaderCells.amount,
    tableHeaderCells.actions,
  ],
  COST_COLUMN_GROUP: [
    tableHeaderCells.cost,
    tableHeaderCells.amount,
    tableHeaderCells.actions,
  ],
});

const IncomeContainer = ({
  fieldNamePrefix,
  shouldDisplaySection,
  values,
  setValues,
  handleSelectedSection,
  calculateUpdatedTax,
  isDirty,
  isSubmitting,
}) => {
  const {
    countries,
    dossierData,
    saveDossierDetails,
    dossierData: {
      dossierManifest: {
        dossierId,
      },
    },
    globalClientId,
  } = useContext(TaxForecastContext);

  const handleSave = useAsyncCallback(async (formValues) => {
    saveDossierDetails(formValues, incomeFieldName, false);
    await saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep({
        ...dossierData,
        [incomeFieldName]: { ...formValues },
      }),
    });
  }, [], { displayLoader: false });

  const updateIncomeFromAbroadData = useCallback(({
    data, index, incomeValues, currentUser, setUpdatedValues,
  }) => {
    let sectionData = [...(incomeValues[currentUser]?.taxableWages?.taxableIncomeAbroad || [])];
    if (data !== undefined) {
      if (index !== undefined) {
        sectionData[index] = data;
      } else {
        sectionData = [ ...sectionData, data ];
      }
    } else {
      sectionData = sectionData.filter((value, currentRowIndex) => currentRowIndex !== index);
    }
    const updatedIncomeData = {
      ...incomeValues,
      [currentUser]: {
        ...incomeValues[currentUser],
        taxableWages: {
          ...incomeValues[currentUser]?.taxableWages,
          taxableIncomeAbroad: sectionData,
        },
      },
    };
    setUpdatedValues(updatedIncomeData);
    calculateUpdatedTax(updatedIncomeData, incomeFieldName)
  }, [calculateUpdatedTax]);

  return (
    <ContainerWrapper>
      <div className="tab-container">
        {shouldDisplaySection(SECTION_LIST[0].value)
          && (
            <CurrentEmploymentIncome
              handleRemove={() => {
                handleSelectedSection(SECTION_LIST[0].value, false, values, setValues);
              }}
              name={`${fieldNamePrefix}.taxableWages.currentEmploymentIncome`}
              values={values[fieldNamePrefix].taxableWages.currentEmploymentIncome}
              updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
            />
          )}
        {shouldDisplaySection(SECTION_LIST[1].value)
          && (
            <PreviousEmploymentIncome
              handleRemove={() => handleSelectedSection(SECTION_LIST[1].value, false, values, setValues)}
              name={`${fieldNamePrefix}.taxableWages.previousEmploymentIncome`}
              values={values[fieldNamePrefix].taxableWages.previousEmploymentIncome}
              updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
            />
          )}
        {(shouldDisplaySection(SECTION_LIST[2].value))
            && (
              <TaxableIncomeAbroad
                handleRemove={() => handleSelectedSection(SECTION_LIST[2].value, false, values, setValues)}
                values={values[fieldNamePrefix].taxableWages.taxableIncomeAbroad}
                countries={countries}
                updateAbroadIncomeData={(data, index) => updateIncomeFromAbroadData({
                  data, index, incomeValues: values, currentUser: fieldNamePrefix, setUpdatedValues: setValues,
                })}
                handleRemoveAbroadIncomeRow={(index) => updateIncomeFromAbroadData({
                  index, incomeValues: values, currentUser: fieldNamePrefix, setUpdatedValues: setValues,
                })}
              />
            )}
        {(shouldDisplaySection(SECTION_LIST[3].value))
            && (
              <ExemptedIncome
                handleRemove={() => handleSelectedSection(SECTION_LIST[3].value, false, values, setValues)}
                name={`${fieldNamePrefix}.taxableWages.exemptedIncomeFromInternationalOrganization`}
                values={values[fieldNamePrefix].taxableWages.exemptedIncomeFromInternationalOrganization}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
              />
            )}
        {(shouldDisplaySection(SECTION_LIST[4].value))
            && (
              <GainCostOtherActivities
                handleRemove={() => handleSelectedSection(SECTION_LIST[4].value, false, values, setValues)}
                name={`${fieldNamePrefix}.gainCostFromOtherActivities`}
                values={values[fieldNamePrefix].gainCostFromOtherActivities}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
                INCOME_COST_COLUMN_GROUPS={INCOME_COST_COLUMN_GROUPS}
              />
            )}
        {(shouldDisplaySection(SECTION_LIST[5].value))
            && (
              <GainCostAssetsOwnCompany
                handleRemove={() => handleSelectedSection(SECTION_LIST[5].value, false, values, setValues)}
                name={`${fieldNamePrefix}.gainCostFromOtherActivities`}
                values={values[fieldNamePrefix].gainCostFromOtherActivities}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
                INCOME_COST_COLUMN_GROUPS={INCOME_COST_COLUMN_GROUPS}
              />
            )}
        {shouldDisplaySection(SECTION_LIST[6].value)
            && (
              <AssetsLiabilities
                handleRemove={() => handleSelectedSection(SECTION_LIST[6].value, false, values, setValues)}
                name={`${fieldNamePrefix}.gainCostFromOtherActivities`}
                values={values[fieldNamePrefix].gainCostFromOtherActivities}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
              />
            )}
        {shouldDisplaySection(SECTION_LIST[7].value)
            && (
              <Alimony
                handleRemove={() => handleSelectedSection(SECTION_LIST[7].value, false, values, setValues)}
                name={`${fieldNamePrefix}.incomeOutOfBenefits`}
                values={values[fieldNamePrefix].incomeOutOfBenefits}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
                INCOME_COST_COLUMN_GROUPS={INCOME_COST_COLUMN_GROUPS}
              />
            )}
        {shouldDisplaySection(SECTION_LIST[8].value)
            && (
              <IncomeCostBenefits
                handleRemove={() => handleSelectedSection(SECTION_LIST[8].value, false, values, setValues)}
                name={`${fieldNamePrefix}.incomeOutOfBenefits`}
                values={values[fieldNamePrefix].incomeOutOfBenefits}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
                INCOME_COST_COLUMN_GROUPS={INCOME_COST_COLUMN_GROUPS}
              />
            )}
        {(shouldDisplaySection(SECTION_LIST[9].value))
            && (
              <RefundedExpenses
                handleRemove={() => handleSelectedSection(SECTION_LIST[9].value, false, values, setValues)}
                fieldNamePrefix={`${fieldNamePrefix}`}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
              />
            )}

        {(shouldDisplaySection(SECTION_LIST[10].value))
            && (
              <OtherIncome
                handleRemove={() => handleSelectedSection(SECTION_LIST[10].value, false, values, setValues)}
                fieldNamePrefix={`${fieldNamePrefix}.otherIncome`}
                updateTaxCalculation={() => calculateUpdatedTax(values, incomeFieldName)}
              />
            )}
      </div>
      <AutoSave
        enable={isDirty && !isSubmitting}
        values={values}
        onSave={handleSave}
      />
    </ContainerWrapper>
  );
};

/** To remove the data from formik state and to calculate the updated tax after removal */
const removeAddedData = (field, setValues, values, fieldNamePrefix, calculateUpdatedTax) => {
  const topLevelField = incomeSectionalKeysArray[field][0];
  const innerFields = incomeSectionalKeysArray[field][1];
  const currentIncomeData = { ...values };
  const currentData = topLevelField ? { ...currentIncomeData[fieldNamePrefix][topLevelField] } : { ...currentIncomeData[fieldNamePrefix] };
  innerFields.forEach((fieldKey) => {
    currentData[fieldKey] = topLevelField ? [...INITIAL_INCOME_DATA.income[fieldNamePrefix][topLevelField][fieldKey]] : { ...INITIAL_INCOME_DATA.income[fieldNamePrefix][fieldKey] };
  });
  if (topLevelField) {
    currentIncomeData[fieldNamePrefix][topLevelField] = currentData;
  } else {
    currentIncomeData[fieldNamePrefix] = currentData;
  }
  setValues(currentIncomeData);
  calculateUpdatedTax(cleanDeep(currentIncomeData), incomeFieldName);
};

/** If the data is available from api, available sections to display will be updated
 * based on the recieved sections data. For not recieved sections it'll initialize
 * those sections with the initial data
 * Initial data updation will be assigne in following way
 * subject/partner -> sectional keys -> sub sectional objects which has data
 * if the data is available and sectional level then we'll initialize at section level.
 *
 * incomeSectionalKeysArray - contains the list of array of all the available sections in form.
 * each sectional array has follwing elements,
 * sectional object (topLevelField) and sub sectional object array (innerFields)
 */

const getInitialIncomeDataAndUpdateDefaultSections = (previousIncomeData, setSelectedSections) => {
  const currentIncomeData = { ...previousIncomeData };
  let sectionsToDisplay = { fiscalPartnerSections: [], taxableSubjectSections: [] };

  incomeKeyTypeArray.forEach((subjectOrPartner, subjectOrPartnerIndex) => {
    if (previousIncomeData?.[subjectOrPartner]) {
      let currentTabOwner = { ...currentIncomeData[subjectOrPartner] };
      incomeSectionalKeysArray.forEach((section, index) => {
        const topLevelField = section[0];
        const innerFields = section[1];
        /**
         * returns section data - if it is available dossier, if not returns the initial data
         * return isSectionDataAvailable - it'll specifyif the section data is already available in dossier
         */
        const { sectionData, isSectionDataAvailable } = initializeSectionAndCheckDataAvailability(currentTabOwner, subjectOrPartner, topLevelField, innerFields);
        // for direct toplevel objects
        if (topLevelField) {
          currentTabOwner[topLevelField] = sectionData;
        } else {
          currentTabOwner = { ...sectionData };
        }
        if (isSectionDataAvailable) {
          sectionsToDisplay = { ...sectionsToDisplay, [SECTION_KEYS[subjectOrPartnerIndex]]: [...sectionsToDisplay[SECTION_KEYS[subjectOrPartnerIndex]], index] };
        }
      });
      currentIncomeData[subjectOrPartner] = { ...currentTabOwner };
    } else {
      currentIncomeData[subjectOrPartner] = { ...INITIAL_INCOME_DATA.income[subjectOrPartner] };
    }
  });
  setSelectedSections(sectionsToDisplay);
  return currentIncomeData;
};

const initializeSectionAndCheckDataAvailability = (currentTabOwner, subjectOrPartner, topLevelField, innerFields) => {
  const initialSectionValue = topLevelField ? { ...INITIAL_INCOME_DATA.income[subjectOrPartner][topLevelField] } : { ...INITIAL_INCOME_DATA.income[subjectOrPartner] };
  let sectionData = topLevelField ? { ...currentTabOwner[topLevelField] } : { ...currentTabOwner };
  let isSectionDataAvailable = false;
  if (Object.keys(cleanDeep(sectionData)).length) {
    innerFields.forEach((field) => {
      if (Object.keys(cleanDeep(sectionData[field])).length) {
        // As section is available and initialization is not required. So returning true to indicate section presence.
        isSectionDataAvailable = true;
      } else {
        sectionData[field] = initialSectionValue[field];
      }
    });
  } else {
    sectionData = initialSectionValue;
  }
  // initialization of sectional objects
  return { sectionData, isSectionDataAvailable };
};

IncomeContainer.propTypes = {
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
  dossierDataKey = incomeFieldName,
  dataTa = 'tax-forecast-income-form',
  validationSchema = incomeValidationSchema,
  sectionList = SECTION_LIST,
  subjecAndPartnerKeys = incomeKeyTypeArray,
  getInitialDataAndUpdateDefaultSections = getInitialIncomeDataAndUpdateDefaultSections,
  removeData = removeAddedData,
  addSectionButtonText = translate('income'),
  addSectionButtonDataTa = 'add-income-sections-button',
  heading = translate('income'),
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
})(IncomeContainer));

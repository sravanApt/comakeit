import React, { useContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AutoSave, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import EntrepreneurDeductions from './entrepreneur-deductions';
import RemainderSelfDeduction from './remainder-self-deduction';
import FiscalPensionReserve from './fiscal-pension-reserve';
import TaxForecastContext from '../../tax-forecast-context';
import {
  ENTREPRENEUR_KEYS_ARRAY,
  SECTION_LIST, ENTREPRENEUR_SECTIONAL_KEYS_LIST,
  SECTION_KEYS,
  ENTREPRENEUR_KEY,
  ENTREPRENEUR_DEDUCTIONS_CLEAR_SECTIONS,
} from './entrepreneur.constants';
import { INITIAL_ENTREPRENEUR_DATA, ENTREPRENEUR_DEDUCTIONS } from './entrepreneur-initial-data';
import { cleanDeep } from '../../../../common/utils';
import DossierGenericContainer from '../../common/dossier-generic-container';
import { entrepreneurValidationSchema } from './entrepreneur-validation-schema';
import { saveDeclaration } from '../../tax-forecast-request';
import { ContainerWrapper } from '../../../../common/styled-wrapper';

const EntrepreneurStyledWrapper = styled(ContainerWrapper)`
  &&& .tab-container {
    .currency-label {
      font-size: ${({ theme }) => theme.fontSizes.fs14};
    }

    .forecast-section {
      .mdc-layout-grid__inner {
        grid-gap: 12px;
      }
    }
  }
`;

/**
  * Tax Forecast - Entrepreneur Component with three sections for the both taxable subject and fiscal partner
  * and the sections are Entrepreneurial deductions, Remainder self-employed deduction and Fiscal pension reserve
  *
  */

const EntrepreneurContainer = ({
  fieldNamePrefix,
  shouldDisplaySection,
  values,
  setValues,
  handleSelectedSection,
  tabIndex,
  isDirty,
  isSubmitting,
  calculateUpdatedTax,
}) => {
  const {
    dossierData,
    dossierData: {
      dossierManifest: {
        taxableYear,
        dossierId,
      },
      businessDetails,
    },
    saveDossierDetails,
    globalClientId,
  } = useContext(TaxForecastContext);

  const handleSave = useAsyncCallback(async (formValues) => {
    await saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep({
        ...dossierData,
        [ENTREPRENEUR_KEY]: { ...formValues },
      }),
    });
    saveDossierDetails(formValues, ENTREPRENEUR_KEY, false, true);
  }, [], { displayLoader: false });

  const checkAndInitializeEntrepreneurDeductions = (sectionIndex) => {
    if (shouldDisplaySection(sectionIndex) && !Object.keys(cleanDeep(values[fieldNamePrefix].entrepreneurialDeductions)).length) {
      const currentData = { ...values[fieldNamePrefix] };
      currentData.entrepreneurialDeductions = { ...ENTREPRENEUR_DEDUCTIONS };
      setValues({
        ...values,
        [fieldNamePrefix]: { ...currentData },
      });
    }
    return shouldDisplaySection(sectionIndex);
  };

  // To remove allocation fields data from fiscal pension reserve details
  const removeAllocationDetails = () => {
    setValues({
      ...values,
      [fieldNamePrefix]: {
        ...values[fieldNamePrefix],
        fiscalPensionReserve: {
          ...values[fieldNamePrefix].fiscalPensionReserve,
          pensionReserveDetails: values[fieldNamePrefix].fiscalPensionReserve.pensionReserveDetails.map((row) => {
            const currentRow = { ...row };
            currentRow.allocation = null;
            return currentRow;
          }),
        },
      },
    });
  };

  // To remove entrepreneur deductions details
  const clearDeductionsDetails = (value) => {
    const updatedEntrepreneurDeductions = {
      ...values[fieldNamePrefix].entrepreneurialDeductions,
      entitledToSelfEmployedDeduction: {
        ...values[fieldNamePrefix].entrepreneurialDeductions.entitledToSelfEmployedDeduction,
        currentYearAmount: value,
      },
    };
    ENTREPRENEUR_DEDUCTIONS_CLEAR_SECTIONS.forEach((section) => {
      updatedEntrepreneurDeductions[section] = {
        ...updatedEntrepreneurDeductions[section],
        currentYearAmount: ENTREPRENEUR_DEDUCTIONS[section].currentYearAmount,
      };
    });
    const updatedEntrepreneurFormDetails = {
      ...values,
      [fieldNamePrefix]: {
        ...values[fieldNamePrefix],
        entrepreneurialDeductions: { ...updatedEntrepreneurDeductions },
        fiscalPensionReserve: {
          ...values[fieldNamePrefix].fiscalPensionReserve,
          isAllocateTo: {
            ...values[fieldNamePrefix].fiscalPensionReserve.isAllocateTo,
            currentYearAmount: false,
          },
        },
      },
    };
    setValues(updatedEntrepreneurFormDetails);
    calculateUpdatedTax(updatedEntrepreneurFormDetails, ENTREPRENEUR_KEY);
  };

  return (
    <EntrepreneurStyledWrapper>
      <div className="tab-container">
        {checkAndInitializeEntrepreneurDeductions(SECTION_LIST[0].value)
            && (
              <EntrepreneurDeductions
                values={values[fieldNamePrefix].entrepreneurialDeductions}
                fieldNamePrefix={`${fieldNamePrefix}.entrepreneurialDeductions`}
                handleRemove={() => {
                  handleSelectedSection(SECTION_LIST[0].value, false, values, setValues);
                }}
                taxableYear={taxableYear}
                updateTaxCalculation={() => calculateUpdatedTax(values, ENTREPRENEUR_KEY)}
                clearDeductionsDetails={clearDeductionsDetails}
              />
            )
        }
        {shouldDisplaySection(SECTION_LIST[1].value)
            && (
              <RemainderSelfDeduction
                values={values[fieldNamePrefix].remainderSelfEmployedDeductions}
                name={`${fieldNamePrefix}.remainderSelfEmployedDeductions`}
                handleRemove={() => {
                  handleSelectedSection(SECTION_LIST[1].value, false, values, setValues);
                }}
                taxableYear={taxableYear}
                updateTaxCalculation={() => calculateUpdatedTax(values, ENTREPRENEUR_KEY)}
              />
            )
        }
        {shouldDisplaySection(SECTION_LIST[2].value)
            && (
              <FiscalPensionReserve
                values={values[fieldNamePrefix].fiscalPensionReserve}
                fieldNamePrefix={`${fieldNamePrefix}.fiscalPensionReserve`}
                handleRemove={() => {
                  handleSelectedSection(SECTION_LIST[2].value, false, values, setValues);
                }}
                businessDetails={businessDetails}
                tabIndex={tabIndex}
                taxableYear={taxableYear}
                updateTaxCalculation={() => calculateUpdatedTax(values, ENTREPRENEUR_KEY)}
                removeAllocationDetails={removeAllocationDetails}
                entrepreneurialDeductions={values[fieldNamePrefix].entrepreneurialDeductions}
              />
            )}
      </div>
      <AutoSave
        enable={isDirty && !isSubmitting}
        values={values}
        onSave={handleSave}
      />
    </EntrepreneurStyledWrapper>
  );
};

/** To remove the data from formik state and to calculate the updated tax after removal */
const removeAddedData = (field, setValues, values, fieldNamePrefix, calculateUpdatedTax) => {
  const sectionalKey = ENTREPRENEUR_SECTIONAL_KEYS_LIST[field];
  const currentEntrepreneurData = { ...values };
  currentEntrepreneurData[fieldNamePrefix][sectionalKey] = INITIAL_ENTREPRENEUR_DATA.entrepreneurDetails[fieldNamePrefix][sectionalKey];
  setValues(currentEntrepreneurData);
  calculateUpdatedTax(cleanDeep(currentEntrepreneurData), ENTREPRENEUR_KEY);
};

const getInitialEntrepreneurDataAndUpdateDefaultSections = (previousEntrepreneurData, setSelectedSections) => {
  const entrepreneurData = { ...previousEntrepreneurData };
  let sectionsToDisplay = { fiscalPartnerSections: [], taxableSubjectSections: [] };

  ENTREPRENEUR_KEYS_ARRAY.forEach((subjectOrPartner, subjectOrPartnerIndex) => ENTREPRENEUR_SECTIONAL_KEYS_LIST.forEach((section, index) => {
    if (previousEntrepreneurData?.[subjectOrPartner]) {
      const currentTabOwner = { ...entrepreneurData[subjectOrPartner] };
      const currentObj = previousEntrepreneurData[subjectOrPartner][section];
      if (Object.keys(cleanDeep(currentObj)).length) {
        if (section !== 'remainderSelfEmployedDeductions') {
          currentTabOwner[section] = { ...INITIAL_ENTREPRENEUR_DATA.entrepreneurDetails[subjectOrPartner][section], ...currentTabOwner[section] };
          entrepreneurData[subjectOrPartner] = { ...currentTabOwner };
        }
        sectionsToDisplay = { ...sectionsToDisplay, [SECTION_KEYS[subjectOrPartnerIndex]]: [...sectionsToDisplay[SECTION_KEYS[subjectOrPartnerIndex]], index] };
        // As section is available and initialization is not required. So returning true to indicate section presence.
        return true;
      }
      // To initialize the section data if the sectional data is not available in server response
      currentTabOwner[section] = INITIAL_ENTREPRENEUR_DATA.entrepreneurDetails[subjectOrPartner][section];
      entrepreneurData[subjectOrPartner] = { ...currentTabOwner };
    } else {
      entrepreneurData[subjectOrPartner] = { ...INITIAL_ENTREPRENEUR_DATA.entrepreneurDetails[subjectOrPartner] };
    }
    // As section is not available and initialization required. So returning false to indicate section not there.
    return false;
  }));
  setSelectedSections(sectionsToDisplay);
  return entrepreneurData;
};

EntrepreneurContainer.propTypes = {
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
  /** specifies the current active tab */
  tabIndex: PropTypes.number.isRequired,
  /** specifies form values are updated or not */
  isDirty: PropTypes.bool.isRequired,
  /** specifies form's submitting status */
  isSubmitting: PropTypes.bool.isRequired,
  /** callback for calculation of updated tax */
  calculateUpdatedTax: PropTypes.func.isRequired,
};

export default (({
  dossierDataKey = ENTREPRENEUR_KEY,
  dataTa = 'tax-forecast-entrepreneur',
  validationSchema = entrepreneurValidationSchema,
  sectionList = SECTION_LIST,
  subjecAndPartnerKeys = ENTREPRENEUR_KEYS_ARRAY,
  getInitialDataAndUpdateDefaultSections = getInitialEntrepreneurDataAndUpdateDefaultSections,
  removeData = removeAddedData,
  addSectionButtonText = translate('entrepreneur-allowance'),
  addSectionButtonDataTa = 'add-entrepreneur-sections-button',
  heading = `${translate('entrepreneur-allowance')}`,
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
})(EntrepreneurContainer));

import React, {
  useContext,
} from 'react';
import styled from 'styled-components';
import {
  useAsyncCallback, AutoSave,
} from '@visionplanner/vp-ui-fiscal-library';
import PropTypes from 'prop-types';
import { cleanDeep } from '../../../common/utils';
import { additionalCalculationInformationTranslate as translate } from './additional-calculation-information-translate';
import { additionalCalculationInformationValidationSchema } from './additional-calculation-information-validation-schema';
import TaxForecastContext from '../tax-forecast-context';
import {
  SECTION_LIST,
  SUBJECT_AND_FISCAL_PARTNER_KEYS,
  INNER_SECTIONS_KEYS,
  SECTION_KEY,
  SECTIONS_TO_DISPLAY_KEYS,
  INITIAL_DATA,
  INITIAL_ADDITIONAL_CALCULATION_DATA,
} from './additional-calculation-information.constants';
import { MARITAL_STATUS_VALUES } from '../personal-details/personal-details.constants';
import Withholding from './withholding';
import TaxCredit from './tax-credit';
import PremiumObligation from './premium-obligation';
import AdditionalCalculationCommonSection from './additional-calculation-common-section';
import DossierGenericContainer from '../common/dossier-generic-container';
import * as requests from '../tax-forecast-request';
import { ContainerWrapper } from '../../../common/styled-wrapper';

const AdditionalCalculationWrapper = styled(ContainerWrapper)`
  && .head-cell {
    color: ${({ theme }) => theme.currencyText};
    font-size: ${({ theme }) => theme.fontSizes.fs12};
    font-weight: 500;
    text-transform: uppercase;
  }

  && .mdc-layout-grid {
    padding: ${({ theme }) => theme.paddings.large} 0;

    &__inner {
      grid-gap: 15px;
    }
  }
`;

/**
 * Tax Forecast - Additional Calculation Information component with section(s) related to both taxable subject and fiscal partner
 */
const AdditionalCalculationInformationContainer = ({
  fieldNamePrefix,
  shouldDisplaySection,
  values,
  setValues,
  handleSelectedSection,
  calculateUpdatedTax,
  isDirty,
  isSubmitting,
  setFieldValue,
  location,
}) => {
  const {
    dossierData,
    dossierData: {
      dossierManifest: {
        dossierId,
        taxableYear,
      },
      personalDetails,
    },
    globalClientId,
    saveDossierDetails,
  } = useContext(TaxForecastContext);

  const handleAutoSave = useAsyncCallback(async (formValues) => {
    saveDossierDetails(formValues, SECTION_KEY, false);
    await requests.saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep(dossierData),
      [SECTION_KEY]: { ...cleanDeep(formValues, false, [0]) },
    });
  }, [], { displayLoader: false });

  return (
    <AdditionalCalculationWrapper data-ta="additional-calculation-container">
      <div className="tab-container">
        {shouldDisplaySection(SECTION_LIST[0].value) && (
          <Withholding
            heading={translate('withholdings-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[0].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[1].value) && (
          <TaxCredit
            values={values}
            isJointDeclaration={personalDetails.isJointDeclaration}
            isSingle={personalDetails.taxableSubjectDetails.maritalStatus === MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR}
            heading={translate('tax-credit-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[1].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
            sectionKey={INNER_SECTIONS_KEYS[1]}
            setFieldValue={setFieldValue}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[2].value) && (
          <AdditionalCalculationCommonSection
            heading={translate('losses-yet-to-settle-box-1-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[2].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
            sectionKey={INNER_SECTIONS_KEYS[2]}
            setFieldValue={setFieldValue}
            dataTa={INNER_SECTIONS_KEYS[2]}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[3].value) && (
          <AdditionalCalculationCommonSection
            heading={translate('residual-personal-deductions-label')}
            handleRemove={() => {
              /** removing subject and partner values for this section */
              const updatedValues = {
                ...values,
                [SUBJECT_AND_FISCAL_PARTNER_KEYS[0]]: {
                  ...values[SUBJECT_AND_FISCAL_PARTNER_KEYS[0]],
                  [INNER_SECTIONS_KEYS[3]]: { ...INITIAL_ADDITIONAL_CALCULATION_DATA[INNER_SECTIONS_KEYS[3]] },
                },
                ...(personalDetails?.fiscalPartner?.taxableSubjectId ? {
                  [SUBJECT_AND_FISCAL_PARTNER_KEYS[1]]: {
                    ...values[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]],
                    [INNER_SECTIONS_KEYS[3]]: { ...INITIAL_ADDITIONAL_CALCULATION_DATA[INNER_SECTIONS_KEYS[3]] },
                  },
                } : {}),
              };
              handleSelectedSection(SECTION_LIST[3].value, false, updatedValues, setValues, true);
            }}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => {
              /** updating parnter section for this joint section */
              const updatedValues = {
                ...values,
                ...(personalDetails?.fiscalPartner?.taxableSubjectId ? {
                  [SUBJECT_AND_FISCAL_PARTNER_KEYS[1]]: {
                    ...values[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]],
                    [INNER_SECTIONS_KEYS[3]]: {
                      ...values[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]][INNER_SECTIONS_KEYS[3]],
                      amount: values[fieldNamePrefix][INNER_SECTIONS_KEYS[3]].amount,
                    },
                  },
                } : {}),
              };
              setValues(updatedValues);
              calculateUpdatedTax(values, SECTION_KEY);
            }}
            sectionKey={INNER_SECTIONS_KEYS[3]}
            setFieldValue={setFieldValue}
            dataTa={INNER_SECTIONS_KEYS[3]}
            isJointSection={(fieldNamePrefix === SUBJECT_AND_FISCAL_PARTNER_KEYS[1])}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[4].value) && (
          <AdditionalCalculationCommonSection
            heading={translate('losses-yet-to-settle-box-2-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[4].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
            sectionKey={INNER_SECTIONS_KEYS[4]}
            setFieldValue={setFieldValue}
            dataTa={INNER_SECTIONS_KEYS[4]}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[5].value) && (
          <PremiumObligation
            heading={translate('premium-obligation-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[5].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            sectionKey={INNER_SECTIONS_KEYS[5]}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
            taxableYear={taxableYear}
          />
        )}
        {shouldDisplaySection(SECTION_LIST[6].value) && (
          <AdditionalCalculationCommonSection
            heading={translate('revision-interest-label')}
            handleRemove={() => handleSelectedSection(SECTION_LIST[6].value, false, values, setValues)}
            fieldNamePrefix={fieldNamePrefix}
            updateTaxCalculation={() => calculateUpdatedTax(values, SECTION_KEY)}
            sectionKey={INNER_SECTIONS_KEYS[6]}
            setFieldValue={setFieldValue}
            dataTa={INNER_SECTIONS_KEYS[6]}
          />
        )}
        <AutoSave
          enable={isDirty && !isSubmitting}
          values={values}
          onSave={handleAutoSave}
        />
      </div>
    </AdditionalCalculationWrapper>
  );
};

/** To remove the data from Formik state */
const removeDataFromFormik = (field, setValues, values, fieldNamePrefix, calculateUpdatedTax) => {
  const sectionKey = INNER_SECTIONS_KEYS[field];
  const updatedValues = {
    ...values,
    [fieldNamePrefix]: {
      ...values[fieldNamePrefix],
      [sectionKey]: {
        ...values[fieldNamePrefix][sectionKey],
        ...INITIAL_DATA[SECTION_KEY][fieldNamePrefix][sectionKey],
      },
    },
  };
  setValues(updatedValues);
  calculateUpdatedTax(updatedValues, SECTION_KEY);
};

const getInitialAdditionalCalculationInfoDataAndUpdateDefaultSections = (
  prevState,
  setSelectedSections,
  reportValues,
  partnerId,
) => {
  const additionalCalculationInfoData = { ...prevState };
  const cleanedPrevState = cleanDeep(prevState, false, [0]);
  let sectionsToDisplay = { taxableSubjectSections: [], fiscalPartnerSections: [] };

  SUBJECT_AND_FISCAL_PARTNER_KEYS.forEach(
    (subjectOrPartner, subjectOrPartnerIndex) => INNER_SECTIONS_KEYS.forEach(
      (section, index) => {
        const sectionName = INNER_SECTIONS_KEYS[index];
        /** check whether we have subject or partner data in backend response */
        if (cleanedPrevState?.[subjectOrPartner]) {
          /** checking whether this sub section is seleted or not */
          if (cleanedPrevState?.[subjectOrPartner]?.[sectionName]) {
            /** set this section to setSelectedSections */
            if (partnerId && (index === 3) && (subjectOrPartnerIndex === 0)) {
              additionalCalculationInfoData[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]] = {
                ...additionalCalculationInfoData?.[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]],
                residualPersonalDeductionsOfLastYear: { ...cleanedPrevState[subjectOrPartner][sectionName] },
              };
              cleanedPrevState[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]] = {
                ...cleanedPrevState?.[SUBJECT_AND_FISCAL_PARTNER_KEYS[1]],
                residualPersonalDeductionsOfLastYear: { ...cleanedPrevState[subjectOrPartner][sectionName] },
              };
            }
            sectionsToDisplay = {
              ...sectionsToDisplay,
              [SECTIONS_TO_DISPLAY_KEYS[subjectOrPartnerIndex]]: [
                ...sectionsToDisplay[SECTIONS_TO_DISPLAY_KEYS[subjectOrPartnerIndex]],
                index,
              ],
            };
          } else {
            /** intialize section data if it isn't available in response */
            additionalCalculationInfoData[subjectOrPartner] = {
              ...additionalCalculationInfoData[subjectOrPartner],
              [sectionName]: { ...INITIAL_ADDITIONAL_CALCULATION_DATA[sectionName] },
            };
          }
        } else {
          additionalCalculationInfoData[subjectOrPartner] = { ...INITIAL_ADDITIONAL_CALCULATION_DATA };
        }
      },
    ),
  );
  setSelectedSections(sectionsToDisplay);
  return additionalCalculationInfoData;
};

AdditionalCalculationInformationContainer.propTypes = {
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
  /** formik render prop to set value of a specific field */
  setFieldValue: PropTypes.func.isRequired,
};

export default (({
  dossierDataKey = SECTION_KEY,
  dataTa = 'tax-forecast-additional-calculation-information-form',
  validationSchema = additionalCalculationInformationValidationSchema,
  sectionList = SECTION_LIST,
  subjecAndPartnerKeys = SUBJECT_AND_FISCAL_PARTNER_KEYS,
  getInitialDataAndUpdateDefaultSections = getInitialAdditionalCalculationInfoDataAndUpdateDefaultSections,
  removeData = removeDataFromFormik,
  addSectionButtonText = translate('additional-calculation-information'),
  addSectionButtonDataTa = 'add-additional-calculation-information',
  heading = translate('additional-calculation-information'),
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
})(AdditionalCalculationInformationContainer));

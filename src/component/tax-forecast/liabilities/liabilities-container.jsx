import React, {
  useContext, useMemo, useState, useCallback, useEffect, useRef,
} from 'react';
import {
  Drawer, Button, Icon, Form,
} from '@visionplanner/ui-react-material';
import {
  AutoSave, useAsyncCallback, usePopOverDismissEvents, StickyContainer,
} from '@visionplanner/vp-ui-fiscal-library';
import {
  SectionOptionsWrapper, ContainerWrapper,
} from '../../../common/styled-wrapper';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import TaxForecastContext from '../tax-forecast-context';
import { getUpdatedAllocationDetails } from '../common/utils';
import {
  SECTION_LIST,
  LIABILITIES_SECTIONAL_KEYS_LIST,
  LIABILITIES_FIELD_NAME,
  LIABILITIES_SECTION_KEYS_ARR,
  LOAN_FOR_OWN_HOMES_EMPTY_OBJECT,
  LIABILITIES_KEY,
  INITIAL_JOINT_LIABILITIES,
} from './liabilities.constants';
import IncomeFromBusinessHeading from '../income-from-business/common/income-from-business-heading';
import LoansForOwnHome from './loans-for-own-home';
import { cleanDeep, emptyFunction } from '../../../common/utils';
import { getOwners } from '../income-from-business/common/utils';
import * as requests from '../tax-forecast-request';
import { STICKY_CUSTOM_STYLES } from '../tax-forecast.constants';
import TaxAmount from '../income-from-business/common/tax-amount';
import OtherAmounts from './other-amounts';
import { liabilityValidationSchema } from './liabilities-validation-schema';
import { ALLOCATION_FIELD_NAME } from '../allocation/allocation.constants';

/**
  * Tax Forecast - Liabilities Component with sections to specify liabilities
  *
  */

const LiabilitiesContainer = ({ location }) => {
  const {
    dossierData: {
      liabilitiesScreen,
      masterData: { owners },
      dossierManifest: { taxableYear, dossierId },
    },
    dossierData,
    countries,
    saveDossierDetails,
    globalClientId,
    calculateUpdatedTax,
  } = useContext(TaxForecastContext);
  const {
    ref,
    isComponentVisible: showSectionOptions,
    setIsComponentVisible: setShowSectionOptions,
  } = usePopOverDismissEvents();
  const [formData, setFormData] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [validateIndicator, setValidateIndicator] = useState(false);
  const ownerOptions = useMemo(() => getOwners(owners), [owners]);

  const handleSave = useAsyncCallback(async (formValues) => {
    let dossierDetails = { ...dossierData };
    if (dossierData?.personalDetails?.isJointDeclaration) {
      dossierDetails = await getUpdatedAllocationDetails({ ...dossierDetails, [LIABILITIES_FIELD_NAME]: cleanDeep(formValues) });
    }
    saveDossierDetails({ [LIABILITIES_FIELD_NAME]: formValues, [ALLOCATION_FIELD_NAME]: dossierDetails[ALLOCATION_FIELD_NAME] }, null, false);
    await requests.saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep({
        ...dossierDetails,
        [LIABILITIES_FIELD_NAME]: { ...formValues },
      }),
    });
  }, [], { displayLoader: false });

  const menuList = useMemo(() => {
    const sections = [...selectedSections];
    return SECTION_LIST.map((item) => ({ ...item, disabled: sections.includes(item.value) }));
  }, [selectedSections]);

  // To rerun validation
  const validateRef = useRef(null);
  useEffect(() => {
    const handleValidateForm = () => {
      validateRef.current();
      setValidateIndicator(true);
    };
    validateRef?.current && !validateIndicator && handleValidateForm();
  }, [formData, validateIndicator]);

  useEffect(() => {
    /**
     * To display the default sections when data is received from backend,
     * If we've recieved only few sections from backend, will assign remaining default sections.
     */
    setFormData(() => getInitialDataAndUpdateDefaultSections());
  }, [getInitialDataAndUpdateDefaultSections]);

  const getInitialDataAndUpdateDefaultSections = useCallback(() => {
    const liabilitiesData = { ...liabilitiesScreen };
    const sectionsToDisplay = [];

    if (liabilitiesData?.jointLiabilities) {
      LIABILITIES_SECTIONAL_KEYS_LIST.map((section, index) => {
        const currentObj = liabilitiesData.jointLiabilities[section];
        if (currentObj && Object.keys(cleanDeep(currentObj)).length) {
          const innerFields = LIABILITIES_SECTION_KEYS_ARR[section];
          let isSectionDataAvailable;
          const ownHomeData = currentObj.map((currentRow) => {
            const ownHomeRow = { ...currentRow };
            innerFields.forEach((field) => {
              if (Object.keys(cleanDeep(ownHomeRow[field])).length) {
                // As section is available and initialization is not required. So returning true to indicate section presence.
                isSectionDataAvailable = true;
              } else {
                ownHomeRow[field] = LOAN_FOR_OWN_HOMES_EMPTY_OBJECT[section][field];
              }
            });
            return ownHomeRow;
          });
          liabilitiesData.jointLiabilities = {
            ...liabilitiesData.jointLiabilities,
            [section]: [...ownHomeData],
          };
          sectionsToDisplay.push(index);
          // As section is available and initialization is not required. So returning true to indicate section presence.
          return isSectionDataAvailable;
        }
        // To initialize the section data if the sectional data is not available in server response
        liabilitiesData.jointLiabilities = { ...liabilitiesData.jointLiabilities, [section]: [...INITIAL_JOINT_LIABILITIES[section]] };

        // As section is not available and initialization required. So returning false to indicate section not there.
        return false;
      });
    } else {
      liabilitiesData.jointLiabilities = { ...INITIAL_JOINT_LIABILITIES };
    }
    setSelectedSections(sectionsToDisplay);
    return liabilitiesData;
  }, [liabilitiesScreen]);

  const removeAddedData = useCallback((sectionValue, values, setValues) => {
    const section = LIABILITIES_SECTIONAL_KEYS_LIST[sectionValue];
    const updatedValues = {
      ...values,
      jointLiabilities: {
        ...values.jointLiabilities,
        [section]: INITIAL_JOINT_LIABILITIES[section],
      },
    };
    setValues(updatedValues);
    saveDossierDetails(updatedValues, LIABILITIES_KEY, false);
    calculateUpdatedTax(updatedValues, LIABILITIES_KEY);
  }, [calculateUpdatedTax, saveDossierDetails]);

  const handleSelectedSection = useCallback((sectionValue, isSelected, values, setValues) => {
    if (isSelected) {
      setSelectedSections([
        ...selectedSections,
        sectionValue,
      ]);
      setShowSectionOptions(false);
    } else {
      removeAddedData(sectionValue, values, setValues);
      setSelectedSections(selectedSections.filter((value) => value !== sectionValue));
    }
  }, [removeAddedData, selectedSections, setShowSectionOptions]);

  const shouldDisplaySection = useCallback((sectionIndex) => {
    const sections = [...selectedSections];
    return sections.includes(sectionIndex);
  }, [selectedSections]);

  /** to handle the removal callback of own home row */
  const handleRemoveLoansForOwnHomeRow = (index, sectionKey, values, setValues) => {
    const updatedSectionData = values.jointLiabilities[sectionKey].filter((value, currentRowIndex) => currentRowIndex !== index);
    const updatedValues = {
      ...values,
      jointLiabilities: {
        ...values.jointLiabilities,
        [sectionKey]: updatedSectionData,
      },
    };
    setValues(updatedValues);
    saveDossierDetails(updatedValues, LIABILITIES_KEY, false);
    calculateUpdatedTax(updatedValues, LIABILITIES_KEY);
  };

  const handleLoansForOwnHomeData = (data, index, sectionKey, values, setValues) => {
    let sectionData = [...values.jointLiabilities[sectionKey]];
    if (index !== undefined) {
      sectionData = sectionData.map((sectionObj, sectionIndex) => (index === sectionIndex ? { ...data } : { ...sectionObj }));
    } else {
      sectionData = [...sectionData, { ...data }];
    }
    const updatedValues = {
      ...values,
      jointLiabilities: {
        ...values.jointLiabilities,
        [sectionKey]: sectionData,
      },
    };
    setValues(updatedValues);
    saveDossierDetails(updatedValues, LIABILITIES_KEY, false);
    calculateUpdatedTax(updatedValues, LIABILITIES_KEY);
  };

  return (
    formData && (
      <Form
        initialValues={formData}
        dataTa="liabilities-form"
        onSubmit={emptyFunction}
        validateFormSchema={liabilityValidationSchema}
        validateOnMount
      >
        {({
          values, setValues, isDirty, isSubmitting, validateForm,
        }) => {
          validateRef.current = validateForm;
          return (
            <ContainerWrapper data-ta="liabilities-section" className="liabilities-container">
              <TaxAmount />
              <StickyContainer
                customStyles={STICKY_CUSTOM_STYLES}
                stickyContent={(
                  <IncomeFromBusinessHeading
                    heading={translate('liabilities')}
                    displayJointTab
                    location={location}
                  />
                )}
              >
                <div className="tab-container">
                  {shouldDisplaySection(SECTION_LIST[0].value)
                    && (
                      <LoansForOwnHome
                        handleRemove={() => {
                          handleSelectedSection(SECTION_LIST[0].value, false, values, setValues);
                        }}
                        values={values.jointLiabilities.loansForOwnHome}
                        handleLoansForOwnHomeData={(data, index, sectionKey) => handleLoansForOwnHomeData(data, index, sectionKey, values, setValues)}
                        handleRemoveLoansForOwnHomeRow={(index, sectionKey) => handleRemoveLoansForOwnHomeRow(index, sectionKey, values, setValues)}
                        owners={ownerOptions}
                        countries={countries}
                        taxableYear={taxableYear}
                        sectionKey="loansForOwnHome"
                        buttonLabel={translate('own-homes-label')}
                      />
                    )}
                  {shouldDisplaySection(SECTION_LIST[1].value)
                    && (
                      <LoansForOwnHome
                        handleRemove={() => {
                          handleSelectedSection(SECTION_LIST[1].value, false, values, setValues);
                        }}
                        values={values.jointLiabilities.residualLoans}
                        handleLoansForOwnHomeData={(data, index, sectionKey) => handleLoansForOwnHomeData(data, index, sectionKey, values, setValues)}
                        handleRemoveLoansForOwnHomeRow={(index, sectionKey) => handleRemoveLoansForOwnHomeRow(index, sectionKey, values, setValues)}
                        owners={ownerOptions}
                        countries={countries}
                        taxableYear={taxableYear}
                        sectionKey="residualLoans"
                        heading={translate('residual-loan-for-own-home')}
                        buttonLabel={translate('residual-loan-add-text')}
                        dataTa="loans-for-residual-own-home-section"
                      />
                    )}
                  {shouldDisplaySection(SECTION_LIST[2].value)
                    && (
                      <OtherAmounts
                        handleRemove={() => handleSelectedSection(SECTION_LIST[2].value, false, values, setValues)}
                        name="jointLiabilities.otherLoans"
                        values={values.jointLiabilities.otherLoans}
                        owners={ownerOptions}
                        countries={countries}
                        updateTaxCalculation={() => calculateUpdatedTax(values, LIABILITIES_KEY)}
                      />
                    )}
                </div>
                <AutoSave
                  enable={isDirty && !isSubmitting}
                  values={values}
                  onSave={handleSave}
                />
                <SectionOptionsWrapper ref={ref}>
                  <Button
                    buttonType="secondary"
                    className="add-new-section-button mar-ver-sm"
                    onClick={() => setShowSectionOptions(!showSectionOptions)}
                    dataTa="add-liabilities-sections"
                    disabled={selectedSections.length === menuList.length}
                  >
                    <Icon iconSet="far" name="plus" className="plus-icon" />
                    {` ${translate('liabilities')}`}
                  </Button>
                  {showSectionOptions && (
                    <Drawer
                      menuList={menuList}
                      handleClick={(item) => handleSelectedSection(item.value, true, values, setValues)}
                    />
                  )}
                </SectionOptionsWrapper>
              </StickyContainer>
            </ContainerWrapper>
          );
        }}
      </Form>
    )
  );
};

export default LiabilitiesContainer;

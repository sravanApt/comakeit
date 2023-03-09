import React, {
  useState, useMemo, useCallback, useContext, useEffect, useRef,
} from 'react';
import {
  Form, Drawer, Button, Icon,
} from '@visionplanner/ui-react-material';
import {
  StickyContainer, usePopOverDismissEvents, useAsyncCallback, AutoSave,
} from '@visionplanner/vp-ui-fiscal-library';
import TaxForecastContext from '../tax-forecast-context';
import {
  SectionOptionsWrapper, ContainerWrapper as AssetsStyledWrapper,
} from '../../../common/styled-wrapper';
import { assetsTranslate as translate } from './assets-translate';
import { STICKY_CUSTOM_STYLES } from '../tax-forecast.constants';
import { getUpdatedAllocationDetails } from '../common/utils';
import { ALLOCATION_FIELD_NAME } from '../allocation/allocation.constants';
import {
  SECTION_LIST,
  ASSETS_KEY,
  ASSETS_SECTIONAL_KEYS_LIST,
  OWN_HOME_SECTION_KEY,
  OTHER_PROPERTIES_SECTION_KEY,
  BANK_ACCOUNT_SECTION_KEY,
  INVESTMENTS_ACCOUNT_SECTION_KEY,
  ENVIRONMENTAL_INVESTMENTS_SECTION_KEY,
  ASSETS_VALIDATION,
  OTHER_PROPERTIES_REPORT_KEY,
} from './assets.constants';
import IncomeFromBusinessHeading from '../income-from-business/common/income-from-business-heading';
import TaxAmount from '../income-from-business/common/tax-amount';
import { INITIAL_ASSETS_DATA } from './assets-initial-data';
import OwnHomesOrOtherProperties from './own-homes-or-other-properties';
import SubstantialInterest from './substantial-interest';
import AccountsOrInvestments from './accounts-or-investments';
import CommonAutoIncrementTable from './assets-auto-increment-common-table';
import { cleanDeep, emptyFunction } from '../../../common/utils';

import { saveDeclaration } from '../tax-forecast-request';
import { taxCalculationReport } from '../expenditure/expenditure-requests';

/**
  * Tax Forecast - Assets Component with several assets sections for the both taxable subject and fiscal partner (JOINT)
  *
  */
const AssetsContainer = ({ location }) => {
  const {
    dossierData,
    dossierData: {
      assetsScreen,
      dossierManifest: {
        dossierId,
      },
    },
    saveDossierDetails,
    globalClientId,
    calculateUpdatedTax,
  } = useContext(TaxForecastContext);
  const [formData, setFormData] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [validateIndicator, setValidateIndicator] = useState(false);
  const initialData = useRef(assetsScreen);

  const {
    ref,
    isComponentVisible: showSectionOptions,
    setIsComponentVisible: setShowSectionOptions,
  } = usePopOverDismissEvents();

  const menuList = useMemo(() => SECTION_LIST.map((item) => ({ ...item, disabled: selectedSections.includes(item.value) })), [selectedSections]);
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
    getInitialDataAndUpdateDefaultSections(initialData.current);
  }, [getInitialDataAndUpdateDefaultSections]);

  const getInitialDataAndUpdateDefaultSections = useCallback((previousAssetsData) => {
    const assetsData = { ...previousAssetsData };
    const sectionsToDisplay = [];
    if (assetsData?.jointAssets) {
      ASSETS_SECTIONAL_KEYS_LIST.forEach((section, index) => {
        const currentObj = assetsData.jointAssets[section];
        if (currentObj && Object.keys(cleanDeep(currentObj)).length) {
          sectionsToDisplay.push(index);
          // As section is available and initialization is not required. So returning true to indicate section presence.
          return true;
        }
        // To initialize the section data if the sectional data is not available in server response
        assetsData.jointAssets = { ...assetsData.jointAssets, [section]: INITIAL_ASSETS_DATA[ASSETS_KEY].jointAssets[section] };
        return assetsData;
      });
    } else {
      assetsData.jointAssets = { ...INITIAL_ASSETS_DATA[ASSETS_KEY].jointAssets };
    }
    setSelectedSections(sectionsToDisplay);
    setFormData(assetsData);
  }, []);

  const removeAddedData = useCallback((sectionValue, values, setValues) => {
    const sectionKey = ASSETS_SECTIONAL_KEYS_LIST[sectionValue];
    const updatedAssetValues = {
      ...values,
      jointAssets: {
        ...values.jointAssets,
        [sectionKey]: INITIAL_ASSETS_DATA[ASSETS_KEY].jointAssets[sectionKey],
      },
    };
    setValues(updatedAssetValues);
    saveDossierDetails(updatedAssetValues, ASSETS_KEY, false);
    calculateUpdatedTax(updatedAssetValues, ASSETS_KEY, null, true);
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

  const handleAssetsData = useAsyncCallback(async ({
    data, values, setValues, index, sectionKey,
  }) => {
    let sectionData = [...(values.jointAssets[sectionKey] || [])];
    if (data !== undefined) {
      if (index !== undefined) {
        sectionData[index] = data;
      } else {
        sectionData.push(data);
      }
    } else {
      sectionData = sectionData.filter((value, currentRowIndex) => currentRowIndex !== index);
    }
    const updatedAssetValues = {
      ...values,
      jointAssets: {
        ...values.jointAssets,
        [sectionKey]: sectionData,
      },
    };
    calculateUpdatedTax(updatedAssetValues, ASSETS_KEY, null, true);
    if (sectionKey === ASSETS_SECTIONAL_KEYS_LIST[2]) {
      const reportResponse = await taxCalculationReport(OTHER_PROPERTIES_REPORT_KEY, false, cleanDeep({
        ...dossierData,
        [ASSETS_KEY]: { ...updatedAssetValues },
      }));
      if (reportResponse?.AssetsImmovableOtherProperty?.length) {
        const reportData = reportResponse.AssetsImmovableOtherProperty;
        const updatedSectionData = sectionData.map((item) => {
          const objIndex = reportData.findIndex(((obj) => obj.id === item.id));
          return { ...item, calculatedValue: reportData[objIndex].amount };
        });
        setValues({
          ...updatedAssetValues,
          jointAssets: {
            ...updatedAssetValues.jointAssets,
            [sectionKey]: updatedSectionData,
          },
        });
      } else {
        setValues(updatedAssetValues);
      }
    } else {
      setValues(updatedAssetValues);
    }
  }, []);

  const handleSave = useAsyncCallback(async (formValues) => {
    let dossierDetails = { ...dossierData };
    if (dossierData?.personalDetails?.isJointDeclaration) {
      dossierDetails = await getUpdatedAllocationDetails({ ...dossierDetails, [ASSETS_KEY]: cleanDeep(formValues) });
    }
    saveDossierDetails({ [ASSETS_KEY]: formValues, [ALLOCATION_FIELD_NAME]: dossierDetails[ALLOCATION_FIELD_NAME] }, null, false);
    await saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep({
        ...dossierDetails,
        [ASSETS_KEY]: { ...formValues },
      }),
    });
  }, [], { displayLoader: false });

  return (
    formData && (
      <Form
        initialValues={formData}
        dataTa="tax-forecast-assets"
        onSubmit={emptyFunction}
        validateFormSchema={ASSETS_VALIDATION}
        validateOnMount
      >
        {({
          values, setValues, isDirty, isSubmitting, validateForm,
        }) => {
          validateRef.current = validateForm;
          return (
            <AssetsStyledWrapper data-ta="assets-section" className="assets-container">
              <TaxAmount />
              <StickyContainer
                customStyles={STICKY_CUSTOM_STYLES}
                stickyContent={(
                  <IncomeFromBusinessHeading
                    heading={translate('assets')}
                    displayJointTab
                    location={location}
                  />
                )}
              >
                <div className="tab-container">
                  {selectedSections.includes(SECTION_LIST[0].value)
                  && (
                    <SubstantialInterest
                      values={values.jointAssets.substantialInterests}
                      handleRemove={() => handleSelectedSection(SECTION_LIST[0].value, false, values, setValues)}
                      handleSubstantialInterestData={
                        (data, index) => handleAssetsData({
                          data, values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[0].value],
                        })}
                      handleRemoveSubstantialInterestTableRow={
                        (index) => handleAssetsData({
                          values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[0].value],
                        })}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[1].value)
                  && (
                    <OwnHomesOrOtherProperties
                      values={values.jointAssets.ownHomes}
                      handleRemove={() => handleSelectedSection(SECTION_LIST[1].value, false, values, setValues)}
                      handleOwnHomesOrOtherPropertiesData={
                        (data, index) => handleAssetsData({
                          data, values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[1].value],
                        })}
                      handleRemoveOwnHomeOrOtherPropertyRow={
                        (index) => handleAssetsData({
                          values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[1].value],
                        })}
                      modalKey="add-assets-own-homes-modal"
                      sectionKey={OWN_HOME_SECTION_KEY}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[2].value)
                  && (
                    <OwnHomesOrOtherProperties
                      values={values.jointAssets.otherProperties}
                      handleRemove={() => handleSelectedSection(SECTION_LIST[2].value, false, values, setValues)}
                      handleOwnHomesOrOtherPropertiesData={
                        (data, index) => handleAssetsData({
                          data, values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[2].value],
                        })}
                      handleRemoveOwnHomeOrOtherPropertyRow={
                        (index) => handleAssetsData({
                          values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[2].value],
                        })}
                      modalKey="add-assets-other-properties-modal"
                      sectionKey={OTHER_PROPERTIES_SECTION_KEY}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[3].value)
                  && (
                    <AccountsOrInvestments
                      sectionKey={BANK_ACCOUNT_SECTION_KEY}
                      values={values.jointAssets.bankAccounts}
                      name="jointAssets.bankAccounts"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[3].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[4].value)
                  && (
                    <AccountsOrInvestments
                      sectionKey={INVESTMENTS_ACCOUNT_SECTION_KEY}
                      values={values.jointAssets.investmentAccounts}
                      name="jointAssets.investmentAccounts"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[4].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                      handleAccountsOrInvestmentsData={
                        (data, index) => handleAssetsData({
                          data, values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[4].value],
                        })
                      }
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[5].value)
                  && (
                    <AccountsOrInvestments
                      sectionKey={ENVIRONMENTAL_INVESTMENTS_SECTION_KEY}
                      values={values.jointAssets.environmentalInvestments}
                      name="jointAssets.environmentalInvestments"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[5].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                      handleAccountsOrInvestmentsData={
                        (data, index) => handleAssetsData({
                          data, values, setValues, index, sectionKey: ASSETS_SECTIONAL_KEYS_LIST[SECTION_LIST[5].value],
                        })
                      }
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[6].value)
                  && (
                    <CommonAutoIncrementTable
                      sectionKey="net-worth-of-periodical-benefits"
                      values={values.jointAssets.periodicalBenefits}
                      name="jointAssets.periodicalBenefits"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[6].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[7].value)
                  && (
                    <CommonAutoIncrementTable
                      sectionKey="outstanding-loan-or-cash"
                      values={values.jointAssets.outStandingLoansOrCash}
                      name="jointAssets.outStandingLoansOrCash"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[7].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[8].value)
                  && (
                    <CommonAutoIncrementTable
                      sectionKey="other-assets"
                      values={values.jointAssets.otherAssets}
                      name="jointAssets.otherAssets"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[8].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                    />
                  )
                  }
                  {selectedSections.includes(SECTION_LIST[9].value)
                  && (
                    <CommonAutoIncrementTable
                      sectionKey="non-exempt-capital-insurance"
                      values={values.jointAssets.nonExemptCapitalInsurances}
                      name="jointAssets.nonExemptCapitalInsurances"
                      handleRemove={() => handleSelectedSection(SECTION_LIST[9].value, false, values, setValues)}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ASSETS_KEY, null, true)}
                    />
                  )
                  }
                </div>
                <SectionOptionsWrapper ref={ref}>
                  <Button
                    buttonType="secondary"
                    className="add-new-section-button mar-ver-sm"
                    onClick={() => setShowSectionOptions(!showSectionOptions)}
                    dataTa="add-assets-section-button"
                    disabled={selectedSections.length === menuList.length}
                  >
                    <Icon iconSet="far" name="plus" className="plus-icon" />
                    {` ${translate('assets')}`}
                  </Button>
                  {showSectionOptions && (
                    <Drawer
                      menuList={menuList}
                      handleClick={(item) => handleSelectedSection(item.value, true, values, setValues)}
                    />
                  )}
                </SectionOptionsWrapper>
              </StickyContainer>
              <AutoSave
                enable={isDirty && !isSubmitting}
                values={values}
                onSave={handleSave}
              />
            </AssetsStyledWrapper>
          );
        }}
      </Form>
    )
  );
};

export default AssetsContainer;

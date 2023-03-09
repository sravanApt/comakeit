import React, {
  useState, useContext, useMemo, useCallback, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  Drawer, Form, Button, Icon,
} from '@visionplanner/ui-react-material';
import { usePopOverDismissEvents, StickyContainer } from '@visionplanner/vp-ui-fiscal-library';
import {
  SectionOptionsWrapper,
} from '../../../common/styled-wrapper';
import TaxForecastContext from '../tax-forecast-context';
import IncomeFromBusinessHeading from '../income-from-business/common/income-from-business-heading';
import TaxAmount from '../income-from-business/common/tax-amount';
import { STICKY_CUSTOM_STYLES } from '../tax-forecast.constants';
import { emptyFunction } from '../../../common/utils';

/**
  * Tax Forecast - HOC to handle the common functionalities of dossier forms.
  * i.e, initialization, menu list, tab change, add new section, delete and display/hide a section functionalities.
  *
  */
const initialSelectedSections = { fiscalPartnerSections: [], taxableSubjectSections: [] };

const DossierGenericContainer = ({
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
}) => {
  const {
    dossierData, calculateUpdatedTax, countries, activeTab, isPartner,
  } = useContext(TaxForecastContext);
  const [selectedSections, setSelectedSections] = useState(initialSelectedSections);
  const [reportTotalValues, setReportTotalValues] = useState(null);
  const {
    ref,
    isComponentVisible: sectionOptions,
    setIsComponentVisible: setSectionOptions,
  } = usePopOverDismissEvents();
  const [formData, setFormData] = useState(null);
  const fieldNamePrefix = subjecAndPartnerKeys[activeTab];
  const isFormChanged = useRef(false);

  const setFormChanged = (changedState) => {
    isFormChanged.current = changedState;
  };

  // To rerun validation
  const [validateIndicator, setValidateIndicator] = useState(false);
  const validateRef = useRef(null);
  useEffect(() => {
    const handleValidateForm = () => {
      validateRef.current();
      setValidateIndicator(true);
    };
    validateRef?.current && !validateIndicator && handleValidateForm();
  }, [formData, validateIndicator]);

  const initialData = useRef(dossierData?.[dossierDataKey]);
  useEffect(() => {
    /** To display the default sections when data is received from backend,
     * If we've recieved only few sections from backend, will assign remaining default sections.
     */
    const displayDefaultSectionsAndInitialize = () => {
      setFormData(() => getInitialDataAndUpdateDefaultSections(initialData.current, setSelectedSections, setReportTotalValues, dossierData?.personalDetails?.fiscalPartner?.taxableSubjectId));
    };

    displayDefaultSectionsAndInitialize();
  }, [getInitialDataAndUpdateDefaultSections, dossierDataKey]);

  const menuList = useMemo(() => {
    const { fiscalPartnerSections, taxableSubjectSections } = selectedSections;
    if (!isPartner) {
      return sectionList.map((item) => ({ ...item, disabled: taxableSubjectSections.includes(item.value) }));
    }
    return sectionList.filter((listItem) => !listItem.isJointSection).map((item) => ({ ...item, disabled: fiscalPartnerSections.includes(item.value) }));
  }, [sectionList, selectedSections, isPartner]);

  const updateSections = (sections, field, isSelected) => (isSelected ? [...sections, field] : sections.filter((value) => value !== field));

  const handleSelectedSection = useCallback((field, isSelected, values, setValues, isJointSection = false) => {
    const { fiscalPartnerSections, taxableSubjectSections } = selectedSections;
    if (!isSelected) {
      removeAddedData(field, setValues, values, isJointSection);
    } else {
      setSectionOptions(!isSelected);
    }
    setSelectedSections({
      ...selectedSections,
      ...((isJointSection || !isPartner) ? {
        taxableSubjectSections: updateSections(taxableSubjectSections, field, isSelected),
      } : {}),
      ...((isJointSection || isPartner) ? {
        fiscalPartnerSections: updateSections(fiscalPartnerSections, field, isSelected),
      } : {}),
    });
  }, [selectedSections, isPartner, setSectionOptions, removeAddedData]);

  const shouldDisplaySection = useCallback((sectionIndex) => {
    const { fiscalPartnerSections, taxableSubjectSections } = selectedSections;
    if (!isPartner) {
      return taxableSubjectSections.includes(sectionIndex);
    }
    return fiscalPartnerSections.includes(sectionIndex);
  }, [selectedSections, isPartner]);

  /** To remove the data from formik state and to calculate the updated tax after removal */
  const removeAddedData = useCallback(async (field, setValues, values, isJointSection) => {
    isFormChanged.current = true;
    removeData(field, setValues, values, fieldNamePrefix, calculateUpdatedTax, isJointSection);
  }, [calculateUpdatedTax, fieldNamePrefix, removeData]);

  const disableMenuListButton = useMemo(() => (menuList.filter((menuItem) => !!menuItem.disabled)).length === menuList.length, [menuList]);

  return (
    (EnhancedComponent) => (
      formData && (
        <div className="income-container">
          <TaxAmount />
          <Form
            initialValues={formData}
            dataTa={dataTa}
            onSubmit={emptyFunction}
            validateFormSchema={validationSchema}
            validateOnMount
          >
            {
              ({
                values, setErrors, setValues, isDirty, isSubmitting, validateForm, setFieldValue,
              }) => {
                validateRef.current = validateForm;
                return (
                  <StickyContainer
                    customStyles={STICKY_CUSTOM_STYLES}
                    stickyContent={(
                      <IncomeFromBusinessHeading
                        heading={heading}
                        location={location}
                      />
                    )}
                  >
                    <EnhancedComponent
                      values={values}
                      setErrors={setErrors}
                      setValues={setValues}
                      shouldDisplaySection={shouldDisplaySection}
                      handleSelectedSection={handleSelectedSection}
                      countries={countries}
                      calculateUpdatedTax={calculateUpdatedTax}
                      fieldNamePrefix={fieldNamePrefix}
                      isDirty={isDirty || isFormChanged.current}
                      isSubmitting={isSubmitting}
                      tabIndex={activeTab}
                      setFormChanged={setFormChanged}
                      reportTotalValues={reportTotalValues}
                      setFieldValue={setFieldValue}
                    />
                    <SectionOptionsWrapper ref={ref}>
                      <Button
                        buttonType="secondary"
                        className="add-new-section-button mar-ver-sm"
                        onClick={() => setSectionOptions(!sectionOptions)}
                        dataTa={addSectionButtonDataTa}
                        disabled={disableMenuListButton}
                      >
                        <Icon iconSet="far" name="plus" className="plus-icon" />
                        {` ${addSectionButtonText}`}
                      </Button>
                      {sectionOptions && (
                        <Drawer
                          menuList={menuList}
                          handleClick={(item) => handleSelectedSection(item.value, true, values, setValues, item.isJointSection)}
                        />
                      )}
                    </SectionOptionsWrapper>
                  </StickyContainer>
                );
              }
            }
          </Form>
        </div>
      )
    )
  );
};

DossierGenericContainer.propTypes = {
  /** specifies key name to read the data from dossier object */
  dossierDataKey: PropTypes.string.isRequired,
  /** specifies form's data-ta value */
  dataTa: PropTypes.string,
  /** validation object for the form */
  validationSchema: PropTypes.object,
  /** specifies list of sections in the form */
  sectionList: PropTypes.array.isRequired,
  /** specifies the keys name for partner/subject */
  subjecAndPartnerKeys: PropTypes.object.isRequired,
  /** funciton to display default sections and initialization of sections */
  getInitialDataAndUpdateDefaultSections: PropTypes.func.isRequired,
  /** function to remove the data from formik state */
  removeData: PropTypes.func.isRequired,
  /** specifies text to display on add section button */
  addSectionButtonText: PropTypes.string.isRequired,
  /** specifies add section data-ta value */
  addSectionButtonDataTa: PropTypes.string,
  /** header text to display */
  heading: PropTypes.string.isRequired,
  /** specifies save button data-ta value */
  saveButtonDataTa: PropTypes.string,
};

export default DossierGenericContainer;

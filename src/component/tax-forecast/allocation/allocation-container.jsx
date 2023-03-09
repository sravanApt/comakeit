import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { Form } from '@visionplanner/ui-react-material';
import { StickyContainer, AutoSave, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import IncomeFromBusinessHeading from '../income-from-business/common/income-from-business-heading';
import { ContainerWrapper } from '../../../common/styled-wrapper';
import TaxAmount from '../income-from-business/common/tax-amount';
import { STICKY_CUSTOM_STYLES, ALLOCATION_DATA_KEYS } from '../tax-forecast.constants';
import { allocationTranslate as translate } from './allocation-translate';
import TaxForecastContext from '../tax-forecast-context';
import {
  ALLOCATION_FIELD_NAME,
  ALLOCATION_VALIDATION_SCHEMA,
} from './allocation.constants';
import { emptyFunction, cleanDeep } from '../../../common/utils';
import * as requests from '../tax-forecast-request';
import AllocationDetails from './allocation-details';

const AllocationContainer = ({ location }) => {
  const {
    dossierData,
    dossierData: {
      allocationDetails,
      dossierManifest: { dossierId },
      personalDetails,
    },
    saveDossierDetails,
    globalClientId,
    calculateUpdatedTax,
  } = useContext(TaxForecastContext);
  const [formData, setFormData] = useState(null);
  const [validateIndicator, setValidateIndicator] = useState(false);

  // To rerun validation
  const validateRef = useRef(null);
  useEffect(() => {
    const handleValidateForm = () => {
      validateRef.current();
      setValidateIndicator(true);
    };
    validateRef?.current && !validateIndicator && handleValidateForm();
  }, [formData, validateIndicator]);

  const fetchAllocationDetails = useAsyncCallback(async () => {
    const recommendedAllocationFlag = allocationDetails ? !!allocationDetails?.recommendedAllocation : true;
    const updatedAllocationData = await requests.allocationReport(recommendedAllocationFlag, { ...cleanDeep(dossierData) });

    if (allocationDetails && !allocationDetails?.recommendedAllocation) {
      ALLOCATION_DATA_KEYS.forEach((key) => {
        updatedAllocationData[key] = {
          ...updatedAllocationData[key],
          fiscalPartnerAmount: Number(updatedAllocationData[key].totalAmount) - Number(allocationDetails?.[key]?.taxableSubjectAmount || 0),
          taxableSubjectAmount: allocationDetails?.[key]?.taxableSubjectAmount,
        };
      });
    }
    setFormData({ ...updatedAllocationData, allocationFlag: updatedAllocationData.recommendedAllocation });
  }, [], { displayLoader: false });

  useEffect(() => {
    fetchAllocationDetails();
  }, [fetchAllocationDetails]);

  const handleSave = useAsyncCallback(async (formValues) => {
    saveDossierDetails(formValues, ALLOCATION_FIELD_NAME, false);
    await requests.saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep(dossierData),
      [ALLOCATION_FIELD_NAME]: { ...cleanDeep(formValues, false, [0]) },
    });
  }, [], { displayLoader: false });

  return (
    <ContainerWrapper data-ta="allocation-details-section" className="liabilities-container">
      <TaxAmount />
      <StickyContainer
        customStyles={STICKY_CUSTOM_STYLES}
        stickyContent={(
          <IncomeFromBusinessHeading
            heading={translate('allocation')}
            displayJointTab
            location={location}
          />
        )}
      >
        <div className="tab-container">
          {formData && (
            <Form
              initialValues={formData}
              dataTa="allocation-form"
              onSubmit={emptyFunction}
              validateFormSchema={ALLOCATION_VALIDATION_SCHEMA}
              validateOnMount
            >
              {({
                values, isDirty, isSubmitting, setValues, isValid, validateForm,
              }) => {
                validateRef.current = validateForm;
                return (
                  <>
                    <AllocationDetails
                      personalDetails={personalDetails}
                      values={values}
                      updateTaxCalculation={() => calculateUpdatedTax(values, ALLOCATION_FIELD_NAME)}
                      setValues={setValues}
                      handleSave={handleSave}
                    />
                    <AutoSave
                      enable={isDirty && isValid && !isSubmitting}
                      values={values}
                      onSave={handleSave}
                    />
                  </>
                );
              }}
            </Form>
          )}
        </div>
      </StickyContainer>
    </ContainerWrapper>
  );
};

export default AllocationContainer;

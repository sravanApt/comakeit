import React, {
  useEffect, useContext, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import * as Yup from 'yup';
import { Form } from '@visionplanner/ui-react-material';
import {
  StickyContainer, AutoSave, useAsyncCallback,
} from '@visionplanner/vp-ui-fiscal-library';
import { generalDetailsTranslate as translate } from './general-details-translate';
import TaxForecastHeading from '../tax-forecast-heading';
import TaxForecastContext from '../tax-forecast-context';
import {
  STICKY_CUSTOM_STYLES, PERSONAL_DETAILS,
} from '../tax-forecast.constants';
import GeneralInformation from './general-information';
import { emptyFunction, cleanDeep } from '../../../common/utils';
import { generalDetailsValidationSchema } from './general-details-validation-schema';
import { isEqualObjects } from '../income-from-business/common/utils';
import { saveDeclaration } from '../tax-forecast-request';

/**
  * Tax Forecast - General Information - Display information taxable subject,
  * fiscal partner etc.
  * We can add/edit the existing data
  */

const GeneralDetails = ({ className, theme, location }) => {
  const {
    dossierData,
    dossierData: {
      personalDetails: { generalDetails },
      dossierManifest: { dossierId, taxableYear },
    },
    saveDossierDetails,
    globalClientId,
  } = useContext(TaxForecastContext);

  const validationSchema = useMemo(() => Yup.object().shape({
    taxablesubjectGeneralInformation: generalDetailsValidationSchema,
    ...(generalDetails.fiscalPartnerGeneralInformation && { fiscalPartnerGeneralInformation: generalDetailsValidationSchema }),
  }), [generalDetails.fiscalPartnerGeneralInformation]);

  // To rerun validation
  const validateRef = useRef(null);
  useEffect(() => {
    const handleValidateForm = () => {
      setTimeout(() => validateRef.current(), 0);
    };
    validateRef?.current && handleValidateForm();
  }, [generalDetails]);

  const handleAutoSave = useAsyncCallback(async (data) => {
    await saveDossierDetails(
      {
        ...dossierData[PERSONAL_DETAILS],
        generalDetails: data,
      },
      PERSONAL_DETAILS,
      false,
    );
    await saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep(dossierData),
      [PERSONAL_DETAILS]: {
        ...dossierData[PERSONAL_DETAILS],
        generalDetails: data,
      },
    });
  }, [dossierData], { displayLoader: false });

  const handleDueDateChange = (currentValue, setValues, values) => {
    setValues({
      ...values,
      taxablesubjectGeneralInformation: {
        ...values.taxablesubjectGeneralInformation,
        dueDate: currentValue,
      },
      fiscalPartnerGeneralInformation: {
        ...values.fiscalPartnerGeneralInformation,
        dueDate: currentValue,
      },
    });
  };

  return (
    <GeneralDetailsWrapper className={className} data-ta="general-details-container">
      <StickyContainer
        customStyles={{
          ...STICKY_CUSTOM_STYLES,
          borderBottom: `1px solid ${theme.inputBorder}`,
        }}
        stickyContent={(
          <div className="flex-1">
            <TaxForecastHeading
              heading={translate('general-information')}
              location={location}
            />
          </div>
        )}
      >
        <Form
          initialValues={generalDetails}
          onSubmit={emptyFunction}
          dataTa="general-information-form"
          validateFormSchema={validationSchema}
          validateOnMount
        >
          {
            ({
              values, isSubmitting, validateForm, setValues,
            }) => {
              validateRef.current = validateForm;

              return (
                <>
                  <GeneralInformation
                    heading={translate('taxable-subject')}
                    fieldNamePrefix="taxablesubjectGeneralInformation"
                    dataTa="taxable-subject-general-info-section"
                    values={values.taxablesubjectGeneralInformation}
                    handleDueDateChange={(currentValue) => generalDetails?.fiscalPartnerGeneralInformation && handleDueDateChange(currentValue, setValues, values)}
                    taxableYear={taxableYear}
                  />
                  { generalDetails?.fiscalPartnerGeneralInformation && (
                    <GeneralInformation
                      heading={translate('fiscal-partner')}
                      fieldNamePrefix="fiscalPartnerGeneralInformation"
                      isPartner
                      dataTa="fiscal-partner-general-info-section"
                      values={values.fiscalPartnerGeneralInformation}
                    />
                  )}
                  <AutoSave
                    enable={!isSubmitting && !isEqualObjects(values, generalDetails)}
                    values={values}
                    onSave={handleAutoSave}
                  />
                </>
              );
            }}
        </Form>
      </StickyContainer>
    </GeneralDetailsWrapper>
  );
};

GeneralDetails.propTypes = {
  className: PropTypes.string,
};

export default withTheme(GeneralDetails);

const GeneralDetailsWrapper = styled.div`
  .general-info-heading {
    border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
    font-weight: 500;
  }
  `;

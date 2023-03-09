import React, {
  useEffect, useState, useContext, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import * as Yup from 'yup';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';
import { Form, Button, Typography } from '@visionplanner/ui-react-material';
import {
  StickyContainer, AutoSave, useAsyncCallback, useDataSource, useModal,
} from '@visionplanner/vp-ui-fiscal-library';
import { personalDetailsTranslate as translate } from './personal-details-translate';
import PersonalInfo from './personal-info';
import ChildrenInfo from './children-info.jsx';
import TaxForecastHeading from '../tax-forecast-heading';
import TaxForecastContext from '../tax-forecast-context';
import * as requests from './personal-details-request';
import {
  MARITAL_STATUS_VALUES, REGISTRATION_ON_ADDRESS_VALUES, TAX_FORM_TYPE_VALUES, PERSONAL_DETAILS_OBJECT_KEYS, REPRESENTATIVE_INITIAL_DATA,
} from './personal-details.constants';
import {
  PERSONAL_DETAILS, MASTER_DATA, BELONGS_TO_VALUES, STICKY_CUSTOM_STYLES,
} from '../tax-forecast.constants';
import {
  personalDetailsValidationSchema,
  situationChangedValidationSchema,
  getChildrenValidationSchema,
  getRepresentativeValidationSchema,
} from './personal-details-validation-schema';
import StatusChangedInfo from './status-changed-info';
import * as taxDossierMonitorRequests from '../../create-dossier/create-dossier.request';
import { emptyFunction, formatMasterData, cleanDeep } from '../../../common/utils';
import { isEqualObjects, updateAllocationData } from '../income-from-business/common/utils';
import { saveDeclaration } from '../tax-forecast-request';
import RepresentativeDetails from './representative-details';

const defaultRelationShipSituation = {
  patnerDeathDate: null,
  divorceDate: null,
  periodOfLivingTogether: {
    startDate: null,
    endDate: null,
  },
  isFiscalPartnerCriteriaMet: null,
  marriageDate: null,
  applyFiscalPartnerForWholeYear: null,
};

/**
  * Tax Forecast - Personal Form - Display information taxable subject,
  * fiscal partner and children information and etc.
  * We can add/edit the existing data
  */

const PersonalDetails = ({ className, theme, location }) => {
  const [relationshipStatusOptions, setRelationshipStatusOptions] = useState({ maritalStatusOptions: [], situationOptions: [], loading: true });
  const [fiscalPartnerError, setFiscalPartnerError] = useState(null);
  const {
    dossierData,
    dossierData: {
      personalDetails,
      dossierManifest: { dossierId, taxableYear, declarationTypeId },
      masterData: {
        childRegisteredOnAddressOptions,
        parentCollectingChildCareOptions,
      },
    },
    saveDossierDetails,
    globalClientId,
    globalAdviserId,
    removePartnerData,
    countries,
  } = useContext(TaxForecastContext);
  const [taxForms] = useDataSource(taxDossierMonitorRequests.getTaxFormTypes);
  const taxFormsForLiveAndDeceasedPerson = useRef(null);
  const { showModal } = useModal();
  if (taxForms) {
    taxFormsForLiveAndDeceasedPerson.current = {
      taxFormForDeceasedPerson: formatMasterData(taxForms).filter((item) => item.value === TAX_FORM_TYPE_VALUES.F_FORM),
      taxFormsForLivePerson: formatMasterData(taxForms).filter((item) => item.value !== TAX_FORM_TYPE_VALUES.F_FORM),
    };
  }

  const personalInformation = useMemo(() => ({
    ...personalDetails,
    taxableSubjectDetails: ({
      ...personalDetails.taxableSubjectDetails,
      maritalStatus: personalDetails.taxableSubjectDetails.maritalStatus
      || (personalDetails?.fiscalPartner?.taxableSubjectId ? MARITAL_STATUS_VALUES.MARRIED_REGISTERED_PARTNERSHIP_FOR_WHOLE_YEAR : MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR),
    }),
    ...(personalDetails?.fiscalPartner && {
      fiscalPartner: {
        ...personalDetails.fiscalPartner,
        maritalStatus: personalDetails.fiscalPartner?.maritalStatus || (personalDetails?.fiscalPartner?.taxableSubjectId && MARITAL_STATUS_VALUES.MARRIED_REGISTERED_PARTNERSHIP_FOR_WHOLE_YEAR),
      },
    }),
    representative: (personalDetails?.taxableSubjectDetails?.deathDate || personalDetails?.fiscalPartner?.deathDate)
      ?
        (!personalDetails.representative
          ? { ...REPRESENTATIVE_INITIAL_DATA }
          : {
            person: {
              ...REPRESENTATIVE_INITIAL_DATA.person, ...cleanDeep(personalDetails.representative.person),
            },
            address: {
              ...REPRESENTATIVE_INITIAL_DATA.address, ...cleanDeep(personalDetails.representative.address),
            },
          }
        )
      : null,
    relationShipSituation: (personalDetails.relationShipSituation || defaultRelationShipSituation),
  }), [personalDetails]);

  const validationSchema = useMemo(() => Yup.object().shape({
    taxableSubjectDetails: personalDetailsValidationSchema(taxableYear),
    fiscalPartner: personalDetailsValidationSchema(taxableYear),
    relationShipSituation: situationChangedValidationSchema(taxableYear),
    children: getChildrenValidationSchema(personalDetails.taxableSubjectDetails.bsn, personalDetails?.fiscalPartner?.bsn),
    representative: getRepresentativeValidationSchema(personalDetails.taxableSubjectDetails.bsn, personalDetails?.fiscalPartner?.bsn, personalDetails.children),
  }), [personalDetails, taxableYear]);

  // To rerun validation
  const validateRef = useRef(null);
  useEffect(() => {
    const handleValidateForm = () => {
      setTimeout(() => validateRef.current(), 0);
    };
    validateRef?.current && handleValidateForm();
  }, [personalDetails, relationshipStatusOptions.loading]);

  const updateChildrenDataAndFetchSelectOptions = useAsyncCallback(async () => {
    await saveDossierDetails(
      {
        ...personalInformation,
        children: personalInformation.children ? [...personalInformation.children.filter((child) => !!Object.keys(cleanDeep(child)).length)] : [],
      },
      PERSONAL_DETAILS,
      false,
    );
    const [maritalStatuses, livingTogetherSituations] = await Promise.all([
      requests.getMaritalStatuses(),
      requests.getLivingTogetherSituations(),
    ]);
    setRelationshipStatusOptions((prevState) => ({
      ...prevState,
      maritalStatusOptions: formatMasterData(maritalStatuses.content),
      situationOptions: formatMasterData(livingTogetherSituations.content),
      loading: false,
    }));
  }, [], { displayLoader: false });
  useEffect(() => {
    updateChildrenDataAndFetchSelectOptions();
  }, [updateChildrenDataAndFetchSelectOptions]);

  const handleAutoSave = useAsyncCallback(async (data) => {
    await saveDossierDetails(
      {
        ...data,
        fiscalPartner: data?.fiscalPartner?.taxableSubjectId && data?.fiscalPartner?.bsn ? { ...data.fiscalPartner } : null,
      },
      PERSONAL_DETAILS,
      false,
    );
    await saveDeclaration(globalClientId, dossierId, {
      ...cleanDeep(updateAllocationData(dossierData, data.isJointDeclaration)),
      [PERSONAL_DETAILS]: {
        ...data,
        fiscalPartner: data?.fiscalPartner?.taxableSubjectId && data?.fiscalPartner?.bsn ? { ...data.fiscalPartner } : null,
        children: data.children ? [...data.children.filter((child) => !!Object.keys(cleanDeep(child)).length)] : [],
      },
    });
  }, [dossierData], { displayLoader: false });

  const maritalStatusChangeHandler = (currentValue, values, setValues) => {
    if (currentValue === MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR && values?.fiscalPartner?.taxableSubjectId && values?.fiscalPartner?.bsn) {
      setValues(values);
      handleRemoveFiscalPartner(getUpdatedPersonalDetailsOnMaritalStatusChange(currentValue, values));
    } else {
      setValues(getUpdatedPersonalDetailsOnMaritalStatusChange(currentValue, values));
    }
  };

  const getUpdatedPersonalDetailsOnMaritalStatusChange = (currentValue, values) => ({
    ...values,
    taxableSubjectDetails: {
      ...values.taxableSubjectDetails,
      maritalStatus: currentValue,
      livingTogetherPreciseSituation: currentValue === MARITAL_STATUS_VALUES.LIVING_TOGETHER_FOR_WHOLE_YEAR ? values.taxableSubjectDetails.livingTogetherPreciseSituation : null,
    },
    ...(values.fiscalPartner
      ? {
        fiscalPartner: (currentValue === MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR) ? null : {
          ...values.fiscalPartner,
          maritalStatus: currentValue,
          livingTogetherPreciseSituation: currentValue === MARITAL_STATUS_VALUES.LIVING_TOGETHER_FOR_WHOLE_YEAR ? values.fiscalPartner.livingTogetherPreciseSituation : null,
        },
        relationShipSituation: currentValue !== MARITAL_STATUS_VALUES.SITUATION_CHANGED_DURING_YEAR ? { ...defaultRelationShipSituation } : values.relationShipSituation,
      } : {}
    ),
  });

  const livingTogetherStatusChangeHandler = (currentValue, values, setValues) => {
    setValues({
      ...values,
      taxableSubjectDetails: {
        ...values.taxableSubjectDetails,
        livingTogetherPreciseSituation: currentValue,
      },
      ...(values.fiscalPartner ? {
        fiscalPartner: {
          ...values.fiscalPartner,
          livingTogetherPreciseSituation: currentValue,
        },
      } : {}),
    });
  };

  const dateOfDeathChangeHandler = (currentValue, isPartner, values, setValues) => {
    const user = isPartner ? PERSONAL_DETAILS_OBJECT_KEYS.fiscalPartner : PERSONAL_DETAILS_OBJECT_KEYS.taxableSubject;
    const subjectOrPartner = !isPartner ? PERSONAL_DETAILS_OBJECT_KEYS.fiscalPartner : PERSONAL_DETAILS_OBJECT_KEYS.taxableSubject; // returns parnter if changed value for subject and vice versa.
    const updatedMaritalStausValue = (!!currentValue ? { maritalStatus: MARITAL_STATUS_VALUES.SITUATION_CHANGED_DURING_YEAR } : {});
    setValues({
      ...values,
      [user]: {
        ...values[user],
        deathDate: currentValue,
        taxationFormID: (currentValue === '' ? TAX_FORM_TYPE_VALUES.P_FORM : TAX_FORM_TYPE_VALUES.F_FORM),
        ...updatedMaritalStausValue,
      },
      ...(values[subjectOrPartner] && {
        [subjectOrPartner]: {
          ...values[subjectOrPartner],
          ...updatedMaritalStausValue,
        },
      }),
      ...((!currentValue && !(isPartner ? values.taxableSubjectDetails?.deathDate : values.fiscalPartner?.deathDate)) && {
        representative: { ...REPRESENTATIVE_INITIAL_DATA },
      }),
    });
  };

  const handleChildrenValues = (value, index, key, values, setValues) => {
    const isExPartner = (key === 'registrationOnAddress')
      ? (value === REGISTRATION_ON_ADDRESS_VALUES.EX_PARTNER)
      : values.children[index].registrationOnAddress === REGISTRATION_ON_ADDRESS_VALUES.EX_PARTNER;
    const children = values?.children?.map((child, mapIndex) => {
      if (mapIndex === index) {
        return {
          ...child,
          isCoParenting: isExPartner && child.isCoParenting,
          isAtleastThreeDaysPerWeekLiving: isExPartner && child.isCoParenting && child.isAtleastThreeDaysPerWeekLiving,
          isSignificantSupportExtended: isExPartner && child.isSignificantSupportExtended,
          [key]: value,
        };
      }
      return child;
    });
    setValues(Object.assign(values, { children }));
  };

  const setFiscalPartnerDetails = (fiscalPartnerDetails, values, setValues) => {
    const fiscalPartnerFullName = `${fiscalPartnerDetails.firstName} ${fiscalPartnerDetails.middleName ? `${fiscalPartnerDetails.middleName} ` : ''}${fiscalPartnerDetails.lastName}`;
    setValues({
      ...values,
      isJointDeclaration: false,
      fiscalPartner: {
        deathDate: null,
        livingTogetherPreciseSituation: values.taxableSubjectDetails.livingTogetherPreciseSituation,
        maritalStatus: values.taxableSubjectDetails.maritalStatus,
        taxationFormID: TAX_FORM_TYPE_VALUES.P_FORM,
        taxFormType: values.taxableSubjectDetails.taxFormType,
        age: fiscalPartnerDetails.dateOfBirth
          && taxableYear >= moment(fiscalPartnerDetails.dateOfBirth).year()
          ? moment([taxableYear]).diff(moment(fiscalPartnerDetails.dateOfBirth, 'YYYY-MM-DD'), 'years', false)
          : 0,
        birthDate: fiscalPartnerDetails.dateOfBirth,
        bsn: fiscalPartnerDetails.bsnNumber,
        firstName: fiscalPartnerDetails.firstName,
        initials: fiscalPartnerDetails.title,
        lastName: fiscalPartnerDetails.lastName,
        middleName: fiscalPartnerDetails.middleName,
        fullName: fiscalPartnerFullName,
        taxableSubjectId: fiscalPartnerDetails.globalClientId,
      },
      generalDetails: {
        ...values.generalDetails,
        fiscalPartnerGeneralInformation: {
          name: fiscalPartnerFullName,
          emailId: fiscalPartnerDetails.emailId,
        },
      },
    });
    saveDossierDetails(
      {
        ...cloneDeep(dossierData[MASTER_DATA]),
        owners: (fiscalPartnerFullName
          ? [...dossierData[MASTER_DATA].owners, { displayName: fiscalPartnerFullName, value: BELONGS_TO_VALUES.FISCAL_PARTNER }, { displayName: 'Both', value: BELONGS_TO_VALUES.BOTH }]
          : cloneDeep(dossierData[MASTER_DATA].owners)),
        parentCollectingChildCareOptions: [
          ...dossierData[MASTER_DATA].parentCollectingChildCareOptions,
          { displayName: fiscalPartnerFullName, value: BELONGS_TO_VALUES.FISCAL_PARTNER },
          { displayName: translate('others'), value: BELONGS_TO_VALUES.BOTH },
        ],
      },
      MASTER_DATA,
      false,
    );
  };

  const addNewFiscalPartner = (values, setValues) => {
    setValues({
      ...values,
      fiscalPartner: {
        taxationFormID: TAX_FORM_TYPE_VALUES.P_FORM,
      },
    });
  };
  const handleRemoveFiscalPartner = (values) => {
    showModal('delete-confirmation-modal', {
      onConfirm: () => removePartnerData({
        ...values,
        fiscalPartner: null,
        isJointDeclaration: false,
        children: values?.children?.map((child) => ({
          ...child,
          parentCollectingChildCare: null,
        })),
        generalDetails: {
          ...values.generalDetails,
          fiscalPartnerGeneralInformation: null,
        },
      }),
      dataTa: 'remove-fiscal-partner-modal',
      modalTitle: translate('confirmation-title'),
      confirmButtonText: translate('confirmation-yes'),
      cancelButtonText: translate('confirmation-no'),
      children: translate('confirmation-question'),
    });
  };

  const showPersonalInfo = relationshipStatusOptions.maritalStatusOptions.length > 0 && relationshipStatusOptions.situationOptions.length > 0;

  return (
    (!relationshipStatusOptions.loading) && (
      <Form
        initialValues={personalInformation}
        onSubmit={emptyFunction}
        dataTa="personal-details-form"
        validateFormSchema={validationSchema}
        validateOnMount
      >
        {
          ({
            values, setValues, isSubmitting, validateForm,
          }) => {
            validateRef.current = validateForm;
            return (
              <PersonalDetailsWrapper className={className} data-ta="personal-details-container">
                <StickyContainer
                  customStyles={{
                    ...STICKY_CUSTOM_STYLES,
                    borderBottom: `1px solid ${theme.inputBorder}`,
                  }}
                  stickyContent={(
                    <div className="flex-1">
                      <TaxForecastHeading
                        heading={translate('personal-information')}
                        location={location}
                      />
                    </div>
                  )}
                >
                  <PersonalInfo
                    mainClass="taxable-subject-info"
                    situationOptions={relationshipStatusOptions.situationOptions}
                    maritalStatusOptions={relationshipStatusOptions.maritalStatusOptions}
                    heading={translate('taxable-subject')}
                    fieldNamePrefix="taxableSubjectDetails"
                    values={values.taxableSubjectDetails}
                    taxableYear={taxableYear}
                    isPartner={false}
                    maritalStatusChangeHandler={(currentValue) => maritalStatusChangeHandler(currentValue, values, setValues)}
                    livingTogetherStatusChangeHandler={(currentValue) => livingTogetherStatusChangeHandler(currentValue, values, setValues)}
                    taxFormsForLiveAndDeceasedPerson={taxFormsForLiveAndDeceasedPerson}
                    dateOfDeathChangeHandler={(currentValue) => dateOfDeathChangeHandler(currentValue, false, values, setValues)}
                    dataTa="taxable-subject-details-section"
                    disableMaritalStatusInput={!!(values?.taxableSubjectDetails?.deathDate || values?.fiscalPartner?.deathDate)}
                  />
                  {
                    (values.taxableSubjectDetails.maritalStatus === MARITAL_STATUS_VALUES.SITUATION_CHANGED_DURING_YEAR)
                    && <StatusChangedInfo values={values.relationShipSituation} fieldNamePrefix="relationShipSituation" />
                  }
                  {values.fiscalPartner && showPersonalInfo && (
                    <PersonalInfo
                      mainClass="taxable-subject-info"
                      situationOptions={relationshipStatusOptions.situationOptions}
                      maritalStatusOptions={relationshipStatusOptions.maritalStatusOptions}
                      heading={translate('fiscaal-partner')}
                      fieldNamePrefix="fiscalPartner"
                      values={values.fiscalPartner}
                      taxableYear={taxableYear}
                      isPartner
                      taxFormsForLiveAndDeceasedPerson={taxFormsForLiveAndDeceasedPerson}
                      dateOfDeathChangeHandler={(currentValue) => dateOfDeathChangeHandler(currentValue, true, values, setValues)}
                      taxableSubjectId={values.taxableSubjectDetails.taxableSubjectId}
                      setFiscalPartnerDetails={(fiscalPartnerData) => setFiscalPartnerDetails(fiscalPartnerData, values, setValues)}
                      dataTa="fiscal-partner-details-section"
                      globalAdviserId={globalAdviserId}
                      handleRemoveFiscalPartner={() => handleRemoveFiscalPartner(values)}
                      declarationTypeId={declarationTypeId}
                      fiscalPartnerError={fiscalPartnerError}
                      setFiscalPartnerError={setFiscalPartnerError}
                      fiscalPartnerId={personalDetails.fiscalPartner?.taxableSubjectId}
                    />
                  )}
                  { !values.fiscalPartner && !!values?.taxableSubjectDetails?.maritalStatus && values?.taxableSubjectDetails?.maritalStatus !== MARITAL_STATUS_VALUES.SINGLE_FOR_WHOLE_YEAR && (
                    <Typography use="h5">
                      {`${translate('fiscaal-partner')} `}
                      <Button buttonType="tertiary" dataTa="add-new-fiscal-partner" onClick={() => addNewFiscalPartner(values, setValues)}>{`+${translate('add')}`}</Button>
                    </Typography>
                  )}
                  {(values?.taxableSubjectDetails?.deathDate || values?.fiscalPartner?.deathDate) && (
                    <RepresentativeDetails
                      dataTa="representative-details"
                      fieldNamePrefix="representative"
                      values={values.representative}
                      countries={countries}
                    />
                  )}
                  <ChildrenInfo
                    values={values.children || []}
                    fieldNamePrefix="children"
                    childrenRegisteredAddresssesOptions={childRegisteredOnAddressOptions}
                    parentCollectingChildCareOptions={parentCollectingChildCareOptions}
                    taxableYear={taxableYear}
                    handleChildrenValues={(value, index, key) => handleChildrenValues(value, index, key, values, setValues)}
                  />
                  <AutoSave
                    enable={!isSubmitting && !isEqualObjects(values, personalInformation) && !fiscalPartnerError}
                    values={values}
                    onSave={handleAutoSave}
                  />
                </StickyContainer>
              </PersonalDetailsWrapper>
            );
          }
        }
      </Form>
    )
  );
};

PersonalDetails.propTypes = {
  className: PropTypes.string,
};

export default withTheme(PersonalDetails);

const PersonalDetailsWrapper = styled.div`
  .personal-info-heading {
    border-bottom: 1px solid ${({ theme }) => theme.inputBorder};
    font-weight: 500;
  }

  .children-container {
    padding-top: ${({ theme }) => theme.paddings.medium};
  }

  .fiscal-partner__remove {
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.fs14};
  }

  .error-fiscal-partner {
    color: ${({ theme }) => theme.error};
    font-size: ${({ theme }) => theme.fontSizes.fs12};
  }

  .children-table {
    .common-data-table {
      &__head-cell {
        padding: ${({ theme }) => theme.paddings.medium};

        &.col-living,
        &.col-support {
          p {
            max-width: 150px;
          }
        }
      }

      &__row:hover {
        background: none;
      }

      &__body .common-data-table__cell {
        text-align: center;
        vertical-align: top;
        padding: ${({ theme }) => theme.paddings.medium} ${({ theme }) => theme.paddings.medium} ${({ theme }) => theme.paddings.small};

        .select-wrapper {
          text-align: left;
        }

        .checkbox-wrapper {
          line-height: 2.5;
        }
      }

      &.rmwc-data-table--sticky-rows-1 .common-data-table__head .common-data-table__row:nth-child(-n + 1) .common-data-table__cell {
        border: none;
        box-shadow: 0 0 0 1px ${({ theme }) => theme.secondaryBorder};
      }
    }
  }
`;

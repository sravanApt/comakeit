import React, {
  useEffect, useState, useMemo, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import * as Yup from 'yup';
import {
  Form, ColumnLayout, Column, ColumnInner, ModalBody, ModalFooter, Button, Icon,
} from '@visionplanner/ui-react-material';
import { BusyIndicator, useDebounce, useAsyncCallback } from '@visionplanner/vp-ui-fiscal-library';
import {
  InputWrapper, ModalWrapper, SelectWrapper, DateInputWrapper,
} from '../../../common/styled-wrapper';
import { incomeFromBusinessTranslate as translate } from './income-from-business-translate';
import {
  endDateofYear,
  startDateofYear,
  formatMasterData,
  isDateWithInRange,
  getHundredYearsBackDateObjectWithYearAndMonth,
  getDateObjectWithYearAndMonth,
  getEndDateObjectWithYearAndMonth,
} from '../../../common/utils';
import * as requests from './income-from-business.request';
import {
  BUSINESS_DETAILS,
  PROPRIETORSHIP_VALUE,
  PARTNERSHIP_VALUE,
  VOF_VALUE,
  REG_EXP_RSIN,
} from '../tax-forecast.constants';
import { containsGlobalAdministrationId } from './common/utils';
import { INPUT_CHANGE, MENU_CLOSE } from '../../create-dossier/create-dossier-constants';
import { YYYY_MM_DD_FORMAT } from '../../../common/constants';

const currentYear = moment().format('YYYY');
const selectProps = {
  placeholder: translate('select'),
  type: 'selectOne',
  controlType: 'autocomplete',
  hideSelectedOptions: false,
  menuPortalTarget: true,
};

const dateProps = {
  placeholder: translate('date'),
  type: 'date',
  showSelectOptions: true,
  minDate: getHundredYearsBackDateObjectWithYearAndMonth(),
  maxDate: getDateObjectWithYearAndMonth(),
  withPortal: true,
};

/**
 * Create Administration Modal - Component that can be used to add administration.
 *
 */
const AdministrationModal = ({
  isEditMode, onCloseModal, contextData, administrationId, dataTa, className,
}) => {
  const [businessFormAndPartners, setBusinessFormTypesAndPartners] = useState({
    formTypes: [],
    businessPartners: [],
  });
  const [loading, setLoading] = useState(false);
  const [administrationSuggestions, setAdministrationSuggestions] = useState(null);
  const {
    dossierData, countries, saveDossierDetails, isPartner, globalAdviserId,
    fetchVPCFinancialData, declarationID, taxableYear,
    declarationTypeId, taxableSubjectId,
  } = contextData;
  const administrationDataRef = useRef(null);
  const subjectOrPartnerKey = isPartner ? 'fiscalPartnerBusinessDetails' : 'taxableSubjectBusinessDetails';

  const validationSchema = useMemo(() => Yup.object().shape({
    globalAdministrationId: Yup.string().test('administration-id-test', translate('administration-error'), (value) => (value && !isEditMode ? checkIsAdministrationExist(value) : true)).nullable(),
    businessName: Yup.string().required(translate('required-field')),
    businessActivities: Yup.string().required(translate('required-field')).nullable(),
    businessFormId: Yup.string()
      .required(translate('required-field'))
      .test('business-form-test', translate('invalid-entry'), (value) => Number(value) === PROPRIETORSHIP_VALUE || Number(value) === PARTNERSHIP_VALUE || Number(value) === VOF_VALUE).nullable(),
    countryId: Yup.string().required(translate('required-field')),
    fiscalYearStartDate: Yup.string().required(translate('required-field')).nullable(),
    fiscalYearEndDate: Yup.string().required(translate('required-field')).test('date-test', translate('invalid-entry'), function (value) {
      const { fiscalYearStartDate } = this.parent;
      if (!fiscalYearStartDate && value) {
        return false;
      }
      return !(value && (moment(fiscalYearStartDate).format('DD-MM-YYYY') >= (moment(value).format('DD-MM-YYYY'))));
    }).nullable(),
    businessEndDate: Yup.string().test('date-test', translate('invalid-entry'), function (value) {
      const { businessStartDate } = this.parent;
      if (!businessStartDate && value) {
        return false;
      }
      return value ? (new Date(value)).getTime() > (new Date(businessStartDate)).getTime() : true;
    }).nullable(),
    rsin: Yup.string().when('businessFormId', {
      is: (businessFormId) => +businessFormId === PARTNERSHIP_VALUE || +businessFormId === VOF_VALUE,
      then: Yup.string().matches(REG_EXP_RSIN, translate('invalid-entry')).required(translate('required-field')),
      otherwise: Yup.string().matches(REG_EXP_RSIN, translate('invalid-entry')),
    }).nullable(),
    businessPartnerId: Yup.number().when(['businessFormId', 'globalAdministrationId', 'fromVPC'], {
      is: (businessFormId, globalAdministrationId, fromVPC) => (+businessFormId === PARTNERSHIP_VALUE || +businessFormId === VOF_VALUE) && !!globalAdministrationId && !!fromVPC,
      then: Yup.number().required(translate('required-field')),
    }).nullable(),
  }), [checkIsAdministrationExist, isEditMode]);

  const administrationDetailsObject = useMemo(() => {
    if (isEditMode) {
      return dossierData.businessDetails[subjectOrPartnerKey].find((bussiness) => bussiness.globalAdministrationId === administrationId);
    }
    return {
      globalAdministrationId: '',
      businessName: '',
      businessActivities: '',
      businessFormId: '',
      businessPartnerId: null,
      fiscalYearStartDate: startDateofYear(taxableYear, 'YYYY-MM-DD'),
      fiscalYearEndDate: endDateofYear(taxableYear, 'YYYY-MM-DD'),
      countryId: '',
      businessStartDate: null,
      businessEndDate: null,
      rsin: '',
      dossierId: dossierData.dossierManifest.dossierId,
      fromVPC: false,
    };
  }, [isEditMode, taxableYear, dossierData.dossierManifest.dossierId, dossierData.businessDetails, subjectOrPartnerKey, administrationId]);

  const fetchBusinessFormTypesAndPartners = useAsyncCallback(async () => {
    const [formTypes, businessPartners] = await Promise.all([
      requests.getBusinessFormTypes(),
      requests.getBusinessPartners(),
    ]);
    setBusinessFormTypesAndPartners({
      formTypes: formatMasterData(formTypes.content),
      businessPartners: formatMasterData(businessPartners.content),
    });
  }, [], { displayLoader: false });

  useEffect(() => {
    fetchBusinessFormTypesAndPartners();
  }, [fetchBusinessFormTypesAndPartners]);

  useEffect(() => {
    if (isEditMode && administrationDetailsObject.fromVPC) {
      setAdministrationSuggestions([{ value: administrationDetailsObject.globalAdministrationId, label: administrationDetailsObject.vpBusinessName }]);
    }
  }, [administrationDetailsObject.fromVPC, administrationDetailsObject.globalAdministrationId, administrationDetailsObject.vpBusinessName, isEditMode]);

  const saveAdministrationFormDetails = useAsyncCallback(async (props) => {
    const administrationDetails = { ...props };
    try {
      setLoading(true);
      let globalBusinessId = props.globalAdministrationId;
      if (!isEditMode) {
        if (isPartner) {
          administrationDetails.isFiscalPartner = isPartner;
        } else {
          administrationDetails.taxableSubjectId = dossierData.personalDetails.taxableSubjectDetails.taxableSubjectId;
        }
        const { content } = await requests.saveAdministrationDetails(administrationDetails);
        globalBusinessId = content;
      }
      const countryName = countries?.filter((obj) => obj.value === props.countryId)[0]?.label;
      const businessFormName = businessFormAndPartners.formTypes.filter((obj) => obj.value === props.businessFormId)[0].label;
      let businessData = [...(dossierData.businessDetails[subjectOrPartnerKey] || [])];
      const updatedBusinessDetails = {
        ...props, countryName, businessFormName, vpBusinessName: props.vpBusinessName, globalAdministrationId: globalBusinessId,
      };
      let isBusinessFormModified = false;
      if (isEditMode) {
        const businessIndex = businessData.findIndex((obj) => obj.globalAdministrationId === globalBusinessId);
        const businessForm = businessData.filter((business) => business.globalAdministrationId === globalBusinessId)[0]?.businessFormId;
        isBusinessFormModified = updatedBusinessDetails.businessFormId !== businessForm && (businessForm === PARTNERSHIP_VALUE || businessForm === VOF_VALUE);
        const businessPartnerName = businessFormAndPartners.businessPartners?.find((partner) => partner.value === props.businessPartnerId)?.label;
        businessData[businessIndex] = { ...updatedBusinessDetails, businessPartnerName };
        if (!!administrationDetails.businessPartnerId && (administrationDetails.businessPartnerId !== administrationDetailsObject.businessPartnerId)) {
          fetchVPCFinancialData({
            TaxableSubjectID: taxableSubjectId,
            globalAdministrationId: updatedBusinessDetails.globalAdministrationId,
            dataSource: updatedBusinessDetails.dataSourceId,
            declarationId: declarationID,
            declarationTypeId,
            taxableYear,
          }, isPartner, { ...dossierData.businessDetails, [subjectOrPartnerKey]: businessData });
        } else {
          saveDossierDetails({ ...dossierData.businessDetails, [subjectOrPartnerKey]: businessData }, BUSINESS_DETAILS, true, false, isBusinessFormModified, globalBusinessId);
        }
      } else {
        businessData = [...businessData, updatedBusinessDetails];
        saveDossierDetails({ ...dossierData.businessDetails, [subjectOrPartnerKey]: businessData }, BUSINESS_DETAILS, false, false, isBusinessFormModified, globalBusinessId);
      }
    } finally {
      setLoading(false);
    }

    onCloseModal();
  },
  [
    businessFormAndPartners, countries, dossierData.businessDetails, dossierData.personalDetails.taxableSubjectDetails.taxableSubjectId,
    isEditMode, isPartner, onCloseModal, saveDossierDetails, subjectOrPartnerKey],
  { displayLoader: false });

  const getVpcAdministrationSuggestions = (vpcAdministrations) => vpcAdministrations && vpcAdministrations.map((administration) => ({
    label: administration.name,
    value: administration.globalAdministrationId,
  }));

  const fetchVpcAdministrations = useAsyncCallback((adviserId, searchBy) => requests.getVpcAdministrations(adviserId, searchBy), []);

  const { handleChange } = useDebounce(null, async (searchBy, action, adviserId) => {
    if (action === INPUT_CHANGE) {
      const vpcAdministrations = searchBy && await fetchVpcAdministrations(adviserId, searchBy);
      setAdministrationSuggestions(getVpcAdministrationSuggestions(vpcAdministrations));
    }
    if (action === MENU_CLOSE) {
      if (!administrationDataRef.current) {
        setAdministrationSuggestions([]);
      } else {
        setAdministrationSuggestions(administrationSuggestions.filter((option) => option.value === administrationDataRef.current));
      }
    }
  });

  const checkIsAdministrationExist = useCallback((value) => {
    const { taxableSubjectBusinessDetails, fiscalPartnerBusinessDetails } = dossierData.businessDetails;
    const subjectorPartnerBusinessDetails = isPartner ? fiscalPartnerBusinessDetails : taxableSubjectBusinessDetails;
    return subjectorPartnerBusinessDetails ? !containsGlobalAdministrationId(subjectorPartnerBusinessDetails, value) : true;
  }, [dossierData.businessDetails, isPartner]);

  const onAdministrationSelect = useAsyncCallback(async (value, values, setValues, setFieldTouched) => {
    administrationDataRef.current = value;
    setFieldTouched('globalAdministrationId', true);
    if (value && checkIsAdministrationExist(value)) {
      const vpcAdministrationDetails = await requests.getVpcAdministrationDetails(value);
      setValues({
        ...values,
        globalAdministrationId: value,
        vpBusinessName: vpcAdministrationDetails.name,
        businessName: vpcAdministrationDetails.name,
        businessActivities: vpcAdministrationDetails.businessActivities,
        businessFormId: vpcAdministrationDetails.legalFormId,
        rsin: vpcAdministrationDetails.rsinNumber,
        fromVPC: true,
      });
    } else {
      setValues({
        ...values,
        globalAdministrationId: value,
        vpBusinessName: '',
        businessName: '',
        businessActivities: '',
        businessFormId: '',
        rsin: '',
        fromVPC: false,
      });
    }
  }, [checkIsAdministrationExist], { displayLoader: false });

  const onBussinessFormIdChange = (value, setValues, values) => {
    const isBusinessPartnerRequired = value === PARTNERSHIP_VALUE || value === VOF_VALUE;
    setValues({
      ...values,
      businessFormId: value,
      businessPartnerId: isBusinessPartnerRequired ? values.businessPartnerId : '',
      businessPartnerName: isBusinessPartnerRequired ? values.businessPartnerName : '',
    });
  };

  const startDateRange = endDateofYear(taxableYear - 1, YYYY_MM_DD_FORMAT);
  const endDateRange = endDateofYear(taxableYear, YYYY_MM_DD_FORMAT);

  return (
    <AdministrationModalWrapper
      open
      title={translate('add-new-administration')}
      onClose={onCloseModal}
      dataTa={dataTa}
      className={className}
      preventDismissalOnOutsideClick
    >
      {loading && <BusyIndicator size="xlarge" className="administration-loader" />}
      <Form
        initialValues={administrationDetailsObject}
        onSubmit={saveAdministrationFormDetails}
        dataTa="create-administration-form"
        validateFormSchema={validationSchema}
      >
        {
          ({
            isValid, isSubmitting, setValues, values, setFieldTouched, isDirty, validateField,
          }) => (
            <>
              <ModalBody>
                <ColumnLayout>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {translate('administration')}
                  </Column>
                  <Column span={6}>
                    <SelectWrapper
                      {...selectProps}
                      name="globalAdministrationId"
                      options={administrationSuggestions || []}
                      className="search-vpc-administration-list"
                      customChangeHandler={(value) => {
                        setFieldTouched('businessFormId', true);
                        validateField('businessFormId');
                        onAdministrationSelect(value, values, setValues, setFieldTouched);
                      }}
                      onSelectInputChange={(data, action) => handleChange(data, action, globalAdviserId)}
                      placeholder={<Icon iconSet="far" name="search" className="search-fiscal-partner" />}
                      clearable
                      disabled={isEditMode}
                    />
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('name')} *`}
                  </Column>
                  <Column span={6}>
                    <InputWrapper
                      className="text-input"
                      type="text"
                      name="businessName"
                      dataTa="business-name-input"
                    />
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('business-activities')} *`}
                  </Column>
                  <Column span={6}>
                    <InputWrapper
                      className="text-input"
                      type="text"
                      name="businessActivities"
                      dataTa="business-activity-input"
                    />
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('legal-form')} *`}
                  </Column>
                  <Column span={6}>
                    <SelectWrapper
                      {...selectProps}
                      className="business-form--select"
                      name="businessFormId"
                      options={businessFormAndPartners.formTypes}
                      customChangeHandler={(value) => onBussinessFormIdChange(value, setValues, values)}
                    />
                  </Column>
                  {((values.businessFormId === PARTNERSHIP_VALUE || values.businessFormId === VOF_VALUE) && !!values.globalAdministrationId && !!values.fromVPC) && (
                    <>
                      <Column span={4} className="grid-cell__label grid-cell__label--right">
                        {`${translate('Partnership-label')} *`}
                      </Column>
                      <Column span={8}>
                        <ColumnInner>
                          <Column span={5}>
                            <SelectWrapper
                              {...selectProps}
                              className="business-partner--select"
                              name="businessPartnerId"
                              options={businessFormAndPartners.businessPartners}
                            />
                          </Column>
                        </ColumnInner>
                      </Column>
                    </>
                  )}
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('fiscal-year-start-date')} *`}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <DateInputWrapper
                          {...dateProps}
                          className="text-input fiscal-year-start-date"
                          dataTa="fiscal-year-start-date"
                          name="fiscalYearStartDate"
                          displayFormat="DD-MM"
                          isOutsideRange={isDateWithInRange(startDateRange, endDateRange)}
                          isDateReadOnly
                          showClearDate
                          minDate={getDateObjectWithYearAndMonth(startDateRange)}
                          maxDate={getEndDateObjectWithYearAndMonth(endDateRange)}
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('fiscal-year-end-date')} *`}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <DateInputWrapper
                          {...dateProps}
                          className="text-input fiscal-year-end-date"
                          name="fiscalYearEndDate"
                          dataTa="fiscal-year-end-date"
                          displayFormat="DD-MM"
                          isOutsideRange={isDateWithInRange(values.fiscalYearStartDate, endDateRange)}
                          isDateReadOnly
                          showClearDate
                          minDate={getDateObjectWithYearAndMonth(values.fiscalYearStartDate)}
                          maxDate={getEndDateObjectWithYearAndMonth(endDateRange)}
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('country')} *`}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <SelectWrapper
                          {...selectProps}
                          className="country-code--select"
                          name="countryId"
                          options={countries}
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {translate('start-date-of-business')}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <DateInputWrapper
                          {...dateProps}
                          className="text-input business-start-date"
                          name="businessStartDate"
                          isOutsideRange={isDateWithInRange(startDateRange, endDateRange)}
                          isDateReadOnly
                          showClearDate
                          minDate={getDateObjectWithYearAndMonth(startDateRange)}
                          maxDate={getEndDateObjectWithYearAndMonth(endDateRange)}
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {translate('end-date-of-business')}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <DateInputWrapper
                          {...dateProps}
                          className="text-input business-end-date"
                          name="businessEndDate"
                          isOutsideRange={isDateWithInRange(values.businessStartDate, endDateRange)}
                          isDateReadOnly
                          showClearDate
                          minDate={getDateObjectWithYearAndMonth(values.businessStartDate)}
                          maxDate={getEndDateObjectWithYearAndMonth(endDateRange)}
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} className="grid-cell__label grid-cell__label--right">
                    {`${translate('RSIN')}${(values.businessFormId === PARTNERSHIP_VALUE || values.businessFormId === VOF_VALUE) ? ' *' : ''}`}
                  </Column>
                  <Column span={8}>
                    <ColumnInner>
                      <Column span={5}>
                        <InputWrapper
                          className="text-input"
                          type="text"
                          name="rsin"
                          dataTa="rsin-input"
                        />
                      </Column>
                    </ColumnInner>
                  </Column>
                  <Column span={4} />
                </ColumnLayout>
              </ModalBody>
              <ModalFooter>
                <Button type="reset" className="mar-r-md" buttonType="secondary" onClick={onCloseModal}>
                  {translate('cancel')}
                </Button>
                <Button type="submit" disabled={!isDirty || !isValid || isSubmitting} dataTa="save-administration-button">
                  {translate('add')}
                </Button>
              </ModalFooter>
            </>
          )
        }
      </Form>
    </AdministrationModalWrapper>
  );
};

AdministrationModal.propTypes = {
  /** prop to identify modal opened in add/edit mode. */
  isEditMode: PropTypes.bool,
  /** Function which handles close event of the modal. */
  onCloseModal: PropTypes.func.isRequired,
  /** object which contains dossier context data */
  contextData: PropTypes.object.isRequired,
  /** administration Id */
  administrationId: PropTypes.string,
  /** test attribute for component */
  dataTa: PropTypes.string.isRequired,
};

export default AdministrationModal;

const AdministrationModalWrapper = styled(ModalWrapper)`
  .mdc-dialog__container {
    width: 700px;
  }

  .country-code--select {
    & .react-select__menu-list {
      max-height: 200px;
    }
  }
`;

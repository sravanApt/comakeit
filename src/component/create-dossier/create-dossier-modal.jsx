import React, {
  useState, useCallback, useMemo, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as Yup from 'yup';
import deepFreeze from 'deep-freeze';
import {
  Form,
  ColumnLayout,
  Column,
  Icon,
  NotificationBar,
  ModalBody,
  ModalFooter,
  Typography,
} from '@visionplanner/ui-react-material';
import {
  useDebounce,
  useAsyncCallback,
  useDataSource,
  BusyIndicator,
} from '@visionplanner/vp-ui-fiscal-library';
import {
  InputWrapper,
  ModalWrapper,
  SelectWrapper,
  DateInputWrapper,
} from '../../common/styled-wrapper';
import { createDossierTranslate as translate } from './create-dossier-translate';
import * as requests from './create-dossier.request';
import { getTaxableSubjects } from '../../common/global-requests';
import {
  NEW_DOSSIER_OBJECT,
  INPUT_CHANGE,
  CREATE_DOSSIER_DROPDOWN_OPTIONS,
  CURRENT_YEAR,
  P_FORM_VALUE,
  F_FORM_VALUE,
  NOTIFICATION_TIMEOUT,
  MENU_CLOSE,
  PROGNOSE_VALUE,
} from './create-dossier-constants';
import FilterButtons from '../../common/monitor-filter-buttons/monitor-filter-buttons';
import {
  getCurrentYear, isFutureDate, getSuggestions, formatMasterData, getDateObjectWithYearAndMonth,
} from '../../common/utils';

const selectProps = deepFreeze({
  placeholder: translate('select-label'),
  type: 'selectOne',
  controlType: 'autocomplete',
  hideSelectedOptions: false,
  menuPortalTarget: true,
});

const CreateDossierModalWrapper = styled(ModalWrapper)`
  .mdc-layout-grid {
    padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large};
  }

  .tax-form-select {
    .react-select {
      &__placeholder {
        .search-taxablesubject {
          color: ${({ theme }) => theme.colors.mirage};
          font-size: ${({ theme }) => theme.fontSizes.fs14};
        }
      }
    }
  }

  .mdc-joint-declaration {
    margin-left: -${({ theme }) => theme.margins.base};
  }
`;

/**
 * Dossier Monitor Modal - Component that can be used to create an empty dossier.
 */
const CreateDossierModal = ({
  onCloseModal,
  className,
  globalAdviserId,
  taxableSubjectData,
  handleOnDossierSave,
}) => {
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(null);
  const [dossierOptions, setDossierOptions] = useState(CREATE_DOSSIER_DROPDOWN_OPTIONS);
  const [dossierList, setDossierList] = useState(null);
  const subjectDataRef = useRef(null);
  const handleTaxableSubjectSelect = (value) => {
    subjectDataRef.current = value;
  };
  const { handleChange: handleFiscalPartnerChange } = useDebounce(null, async (searchBy, action, setFieldValue, taxableSubjectID) => {
    if (action === INPUT_CHANGE) {
      setFieldValue('fiscalPartnerId', '');
      const taxableSubjects = await getTaxableSubjects(globalAdviserId, searchBy);
      const contentWithoutTaxableSubject = taxableSubjects.filter((item) => item.id !== taxableSubjectID);
      setDossierOptions((prevState) => ({
        ...prevState,
        suggestionsForFiscalPartner: contentWithoutTaxableSubject,
      }));
    } else if (action === MENU_CLOSE) {
      if (!subjectDataRef.current) {
        setDossierOptions((prevState) => ({
          ...prevState,
          suggestionsForFiscalPartner: [],
        }));
      } else {
        setDossierOptions((prevState) => ({
          ...prevState,
          suggestionsForFiscalPartner: fiscalPartnerSuggestions.filter((option) => option.value === subjectDataRef.current),
        }));
      }
    }
  });

  const handleCreateDossier = async (data, { setSubmitting }) => {
    setShowError(null);
    try {
      setLoading(true);
      const globalDossierId = await requests.createNewDossier(taxableSubjectData.globalClientId, data);
      onCloseModal();
      handleOnDossierSave(globalDossierId);
    } catch (error) {
      setShowError(error);
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  const fetchTaxationYears = useAsyncCallback(() => requests.getTaxationYears({ taxableYear: getCurrentYear() }),
    [], { displayLoader: false });
  const fetchTaxFormTypes = useAsyncCallback(() => requests.getTaxFormTypes().then(
    (taxationForms) => taxationForms.filter((taxForm) => (taxForm.value === P_FORM_VALUE || taxForm.value === F_FORM_VALUE)),
  ), [], { displayLoader: false });
  const [taxationYears] = useDataSource(fetchTaxationYears);
  const [taxForms] = useDataSource(fetchTaxFormTypes);

  const onTaxableYearChange = useAsyncCallback(async (value, setValues, values) => {
    setValues({
      ...values,
      taxationYearID: value,
      declarationTypeID: '',
      copyGlobalDossierID: '',
      isJointDeclaration: false,
      taxationFormID: '',
      fiscalPartnerId: '',
    });
    const dossierTypes = await requests.getDossierTypes({ taxableYear: taxationYears.find((obj) => obj.value === value).displayName });
    setDossierOptions({ ...dossierOptions, dossierTypes });
  }, [taxationYears, dossierOptions]);

  const onDossierTypeChange = useAsyncCallback(async (value, year, setValues, values) => {
    setValues({
      ...values,
      declarationTypeID: value,
      copyGlobalDossierID: '',
      isJointDeclaration: false,
      taxationFormID: '',
      fiscalPartnerId: '',
    });
    const dossiers = await requests.getDossierList(
      taxableSubjectData.globalClientId,
      {
        globalAdviserId,
        taxationYear: year,
      },
    );
    setDossierList(dossiers);
  }, [globalAdviserId]);
  const onDossierSelect = useAsyncCallback(async (value, setValues, values) => {
    const dossierDetails = await requests.getSelectedDossierInfo(
      taxableSubjectData.globalClientId,
      {
        globalAdviserId,
        globalDossierId: value,
      },
    );
    setDossierOptions({
      ...dossierOptions,
      suggestionsForFiscalPartner: [{
        name: dossierDetails.fiscalPartnerName,
        id: dossierDetails.fiscalPartnerGlobalClientId,
      }],
    });
    setValues({
      ...values,
      copyGlobalDossierID: dossierDetails.globalDossierId,
      isJointDeclaration: dossierDetails.isJointDossier,
      taxationFormID: dossierDetails.taxationFormId,
      fiscalPartnerId: dossierDetails.fiscalPartnerGlobalClientId,
    });
  }, [globalAdviserId, dossierOptions]);
  const fiscalPartnerSuggestions = useMemo(() => getSuggestions(dossierOptions.suggestionsForFiscalPartner), [dossierOptions.suggestionsForFiscalPartner]);

  const onTaxFormChange = useCallback((value, setFieldValue, setFieldTouched) => {
    // make touched true for dateOfDeath, only when FORM-TYPE is F_FORM
    if (value === F_FORM_VALUE) setFieldTouched('dateOfDeath', true);
    else {
      setFieldValue('dateOfDeath', null);
      setFieldTouched('dateOfDeath', false);
    }
  }, []);

  const validationSchema = useMemo(() => Yup.object().shape({
    taxationYearID: Yup.string().required(translate('required-field')),
    declarationTypeID: Yup.string().required(translate('required-field')),
    taxationFormID: Yup.string().required(translate('required-field')),
    dateOfDeath: Yup.string()
      .test('death-date-null', translate('required-field'), function (value) {
        const { taxationFormID } = this.parent;
        return (taxationFormID === String(F_FORM_VALUE) ? !!value : true);
      })
      .test('death-date-test', translate('invalid-entry'), function (value) {
        const { taxationFormID } = this.parent;
        return (taxationFormID === String(F_FORM_VALUE)
          ? (!!value
          && ((new Date(value)).getTime() > (new Date(taxableSubjectData.dateOfBirth)).getTime())
          && (new Date(value).getFullYear() <= CURRENT_YEAR))
          : true);
      }).nullable(),
    fiscalPartnerId: Yup.string().when('isJointDeclaration', {
      is: true,
      then: Yup.string().required(translate('required-field')),
    }).nullable(),
  }), [taxableSubjectData.dateOfBirth]);

  return (
    <CreateDossierModalWrapper
      open
      title={translate('create-dossier')}
      onClose={onCloseModal}
      className={className}
      preventDismissalOnOutsideClick
    >
      {loading && <BusyIndicator size="xlarge" className="create-dossier-loader" />}
      <Form
        initialValues={{
          ...NEW_DOSSIER_OBJECT,
          globalAdviserId,
        }}
        onSubmit={handleCreateDossier}
        dataTa="create-tax-dossier-form"
        validateFormSchema={validationSchema}
      >
        {
          ({
            values, setFieldValue, isValid, isSubmitting, setFieldTouched, isDirty, setValues,
          }) => (
            <>
              <ModalBody>
                <ColumnLayout>
                  <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('taxable-subject-label')}</Column>
                  <Column span={7} className="grid-cell__label">
                    <Typography use="normal-text">
                      {`${taxableSubjectData.firstName} ${taxableSubjectData.middleName} ${taxableSubjectData.lastName}`}
                    </Typography>
                  </Column>
                  <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('year')}</Column>
                  <Column span={7}>
                    <SelectWrapper
                      {...selectProps}
                      name="taxationYearID"
                      options={formatMasterData(taxationYears) || []}
                      customChangeHandler={(value) => onTaxableYearChange(value, setValues, values)}
                      className="tax-form-select period-options"
                    />
                  </Column>
                  <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('dossier-type')}</Column>
                  <Column span={7}>
                    <SelectWrapper
                      {...selectProps}
                      name="declarationTypeID"
                      options={formatMasterData(dossierOptions.dossierTypes)}
                      className="tax-form-select dossier-type-options"
                      customChangeHandler={(value) => onDossierTypeChange(value, values.taxationYearID, setValues, values)}
                    />
                  </Column>
                  {!!values.declarationTypeID && (values.declarationTypeID !== PROGNOSE_VALUE) && !!dossierList?.length && (
                    <>
                      <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('copy-dossier-form')}</Column>
                      <Column span={7}>
                        <SelectWrapper
                          {...selectProps}
                          name="copyGlobalDossierID"
                          options={formatMasterData(dossierList)}
                          customChangeHandler={(value) => onDossierSelect(value, setValues, values)}
                          className="copy-dossier-list-select"
                        />
                      </Column>
                    </>
                  )}
                  <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('tax-form')}</Column>
                  <Column span={7}>
                    <SelectWrapper
                      {...selectProps}
                      name="taxationFormID"
                      disabled={!!values.copyGlobalDossierID}
                      options={formatMasterData(taxForms)}
                      customChangeHandler={(value) => onTaxFormChange(value, setFieldValue, setFieldTouched)}
                      className="tax-form-select tax-form-options"
                    />
                  </Column>
                  {values.taxationFormID === F_FORM_VALUE
                      && (
                        <>
                          <Column span={5} className="grid-cell__label grid-cell__label--right">{translate('date-of-death')}</Column>
                          <Column span={7}>
                            <DateInputWrapper
                              className="taxable-subject-death-date"
                              type="date"
                              name="dateOfDeath"
                              isOutsideRange={isFutureDate}
                              showSelectOptions
                              withPortal
                              placeholder={translate('date')}
                              isDateReadOnly
                              showClearDate
                              minDate={getDateObjectWithYearAndMonth(taxableSubjectData.dateOfBirth)}
                              maxDate={getDateObjectWithYearAndMonth()}
                            />
                          </Column>
                        </>
                      )}
                  <Column span={5} className="grid-cell__label grid-cell__label--right">
                    {translate('fiscal-partner')}
                  </Column>
                  <Column span={7}>
                    <SelectWrapper
                      {...selectProps}
                      name="fiscalPartnerId"
                      disabled={!!values.copyGlobalDossierID}
                      options={fiscalPartnerSuggestions}
                      customChangeHandler={(value) => handleTaxableSubjectSelect(value)}
                      onSelectInputChange={(data, action) => handleFiscalPartnerChange(data, action, setFieldValue, taxableSubjectData.globalClientId, values)}
                      className="tax-form-select search-fiscal-partner-list"
                      placeholder={<Icon iconSet="far" name="search" className="search-taxablesubject" />}
                      clearable
                    />
                  </Column>
                  <Column span={5} className="grid-cell__label grid-cell__label--right">
                    {translate('joint-declaration')}
                  </Column>
                  <Column span={7}>
                    <InputWrapper
                      disabled={!!values.copyGlobalDossierID}
                      type="boolean"
                      name="isJointDeclaration"
                      dataTa="joint-declaration-test"
                      controlType="checkbox"
                      className="mdc-joint-declaration"
                    />
                  </Column>
                </ColumnLayout>
              </ModalBody>
              <ModalFooter>
                <FilterButtons
                  clearButton={{
                    dataTa: 'create-dossier-cancel',
                    handleClear: onCloseModal,
                    label: translate('cancel'),
                  }}
                  applyButton={{
                    dataTa: 'create-dossier-save',
                    label: translate('create-button'),
                    disabled: (!isValid || isSubmitting || !isDirty),
                  }}
                />
              </ModalFooter>
            </>
          )
        }
      </Form>
      {showError
        && (
          <NotificationBar
            isNotificationOpen
            timeout={NOTIFICATION_TIMEOUT}
            textDisplayed={showError.toString()}
            dataTa="create-dossier-notification-bar"
            iconType="danger"
          />
        )
      }
    </CreateDossierModalWrapper>
  );
};

CreateDossierModal.propTypes = {
  /** Function which handles close event of the modal. */
  onCloseModal: PropTypes.func,
  /** Id of the global adviser */
  globalAdviserId: PropTypes.string.isRequired,
  /** taxable subject details */
  taxableSubjectData: PropTypes.object.isRequired,
};

export default CreateDossierModal;

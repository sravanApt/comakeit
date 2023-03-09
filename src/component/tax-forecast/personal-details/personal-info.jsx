import React, {
  useMemo, useState, useEffect, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  ColumnLayout, ColumnInner, Column, Icon, Typography,
} from '@visionplanner/ui-react-material';
import {
  useDebounce,
} from '@visionplanner/vp-ui-fiscal-library';
import {
  dateToDayMonthAndYearString,
  startDateofYear,
  getSuggestions,
  isDateWithInRange,
  getDateObjectWithYearAndMonth,
  getYear,
  endDateofYear,
  getCurrentDate,
} from '../../../common/utils';
import { personalDetailsTranslate as translate } from './personal-details-translate';
import { SelectWrapper, DateInputWrapper, InputWrapper } from '../../../common/styled-wrapper';
import { MARITAL_STATUS_VALUES } from './personal-details.constants';
import { getTaxableSubjects } from '../../../common/global-requests';
import { getFiscalPartnerDetails } from './personal-details-request';
import { INPUT_CHANGE, MENU_CLOSE } from '../../create-dossier/create-dossier-constants';
import { YYYY_MM_DD_FORMAT } from '../../../common/constants';

const selectProps = {
  className: 'select-wrapper',
  type: 'selectOne',
  controlType: 'autocomplete',
  width: '295px',
  placeholder: translate('select'),
  hideSelectedOptions: false,
};

/**
  * Tax Forecast - Personal Form - Display Personal Information
  *
  */

const PersonalInfo = ({
  mainClass,
  situationOptions,
  maritalStatusOptions,
  heading,
  values,
  taxableYear,
  isPartner,
  fieldNamePrefix,
  maritalStatusChangeHandler,
  livingTogetherStatusChangeHandler,
  taxFormsForLiveAndDeceasedPerson,
  dateOfDeathChangeHandler,
  taxableSubjectId,
  setFiscalPartnerDetails,
  dataTa,
  globalAdviserId,
  handleRemoveFiscalPartner,
  declarationTypeId,
  fiscalPartnerError,
  setFiscalPartnerError,
  fiscalPartnerId,
  disableMaritalStatusInput,
}) => {
  const {
    firstName, middleName, lastName, bsn, birthDate, deathDate, maritalStatus, livingTogetherPreciseSituation, age,
  } = values;
  const isSubjectLivingTogetherAnYear = !isPartner && maritalStatus === MARITAL_STATUS_VALUES.LIVING_TOGETHER_FOR_WHOLE_YEAR;
  const isPartnerLivingTogetherAnYear = isPartner && (maritalStatus === MARITAL_STATUS_VALUES.LIVING_TOGETHER_FOR_WHOLE_YEAR && livingTogetherPreciseSituation);
  const selectedMaritalStatus = useMemo(() => (isPartner ? maritalStatusOptions.find(({ value }) => value === maritalStatus)?.label : null), [isPartner, maritalStatus, maritalStatusOptions]);
  const selectedLivingTogetherSituation = useMemo(
    () => (isPartnerLivingTogetherAnYear
      ? situationOptions.find(({ value }) => value === livingTogetherPreciseSituation)?.label
      : null), [isPartnerLivingTogetherAnYear, livingTogetherPreciseSituation, situationOptions],
  );
  const partnerDataRef = useRef(null);

  const [fiscalPartnerSuggestions, setFiscalPartnerSuggestions] = useState([]);
  useEffect(() => {
    if (isPartner) {
      partnerDataRef.current = values.taxableSubjectId;
      values?.taxableSubjectId && (!!firstName && setFiscalPartnerSuggestions([{ value: values.taxableSubjectId, label: `${firstName} ${middleName ? `${middleName} ` : ''}${lastName}` }]));
    }
  }, [isPartner]);

  const { handleChange } = useDebounce(null, async (searchBy, action, adviserId) => {
    if (action === INPUT_CHANGE) {
      const fiscalPartners = await getTaxableSubjects(adviserId, searchBy);
      setFiscalPartnerSuggestions(getSuggestions(fiscalPartners.filter((item) => item.id !== taxableSubjectId)));
    } else if (action === MENU_CLOSE) {
      if (!partnerDataRef.current) {
        setFiscalPartnerSuggestions([]);
      } else {
        const filteredFiscalPartnerSuggestions = fiscalPartnerSuggestions.filter((option) => option.value === partnerDataRef.current);
        setFiscalPartnerSuggestions(filteredFiscalPartnerSuggestions);
        !filteredFiscalPartnerSuggestions.length && setFiscalPartnerError(null);
      }
    }
  });

  const onFiscalPartnerSelect = useCallback(async (value) => {
    partnerDataRef.current = value;
    setFiscalPartnerError(null);
    if (fiscalPartnerId !== value) {
      try {
        const fiscalPartnerDetails = await getFiscalPartnerDetails({
          fiscalPartnerClientId: value,
          taxationYear: taxableYear,
          declarationTypeId,
        });
        setFiscalPartnerDetails(fiscalPartnerDetails);
      } catch (error) {
        setFiscalPartnerError(error.message);
      }
    }
  }, [declarationTypeId, setFiscalPartnerDetails, setFiscalPartnerError, taxableYear, fiscalPartnerId]);

  const startDateRangeForDeathDate = useMemo(() => ((getYear(birthDate) == taxableYear) ? birthDate : endDateofYear(taxableYear - 1, YYYY_MM_DD_FORMAT)), [birthDate, taxableYear]);
  const endDateRangeForDeathDate = useMemo(() => ((getYear() == taxableYear) ? getCurrentDate(YYYY_MM_DD_FORMAT) : endDateofYear(taxableYear, YYYY_MM_DD_FORMAT)), [taxableYear]);

  return (
    <div className={mainClass} data-ta={dataTa}>
      <Typography use="h5" className="flex personal-info-heading pad-ver-xs mar-t-md">
        {heading}
        {isPartner && values?.taxableSubjectId && !fiscalPartnerError && <span data-ta="remove-fiscal-partner" className="fiscal-partner__remove pad-l-sm" role="presentation" onClick={handleRemoveFiscalPartner}>{`${translate('remove')}`}</span>}
      </Typography>
      <ColumnLayout>
        <Column span={3} className="text-align-right">{translate('full-name')}</Column>
        <Column span={9}>
          <ColumnInner>
            <Column span={6}>
              {!isPartner
                ? `${firstName} ${middleName ? `${middleName} ` : ''}${lastName}`
                : (
                  <SelectWrapper
                    {...selectProps}
                    name={`${fieldNamePrefix}.taxableSubjectId`}
                    options={fiscalPartnerSuggestions}
                    className="search-fiscal-partner-list"
                    customChangeHandler={onFiscalPartnerSelect}
                    onSelectInputChange={(data, action) => handleChange(data, action, globalAdviserId)}
                    placeholder={<Icon iconSet="far" name="search" className="search-fiscal-partner" />}
                  />
                )
              }
            </Column>
          </ColumnInner>
        </Column>
        {fiscalPartnerError && isPartner && (
          <>
            <Column span={3} />
            <Column span={9}>
              <span data-ta="error-fiscal-partner" className="error-fiscal-partner">
                {fiscalPartnerError}
              </span>
            </Column>
          </>
        )}
        <Column span={3} className="text-align-right">{translate('bsn')}</Column>
        <Column span={9}>{bsn}</Column>
        <Column span={3} className="text-align-right">{translate('date-of-birth')}</Column>
        <Column span={9}>{birthDate ? dateToDayMonthAndYearString(birthDate, 'DD-MM-YYYY') : ''}</Column>
        <Column span={3} className="text-align-right">{`${translate('age-on')} ${startDateofYear(taxableYear)}`}</Column>
        <Column span={9}>{age}</Column>
        <Column span={3} className="text-align-right">{translate('date-of-death')}</Column>
        <Column span={9}>
          <ColumnInner>
            <Column span={3}>
              <DateInputWrapper
                width="130px"
                className={`date-of-death ${isPartner ? 'partner-death-date' : ''}`}
                type="date"
                name={`${fieldNamePrefix}.deathDate`}
                isOutsideRange={isDateWithInRange(startDateRangeForDeathDate, endDateRangeForDeathDate)}
                showSelectOptions
                customChangeHandler={dateOfDeathChangeHandler}
                placeholder={translate('date')}
                isDateReadOnly
                showClearDate
                disabled={isPartner && !values.taxableSubjectId}
                minDate={getDateObjectWithYearAndMonth(startDateRangeForDeathDate)}
                maxDate={getDateObjectWithYearAndMonth(endDateRangeForDeathDate)}
              />
            </Column>
          </ColumnInner>
        </Column>
        <Column span={3} className="text-align-right">{translate('tax-form')}</Column>
        <Column span={9}>
          <ColumnInner>
            <Column span={6}>
              {taxFormsForLiveAndDeceasedPerson.current && (
                <SelectWrapper
                  {...selectProps}
                  name={`${fieldNamePrefix}.taxationFormID`}
                  options={deathDate
                    ? taxFormsForLiveAndDeceasedPerson.current.taxFormForDeceasedPerson
                    : taxFormsForLiveAndDeceasedPerson.current.taxFormsForLivePerson}
                  className="taxation-form-select"
                  width="130px"
                  disabled
                />
              )}
            </Column>
          </ColumnInner>
        </Column>
        <Column span={3} className="text-align-right">{`${translate('marital-status-in')} ${taxableYear}`}</Column>
        <Column span={9}>
          <ColumnInner>
            <Column span={6}>
              {!isPartner ? (
                <SelectWrapper
                  {...selectProps}
                  name={`${fieldNamePrefix}.maritalStatus`}
                  options={maritalStatusOptions}
                  className="marital-status-select"
                  customChangeHandler={maritalStatusChangeHandler}
                  disabled={disableMaritalStatusInput}
                />
              ) : (!!firstName && selectedMaritalStatus)}
            </Column>
          </ColumnInner>
        </Column>
        {!!isSubjectLivingTogetherAnYear && (
          <>
            <Column span={3} className="live-in-together-year text-align-right">{translate('situation-when-living-together')}</Column>
            <Column span={9}>
              <ColumnInner>
                <Column span={6}>
                  <SelectWrapper
                    {...selectProps}
                    name={`${fieldNamePrefix}.livingTogetherPreciseSituation`}
                    options={situationOptions}
                    className="situation-status-select"
                    customChangeHandler={livingTogetherStatusChangeHandler}
                  />
                </Column>
              </ColumnInner>
            </Column>
          </>
        )}
        {!!isPartnerLivingTogetherAnYear && (
          <>
            <Column span={3} className="live-in-together-year text-align-right">{translate('situation-when-living-together')}</Column>
            <Column span={9}>
              { selectedLivingTogetherSituation }
            </Column>
          </>
        )}
        {isPartner && (
          <>
            <Column span={3} className="text-align-right">
              {translate('joint-declaration')}
            </Column>
            <Column span={9}>
              <InputWrapper
                type="boolean"
                name="isJointDeclaration"
                dataTa="joint-declaration"
                controlType="checkbox"
                className="mdc-joint-declaration"
                disabled={!values.taxableSubjectId}
              />
            </Column>
          </>
        )}
      </ColumnLayout>
    </div>
  );
};

PersonalInfo.propTypes = {
  /** Class for main section of personal info  */
  mainClass: PropTypes.string,
  /** Array of situation change options */
  situationOptions: PropTypes.PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Array of marital status options */
  maritalStatusOptions: PropTypes.PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
      ]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  /** Heading of personal info  */
  heading: PropTypes.string.isRequired,
  /** Provide personal details  */
  values: PropTypes.object.isRequired,
  /** Taxation year */
  taxableYear: PropTypes.number.isRequired,
  /** Checks whether partner or not  */
  isPartner: PropTypes.bool.isRequired,
  /** Provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** Custom handler on change of marital status */
  maritalStatusChangeHandler: PropTypes.func,
  /** Custom handler on change of living together status */
  livingTogetherStatusChangeHandler: PropTypes.func,
  /** Provides tax form option(s) for deceased person  */
  taxFormForDeceasedPerson: PropTypes.array,
  /** Provides tax form options for living person  */
  taxFormsForLivePerson: PropTypes.array,
  /** Provides custom handle on change of death date */
  dateOfDeathChangeHandler: PropTypes.func.isRequired,
  /** id of the taxable subject */
  taxableSubjectId: PropTypes.string,
  /** callback function to set the fiscal partner details */
  setFiscalPartnerDetails: PropTypes.func,
  /** test attribute to identify the element */
  dataTa: PropTypes.string,
  /** callback function to handle remove fiscal partner */
  handleRemoveFiscalPartner: PropTypes.func,
  /** declaration type Id */
  declarationTypeId: PropTypes.number,
  /** prop which holds the error if fiscal partner has another another open dossier */
  fiscalPartnerError: PropTypes.string,
  /** callback function to set the error if fiscal partner has another another open dossier */
  setFiscalPartnerError: PropTypes.func,
  /** prop which holds fiscal partner Id */
  fiscalPartnerId: PropTypes.string,
  /** prop to disable marital status select input */
  disableMaritalStatusInput: PropTypes.bool
};

export default PersonalInfo;

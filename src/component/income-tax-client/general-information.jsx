import React, { useContext } from 'react';
import {
  Typography, ColumnLayout, Column, Form,
} from '@visionplanner/ui-react-material';
import {
  useAsyncCallback,
} from '@visionplanner/vp-ui-fiscal-library';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import { DateInputWrapper, InputWrapper, ButtonWrapper } from '../../common/styled-wrapper';
import { GENDER_OPTIONS, GENERAL_INFO_VALIDATION } from './income-tax-client-constants';
import {
  isOutsideRange, getDateObjectWithYearAndMonth, getHundredYearsBackDateObjectWithYearAndMonth,
} from '../../common/utils';
import TaxableSubjectContext from './taxable-subject-context';
import { updateTaxableSubject } from './general-information.request';

/**
 * Dossier General Information - Component that can be used to display information of tax dossier
 *
 */
const GeneralInformation = () => {
  const {
    taxableSubjectData,
    updateTaxableSubjectContext,
    globalAdviserId,
  } = useContext(TaxableSubjectContext);

  const handleSubmit = useAsyncCallback(async (values, { setSubmitting }) => {
    try {
      const content = await updateTaxableSubject(globalAdviserId, taxableSubjectData.globalClientId, values);
      if (content) {
        updateTaxableSubjectContext(values);
      }
    } finally {
      setSubmitting(false);
    }
  }, [updateTaxableSubjectContext]);

  return (
    <>
      <Typography use="h3" className="align-self-start">
        {translate('general-information')}
      </Typography>
      <Form
        initialValues={taxableSubjectData}
        onSubmit={handleSubmit}
        validateFormSchema={GENERAL_INFO_VALIDATION}
        dataTa="general-info-form"
        className="general-info-form"
      >
        {({ isValid, isSubmitting, isDirty }) => (
          <ColumnLayout>
            <Column span={2} className="grid-cell__label grid-cell__label--auto">{`${translate('gender')}*`}</Column>
            <Column span={9}>
              <InputWrapper
                type="selectOne"
                controlType="buttongroup"
                name="genderId"
                options={GENDER_OPTIONS}
                dataTa="gender"
                orientation="horizontal"
                className="gender-group"
              />
            </Column>
            <Column span={2} className="grid-cell__label">{`${translate('initials')}*`}</Column>
            <Column span={3}>
              <InputWrapper
                className="text-input"
                type="text"
                name="title"
                dataTa="initial-name-input"
              />
            </Column>
            <Column span={7} />
            <Column span={2} className="grid-cell__label">{`${translate('first-name')}*`}</Column>
            <Column span={3}>
              <InputWrapper
                className="text-input"
                type="text"
                name="firstName"
                dataTa="first-name-input"
              />
            </Column>
            <Column span={2} className="grid-cell__label">{translate('middle-name')}</Column>
            <Column span={3}>
              <InputWrapper
                className="text-input"
                type="text"
                name="middleName"
                dataTa="middle-name-input"
              />
            </Column>
            <Column span={2} />
            <Column span={2} className="grid-cell__label">{`${translate('last-name')}*`}</Column>
            <Column span={3}>
              <InputWrapper
                className="text-input"
                type="text"
                name="lastName"
                dataTa="last-name-input"
              />
            </Column>
            <Column span={7} />
            <Column span={2} className="grid-cell__label">{`${translate('date-of-birth')}*`}</Column>
            <Column span={3}>
              <DateInputWrapper
                placeholder={translate('date')}
                type="date"
                className="text-input date-of-birth"
                name="dateOfBirth"
                isOutsideRange={isOutsideRange}
                withPortal
                showSelectOptions
                isDateReadOnly
                showClearDate
                minDate={getHundredYearsBackDateObjectWithYearAndMonth()}
                maxDate={getDateObjectWithYearAndMonth()}
              />
            </Column>
            <Column span={2} className="grid-cell__label">{`${translate('bsn-number')}*`}</Column>
            <Column span={3}>
              <InputWrapper
                className="text-input"
                type="text"
                name="bsnNumber"
                dataTa="bsn-input"
              />
            </Column>
            <Column span={2} />
            <Column span={2} className="grid-cell__label">{`${translate('client-number')}`}</Column>
            <Column span={5}>
              <InputWrapper
                type="text"
                name="clientNumber"
                dataTa="clientNumber"
              />
            </Column>
            <Column span={5} />
            <Column span={2}>{translate('active')}</Column>
            <Column span={3}>
              <InputWrapper
                type="boolean"
                name="isActive"
                dataTa="active"
                controlType="switch"
                disabled
              />
            </Column>
            <Column span={7} />
            <Column span={12}>
              <ButtonWrapper
                type="submit"
                className="general-form-submit-button"
                dataTa="save-general-form"
                disabled={!isValid || !isDirty || isSubmitting}
              >
                {translate('save')}
              </ButtonWrapper>
            </Column>
          </ColumnLayout>
        )}
      </Form>
    </>
  );
};

export default GeneralInformation;

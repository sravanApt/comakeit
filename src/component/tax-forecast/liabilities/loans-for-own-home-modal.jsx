import React from 'react';
import {
  Form, ColumnLayout, Column, Button, Typography, ModalBody, ModalFooter,
} from '@visionplanner/ui-react-material';
import styled from 'styled-components';
import {
  SelectWrapper, DateInputWrapper, InputWrapper, TableCellWrapper,
} from '../../../common/styled-wrapper';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import {
  DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import {
  LOAN_GIVER_OPTIONS_VALUES, LOAN_GIVER_DETAILS_EMPTY_OBJECT,
  dateProps, inputProps, selectProps, loanGiverOptions, purposeOptions, paybackMethodOptions,
} from './liabilities.constants';
import CostsTable from '../assets/assets-modals/costs-table';
import { DESCRIPTION_INPUT_WIDTH, PERCENTAGE_INPUT_PROPS, REQUIRED_HEADING_WIDTH } from '../../../common/constants';
import { enableDatesTillCurrentYear, getYears } from '../../../common/utils';
import { getOwnHomeModalSchema } from './liabilities-validation-schema';
import { getDefaultOwner } from '../income-from-business/common/utils';
import { SubModalWrapper as ModalWrapper } from '../assets/assets-modals/dividend-modal';

/**
 * Modal to handle own home liabilities addition and updation.
 */
const LoansForOwnHomeModal = ({
  title, data, onCloseModal, countries, handleBusinessData, belongsToOptions, className, taxableYear, isOwnHomeSection, dataTa,
}) => {
  const onLoanGiverSelect = (selectedValue, formValues, setValues) => {
    setValues({
      ...formValues,
      loanDetails: {
        ...formValues.loanDetails,
        loanGiver: selectedValue,
      },
      loanGiverDetails: (selectedValue === LOAN_GIVER_OPTIONS_VALUES.NON_ADMINISTRATIVE_SUBJECT) ? { ...LOAN_GIVER_DETAILS_EMPTY_OBJECT } : null,
    });
  };
  return (
    <LoanForOwnHomeModalWrapper
      title={title}
      open
      onClose={onCloseModal}
      className={className}
      preventDismissalOnOutsideClick
    >
      <Form
        initialValues={data?.loanDetails?.belongsTo ? data : { ...data, loanDetails: { ...data.loanDetails, belongsTo: getDefaultOwner(belongsToOptions) } }}
        onSubmit={(formValues) => {
          handleBusinessData(formValues);
          onCloseModal();
        }}
        validateFormSchema={getOwnHomeModalSchema(isOwnHomeSection)}
        dataTa={`${dataTa}-form`}
      >
        {
          ({
            values, setValues, isDirty, isValid,
          }) => (
            <>
              <ModalBody>
                <ColumnLayout>
                  <Column span={12}>
                    <Typography use="h6" className="mirage-label">{translate('loan-box1')}</Typography>
                  </Column>
                  <Column span={12}>
                    <div className="flex liabilities-section__table">
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" width={DESCRIPTION_INPUT_WIDTH}>
                          {translate('description-label')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" width={selectProps.width}>
                          {translate('belongs-to')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" width={DESCRIPTION_INPUT_WIDTH}>
                          {translate('account-number')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" width={selectProps.width}>
                          {translate('country')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                    </div>
                    <div className="flex liabilities-section__table">
                      <div className="common-data-table__cell">
                        <DescriptionCell
                          name="loanDetails.description"
                          value={values.loanDetails.description}
                          dataTa="own-home-description"
                        />
                      </div>
                      <div className="common-data-table__cell">
                        <SelectWrapper
                          {...selectProps}
                          name="loanDetails.belongsTo"
                          options={belongsToOptions}
                          className="belongs-to-select"
                          placeholder={translate('select')}
                        />
                      </div>
                      <div className="common-data-table__cell">
                        <DescriptionCell
                          name="loanDetails.accountNumber"
                          value={values.loanDetails.accountNumber}
                          dataTa="own-home-account-number"
                        />
                      </div>
                      <div className="common-data-table__cell">
                        <SelectWrapper
                          {...selectProps}
                          name="loanDetails.countryId"
                          options={countries}
                          className="country-code-select"
                          placeholder={translate('select')}
                        />
                      </div>
                    </div>
                  </Column>
                  <Column span={12}>
                    <div className="flex liabilities-section__table">
                      {isOwnHomeSection && (
                        <div className="common-data-table__cell header">
                          <TableCellWrapper className="common-data-table__head-cell" width={selectProps.width}>
                            {translate('loan-giver')}
                            {' '}
                            *
                          </TableCellWrapper>
                        </div>
                      )}
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" width={DESCRIPTION_INPUT_WIDTH}>
                          {translate('purpose')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper width={REQUIRED_HEADING_WIDTH} className="common-data-table__head-cell" title={translate('percentage-used-for-own-home')}>
                          {translate('percentage-used-for-own-home')}
                        </TableCellWrapper>
                        <span>*</span>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell" title={translate('amount-31-12')}>
                          {translate('amount-31-12')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper className="common-data-table__head-cell">
                          {translate('interest')}
                          {' '}
                          *
                        </TableCellWrapper>
                      </div>
                      <div className="common-data-table__cell header">
                        <TableCellWrapper width={REQUIRED_HEADING_WIDTH} className="common-data-table__head-cell" title={translate('employee-discount')}>{translate('employee-discount')}</TableCellWrapper>
                        { !isOwnHomeSection && <span>*</span> }
                      </div>
                    </div>
                    <div className="flex liabilities-section__table">
                      {isOwnHomeSection && (
                        <div className="common-data-table__cell">
                          <SelectWrapper
                            {...selectProps}
                            name="loanDetails.loanGiver"
                            customChangeHandler={(selectedValue) => onLoanGiverSelect(selectedValue, values, setValues)}
                            options={loanGiverOptions}
                            className="loan-giver-select"
                            placeholder={translate('select')}
                          />
                        </div>
                      )}
                      <div className="common-data-table__cell">
                        <SelectWrapper
                          {...selectProps}
                          name="loanDetails.loanPurpose"
                          options={purposeOptions}
                          className="loan-purpose-select"
                          width={DESCRIPTION_INPUT_WIDTH}
                          placeholder={translate('select')}
                        />
                      </div>
                      <div className="common-data-table__cell">
                        <CurrencyCell
                          {...PERCENTAGE_INPUT_PROPS}
                          name="loanDetails.percentageOfAmount"
                          value={values.loanDetails.percentageOfAmount}
                          prefix="%"
                          dataTa="own-home-percentage-amount"
                        />
                      </div>
                      <div className="common-data-table__cell">
                        <CurrencyCell name="loanDetails.principalAmount" dataTa="principal-amount" />
                      </div>
                      <div className="common-data-table__cell">
                        <CurrencyCell name="loanDetails.interest" dataTa="interest" />
                      </div>
                      <div className="common-data-table__cell">
                        <CurrencyCell dataTa="employee-credit" name="loanDetails.employeeCredit" />
                      </div>
                    </div>
                  </Column>
                  <Column span={6} className="liabilities-section__table">
                    <Typography use="h6" className="mirage-label flex">{translate('cost')}</Typography>
                    <CostsTable
                      values={values.costs}
                      name="costs"
                      dataTa="liabilities-for-own-home-costs-table"
                    />
                  </Column>
                </ColumnLayout>

                { isOwnHomeSection && values.loanDetails.loanGiver === LOAN_GIVER_OPTIONS_VALUES.NON_ADMINISTRATIVE_SUBJECT
                && (
                  <>
                    <ColumnLayout>
                      <Column span={12}>
                        <Typography use="h6" className="mirage-label">{translate('loan-giver-details')}</Typography>
                      </Column>
                      <Column span={12}>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell" width="180px">
                              {translate('fiscal-number')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper
                              className="common-data-table__head-cell"
                            >
                              {translate('initials')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper
                              className="common-data-table__head-cell"
                            >
                              {translate('name-label')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper
                              width="96px"
                              className="common-data-table__head-cell"
                              title={translate('date-of-birth')}
                            >
                              {translate('date-of-birth')}
                            </TableCellWrapper>
                            <span>*</span>
                          </div>
                        </div>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.bsn"
                              value={values.loanGiverDetails.bsn}
                              dataTa="loan-giver-bsn"
                              width="180px"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.initials"
                              value={values.loanGiverDetails.initials}
                              dataTa="loan-giver-last-name"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.lastName"
                              value={values.loanGiverDetails.lastName}
                              dataTa="loan-giver-last-name"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <DateInputWrapper
                              {...dateProps}
                              name="loanGiverDetails.dateOfBirth"
                              value={values.loanGiverDetails.dateOfBirth}
                              isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
                              className="loan-giver-date-of-birth"
                            />
                          </div>
                        </div>
                      </Column>
                      <Column span={12}>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell">
                              {translate('start-date')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell">
                              {translate('end-date')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper width={REQUIRED_HEADING_WIDTH} className="common-data-table__head-cell" title={translate('original-principal-amount')}>
                              {translate('original-principal-amount')}
                            </TableCellWrapper>
                            <span>*</span>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper width={REQUIRED_HEADING_WIDTH} className="common-data-table__head-cell" title={translate('interest-rate-in-decimals')}>
                              {translate('interest-rate-in-decimals')}
                            </TableCellWrapper>
                            <span>*</span>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper width={REQUIRED_HEADING_WIDTH} className="common-data-table__head-cell" title={translate('method-of-repayment')}>
                              {translate('method-of-repayment')}
                            </TableCellWrapper>
                            <span>*</span>
                          </div>
                        </div>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell">
                            <DateInputWrapper
                              {...dateProps}
                              name="loanGiverDetails.startDate"
                              value={values.loanGiverDetails.startDate}
                              isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear)}
                              className="loan-giver-start-date"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <DateInputWrapper
                              {...dateProps}
                              name="loanGiverDetails.endDate"
                              value={values.loanGiverDetails.endDate}
                              isOutsideRange={(day) => enableDatesTillCurrentYear(day, taxableYear + 100)}
                              className="loan-giver-end-date"
                              years={getYears(taxableYear, 100)}
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <CurrencyCell
                              name="loanGiverDetails.originalPrincipalAmount"
                              value={values.loanGiverDetails.originalPrincipalAmount}
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <CurrencyCell
                              {...PERCENTAGE_INPUT_PROPS}
                              name="loanGiverDetails.interestRate"
                              value={values.loanGiverDetails.interestRate}
                              prefix="%"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <SelectWrapper
                              {...selectProps}
                              name="loanGiverDetails.payBackMethod"
                              options={paybackMethodOptions}
                              className="pay-method-select"
                              placeholder={translate('select')}
                            />
                          </div>
                        </div>
                      </Column>
                      <Column span={12}>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell" width={selectProps.width}>
                              {translate('country')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell">
                              {translate('zip-code')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell">
                              {translate('house-number')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell" width="160px">{translate('addition')}</TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell" width="180px">
                              {translate('street-name')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                          <div className="common-data-table__cell header">
                            <TableCellWrapper className="common-data-table__head-cell" width="160px">
                              {translate('city')}
                              {' '}
                              *
                            </TableCellWrapper>
                          </div>
                        </div>
                        <div className="flex liabilities-section__table">
                          <div className="common-data-table__cell">
                            <SelectWrapper
                              {...selectProps}
                              name="loanGiverDetails.address.countryId"
                              options={countries}
                              className="country-code-select"
                              placeholder={translate('select')}
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.address.zipCode"
                              value={values.loanGiverDetails.address.zipCode}
                              dataTa="loan-giver-zip-code"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.address.houseNumber"
                              value={values.loanGiverDetails.address.houseNumber}
                              dataTa="loan-giver-house-number"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.address.additionToHouseNumber"
                              value={values.loanGiverDetails.address.additionToHouseNumber}
                              dataTa="loan-giver-addition"
                              width="160px"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.address.street"
                              value={values.loanGiverDetails.address.street}
                              dataTa="loan-giver-street-name"
                              width="180px"
                            />
                          </div>
                          <div className="common-data-table__cell">
                            <InputWrapper
                              {...inputProps}
                              name="loanGiverDetails.address.city"
                              value={values.loanGiverDetails.address.city}
                              dataTa="loan-giver-city"
                              width="160px"
                            />
                          </div>
                        </div>
                      </Column>
                    </ColumnLayout>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button type="button" className="mar-r-sm" buttonType="secondary" onClick={onCloseModal}>{translate('cancel')}</Button>
                <Button type="submit" dataTa="loans-for-own-homes-modal-save-button" buttonType="primary" disabled={!isDirty || !isValid}>{translate('save')}</Button>
              </ModalFooter>
            </>
          )}
      </Form>
    </LoanForOwnHomeModalWrapper>
  );
};

const LoanForOwnHomeModalWrapper = styled(ModalWrapper)`
  &&& .mdc-dialog__surface {
    width: 1035px;
  }

  &&& .liabilities-section__table {
    .header {
      height: 2rem;
      display:inline-flex;
      span {
        color: ${({ theme }) => theme.currencyText};
      }
    }

    .table-footer {
      color: ${({ theme }) => theme.currencyText};
      font-size: ${({ theme }) => theme.fontSizes.fs18};
      text-align: right;
    }
  }
`;

export default LoansForOwnHomeModal;

import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ModalBody,
  Form,
  ModalFooter,
  ColumnLayout,
  Column,
} from '@visionplanner/ui-react-material';
import styled from 'styled-components';
import { CurrencyCell } from '../../../../common/table-cell-templates';
import { ModalWrapper, TableCellWrapper } from '../../../../common/styled-wrapper';
import { assetsTranslate as translate } from '../assets-translate';
import OtherCountryDividendTable from './other-country-dividend-table';
import { getGuid, cleanDeep } from '../../../../common/utils';

const DividendModal = ({
  dividendValues, title, countries, onCloseModal, handleDividendChanges, dataTa,
}) => (
  <SubModalWrapper
    title={title}
    open
    onClose={onCloseModal}
    dataTa={dataTa}
    preventDismissalOnOutsideClick
  >
    <Form
      initialValues={dividendValues}
      onSubmit={(formValues) => {
        const formData = formValues.groupingId ? formValues : { ...formValues, groupingId: getGuid() };
        const updatedOtherCountriesDividends = formData.otherCountryDividends.filter(item => (item.countryId && item));
        handleDividendChanges(cleanDeep({ ...formData, otherCountryDividends: updatedOtherCountriesDividends }, false, [0]));
        onCloseModal();
      }}
      dataTa={`${dataTa}-form`}
    >
      {({ values }) => (
        <>
          <ModalBody className="mar-hor-lg dividend-section__table">
            <ColumnLayout className="mar-b-md">
              <Column span={12} className="flex">
                <div className="common-data-table__cell header">
                  <TableCellWrapper className="common-data-table__head-cell" width="160px">{translate('country')}</TableCellWrapper>
                </div>
                <div className="common-data-table__cell header">
                  <TableCellWrapper className="common-data-table__head-cell text-align-right" title={translate('dividend')}>{translate('dividend')}</TableCellWrapper>
                </div>
                <div className="common-data-table__cell header">
                  <TableCellWrapper className="common-data-table__head-cell" title={translate('withheld-dividend-tax')}>{translate('withheld-dividend-tax')}</TableCellWrapper>
                </div>
              </Column>
              <Column span={12} className="flex grid-cell__label">
                <div className="common-data-table__cell">
                  <TableCellWrapper width="160px">
                    {countries?.[0]?.label}
                  </TableCellWrapper>
                </div>
                <div className="common-data-table__cell">
                  <CurrencyCell
                    name="netherLandDividend.dividend"
                    dataTa="netherLandDividend-dividend"
                  />
                </div>
                <div className="common-data-table__cell">
                  <CurrencyCell
                    name="netherLandDividend.dividendTax"
                    dataTa="netherLandDividend-dividend-tax"
                  />
                </div>
              </Column>
            </ColumnLayout>
            <OtherCountryDividendTable
              name="otherCountryDividends"
              values={values.otherCountryDividends || []}
              countries={countries}
            />
          </ModalBody>
          <ModalFooter>
            <Button type="button" buttonType="secondary" className="mar-r-sm" onClick={onCloseModal}>{translate('cancel')}</Button>
            <Button type="submit" dataTa="annual-reserve-margin-save-button">{translate('save')}</Button>
          </ModalFooter>
        </>
      )}
    </Form>
  </SubModalWrapper>
);

export const SubModalWrapper = styled(ModalWrapper)`
  &&& .mdc-dialog__surface {
    min-width: 450px;

    .mdc-typography--headline6 {
      text-overflow: ellipsis;
      width: 200px;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  &&& .dividend-section__table,
  &&& .assets-section__table,
  &&& .liabilities-section__table {
    position: relative;

    .common-data-table {
      border: none;
      padding: 0;

      &__row {
        border: 0;

        &:hover {
          background-color: transparent;
        }
      }

      &__head-cell {
        color: ${({ theme }) => theme.currencyText};
        font-size: ${({ theme }) => theme.fontSizes.fs12};
        text-transform: uppercase;
        height: auto;
      }

      &__cell {
        border: none;
        padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.large} ${({ theme }) => theme.paddings.small} 0;

        &:last-of-type {
          padding-right: 0;
        }

        .currency-input {
          input {
            text-align: right;
          }
        }
      }

      &__body .common-data-table__cell {
        vertical-align: top;
      }
    }
  }

  .dividend-section__table {
    .mdc-layout-grid {
      padding: 0;

      &__inner {
        grid-gap: 0;
      }
    }
  }
`;

DividendModal.propTypes = {
  /** values of dividend modal */
  dividendValues: PropTypes.object,
  /** title of the modal */
  title: PropTypes.string.isRequired,
  /** provides array of objects for countries list */
  countries: PropTypes.array.isRequired,
  /** function to close the modal */
  onCloseModal: PropTypes.func,
  /** function to save/handle dividend modal data  */
  handleDividendChanges: PropTypes.func.isRequired,
  /** provides test attribute for component */
  dataTa: PropTypes.string.isRequired,
};

export default DividendModal;

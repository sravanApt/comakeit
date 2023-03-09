import React from 'react';
import PropTypes from 'prop-types';
import { ColumnLayout, Column } from '@visionplanner/ui-react-material';
import styled from 'styled-components';
import { expenditureTranslate as translate } from '../expenditure-translate';
import {
  NumberCell, CurrencyCell,
} from '../../../../common/table-cell-templates';

/**
 * Modal - Component that can be used to show and edit details of Travel Expenses For Healthcare
 *
 */

const TravelExpensesForHealthcareModalSpans = {
  labelSpan: 7,
  cellSpan: 5,
};

const TravelExpensesForHealthcareModal = ({ values, name }) => (
  <TravelExpensesForHealthcareModalWrapper className="travel-expenses-for-healthcare-modal margin-zero">
    <ColumnLayout>
      <Column span={TravelExpensesForHealthcareModalSpans.labelSpan}>{translate('extra-travel-expenses-for-healthcare')}</Column>
      <Column span={TravelExpensesForHealthcareModalSpans.cellSpan}>
        <CurrencyCell
          name={`${name}.extraExpensesForHealthcare`}
          value={values.extraExpensesForHealthcare}
          dataTa="travel-expenses-description"
        />
      </Column>
    </ColumnLayout>
    <ColumnLayout>
      <Column span={TravelExpensesForHealthcareModalSpans.labelSpan}>{translate('expenses-for-travel-by-ambulance')}</Column>
      <Column span={TravelExpensesForHealthcareModalSpans.cellSpan}>
        <CurrencyCell
          name={`${name}.expensesForTravelByAmbulance`}
          value={values.expensesForTravelByAmbulance}
          dataTa="travel-expenses-for-ambulance"
        />
      </Column>
    </ColumnLayout>
    <ColumnLayout>
      <Column span={TravelExpensesForHealthcareModalSpans.labelSpan}>{translate('total-distance-for-healthcare-in-km')}</Column>
      <Column span={TravelExpensesForHealthcareModalSpans.cellSpan}>
        <NumberCell
          name={`${name}.totalDistanceForHealthcareInKM`}
          value={values.totalDistanceForHealthcareInKM}
          dataTa="travel-expenses-disatance"
        />
      </Column>
    </ColumnLayout>
    <ColumnLayout>
      <Column span={TravelExpensesForHealthcareModalSpans.labelSpan}>{translate('expenses-per-km-in-cents')}</Column>
      <Column span={TravelExpensesForHealthcareModalSpans.cellSpan}>
        <NumberCell
          name={`${name}.expensesPerKMInCents`}
          value={values.expensesPerKMInCents}
          dataTa="travel-expenses-perKM"
          disabled={!values.totalDistanceForHealthcareInKM}
        />
      </Column>
    </ColumnLayout>
  </TravelExpensesForHealthcareModalWrapper>
);

const TravelExpensesForHealthcareModalWrapper = styled.div`
  .mdc-layout-grid {
    padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large};

    &__cell {
      font-size: ${({ theme }) => theme.fontSizes.fs12};
      margin: auto 0;
    }
  }
`;


TravelExpensesForHealthcareModal.propTypes = {
  /** provide values to correction modal */
  values: PropTypes.object.isRequired,
  /** formik name of the input */
  name: PropTypes.string.isRequired,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default TravelExpensesForHealthcareModal;

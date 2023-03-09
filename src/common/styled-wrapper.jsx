import React from 'react';
import styled from 'styled-components';
import {
  Button, Icon, FieldSet, Modal, ColumnLayout,
} from '@visionplanner/ui-react-material';
import { localize } from '@visionplanner/vp-ui-fiscal-library';
import { CURRENCY_INPUT_WIDTH } from './constants';

const { extend, translateWithPrefix } = localize();
export const translate = translateWithPrefix('styled-wrapper');
extend('nl', {
  'styled-wrapper': {
    'no-options-label': 'geen opties',
  },
});

const GridWrapper = styled(ColumnLayout)`
  @media (min-width: 1800px) {
    margin: 0;
    width: 70%;
  }
`;

const SectionTableWrapper = styled.div`
  &&& .common-data-table__row {
    border: none;

    .common-data-table__head-cell {
      text-transform: none;

      &:first-child {
        font-size: ${({ theme }) => theme.fontSizes.fs16};
        color: ${({ theme }) => theme.colors.mirage};
      }
    }

    .common-data-table__cell {
      vertical-align: middle;

      &:first-of-type {
        padding-left: 5px;
      }
    }
  }
`;

const ActionsSectionWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  .action-buttons {
    flex-grow: 1;
  }
`;

const IconWrapper = styled(({
  icon, className = '', onClick, dataTa, disabled = false, iconSet = 'far',
}) => (
  <span role="presentation" className={className} onClick={onClick} data-ta={dataTa}>
    <Icon iconSet={iconSet} name={icon} disabled={disabled} />
  </span>
))`
  && {
    &.icon {
      &__monitor--page {
        background-color: ${({ theme }) => theme.whiteBackground};
        border-radius: 5px;
        border: 1px solid ${({ theme }) => theme.inputBorder};
        cursor: pointer;
        float: right;
        height: 36px;
        line-height: 2.1;
        margin-left: ${({ theme }) => theme.margins.small};
        padding: 0 ${({ theme }) => theme.paddings.base};
        width: 36px;

        > i {
          color: ${({ theme }) => theme.primary};
          font-size: ${({ theme }) => theme.fontSizes.fs14};
        }

        &.fill {
          background-color: ${({ theme }) => theme.primary};

          > i {
            color: ${({ theme }) => theme.whiteBackground};
          }
        }
      }

      &__edit {
        .rmwc-icon {
          font-size: ${({ theme }) => theme.fontSizes.fs12};
          padding: ${({ theme }) => theme.paddings.small};
          margin: auto;

          &:hover {
            background: ${({ theme }) => theme.colors.pampas};
            border-radius: 4px;
          }
        }
      }

      &__opening-balance,
      &__closing-balance {
        .rmwc-icon {
          font-size: ${({ theme }) => theme.fontSizes.fs12};
          padding-left: ${({ theme }) => theme.paddings.small};
          vertical-align: middle;
          cursor: auto;
        }
      }

      &__closing-balance {
        .rmwc-icon {
          color: ${({ theme }) => theme.colors.thunderBird};
        }
      }

      &__opening-balance {
        .rmwc-icon {
          color: ${({ theme }) => theme.colors.selectiveYellow};
        }
      }

      &__actions {
        display: flex;
        min-height: 32px;

        .rmwc-icon {
          font-size: ${({ theme }) => theme.fontSizes.fs12};
          padding: ${({ theme }) => theme.paddings.small};
          margin: auto;

          &:hover {
            background: ${({ theme }) => theme.colors.pampas};
            border-radius: 4px;
          }
        }
      }
    }
  }
`;

const ButtonWrapper = styled(Button)`
  &.button {
    &__sba {
      border-bottom-right-radius: 0;
      border-right: 0;
      border-top-right-radius: 0;
    }

    &__sbt {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &__via {
      border-bottom-left-radius: 0;
      border-left: 0;
      border-top-left-radius: 0;
    }
  }
`;

const FilterButtonsWrapper = styled.div`
  &.filter-btns {
    > button {
      margin-left: 10px;
      width: 120px;
    }
  }
`;

const TaxAmountWrapper = styled.div`
  background-color: ${({ theme }) => theme.currencyBackground};
  color: ${({ theme }) => theme.fieldLabelText};
  font-family: ${({ theme }) => theme.fontStyles.title};
  font-size: ${({ theme }) => theme.fontSizes.fs28};
  margin: auto 0;
  padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.large};
  position: fixed;
  right: 5%;
  top: 75px;
  z-index: 7;

  > .label {
    font-size: ${({ theme }) => theme.fontSizes.fs12};
  }
`;

const InputWrapper = styled(FieldSet)`
  margin: 0;
  width: ${({ width }) => (width ? `${width}` : '100%')};

  .mdc-text-field {
    input {
      text-align: ${({ align }) => align};
    }
  }

  > label {
    margin: 0;
  }

  &.currency-input {
    input {
      padding-left: 38px;
    }
  }
`;

const DateInputWrapper = styled(InputWrapper)`
  .DateInput,
  .mdc-text-field {
    input {
      font-weight: normal;
      text-align: ${({ align }) => (align || 'left')};
    }
  }

  .SingleDatePicker > div {
    display: flex;
  }

  .SingleDatePicker_picker {
    z-index: 3;
  }
`;

const SelectWrapper = styled(InputWrapper)`
  &&& .react-select {
    &__menu {
      z-index: 3;
    }
    &__clear-indicator {
      padding: 5px;
    }
  }
`;

SelectWrapper.defaultProps = {
  noOptionsMessage: translate('no-options-label'),
};

const SectionOptionsWrapper = styled.div`
  display: flex;
  position: relative;

  .plus-icon {
    color: ${({ theme }) => theme.primary};
    font-size: ${({ theme }) => theme.fontSizes.fs12};
    margin-right: 5px;
  }

  .mdc-button {
    &__label {
      text-transform: initial;
      display: flex;
      align-items: center;
    }
  }

  .mdc-list {
    border: 1px solid ${({ theme }) => theme.inputBorder};
    border-radius: 4px;
    position: absolute;
    top: 40px;

    &-item {
      height: 32px;
      text-transform: initial;

      &--disabled {
        color: ${({ theme }) => theme.inputBorder} !important;
        pointer-events: none;
      }
    }
  }
`;

const ModalWrapper = styled(Modal)`
  z-index: 99;

  form {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  input::placeholder {
    color: ${({ theme }) => theme.currencyText};
    opacity: 1;
  }

  input::-ms-input-placeholder {
    color: ${({ theme }) => theme.currencyText};
  }

  && .mdc-dialog {
    &__content {
      letter-spacing: 0;
      padding: ${({ theme }) => theme.paddings.base} 0;
      position: relative;

      .forecast-section {
        border-bottom: none;
        margin-bottom: 0;
      }

      .mdc-layout-grid {
        color: ${({ theme }) => theme.colors.mirage};
      }

      .common-data-table {
        padding: 0 ${({ theme }) => theme.paddings.large};

        &__cell {
          line-height: 1.25;
        }
      }
    }

    &__actions {
      border-top: 1px solid ${({ theme }) => theme.inputBorder};
      padding: ${({ theme }) => theme.paddings.base} ${({ theme }) => theme.paddings.large};
    }

    &__title {
      background-color: ${({ theme }) => theme.whiteBackground};
      color: ${({ theme }) => theme.colors.mirage};
      padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.large};
      text-transform: initial;
    }

    &__surface {
      min-width: 500px;
      max-width: 100%;
      width: auto;
    }
  }
`;

const CorrectionTableWrapper = styled.div`
  &&& .common-data-table {
    border: 0;

    &__row {
      border: 0;

      &:hover {
        background-color: transparent;
      }

    }

    &__cell {
      padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.large} ${({ theme }) => theme.paddings.small} 0;

      &:last-of-type {
        padding-right: 0;
      }
    }

    &__head-cell {
      text-transform: uppercase;
      color: ${({ theme }) => theme.currencyText};
      font-size: ${({ theme }) => theme.fontSizes.fs12};
      vertical-align: middle;
      font-weight: 500;
    }
  }
`;

const TableCellWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${({ width }) => width || CURRENCY_INPUT_WIDTH};
`;

const DescriptionCellWrapper = styled(TableCellWrapper)`
  height: 32px;
  display: flex;
  align-items: center;
`;

const CurrencyCellWrapper = styled(DescriptionCellWrapper)`
  justify-content: flex-end;
`;

const ContainerWrapper = styled.div`
  && .tab-container {
    padding: ${({ theme }) => theme.paddings.large} 0 0;

    .common-data-table {
      display: inline-block;

      &__content {
        min-width: auto;
      }

      &__row {
        border: none;
      }

      &__cell {
        padding: ${({ theme }) => theme.paddings.small} ${({ theme }) => theme.paddings.large} ${({ theme }) => theme.paddings.small} 0;

        &:last-of-type {
          padding-right: 0;
        }
      }

      &.rmwc-data-table--sticky-columns-1 .common-data-table__cell:nth-child(-n + 1) {
        box-shadow: none;
      }
    }

    .income-section,
    .liabilites-section,
    .assets-section {
      &__table {
        margin-top: ${({ theme }) => theme.margins.medium};
        position: relative;
      }

      .actions-inline {
        .icon__edit,
        .icon__actions {
          display: inline;
        }
      }
    }
  }
`;

export {
  GridWrapper,
  SectionTableWrapper,
  ActionsSectionWrapper,
  IconWrapper,
  ButtonWrapper,
  FilterButtonsWrapper,
  TaxAmountWrapper,
  InputWrapper,
  DateInputWrapper,
  SectionOptionsWrapper,
  TableCellWrapper,
  DescriptionCellWrapper,
  CurrencyCellWrapper,
  SelectWrapper,
  ModalWrapper,
  CorrectionTableWrapper,
  ContainerWrapper,
};

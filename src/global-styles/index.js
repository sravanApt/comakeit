import { createGlobalStyle, css } from 'styled-components';
import { DatePickerCustomStyles } from './date-picker-custom-styles';

const InputPlacehoderCss = css`
  input::placeholder {
    color: ${({ theme }) => theme.currencyText} !important;
    opacity: 1;
  }

  input::-ms-input-placeholder {
    color: ${({ theme }) => theme.currencyText} !important;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${DatePickerCustomStyles}
  ${InputPlacehoderCss}

  .add-new-section-button:disabled {
    i {
      color: ${({ theme }) => theme.colors.wafer};
    }
  }

  .mdc-layout-grid__cell {
    color: ${({ theme }) => theme.colors.mirage};
    font-size: ${({ theme }) => theme.fontSizes.fs14};

    &.grid-cell__label {
      display: flex;
      height: 32px;
      align-items: center;

      &--right {
        justify-content: flex-end;

        span {
          text-align: right;
        }
      }

      &--auto {
        margin: auto 0;
      }
    }
  }

  .currency-input {
    input {
      text-align: right;
    }
  }

  .margin-auto {
    margin: auto;
  }
`;

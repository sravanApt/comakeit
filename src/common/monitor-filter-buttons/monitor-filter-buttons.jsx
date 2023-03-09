import React from 'react';
import PropTypes from 'prop-types';
import { FilterButtonsWrapper, ButtonWrapper } from '../styled-wrapper';

const MonitorFilterButtons = ({
  applyButton, clearButton,
}) => (
  <FilterButtonsWrapper className="filter-btns pull-right pad-t-xs">
    <ButtonWrapper
      dataTa={clearButton.dataTa}
      buttonType="secondary"
      onClick={clearButton.handleClear}
      disabled={clearButton.disabled}
    >
      {clearButton.label}
    </ButtonWrapper>
    <ButtonWrapper
      dataTa={applyButton.dataTa}
      type="submit"
      disabled={applyButton.disabled}
    >
      {applyButton.label}
    </ButtonWrapper>
  </FilterButtonsWrapper>
);

MonitorFilterButtons.propTypes = {
  /** contain data to be used for apply button. like dataTa(string) and label(string) */
  applyButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    dataTa: PropTypes.string,
  }).isRequired,
  /** contain data to be used for cancel button. like dataTa(string), handle clear(function) and label(string) */
  clearButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    handleClear: PropTypes.func.isRequired,
    dataTa: PropTypes.string,
  }).isRequired,
};

export default MonitorFilterButtons;

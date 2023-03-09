import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Button, Icon } from '@visionplanner/ui-react-material';
import { usePopOverDismissEvents } from '@visionplanner/vp-ui-fiscal-library';
import IncomeSectionHeading from '../income/common/income-section-heading';
import {
  SectionOptionsWrapper,
} from '../../../common/styled-wrapper';

/**
  * Liabilities - common table along with button to display modal
  *
  */

const LiabilitiesCommonTable = ({
  heading, values, columnGroup, rowTemplate, dataTa, handleRemove, buttonLabel, onClickHandler,
}) => {
  const {
    ref,
  } = usePopOverDismissEvents();

  return (
    <IncomeSectionHeading
      heading={heading}
      handleRemove={handleRemove}
      dataTa={dataTa}
    >
      <div className="liabilites-section__table margin-zero">
        {(values.length > 0
          && (
            <DataTable
              className="current-income"
              columnGroups={columnGroup}
              rowTemplate={rowTemplate}
              rows={values || []}
            />
          )
        )}
        {buttonLabel && (
          <SectionOptionsWrapper ref={ref}>
            <Button
              buttonType="secondary"
              className="add-button mar-ver-sm"
              onClick={() => onClickHandler()}
              dataTa={`add-${dataTa}`}
            >
              <Icon iconSet="far" name="plus" className="plus-icon" />
              {` ${buttonLabel}`}
            </Button>
          </SectionOptionsWrapper>
        )}
      </div>
    </IncomeSectionHeading>
  );
};


LiabilitiesCommonTable.defaultProps = {
  values: [],
};

LiabilitiesCommonTable.propTypes = {
  /** specifies header text for the section */
  heading: PropTypes.string.isRequired,
  /** contains array of income fields with description, wages etc. */
  values: PropTypes.array,
  /** prefix for name of the input */
  columnGroup: PropTypes.array.isRequired,
  /** Group of functions to add custom HTML templates to all the rows in a column */
  rowTemplate: PropTypes.object.isRequired,
  /** provide test attribute for component */
  dataTa: PropTypes.string,
  /** function handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** specifies the label for button */
  buttonLabel: PropTypes.string,
  /** callback to handle on click of button */
  onClickHandler: PropTypes.func,
};

/** Exported Enhanced Income Component wrapped with FieldArray HOC */
export default LiabilitiesCommonTable;

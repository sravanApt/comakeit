import React from 'react';
import {
  DataTable, Button, Icon,
} from '@visionplanner/ui-react-material';
import PropTypes from 'prop-types';
import IncomeSectionHeading from '../income/common/income-section-heading';
import {
  SectionOptionsWrapper,
} from '../../../common/styled-wrapper';

/**
 *  Assets Common Table - to display section which contains TableCells
 */
const AssetsCommonTable = ({
  heading, values, columnGroup, rowTemplate, dataTa, handleRemove, addButtonText, addButtonDataTa, showSectionModal,
}) => (
  <IncomeSectionHeading
    heading={heading}
    handleRemove={handleRemove}
    dataTa={dataTa}
  >
    <div className="assets-section__table margin-zero">
      { !!values?.length
      && (
        <DataTable
          className="current-income"
          columnGroups={columnGroup}
          rowTemplate={rowTemplate}
          rows={values}
        />
      )}
      { addButtonText
      && (
        <SectionOptionsWrapper className="pad-b-md">
          <Button
            buttonType="secondary"
            className="add-row-button mar-ver-sm"
            onClick={() => showSectionModal()}
            dataTa={addButtonDataTa}
          >
            <Icon iconSet="far" name="plus" className="plus-icon" />
            {` ${addButtonText}`}
          </Button>
        </SectionOptionsWrapper>
      )}
    </div>
  </IncomeSectionHeading>
);

AssetsCommonTable.defaultProps = {
  values: [],
};

AssetsCommonTable.prototype = {
  /** Provides heading for the section */
  heading: PropTypes.string,
  /** Contains business data */
  values: PropTypes.array,
  /** Columns to be displayed */
  columnGroup: PropTypes.array,
  /** Group of functions to add custom HTML templates to all the rows in a column */
  rowTemplate: PropTypes.object.isRequired,
  /** provides test attribute for component */
  dataTa: PropTypes.string,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** text inside the add button */
  addButtonText: PropTypes.string,
  /** test attribute for add button of section */
  addButtonDataTa: PropTypes.string,
  /** function to open the modal */
  showSectionModal: PropTypes.func.isRequired,
};

export default AssetsCommonTable;

import React from 'react';
import PropTypes from 'prop-types';
import { DataTable, Tooltip } from '@visionplanner/ui-react-material';
import { TableCellWrapper, IconWrapper } from '../../../../common/styled-wrapper';
import { mergeArrays, convertCurrency } from '../../../../common/utils';

/**
  * Tax Forecast - Profit & Loss - Common Table component for Business Profit & Loss
  *
  */

const CommonTable = ({
  values,
  columns,
  handleCorrectionModal,
  className,
  hideAction,
  isOpeningBalanceNotMatched,
  isClosingBalanceNotMatched,
  dataTa,
}) => {
  const colTemplate = [
    {
      id: 1,
      label: '',
      className: `col-description mirage-label ${!columns ? 'table-footer' : ''} ${(columns && columns.length === 0) ? 'table-sub-footer' : ''}`,
    },
    {
      id: 2,
      label: '',
      className: `mirage-label text-align-right ${!columns ? 'table-footer' : ''} ${(columns && columns.length === 0) ? 'table-sub-footer' : ''}`,
    },
    {
      id: 3,
      label: '',
      className: `mirage-label text-align-right ${!columns ? 'table-footer' : ''} ${(columns && columns.length === 0) ? 'table-sub-footer' : ''}`,
    },
    {
      id: 4,
      label: '',
      className: `col-actions text-align-right ${!columns ? 'table-footer' : ''} ${(columns && columns.length === 0) ? 'table-sub-footer' : ''}`,
    },
  ];

  const rowTemplate = {
    description: ({ description }) => (
      <TableCellWrapper width="510px">
        {description}
      </TableCellWrapper>
    ),
    previousValue: ({ previousYearAmount }) => (
      <Tooltip overlay={convertCurrency({ value: previousYearAmount })} placement="topRight">
        <TableCellWrapper width="140px" className="pad-l-sm">
          {dataTa === 'deposits-and-withdrawals' ? '' : convertCurrency({ value: previousYearAmount })}
          { isOpeningBalanceNotMatched && <IconWrapper icon="exclamation-triangle" iconSet="fas" className="icon__opening-balance" />}
        </TableCellWrapper>
      </Tooltip>
    ),
    currentValue: ({ currentYearAmount }) => (
      <Tooltip overlay={convertCurrency({ value: currentYearAmount })} placement="topRight">
        <TableCellWrapper width="140px" className="pad-l-sm">
          {convertCurrency({ value: currentYearAmount })}
          { isClosingBalanceNotMatched && <IconWrapper icon="exclamation-triangle" iconSet="fas" className="icon__closing-balance" />}
        </TableCellWrapper>
      </Tooltip>
    ),
    edit: ({
      index, description, key, isCorrectionDataExist,
    }) => (
      <TableCellWrapper width="45px">
        { (!!columns && columns.length !== 0 && (key !== 'allocationOrReleaseFiscalPensionReserveForEreterpreneur') && !hideAction)
          && <IconWrapper icon="pen" iconSet={isCorrectionDataExist ? 'fas' : 'far'} className="icon__edit edit" onClick={() => handleCorrectionModal(description, key, index)} dataTa={`edit-${key}`} />
        }
      </TableCellWrapper>
    ),
  };

  return (
    <div className={`${className} section__table`} data-ta={dataTa}>
      <DataTable
        className="common-income-table"
        columnGroups={mergeArrays(colTemplate, columns)}
        rowTemplate={rowTemplate}
        rows={values}
      />
    </div>
  );
};

CommonTable.defaultProps = {
  className: '',
};

CommonTable.propTypes = {
  /** Contains business data */
  values: PropTypes.array,
  /** Columns to be displayed */
  columns: PropTypes.array,
  /** function to open or close the modal */
  handleCorrectionModal: PropTypes.func,
  /** custom class for the table */
  className: PropTypes.string,
  /** property to hide the action column */
  hideAction: PropTypes.bool,
  /** property to checke whether the opening balance is matched */
  isOpeningBalanceNotMatched: PropTypes.bool,
  /** property to checke whether the closing balance is matched */
  isClosingBalanceNotMatched: PropTypes.bool,
};

export default CommonTable;

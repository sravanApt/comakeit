import React from 'react';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import LiabilitiesCommonTable from './liabilities-common-table';
import { liabilitiesTranslate as translate } from './liabilities-translate';
import { ActionsCell } from '../../../common/table-cell-templates';
import { TableCellWrapper, IconWrapper } from '../../../common/styled-wrapper';
import { getTotalValue, convertCurrency } from '../../../common/utils';
import { LOAN_FOR_OWN_HOMES_EMPTY_OBJECT } from './liabilities.constants';

const LOAN_FOR_OWN_HOME_COLUMN_GROUP = [
  {
    id: 1,
    label: () => <TableCellWrapper width="120px">{translate('description-label')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 2,
    label: () => <TableCellWrapper>{translate('belongs-to')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 3,
    label: () => <TableCellWrapper width="120px">{translate('account-number')}</TableCellWrapper>,
    className: 'col-countryCode',
  },
  {
    id: 4,
    label: () => <TableCellWrapper>{translate('amount-31-12-label')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 5,
    label: () => <TableCellWrapper>{translate('intrest-label')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 6,
    label: () => <TableCellWrapper>{translate('total-cost')}</TableCellWrapper>,
    className: 'mirage-label',
  },
  {
    id: 7,
    label: translate('actions'),
    className: 'col-actions',
  },
];

const LoansForOwnHome = ({
  handleRemove, values, handleLoansForOwnHomeData, handleRemoveLoansForOwnHomeRow,
  owners, countries, taxableYear, sectionKey, heading = translate('loans-for-own-home'), buttonLabel,
  dataTa = 'loans-for-own-home-section',
}) => {
  const { showModal } = useModal();
  const loansForOwnHomeTemplate = {
    description: ({ loanDetails: { description } }) => (
      <TableCellWrapper width="120px" title={description}>
        {description}
      </TableCellWrapper>
    ),
    belongsTo: ({ loanDetails: { belongsTo } }) => (
      <TableCellWrapper title={fetchBelongsToLabel(belongsTo).label}>
        {fetchBelongsToLabel(belongsTo).label}
      </TableCellWrapper>
    ),
    accountNumber: ({ loanDetails: { accountNumber } }) => (
      <TableCellWrapper width="120px" title={accountNumber}>
        {accountNumber}
      </TableCellWrapper>
    ),
    amount: ({ loanDetails: { principalAmount } }) => (
      <TableCellWrapper title={convertCurrency({ value: principalAmount || 0 })}>
        {convertCurrency({ value: principalAmount || 0 })}
      </TableCellWrapper>
    ),
    intrest: ({ loanDetails: { interest } }) => (
      <TableCellWrapper title={convertCurrency({ value: interest || 0 })}>
        {convertCurrency({ value: interest || 0 })}
      </TableCellWrapper>
    ),
    totalCost: ({ costs }) => {
      const totalAmount = getTotalValue(costs, 'amount');
      return (
        <TableCellWrapper title={convertCurrency({ value: totalAmount || 0 })}>
          {convertCurrency({ value: totalAmount || 0 })}
        </TableCellWrapper>
      );
    },
    actions: ({ index }) => (
      <div className="actions-inline">
        <IconWrapper icon="pen" iconSet="fas" className="icon__edit edit" onClick={() => showLoansForOwnHomeModal(index)} dataTa={`edit-${dataTa}-${index}`} />
        <ActionsCell
          handleDelete={() => handleRemoveLoansForOwnHomeRow(index, sectionKey)}
          index={index}
        />
      </div>
    ),
  };

  const fetchBelongsToLabel = (belongsTo) => owners.find((owner) => owner.value === belongsTo);

  const showLoansForOwnHomeModal = (index) => {
    const modalDependencies = {
      title: `${translate('edit')} ${buttonLabel.toLowerCase()}`,
      data: index !== undefined ? { ...values[index] } : { ...LOAN_FOR_OWN_HOMES_EMPTY_OBJECT[sectionKey] },
      countries,
      belongsToOptions: owners,
      handleBusinessData: (data) => handleLoansForOwnHomeData(data, index, sectionKey),
      isOwnHomeSection: sectionKey === 'loansForOwnHome',
      taxableYear,
      dataTa,
    };
    showModal('loans-for-own-home-modal', { ...modalDependencies });
  };
  return (
    values && (
      <LiabilitiesCommonTable
        heading={heading}
        values={values || []}
        columnGroup={LOAN_FOR_OWN_HOME_COLUMN_GROUP}
        rowTemplate={loansForOwnHomeTemplate}
        dataTa={dataTa}
        handleRemove={handleRemove}
        buttonLabel={buttonLabel}
        onClickHandler={showLoansForOwnHomeModal}
      />
    )
  );
};

export default LoansForOwnHome;

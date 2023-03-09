import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import AssetsCommonTable from './assets-common-table';
import { assetsTranslate as translate } from './assets-translate';
import { TableCellWrapper, IconWrapper } from '../../../common/styled-wrapper';
import { ActionsCell } from '../../../common/table-cell-templates';
import TaxForecastContext from '../tax-forecast-context';
import { NEW_SUBSTANTIAL_INTEREST_DATA } from './assets-initial-data';
import { convertCurrency } from '../../../common/utils';

const CURRENT_COLUMN_GROUP = [
  {
    id: 1,
    label: () => <TableCellWrapper width="150px">{translate('business-name')}</TableCellWrapper>,
  },
  // TODO: VPC-36160 will be reverted when administration used for this section
  // {
  //   id: 2,
  //   label: () => <TableCellWrapper width="120px">{translate('administration')}</TableCellWrapper>,
  // },
  {
    id: 3,
    label: () => <TableCellWrapper title={translate('belongs-to')}>{translate('belongs-to')}</TableCellWrapper>,
  },
  {
    id: 4,
    label: () => <TableCellWrapper title={translate('no-of-shares')}>{translate('no-of-shares')}</TableCellWrapper>,
  },
  {
    id: 5,
    label: () => <TableCellWrapper width="80px" title={translate('acquisition-price')}>{translate('acquisition-price')}</TableCellWrapper>,
  },
  {
    id: 7,
    label: translate('actions'),
  },
];

/**
 * Tax Forecast - Assets Component - Substantial Interest Section
 */
const SubStantialInterest = ({
  values, handleRemove, handleSubstantialInterestData, handleRemoveSubstantialInterestTableRow,
}) => {
  const {
    dossierData: { businessDetails, masterData: { owners } }, countries,
  } = useContext(TaxForecastContext);
  const { showModal } = useModal();

  const administrations = [...(businessDetails?.fiscalPartnerBusinessDetails || []), ...(businessDetails?.taxableSubjectBusinessDetails || [])];
  const administrationOptions = useMemo(() => administrations && (administrations).map((administrationItem) => ({
    label: administrationItem.businessName,
    value: administrationItem.globalAdministrationId,
  })), [administrations]);

  const currentRowTemplate = {
    businessName: ({ businessName }) => (
      <TableCellWrapper width="150px" title={businessName}>
        {businessName}
      </TableCellWrapper>
    ),
    // TODO: VPC-36160 will be reverted when administration used for this section
    // globalAdministrationId: ({ globalAdministrationId }) => {
    //   const administrationName = administrationOptions.filter((admin) => (admin.value === globalAdministrationId))[0];
    //   return (
    //     <TableCellWrapper width="120px" title={administrationName?.label}>
    //       {administrationName?.label}
    //     </TableCellWrapper>
    //   );
    // },
    belongsTo: ({ belongsTo }) => {
      const ownerName = owners.filter((owner) => (owner.value === belongsTo))[0];
      return (
        <TableCellWrapper title={ownerName?.displayName}>
          {ownerName?.displayName}
        </TableCellWrapper>
      );
    },
    numberOfShares: ({ numberOfShares }) => (
      <TableCellWrapper>
        {numberOfShares}
      </TableCellWrapper>
    ),
    acquisitionPrice: ({ acquisitionPrice }) => (
      <TableCellWrapper width="80px">
        {convertCurrency({ value: acquisitionPrice || 0 })}
      </TableCellWrapper>
    ),
    actions: ({ index }) => (
      <div className="actions-inline">
        <IconWrapper
          icon="pen"
          iconSet="fas"
          className="icon__edit edit"
          onClick={() => showSectionModal(index)}
          dataTa={`substantial-interest-edit-${index}`}
        />
        <ActionsCell
          handleDelete={() => handleRemoveSubstantialInterestTableRow(index)}
          index={index}
          dataTa={`substantial-interest-row-${index}`}
        />
      </div>
    ),
  };

  const showSectionModal = (index) => {
    const props = {
      substantialInterestData: index !== undefined ? { ...values[index] } : { ...NEW_SUBSTANTIAL_INTEREST_DATA },
      owners,
      countries,
      administrationOptions,
      className: 'styled-grid-modal',
      onSubmit: (data) => handleSubstantialInterestData(data, index),
    };
    showModal('add-assets-substantial-interest-modal', props);
  };

  return (
    <AssetsCommonTable
      heading={translate('substantial-interest')}
      values={values}
      columnGroup={CURRENT_COLUMN_GROUP}
      rowTemplate={currentRowTemplate}
      dataTa="substantial-interest"
      handleRemove={handleRemove}
      addButtonText={translate('substantial-interest')}
      addButtonDataTa="add-substantial-interest-button"
      showSectionModal={showSectionModal}
    />
  );
};

SubStantialInterest.propTypes = {
  /** Provides array of objects containing substantial interest data */
  values: PropTypes.array,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** function to handle add / update substantial interest section data  */
  handleSubstantialInterestData: PropTypes.func.isRequired,
  /** function to handle remove of a row in substantial interest */
  handleRemoveSubstantialInterestTableRow: PropTypes.func.isRequired,
};

export default SubStantialInterest;

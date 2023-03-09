import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import AssetsCommonTable from './assets-common-table';
import { assetsTranslate as translate } from './assets-translate';
import { TableCellWrapper, IconWrapper } from '../../../common/styled-wrapper';
import { ActionsCell } from '../../../common/table-cell-templates';
import TaxForecastContext from '../tax-forecast-context';
import { NEW_OWN_HOME_DATA, NEW_OTHER_PROPERTIES_DATA } from './assets-initial-data';
import { OWN_HOME_AND_OTHER_PROPERTIES_COLUMNS, OWN_HOME_SECTION_KEY } from './assets.constants';
import { convertCurrency } from '../../../common/utils';

/**
 * Tax Forecast - Assets Component - Own Home Section
 */
const OwnHomesOrOtherProperties = ({
  values, handleRemove, handleOwnHomesOrOtherPropertiesData, handleRemoveOwnHomeOrOtherPropertyRow, modalKey, sectionKey,
}) => {
  const {
    dossierData: {
      masterData: { owners },
      dossierManifest: { taxableYear },
    }, countries,
  } = useContext(TaxForecastContext);
  const { showModal } = useModal();

  const currentRowTemplate = {
    description: ({ description }) => (
      <TableCellWrapper width="120px" title={description}>
        {description}
      </TableCellWrapper>
    ),
    belongsTo: ({ belongsTo }) => {
      const ownerName = owners.filter((owner) => (owner.value === belongsTo))[0];
      return (
        <TableCellWrapper title={ownerName?.displayName}>
          {ownerName?.displayName}
        </TableCellWrapper>
      );
    },
    // TODO: revert after got confirmation from PO
    // monumentalReferenceNumber: ({ monumentalReferenceNumber }) => (
    //   <TableCellWrapper width="130px">
    //     {monumentalReferenceNumber}
    //   </TableCellWrapper>
    // ),
    percentageOfOwnership: ({ percentageOfOwnership }) => (
      <TableCellWrapper width="80px">
        {percentageOfOwnership.toString().replace('.', ',')}{percentageOfOwnership && '%'}
      </TableCellWrapper>
    ),
    woz: ({ woz }) => (
      <TableCellWrapper>
        {convertCurrency({ value: woz || 0 })}
      </TableCellWrapper>
    ),
    ...((sectionKey === OWN_HOME_SECTION_KEY) ? {} : {
      calculatedValue: ({ calculatedValue }) => (
        <TableCellWrapper>
          {convertCurrency({ value: calculatedValue || 0 })}
        </TableCellWrapper>
      ),
    }),
    actions: ({ index }) => (
      <div className="actions-inline">
        <IconWrapper
          icon="pen"
          iconSet="fas"
          className="icon__edit edit"
          onClick={() => showSectionModal(index)}
          dataTa={`${sectionKey}-edit-${index}`}
        />
        <ActionsCell
          handleDelete={() => handleRemoveOwnHomeOrOtherPropertyRow(index)}
          index={index}
          dataTa={`${sectionKey}-row-${index}`}
        />
      </div>
    ),
  };

  const showSectionModal = (index) => {
    const props = {
      owners,
      countries,
      className: 'styled-grid-modal',
      onSubmit: (data) => handleOwnHomesOrOtherPropertiesData({ ...data, description: `${data.address.street} ${data.address.houseNumber || ''} ${data.address.additionToHouseNumber || ''} ${data.address.city}` }, index),
      taxableYear,
    };
    if (sectionKey === OWN_HOME_SECTION_KEY) {
      props.ownHomesData = (index !== undefined) ? { ...values[index] } : { ...NEW_OWN_HOME_DATA(taxableYear) };
    } else {
      props.otherPropertiesData = (index !== undefined) ? { ...values[index] } : { ...NEW_OTHER_PROPERTIES_DATA };
    }
    showModal(modalKey, props);
  };

  return (
    <AssetsCommonTable
      heading={translate(sectionKey)}
      values={values}
      columnGroup={OWN_HOME_AND_OTHER_PROPERTIES_COLUMNS(sectionKey)}
      rowTemplate={currentRowTemplate}
      dataTa={sectionKey}
      handleRemove={handleRemove}
      addButtonText={translate(sectionKey)}
      addButtonDataTa={`add-${sectionKey}-button`}
      showSectionModal={showSectionModal}
    />
  );
};

OwnHomesOrOtherProperties.propTypes = {
  /** Provides array of objects containing own homes/other properties data */
  values: PropTypes.array,
  /** function to handle remove section */
  handleRemove: PropTypes.func.isRequired,
  /** function to handle add/update own homes/other properties section data  */
  handleOwnHomesOrOtherPropertiesData: PropTypes.func.isRequired,
  /** function to handle remove of a row in own homes/other properties */
  handleRemoveOwnHomeOrOtherPropertyRow: PropTypes.func.isRequired,
  /** provides modal key for add/edit */
  modalKey: PropTypes.string.isRequired,
  /** provides section key for display heading and add test attributes for section */
  sectionKey: PropTypes.string.isRequired,
};

export default OwnHomesOrOtherProperties;

import React, {
  useState, useMemo, useEffect, useRef,
} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import { DataTable, Typography, FieldArray } from '@visionplanner/ui-react-material';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { getTotalValue } from '../../../../common/utils';
import { SelectWrapper } from '../../../../common/styled-wrapper';
import {
  CurrencyCell, ActionsCell, FooterCell, CurrencyLabelCell,
} from '../../../../common/table-cell-templates';
import { getRemainingOptions } from '../common/utils';

const COLUMN_GROUP = [
  {
    id: 1,
    label: translate('description'),
    className: 'col-description',
  },
  {
    id: 2,
    label: translate('opening'),
    className: 'col-currency text-align-right',
  },
  {
    id: 3,
    label: translate('allocation'),
    className: 'col-currency text-align-right',
  },
  {
    id: 4,
    label: translate('release'),
    className: 'col-currency text-align-right',
  },
  {
    id: 5,
    label: translate('closing'),
    className: 'col-currency text-align-right',
  },
  {
    id: 6,
    label: translate('actions'),
    className: 'col-actions',
  },
];

const defaultRowTemplate = {
  description: '', opening: null, allocation: null, release: null, closing: null,
};

const AllocationDetails = ({
  values, fieldNamePrefix, arrayHelpers, currentBusinessDetails, updateTaxCalculation, isAllocateTo, removeAllocationDetails,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const allocationDetailsRef = useRef(null);

  useEffect(() => {
    allocationDetailsRef.current = {
      updateTaxCalculation,
      removeAllocationDetails,
      initializeAndDisplayFooter: () => {
        if (values && values.length > 0) {
          if (get(values[values.length - 1], 'description') && values.length !== currentBusinessDetails?.length) {
            arrayHelpers.push({ ...defaultRowTemplate });
          }
        } else {
          arrayHelpers.push({
            ...defaultRowTemplate,
          });
        }
        loadFooterData();
      },
    };
  });

  const loadFooterData = () => {
    if (values && values.length) {
      const totalOpening = getTotalValue(values, 'opening');
      const totalAllocation = getTotalValue(values, 'allocation');
      const totalRelease = getTotalValue(values, 'release');
      const totalClosing = totalOpening + totalAllocation - totalRelease;
      if (totalOpening > 0 || totalAllocation > 0 || totalRelease > 0 || totalClosing > 0) {
        setFooterData({
          opening: totalOpening,
          allocation: totalAllocation,
          release: totalRelease,
          closing: totalClosing,
        });
      } else {
        setFooterData(null);
      }
    }
  };

  useEffect(() => {
    allocationDetailsRef.current.initializeAndDisplayFooter();
  }, [values]);


  const getOptionsToSelect = useMemo(() => (allocationValues, currentIndex) => getRemainingOptions(allocationValues, currentIndex, currentBusinessDetails || []), [currentBusinessDetails]);

  const rowTemplate = {
    description: ({
      opening, allocation, release, index,
    }) => (
      <SelectWrapper
        width="200px"
        className="allocation-select"
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.description`}
        options={getOptionsToSelect(values, index)}
        placeholder=""
        dataTa={`allocation-description-${index}`}
        menuPortalTarget
        customChangeHandler={(allocation || opening || release) ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    opening: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.opening`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        className="allocation-details-opening"
        disabled={!description}
      />
    ),
    allocation: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.allocation`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        className="allocation-details-allocation-amount"
        disabled={!description || !isAllocateTo}
      />
    ),
    release: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.release`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        className="allocation-details-release"
        disabled={!description}
      />
    ),
    closing: ({ opening, allocation, release }) => (
      <CurrencyLabelCell value={((opening || 0) + (allocation || 0) - (release || 0))} />
    ),
    actions: ({ description, index }) => (
      <ActionsCell
        lastIndex={
          description ? values.length : values.length - 1
        }
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  };

  useEffect(() => {
    !!amountUpdateIndicator && allocationDetailsRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  useEffect(() => {
    (!!footerData?.allocation && !isAllocateTo) && allocationDetailsRef.current.removeAllocationDetails();
  }, [footerData, isAllocateTo]);

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    opening: (<FooterCell value={footerData.opening} />),
    allocation: (<FooterCell value={footerData.allocation} />),
    release: (<FooterCell value={footerData.release} />),
    closing: (<FooterCell value={footerData.closing} />),
  } : null),
  [footerData]);

  return (
    <div className="allocation-details">
      <Typography use="normal-text">
        {translate('allocation-details')}
      </Typography>
      <div className="entrepreneur-section__table pad-t-sm">
        <DataTable
          className="allocation-details-table"
          dataTa="pension-reserve-allocation-details"
          columnGroups={COLUMN_GROUP}
          rowTemplate={rowTemplate}
          rows={values || []}
          footerValues={footerValues}
          hasFooter={!!footerData}
        />
      </div>
    </div>
  );
};

AllocationDetails.propTypes = {
  /** contains array of pensionReserveDetails fields with description,
     * allocation, release, opening  and closing.
     */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      allocation: PropTypes.number,
      description: PropTypes.string,
      release: PropTypes.number,
      opening: PropTypes.number,
      closing: PropTypes.number,
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** contains list of bussiness options available for the subject/partner */
  currentBusinessDetails: PropTypes.array,
  /** callback for calculation of updated tax */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported Enhaced Income Component wrapped with FieldArray HOC */
export default (({
  values, name, currentBusinessDetails, ...restProps
}) => FieldArray({
  values, name, currentBusinessDetails, ...restProps,
})(AllocationDetails));

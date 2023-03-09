import React, {
  useState, useMemo, useEffect, useRef,
} from 'react';
import { DataTable, FieldArray } from '@visionplanner/ui-react-material';
import get from 'lodash.get';
import PropTypes from 'prop-types';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import { CurrencyCell, ActionsCell, FooterCell } from '../../../../common/table-cell-templates';
import { SelectWrapper } from '../../../../common/styled-wrapper';
import { getTotalValue, getSubtractedYear } from '../../../../common/utils';
import EntrepreneurSectionHeading from '../../income/common/income-section-heading';
import { SELF_DEDUCTION_YEARS_TO_DISPLAY } from './entrepreneur.constants';
import { getRemainingOptions } from '../common/utils';

const defaultRowTemplate = {
  description: '', applied: null, opening: null, closing: null,
};

const getYears = (taxableYear) => [...Array(SELF_DEDUCTION_YEARS_TO_DISPLAY)].map((item, index) => ({
  label: getSubtractedYear(taxableYear, index + 1), value: getSubtractedYear(taxableYear, index + 1),
}));

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
    label: translate('actions'),
    className: 'col-actions',
  },
];

/** component to display remainder self deduction section of entrepreneur form */

const RemainderSelfDeduction = ({
  values, fieldNamePrefix, handleRemove, arrayHelpers, taxableYear, updateTaxCalculation,
}) => {
  const [footerData, setFooterData] = useState(null);
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const rowTemplate = {
    description: ({ opening, index }) => (
      <SelectWrapper
        width="115px"
        className="select-wrapper self-deduction-select"
        type="selectOne"
        controlType="autocomplete"
        name={`${fieldNamePrefix}.${index}.description`}
        options={getOptionsToSelect(values, index)}
        placeholder=""
        dataTa={`self-deduction-description-${index}`}
        menuPortalTarget
        customChangeHandler={opening ? (value) => {
          value && setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : null
        }
      />
    ),
    opening: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.opening`}
        customChangeHandler={description ? () => setAmountUpdateIndicator(amountUpdateIndicator + 1) : null}
        className="self-deduction-applied"
        disabled={!description}
      />
    ),
    actions: ({ index }) => (
      <ActionsCell
        lastIndex={
          /** no new row will be added after the rows length matches with the SELF_DEDUCTION_YEARS_TO_DISPLAY */
          index === (SELF_DEDUCTION_YEARS_TO_DISPLAY - 1) ? values.length : values.length - 1
        }
        handleDelete={() => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
          arrayHelpers.remove(index);
        }}
        index={index}
      />
    ),
  };

  const getOptionsToSelect = useMemo(() => (deductionValues, currentIndex) => getRemainingOptions(deductionValues, currentIndex, getYears(taxableYear)), [taxableYear]);

  const remainderDeductionsRef = useRef(null);

  useEffect(() => {
    remainderDeductionsRef.current = {
      updateTaxCalculation,
      initializeAndDisplayFooter: () => {
        if (values && values.length > 0) {
          if (get(values[values.length - 1], 'description') && values.length !== SELF_DEDUCTION_YEARS_TO_DISPLAY) {
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

  useEffect(() => {
    !!amountUpdateIndicator && remainderDeductionsRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  const loadFooterData = () => {
    if (values && values.length) {
      const totalOpening = getTotalValue(values, 'opening');
      if (totalOpening > 0) {
        setFooterData({
          opening: totalOpening,
        });
      } else {
        setFooterData(null);
      }
    }
  };

  useEffect(() => {
    remainderDeductionsRef.current.initializeAndDisplayFooter();
  }, [values]);

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    opening: (<FooterCell value={footerData.opening} />),
  } : null),
  [footerData]);

  return (
    <EntrepreneurSectionHeading
      heading={translate('remainder-self-employed-deduction')}
      handleRemove={handleRemove}
      dataTa="entrepreneurial-deductions-remainder-deduction"
    >
      <div className="entrepreneur-section__table pad-t-sm">
        <DataTable
          className="remainder-self-employed-deduction-table"
          dataTa="remainder-self-employed-deduction"
          columnGroups={COLUMN_GROUP}
          rowTemplate={rowTemplate}
          rows={values || []}
          footerValues={footerValues}
          hasFooter={!!footerData}
        />
      </div>
    </EntrepreneurSectionHeading>
  );
};

RemainderSelfDeduction.propTypes = {
  /** contains array of deductions fields with description, opening amount */
  values: PropTypes.arrayOf(
    PropTypes.shape({
      opening: PropTypes.number,
      description: PropTypes.string,
    }),
  ),
  /** prefix for name of the input */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** callback to handle removal of section */
  handleRemove: PropTypes.func.isRequired,
  /** callback for calculation of updated tax */
  updateTaxCalculation: PropTypes.func.isRequired,
};

/** Exported Enhaced Income Component wrapped with FieldArray HOC */
export default (({
  values, name, handleRemove, ...restprops
}) => FieldArray({
  values, name, handleRemove, ...restprops,
})(RemainderSelfDeduction));

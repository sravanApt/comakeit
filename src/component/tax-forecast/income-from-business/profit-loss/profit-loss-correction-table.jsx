import React, {
  useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  DataTable, FieldArray,
} from '@visionplanner/ui-react-material';
import { CorrectionTableWrapper } from '../../../../common/styled-wrapper';
import { incomeFromBusinessTranslate as translate } from '../income-from-business-translate';
import {
  DescriptionCell,
  CurrencyCell,
  FooterCell,
  ActionsCell,
  HeadCell,
  CurrencyLabelCell,
} from '../../../../common/table-cell-templates';
import { getPreviousYear, getTotalValue } from '../../../../common/utils';
import { manageCorrection } from '../common/utils';
import { useRowTemplate } from '../../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';

/**
 * Table - Display corrections of profit and loss data
 *
 */

const correctionRowTemplate = {
  description: '', prevYearAmountVPC: 0, prevYearAmountCorrection: 0, prevYearAmount: 0, amountVPC: 0, amountCorrection: 0, amount: 0,
};

const getConvertedCurrencyCell = (amount) => (
  <CurrencyLabelCell value={amount || 0} />
);

const ProfitLossCorrectionTable = ({
  values, fieldNamePrefix, arrayHelpers, taxableYear,
}) => {
  const [footerData, setFooterData] = useState(null);

  const columnGroup = useMemo(() => [
    {
      id: 1,
      label: () => translate('description'),
      className: 'mirage-label',
    },
    {
      id: 2,
      label: () => <HeadCell name={translate('commercial')} date={getPreviousYear(taxableYear)} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 3,
      label: () => <HeadCell name={translate('correction')} date={getPreviousYear(taxableYear)} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 4,
      label: () => <HeadCell name={translate('fiscal')} date={getPreviousYear(taxableYear)} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 5,
      label: () => <HeadCell name={translate('commercial')} date={taxableYear} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 6,
      label: () => <HeadCell name={translate('correction')} date={taxableYear} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 7,
      label: () => <HeadCell name={translate('fiscal')} date={taxableYear} />,
      className: 'mirage-label text-align-right',
    },
    {
      id: 8,
      label: () => '',
      className: 'col-actions',
    },
  ], [taxableYear]);

  const rowTemplate = {
    description: ({ index, rubricId }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        disabled={!!rubricId}
      />
    ),
    prevYearAmountVPC: ({ prevYearAmountVPC }) => getConvertedCurrencyCell(prevYearAmountVPC),
    prevYearAmountCorrection: ({ prevYearAmountCorrection }) => getConvertedCurrencyCell(prevYearAmountCorrection),
    prevYearAmount: ({ prevYearAmount }) => getConvertedCurrencyCell(prevYearAmount),
    amountVPC: ({ amountVPC }) => getConvertedCurrencyCell(amountVPC),
    amountCorrection: ({ index, description }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amountCorrection`}
        className="amount-correction pull-right"
        disabled={!description}
      />
    ),
    amount: ({ amountVPC, amountCorrection }) => getConvertedCurrencyCell((amountVPC || 0) + manageCorrection(amountCorrection)),
    actions: ({ index, rubricId }) => (
      <ActionsCell lastIndex={values.length - 1} handleDelete={() => arrayHelpers.remove(index)} index={index} dataTa={`profit-loss-correction-${index}`} rubricId={rubricId} />
    ),
  };

  useRowTemplate({
    arrayHelpers,
    rowTemplate: correctionRowTemplate,
    values,
    loadFooterData: () => {
      const totalPreviousCommercial = getTotalValue(values, 'prevYearAmountVPC');
      const totalCurrentCommercial = getTotalValue(values, 'amountVPC');
      const totalPreviousCorrection = getTotalValue(values, 'prevYearAmountCorrection');
      const totalCurrentCorrection = getTotalValue(values, 'amountCorrection');
      const totalPreviousFiscal = getTotalValue(values, 'prevYearAmount');
      if (totalPreviousCommercial || totalCurrentCommercial || totalPreviousCorrection || totalCurrentCorrection || totalPreviousFiscal) {
        setFooterData({
          totalPreviousCommercial,
          totalCurrentCommercial,
          totalPreviousCorrection,
          totalCurrentCorrection,
          totalPreviousFiscal,
          totalCurrentFiscal: totalCurrentCorrection + totalCurrentCommercial,
        });
      } else {
        setFooterData(null);
      }
    },
  });

  const footerValues = useMemo(() => (footerData ? {
    description: '',
    prevYearAmountVPC: (<FooterCell value={footerData.totalPreviousCommercial} />),
    prevYearAmountCorrection: (<FooterCell value={footerData.totalPreviousCorrection} />),
    prevYearAmount: (<FooterCell value={footerData.totalPreviousFiscal} />),
    amountVPC: (<FooterCell value={footerData.totalCurrentCommercial} />),
    amountCorrection: (<FooterCell value={footerData.totalCurrentCorrection} />),
    amount: (<FooterCell value={footerData.totalCurrentFiscal} />),
  } : null),
  [footerData]);

  return (
    <CorrectionTableWrapper className="pl-section forecast-section">
      <div className="pl-section__table">
        <DataTable
          className="correction-table"
          columnGroups={columnGroup}
          rowTemplate={rowTemplate}
          rows={values}
          footerValues={footerValues}
          hasFooter={!!footerData}
        />
      </div>
    </CorrectionTableWrapper>
  );
};

ProfitLossCorrectionTable.propTypes = {
  /** values to render with in modal */
  values: PropTypes.array.isRequired,
  /** provide field name prefix for form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** Function which handles close event of the modal. */
  onClose: PropTypes.func.isRequired,
  /** taxable year for dossier */
  taxableYear: PropTypes.number.isRequired,
  /** prop to check form is valid or not */
  isValid: PropTypes.bool.isRequired,
};

/** Exported Enhanced Correction Table Component wrapped with FieldArray HOC */
export default ({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(ProfitLossCorrectionTable);

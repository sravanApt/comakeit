import React, {
  useContext, useState, useEffect, useRef, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { DataTable, FieldArray, Button } from '@visionplanner/ui-react-material';
import { useModal } from '@visionplanner/vp-ui-fiscal-library';
import {
  ActionsCell, DescriptionCell, CurrencyCell,
} from '../../../common/table-cell-templates';
import { useRowTemplate } from '../../../common/custom-hooks/initialize-data-table-row-template/initialize-data-table-row-template';
import { assetsTranslate as translate } from './assets-translate';
import TaxForecastContext from '../tax-forecast-context';
import { SelectWrapper, InputWrapper } from '../../../common/styled-wrapper';
import IncomeSectionHeading from '../income/common/income-section-heading';
import {
  SELECT_PROPS,
  DEFAULT_COUNTRY_ID,
  BANK_ACCOUNT_SECTION_KEY,
} from './assets.constants';
import {
  getOwners,
  getDefaultOwner,
} from '../income-from-business/common/utils';
import { getGuid } from '../../../common/utils';
import { STICKY_CLOUMNS } from '../tax-forecast.constants';

const CURRENT_COLUMN_GROUP = [
  {
    id: 'description',
    label: translate('description-label'),
    className: 'col-description',
  },
  {
    id: 'belongsTo',
    label: translate('belongs-to'),
    className: 'col-belongs',
  },
  {
    id: 'accountNumber',
    label: translate('bank-account-no'),
    className: 'col-account',
  },
  {
    id: 'countryId',
    label: translate('country'),
    className: 'col-country',
  },
  {
    id: 'amount',
    label: translate('value'),
    className: 'col-value text-align-right',
  },
  {
    id: 'actions',
    label: translate('actions'),
    className: 'col-actions',
  },
];

const bankAccountRowTemplate = {
  description: '',
  belongsTo: null,
  accountNumber: '',
  countryId: null,
  amount: '',
};

const investmentsRowTemplate = {
  ...bankAccountRowTemplate,
  groupingId: null,
  netherLandDividend: {
    countryId: null,
    dividend: 0,
    dividendTax: 0,
  },
  otherCountryDividends: [],
};

const selectProps = {
  ...SELECT_PROPS,
  menuPortalTarget: true,
};

/**
 *
 * Data table to display bank or investment accounts / environmental investments  information
 */
const AccountsOrInvestments = ({
  values, sectionKey, fieldNamePrefix, handleRemove, updateTaxCalculation, handleAccountsOrInvestmentsData, arrayHelpers,
}) => {
  const [amountUpdateIndicator, setAmountUpdateIndicator] = useState(0);
  const {
    dossierData: { masterData: { owners } }, countries,
  } = useContext(TaxForecastContext);
  const { showModal } = useModal();

  const ownersOptions = useMemo(() => getOwners(owners), [owners]);
  const updateCountryOrBelongsToValues = (countryId, descriptionValue, rowIndex, belongsToValue, groupingId) => {
    let updateRow = {
      ...values[rowIndex],
      countryId: null,
      description: descriptionValue,
      belongsTo: null,
      ...((sectionKey !== BANK_ACCOUNT_SECTION_KEY) ? {
        groupingId: null,
        netherLandDividend: {
          ...values[rowIndex].netherLandDividend,
          countryId: null,
        },
      } : {}),
    };

    if (descriptionValue) {
      updateRow = {
        ...values[rowIndex],
        countryId: !countryId ? DEFAULT_COUNTRY_ID : countryId,
        description: descriptionValue,
        belongsTo: belongsToValue || getDefaultOwner(ownersOptions),
        ...((sectionKey !== BANK_ACCOUNT_SECTION_KEY) ? {
          groupingId: !groupingId ? getGuid() : groupingId,
          netherLandDividend: {
            ...values[rowIndex].netherLandDividend,
            countryId: 1,
          },
        } : {}),
      };
    }

    arrayHelpers.replace(rowIndex, updateRow);
  };
  const currentRowTemplate = {
    description: ({
      amount, index, countryId, belongsTo, groupingId,
    }) => (
      <DescriptionCell
        name={`${fieldNamePrefix}.${index}.description`}
        customChangeHandler={amount ? () => {
          setAmountUpdateIndicator(amountUpdateIndicator + 1);
        } : (value) => updateCountryOrBelongsToValues(countryId, value, index, belongsTo, groupingId)}
        dataTa={`${sectionKey}-description-${index}`}
      />
    ),
    belongsTo: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.belongsTo`}
        options={getOwners(owners)}
        className="belongs-to"
        disabled={!description}
      />
    ),
    accountNumber: ({ description, index }) => (
      <InputWrapper
        className="text-input"
        type="text"
        width="130px"
        name={`${fieldNamePrefix}.${index}.accountNumber`}
        disabled={!description}
      />
    ),
    countryId: ({ description, index }) => (
      <SelectWrapper
        {...selectProps}
        name={`${fieldNamePrefix}.${index}.countryId`}
        options={countries}
        className="country-select"
        disabled={!description}
      />
    ),
    amount: ({ description, index }) => (
      <CurrencyCell
        name={`${fieldNamePrefix}.${index}.amount`}
        disabled={!description}
        customChangeHandler={() => setAmountUpdateIndicator(amountUpdateIndicator + 1)}
      />
    ),
    actions: ({ description, index }) => (
      <div className={`actions-inline ${sectionKey === BANK_ACCOUNT_SECTION_KEY && 'text-align-center'}`}>
        {
          (sectionKey !== BANK_ACCOUNT_SECTION_KEY) && (
            <Button
              buttonType="secondary"
              dataTa={`${sectionKey}-dividend-${index}`}
              className="mar-r-md"
              disabled={!description}
              onClick={() => {
                const props = {
                  dividendValues: values[index]?.netherLandDividend?.countryId ? values[index] : {
                    ...values[index],
                    netherLandDividend: {
                      ...values[index].netherLandDividend,
                      countryId: 1,
                    },
                  },
                  title: `${translate('dividend')} ${description}`,
                  countries,
                  dataTa: `${sectionKey}-modal`,
                  handleDividendChanges: (data) => handleAccountsOrInvestmentsData && handleAccountsOrInvestmentsData(data, index),
                };
                showModal('dividend-modal', props);
              }}
            >
              {translate('dividend')}
            </Button>
          )
        }
        <ActionsCell
          lastIndex={values.length - 1}
          handleDelete={() => {
            setAmountUpdateIndicator(amountUpdateIndicator + 1);
            arrayHelpers.remove(index);
          }}
          index={index}
          dataTa={`${sectionKey}-row-${index}`}
        />
      </div>
    ),
  };

  const calculationRef = useRef();

  useEffect(() => {
    calculationRef.current = {
      updateTaxCalculation,
    };
  });

  useEffect(() => {
    !!amountUpdateIndicator && calculationRef.current.updateTaxCalculation();
  }, [amountUpdateIndicator]);

  useRowTemplate({
    arrayHelpers,
    rowTemplate: (sectionKey !== BANK_ACCOUNT_SECTION_KEY) ? investmentsRowTemplate : bankAccountRowTemplate,
    values,
  });

  return (
    <IncomeSectionHeading
      heading={translate(sectionKey)}
      handleRemove={handleRemove}
      dataTa={`${sectionKey}-section`}
    >
      <div className="assets-section__table margin-zero">
        <DataTable
          rows={values}
          columnGroups={CURRENT_COLUMN_GROUP}
          rowTemplate={currentRowTemplate}
          className={`${sectionKey}-table`}
          dataTa={`${sectionKey}-table`}
          stickyColumns={STICKY_CLOUMNS}
        />
      </div>
    </IncomeSectionHeading>
  );
};

AccountsOrInvestments.propTypes = {
  /** array of objects which contains bank or investment accounts / environmental investments data */
  values: PropTypes.array.isRequired,
  /** unique key for this accounts or investments table */
  sectionKey: PropTypes.string.isRequired,
  /** field name prefix for the form */
  fieldNamePrefix: PropTypes.string.isRequired,
  /** function to handle remove this section */
  handleRemove: PropTypes.func.isRequired,
  /** callback to update the tax calculation */
  updateTaxCalculation: PropTypes.func.isRequired,
  /** function to handle accounts or investments data */
  handleAccountsOrInvestmentsData: PropTypes.func,
};

/** Exported enhanced component wrapped with FieldArray HOC */
export default (({ values, name, ...restProps }) => FieldArray({ values, name, ...restProps })(AccountsOrInvestments));

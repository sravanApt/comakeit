import React from 'react';
import PropTypes from 'prop-types';
import {
  ColumnLayout,
  Column,
  Form,
  FieldSet,
  CheckboxValueContainer,
  OptionWithCheckbox,
  AutocompleteMenuList,
} from '@visionplanner/ui-react-material';
import { addFilters } from '@visionplanner/vp-ui-fiscal-library';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import FilterButtons from '../../common/monitor-filter-buttons/monitor-filter-buttons';

const defaultFilters = {
  selectedStatus: [],
  selectedDossierType: [],
  selectedPeriod: [],
};

/**
 * Tax Dossier Monitor Filters - Component that contain different filter options for tax dossier.
 *
 */

const IncomeTaxClientFilters = ({
  dossierTypes,
  dossierPeriods,
  dossierStatusTypes,
  onFiltersChange,
  selectedFilters,
}) => (
  <div className="dossier-filters-container" data-ta="dossier-filters-container">
    <Form
      initialValues={selectedFilters}
      onSubmit={onFiltersChange}
      dataTa="tax-dossier-monitor-filters-form"
    >
      {
        () => (
          <ColumnLayout>
            <Column span={6}>
              <FieldSet
                type="selectMultiple"
                controlType="buttongroup"
                name="selectedDossierType"
                label={translate('dossier-type')}
                options={dossierTypes}
                dataTa="dossier-type-filters"
                className="dossier-type-filters"
              />
            </Column>
            <Column span={6}>
              <FieldSet
                type="selectMultiple"
                controlType="buttongroup"
                name="selectedStatus"
                label={translate('status')}
                options={dossierStatusTypes}
                dataTa="status-filters"
                className="status-filters"
              />
            </Column>
            <Column span={6}>
              <FieldSet
                type="selectMultiple"
                label={translate('year')}
                controlType="autocomplete"
                name="selectedPeriod"
                options={dossierPeriods}
                customComponents={{
                  Option: OptionWithCheckbox,
                  ValueContainer: CheckboxValueContainer,
                  MenuList: AutocompleteMenuList,
                }}
                hideSelectedOptions={false}
                selectedLabel="selected"
                closeMenuOnSelect={false}
                className="period-select"
                clearable
              />
            </Column>
            <Column span={12}>
              <FilterButtons
                applyButton={{ label: translate('apply'), dataTa: 'apply-dossier-filters' }}
                clearButton={{ label: translate('clear-all'), dataTa: 'clear-dossier-filters', handleClear: () => onFiltersChange(defaultFilters) }}
              />
            </Column>
          </ColumnLayout>
        )
      }
    </Form>
  </div>
);

IncomeTaxClientFilters.propTypes = {
  /** dossier type options */
  dossierTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }).isRequired,
  ).isRequired,
  /** taxation year options */
  dossierPeriods: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }).isRequired,
  ).isRequired,
  /** dossier status types */
  dossierStatusTypes: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }).isRequired,
  ).isRequired,
  /** function which handles filters apply or clear */
  onFiltersChange: PropTypes.func.isRequired,
  /** selected Filters object. Used to display selected status */
  selectedFilters: PropTypes.object.isRequired,
};

export default addFilters(IncomeTaxClientFilters, defaultFilters);

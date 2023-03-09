import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@visionplanner/ui-react-material';
import {
  SearchInput,
  useModal,
  useDataSource,
} from '@visionplanner/vp-ui-fiscal-library';
import { incomeTaxClientTranslate as translate } from './income-tax-client-translate';
import { ActionsSectionWrapper } from '../../common/styled-wrapper';
import TaxableSubjectContext from './taxable-subject-context';
import * as requests from './income-tax-client.request';
import IncomeTaxClientFilters from './income-tax-client-filters';
import { formatMasterData } from '../../common/utils';

/**
 * Income Tax Client Dossier Monitor Actions - Component that can handle search, filter operations of tax dossiers.
 *
 */
const IncomeTaxClientActionSection = ({
  globalAdviserId, globalClientId, handleSearch, handleFilters, handleOnDossierSave,
}) => {
  const fetchTaxationYears = useCallback(() => requests.getDossierYears(globalClientId), [globalClientId]);
  const [taxationYears] = useDataSource(fetchTaxationYears);
  const [filterOptions] = useDataSource(requests.getDossierMasterData);

  const { showModal } = useModal();
  const dossierTypes = useMemo(() => filterOptions && formatMasterData(filterOptions.declarationTypes), [filterOptions]);
  const dossierStatusTypes = useMemo(() => filterOptions && formatMasterData(filterOptions.declarationStatus), [filterOptions]);
  const dossierPeriods = useMemo(() => taxationYears && formatMasterData(taxationYears), [taxationYears]);
  const { taxableSubjectData } = useContext(TaxableSubjectContext);

  return (
    <ActionsSectionWrapper data-ta="tax-dossier-action-section">
      <SearchInput
        className="mar-r-xs"
        placeholder={translate('search')}
        dataTa="search-dossiers"
        onChange={handleSearch}
        name="dossierName"
      />
      { (dossierTypes && dossierStatusTypes && dossierPeriods) && (
        <IncomeTaxClientFilters
          dossierTypes={dossierTypes}
          dossierPeriods={dossierPeriods}
          dossierStatusTypes={dossierStatusTypes}
          onFiltersChange={handleFilters}
          iconName="filter"
        />
      )}
      <Button
        dataTa="add-dossier-button"
        className="add-dossier-button mar-l-xs"
        onClick={
          () => showModal('add-tax-dossier', { globalAdviserId, taxableSubjectData, handleOnDossierSave })
        }
      >
        {`+ ${translate('dossier')}`}
      </Button>
    </ActionsSectionWrapper>
  );
};

IncomeTaxClientActionSection.propTypes = {
  /** Function which is used to search the dossiers */
  handleSearch: PropTypes.func.isRequired,
  /** Function which is used to handle filter operation on the dossiers */
  handleFilters: PropTypes.func.isRequired,
};

export default IncomeTaxClientActionSection;

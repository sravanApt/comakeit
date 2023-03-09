import React, { useContext, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TabBar } from '@visionplanner/ui-react-material';
import TaxForecastHeading from '../../tax-forecast-heading';
import TaxForecastContext from '../../tax-forecast-context';

const IncomeFromBusinessHeading = ({ heading, resetErrors, displayJointTab, location }) => {
  const {
    activeTab, setActiveTab, tabOptions,
  } = useContext(TaxForecastContext);

  const updateActiveTab = useCallback((tabIndex) => {
    setActiveTab(tabIndex);
    resetErrors && resetErrors();
  }, [resetErrors, setActiveTab]);

  const tabsList = useMemo(() => (!displayJointTab ? tabOptions : [{ label: tabOptions.map(((value) => value.label)).join(' & ') }]), [displayJointTab]);

  return (
    <>
      <div className="flex-1">
        <TaxForecastHeading
          heading={heading}
          location={location}
        />
        <div className="tabs-list">
          <TabBar
            activeTabIndex={activeTab}
            onActivate={updateActiveTab}
            tabsList={tabsList}
            dataTa="income-from-business-common-tabs"
          />
        </div>
      </div>
    </>
  );
};

IncomeFromBusinessHeading.defaultProps = {
  displayJointTab: false,
};

IncomeFromBusinessHeading.propTypes = {
  /** provide heading for tax forecast component */
  heading: PropTypes.string.isRequired,
  /** function that reset errors if required */
  resetErrors: PropTypes.func,
  /** prop to display joint tab */
  displayJointTab: PropTypes.bool,
};

export default IncomeFromBusinessHeading;

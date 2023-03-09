import React from 'react';
import { Switch } from 'react-router-dom';
import { AuthorizedRoute } from '@visionplanner/vp-ui-fiscal-library';
import TaxForecast from '../component/tax-forecast/tax-forecast';
import IncomeTaxClientContainer from '../component/income-tax-client/income-tax-client-container';

/**
 * Routing to switch between different pages.
 *
 */

export const Routes = () => (
  <Switch>
    <AuthorizedRoute requireUserProfile path="/taxable-subject/:globalClientId/dossiers" component={IncomeTaxClientContainer} />
    <AuthorizedRoute requireUserProfile path="/:globalClientId/forecast/:declarationId" component={TaxForecast} />
  </Switch>
);

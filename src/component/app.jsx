import React from 'react';
import { ApplicationContainer } from '@visionplanner/vp-ui-fiscal-library';
import { Routes } from '../config/routes.jsx';
import modalsList from '../common/modals/modals-list';
import { GlobalStyle } from '../global-styles/index';
import 'moment/locale/nl';

const App = () => (
  <ApplicationContainer
    modalsList={modalsList}
    baseRoute="/itx"
  >
    <GlobalStyle />
    <Routes />
  </ApplicationContainer>
);

export default App;

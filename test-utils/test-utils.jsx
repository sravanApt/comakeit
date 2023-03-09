/** Wrapping VPThemeProvider to every component when doing unit-testing.
 * This will make the theme object available to every component when testing styled-components.
 * */
import React from 'react';
import { Router } from 'react-router-dom';
import { render, queryByAttribute } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { ProvidersContainer, ModalContainer } from '@visionplanner/vp-ui-fiscal-library';
import modalsList from '../src/common/modals/modals-list';

const createWrapper = ({ history }) => ({ children }) => (
  <Router history={history}>
    <ProvidersContainer>
      <ModalContainer modalsList={modalsList}>
        {children}
      </ModalContainer>
    </ProvidersContainer>
  </Router>
);

const customRender = (ui, options = {}) => {
  const {
    initialRoute = '/',
    historyListener,
    ...otherOptions
  } = options;
  const history = createMemoryHistory({
    initialEntries: [initialRoute],
    initialIndex: 0, // The starting index in the history stack
  });
  if (historyListener) {
    history.listen(historyListener);
  }
  return render(ui, { wrapper: createWrapper({ history }), ...otherOptions });
};

/** This can be used for selecting inputs, textarea and single checkbox, radio and switch by name attribute */
export const getByNameAttribute = queryByAttribute.bind(null, 'name');

/** This can be used for selecting checkbox, switch and radio group by value attribute */
export const getByValueAttribute = queryByAttribute.bind(null, 'value');

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };

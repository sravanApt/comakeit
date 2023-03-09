import './component/set-public-path.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './component/app';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: () => <App />,
  domElementGetter: () => document.getElementById('application-container'),
});
export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;

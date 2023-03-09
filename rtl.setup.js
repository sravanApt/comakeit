import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'mutationobserver-shim';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, configure } from 'test-utils';
import { ApiClient, CommonApiClient, VPDApiClient } from './src/config/api-client';

afterEach(cleanup);

beforeEach(() => {
  ApiClient.setBaseUrl('');
  CommonApiClient.setBaseUrl('');
  VPDApiClient.setBaseUrl('');
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');
const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');

beforeEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 200 });
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 700 });
});

afterEach(() => {
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth);
});

configure({ testIdAttribute: 'data-ta' });

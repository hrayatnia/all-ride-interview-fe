// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure testing library
configure({
  testIdAttribute: 'data-testid',
});

// Mock window.matchMedia for Ant Design components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  REACT_APP_API_BASE_URL: 'http://localhost:3001/api',
  REACT_APP_TITLE: 'All Ride User Management (Test)',
  REACT_APP_VERSION: '1.0.0',
  REACT_APP_ENABLE_MOCK_API: 'true',
  REACT_APP_ENABLE_DEBUG_MODE: 'true',
};

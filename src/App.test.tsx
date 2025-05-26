import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { render } from './test-utils';
import App from './App';

describe('App Component', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Mock the environment variables
    process.env = {
      ...originalEnv,
      REACT_APP_TITLE: 'All Ride User Management (Test)',
      REACT_APP_VERSION: '1.0.0',
      REACT_APP_ENABLE_MOCK_API: 'true',
      REACT_APP_ENABLE_DEBUG_MODE: 'true',
    };
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
  });

  it('renders without crashing', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('app-container')).toBeInTheDocument();
    });
  });

  it('renders the main navigation elements', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
    });
  });

  it('displays the correct title from environment variables', async () => {
    render(<App />);
    await waitFor(() => {
      const titleElement = screen.getByTestId('app-title');
      expect(titleElement).toHaveTextContent('All Ride User Management (Test)');
    });
  });
});

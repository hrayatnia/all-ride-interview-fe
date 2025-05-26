import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../../store/userSlice';
import { UserImport } from './UserImport';
import { mockUserApi } from '../../services/mockApi';
import { User } from '../../types/user';

// Mock the API calls
jest.mock('../../services/mockApi', () => ({
  mockUserApi: {
    validateUsers: jest.fn(),
    importUsers: jest.fn(),
  },
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      users: userReducer,
    },
  });
};

const renderWithProvider = (component: React.ReactElement) => {
  const store = createMockStore();
  return {
    ...render(
      <Provider store={store}>
        {component}
      </Provider>
    ),
    store,
  };
};

describe('UserImport', () => {
  const validCsvContent = 'firstName,lastName,email,phoneNumber,address,birthDate,status\nJohn,Doe,john@example.com,+1234567890,123 Main St,1990-01-01,active';
  const invalidCsvContent = 'firstName,lastName,email,phoneNumber,address,birthDate,status\nJohn,,invalid-email,123,123 Main St,invalid-date,invalid';

  beforeEach(() => {
    jest.clearAllMocks();
    (mockUserApi.validateUsers as jest.Mock).mockImplementation(async (users: User[]) => ({
      successful: users,
      failed: [],
      totalProcessed: users.length,
    }));
    (mockUserApi.importUsers as jest.Mock).mockImplementation(async (users: User[]) => ({
      successful: users.map(user => ({ ...user, id: '123' })),
      failed: [],
      totalProcessed: users.length,
    }));
  });

  it('renders the initial upload state', () => {
    renderWithProvider(<UserImport />);
    expect(screen.getByText('Bulk User Import')).toBeInTheDocument();
    expect(screen.getByText('Click or drag file to this area to upload')).toBeInTheDocument();
  });

  it('handles valid CSV file upload and shows validation step', async () => {
    renderWithProvider(<UserImport />);
    
    const file = new File([validCsvContent], 'users.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-input-control');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByTestId('validate-button')).toBeInTheDocument();
    });
  });

  it('handles validation step and shows results for valid data', async () => {
    renderWithProvider(<UserImport />);
    
    const file = new File([validCsvContent], 'users.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-input-control');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByTestId('validate-button');
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(mockUserApi.validateUsers).toHaveBeenCalled();
    });
  });

  it('shows validation errors for invalid CSV data', async () => {
    (mockUserApi.validateUsers as jest.Mock).mockImplementation(async () => ({
      successful: [],
      failed: [{ row: 1, errors: ['Invalid email'] }],
      totalProcessed: 1,
    }));

    renderWithProvider(<UserImport />);
    
    const file = new File([invalidCsvContent], 'users.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-input-control');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByTestId('validate-button');
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(mockUserApi.validateUsers).toHaveBeenCalled();
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  it('completes the import process for valid data', async () => {
    (mockUserApi.validateUsers as jest.Mock).mockImplementation(async () => ({
      successful: [{ firstName: 'John', lastName: 'Doe', email: 'john@example.com' }],
      failed: [],
      totalProcessed: 1,
    }));

    renderWithProvider(<UserImport />);
    
    const file = new File([validCsvContent], 'users.csv', { type: 'text/csv' });
    const fileInput = screen.getByTestId('file-input-control');
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      const validateButton = screen.getByTestId('validate-button');
      fireEvent.click(validateButton);
    });

    await waitFor(() => {
      expect(mockUserApi.validateUsers).toHaveBeenCalled();
      expect(screen.getByTestId('import-button')).toBeInTheDocument();
    });
  });
}); 
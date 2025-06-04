import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { UserImport } from './UserImport';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { User, ImportResult } from '../../types/user';

// Mock the hooks and actions
jest.mock('../../hooks/useAppDispatch');

const mockStore = configureStore({
  reducer: {
    users: (state = {
      importResult: null,
      isLoading: false,
      error: null,
      validationResult: null,
    }, action) => {
      switch (action.type) {
        case 'users/validate/fulfilled':
          return {
            ...state,
            validationResult: action.payload,
            isLoading: false,
          };
        case 'users/import/fulfilled':
          return {
            ...state,
            importResult: action.payload,
            isLoading: false,
          };
        default:
          return state;
      }
    },
  },
});

const mockDispatch = jest.fn();

describe('UserImport', () => {
  const mockUsers: User[] = [
    { 
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phoneNumber: '1234567890',
      status: 'active'
    },
    { 
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phoneNumber: '0987654321',
      status: 'inactive'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  const renderWithStore = (component: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        {component}
      </Provider>
    );
  };

  const simulateFileUpload = async () => {
    const csvContent = 'firstName,lastName,email,phoneNumber,status\n' +
      'John,Doe,john@example.com,1234567890,active\n' +
      'Jane,Smith,jane@example.com,0987654321,inactive';

    const file = new File([csvContent], 'users.csv', { type: 'text/csv' });
    const fileUpload = screen.getByTestId('user-import-file-upload-control');
    const uploadInput = fileUpload.querySelector('input[type="file"]') as HTMLInputElement;
    
    fireEvent.change(uploadInput, {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(screen.getByTestId('validate-button')).toBeInTheDocument();
    });
  };

  const completeValidation = async () => {
    const validationResult: ImportResult = {
      successful: mockUsers,
      failed: [],
      totalProcessed: mockUsers.length,
    };

    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve(validationResult),
      type: 'users/validate/fulfilled',
      payload: validationResult,
    }));

    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);

    await waitFor(() => {
      expect(screen.getByTestId('import-button')).toBeInTheDocument();
    }, { timeout: 3000 });
  };

  const completeImport = async (result: { successful: User[], failed: { row: number, errors: string[] }[] }) => {
    const importResult: ImportResult = {
      ...result,
      totalProcessed: result.successful.length + result.failed.length,
    };

    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve(importResult),
      type: 'users/import/fulfilled',
      payload: importResult,
    }));

    const importButton = screen.getByTestId('import-button');
    fireEvent.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(/Import Complete/i)).toBeInTheDocument();
    });
  };

  it('displays successfully imported users in a table', async () => {
    renderWithStore(<UserImport />);
    await simulateFileUpload();
    await completeValidation();
    await completeImport({ successful: mockUsers, failed: [] });

    // Verify success message
    expect(screen.getByText('Successfully Imported Users (2)')).toBeInTheDocument();
    
    // Verify table content
    const importedTable = screen.getByTestId('imported-users-table');
    expect(importedTable).toBeInTheDocument();
    
    // Check for all user data in the table
    mockUsers.forEach(user => {
      expect(screen.getAllByText(user.firstName)[0]).toBeInTheDocument();
      expect(screen.getAllByText(user.lastName)[0]).toBeInTheDocument();
      expect(screen.getAllByText(user.email)[0]).toBeInTheDocument();
      expect(screen.getAllByText(user.phoneNumber!)[0]).toBeInTheDocument();
    });

    // Verify table structure
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  it('shows both successful and failed records when partial import', async () => {
    const successfulUser = mockUsers[0];
    const failedImport = { row: 2, errors: ['Invalid email format'] };

    renderWithStore(<UserImport />);
    await simulateFileUpload();
    await completeValidation();
    await completeImport({
      successful: [successfulUser],
      failed: [failedImport]
    });

    // Verify successful imports section
    expect(screen.getByText('Successfully Imported Users (1)')).toBeInTheDocument();
    expect(screen.getByTestId('imported-users-table')).toBeInTheDocument();
    expect(screen.getAllByText(successfulUser.email)[0]).toBeInTheDocument();

    // Verify failed records section
    expect(screen.getByText('Failed Records (1)')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes(failedImport.errors[0]))).toBeInTheDocument();
  });

  it('handles empty successful imports', async () => {
    const failedImports = [
      { row: 1, errors: ['Invalid email'] },
      { row: 2, errors: ['Missing required field'] }
    ];

    renderWithStore(<UserImport />);
    await simulateFileUpload();
    await completeValidation();
    await completeImport({
      successful: [],
      failed: failedImports
    });

    // Verify no success table is shown
    expect(screen.queryByText(/Successfully Imported Users/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('imported-users-table')).not.toBeInTheDocument();

    // Verify failed records are shown
    expect(screen.getByText('Failed Records (2)')).toBeInTheDocument();
    failedImports.forEach(failure => {
      expect(screen.getByText((content) => content.includes(failure.errors[0]))).toBeInTheDocument();
    });
  });

  it('handles empty failed imports', async () => {
    renderWithStore(<UserImport />);
    await simulateFileUpload();
    await completeValidation();
    await completeImport({
      successful: mockUsers,
      failed: []
    });

    // Verify success table is shown
    expect(screen.getByText('Successfully Imported Users (2)')).toBeInTheDocument();
    expect(screen.getByTestId('imported-users-table')).toBeInTheDocument();

    // Verify no failed records section
    expect(screen.queryByText(/Failed Records/)).not.toBeInTheDocument();
  });

  it('maintains table functionality after import', async () => {
    renderWithStore(<UserImport />);
    await simulateFileUpload();
    await completeValidation();
    await completeImport({
      successful: mockUsers,
      failed: []
    });

    // Verify pagination
    expect(screen.getByText(/1-2 of 2 users/i)).toBeInTheDocument();

    // Verify column headers for sorting
    const headers = ['First Name', 'Last Name', 'Email', 'Phone'];
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });
  });
});
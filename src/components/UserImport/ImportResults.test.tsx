import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImportResults } from './ImportResults';
import { ImportResult } from '../../types/user';

describe('ImportResults', () => {
  const mockResult: ImportResult = {
    successful: [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        address: '123 Main St',
        birthDate: '1990-01-01',
        status: 'active',
      },
    ],
    failed: [
      {
        row: 2,
        errors: ['Invalid email format', 'Missing last name'],
      },
    ],
    totalProcessed: 2,
  };

  it('renders successful and failed counts', () => {
    render(<ImportResults result={mockResult} />);
    
    expect(screen.getByText(/Successfully imported 1 users/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to import 1 users/i)).toBeInTheDocument();
    expect(screen.getByText(/Processed 2 users/i)).toBeInTheDocument();
  });

  it('displays error details for failed records', () => {
    render(<ImportResults result={mockResult} />);
    
    const failedTable = screen.getByTestId('failed-users-table');
    expect(failedTable).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Missing last name')).toBeInTheDocument();
  });

  it('handles results with no failures', () => {
    const successOnlyResult: ImportResult = {
      successful: mockResult.successful,
      failed: [],
      totalProcessed: 1,
    };

    render(<ImportResults result={successOnlyResult} />);
    
    expect(screen.getByText(/Successfully imported 1 users/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to import 0 users/i)).toBeInTheDocument();
    expect(screen.queryByTestId('failed-users-table')).not.toBeInTheDocument();
  });

  it('handles results with no successes', () => {
    const failureOnlyResult: ImportResult = {
      successful: [],
      failed: mockResult.failed,
      totalProcessed: 1,
    };

    render(<ImportResults result={failureOnlyResult} />);
    
    expect(screen.getByText(/Successfully imported 0 users/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to import 1 users/i)).toBeInTheDocument();
    expect(screen.getByTestId('failed-users-table')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });
}); 
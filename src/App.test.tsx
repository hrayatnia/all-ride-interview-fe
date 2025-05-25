import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from './App';

jest.mock('./logo.svg', () => 'logo.svg');

describe('AppRoutes', () => {
  test('renders Home page at route "/"', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();

    // Handle nested <code> inside <p>
    expect(
      screen.getByText((content, element) =>
        element?.textContent === 'Edit src/App.tsx and save to reload.'
      )
    ).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Learn React/i })).toHaveAttribute('href', 'https://reactjs.org');
  });
});

import React, { ReactElement } from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userReducer, { UserState } from './store/userSlice';

export interface RootState {
  users: UserState;
}

const defaultInitialState: RootState = {
  users: {
    isLoading: false,
    error: null,
    validationResult: null,
    importResult: null,
  },
};

interface CustomRenderOptions {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore<RootState>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow other RTL renderOptions
}

function render(
  ui: ReactElement,
  {
    preloadedState = defaultInitialState,
    store = configureStore({
      reducer: {
        users: userReducer,
      },
      preloadedState: preloadedState as RootState,
    }),
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult & { store: EnhancedStore<RootState> } {
  function Wrapper({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }
  const rtlRenderObject = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return {
    ...rtlRenderObject,
    store,
  };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { render }; 
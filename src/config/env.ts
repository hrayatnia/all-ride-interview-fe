export const config = {
  // API Configuration
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',

  // Application Configuration
  appTitle: process.env.REACT_APP_TITLE || 'All Ride User Management',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',

  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Feature Flags
  enableMockApi: process.env.REACT_APP_ENABLE_MOCK_API === 'true',
  enableDebugMode: process.env.REACT_APP_ENABLE_DEBUG_MODE === 'true',
}; 
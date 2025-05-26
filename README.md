# All Ride User Management

A React application for managing user imports in bulk.

## Environment Variables

The application uses different environment files for configuration:

- `.env`: Default environment variables
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables
- `.env.local`: Local overrides (not committed to git)
- `.env.*.local`: Environment-specific local overrides

### Available Variables

```bash
# Node Environment (development, production, test)
NODE_ENV=development

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:3001/api

# Application Configuration
REACT_APP_TITLE=All Ride User Management
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_MOCK_API=false
REACT_APP_ENABLE_DEBUG_MODE=false
```

### Setting Up Environment Variables

1. Copy `.env.example` to create your environment file:
   ```bash
   cp .env.example .env
   ```

2. Modify the values in your `.env` file as needed

3. For environment-specific settings:
   - Development: Create `.env.development`
   - Production: Create `.env.production`
   - Local overrides: Create `.env.local`

Note: Files ending in `.local` are not committed to git.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Features

- Bulk user import from CSV files
- Data validation
- Error handling
- Progress tracking
- Import results display

## Tech Stack

- React
- TypeScript
- Redux Toolkit
- Ant Design
- Webpack
- Jest

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

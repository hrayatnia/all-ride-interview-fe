#!/bin/bash

# Create new directory structure
mkdir -p src/app
mkdir -p src/features/fileUpload/{components,hooks,services}
mkdir -p src/shared/{components,hooks,utils,constants,types}
mkdir -p src/assets
mkdir -p src/styles

# Move and rename main files
mv src/index.tsx src/app/main.tsx
mv src/App.tsx src/app/App.tsx

# Create new files
touch src/app/routes.tsx
touch src/features/fileUpload/components/FileUploadForm.tsx
touch src/features/fileUpload/hooks/useFileUpload.ts
touch src/features/fileUpload/services/uploadService.ts
touch src/features/fileUpload/index.ts

# Move assets
mkdir -p src/assets/images
mv src/logo.svg src/assets/images/

# Move CSS files to styles
mv src/App.css src/styles/
mv src/index.css src/styles/

# Create config files if they don't exist
touch .prettierrc

# Clean up unnecessary files (comment these out if you want to keep them)
# rm src/App.test.tsx
# rm src/setupTests.ts
# rm src/reportWebVitals.ts
# rm src/react-app-env.d.ts

# Create basic content for new files
echo "export { default as FileUploadForm } from './components/FileUploadForm';" > src/features/fileUpload/index.ts

# Update entry point
echo "import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './app/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);" > src/index.tsx
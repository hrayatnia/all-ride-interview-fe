import React from 'react';
import { ErrorPage } from './ErrorPage';

export const Forbidden: React.FC = () => (
  <ErrorPage
    status={403}
    title="403 - Forbidden"
    subTitle="Sorry, you are not authorized to access this page."
  />
); 
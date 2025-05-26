import React from 'react';
import { ErrorPage } from './ErrorPage';

export const NotFound: React.FC = () => (
  <ErrorPage
    status={404}
    title="404 - Page Not Found"
    subTitle="Sorry, the page you visited does not exist."
  />
); 
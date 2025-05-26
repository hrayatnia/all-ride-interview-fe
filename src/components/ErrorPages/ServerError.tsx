import React from 'react';
import { ErrorPage } from './ErrorPage';

export const ServerError: React.FC = () => (
  <ErrorPage
    status={500}
    title="500 - Server Error"
    subTitle="Sorry, something went wrong on our server."
  />
); 
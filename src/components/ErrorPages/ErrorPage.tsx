import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  status: 403 | 404 | 500 | '403' | '404' | '500';
  title: string;
  subTitle: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ status, title, subTitle }) => {
  const navigate = useNavigate();

  return (
    <Result
      status={status}
      title={title}
      subTitle={subTitle}
      extra={[
        <Button type="primary" key="home" onClick={() => navigate('/')}>
          Back Home
        </Button>,
        <Button key="back" onClick={() => navigate(-1)}>
          Go Back
        </Button>,
      ]}
    />
  );
}; 
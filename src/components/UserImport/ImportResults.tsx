import React from 'react';
import { Table, Typography, Alert, Space } from 'antd';
import { ImportResult, User, UserImportError } from '../../types/user';

const { Title } = Typography;

interface ImportResultsProps {
  result: ImportResult;
}

export const ImportResults: React.FC<ImportResultsProps> = ({ result }) => {
  const successColumns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const errorColumns = [
    {
      title: 'Row',
      dataIndex: 'row',
      key: 'row',
    },
    {
      title: 'Errors',
      dataIndex: 'errors',
      key: 'errors',
      render: (errors: string[]) => (
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div data-testid="import-results">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Alert
          message={`Processed ${result.totalProcessed} users`}
          description={`Successfully imported ${result.successful.length} users, failed to import ${result.failed.length} users.`}
          type={result.failed.length === 0 ? 'success' : 'warning'}
          showIcon
        />

        {result.successful.length > 0 && (
          <>
            <Title level={4}>Successfully Imported Users</Title>
            <Table<User>
              dataSource={result.successful}
              columns={successColumns}
              rowKey={(record) => record.email}
              data-testid="successful-users-table"
            />
          </>
        )}

        {result.failed.length > 0 && (
          <>
            <Title level={4}>Failed Imports</Title>
            <Table<UserImportError>
              dataSource={result.failed}
              columns={errorColumns}
              rowKey={(record) => record.row.toString()}
              data-testid="failed-users-table"
            />
          </>
        )}
      </Space>
    </div>
  );
}; 
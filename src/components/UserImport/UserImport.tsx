import React, { useState } from 'react';
import { Card, Typography, Button, Space, Input, Alert, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { StepProps } from 'antd';
import { UploadOutlined, CheckCircleOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { validateUsers, importUsers } from '../../store/userSlice';
import { User, ImportResult } from '../../types/user';
import { ImportResults } from './ImportResults';
import { logger } from '../../utils/logger';
import { FileUpload } from '../FileUpload/FileUpload';
import { StepProgress } from '../StepProgress/StepProgress';
import { validateUserData } from '../../utils/validation';

const { Title } = Typography;
const { Search } = Input;

interface CustomStep extends StepProps {
  key: string;
  status?: 'wait' | 'process' | 'finish' | 'error';
}

const steps: CustomStep[] = [
  {
    key: 'upload',
    title: 'Upload',
    icon: <UploadOutlined />,
  },
  {
    key: 'validate',
    title: 'Validate',
    icon: <CheckCircleOutlined />,
    status: 'process',
  },
  {
    key: 'import',
    title: 'Import',
    icon: <CheckCircleOutlined />,
  },
];

const columns: ColumnsType<User> = [
  {
    title: 'First Name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a: User, b: User) => (a.firstName || '').localeCompare(b.firstName || ''),
  },
  {
    title: 'Last Name',
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: (a: User, b: User) => (a.lastName || '').localeCompare(b.lastName || ''),
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a: User, b: User) => (a.email || '').localeCompare(b.email || ''),
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
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
    ],
    onFilter: (value, record: User) => record.status === value,
  },
];

interface UserWithKey extends User {
  key: string;
}

export const UserImport: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedUsers, setParsedUsers] = useState<UserWithKey[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithKey[]>([]);
  const [validationResult, setValidationResult] = useState<ImportResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const dispatch = useAppDispatch();

  const handleFileProcessed = (data: User[]) => {
    const usersWithKeys = data.map((user, index) => ({
      ...user,
      key: index.toString(),
    }));
    setParsedUsers(usersWithKeys);
    setFilteredUsers(usersWithKeys);
    setSelectedRowKeys(usersWithKeys.map(user => user.key));
    setCurrentStep(1);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setFilteredUsers(parsedUsers);
      setSelectedRowKeys(parsedUsers.map(user => user.key));
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = parsedUsers.filter(user => 
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
    setFilteredUsers(filtered);
    setSelectedRowKeys(filtered.map(user => user.key));
  };

  const handleValidate = async () => {
    const selectedUsers = filteredUsers.filter(user => selectedRowKeys.includes(user.key));
    logger.info('Starting validation', { userCount: selectedUsers.length });
    setIsProcessing(true);
    try {
      const result = await dispatch(validateUsers(selectedUsers)).unwrap();
      logger.info('Validation completed', { result });
      setValidationResult(result);
      if (result.failed.length === 0) {
        setCurrentStep(2);
      }
    } catch (error) {
      logger.error('Validation failed', { error });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    const selectedUsers = filteredUsers.filter(user => selectedRowKeys.includes(user.key));
    logger.info('Starting import', { userCount: selectedUsers.length });
    setIsProcessing(true);
    try {
      const result = await dispatch(importUsers(selectedUsers)).unwrap();
      logger.info('Import completed', { result });
      setImportResult(result);
      steps[1].status = 'finish';
    } catch (error) {
      logger.error('Import failed', { error });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setParsedUsers([]);
    setFilteredUsers([]);
    setValidationResult(null);
    setImportResult(null);
    setSearchTerm('');
    setCurrentStep(0);
    setIsProcessing(false);
    setSelectedRowKeys([]);
  };

  const handleCancel = () => {
    if (isProcessing) {
      logger.info('Operation cancelled by user');
      setIsProcessing(false);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Card data-testid="user-import">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3}>Bulk User Import</Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleStartOver}
            data-testid="start-over-button"
          >
            Start Over
          </Button>
        </div>

        <StepProgress
          steps={steps}
          current={currentStep}
          data-testid="user-import-steps"
        />

        {currentStep === 0 && (
          <FileUpload<User>
            onFileProcessed={handleFileProcessed}
            validateRow={validateUserData}
            accept=".csv"
            data-testid="user-import-file-upload"
          />
        )}

        {currentStep > 0 && !importResult && (
          <>
            <Search
              placeholder="Search by name or email"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              data-testid="user-search"
            />

            <Alert
              message={`${selectedRowKeys.length} of ${parsedUsers.length} users selected${searchTerm ? ' (filtered)' : ''}`}
              type="info"
              showIcon
            />

            <Table
              dataSource={filteredUsers}
              columns={columns}
              rowSelection={rowSelection}
              size="middle"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
              }}
              data-testid="users-table"
            />
          </>
        )}

        {currentStep === 1 && !importResult && (
          <div>
            <Space>
              <Button
                type="primary"
                onClick={handleValidate}
                loading={isProcessing}
                disabled={selectedRowKeys.length === 0}
                data-testid="validate-button"
              >
                Validate Users
              </Button>
              {isProcessing && (
                <Button onClick={handleCancel} data-testid="cancel-button">
                  Cancel
                </Button>
              )}
            </Space>
            {validationResult && <ImportResults result={validationResult} />}
          </div>
        )}

        {(currentStep === 2 || importResult) && (
          <div>
            {!importResult && (
              <Space>
                <Button
                  type="primary"
                  onClick={handleImport}
                  loading={isProcessing}
                  disabled={selectedRowKeys.length === 0}
                  data-testid="import-button"
                >
                  Import Users
                </Button>
                {isProcessing && (
                  <Button onClick={handleCancel} data-testid="cancel-button">
                    Cancel
                  </Button>
                )}
              </Space>
            )}
            
            {importResult && (
              <div data-testid="import-results">
                <Alert
                  message="Import Complete"
                  description={
                    <div>
                      <Typography.Text>
                        Total records processed: {importResult.totalProcessed}
                      </Typography.Text>
                      <br />
                      <Typography.Text type="success">
                        Successfully imported: {importResult.successful.length}
                      </Typography.Text>
                      {importResult.failed.length > 0 && (
                        <>
                          <br />
                          <Typography.Text type="danger">
                            Failed records: {importResult.failed.length}
                          </Typography.Text>
                        </>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <Typography.Text type="secondary">
                          Click "Start Over" to begin a new import.
                        </Typography.Text>
                      </div>
                    </div>
                  }
                  type="success"
                  showIcon
                  style={{ marginBottom: 16 }}
                />

                {importResult.successful.length > 0 && (
                  <Card 
                    title={`Successfully Imported Users (${importResult.successful.length})`}
                    style={{ marginBottom: 16 }}
                  >
                    <Table
                      dataSource={importResult.successful.map((user, index) => ({
                        ...user,
                        key: index.toString()
                      }))}
                      columns={columns.filter(col => col.key !== 'status')}
                      size="middle"
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
                      }}
                      data-testid="imported-users-table"
                    />
                  </Card>
                )}

                {importResult.failed.length > 0 && (
                  <Card 
                    title={`Failed Records (${importResult.failed.length})`}
                    type="inner"
                  >
                    <ImportResults result={importResult} showSummary={false} />
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </Space>
    </Card>
  );
}; 
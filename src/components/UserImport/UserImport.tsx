import React, { useState } from 'react';
import { Upload, message, Card, Typography, Steps, Button, Space } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { InboxOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { validateUsers, importUsers } from '../../store/userSlice';
import Papa from 'papaparse';
import { User, ImportResult } from '../../types/user';
import { ImportResults } from './ImportResults';
import { logger, LogData } from '../../utils/logger';

const { Dragger } = Upload;
const { Title } = Typography;

const steps = [
  {
    title: 'Upload',
    icon: <UploadOutlined />,
  },
  {
    title: 'Validate',
    icon: <CheckCircleOutlined />,
  },
  {
    title: 'Import',
    icon: <CheckCircleOutlined />,
  },
];

interface CustomRequestInterface {
  file: RcFile | string | Blob;
  onSuccess?: (body: unknown, xhr?: XMLHttpRequest) => void;
  onError?: (error: Error, body?: unknown) => void;
  onProgress?: (event: { percent: number }) => void;
}

export const UserImport: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [parsedUsers, setParsedUsers] = useState<User[]>([]);
  const [validationResult, setValidationResult] = useState<ImportResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const dispatch = useAppDispatch();

  const handleValidate = async () => {
    logger.info('Starting validation', { userCount: parsedUsers.length });
    try {
      const result = await dispatch(validateUsers(parsedUsers)).unwrap();
      logger.info('Validation completed', { result });
      setValidationResult(result);
      if (result.failed.length === 0) {
        message.success('Validation successful!');
        setCurrentStep(2);
      } else {
        message.warning('Some users failed validation. Please check the results.');
        logger.warn('Validation found errors', { failedCount: result.failed.length });
      }
    } catch (error) {
      logger.error('Validation failed', { error: error as LogData });
      message.error('Failed to validate users');
    }
  };

  const handleImport = async () => {
    logger.info('Starting import', { userCount: parsedUsers.length });
    try {
      const result = await dispatch(importUsers(parsedUsers)).unwrap();
      logger.info('Import completed', { result });
      setImportResult(result);
      if (result.failed.length === 0) {
        message.success('All users imported successfully!');
      } else {
        message.warning('Some users failed to import. Please check the results.');
        logger.warn('Import found errors', { failedCount: result.failed.length });
      }
    } catch (error) {
      logger.error('Import failed', { error: error as LogData });
      message.error('Failed to import users');
    }
  };

  const props = {
    name: 'file',
    multiple: false,
    accept: '.csv',
    showUploadList: false,
    'data-testid': 'file-input',
    customRequest: async ({ file, onSuccess, onError }: CustomRequestInterface) => {
      try {
        logger.info('Starting file upload process');
        const actualFile = file as RcFile;
        if (actualFile.type !== 'text/csv') {
          const error = new Error('Please upload a CSV file');
          logger.error('Invalid file type', { type: actualFile.type });
          message.error(error.message);
          if (onError) onError(error);
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          if (text) {
            logger.debug('Parsing CSV file');
            const { data, errors } = Papa.parse<User>(text, { header: true });
            if (errors.length > 0) {
              const error = new Error('Error parsing CSV file');
              logger.error('CSV parsing failed', { errors });
              message.error(error.message);
              if (onError) onError(error);
              return;
            }
            logger.info('File parsed successfully', { recordCount: data.length });
            setParsedUsers(data);
            setCurrentStep(1);
            message.success('File uploaded successfully');
            if (onSuccess) onSuccess(data);
          }
        };
        reader.readAsText(actualFile);
      } catch (error) {
        logger.error('File upload failed', { error: error as LogData });
        if (onError) onError(error as Error);
      }
    },
  };

  return (
    <Card data-testid="file-upload-area">
      <Title level={3}>Bulk User Import</Title>
      <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {currentStep === 0 && (
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single CSV file upload. Please ensure your file follows the required format.
            </p>
          </Dragger>
        )}

        {currentStep === 1 && (
          <div>
            <Button type="primary" onClick={handleValidate} data-testid="validate-button">
              Validate Users
            </Button>
            {validationResult && <ImportResults result={validationResult} />}
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <Button type="primary" onClick={handleImport} data-testid="import-button">
              Import Users
            </Button>
            {importResult && <ImportResults result={importResult} />}
          </div>
        )}
      </Space>
    </Card>
  );
}; 
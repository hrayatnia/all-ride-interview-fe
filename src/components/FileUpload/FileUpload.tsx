import React from 'react';
import { Upload, message } from 'antd';
import type { RcFile } from 'antd/es/upload/interface';
import { InboxOutlined } from '@ant-design/icons';
import { logger, LogData } from '../../utils/logger';
import Papa from 'papaparse';

const { Dragger } = Upload;

interface FileUploadProps<T extends object> {
  onFileProcessed: (data: T[]) => void;
  validateRow?: (row: T) => boolean;
  accept?: string;
  maxSize?: number;
  'data-testid'?: string;
}

interface CustomRequestInterface {
  file: RcFile | string | Blob;
  onSuccess?: (body: unknown, xhr?: XMLHttpRequest) => void;
  onError?: (error: Error, body?: unknown) => void;
  onProgress?: (event: { percent: number }) => void;
}

export function FileUpload<T extends object>({
  onFileProcessed,
  validateRow,
  accept = '.csv',
  maxSize = 5 * 1024 * 1024, // 5MB default
  'data-testid': testId = 'file-upload',
}: FileUploadProps<T>) {
  const handleCustomRequest = async ({ file, onSuccess, onError }: CustomRequestInterface) => {
    try {
      logger.info('Starting file upload process');
      const actualFile = file as RcFile;

      if (actualFile.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(3);
        throw new Error(`File size cannot exceed ${maxSizeMB}MB`);
      }

      if (!accept.split(',').some(type => actualFile.name.toLowerCase().endsWith(type.trim()))) {
        throw new Error(`Please upload a file with one of these extensions: ${accept}`);
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string;
          if (text) {
            logger.debug('Parsing CSV file');
            const { data, errors, meta } = Papa.parse<T>(text, { 
              header: true,
              skipEmptyLines: true,
              transformHeader: (header) => header.trim(),
              delimiter: ',',
            });
            
            if (errors.length > 0) {
              throw new Error('Error parsing CSV file: ' + errors[0].message);
            }

            // Validate that all rows have the same number of fields as headers
            const headerCount = meta.fields?.length || 0;
            const firstInvalidRow = data.find(row => {
              const rowFields = Object.keys(row).filter(key => (row as Record<string, unknown>)[key] !== ''); // Ignore empty fields
              return rowFields.length > headerCount; // Only check for extra fields
            });
            if (firstInvalidRow) {
              const rowFields = Object.keys(firstInvalidRow).filter(key => (firstInvalidRow as Record<string, unknown>)[key] !== '');
              throw new Error(`Error parsing CSV file: Too many fields: expected ${headerCount} fields but parsed ${rowFields.length}`);
            }

            if (validateRow) {
              const invalidRows = data.filter(row => !validateRow(row));
              if (invalidRows.length > 0) {
                throw new Error(`Found ${invalidRows.length} invalid rows in the file`);
              }
            }

            logger.info('File parsed successfully', { recordCount: data.length });
            onFileProcessed(data);
            message.success('File uploaded successfully');
            if (onSuccess) onSuccess(data);
          }
        } catch (error) {
          const err = error as Error;
          message.error(err.message);
          if (onError) onError(err);
        }
      };

      reader.onerror = () => {
        const error = new Error('Error reading file');
        message.error(error.message);
        if (onError) onError(error);
      };

      reader.readAsText(actualFile);
    } catch (error) {
      logger.error('File upload failed', { error: error as LogData });
      message.error((error as Error).message);
      if (onError) onError(error as Error);
    }
  };

  const handleChange = (info: unknown) => {
    const { file } = info as { file: { status: string; name: string } };
    if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
  };

  return (
    <div data-testid={testId}>
      <Dragger
        name="file"
        multiple={false}
        accept={accept}
        showUploadList={false}
        customRequest={handleCustomRequest}
        onChange={handleChange}
        data-testid={`${testId}-control`}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single file upload. Please ensure your file follows the required format.
        </p>
      </Dragger>
    </div>
  );
}
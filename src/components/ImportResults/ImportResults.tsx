import React from 'react';
import { List, Typography, Alert } from 'antd';
import { ImportResult } from '../../types/user';

export interface ImportResultsProps {
  result: ImportResult;
  showSummary?: boolean;
}

export const ImportResults: React.FC<ImportResultsProps> = ({ 
  result,
  showSummary = true
}) => {
  const { failed, totalProcessed } = result;

  return (
    <div data-testid="import-results">
      {showSummary && (
        <Alert
          message={`Processing Results (${totalProcessed} total)`}
          type="info"
          style={{ marginBottom: 16 }}
        />
      )}
      
      {failed.length > 0 && (
        <List
          header={<Typography.Text type="danger">Failed Records</Typography.Text>}
          bordered
          dataSource={failed}
          renderItem={item => (
            <List.Item>
              <Typography.Text>Row {item.row}: {item.errors.join(', ')}</Typography.Text>
            </List.Item>
          )}
          style={{ marginBottom: 16 }}
        />
      )}
    </div>
  );
};
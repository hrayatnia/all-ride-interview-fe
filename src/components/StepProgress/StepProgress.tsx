import React from 'react';
import { Steps } from 'antd';
import type { StepProps } from 'antd';

export interface StepProgressProps {
  steps: (StepProps & { key: string })[];
  current: number;
  onChange?: (current: number) => void;
  style?: React.CSSProperties;
  'data-testid'?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  current,
  onChange,
  style,
  'data-testid': testId = 'step-progress',
}) => {
  return (
    <Steps
      current={current}
      items={steps}
      onChange={onChange}
      style={{ marginBottom: 24, ...style }}
      data-testid={testId}
    />
  );
}; 
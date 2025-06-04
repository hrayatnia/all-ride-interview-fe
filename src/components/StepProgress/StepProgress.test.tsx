import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StepProgress } from './StepProgress';
import { CheckCircleOutlined } from '@ant-design/icons';

describe('StepProgress', () => {
  const mockSteps = [
    {
      key: 'step1',
      title: 'Step 1',
      icon: <CheckCircleOutlined />,
    },
    {
      key: 'step2',
      title: 'Step 2',
      icon: <CheckCircleOutlined />,
    },
    {
      key: 'step3',
      title: 'Step 3',
      icon: <CheckCircleOutlined />,
    },
  ];

  it('renders all steps', () => {
    render(<StepProgress steps={mockSteps} current={0} />);
    
    mockSteps.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('shows correct current step', () => {
    const { rerender } = render(<StepProgress steps={mockSteps} current={0} />);
    expect(screen.getByText('Step 1').closest('.ant-steps-item')).toHaveClass('ant-steps-item-process');

    rerender(<StepProgress steps={mockSteps} current={1} />);
    expect(screen.getByText('Step 2').closest('.ant-steps-item')).toHaveClass('ant-steps-item-process');
  });

  it('calls onChange when clicking on a step', () => {
    const mockOnChange = jest.fn();
    render(<StepProgress steps={mockSteps} current={0} onChange={mockOnChange} />);
    
    fireEvent.click(screen.getByText('Step 2'));
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    render(<StepProgress steps={mockSteps} current={0} style={customStyle} />);
    
    const stepsElement = screen.getByTestId('step-progress');
    expect(stepsElement).toHaveStyle(customStyle);
  });
}); 
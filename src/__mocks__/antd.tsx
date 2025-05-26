import React from 'react'; // Import React for JSX

const actualAntd = jest.requireActual('antd');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockErrorFn = jest.fn((..._args: unknown[]) => {
  // console.log('MOCK antd.message.error CALLED WITH:', _args);
});
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockSuccessFn = jest.fn((..._args: unknown[]) => {
  // console.log('MOCK antd.message.success CALLED WITH:', _args);
});

const mockedMessageModule = {
  ...actualAntd.message,
  error: mockErrorFn,
  success: mockSuccessFn,
  info: jest.fn(),
  warning: jest.fn(),
  loading: jest.fn(),
};

interface CustomRequestOptions {
  file: File;
  onSuccess: (response?: unknown) => void;
  onError: (error: Error) => void;
  onProgress: (event: { percent: number }) => void;
}

interface OnChangeInfo {
  file: {
    name: string;
    status?: string;
    percent?: number;
    originFileObj?: File;
  };
  error?: Error;
}

interface MockUploadProps {
  customRequest?: (options: CustomRequestOptions) => void;
  onChange?: (info: OnChangeInfo) => void;
  children?: React.ReactNode;
  'data-testid'?: string;
}

const MockDraggerComponent: React.FC<MockUploadProps> = (props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file && props.customRequest) {
      const onProgress = (progressEvent: { percent: number }) => {
        if (props.onChange) {
          props.onChange({ file: { name: file.name, status: 'uploading', percent: progressEvent.percent } });
        }
      };
      const onSuccess = () => {
        if (props.onChange) {
          props.onChange({ file: { name: file.name, status: 'done' } });
        }
      };
      const onError = (err: Error) => {
        if (props.onChange) {
          props.onChange({ file: { name: file.name, status: 'error' }, error: err });
        }
      };
      props.customRequest({ file, onSuccess, onError, onProgress });
    }
    if (file && props.onChange) {
      props.onChange({ file: { name: file.name, originFileObj: file } });
    }
  };
  return (
    <div data-testid={props['data-testid'] || 'file-upload-area-mock'}>
      {props.children}
      <input type="file" data-testid={`${props['data-testid']}-control` || 'file-input-control'} onChange={handleChange} style={{ display: 'none' }} />
    </div>
  );
};
MockDraggerComponent.displayName = 'MockDragger';

interface MockUploadType extends React.FC<MockUploadProps> {
  Dragger: typeof MockDraggerComponent;
}

const MockUploadComponent = Object.assign(
  (props: MockUploadProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files && event.target.files[0];
      if (file && props.customRequest) {
        const onProgress = (progressEvent: { percent: number }) => {
          if (props.onChange) {
            props.onChange({ file: { name: file.name, status: 'uploading', percent: progressEvent.percent } });
          }
        };
        const onSuccess = () => {
          if (props.onChange) {
            props.onChange({ file: { name: file.name, status: 'done' } });
          }
        };
        const onError = (err: Error) => {
          if (props.onChange) {
            props.onChange({ file: { name: file.name, status: 'error' }, error: err });
          }
        };
        props.customRequest({ file, onSuccess, onError, onProgress });
      }
    };

    return (
      <div>
        {props.children}
        <input type="file" data-testid={props['data-testid'] || 'file-input'} onChange={handleChange} />
      </div>
    );
  },
  { displayName: 'MockUpload', Dragger: MockDraggerComponent }
) as MockUploadType;

interface AntdMockModule {
  message: typeof mockedMessageModule;
  Upload: typeof MockUploadComponent;
  [key: string]: unknown;
}

module.exports = {
  ...actualAntd,
  message: mockedMessageModule,
  Upload: MockUploadComponent,
} as AntdMockModule; 
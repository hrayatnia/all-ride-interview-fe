import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Typography } from 'antd';
import { config } from './config/env';
import { UserImport } from './components/UserImport/UserImport';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Layout data-testid="app-container" style={{ minHeight: '100vh' }}>
        <Header data-testid="app-header" style={{ background: '#fff', padding: '0 24px' }}>
          <Title level={2} data-testid="app-title" style={{ margin: '16px 0' }}>{config.appTitle}</Title>
        </Header>
        <Content data-testid="app-content" style={{ padding: '24px', background: '#f0f2f5' }}>
          <Routes>
            <Route path="/" element={<UserImport />} />
          </Routes>
        </Content>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;

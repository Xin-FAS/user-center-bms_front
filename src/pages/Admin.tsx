import { PageContainer } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';

const Admin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <PageContainer>{children}</PageContainer>;
};
export default Admin;

import { searchUsers } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { FooterToolbar, PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Image } from 'antd';
import React, { useRef, useState } from 'react';
import { LOAD_ERROR_IMAGE_URL } from '@/constants';

export default (): React.ReactNode => {
    /**
     * @en-US The pop-up window of the distribution update window
     * @zh-CN 分布更新窗口的弹窗
     * */
    const actionRef = useRef<ActionType>();
    const [selectedRowsState, setSelectedRows] = useState<API.CurrentUser[]>([]);

    /**
     * @en-US International configuration
     * @zh-CN 国际化配置
     * */

    const columns: ProColumns<API.CurrentUser>[] = [
        {
            dataIndex: 'id',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '用户名',
            dataIndex: 'username',
            copyable: true,
        },
        {
            title: '用户账号',
            dataIndex: 'userAccount',
            copyable: true,
        },
        {
            title: '头像',
            dataIndex: 'avatarUrl',
            render(value) {
                return (
                    <Image
                        src={value as string}
                        width={80}
                        height={80}
                        fallback={LOAD_ERROR_IMAGE_URL}
                    />
                );
            },
        },
        {
            title: '性别',
            dataIndex: 'gender',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            copyable: true,
        },
        {
            title: '邮件',
            dataIndex: 'email',
            copyable: true,
        },
        {
            title: '状态',
            dataIndex: 'userStatus',
        },
        {
            title: '角色',
            dataIndex: 'userRole',
            valueType: 'select',
            valueEnum: {
                0: {
                    text: '普通用户',
                    status: 'Default',
                },
                1: {
                    text: '管理员',
                    status: 'Success',
                },
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            valueType: 'dateTime',
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render() {
                return <></>;
            },
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.CurrentUser, API.PageParams>
                headerTitle={'查询表格'}
                actionRef={actionRef}
                rowKey="key"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button type="primary" key="primary" onClick={() => {}}>
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={searchUsers}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            项 &nbsp;&nbsp;
                            <span>
                                服务调用次数总计{' '}
                                {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
                            </span>
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量删除
                    </Button>
                </FooterToolbar>
            )}
        </PageContainer>
    );
};

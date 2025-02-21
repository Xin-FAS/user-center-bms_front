import { Footer } from '@/components';
import { login } from '@/services/ant-design-pro/api';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Helmet, history, useModel } from '@umijs/max';
import { Button, Divider, Form, message, Space, Tabs } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import { SYSTEM_LOGO } from '@/constants';

const useStyles = createStyles(({ token }) => {
    return {
        action: {
            marginLeft: '8px',
            color: 'rgba(0, 0, 0, 0.2)',
            fontSize: '24px',
            verticalAlign: 'middle',
            cursor: 'pointer',
            transition: 'color 0.3s',
            '&:hover': {
                color: token.colorPrimaryActive,
            },
        },
        lang: {
            width: 42,
            height: 42,
            lineHeight: '42px',
            position: 'fixed',
            right: 16,
            borderRadius: token.borderRadius,
            ':hover': {
                backgroundColor: token.colorBgTextHover,
            },
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'auto',
            backgroundImage:
                "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
            backgroundSize: '100% 100%',
        },
    };
});
const Login: React.FC = () => {
    const [type, setType] = useState<string>('account');
    const { initialState, setInitialState } = useModel('@@initialState');
    const { styles } = useStyles();
    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();
        if (userInfo) {
            flushSync(() => {
                setInitialState((s) => ({
                    ...s,
                    currentUser: userInfo,
                }));
            });
        }
    };
    const handleSubmit = async (values: API.LoginParams) => {
        try {
            // 登录
            const user = await login({
                ...values,
                type,
            });
            if (user) {
                const defaultLoginSuccessMessage = '登录成功！';
                message.success(defaultLoginSuccessMessage);
                await fetchUserInfo();
                const urlParams = new URL(window.location.href).searchParams;
                history.push(urlParams.get('redirect') || '/');
                return;
            } else {
                message.error('登录失败，请检查账号或密码');
            }
        } catch (error) {
            const defaultLoginFailureMessage = '登录失败，请重试！';
            console.log(error);
            message.error(defaultLoginFailureMessage);
        }
    };
    // 前往注册页面
    const toRegister = () => {
        const urlParams = new URL(window.location.href).searchParams;
        const redirectValue = urlParams.get('redirect');
        const search = redirectValue ? `?redirect=${redirectValue}` : '';
        history.push({
            pathname: '/user/register',
            search,
        });
    };
    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {'登录'}- {Settings.title}
                </title>
            </Helmet>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src={SYSTEM_LOGO} />}
                    title="用户中心-登录"
                    subTitle={'欢迎使用，请先进行登录'}
                    initialValues={{
                        autoLogin: true,
                    }}
                    onFinish={async (values) => {
                        await handleSubmit(values as API.LoginParams);
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: '账户密码登录',
                            },
                        ]}
                    />
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name="userAccount"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined />,
                                }}
                                placeholder={'请输入账号'}
                                rules={[
                                    {
                                        required: true,
                                        message: '账号是必填项！',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="userPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined />,
                                }}
                                placeholder={'请输入密码'}
                                rules={[
                                    {
                                        required: true,
                                        message: '密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不能小于8！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    <Form.Item>
                        <Space
                            align={'center'}
                            split={<Divider type={'vertical'} />}
                            size={0}
                            style={{ justifyContent: 'space-between', width: '100%' }}
                        >
                            <ProFormCheckbox noStyle name="autoLogin">
                                <span style={{ whiteSpace: 'nowrap' }}>自动登录</span>
                            </ProFormCheckbox>
                            <Button type={'link'} onClick={toRegister}>
                                新用户注册
                            </Button>
                            <Button type={'link'}>忘记密码 ?</Button>
                        </Space>
                    </Form.Item>
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};
export default Login;

import { Footer } from '@/components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, message, Tabs } from 'antd';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { Helmet, history } from '@umijs/max';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { createStyles } from 'antd-style';
import { SYSTEM_LOGO } from '@/constants';
import { register } from '@/services/ant-design-pro/api';

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
const Register: React.FC = () => {
    const [type, setType] = useState<string>('account');
    const { styles } = useStyles();
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        const formData = form.getFieldsValue();
        try {
            // 注册
            const registerResp = await register({ ...formData, planetCode: '123' });
            if (registerResp.code !== undefined && registerResp.code >= 0) {
                const defaultLoginSuccessMessage = `注册成功！`;
                message.success(defaultLoginSuccessMessage);
                const urlParams = new URL(window.location.href).searchParams;
                history.push(`/user/login?redirect=${urlParams.get('redirect')}`);
            } else throw new Error(`register error id = ${registerResp.code}`);
        } catch (error) {
            const defaultLoginFailureMessage = '注册失败，请重试！';
            console.log(error);
            message.error(defaultLoginFailureMessage);
        }
    };
    return (
        <div className={styles.container}>
            <Helmet>
                <title>
                    {'注册'}- {Settings.title}
                </title>
            </Helmet>
            <div
                style={{
                    flex: '1',
                    padding: '32px 0',
                }}
            >
                <LoginForm
                    form={form}
                    contentStyle={{
                        minWidth: 280,
                        maxWidth: '75vw',
                    }}
                    logo={<img alt="logo" src={SYSTEM_LOGO} />}
                    title="用户中心-注册"
                    subTitle={'注册一个属于您的账户'}
                    initialValues={{
                        autoLogin: true,
                    }}
                    submitter={{
                        onSubmit: handleSubmit,
                        searchConfig: {
                            submitText: '注册',
                        },
                    }}
                >
                    <Tabs
                        activeKey={type}
                        onChange={setType}
                        centered
                        items={[
                            {
                                key: 'account',
                                label: '账户密码注册',
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
                                    {
                                        validator: async (_, value) => {
                                            const userPassword =
                                                form.getFieldValue('checkPassword');
                                            if (value === userPassword)
                                                form.validateFields(['checkPassword']);
                                            // 判断密码是否相同
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="checkPassword"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined />,
                                }}
                                placeholder={'请再次输入密码'}
                                validateTrigger={'onBlur'}
                                rules={[
                                    {
                                        required: true,
                                        message: '确认密码是必填项！',
                                    },
                                    {
                                        min: 8,
                                        type: 'string',
                                        message: '密码长度不能小于8！',
                                    },
                                    {
                                        validator: async (_, value) => {
                                            const userPassword = form.getFieldValue('userPassword');
                                            if (value !== userPassword)
                                                return Promise.reject('两次输入的密码不一致');
                                            // 判断密码是否相同
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            />
                        </>
                    )}
                </LoginForm>
            </div>
            <Footer />
        </div>
    );
};
export default Register;

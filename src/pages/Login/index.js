import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSignIn, useSignOut } from 'react-auth-kit';

import { login } from '~/api/user';
import { saveDataAuthToCookies, removeDataAuthInCookies } from '~/utils';
import { TOKEN_EXPIRES_TIME } from '~/constants'
//import { ADMIN_ROLE, User_ROLE } from "~/constants"

function Login() {

    const signIn = useSignIn();
    const signOut = useSignOut();
    const navigate = useNavigate();
    let [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const loadingIcon = (
        <LoadingOutlined style={{ fontSize: 24, marginRight: 10 }} spin />
    )

    useEffect(() => {
        signOut();
        removeDataAuthInCookies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const onFinish = (values) => {
        setLoading(true)
        setMessage('');
        const data = {
            username: values.username,
            password: values.password,
        };

        login(data)
            .then((res) => {
                setTimeout(() => {
                    signIn({
                        token: res.data.accessToken,
                        tokenType: "Bearer",
                        expiresIn: 100,
                        authState: {
                            id: res.data.userId,
                            username: res.data.username,
                            email: res.data.email,
                            fullname: res.data.fullname,
                            avatar: res.data.avatar,
                            roleName: res.data.roleName,
                            twoFactorAuthentication: res.data.twoFactorAuthentication,
                            signInGoogle: res.data.signInGoogle,
                            refreshToken: res.data.refreshToken
                        },
                        refreshToken: res.data.refreshToken,
                        refreshTokenExpireIn: TOKEN_EXPIRES_TIME,
                    });
                    saveDataAuthToCookies(res.data.userId, res.data.accessToken, res.data.refreshToken, res.data.jwtId);
                    return navigate('/admin/statistic');
                }, 500)
            })
            .catch((err) => {
                setMessage(err.response.data);
                if (err.response.status === 416) { //handle 2FA
                    return navigate(`/verification2FA/${err.response.data}`);
                }
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })


    };
    const onFinishFailed = (errorInfo) => { };

    return (
        <>
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                style={{
                    maxWidth: 600,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your username!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                {message !== '' ? (
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 0,
                        }}
                    >
                        <span style={{ color: 'red' }}>{message}</span>
                    </Form.Item>
                ) : (
                    ''
                )}

                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Spin spinning={loading} indicator={loadingIcon} />
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default Login;

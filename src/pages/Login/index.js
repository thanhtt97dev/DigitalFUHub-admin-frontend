import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Row } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useSignIn, useSignOut } from 'react-auth-kit';
import bannerLogin from '~/assets/images/banner_login.jpg'

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

                    window.location.href = "/admin/statistic"
                }, 500)
            })
            .catch((err) => {
                setMessage(err.response.data === "Username or Password not correct!"
                    ? "Tài khoản hoặc mật khẩu không chính xác!"
                    :
                    err.response.data);
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

            <div style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Row style={{
                    boxShadow: '0px 0px 6px -2px #2673dd',
                    borderRadius: '10px',
                    overflow: 'hidden'
                }}>
                    <Col>
                        <img style={{ height: '100%' }} alt="" src={bannerLogin} />
                    </Col>
                    <Col>
                        {/* form */}
                        <h4 style={{ textAlign: 'center', fontSize: '25px' }}>Đăng Nhập Quản Trị Viên</h4>

                        <Form
                            name="basic"
                            labelCol={{
                                span: 8,
                            }}
                            layout='vertical'
                            wrapperCol={{
                                span: 24,
                            }}
                            style={{
                                maxWidth: 900,
                                width: '400px',
                                paddingLeft: 20,
                                paddingRight: 20
                            }}
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Tài khoản"
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Tài khoản không được trống',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mật khẩu không được trống',
                                    },
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            {message !== '' ? (
                                // <Form.Item
                                //     wrapperCol={{
                                //         offset: 8,
                                //         span: 0,
                                //     }}
                                // >
                                <span style={{ color: 'red' }}>{message}</span>
                                // {/* </Form.Item> */}
                            ) : (
                                ''
                            )}

                            <Form.Item
                                wrapperCol={{
                                    offset: 9,
                                    span: 16,
                                }}
                            >
                                {/* <Spin spinning={loading} indicator={loadingIcon} /> */}
                                <Button loading={loading} type="primary" htmlType="submit">
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Login;

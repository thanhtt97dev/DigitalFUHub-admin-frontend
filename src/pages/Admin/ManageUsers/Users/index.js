import React, { useEffect, useState, useContext } from 'react';
import { Button, Select, Form, Input, Table, Tag, Row, Col, Space, Card, Avatar } from 'antd';

import Spinning from "~/components/Spinning";
import NotificationContext from '~/context/NotificationContext';

import { getUsers } from '~/api/user';
import { Link } from 'react-router-dom';
import {
    CUSTOMER_ROLE_ID,
    SELLER_ROLE_ID
}
    from '~/constants'
import logoFPT from '~/assets/images/fpt-logo.jpg';

const columns = [
    {
        title: 'Id',
        dataIndex: 'userId',
        width: '8%',
    },
    {
        title: 'Ảnh đại diện',
        dataIndex: 'avatar',
        width: '10%',
        render: (avatar) => {
            if (avatar === "" || avatar === null || avatar === undefined) {
                return <Avatar size={50} src={logoFPT} />
            } else {
                return <Avatar size={50} src={avatar} />
            }
        }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '25%',
    },
    {
        title: 'Họ và tên',
        dataIndex: 'fullname',
        width: '25%',
    },
    {
        title: 'Vai trò',
        dataIndex: 'roleId',
        width: '10%',
        render: (roleId) => {
            if (roleId === CUSTOMER_ROLE_ID) {
                return <Tag color="blue">Khách hàng</Tag>
            } else if (roleId === SELLER_ROLE_ID) {
                return <Tag color="orange">Người bán hàng</Tag>
            }
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (status) => <Tag color={status ? 'green' : 'volcano'}>{status ? 'Activate' : 'Ban'}</Tag>,
        width: '10%',
    },
    {
        title: '',
        dataIndex: 'userId',
        width: '10%',
        render: (userId) => (
            <Link to={`/admin/user/${userId}`}>Chi tiết</Link>
        ),
    },
];

function Users() {
    const [form] = Form.useForm();
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true);
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        userId: '',
        email: '',
        fullname: '',
        roleId: 0,
        status: 0,
    });

    const onFinish = (values) => {
        setLoading(true);

        setSearchData({
            userId: values.userId,
            email: values.email,
            fullname: values.fullname,
            roleId: values.role,
            status: values.status,
        });
    };

    const onFill = () => {
        form.setFieldsValue({ email: '', fullname: '', role: 0, status: 0 });
    };

    useEffect(() => {
        setLoading(true);

        setDataTable([]);

        getUsers(searchData)
            .then((res) => {
                setDataTable(res.data.result);
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
            .catch(() => {
                setLoading(false);
                notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData]);


    const initFormValues = [
        {
            name: 'userId',
            value: searchData.userId,
        },
        {
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'fullname',
            value: searchData.fullname,
        },
        {
            name: 'role',
            value: searchData.roleId,
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        minHeight: "690px"
                    }}
                    hoverable
                    title="Danh sách nạp tiền"
                >
                    <Form
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={10}>
                                <Row>
                                    <Col span={5} offset={1}>Id: </Col>
                                    <Col span={14}>
                                        <Form.Item name="userId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={5} offset={1}>Email: </Col>
                                    <Col span={14}>
                                        <Form.Item name="email" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={5} offset={1}>Họ và tên: </Col>
                                    <Col span={14}>
                                        <Form.Item name="fullname" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={10}>
                                <Row>
                                    <Col span={5} offset={1}>Vai trò: </Col>
                                    <Col span={14}>
                                        <Form.Item name="role">
                                            <Select>
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={3}>Người bán hàng</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={5} offset={1}>Trạng thái: </Col>
                                    <Col span={14}>
                                        <Form.Item name="status">
                                            <Select>
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Active</Select.Option>
                                                <Select.Option value={2}>Ban</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={12} span={10}>
                                        <Form.Item >
                                            <Space>
                                                <Button htmlType="button" onClick={onFill}>
                                                    Tạo lại
                                                </Button>
                                                <Button type="primary" htmlType="submit">
                                                    Tìm kiếm
                                                </Button>
                                            </Space>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                        </Row>

                        <Table columns={columns} pagination={{ size: 10 }} dataSource={dataTable} />
                    </Form>
                </Card>


            </Spinning>
        </>
    );
}

export default Users;

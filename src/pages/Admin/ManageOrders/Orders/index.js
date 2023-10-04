import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, notification, Select, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { getOrders } from '~/api/admin'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES
} from "~/constants";



const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã hóa đơn',
        dataIndex: 'orderId',
        width: '9%',
        render: (orderId) => {
            return (
                <Link to={`/admin/order/${orderId}`}>{orderId}</Link>
            )
        }
    },
    {
        title: 'Email khách hàng',
        dataIndex: 'customerEmail',
        width: '20%',
        render: (customerEmail, record) => {
            return (
                <Link to={`/admin/user/${record.customerId}`}>{customerEmail}</Link>
            )
        }
    },
    {
        title: 'Tên shop',
        dataIndex: 'shopName',
        width: '20%',
        render: (shopName, record) => {
            return (
                <Link to={`/admin/seller/${record.sellerId}`}>{shopName}</Link>
            )
        }
    },
    {
        title: 'Thời gian đơn hàng',
        dataIndex: 'orderDate',
        width: '15%',
        render: (orderDate) => {
            return (
                <p>{ParseDateTime(orderDate)}</p>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'totalAmount',
        width: '15%',
        render: (totalAmount) => {
            return (
                <p>{formatStringToCurrencyVND(totalAmount)} VND</p>
            )
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'orderStatusId',
        width: '15%',
        render: (orderStatusId) => {
            if (orderStatusId === ORDER_WAIT_CONFIRMATION) {
                return <Tag color="#108ee9">Chờ xác nhận</Tag>
            } else if (orderStatusId === ORDER_CONFIRMED) {
                return <Tag color="#87d068">Đã xác nhận</Tag>
            } else if (orderStatusId === ORDER_COMPLAINT) {
                return <Tag color="#c6e329">Khiếu nại</Tag>
            } else if (orderStatusId === ORDER_DISPUTE) {
                return <Tag color="#ffaa01">Tranh chấp</Tag>
            } else if (orderStatusId === ORDER_REJECT_COMPLAINT) {
                return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
            } else if (orderStatusId === ORDER_SELLER_VIOLATES) {
                return <Tag color="#f50">Người bán vi phạm</Tag>
            }
        }
    },
    {
        dataIndex: 'orderId',
        width: '9%',
        render: (orderId) => {
            return (
                <Link to={`/admin/order/${orderId}`}>
                    <Button type="dashed" danger >Chi tiết</Button>
                </Link>
            )
        }
    },
];

function Orders() {
    const [loading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        orderId: '',
        customerEmail: '',
        shopName: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getOrders(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    openNotification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const initFormValues = [
        {
            name: 'orderId',
            value: searchData.orderId,
        },
        {
            name: 'customerEmail',
            value: searchData.customerEmail,
        },
        {
            name: 'shopName',
            value: searchData.shopName,
        },
        {
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        },
        {
            name: 'status',
            value: searchData.status,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            openNotification("error", "Thời gian đơn hàng không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            orderId: values.orderId,
            customerEmail: values.customerEmail,
            shopName: values.shopName,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            status: values.status
        });
    };



    return (
        <>
            {contextHolder}
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
                            <Col span={3} offset={1}><label>Mã hóa đơn: </label></Col>
                            <Col span={6}>
                                <Form.Item name="orderId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Email khách hàng: </label></Col>
                            <Col span={6}>
                                <Form.Item name="customerEmail" >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Tên shop: </label></Col>
                            <Col span={6}>
                                <Form.Item name="shopName" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian đơn hàng: </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Mã hóa đơn: </label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Chờ xác nhận</Select.Option>
                                        <Select.Option value={2}>Đã xác nhận</Select.Option>
                                        <Select.Option value={3}>Khiếu nại</Select.Option>
                                        <Select.Option value={4}>Tranh chấp</Select.Option>
                                        <Select.Option value={5}>Từ chối khiếu nại</Select.Option>
                                        <Select.Option value={6}>Người bán vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        Tìm kiếm
                                    </Button>
                                </Space>
                            </Col>
                        </Row>
                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                    <Table columns={columns} pagination={{ pageSize: 10 }}
                        dataSource={dataTable} size='small' scroll={{ y: 290 }}
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default Orders;
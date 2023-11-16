import React, { useEffect, useState } from "react";
import { Card, Table, Select, Button, Form, Input, DatePicker, Tag, notification, Row, Col } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { getHistoryTransactionCoin } from '~/api/transactionCoin'
import Spinning from "~/components/Spinning";
import { ParseDateTime } from '~/utils/index'
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    TRANSACTION_COIN_TYPE_RECEIVE,
    TRANSACTION_COIN_TYPE_USE,
    TRANSACTION_COIN_TYPE_REFUND
} from "~/constants";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã hóa đơn',
        dataIndex: 'orderId',
        width: '9%',
        render: (orderId,) => {
            return (
                <Link to={`/admin/order/${orderId}`}>{orderId}</Link>
            )
        }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        render: (email, record) => {
            return (
                <Link to={`/admin/user/${record.userId}`}>{email}</Link>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        width: '15%',
        render: (amount, record) => {
            return (
                <>{amount} xu</>
            )
        }
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'dateCreate',
        width: '15%',
        render: (dateCreate) => {
            return (
                <p>{ParseDateTime(dateCreate)}</p>
            )
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'transactionCoinTypeId',
        width: '15%',
        render: (transactionCoinTypeId) => {
            if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                return <Tag color="#3b7be2">Nhận</Tag>
            } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                return <Tag color="#cf1322">Sử dụng</Tag>
            } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                return <Tag color="#8c66c8">Hoàn xu</Tag>
            }
        }
    },
];

function HistoryTransactionCoin() {
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
        email: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        transactionCoinTypeId: 0
    });

    useEffect(() => {
        getHistoryTransactionCoin(searchData)
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
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        },
        {
            name: 'transactionCoinTypeId',
            value: searchData.transactionCoinTypeId,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            openNotification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            orderId: values.orderId,
            email: values.email,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            transactionCoinTypeId: values.transactionCoinTypeId
        });
    };



    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Card>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={12}>
                                <Row>
                                    <Col span={6} offset={2}>Mã hóa đơn:</Col>
                                    <Col span={12}>
                                        <Form.Item name="orderId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={6} offset={2}>Email:</Col>
                                    <Col span={12}>
                                        <Form.Item name="email" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={12}>
                                <Row>
                                    <Col span={6} offset={2}>Thời gian tạo:</Col>
                                    <Col span={12}>
                                        <Form.Item name="date" >
                                            <RangePicker locale={locale}
                                                format={"M/D/YYYY"}
                                                placement={"bottomLeft"} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={6} offset={2}>Trạng thái:</Col>
                                    <Col span={12}>
                                        <Form.Item name="transactionCoinTypeId" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Nhận xu</Select.Option>
                                                <Select.Option value={2}>Sử dụng xu</Select.Option>
                                                <Select.Option value={3}>Hoàn xu</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col offset={8} span={12}>
                                        <Button type="primary" htmlType="submit">
                                            Tìm kiếm
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Card style={{ marginTop: "20px" }}>
                    <Table columns={columns} pagination={{ pageSize: 10 }}
                        dataSource={dataTable} size="small" scroll={{ y: 300 }}
                        rowKey={(record) => record.orderId}
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryTransactionCoin;




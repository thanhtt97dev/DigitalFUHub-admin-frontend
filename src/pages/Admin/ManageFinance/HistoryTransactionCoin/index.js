import React, { useEffect, useState } from "react";
import { Card, Table, Select, Button, Form, Input, DatePicker, Tag, notification, Row, Col, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { getHistoryTransactionCoin } from '~/api/transactionCoin'
import Spinning from "~/components/Spinning";
import { ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE,
    TRANSACTION_COIN_TYPE_RECEIVE,
    TRANSACTION_COIN_TYPE_USE,
    TRANSACTION_COIN_TYPE_REFUND
} from "~/constants";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã đơn hàng',
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
        title: 'Số lượng',
        dataIndex: 'amount',
        width: '15%',
        render: (amount, record) => {
            return (
                <span>{amount} xu</span>
            )
        }
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'dateCreate',
        width: '15%',
        render: (dateCreate) => {
            return (
                <span>{ParseDateTime(dateCreate)}</span>
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
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            showSizeChanger: false
        },
    });
    const [searchData, setSearchData] = useState({
        orderId: '',
        email: '',
        fromDate: '',
        toDate: '',
        transactionCoinTypeId: 0,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        getHistoryTransactionCoin(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.transactionCoins)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.total,
                        },
                    });
                    setTotalRecord(res.data.result.total)
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
            name: 'transactionCoinTypeId',
            value: searchData.transactionCoinTypeId,
        },
    ];

    const onFinish = (values) => {
        if (values.date === null) {
            openNotification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            orderId: values.orderId,
            email: values.email,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            transactionCoinTypeId: values.transactionCoinTypeId,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            orderId: '',
            email: '',
            transactionCoinTypeId: 0,
        });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchData({
            ...searchData,
            page: pagination.current
        })
        setTableParams({
            pagination,
            filters,
            ...sorter,
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

                                <Row>
                                    <Col span={2} offset={13}>
                                        <Space>
                                            <Button htmlType="button" onClick={onReset}>
                                                Xóa
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                Tìm kiếm
                                            </Button>
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Card style={{ marginTop: "20px" }}>
                    <Row align="end">
                        <b>{totalRecord} Kết quả</b>
                    </Row>
                    <Table
                        columns={columns}
                        pagination={tableParams.pagination}
                        dataSource={dataTable}
                        rowKey={(record, index) => index}
                        onChange={handleTableChange}
                        size="middle"
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryTransactionCoin;




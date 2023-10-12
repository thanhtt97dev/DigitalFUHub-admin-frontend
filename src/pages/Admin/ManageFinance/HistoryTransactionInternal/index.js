import React, { useEffect, useState } from "react";
import { Card, Table, Select, Button, Form, Input, Space, DatePicker, Tag, notification } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";

import { getHistoryTransactionInternal } from '~/api/admin'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT
} from "~/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faUserShield } from "@fortawesome/free-solid-svg-icons"


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
            if (record.transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <><FontAwesomeIcon icon={faUserShield} /> <b>Administrator</b></>
            }
            return (
                <Link to={`/admin/user/${record.userId}`}>{email}</Link>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'paymentAmount',
        width: '15%',
        render: (paymentAmount, record) => {
            if (record.transactionTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <p style={{ color: "#108ee9" }}>+ {formatStringToCurrencyVND(paymentAmount)} VND</p>
            } else if (record.transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <p style={{ color: "red" }}>- {formatStringToCurrencyVND(paymentAmount)} VND</p>
            } else if (record.transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <p style={{ color: "red" }}>- {formatStringToCurrencyVND(paymentAmount)} VND</p>
            } else if (record.transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <p style={{ color: "#87d068" }}> <FontAwesomeIcon icon={faWallet} /> {formatStringToCurrencyVND(paymentAmount)} VND</p>
            }
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
        dataIndex: 'transactionTypeId',
        width: '15%',
        render: (transactionTypeId) => {
            if (transactionTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <Tag color="#108ee9">Thanh toán</Tag>
            } else if (transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <Tag color="red">Nhận tiền hàng</Tag>
            } else if (transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <Tag color="volcano">Nhận tiền hoàn khiếu nại</Tag>
            } else if (transactionTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <Tag color="#87d068">Lợi nhuận</Tag>
            }
        }
    },
];

function HistoryTransactionInternal() {
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
        transactionTypeId: 0
    });

    useEffect(() => {
        getHistoryTransactionInternal(searchData)
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
            name: 'transactionTypeId',
            value: searchData.transactionTypeId,
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
            transactionTypeId: values.transactionTypeId
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
                    title="Lịch sử giao dịch nội bộ"
                >
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 0,
                        }}
                        style={{
                            maxWidth: 500,
                            marginLeft: "30px",
                            position: 'relative',
                        }}
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Form.Item label="Mã hóa đơn" labelAlign="left" name="orderId">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Email" labelAlign="left" name="email">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo" labelAlign="left" name="date">
                            <RangePicker locale={locale}
                                format={"M/D/YYYY"}
                                placement={"bottomLeft"} />
                        </Form.Item>

                        <Form.Item label="Trạng thái" labelAlign="left" name="transactionTypeId">
                            <Select >
                                <Select.Option value={0}>Tất cả</Select.Option>
                                <Select.Option value={1}>Thanh toán</Select.Option>
                                <Select.Option value={2}>Nhận tiền hàng</Select.Option>
                                <Select.Option value={3}>Nhận tiền hoàn khiếu nại</Select.Option>
                                <Select.Option value={4}>Lợi nhuận</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ position: 'absolute', top: 168, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
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

export default HistoryTransactionInternal;




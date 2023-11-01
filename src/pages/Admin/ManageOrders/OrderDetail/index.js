
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Tag, Table, Space, Tooltip, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBasketShopping,
    faMoneyBillTransfer,
    faMoneyBill1Wave,
    faCoins
} from '@fortawesome/free-solid-svg-icons'
import dayjs from 'dayjs';

import Spinning from '~/components/Spinning';
import DescriptionsTableOrderInfo from '~/components/DescriptionsTable/DescriptionsTableOrderInfo'


import { getOrder } from '~/api/order'
import {
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT,
    TRANSACTION_COIN_TYPE_RECEIVE,
    TRANSACTION_COIN_TYPE_USE,
    TRANSACTION_COIN_TYPE_REFUND
} from "~/constants";

import { ParseDateTime, formatStringToCurrencyVND } from '~/utils/index'

import BackPreviousPage from '~/components/BackPreviousPage';
import CardOrderItem from '~/components/Card/CardOrderItem';

const columnsHistoryTransaction = [
    {
        title: 'STT',
        dataIndex: 'index',
        width: '10%',
    },
    {
        title: 'Giá trị',
        width: '30%',
        render: (record) => {
            return (
                (() => {
                    var transactionInternalTypeId = record.transactionInternalTypeId
                    var transactionCoinTypeId = record.transactionCoinTypeId
                    if (transactionInternalTypeId !== null) {
                        if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                            return (
                                <p style={{ color: "#3b7be2" }}>{formatStringToCurrencyVND(record.paymentAmount)} đ</p>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                            return (
                                <p style={{ color: "#cf1322" }}>{formatStringToCurrencyVND(record.paymentAmount)} đ</p>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                            return (
                                <p style={{ color: "#8c66c8" }}>{formatStringToCurrencyVND(record.paymentAmount)} đ</p>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                            return (
                                <p style={{ color: "#4ea927" }}>{formatStringToCurrencyVND(record.paymentAmount)} đ</p>
                            )
                        }
                    }
                    if (transactionCoinTypeId !== null) {
                        if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                            return (
                                <p style={{ color: "#108ee9" }}>{record.amount} xu</p>
                            )
                        } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                            return (
                                <p style={{ color: "red" }}>{record.amount} xu</p>
                            )
                        } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                            return (
                                <p style={{ color: "volcano" }}>{record.amount} xu</p>
                            )
                        }
                    }
                })()
            )
        },
    },
    {
        title: 'Thời gian',
        dataIndex: 'dateCreate',
        width: '30%',
        render: (dateCreate) => {
            return (
                <p>{ParseDateTime(dateCreate)}</p>
            )
        }
    },
    {
        title: 'Trạng thái',
        width: '20%',
        render: (record) => {
            return (
                (() => {
                    var transactionInternalTypeId = record.transactionInternalTypeId
                    var transactionCoinTypeId = record.transactionCoinTypeId
                    if (transactionInternalTypeId !== null) {
                        if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                            return (
                                <Tooltip title={<>{formatStringToCurrencyVND(record.paymentAmount)} đ</>} color="#3b7be2" >
                                    <Tag color="#3b7be2">
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} /> Thanh toán
                                    </Tag>
                                </Tooltip>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                            return (
                                <Tooltip title={<>{formatStringToCurrencyVND(record.paymentAmount)} đ</>} color="#cf1322" >
                                    <Tag color="#cf1322">
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} /> Trả tiền hàng
                                    </Tag>
                                </Tooltip>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                            return (
                                <Tooltip title={<>{formatStringToCurrencyVND(record.paymentAmount)} đ</>} color="#8c66c8" >
                                    <Tag color="#8c66c8">
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} /> Hoàn tiền
                                    </Tag>
                                </Tooltip>
                            )
                        } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                            return (
                                <Tooltip title={<>{formatStringToCurrencyVND(record.paymentAmount)} đ</>} color="#4ea927" >
                                    <Tag color="#4ea927">
                                        <FontAwesomeIcon icon={faMoneyBill1Wave} /> Lợi nhuận
                                    </Tag>
                                </Tooltip>
                            )
                        }
                    }
                    if (transactionCoinTypeId !== null) {
                        if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                            return (
                                <Tooltip title={<>{record.amount} xu</>} color="#108ee9" >
                                    <Tag color="#108ee9">
                                        <FontAwesomeIcon icon={faCoins} /> Nhận xu
                                    </Tag>
                                </Tooltip>
                            )
                        } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                            return (
                                <Tooltip title={<>{record.amount} xu</>} color="red" >
                                    <Tag color="red">
                                        <FontAwesomeIcon icon={faCoins} /> Sử dụng xu
                                    </Tag>
                                </Tooltip>
                            )
                        } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                            return (
                                <Tooltip title={<>{record.amount} xu</>} color="volcano" >
                                    <Tag color="volcano">
                                        <FontAwesomeIcon icon={faCoins} /> Hoàn xu
                                    </Tag>
                                </Tooltip>
                            )
                        }
                    }
                })()
            )
        },
    },
];

function OrderDetail() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})
    var [dataTable, setDataTable] = useState([]);


    useEffect(() => {
        getOrder(id)
            .then((res) => {
                setOrder(res.data.result)
                var data = [...res.data.result.transactionInternals, ...res.data.result.transactionCoins]
                setDataTable([...arrangeDateHistoryTransaction(data)])
                setLoading(false)
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const arrangeDateHistoryTransaction = (data) => {
        data.sort(function (record1, record2) {
            var dateRecord1 = dayjs(record1.dateCreate)
            var dateRecord2 = dayjs(record2.dateCreate)
            if (dateRecord1 > dateRecord2) return 1;
            else if (dateRecord1 < dateRecord2) return -1;
            else return 0;
        });
        for (let index = 0; index < data.length; index++) {
            data[index].index = index + 1
        }
        return data
    }

    const getOrderDetail = () => {
        getOrder(id)
            .then((res) => {
                setOrder(res.data.result)
                setLoading(false)
            })
            .catch((err) => {

            })
    }

    return (
        <>
            <Spinning spinning={loading}>
                {!loading ?
                    <Card
                        title={`Đơn hàng #${order.orderId}`}
                        hoverable
                        style={{ backgroundColor: "#f4f7fe" }}
                    >
                        <Card
                            title={<><FontAwesomeIcon icon={faBasketShopping} /> Thông tin đơn hàng </>}
                        >
                            <DescriptionsTableOrderInfo order={order} callBack={getOrderDetail} />
                        </Card>

                        <Divider />

                        <Card
                            title={<><FontAwesomeIcon icon={faMoneyBillTransfer} /> Lịch sử giao dịch </>}
                        >
                            <Table columns={columnsHistoryTransaction} pagination={{ pageSize: 10 }}
                                dataSource={dataTable} size='small' scroll={{ y: 290 }}
                            />
                        </Card>

                        <Divider />

                        {!loading ? <CardOrderItem order={order} /> : ""}

                        <Row style={{ marginTop: '10px' }}>
                            <Col offset={2} span={20}>
                                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
                                    <BackPreviousPage url={-1} />
                                </Space>
                            </Col>
                        </Row>


                    </Card>

                    : <></>}
            </Spinning>
        </>
    );
}

export default OrderDetail;
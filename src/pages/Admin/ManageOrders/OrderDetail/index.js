
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Space, Divider } from 'antd';

import Spinning from '~/components/Spinning';
import { getOrder } from '~/api/order'

import BackPreviousPage from '~/components/BackPreviousPage';
import OrderItemProducts from '~/components/OrderDetail/OrderItemProducts';
import HistoryOrderStatus from '~/components/OrderDetail/HistoryOrderStatus';
import OrderDetailInfo from '~/components/OrderDetail/OrderDetailInfo';
import HistoryOrderTransaction from '~/components/OrderDetail/HistoryOrderTransaction';

function OrderDetail() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true)
    const [order, setOrder] = useState({})

    useEffect(() => {
        getOrder(id)
            .then((res) => {
                setOrder(res.data.result)
                setLoading(false)
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getOrderDetail = () => {
        getOrder(id)
            .then((res) => {
                setOrder(res.data.result)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
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
                        <OrderDetailInfo order={order} callBack={getOrderDetail} />

                        <Divider />

                        <HistoryOrderStatus order={order} />

                        <Divider />

                        <HistoryOrderTransaction order={order} />

                        <Divider />

                        <OrderItemProducts order={order} />

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
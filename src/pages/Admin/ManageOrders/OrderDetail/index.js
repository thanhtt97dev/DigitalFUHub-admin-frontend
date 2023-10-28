
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Tag, Rate, Space, Button, Descriptions, Divider } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons'
import {
    faBasketShopping
} from '@fortawesome/free-solid-svg-icons'

import Spinning from '~/components/Spinning';
import NotificationContext from '~/context/NotificationContext';
import CarouselProduct from '~/components/Carousels/CarouselCustom'
import DescriptionsTableOrderInfo from '~/components/DescriptionsTable/DescriptionsTableOrderInfo'


import { getOrder } from '~/api/order'
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_SELLER_REFUNDED,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES
} from '~/constants'
import { ParseDateTime, formatStringToCurrencyVND } from '~/utils/index'

import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
import ModalChangeOrderStatus from '~/components/Modals/ModalChangeOrderStatus';
import BackPreviousPage from '~/components/BackPreviousPage';
import ModalShowOrderCoupons from '~/components/Modals/ModalShowOrderCoupons';
import CardOrderItem from '~/components/Card/CardOrderItem';
import CalendarTransactionInternal from '~/components/Calendar/CalendarTransactionInternal';
const cx = classNames.bind(styles);

function OrderDetail() {
    const { id } = useParams();
    const notification = useContext(NotificationContext);


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
                            title={<><FontAwesomeIcon icon={faBasketShopping} /> Thông tin đơn hàng </>}
                        >
                            <CalendarTransactionInternal transactionInternals={order.transactionInternals} transactionCoins={order.transactionCoins} />
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
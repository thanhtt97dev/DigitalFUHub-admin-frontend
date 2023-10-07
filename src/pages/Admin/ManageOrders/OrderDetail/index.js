
import React, { useContext, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Card, Col, Divider, Row, Tag, Rate, Space, Button } from 'antd';

import Spinning from '~/components/Spinning';
import NotificationContext from '~/context/NotificationContext';
import CarouselProduct from '~/components/Carousels/CarouselCustom'

import { getOrder } from '~/api/admin'
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
const cx = classNames.bind(styles);

function OrderDetail() {
    const { id } = useParams();
    const notification = useContext(NotificationContext);

    const [loading, setLoading] = useState(false)

    const [order, setOrder] = useState({})
    const [productMedias, setProductMedias] = useState([])
    const [orderCoupons, setOrderCoupons] = useState([])


    useLayoutEffect(() => {
        setLoading(true)
        getOrder(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result)
                    setProductMedias(res.data.result.productMedias)
                    setOrderCoupons(res.data.result.orderCoupons)
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch(() => {
                //notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getOrderDetail = () => {
        setLoading(true)
        getOrder(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setOrder(res.data.result)
                    setProductMedias(res.data.result.productMedias)
                    setOrderCoupons(res.data.result.orderCoupons)
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch(() => {
                //notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }


    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    title="Chi tiết đơn hàng"
                    hoverable
                    style={{ backgroundColor: "#f4f7fe" }}
                >

                    <Row>
                        <Col offset={2} span={6}>
                            <CarouselProduct data={productMedias} />
                        </Col>
                        <Col offset={1} span={13} >
                            <Card
                                style={{
                                    width: '100%',
                                }}
                                hoverable
                                title="Thông tin đơn hàng"
                            >
                                <Row>
                                    <Col offset={1} span={6}>
                                        Mã hóa đơn:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.orderId}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Khách hàng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/user/$${order.customerId}`}>{order.customerEmail}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Cửa hàng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/shop/$${order.shopId}`}>{order.shopName}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Thời gian
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {ParseDateTime(order.orderDate)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Sản phẩm:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/product/$${order.productId}`}>{order.productName}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Loại:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.productVariantName}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Giá:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {formatStringToCurrencyVND(order.price)} VND
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Giảm giá:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.discount} %
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Số lượng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.quantity}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Phí dịch vụ
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.businessFeeValue} %
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Đánh giá:
                                    </Col>
                                    {(() => {
                                        if (order.feedbackId !== null) {
                                            return (
                                                <Col offset={1} span={14}>
                                                    <span style={{ marginRight: "10px" }}>
                                                        <Rate disabled value={order.feedbackRate} />
                                                    </span>
                                                    <Link> Chi tiết</Link>
                                                </Col>
                                            )
                                        } else {
                                            return (
                                                <Col offset={1} span={14}>
                                                    Chưa có đánh giá
                                                </Col>
                                            )
                                        }
                                    })()}
                                </Row>
                                <Row>
                                    <Col offset={1} span={6}>
                                        Voucher từ Shop:
                                    </Col>
                                    <Col offset={1} span={14}>

                                        {orderCoupons.length === 0 ?
                                            <span>0 VND</span>
                                            :
                                            <>
                                                {orderCoupons.reduce((total, currentValue) => total + currentValue.priceDiscount, 0)} VND
                                                <Link style={{ marginLeft: "10px" }} >Xem chi tiết</Link>
                                            </>
                                        }
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '10px' }}>
                        <Col offset={2} span={20}>
                            <Card
                                hoverable
                            >
                                <Divider />
                                <Row>
                                    <Col offset={1} span={8}>
                                        <b>Tổng tiền:</b>
                                    </Col>
                                    <Col offset={0} span={14}>
                                        <Row>
                                            <Col offset={1} span={5}>
                                                Tổng tiền hàng
                                            </Col>
                                            <Col offset={1} span={14}>
                                                {formatStringToCurrencyVND(order.price * order.quantity)} VND
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col offset={1} span={5}>
                                                Giảm giá
                                            </Col>
                                            <Col offset={1} span={14}>
                                                - {formatStringToCurrencyVND(order.discount * order.price * order.quantity / 100)} VND
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col offset={1} span={5}>
                                                Voucher từ Shop
                                            </Col>
                                            <Col offset={1} span={14}>
                                                {orderCoupons.length === 0 ?
                                                    <span>0 VND</span>
                                                    :
                                                    <>
                                                        - {formatStringToCurrencyVND(orderCoupons.reduce((total, currentValue) => total + currentValue.priceDiscount, 0))} VND
                                                    </>
                                                }

                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={14}>
                                                <hr />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col offset={1} span={5}>
                                                Thành tiền
                                            </Col>
                                            <Col offset={1} span={14}>
                                                <span style={{ color: 'red', fontSize: "20px" }}>{formatStringToCurrencyVND(order.totalAmount)} VND</span>
                                            </Col>
                                        </Row>

                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col offset={1} span={8}>
                                        <h3>Lợi nhuận:</h3>
                                    </Col>
                                    <Col offset={0} span={14}>
                                        <Row>
                                            <Col offset={1} span={5}>
                                                Tổng tiền
                                            </Col>
                                            <Col offset={1} span={14}>
                                                {formatStringToCurrencyVND(order.totalAmount)} VND
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col offset={1} span={5}>
                                                Phí dịch vụ
                                            </Col>
                                            <Col offset={1} span={14}>
                                                - {formatStringToCurrencyVND(order.totalAmount * order.businessFeeValue / 100)} VND
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={14}>
                                                <hr />
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col offset={1} span={5}>
                                                Thành tiền
                                            </Col>
                                            <Col offset={1} span={14}>
                                                <span style={{ color: 'green', fontSize: "20px" }}>{formatStringToCurrencyVND(order.totalAmount * (100 - order.businessFeeValue) / 100)} VND</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Divider />
                                <Row>
                                    <Col offset={1} span={8}>
                                        <b>Trạng thái đơn hàng:</b>
                                    </Col>
                                    <Col offset={0} span={14}>
                                        {(() => {
                                            if (order.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                                                return <Tag color="#108ee9" className={cx('tag')}>Chờ xác nhận</Tag>
                                            } else if (order.orderStatusId === ORDER_CONFIRMED) {
                                                return <Tag color="#87d068" className={cx('tag')}>Đã xác nhận</Tag>
                                            } else if (order.orderStatusId === ORDER_COMPLAINT) {
                                                return <Tag color="#c6e329" className={cx('tag')}>Khiếu nại</Tag>
                                            } else if (order.orderStatusId === ORDER_SELLER_REFUNDED) {
                                                return <Tag color="#eab0b0e0" className={cx('tag')}>Người bán hoàn tiền</Tag>
                                            } else if (order.orderStatusId === ORDER_DISPUTE) {
                                                return (
                                                    <Space direction='vertical'>
                                                        <Space>
                                                            <Tag color="#ffaa01" className={cx('tag')}>Tranh chấp</Tag>
                                                            <Button >Nhắn tin</Button>
                                                        </Space>
                                                        <Space>
                                                            <ModalChangeOrderStatus orderId={order.orderId} callBack={getOrderDetail} />

                                                        </Space>
                                                    </Space>
                                                )
                                            } else {
                                                return (
                                                    <Space direction='vertical'>
                                                        <Space>
                                                            {(() => {
                                                                if (order.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                                                    return <Tag color="#ca01ff" className={cx('tag')}>Từ chối khiếu nại</Tag>
                                                                } else if (order.orderStatusId === ORDER_SELLER_VIOLATES) {
                                                                    return <Tag color="#f50" className={cx('tag')}>Người bán vi phạm</Tag>
                                                                }
                                                            })()}
                                                            <Button >Nhắn tin</Button>
                                                        </Space>

                                                        <Row>
                                                            <Col >Nguyên nhân:</Col>
                                                            <Col offset={1} >
                                                                <span style={{ wordWrap: "break-word" }}>{order.note}</span>
                                                            </Col>
                                                        </Row>
                                                    </Space>
                                                )
                                            }
                                        })()}
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>

                </Card>

            </Spinning>
        </>
    );
}

export default OrderDetail;
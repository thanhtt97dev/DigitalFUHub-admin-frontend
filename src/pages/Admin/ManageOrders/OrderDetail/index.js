
import React, { useContext, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Card, Col, Divider, Row, Tag, Rate } from 'antd';

import Spinning from '~/components/Spinning';
import NotificationContext from '~/context/NotificationContext';
import CarouselProduct from '~/components/Carousels/CarouselCustom'

import { getOrder } from '~/api/admin'
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES
} from '~/constants'
import { ParseDateTime, formatStringToCurrencyVND } from '~/utils/index'

import classNames from 'classnames/bind';
import styles from './OrderDetail.module.scss';
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
                                    <Col offset={1} span={8}>
                                        Mã hóa đơn:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.orderId}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Khách hàng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/user/$${order.customerId}`}>{order.customerEmail}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Cửa hàng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/shop/$${order.shopId}`}>{order.shopName}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Thời gian
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {ParseDateTime(order.orderDate)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Sản phẩm:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        <Link to={`/admin/product/$${order.productId}`}>{order.productName}</Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Loại:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.productVariantName}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Giá:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {formatStringToCurrencyVND(order.price)} VND
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Giảm giá:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.discount} %
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Số lượng:
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.quantity}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
                                        Phí dịch vụ
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {order.businessFeeValue} %
                                    </Col>
                                </Row>
                                <Row>
                                    <Col offset={1} span={8}>
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
                                    <Col offset={1} span={8}>
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
                                        <h3>Trạng thái đơn hàng:</h3>
                                    </Col>
                                    <Col offset={1} span={14}>
                                        {(() => {
                                            if (order.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                                                return <Tag className={cx("order-status-tag")} color="#108ee9">Chờ xác nhận</Tag>
                                            } else if (order.orderStatusId === ORDER_CONFIRMED) {
                                                return <Tag className={cx("order-status-tag")} color="#87d068">Đã xác nhận</Tag>
                                            } else if (order.orderStatusId === ORDER_COMPLAINT) {
                                                return <Tag className={cx("order-status-tag")} color="#c6e329">Khiếu nại</Tag>
                                            } else if (order.orderStatusId === ORDER_DISPUTE) {
                                                return <Tag className={cx("order-status-tag")} color="#ffaa01">Tranh chấp</Tag>
                                            } else if (order.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                                return <Tag className={cx("order-status-tag")} color="#ca01ff">Từ chối khiếu nại</Tag>
                                            } else if (order.orderStatusId === ORDER_SELLER_VIOLATES) {
                                                return <Tag className={cx("order-status-tag")} color="#f50">Người bán vi phạm</Tag>
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
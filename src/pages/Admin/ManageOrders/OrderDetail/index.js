
import React, { useContext, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Tag, Rate, Space, Button, Descriptions } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons'

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
import BackPreviousPage from '~/components/BackPreviousPage';
const cx = classNames.bind(styles);

function OrderDetail() {
    const { id } = useParams();
    const notification = useContext(NotificationContext);

    const [loading, setLoading] = useState(false)

    const [productMedias, setProductMedias] = useState([])
    const [itemDescriptionOrderInfo, settemDescriptionOrderInfo] = useState({})
    const [itemDescriptionOrderPayment, settemDescriptionOrderPayment] = useState({})


    useLayoutEffect(() => {
        getOrderDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getOrderDetail = () => {
        setLoading(true)
        getOrder(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProductMedias(res.data.result.productMedias)
                    const data = res.data.result;
                    settemDescriptionOrderInfo([
                        {
                            label: 'Mã đơn hàng',
                            children: data.orderId
                        },
                        {
                            label: 'Khách hàng',
                            children: <Link to={`/admin/user/$${data.customerId}`}>{data.customerEmail}</Link>
                        },
                        {
                            label: 'Cửa hàng',
                            children: <Link to={`/admin/shop/$${data.shopId}`}>{data.shopName}</Link>
                        },
                        {
                            label: 'Thời gian',
                            children: ParseDateTime(data.orderDate)
                        },
                        {
                            label: 'Sản phẩm',
                            children: <Link to={`/admin/product/$${data.productId}`}>{data.productName}</Link>
                        },
                        {
                            label: 'Loại',
                            children: data.productVariantName
                        },
                        {
                            label: 'Giá',
                            children: <span>{formatStringToCurrencyVND(data.price)} VND</span>
                        },
                        {
                            label: 'Giảm giá',
                            children: <span>{data.discount} %</span>
                        },
                        {
                            label: 'Số lượng',
                            children: data.quantity
                        },
                        {
                            label: 'Phí dịch vụ',
                            children: <span>{data.businessFeeValue} %</span>
                        },
                        {
                            label: 'Đánh giá',
                            children:
                                <>
                                    {(() => {
                                        if (data.feedbackId !== null) {
                                            return (
                                                <>
                                                    <span style={{ marginRight: "10px" }}>
                                                        <Rate disabled value={data.feedbackRate} />
                                                    </span>
                                                    <Link> Chi tiết</Link>
                                                </>
                                            )
                                        } else {
                                            return <span>Chưa có đánh giá</span>
                                        }
                                    })()}
                                </>
                        },
                        {
                            label: 'Voucher từ Shop',
                            children:
                                <>
                                    {data.totalCouponDiscount === 0 ?
                                        <span>0 VND</span>
                                        :
                                        <>
                                            {data.totalCouponDiscount} VND
                                            <Link style={{ marginLeft: "10px" }} >Xem chi tiết</Link>
                                        </>
                                    }
                                </>
                        },

                    ])

                    settemDescriptionOrderPayment([

                        {
                            label: <b>Tổng tiền</b>,
                            children:
                                <>
                                    <Row>
                                        <Col offset={1} span={5}>
                                            Tổng tiền hàng
                                        </Col>
                                        <Col offset={2} span={12}>
                                            {formatStringToCurrencyVND(data.price * data.quantity)} VND
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col offset={1} span={5}>
                                            Giảm giá
                                        </Col>
                                        <Col offset={2} span={12}>
                                            - {formatStringToCurrencyVND(Math.round(data.discount * data.price * data.quantity / 100))} VND
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col offset={1} span={5}>
                                            Voucher từ Shop
                                        </Col>
                                        <Col offset={2} span={12}>
                                            {data.totalCouponDiscount === 0 ?
                                                <span>0 VND</span>
                                                :
                                                <>
                                                    - {formatStringToCurrencyVND(data.totalCouponDiscount)} VND
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
                                        <Col offset={2} span={12}>
                                            <span style={{ color: 'red', fontSize: "20px" }}>{formatStringToCurrencyVND(data.totalAmount)} VND</span>
                                        </Col>
                                    </Row>
                                </>
                        },
                        {
                            label: <b>Phí dịch vụ</b>,
                            children:
                                <>
                                    <Row>
                                        <Col offset={1} span={5}>
                                            Thành tiền
                                        </Col>
                                        <Col offset={2} span={12}>
                                            <span style={{ color: 'orange', fontSize: "20px" }}>
                                                - {formatStringToCurrencyVND(Math.round(data.totalAmount * data.businessFeeValue / 100))} VND
                                            </span>
                                        </Col>
                                    </Row>
                                </>
                        },
                        {
                            label: <b>Lợi nhuận</b>,
                            children:
                                <>
                                    <Row>
                                        <Col offset={1} span={5}>
                                            Thành tiền
                                        </Col>
                                        <Col offset={2} span={12}>
                                            <span style={{ color: 'green', fontSize: "20px" }}>{formatStringToCurrencyVND(Math.round(data.totalAmount * (100 - data.businessFeeValue) / 100))} VND</span>
                                        </Col>
                                    </Row>
                                </>
                        },
                        {
                            label: <b>Trạng thái đơn hàng</b>,
                            children:
                                <>
                                    {(() => {
                                        if (data.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                                            return <Tag color="#108ee9" className={cx('tag')}>Chờ xác nhận</Tag>
                                        } else if (data.orderStatusId === ORDER_CONFIRMED) {
                                            return <Tag color="#87d068" className={cx('tag')}>Đã xác nhận</Tag>
                                        } else if (data.orderStatusId === ORDER_COMPLAINT) {
                                            return <Tag color="#c6e329" className={cx('tag')}>Khiếu nại</Tag>
                                        } else if (data.orderStatusId === ORDER_SELLER_REFUNDED) {
                                            return <Tag color="#eab0b0e0" className={cx('tag')}>Người bán hoàn tiền</Tag>
                                        } else if (data.orderStatusId === ORDER_DISPUTE) {
                                            return (
                                                <Space direction='vertical'>
                                                    <Space>
                                                        <Tag color="#ffaa01" className={cx('tag')}>Tranh chấp</Tag>
                                                        <Button >Nhắn tin</Button>
                                                    </Space>
                                                    <Space>
                                                        <ModalChangeOrderStatus orderId={data.orderId} callBack={getOrderDetail} />

                                                    </Space>
                                                </Space>
                                            )
                                        } else {
                                            return (
                                                <Space direction='vertical'>
                                                    <Space>
                                                        {(() => {
                                                            if (data.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                                                return <Tag color="#ca01ff" className={cx('tag')}>Từ chối khiếu nại</Tag>
                                                            } else if (data.orderStatusId === ORDER_SELLER_VIOLATES) {
                                                                return <Tag color="#f50" className={cx('tag')}>Người bán vi phạm</Tag>
                                                            }
                                                        })()}
                                                        <Button type='primary'>
                                                            <FontAwesomeIcon icon={faComments} />
                                                            <span style={{ marginLeft: "10px" }}>Liên hệ với người mua và người bán</span>
                                                        </Button>
                                                    </Space>

                                                    <Row>
                                                        <Col >Nguyên nhân:</Col>
                                                        <Col offset={1} >
                                                            <span style={{ wordWrap: "break-word" }}>{data.note}</span>
                                                        </Col>
                                                    </Row>
                                                </Space>
                                            )
                                        }
                                    })()}
                                </>
                        },
                    ])
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
                                <Descriptions
                                    bordered
                                    column={{
                                        xs: 1,
                                        sm: 1,
                                        md: 1,
                                        lg: 1,
                                        xl: 1,
                                        xxl: 1,
                                    }}
                                    items={itemDescriptionOrderInfo}
                                    size='small'
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '10px' }}>
                        <Col offset={2} span={20}>
                            <Card
                                hoverable
                            >
                                <Descriptions
                                    bordered
                                    column={{
                                        xs: 1,
                                        sm: 1,
                                        md: 1,
                                        lg: 1,
                                        xl: 1,
                                        xxl: 1,
                                    }}
                                    items={itemDescriptionOrderPayment}
                                    size='small'
                                />

                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col offset={2} span={20}>
                            <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
                                <BackPreviousPage url={-1} />
                            </Space>
                        </Col>
                    </Row>


                </Card>


            </Spinning>
        </>
    );
}

export default OrderDetail;
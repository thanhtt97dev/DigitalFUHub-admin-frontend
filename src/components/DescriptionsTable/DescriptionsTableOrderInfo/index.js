import React, { useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Descriptions, Space, Typography, Tag, Button, Avatar, Row, Col } from 'antd';
import { MessageOutlined } from '@ant-design/icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-regular-svg-icons'

import ModalChangeOrderStatus from '~/components/Modals/ModalChangeOrderStatus'

import { getConversation } from '~/api/chat'
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_SELLER_REFUNDED,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES,
    ADMIN_USER_ID
} from '~/constants'

const { Text, Title } = Typography;

function DescriptionsTableOrderInfo({ order, callBack }) {

    const navigate = useNavigate()

    const handleOpenChatGroup = (shopId, customerId) => {
        var data = { shopId, userId: customerId, isGroup: true }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }

    const handleOpenChatWithUser = (userId) => {
        var data = { shopId: ADMIN_USER_ID, userId: userId }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }

    const items = [
        {
            key: '1',
            label: 'Mã đơn hàng',
            children: order.orderId,
            span: 3
        },
        {
            key: '2',
            label: 'Người mua',
            children:
                <Space>
                    <Link to={''}><Avatar src={order.customerAvatar} /> {order.customerEmail}</Link>
                    <Button
                        type="default"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => handleOpenChatWithUser(order.customerId)}
                    >
                        Nhắn tin
                    </Button>
                </Space>,
            span: 3
        },
        {
            key: '3',
            label: 'Tên cửa hàng',
            children:
                <Space>
                    <Link to={''}><Avatar src={order.customerAvatar} /> {order.shopName}</Link>
                    <Button
                        type="default"
                        size="small"
                        icon={<MessageOutlined />}
                        onClick={() => handleOpenChatWithUser(order.shopId)}
                    >
                        Nhắn tin
                    </Button>
                </Space>
            ,
            span: 3
        },
        {
            key: '4',
            label: 'Thời gian mua',
            children: <>{ParseDateTime(order.orderDate)}</>,
            span: 3
        },
        {
            key: '5',
            label: 'Tổng giá trị đơn hàng',
            children: <>{formatStringToCurrencyVND(order.totalAmount)} đ</>,
            span: 3
        },
        {
            key: '6',
            label: 'Mã giảm giá đã áp dụng',
            children:
                <>
                    {order.totalCouponDiscount === 0 ?
                        "Không sử dụng"
                        :
                        <>{formatStringToCurrencyVND(order.totalCouponDiscount)} đ <Button type='link'>Chi tiết</Button></>
                    }
                </>,
            span: 3
        },
        {
            key: '7',
            label: 'Số xu đã sử dụng',
            children: <>{order.totalCoinDiscount} xu</>,
            span: 3
        },
        {
            key: '8',
            label: <b>Phí dịch vụ</b>,
            children: <>{formatStringToCurrencyVND(order.businessFeeValue * order.totalAmount / 100)} đ</>,
            span: 3
        },
        {
            key: '9',
            label: <b>Số tiền người mua thanh toán</b>,
            children: <>{formatStringToCurrencyVND(order.totalPayment)} đ</>,
            span: 3
        },
        {
            key: '10',
            label: <b>Số tiền người bán nhận</b>,
            children: <>{formatStringToCurrencyVND(order.totalAmount - order.totalCouponDiscount - order.businessFeeValue * order.totalAmount / 100)} đ</>,
            span: 3
        },
        {
            key: '11',
            label: <h3>Trạng thái đơn hàng</h3>,
            children: <>
                {(() => {
                    if (order.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                        return <Tag color="#108ee9">Chờ xác nhận</Tag>
                    } else if (order.orderStatusId === ORDER_CONFIRMED) {
                        return <Tag color="#87d068">Đã xác nhận</Tag>
                    } else if (order.orderStatusId === ORDER_COMPLAINT) {
                        return <Tag color="#c6e329">Khiếu nại</Tag>
                    } else if (order.orderStatusId === ORDER_SELLER_REFUNDED) {
                        return <Tag color="#eab0b0e0">Người bán hoàn tiền</Tag>
                    } else if (order.orderStatusId === ORDER_DISPUTE) {
                        return (
                            <Space direction='vertical'>
                                <Space>
                                    <Tag color="#ffaa01">Tranh chấp</Tag>
                                    <Button
                                        icon={<FontAwesomeIcon icon={faComments} />}
                                        onClick={() => handleOpenChatGroup(order.shopId, order.customerId)}
                                    >
                                        Liên hệ với người mua và người bán
                                    </Button>
                                    <ModalChangeOrderStatus orderId={order.orderId} callBack={callBack} />
                                </Space>
                            </Space>
                        )
                    } else {
                        return (
                            <Space direction='vertical'>
                                <Space>
                                    {(() => {
                                        if (order.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                            return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
                                        } else if (order.orderStatusId === ORDER_SELLER_VIOLATES) {
                                            return <Tag color="#f50">Người bán vi phạm</Tag>
                                        }
                                    })()}
                                    <Button
                                        icon={<FontAwesomeIcon icon={faComments} />}
                                        onClick={() => handleOpenChatGroup(order.shopId, order.customerId)}
                                    >
                                        Liên hệ với người mua và người bán
                                    </Button>
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
            </>,
            span: 3
        },

    ];
    return (
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    );
}

export default DescriptionsTableOrderInfo;
import React from 'react';
import { Descriptions, Space, Typography, Rate, Button, Avatar } from 'antd';

import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import { Link } from 'react-router-dom';


const { Text, Title } = Typography;

function DescriptionsTableOrderInfo({ order }) {
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
            children: <Link to={''}><Avatar src={order.customerAvatar} /> {order.customerEmail}</Link>,
            span: 3
        },
        {
            key: '3',
            label: 'Tên cửa hàng',
            children: <Link to={''}><Avatar src={order.customerAvatar} /> {order.shopName}</Link>,
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
            children: <>{order.totalCouponDiscount} xu</>,
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
            children: <></>,
            span: 3
        },

    ];
    return (
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    );
}

export default DescriptionsTableOrderInfo;